# SystemScope Pro: Real-Time Observability Engine 🚀

SystemScope is a full-stack observability platform that provides real-time telemetry and historical health analysis for system resources. Built with a focus on high availability and low-latency data streaming, it mimics industry-standard tools like Azure Monitor and Datadog.

## 🛠️ System Architecture
- **Metrics Engine:** Python-based collector using `psutil` to capture CPU, RAM, Disk I/O, and Network Latency.
- **Backend API:** FastAPI (Asynchronous) handling WebSocket streams for real-time updates and REST endpoints for SQL history.
- **Persistence:** SQLite3 time-series database storing metrics for trend analysis.
- **Frontend:** React (Vite) dashboard featuring responsive Recharts, Lucide icons, and a dynamic theme engine.

## ✨ Key Features
- **Real-Time Streaming:** Sub-second latency updates via WebSockets.
- **Anomaly Detection:** Automated logic that flags hardware stress (e.g., RAM > 90%) with visual alerts.
- **Historical Trends:** Persistence layer allows users to sync and visualize past system performance.
- **Dual-Mode UI:** Fully integrated Dark and Light modes for professional UX.

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Activate venv (Windows: .\venv\Scripts\activate | Mac: source venv/bin/activate)
pip install fastapi uvicorn[standard] psutil
uvicorn main:app --reload

### 2. Frontend Setup
```bash
# From the SystemScope root directory
cd frontend
npm install
npm run dev