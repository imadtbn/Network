class SimulationEngine {
    constructor() {
        this.intervalId = null;
        this.isRunning = false;

        // Initialize state with default or mock data
        this.initData();
    }

    async initData() {
        try {
            // Check if we have saved custom devices, else load mock
            let devices = storage.get('devices');
            if (!devices) {
                const res = await fetch('data/devices.json');
                if (res.ok) {
                    devices = await res.json();
                } else {
                    devices = [];
                }
            }
            appState.replace('devices', devices);

            let network = storage.get('network');
            if (!network) {
                const netRes = await fetch('data/network.json');
                if (netRes.ok) {
                    network = await netRes.json();
                } else {
                    network = appState.get('network');
                }
            }
            appState.replace('network', network);

            this.start();
        } catch (e) {
            console.error("Failed to load initial mock data", e);
            this.start(); // Start anyway with default state
        }
    }

    start() {
        if (this.isRunning) return;

        const settings = appState.get('settings');
        if (!settings.simulationMode) return;

        this.isRunning = true;
        this.intervalId = setInterval(() => this.tick(), settings.updateInterval);
    }

    stop() {
        if (!this.isRunning) return;
        clearInterval(this.intervalId);
        this.isRunning = false;
    }

    tick() {
        this.simulateNetworkTraffic();
        this.simulateDevicesActivity();
    }

    simulateNetworkTraffic() {
        const net = appState.get('network');

        // Gradually change speed
        const jitterDownload = (Math.random() - 0.5) * 5; // -2.5 to +2.5
        const jitterUpload = (Math.random() - 0.5) * 2;
        const jitterPing = (Math.random() - 0.5) * 4;

        let newDownload = Math.max(0, net.downloadSpeed + jitterDownload);
        let newUpload = Math.max(0, net.uploadSpeed + jitterUpload);
        let newPing = Math.max(10, net.ping + jitterPing);

        // Cap speeds
        if (newDownload > 100) newDownload -= 5;
        if (newUpload > 30) newUpload -= 2;

        appState.update('network', {
            downloadSpeed: newDownload,
            uploadSpeed: newUpload,
            ping: newPing,
            uptime: net.uptime + 1
        });

        // Update history for chart
        const history = appState.get('history');
        const now = new Date().getTime();
        history.traffic.push({ time: now, download: newDownload, upload: newUpload });

        // Keep only last 60 items
        if (history.traffic.length > 60) {
            history.traffic.shift();
        }
        appState.replace('history', history);
    }

    simulateDevicesActivity() {
        let devices = [...appState.get('devices')];
        let changed = false;

        devices = devices.map(device => {
            if (device.status === 'online') {
                changed = true;

                // Fluctuating speeds for device
                const dlJitter = (Math.random() - 0.3) * 2; // slightly biased to decrease
                const ulJitter = (Math.random() - 0.3) * 0.5;

                device.download = Math.max(0, device.download + dlJitter);
                device.upload = Math.max(0, device.upload + ulJitter);

                if (device.download > 50) device.download = 20;

                // Add to consumed
                device.totalConsumed += (device.download + device.upload) * 1024 * 1024 / 8; // approx bytes

                // Fluctuate signal if wifi
                if (device.connection === 'wifi' && device.signal) {
                    device.signal += Math.floor((Math.random() - 0.5) * 3);
                    if (device.signal > -30) device.signal = -30;
                    if (device.signal < -90) device.signal = -90;
                }

                // Randomly disconnect
                if (Math.random() < 0.01) {
                    device.status = 'offline';
                    device.download = 0;
                    device.upload = 0;
                    this.createAlert(`انقطع الاتصال بالجهاز: ${device.name}`);
                }
            } else {
                // Randomly reconnect
                if (Math.random() < 0.02) {
                    device.status = 'online';
                    changed = true;
                    this.createAlert(`اتصل جهاز بالشبكة: ${device.name}`);
                }
            }
            return device;
        });

        if (changed) {
            appState.replace('devices', devices);
        }
    }

    createAlert(message) {
        const alerts = appState.get('alerts');
        alerts.unshift({
            id: utils.generateId(),
            time: new Date().toISOString(),
            message: message,
            read: false
        });

        if (alerts.length > 50) alerts.pop();
        appState.replace('alerts', alerts);
    }
}

// Instantiate and start simulation
window.simulationEngine = new SimulationEngine();
