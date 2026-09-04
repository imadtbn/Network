const utils = {
    formatBytes: (bytes, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    },

    formatSpeed: (mbps) => {
        return `${mbps.toFixed(1)} Mbps`;
    },

    getDeviceIcon: (type) => {
        const icons = {
            'smartphone': 'fa-mobile-screen',
            'tablet': 'fa-tablet-screen-button',
            'laptop': 'fa-laptop',
            'desktop': 'fa-desktop',
            'smart_tv': 'fa-tv',
            'printer': 'fa-print',
            'camera': 'fa-camera',
            'iot': 'fa-lightbulb',
            'router': 'fa-router',
            'unknown': 'fa-circle-question'
        };
        return icons[type] || icons['unknown'];
    },

    generateId: () => {
        return Math.random().toString(36).substr(2, 9);
    },

    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    escapeHtml: (unsafe) => {
        return (unsafe || "").toString()
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }
};

window.utils = utils;
