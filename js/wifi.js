document.addEventListener('DOMContentLoaded', () => {

    appState.subscribe('network', (net) => {
        const ssidEl = document.getElementById('wifi-ssid');
        if (ssidEl) ssidEl.textContent = net.ssid;
    });

    appState.subscribe('devices', (devices) => {
        const clientsEl = document.getElementById('wifi-clients');
        if (clientsEl) {
            const wifiCount = devices.filter(d => d.connection === 'wifi' && d.status === 'online').length;
            clientsEl.textContent = wifiCount;
        }
    });

    // init
    if (appState.get('network')) {
        const ssidEl = document.getElementById('wifi-ssid');
        if (ssidEl) ssidEl.textContent = appState.get('network').ssid;
    }

    if (appState.get('devices')) {
        const clientsEl = document.getElementById('wifi-clients');
        if (clientsEl) {
            clientsEl.textContent = appState.get('devices').filter(d => d.connection === 'wifi' && d.status === 'online').length;
        }
    }
});
