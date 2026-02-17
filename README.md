# SystemScope Pro: Real-Time Observability Engine 🚀

SystemScope is a full-stack observability platform designed to monitor system health and reliability in real-time. Built with a focus on high availability and low-latency data streaming, it mimics industry-standard tools like Azure Monitor.

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
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
# Windows: .\venv\Scripts\activate | Mac/Linux: source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn[standard] psutil

# Start the metrics engine
uvicorn main:app --reload

# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev