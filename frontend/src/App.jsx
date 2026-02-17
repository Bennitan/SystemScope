import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Cpu, HardDrive, AlertTriangle, History, Sun, Moon, Wifi, Save } from 'lucide-react';

function App() {
  const [liveData, setLiveData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [isDark, setIsDark] = useState(true);

  // Theme configuration
  const theme = {
    bg: isDark ? '#0f172a' : '#f8fafc',
    card: isDark ? '#1e293b' : '#ffffff',
    text: isDark ? '#f8fafc' : '#0f172a',
    border: isDark ? '#334155' : '#e2e8f0',
    subtext: isDark ? '#94a3b8' : '#64748b'
  };

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws/metrics');
    socket.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      
      // Anomaly Detection
      if (newData.memory_usage > 90) setAlert("CRITICAL: RAM Usage > 90%");
      else if (newData.network_latency > 200) setAlert("WARNING: High Network Latency");
      else setAlert(null);

      setLiveData(prev => [...prev, newData].slice(-30));
    };
    return () => socket.close();
  }, []);

  const fetchHistory = async () => {
    const response = await fetch('http://localhost:8000/history');
    const data = await response.json();
    setHistoryData(data);
  };

  const latest = liveData[liveData.length - 1] || { cpu_usage: 0, memory_usage: 0, network_latency: 0, disk_io: 0 };

  return (
    <div style={{ 
      padding: '40px', 
      backgroundColor: theme.bg, 
      color: theme.text, 
      minHeight: '100vh', 
      transition: 'all 0.3s ease',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
            <Activity size={32} color="#38bdf8" /> SystemScope Pro
          </h1>
          <p style={{ color: theme.subtext, marginTop: '5px' }}>Real-time System Observability & Health</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setIsDark(!isDark)} style={{ background: theme.card, color: theme.text, border: `1px solid ${theme.border}`, padding: '10px', borderRadius: '10px', cursor: 'pointer' }}>
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={fetchHistory} style={{ background: '#38bdf8', color: '#0f172a', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={18} /> Sync SQL History
          </button>
        </div>
      </div>

      {alert && (
        <div style={{ backgroundColor: '#ef4444', color: 'white', padding: '15px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', animation: 'pulse 2s infinite' }}>
          <AlertTriangle size={24} /> {alert}
        </div>
      )}

      {/* METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {[
          { label: 'CPU Load', value: `${latest.cpu_usage}%`, icon: <Cpu size={20}/>, color: '#38bdf8' },
          { label: 'RAM Usage', value: `${latest.memory_usage}%`, icon: <HardDrive size={20}/>, color: '#818cf8' },
          { label: 'Network Latency', value: `${latest.network_latency}ms`, icon: <Wifi size={20}/>, color: '#fbbf24' },
          { label: 'Disk I/O', value: `${latest.disk_io.toFixed(2)} MB/s`, icon: <Save size={20}/>, color: '#34d399' }
        ].map((stat, i) => (
          <div key={i} style={{ background: theme.card, padding: '20px', borderRadius: '16px', border: `1px solid ${theme.border}`, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.subtext, marginBottom: '10px' }}>
              {stat.icon} {stat.label}
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: historyData.length > 0 ? '1fr 1fr' : '1fr', gap: '20px' }}>
        <div style={{ background: theme.card, padding: '20px', borderRadius: '16px', border: `1px solid ${theme.border}`, height: '400px' }}>
          <h3 style={{ marginBottom: '20px' }}>Live Telemetry Stream</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={liveData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border} vertical={false} />
              <XAxis dataKey="timestamp" hide />
              <YAxis domain={[0, 'auto']} stroke={theme.subtext} fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text }} />
              <Line type="monotone" dataKey="cpu_usage" stroke="#38bdf8" strokeWidth={3} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="memory_usage" stroke="#818cf8" strokeWidth={3} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="network_latency" stroke="#fbbf24" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {historyData.length > 0 && (
          <div style={{ background: theme.card, padding: '20px', borderRadius: '16px', border: `1px solid ${theme.border}`, height: '400px' }}>
            <h3 style={{ marginBottom: '20px' }}>SQL Historical Trends</h3>
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border} vertical={false} />
                <XAxis dataKey="timestamp" hide />
                <YAxis stroke={theme.subtext} fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text }} />
                <Area type="monotone" dataKey="cpu_usage" stroke="#38bdf8" fillOpacity={1} fill="url(#colorCpu)" />
                <Area type="monotone" dataKey="memory_usage" stroke="#818cf8" fillOpacity={0.1} fill="#818cf8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;