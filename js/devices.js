document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('devices-container');
    const searchInput = document.getElementById('search-device');
    const filterConn = document.getElementById('filter-connection');
    const filterStatus = document.getElementById('filter-status');

    if (!container) return;

    let currentDevices = [];

    appState.subscribe('devices', (devices) => {
        currentDevices = devices;
        renderDevices();
    });

    // Initial render
    currentDevices = appState.get('devices') || [];
    renderDevices();

    // Event Listeners for filtering
    if (searchInput) searchInput.addEventListener('input', () => renderDevices());
    if (filterConn) filterConn.addEventListener('change', () => renderDevices());
    if (filterStatus) filterStatus.addEventListener('change', () => renderDevices());

    function renderDevices() {
        if (!container) return;

        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const connVal = filterConn ? filterConn.value : 'all';
        const statusVal = filterStatus ? filterStatus.value : 'all';

        const filtered = currentDevices.filter(d => {
            const matchSearch = d.name.toLowerCase().includes(searchTerm) ||
                                d.ip.includes(searchTerm) ||
                                d.mac.toLowerCase().includes(searchTerm) ||
                                (d.manufacturer && d.manufacturer.toLowerCase().includes(searchTerm));

            const matchConn = connVal === 'all' || d.connection === connVal;
            const matchStatus = statusVal === 'all' || d.status === statusVal;

            return matchSearch && matchConn && matchStatus;
        });

        container.innerHTML = '';

        if (filtered.length === 0) {
            container.innerHTML = `<div class="card"><p style="text-align:center;">لا توجد أجهزة مطابقة.</p></div>`;
            return;
        }

        filtered.forEach(device => {
            const isOnline = device.status === 'online';
            const icon = utils.getDeviceIcon(device.type);

            let connIcon = device.connection === 'wifi' ? 'fa-wifi' : 'fa-network-wired';

            // Edit name block setup (simulated here via link params, full edit on details page)
            const html = `
                <a href="device-details.html?id=${device.id}" class="card device-card">
                    <div class="device-status">
                        <span class="status-dot ${device.status}" title="${isOnline ? 'متصل' : 'غير متصل'}"></span>
                    </div>
                    <div class="device-header">
                        <div class="device-icon">
                            <i class="fa-solid ${icon}"></i>
                        </div>
                        <div class="device-info">
                            <h3 class="device-name" title="${utils.escapeHtml(device.name)}">${utils.escapeHtml(device.name)}</h3>
                            <div class="device-ip latin-num">${device.ip}</div>
                        </div>
                    </div>
                    <div class="device-stats">
                        <div class="d-stat">
                            <i class="fa-solid fa-arrow-down"></i>
                            <span class="latin-num">${isOnline ? utils.formatSpeed(device.download) : '0 Mbps'}</span>
                        </div>
                        <div class="d-stat">
                            <i class="fa-solid fa-arrow-up"></i>
                            <span class="latin-num">${isOnline ? utils.formatSpeed(device.upload) : '0 Mbps'}</span>
                        </div>
                        <div class="d-stat">
                            <i class="fa-solid ${connIcon}"></i>
                            <span class="latin-num">${device.connection === 'wifi' && isOnline ? (device.signal + ' dBm') : '-'}</span>
                        </div>
                    </div>
                </a>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });
    }
});
