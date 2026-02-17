import psutil
import time
import socket

def get_network_latency():
    """Measures latency by checking connection time to a common DNS (Google)."""
    try:
        start = time.time()
        socket.create_connection(("8.8.8.8", 53), timeout=1)
        return round((time.time() - start) * 1000, 2) # Convert to ms
    except:
        return 999 # "Timeout" value

def get_system_metrics():
    return {
        "cpu_usage": psutil.cpu_percent(interval=None),
        "memory_usage": psutil.virtual_memory().percent,
        "disk_io": psutil.disk_io_counters().read_bytes / 1024 / 1024, # MB read
        "network_latency": get_network_latency(),
        "timestamp": time.time()
    }