class StateManager {
    constructor() {
        this.listeners = {};
        this.state = {
            network: {
                status: 'online',
                ssid: 'Home_Network_5G',
                type: 'Wi-Fi',
                localIp: '192.168.1.100',
                gateway: '192.168.1.1',
                uptime: 3600 * 24 * 5, // 5 days
                downloadSpeed: 0,
                uploadSpeed: 0,
                ping: 0,
                totalDownloaded: 1024 * 1024 * 1024 * 45, // 45 GB
                totalUploaded: 1024 * 1024 * 1024 * 12 // 12 GB
            },
            devices: [],
            alerts: [],
            settings: storage.get('settings', {
                updateInterval: 1000,
                simulationMode: true,
                maxDevices: 12
            }),
            history: {
                traffic: [] // Store last 60 seconds of traffic
            }
        };
    }

    subscribe(key, callback) {
        if (!this.listeners[key]) {
            this.listeners[key] = [];
        }
        this.listeners[key].push(callback);
    }

    update(key, value) {
        this.state[key] = { ...this.state[key], ...value };
        this.notify(key);
    }

    replace(key, value) {
        this.state[key] = value;
        this.notify(key);
    }

    notify(key) {
        if (this.listeners[key]) {
            this.listeners[key].forEach(callback => callback(this.state[key]));
        }
    }

    get(key) {
        return this.state[key];
    }
}

window.appState = new StateManager();
