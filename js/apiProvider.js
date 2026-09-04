class ApiProvider {
    constructor(baseUrl = 'http://127.0.0.1:5000') {
        this.baseUrl = baseUrl;
    }

    async fetchNetworkStats() {
        try {
            const res = await fetch(`${this.baseUrl}/api/network`);
            if (res.ok) {
                return await res.json();
            }
            throw new Error(`HTTP error! status: ${res.status}`);
        } catch (error) {
            console.error("Error fetching network stats:", error);
            return null;
        }
    }

    async fetchDevices() {
        try {
            const res = await fetch(`${this.baseUrl}/api/devices`);
            if (res.ok) {
                return await res.json();
            }
            throw new Error(`HTTP error! status: ${res.status}`);
        } catch (error) {
            console.error("Error fetching devices:", error);
            return null;
        }
    }
}

window.apiProvider = new ApiProvider();
