import { useState, useEffect } from "react";
import { dietPlan, mealLog, waterData } from "../data/dashboardData";

function ProgressBar({ value, max=100, color="var(--accent)", height=8 }) {
  return (
    <div style={{ background:"var(--border-color)", borderRadius:4, height, overflow:"hidden" }}>
      <div style={{ width:`${Math.min((value/max)*100,100)}%`, height:"100%", background:color, borderRadius:4, transition:"width .5s" }} />
    </div>
  );
}

export default function DashboardNutrition({ tab: initialTab = "diet" }) {
  const [tab, setTab] = useState(initialTab);

  // Sync tab state when prop changes
  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);
  const [cups, setCups] = useState(Math.round(waterData.today / 0.25));
  const totalCups = Math.round(waterData.target / 0.25);
  const totalLogged = mealLog.filter(m => m.logged).reduce((s,m) => s+m.calories, 0);

  return (
    <div className="db-section">
      <div className="db-section-header"><h2>Nutrition</h2></div>
      <div className="db-tabs">
        {[["diet","Diet Plan"],["meals","Meal Tracker"],["water","Water Intake"]].map(([id,l]) => (
          <button key={id} className={`db-tab ${tab===id?"db-tab--active":""}`} onClick={() => setTab(id)}>{l}</button>
        ))}
      </div>

      {tab === "diet" && (
        <>
          <div className="db-card">
            <div className="db-card-header">
              <div><h3>Your Diet Plan</h3><span style={{ fontSize:".78rem", color:"var(--text-secondary)" }}>Assigned by {dietPlan.assignedBy}</span></div>
              <span className="db-badge badge-green">{dietPlan.goal}</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
              {[["Calories",`${dietPlan.calories} kcal`,"#f97316"],["Protein",dietPlan.protein,"#3b82f6"],["Carbs",dietPlan.carbs,"#22c55e"],["Fat",dietPlan.fat,"#f59e0b"]].map(([l,v,c]) => (
                <div key={l} style={{ background:"var(--bg-primary)", borderRadius:10, padding:"14px", textAlign:"center", borderLeft:`3px solid ${c}` }}>
                  <strong style={{ display:"block", fontSize:"1.1rem", color:c }}>{v}</strong>
                  <span style={{ fontSize:".72rem", color:"var(--text-secondary)" }}>{l}</span>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {dietPlan.meals.map((m,i) => (
                <div key={i} style={{ background:"var(--bg-primary)", borderRadius:10, padding:"14px 16px", display:"flex", alignItems:"flex-start", gap:14 }}>
                  <div style={{ background:"rgba(249,115,22,.15)", borderRadius:8, padding:"8px 10px", textAlign:"center", minWidth:70 }}>
                    <strong style={{ display:"block", fontSize:".82rem", color:"var(--accent)" }}>{m.meal}</strong>
                    <span style={{ fontSize:".68rem", color:"var(--text-secondary)" }}>{m.time}</span>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:6 }}>
                      {m.foods.map((f,j) => <span key={j} className="db-badge badge-gray">{f}</span>)}
                    </div>
                    <span style={{ fontSize:".75rem", color:"var(--text-secondary)" }}>{m.calories} kcal · {m.protein} protein</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === "meals" && (
        <>
          <div className="db-stats-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
            <div className="db-stat-card"><div className="db-stat-icon" style={{ background:"rgba(249,115,22,.15)" }}>Cal</div><div className="db-stat-info"><span className="db-stat-value">{totalLogged}</span><span className="db-stat-label">Calories Logged</span><span className="db-stat-sub">Target: {dietPlan.calories} kcal</span></div></div>
            <div className="db-stat-card"><div className="db-stat-icon" style={{ background:"rgba(34,197,94,.15)" }}>Meals</div><div className="db-stat-info"><span className="db-stat-value">{mealLog.filter(m=>m.logged).length}/{mealLog.length}</span><span className="db-stat-label">Meals Logged</span></div></div>
            <div className="db-stat-card"><div className="db-stat-icon" style={{ background:"rgba(59,130,246,.15)" }}>%</div><div className="db-stat-info"><span className="db-stat-value">{Math.round(totalLogged/dietPlan.calories*100)}%</span><span className="db-stat-label">Daily Target</span></div></div>
          </div>
          <div className="db-card">
            <div className="db-card-header"><h3>Today Meals</h3></div>
            <div style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:".82rem", marginBottom:5 }}><span>Calorie Progress</span><span>{totalLogged} / {dietPlan.calories} kcal</span></div>
              <ProgressBar value={totalLogged} max={dietPlan.calories} color={totalLogged > dietPlan.calories ? "#ef4444" : "#22c55e"} height={10} />
            </div>
            <table className="db-table">
              <thead><tr><th>Meal</th><th>Food</th><th>Calories</th><th>Protein</th><th>Status</th></tr></thead>
              <tbody>
                {mealLog.map(m => (
                  <tr key={m.id}>
                    <td><span className="db-badge badge-blue">{m.meal}</span></td>
                    <td>{m.food}</td>
                    <td><strong>{m.calories} kcal</strong></td>
                    <td>{m.protein}</td>
                    <td><span className={`db-badge ${m.logged?"badge-green":"badge-gray"}`}>{m.logged?"Logged":"Pending"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "water" && (
        <>
          <div className="db-stats-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
            <div className="db-stat-card"><div className="db-stat-icon" style={{ background:"rgba(59,130,246,.15)" }}>Water</div><div className="db-stat-info"><span className="db-stat-value">{waterData.today}L</span><span className="db-stat-label">Today</span><span className="db-stat-sub">Target: {waterData.target}L</span></div></div>
            <div className="db-stat-card"><div className="db-stat-icon" style={{ background:"rgba(34,197,94,.15)" }}>Avg</div><div className="db-stat-info"><span className="db-stat-value">{(waterData.log.reduce((a,b)=>a+b,0)/waterData.log.length).toFixed(1)}L</span><span className="db-stat-label">Weekly Avg</span></div></div>
            <div className="db-stat-card"><div className="db-stat-icon" style={{ background:"rgba(249,115,22,.15)" }}>Days</div><div className="db-stat-info"><span className="db-stat-value">{waterData.log.filter(v=>v>=waterData.target).length}/7</span><span className="db-stat-label">Days Hit Target</span></div></div>
          </div>
          <div className="db-card">
            <div className="db-card-header"><h3>Daily Water Tracker</h3><span className="db-badge badge-blue">{cups}/{totalCups} cups</span></div>
            <div style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:".82rem", marginBottom:6 }}><span>Progress</span><span>{waterData.today}L / {waterData.target}L</span></div>
              <ProgressBar value={waterData.today} max={waterData.target} color="#3b82f6" height={12} />
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
              {Array.from({length:totalCups},(_,i) => (
                <div key={i} onClick={() => setCups(i+1)} style={{ width:44, height:44, borderRadius:8, border:`2px solid ${i<cups?"#3b82f6":"var(--border-color)"}`, background:i<cups?"rgba(59,130,246,.15)":"var(--bg-primary)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:"1.2rem", transition:"all .2s" }}>
                  {i<cups?"💧":"○"}
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button className="btn btn-primary db-btn-sm" onClick={() => setCups(c => Math.min(c+1, totalCups))}>+ Add Cup (250ml)</button>
              <button className="btn btn-outline db-btn-sm" onClick={() => setCups(0)}>Reset</button>
            </div>
          </div>
          <div className="db-card">
            <div className="db-card-header"><h3>Weekly Intake</h3></div>
            <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:120, padding:"8px 0" }}>
              {waterData.log.map((v,i) => {
                const max = Math.max(...waterData.log);
                const hit = v >= waterData.target;
                return (
                  <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, flex:1 }}>
                    <span style={{ fontSize:".65rem", color:"var(--text-secondary)" }}>{v}L</span>
                    <div style={{ width:"100%", background:hit?"#3b82f6":"rgba(59,130,246,.3)", borderRadius:"4px 4px 0 0", height:`${(v/max)*85}%`, minHeight:8 }} />
                    <span style={{ fontSize:".65rem", color:"var(--text-secondary)" }}>{waterData.days[i]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
