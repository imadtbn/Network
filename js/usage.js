document.addEventListener('DOMContentLoaded', () => {

    let pieChart;

    appState.subscribe('devices', updateUsageData);
    appState.subscribe('network', (net) => {
        document.getElementById('usage-month').textContent = utils.formatBytes(net.totalDownloaded + net.totalUploaded);
        // Mock static values for today and week based on month
        document.getElementById('usage-today').textContent = utils.formatBytes((net.totalDownloaded + net.totalUploaded) * 0.05);
        document.getElementById('usage-week').textContent = utils.formatBytes((net.totalDownloaded + net.totalUploaded) * 0.25);
    });

    // initial triggers
    if (appState.get('network')) {
        const net = appState.get('network');
        document.getElementById('usage-month').textContent = utils.formatBytes(net.totalDownloaded + net.totalUploaded);
        document.getElementById('usage-today').textContent = utils.formatBytes((net.totalDownloaded + net.totalUploaded) * 0.05);
        document.getElementById('usage-week').textContent = utils.formatBytes((net.totalDownloaded + net.totalUploaded) * 0.25);
    }

    if (appState.get('devices')) updateUsageData(appState.get('devices'));


    function updateUsageData(devices) {
        if (!devices || devices.length === 0) return;

        // Sort by consumption
        const sorted = [...devices].sort((a, b) => b.totalConsumed - a.totalConsumed);

        // Update top list
        const topList = document.getElementById('top-devices-list');
        if (topList) {
            topList.innerHTML = '';
            sorted.slice(0, 5).forEach((d, index) => {
                const percent = Math.min(100, (d.totalConsumed / (appState.get('network').totalDownloaded + appState.get('network').totalUploaded)) * 100);
                const html = `
                    <div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
                            <span style="font-weight:600;">${index + 1}. ${d.name}</span>
                            <span class="latin-num" style="color:var(--text-secondary);">${utils.formatBytes(d.totalConsumed)}</span>
                        </div>
                        <div style="height:6px; background:var(--border); border-radius:3px; overflow:hidden;">
                            <div style="height:100%; width:${percent}%; background:var(--primary); border-radius:3px;"></div>
                        </div>
                    </div>
                `;
                topList.insertAdjacentHTML('beforeend', html);
            });
        }

        // Update Pie Chart
        const ctx = document.getElementById('usagePieChart');
        if (ctx) {
            const labels = sorted.slice(0, 5).map(d => d.name);
            const data = sorted.slice(0, 5).map(d => (d.totalConsumed / (1024*1024*1024)).toFixed(2)); // in GB

            // Others
            const othersTotal = sorted.slice(5).reduce((acc, val) => acc + val.totalConsumed, 0);
            if (othersTotal > 0) {
                labels.push('أخرى');
                data.push((othersTotal / (1024*1024*1024)).toFixed(2));
            }

            if (pieChart) {
                pieChart.data.labels = labels;
                pieChart.data.datasets[0].data = data;
                pieChart.update();
            } else {
                initPieChart(ctx, labels, data);
            }
        }
    }

    function initPieChart(ctx, labels, data) {
        const style = getComputedStyle(document.documentElement);
        const textColor = style.getPropertyValue('--text-primary').trim() || '#202124';

        pieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#1a73e8', '#34a853', '#fbbc04', '#ea4335', '#8ab4f8', '#9aa0a6'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'left',
                        labels: { color: textColor, font: { family: 'Cairo' } }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` ${context.label}: ${context.raw} GB`;
                            }
                        }
                    }
                }
            }
        });

        window.addEventListener('themeChanged', () => {
            const newStyle = getComputedStyle(document.documentElement);
            pieChart.options.plugins.legend.labels.color = newStyle.getPropertyValue('--text-primary').trim();
            pieChart.update();
        });
    }
});
