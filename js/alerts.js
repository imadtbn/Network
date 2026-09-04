document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('alerts-container');
    const clearBtn = document.getElementById('clear-alerts');

    appState.subscribe('alerts', renderAlerts);

    if (appState.get('alerts')) renderAlerts(appState.get('alerts'));

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            appState.replace('alerts', []);
        });
    }

    function renderAlerts(alerts) {
        if (!container) return;

        container.innerHTML = '';

        if (alerts.length === 0) {
            container.innerHTML = '<div class="card"><p style="text-align:center; color:var(--text-secondary);">لا توجد تنبيهات حالياً.</p></div>';
            return;
        }

        alerts.forEach(alert => {
            let icon = 'fa-bell';
            let color = 'var(--primary)';

            if (alert.message.includes('انقطع')) {
                icon = 'fa-triangle-exclamation';
                color = 'var(--danger)';
            } else if (alert.message.includes('اتصل')) {
                icon = 'fa-circle-check';
                color = 'var(--success)';
            }

            const d = new Date(alert.time);
            const timeStr = `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;

            const html = `
                <div class="card" style="display:flex; align-items:flex-start; gap:1rem;">
                    <div style="background:var(--background); padding:1rem; border-radius:50%; color:${color}; font-size:1.5rem;">
                        <i class="fa-solid ${icon}"></i>
                    </div>
                    <div style="flex:1;">
                        <p style="font-weight:600; margin-bottom:0.25rem; color:var(--text-primary);">${alert.message}</p>
                        <p style="font-size:0.8rem; color:var(--text-secondary);" class="latin-num" dir="ltr">${timeStr}</p>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });
    }
});
