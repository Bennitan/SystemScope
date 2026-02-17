from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from engine import get_system_metrics
import asyncio
import sqlite3
from datetime import datetime

# --- DATABASE SETUP ---
def init_db():
    """Initializes the SQL database with expanded metrics for Disk and Latency."""
    conn = sqlite3.connect("system_health.db")
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            cpu REAL,
            memory REAL,
            disk_io REAL,
            latency REAL
        )
    ''')
    conn.commit()
    conn.close()

def save_to_db(cpu, memory, disk, latency):
    """Saves expanded metric records to the SQL persistence layer."""
    conn = sqlite3.connect("system_health.db")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO metrics (timestamp, cpu, memory, disk_io, latency) VALUES (?, ?, ?, ?, ?)",
        (datetime.now().strftime("%Y-%m-%d %H:%M:%S"), cpu, memory, disk, latency)
    )
    conn.commit()
    conn.close()

# Initialize DB on startup
init_db()

# --- APP SETUP ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "SystemScope API is online"}

# --- ENDPOINTS ---

@app.get("/history")
def get_history():
    """Retrieves historical metrics including Disk and Latency for trend analysis."""
    conn = sqlite3.connect("system_health.db")
    cursor = conn.cursor()
    cursor.execute("SELECT timestamp, cpu, memory, disk_io, latency FROM metrics ORDER BY id DESC LIMIT 100")
    rows = cursor.fetchall()
    conn.close()
    
    history = [{
        "timestamp": r[0], 
        "cpu_usage": r[1], 
        "memory_usage": r[2],
        "disk_io": r[3],
        "network_latency": r[4]
    } for r in rows]
    return history[::-1]

@app.websocket("/ws/metrics")
async def websocket_endpoint(websocket: WebSocket):
    """Streams and persists real-time multi-dimensional system metrics."""
    await websocket.accept()
    print("Client connected to WebSocket")
    try:
        while True:
            # 1. Collect
            data = get_system_metrics()
            
            # 2. Persist to SQL (CPU, RAM, Disk, Latency)
            save_to_db(
                data['cpu_usage'], 
                data['memory_usage'], 
                data['disk_io'], 
                data['network_latency']
            )
            
            # 3. Stream to Frontend
            await websocket.send_json(data)
            
            await asyncio.sleep(1)
    except Exception as e:
        print(f"Client disconnected: {e}")