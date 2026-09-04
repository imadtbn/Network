const storage = {
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(`netmonitor_${key}`);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage', error);
            return defaultValue;
        }
    },

    set: (key, value) => {
        try {
            localStorage.setItem(`netmonitor_${key}`, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage', error);
            return false;
        }
    },

    remove: (key) => {
        try {
            localStorage.removeItem(`netmonitor_${key}`);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage', error);
            return false;
        }
    },

    clearAll: () => {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('netmonitor_')) {
                localStorage.removeItem(key);
            }
        });
    }
};

window.storage = storage;
