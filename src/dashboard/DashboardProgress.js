import { useState } from "react";
import { weightLog, measurements } from "../data/dashboardData";

export default function DashboardProgress() {
  const [tab, setTab] = useState("weight");
  const [newWeight, setNewWeight] = useState("");
  const [log, setLog] = useState(weightLog);

  const addWeight = () => {
    if (!newWeight) return;
    setLog(prev => [...prev, { date: "Today", weight: parseFloat(newWeight) }]);
    setNewWeight("");
  };

  const maxW = Math.max(...log.map(e => e.weight));
  const minW = Math.min(...log.map(e => e.weight));

  return (
    <div className="db-section">
      <div className="db-section-header"><h2>Progress Tracker</h2></div>

      <div className="db-tabs">
        {[["weight","⚖️ Weight"],["measurements","📏 Measurements"],["photos","📸 Photos"]].map(([id,label]) => (
          <button key={id} className={`db-tab${tab===id?" db-tab--active":""}`} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {tab === "weight" && (
        <div className="db-card">
          <div className="db-card-header">
            <h3>Weight Log</h3>
            <span className="db-badge badge-green">-{(log[0].weight - log[log.length-1].weight).toFixed(1)} kg total</span>
          </div>
          <div className="db-chart">
            {log.map((e, i) => {
              const pct = maxW === minW ? 50 : ((e.weight - minW) / (maxW - minW)) * 70 + 15;
              return (
                <div className="db-chart-col" key={i}>
                  <span className="db-chart-val">{e.weight}</span>
                  <div className="db-chart-bar" style={{ height: `${pct}%` }} />
                  <span className="db-chart-label">{e.date}</span>
                </div>
              );
            })}
          </div>
          <div className="db-log-row">
            <input className="db-input" type="number" placeholder="Weight (kg)" value={newWeight} onChange={e => setNewWeight(e.target.value)} />
            <button className="btn btn-primary db-btn-sm" onClick={addWeight}>Log</button>
          </div>
        </div>
      )}

      {tab === "measurements" && (
        <div className="db-card">
          <div className="db-card-header"><h3>Body Measurements</h3></div>
          <table className="db-table">
            <thead><tr><th>Body Part</th><th>Start</th><th>Current</th><th>Change</th></tr></thead>
            <tbody>
              {measurements.map((m, i) => (
                <tr key={i}>
                  <td><strong>{m.part}</strong></td>
                  <td>{m.start}</td>
                  <td>{m.current}</td>
                  <td><span className={m.change.startsWith("-") ? "db-change-good" : "db-change-up"}>{m.change}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "photos" && (
        <div className="db-card">
          <div className="db-card-header"><h3>Progress Photos</h3></div>
          <div className="db-photos-grid">
            {["Jan","Feb","Mar","Apr","May"].map((m, i) => (
              <div className="db-photo-card" key={i}>
                <div className="db-photo-placeholder">
                  {i === 4
                    ? <label className="db-upload-label"><input type="file" accept="image/*" hidden /><span>📷</span><span>Upload</span></label>
                    : <><span>🏋️</span><span>Photo</span></>
                  }
                </div>
                <span className="db-photo-month">{m} 2025</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
