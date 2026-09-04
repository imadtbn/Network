document.addEventListener('DOMContentLoaded', () => {

    // Theme
    const darkModeToggle = document.getElementById('setting-dark-mode');
    if (darkModeToggle) {
        darkModeToggle.checked = document.documentElement.getAttribute('data-theme') === 'dark';

        darkModeToggle.addEventListener('change', (e) => {
            const themeBtn = document.getElementById('theme-toggle');
            if (themeBtn) themeBtn.click();
        });
    }

    // Simulation Settings
    const simModeToggle = document.getElementById('setting-sim-mode');
    const intervalSelect = document.getElementById('setting-update-interval');

    let currentSettings = appState.get('settings');

    if (simModeToggle) {
        simModeToggle.checked = currentSettings.simulationMode;
        simModeToggle.addEventListener('change', (e) => {
            const newSettings = { ...appState.get('settings'), simulationMode: e.target.checked };
            appState.replace('settings', newSettings);
            storage.set('settings', newSettings);

            if (e.target.checked) {
                window.simulationEngine.start();
            } else {
                window.simulationEngine.stop();
            }
        });
    }

    if (intervalSelect) {
        intervalSelect.value = currentSettings.updateInterval;
        intervalSelect.addEventListener('change', (e) => {
            const newSettings = { ...appState.get('settings'), updateInterval: parseInt(e.target.value) };
            appState.replace('settings', newSettings);
            storage.set('settings', newSettings);

            if (newSettings.simulationMode) {
                window.simulationEngine.stop();
                window.simulationEngine.start();
            }
        });
    }

    // PWA Install
    window.addEventListener('pwaInstallAvailable', () => {
        const pwaCard = document.getElementById('pwa-install-card');
        const pwaBtn = document.getElementById('btn-install-pwa');
        if (pwaCard && pwaBtn) {
            pwaCard.classList.remove('hidden');
            pwaBtn.addEventListener('click', () => {
                if (window.installPWA) window.installPWA();
            });
        }
    });

    // Data Management
    const btnExport = document.getElementById('btn-export');
    const fileImport = document.getElementById('file-import');
    const btnReset = document.getElementById('btn-reset');

    if (btnExport) {
        btnExport.addEventListener('click', () => {
            const data = {
                devices: appState.get('devices'),
                network: appState.get('network'),
                settings: appState.get('settings')
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'netmonitor_data.json';
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    if (fileImport) {
        fileImport.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    if (data.devices) {
                        appState.replace('devices', data.devices);
                        storage.set('devices', data.devices);
                    }
                    if (data.network) {
                        appState.replace('network', data.network);
                        storage.set('network', data.network);
                    }
                    if (data.settings) {
                        appState.replace('settings', data.settings);
                        storage.set('settings', data.settings);
                    }
                    alert('تم استيراد البيانات بنجاح.');
                    location.reload();
                } catch (err) {
                    alert('ملف غير صالح.');
                }
            };
            reader.readAsText(file);
        });
    }

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            if (confirm('هل أنت متأكد من مسح جميع البيانات والإعدادات المحلية؟')) {
                storage.clearAll();
                location.reload();
            }
        });
    }
});
