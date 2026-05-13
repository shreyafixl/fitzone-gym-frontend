import { useState } from "react";
import { notifications } from "../data/dashboardData";

export default function DashboardNotifications() {
  const [notifs, setNotifs] = useState(notifications);
  const [filter, setFilter] = useState("all");
  const markRead = (id) => setNotifs(p => p.map(n => n.id===id ? {...n,read:true} : n));
  const markAll  = () => setNotifs(p => p.map(n => ({...n,read:true})));
  const del = (id) => setNotifs(p => p.filter(n => n.id!==id));
  const typeIcon  = { session:"📅", trainer:"💬", payment:"💳", goal:"🎯", announce:"📢" };
  const typeColor = { session:"#3b82f6", trainer:"#22c55e", payment:"#f97316", goal:"#f59e0b", announce:"#8b5cf6" };
  const filtered = notifs.filter(n => filter==="all" || (filter==="unread" && !n.read) || (filter==="read" && n.read));
  return (
    <div className="db-section">
      <div className="db-section-header">
        <h2>Notifications</h2>
        <button className="btn btn-outline db-btn-sm" onClick={markAll}>Mark All Read</button>
      </div>
      <div className="db-stats-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <div className="db-stat-card"><div className="db-stat-icon" style={{ background:"rgba(59,130,246,.15)" }}>Bell</div><div className="db-stat-info"><span className="db-stat-value">{notifs.length}</span><span className="db-stat-label">Total</span></div></div>
        <div className="db-stat-card"><div className="db-stat-icon" style={{ background:"rgba(239,68,68,.15)" }}>New</div><div className="db-stat-info"><span className="db-stat-value">{notifs.filter(n=>!n.read).length}</span><span className="db-stat-label">Unread</span></div></div>
        <div className="db-stat-card"><div className="db-stat-icon" style={{ background:"rgba(34,197,94,.15)" }}>Read</div><div className="db-stat-info"><span className="db-stat-value">{notifs.filter(n=>n.read).length}</span><span className="db-stat-label">Read</span></div></div>
      </div>
      <div className="db-tabs">
        {["all","unread","read"].map(f => (
          <button key={f} className={`db-tab ${filter===f?"db-tab--active":""}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="db-card">
        {filtered.length === 0 ? <p style={{ textAlign:"center", color:"var(--text-secondary)", padding:"30px 0" }}>No notifications.</p> : (
          filtered.map(n => (
            <div key={n.id} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"14px 0", borderBottom:"1px solid var(--border-color)", background:!n.read?"rgba(249,115,22,.03)":"transparent" }}>
              <div style={{ width:40, height:40, borderRadius:10, background:(typeColor[n.type]||"#6b7280")+"22", color:typeColor[n.type]||"#6b7280", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem", flexShrink:0 }}>
                {typeIcon[n.type]||"🔔"}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <strong style={{ fontSize:".88rem", color:"var(--text-primary)" }}>{n.title}</strong>
                  {!n.read && <span className="db-badge badge-red" style={{ fontSize:".6rem" }}>NEW</span>}
                </div>
                <p style={{ fontSize:".8rem", color:"var(--text-secondary)", margin:"3px 0" }}>{n.message}</p>
                <span style={{ fontSize:".72rem", color:"var(--accent)" }}>{n.time}</span>
              </div>
              <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                {!n.read && <button className="db-btn-link" style={{ fontSize:".72rem" }} onClick={() => markRead(n.id)}>Mark read</button>}
                <button className="db-btn-link" style={{ color:"#ef4444", fontSize:".72rem" }} onClick={() => del(n.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
