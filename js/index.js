document.addEventListener('DOMContentLoaded', () => {

    let trafficChart;

    // Initialize Chart if element exists
    if (document.getElementById('liveTrafficChart')) {
        trafficChart = new LiveTrafficChart('liveTrafficChart');
    }

    // Subscribe to Network State
    appState.subscribe('network', (net) => {
        updateNetworkUI(net);
    });

    // Subscribe to Devices State
    appState.subscribe('devices', (devices) => {
        updateDevicesUI(devices);
    });

    // Subscribe to History for Chart
    appState.subscribe('history', (history) => {
        if (trafficChart) {
            trafficChart.updateData(history.traffic);
        }
    });

    // Initial manual trigger for UI since data might be loaded before this script runs
    if (appState.get('network')) updateNetworkUI(appState.get('network'));
    if (appState.get('devices')) updateDevicesUI(appState.get('devices'));


    function updateNetworkUI(net) {
        // Status Card
        const statusText = document.getElementById('net-status-text');
        const pulseDot = document.querySelector('.pulse-dot');
        if (statusText) {
            if (net.status === 'online') {
                statusText.textContent = 'متصلة';
                if(pulseDot) {
                    pulseDot.style.backgroundColor = '#4ade80';
                    pulseDot.style.boxShadow = '0 0 0 0 rgba(74, 222, 128, 0.7)';
                    pulseDot.style.animation = 'pulse 2s infinite';
                }
            } else {
                statusText.textContent = 'غير متصلة';
                if(pulseDot) {
                    pulseDot.style.backgroundColor = '#ea4335';
                    pulseDot.style.animation = 'none';
                    pulseDot.style.boxShadow = 'none';
                }
            }
        }

        const ssidEl = document.getElementById('net-ssid');
        if (ssidEl) ssidEl.textContent = net.ssid;

        const typeEl = document.getElementById('net-type');
        if (typeEl) typeEl.textContent = net.type;

        const ipEl = document.getElementById('net-ip');
        if (ipEl) ipEl.textContent = net.localIp;

        const gwEl = document.getElementById('net-gateway');
        if (gwEl) gwEl.textContent = net.gateway;

        const uptimeEl = document.getElementById('net-uptime');
        if (uptimeEl) {
            const days = Math.floor(net.uptime / 86400);
            const hours = Math.floor((net.uptime % 86400) / 3600);
            uptimeEl.textContent = `${days} أيام, ${hours} ساعات`;
        }

        // Stats
        const dlEl = document.getElementById('stat-download');
        if (dlEl) dlEl.textContent = utils.formatSpeed(net.downloadSpeed);

        const ulEl = document.getElementById('stat-upload');
        if (ulEl) ulEl.textContent = utils.formatSpeed(net.uploadSpeed);

        const pingEl = document.getElementById('stat-ping');
        if (pingEl) pingEl.textContent = `${Math.round(net.ping)} ms`;
    }

    function updateDevicesUI(devices) {
        const totalEl = document.getElementById('stat-total-devices');
        const wifiEl = document.getElementById('stat-wifi-devices');
        const ethEl = document.getElementById('stat-eth-devices');

        if (totalEl) {
            const onlineDevices = devices.filter(d => d.status === 'online');
            totalEl.textContent = onlineDevices.length;

            if (wifiEl) wifiEl.textContent = onlineDevices.filter(d => d.connection === 'wifi').length;
            if (ethEl) ethEl.textContent = onlineDevices.filter(d => d.connection === 'ethernet').length;
        }
    }
});
