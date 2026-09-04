document.addEventListener('DOMContentLoaded', () => {

    let qualityChart;
    const historyData = {
        ping: [],
        jitter: []
    };

    appState.subscribe('network', updateTrafficUI);

    if (appState.get('network')) {
        updateTrafficUI(appState.get('network'));
    }

    function updateTrafficUI(net) {
        document.getElementById('traffic-ping').textContent = `${Math.round(net.ping)} ms`;

        // Mock jitter and loss based on ping fluctuations
        const jitter = Math.abs((Math.random() - 0.5) * 5);
        document.getElementById('traffic-jitter').textContent = `${jitter.toFixed(1)} ms`;

        const loss = net.ping > 100 ? (Math.random() * 2).toFixed(1) : (Math.random() * 0.2).toFixed(1);
        document.getElementById('traffic-loss').textContent = `${loss} %`;

        // Update Quality text/bar
        const qText = document.getElementById('network-quality-text');
        const qBar = document.getElementById('network-quality-bar');

        if (net.ping < 50 && loss < 0.5) {
            qText.textContent = 'ممتاز';
            qText.style.color = 'var(--success)';
            qBar.style.color = 'var(--success)';
            qBar.textContent = '██████████';
        } else if (net.ping < 100 && loss < 2) {
            qText.textContent = 'جيد';
            qText.style.color = 'var(--warning)';
            qBar.style.color = 'var(--warning)';
            qBar.textContent = '███████░░░';
        } else {
            qText.textContent = 'ضعيف';
            qText.style.color = 'var(--danger)';
            qBar.style.color = 'var(--danger)';
            qBar.textContent = '███░░░░░░░';
        }

        // Update Chart
        historyData.ping.push(net.ping);
        historyData.jitter.push(jitter);

        if (historyData.ping.length > 30) {
            historyData.ping.shift();
            historyData.jitter.shift();
        }

        const ctx = document.getElementById('qualityChart');
        if (ctx) {
            if (qualityChart) {
                qualityChart.data.datasets[0].data = [...historyData.ping];
                qualityChart.data.datasets[1].data = [...historyData.jitter];
                qualityChart.update();
            } else {
                initChart(ctx);
            }
        }
    }

    function initChart(ctx) {
        const style = getComputedStyle(document.documentElement);
        const gridColor = style.getPropertyValue('--border-light').trim() || '#f1f3f4';
        const textColor = style.getPropertyValue('--text-primary').trim() || '#202124';

        qualityChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array(30).fill(''),
                datasets: [
                    {
                        label: 'Ping (ms)',
                        data: [...historyData.ping],
                        borderColor: '#1a73e8',
                        backgroundColor: 'rgba(26,115,232,0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: 'Jitter (ms)',
                        data: [...historyData.jitter],
                        borderColor: '#fbbc04',
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 0 },
                scales: {
                    x: { display: false },
                    y: {
                        beginAtZero: true,
                        grid: { color: gridColor },
                        ticks: { color: textColor }
                    }
                },
                plugins: {
                    legend: { labels: { color: textColor, font: { family: 'Cairo' } } }
                }
            }
        });

        window.addEventListener('themeChanged', () => {
            const newStyle = getComputedStyle(document.documentElement);
            qualityChart.options.scales.y.grid.color = newStyle.getPropertyValue('--border-light').trim();
            qualityChart.options.scales.y.ticks.color = newStyle.getPropertyValue('--text-primary').trim();
            qualityChart.options.plugins.legend.labels.color = newStyle.getPropertyValue('--text-primary').trim();
            qualityChart.update();
        });
    }
});
