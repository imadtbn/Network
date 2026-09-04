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

    async connectToRouter(ip, username, password) {
        try {
            const res = await fetch(`${this.baseUrl}/api/router/connect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ip, username, password })
            });
            return await res.json();
        } catch (error) {
            console.error("Error connecting to router API:", error);
            return { success: false, message: "فشل الاتصال بالخادم الداخلي" };
        }
    }
}

window.apiProvider = new ApiProvider();
