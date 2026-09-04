import time
import subprocess
import re
import psutil
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Global variables to track throughput
last_net_io = psutil.net_io_counters()
last_time = time.time()
start_time = time.time()

def get_devices_from_arp():
    devices = []
    try:
        # Run arp -a to get connected devices on local network
        result = subprocess.run(['arp', '-a'], capture_output=True, text=True, timeout=5)
        lines = result.stdout.splitlines()

        # Regex to parse 'arp -a' output: e.g. "? (192.168.1.1) at 00:11:22:33:44:55 [ether] on eth0"
        # Or standard windows/linux variations. We look for IP and MAC.
        ip_mac_pattern = re.compile(r'\((?P<ip>[0-9\.]+)\)\s+at\s+(?P<mac>[0-9a-fA-F:]+)')

        device_id_counter = 1
        for line in lines:
            match = ip_mac_pattern.search(line)
            if match:
                ip = match.group('ip')
                mac = match.group('mac')

                # Ignore incomplete ARP entries
                if "incomplete" in mac.lower():
                    continue

                # Basic mock logic to guess device type/manufacturer based on MAC OUI is complex,
                # so we assign generic ones, or you could integrate a MAC lookup table.
                devices.append({
                    "id": f"real-device-{device_id_counter}",
                    "name": f"Device {ip}",
                    "type": "unknown",
                    "manufacturer": "Unknown",
                    "ip": ip,
                    "mac": mac,
                    "connection": "ethernet", # We don't know for sure via standard ARP
                    "signal": None,
                    "download": 0.0, # Per-device realtime bandwidth requires deeper packet sniffing (e.g. pcap)
                    "upload": 0.0,
                    "totalConsumed": 0,
                    "firstSeen": "2023-01-01T00:00:00Z",
                    "status": "online"
                })
                device_id_counter += 1

    except Exception as e:
        print(f"Error reading ARP: {e}")

    return devices

@app.route('/api/network')
def get_network_stats():
    global last_net_io, last_time

    current_net_io = psutil.net_io_counters()
    current_time = time.time()

    time_diff = current_time - last_time
    if time_diff == 0:
        time_diff = 1 # prevent division by zero

    # Calculate bytes per second
    bytes_recv_sec = (current_net_io.bytes_recv - last_net_io.bytes_recv) / time_diff
    bytes_sent_sec = (current_net_io.bytes_sent - last_net_io.bytes_sent) / time_diff

    # Convert to Mbps (Megabits per second)
    download_mbps = (bytes_recv_sec * 8) / (1024 * 1024)
    upload_mbps = (bytes_sent_sec * 8) / (1024 * 1024)

    last_net_io = current_net_io
    last_time = current_time

    # Fake ping for now as ICMP requires root/subprocess overhead which might slow down the loop
    ping_ms = 20

    return jsonify({
        "status": "online",
        "ssid": "Local_Network_Real",
        "type": "Mixed",
        "localIp": "127.0.0.1", # Or get real local IP
        "gateway": "192.168.1.1",
        "uptime": int(current_time - start_time),
        "downloadSpeed": round(max(0, download_mbps), 2),
        "uploadSpeed": round(max(0, upload_mbps), 2),
        "ping": ping_ms,
        "totalDownloaded": current_net_io.bytes_recv,
        "totalUploaded": current_net_io.bytes_sent
    })

@app.route('/api/devices')
def get_devices():
    devices = get_devices_from_arp()

    # Always include the local machine itself as a device for testing
    devices.append({
        "id": "real-device-0",
        "name": "Local Host Machine",
        "type": "desktop",
        "manufacturer": "System",
        "ip": "127.0.0.1",
        "mac": "00:00:00:00:00:00",
        "connection": "ethernet",
        "signal": None,
        "download": 0.0,
        "upload": 0.0,
        "totalConsumed": last_net_io.bytes_recv + last_net_io.bytes_sent,
        "firstSeen": "2023-01-01T00:00:00Z",
        "status": "online"
    })

    return jsonify(devices)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
