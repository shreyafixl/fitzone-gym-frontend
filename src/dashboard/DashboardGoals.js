import { useState } from "react";
import { userData, userGoals, monthlyProgress } from "../data/dashboardData";

function ProgressBar({ value, max=100, color="var(--accent)", height=8 }) {
  return (
    <div style={{ background:"var(--border-color)", borderRadius:4, height, overflow:"hidden" }}>
      <div style={{ width:`${Math.min((value/max)*100,100)}%`, height:"100%", background:color, borderRadius:4, transition:"width .5s" }} />
    </div>
  );
}

function BarChart({ data, labels, color="var(--accent)", height=140 }) {
  const max = Math.max(...data);
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:6, height, padding:"8px 0" }}>
      {data.map((v,i) => (
        <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, flex:1 }}>
          <span style={{ fontSize:".58rem", color:"var(--text-secondary)" }}>{v>=1000?`${(v/1000).toFixed(1)}k`:v}</span>
          <div style={{ width:"100%", background:color, borderRadius:"4px 4px 0 0", height:`${(v/max)*85}%`, minHeight:8, opacity:.8, transition:"opacity .2s" }} />
          <span style={{ fontSize:".6rem", color:"var(--text-secondary)" }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function GoalBadge({ type }) {
  const m = { weight_loss:"badge-blue", cardio:"badge-green", strength:"badge-yellow", consistency:"badge-blue", body_comp:"badge-red" };
  return <span className={`db-badge ${m[type]||"badge-gray"}`}>{type?.replace("_"," ")}</span>;
}

export default function DashboardGoals() {
  const [goals, setGoals] = useState(userGoals);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ title:"", type:"weight_loss", target:"", deadline:"" });
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const save = () => {
    if (!form.title) return;
    setGoals(p => [...p, { ...form, id:Date.now(), current:"--", progress:0, status:"in-progress" }]);
    setForm({ title:"", type:"weight_loss", target:"", deadline:"" });
    setShowAdd(false);
    showToast("Goal created!");
  };

  const markDone = (id) => { setGoals(p => p.map(g => g.id===id ? {...g, status:"achieved", progress:100} : g)); showToast("Goal achieved!"); };
  const del = (id) => { setGoals(p => p.filter(g => g.id!==id)); showToast("Goal deleted!"); };

  const filtered = goals.filter(g => filter==="all" || g.status===filter);

  return (
    <div className="db-section">
      {toast && <div className="db-toast-notif">{toast}</div>}
      <div className="db-section-header">
        <h2>My Goals</h2>
        <button className="btn btn-primary db-btn-sm" onClick={() => setShowAdd(true)}>+ Add Goal</button>
      </div>

      <div className="db-stats-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <div className="db-stat-card"><div className="db-stat-icon" style={{ background:"rgba(249,115,22,.15)" }}>🎯</div><div className="db-stat-info"><span className="db-stat-value">{goals.length}</span><span className="db-stat-label">Total Goals</span></div></div>
        <div className="db-stat-card"><div className="db-stat-icon" style={{ background:"rgba(34,197,94,.15)" }}>✅</div><div className="db-stat-info"><span className="db-stat-value">{goals.filter(g=>g.status==="achieved").length}</span><span className="db-stat-label">Achieved</span></div></div>
        <div className="db-stat-card"><div className="db-stat-icon" style={{ background:"rgba(59,130,246,.15)" }}>⏳</div><div className="db-stat-info"><span className="db-stat-value">{goals.filter(g=>g.status==="in-progress").length}</span><span className="db-stat-label">In Progress</span></div></div>
      </div>

      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {["all","in-progress","achieved"].map(f => (
          <button key={f} className={`db-tab ${filter===f?"db-tab--active":""}`} onClick={() => setFilter(f)}>{f.replace("-"," ")}</button>
        ))}
      </div>

      <div className="db-goals-grid">
        {filtered.map(g => (
          <div className="db-card db-goal-card" key={g.id}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
              <div>
                <strong style={{ fontSize:".95rem", color:"var(--text-primary)", display:"block" }}>{g.title}</strong>
                <GoalBadge type={g.type} />
              </div>
              <span className={`db-badge ${g.status==="achieved"?"badge-green":"badge-yellow"}`}>{g.status.replace("-"," ")}</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:4, fontSize:".8rem", color:"var(--text-secondary)", marginBottom:12 }}>
              <span>🎯 Target: <strong style={{ color:"var(--text-primary)" }}>{g.target}</strong></span>
              <span>📍 Current: <strong style={{ color:"var(--text-primary)" }}>{g.current}</strong></span>
              <span>📅 Deadline: <strong style={{ color:"var(--text-primary)" }}>{g.deadline}</strong></span>
            </div>
            <div style={{ marginBottom:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:".78rem", marginBottom:4 }}><span>Progress</span><span style={{ fontWeight:700, color:"var(--accent)" }}>{g.progress}%</span></div>
              <ProgressBar value={g.progress} color={g.status==="achieved"?"#22c55e":"var(--accent)"} />
            </div>
            <div style={{ display:"flex", gap:8, marginTop:10 }}>
              {g.status!=="achieved" && <button className="btn btn-primary db-btn-sm" style={{ fontSize:".72rem" }} onClick={() => markDone(g.id)}>✅ Mark Done</button>}
              <button className="db-btn-link" style={{ color:"#ef4444", fontSize:".78rem" }} onClick={() => del(g.id)}>🗑 Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="db-modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="db-modal" onClick={e => e.stopPropagation()}>
            <div className="db-modal-head"><h3>Add New Goal</h3><button onClick={() => setShowAdd(false)} className="db-modal-close">✕</button></div>
            <div className="db-modal-body">
              <div className="db-form-group"><label>Goal Title</label><input className="db-input" placeholder="e.g. Lose 5kg" value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} /></div>
              <div className="db-form-group"><label>Type</label>
                <select className="db-select" value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))}>
                  <option value="weight_loss">Weight Loss</option><option value="strength">Strength</option><option value="cardio">Cardio</option><option value="consistency">Consistency</option><option value="body_comp">Body Composition</option>
                </select>
              </div>
              <div className="db-form-group"><label>Target</label><input className="db-input" placeholder="e.g. 70 kg" value={form.target} onChange={e => setForm(f=>({...f,target:e.target.value}))} /></div>
              <div className="db-form-group"><label>Deadline</label><input className="db-input" type="date" value={form.deadline} onChange={e => setForm(f=>({...f,deadline:e.target.value}))} /></div>
              <button className="btn btn-primary" style={{ width:"100%", marginTop:8 }} onClick={save}>Create Goal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
