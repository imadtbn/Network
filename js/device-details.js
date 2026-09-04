document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const deviceId = urlParams.get('id');

    const notFoundEl = document.getElementById('device-not-found');
    const contentEl = document.getElementById('device-content');
    const titleEl = document.getElementById('dd-title');

    if (!deviceId) {
        showNotFound();
        return;
    }

    let currentDevice = null;
    let chart = null;
    const historyData = []; // keep local history for this specific device chart

    appState.subscribe('devices', (devices) => {
        const dev = devices.find(d => d.id === deviceId);
        if (dev) {
            currentDevice = dev;
            renderDeviceDetails();
            updateChartData();
        } else {
            showNotFound();
        }
    });

    // initial check
    const devs = appState.get('devices') || [];
    currentDevice = devs.find(d => d.id === deviceId);
    if (currentDevice) {
        initUI();
        renderDeviceDetails();
    } else {
        // Wait a bit in case data is loading
        setTimeout(() => {
            if (!currentDevice) showNotFound();
        }, 500);
    }


    function showNotFound() {
        titleEl.textContent = 'خطأ';
        notFoundEl.classList.remove('hidden');
        contentEl.classList.add('hidden');
    }

    function initUI() {
        notFoundEl.classList.add('hidden');
        contentEl.classList.remove('hidden');

        // Chart init
        if (document.getElementById('deviceTrafficChart') && typeof LiveTrafficChart !== 'undefined') {
             chart = new LiveTrafficChart('deviceTrafficChart');
        }

        // Edit Name Logic
        const editBtn = document.getElementById('dd-edit-btn');
        const nameEl = document.getElementById('dd-name');
        const nameInput = document.getElementById('dd-name-input');

        editBtn.addEventListener('click', () => {
            nameEl.style.display = 'none';
            nameInput.style.display = 'block';
            nameInput.value = currentDevice.name;
            nameInput.focus();
        });

        nameInput.addEventListener('blur', saveName);
        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') saveName();
        });

        function saveName() {
            const newName = nameInput.value.trim();
            if (newName && newName !== currentDevice.name) {
                // Update state
                const devices = [...appState.get('devices')];
                const index = devices.findIndex(d => d.id === deviceId);
                if (index !== -1) {
                    devices[index].name = newName;
                    appState.replace('devices', devices);
                    // Also save back to storage for persistence
                    storage.set('devices', devices);
                }
            }
            nameInput.style.display = 'none';
            nameEl.style.display = 'block';
            nameEl.textContent = currentDevice ? currentDevice.name : newName;
            titleEl.textContent = currentDevice ? currentDevice.name : newName;
        }

        // Mock Block/Allow
        const btnBlock = document.getElementById('btn-block');
        const btnAllow = document.getElementById('btn-allow');

        btnBlock.addEventListener('click', () => {
            if (confirm('هل أنت متأكد من حظر هذا الجهاز؟ (هذه محاكاة فقط)')) {
                btnBlock.classList.add('hidden');
                btnAllow.classList.remove('hidden');
                // Simulate disconnect
                const devices = [...appState.get('devices')];
                const index = devices.findIndex(d => d.id === deviceId);
                if (index !== -1) {
                    devices[index].status = 'offline';
                    devices[index].download = 0;
                    devices[index].upload = 0;
                    appState.replace('devices', devices);
                }
            }
        });

        btnAllow.addEventListener('click', () => {
            btnBlock.classList.remove('hidden');
            btnAllow.classList.add('hidden');
            // Simulate reconnect
            const devices = [...appState.get('devices')];
            const index = devices.findIndex(d => d.id === deviceId);
            if (index !== -1) {
                devices[index].status = 'online';
                appState.replace('devices', devices);
            }
        });
    }

    function renderDeviceDetails() {
        titleEl.textContent = currentDevice.name;
        document.getElementById('dd-name').textContent = currentDevice.name;
        document.getElementById('dd-ip').textContent = currentDevice.ip;
        document.getElementById('dd-mac').textContent = currentDevice.mac;
        document.getElementById('dd-vendor').textContent = currentDevice.manufacturer || 'غير معروف';

        const connText = currentDevice.connection === 'wifi' ? 'Wi-Fi' : 'Ethernet';
        document.getElementById('dd-conn').textContent = connText;

        document.getElementById('dd-signal').textContent = currentDevice.signal ? `${currentDevice.signal} dBm` : '-';
        document.getElementById('dd-total').textContent = utils.formatBytes(currentDevice.totalConsumed);

        const d = new Date(currentDevice.firstSeen);
        document.getElementById('dd-first-seen').textContent = `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;

        const iconEl = document.getElementById('dd-icon');
        iconEl.innerHTML = `<i class="fa-solid ${utils.getDeviceIcon(currentDevice.type)}"></i>`;

        const badge = document.getElementById('dd-status-badge');
        if (currentDevice.status === 'online') {
            badge.textContent = 'متصل';
            badge.className = 'badge badge-success';
        } else {
            badge.textContent = 'غير متصل';
            badge.className = 'badge badge-danger';
        }
    }

    function updateChartData() {
        if (!chart) return;

        const now = new Date().getTime();
        historyData.push({
            time: now,
            download: currentDevice.download || 0,
            upload: currentDevice.upload || 0
        });

        if (historyData.length > 60) historyData.shift();

        chart.updateData(historyData);
    }
});
