class LiveTrafficChart {
    constructor(canvasId) {
        this.ctx = document.getElementById(canvasId);
        if (!this.ctx) return;

        this.chart = null;
        this.isPaused = false;

        this.initChart();
        this.setupListeners();
    }

    getColors() {
        const style = getComputedStyle(document.documentElement);
        return {
            primary: style.getPropertyValue('--primary').trim() || '#1a73e8',
            warning: style.getPropertyValue('--warning').trim() || '#fbbc04',
            text: style.getPropertyValue('--text-primary').trim() || '#202124',
            grid: style.getPropertyValue('--border-light').trim() || '#f1f3f4'
        };
    }

    initChart() {
        const colors = this.getColors();

        this.chart = new Chart(this.ctx, {
            type: 'line',
            data: {
                labels: Array(60).fill(''), // 60 seconds
                datasets: [
                    {
                        label: 'Download (Mbps)',
                        data: Array(60).fill(0),
                        borderColor: colors.primary,
                        backgroundColor: 'rgba(26, 115, 232, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: 'Upload (Mbps)',
                        data: Array(60).fill(0),
                        borderColor: colors.warning,
                        backgroundColor: 'rgba(251, 188, 4, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 0 // Disable animation for performance on live updates
                },
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { display: false }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: colors.grid
                        },
                        ticks: {
                            color: colors.text,
                            callback: function(value) {
                                return value + ' Mbps';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: colors.text }
                    },
                    tooltip: {
                        enabled: true,
                        mode: 'index',
                        intersect: false,
                    }
                }
            }
        });
    }

    updateData(historyData) {
        if (this.isPaused || !this.chart) return;

        // historyData is array of {time, download, upload}
        const dlData = historyData.map(d => d.download);
        const ulData = historyData.map(d => d.upload);

        // Pad with zeros if less than 60
        while (dlData.length < 60) dlData.unshift(0);
        while (ulData.length < 60) ulData.unshift(0);

        // Update last 60 only
        this.chart.data.datasets[0].data = dlData.slice(-60);
        this.chart.data.datasets[1].data = ulData.slice(-60);

        this.chart.update();
    }

    updateColors() {
        if (!this.chart) return;
        const colors = this.getColors();

        this.chart.options.scales.y.grid.color = colors.grid;
        this.chart.options.scales.y.ticks.color = colors.text;
        this.chart.options.plugins.legend.labels.color = colors.text;

        this.chart.update();
    }

    setupListeners() {
        const pauseBtn = document.getElementById('pause-chart-btn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.isPaused = !this.isPaused;
                pauseBtn.innerHTML = this.isPaused ? '<i class="fa-solid fa-play"></i>' : '<i class="fa-solid fa-pause"></i>';
            });
        }

        window.addEventListener('themeChanged', () => {
            this.updateColors();
        });
    }
}

window.LiveTrafficChart = LiveTrafficChart;
