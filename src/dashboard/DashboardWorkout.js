import { useState } from "react";
import { assignedPlan, gymAttendance } from "../data/dashboardData";

export default function DashboardWorkout({ tab: initialTab = "plans" }) {
  const [tab, setTab] = useState(initialTab);
  const [search, setSearch] = useState("");
  const [dayIdx, setDayIdx] = useState(0);
  const [page, setPage] = useState(1);
  const PER = 5;
  const filteredAtt = gymAttendance.filter(a =>
    a.activity.toLowerCase().includes(search.toLowerCase()) ||
    a.date.toLowerCase().includes(search.toLowerCase())
  );
  const paged = filteredAtt.slice((page-1)*PER, page*PER);
  const pages = Math.ceil(filteredAtt.length / PER);
  const totalMins = gymAttendance.reduce((s,a) => s + parseInt(a.duration), 0);
  return (
    <div className="db-section">
      <div className="db-section-header"><h2>Workout</h2></div>
      <div className="db-tabs">
        {[["plans","Assigned Plans"],["attendance","Attendance"]].map(([id,l]) => (
          <button key={id} className={`db-tab ${tab===id?"db-tab--active":""}`} onClick={() => setTab(id)}>{l}</button>
        ))}
      </div>
      {tab === "plans" && (
        <>
          <div className="db-card">
            <div className="db-card-header">
              <div><h3>{assignedPlan.name}</h3><span className="db-badge badge-blue">{assignedPlan.level}</span></div>
              <span className="db-badge badge-green">Active</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:16 }}>
              {[["Assigned By",assignedPlan.assignedBy],["Duration",assignedPlan.duration],["Start Date",assignedPlan.assignedDate],["Progress",`${assignedPlan.progress}%`]].map(([l,v]) => (
                <div key={l} style={{ background:"var(--bg-primary)", borderRadius:8, padding:"10px 12px" }}>
                  <span style={{ fontSize:".72rem", color:"var(--text-secondary)", display:"block" }}>{l}</span>
                  <strong style={{ fontSize:".9rem" }}>{v}</strong>
                </div>
              ))}
            </div>
            <div style={{ marginBottom:6, display:"flex", justifyContent:"space-between", fontSize:".82rem" }}><span>Overall Progress</span><strong style={{ color:"var(--accent)" }}>{assignedPlan.progress}%</strong></div>
            <div style={{ background:"var(--border-color)", borderRadius:4, height:8, overflow:"hidden" }}>
              <div style={{ width:`${assignedPlan.progress}%`, height:"100%", background:"linear-gradient(to right,#f97316,#ea580c)", borderRadius:4 }} />
            </div>
          </div>
          <div className="db-tabs">
            {assignedPlan.days.map((d,i) => (
              <button key={i} className={`db-tab ${dayIdx===i?"db-tab--active":""}`} onClick={() => setDayIdx(i)}>{d.day}</button>
            ))}
          </div>
          <div className="db-card">
            <div className="db-card-header">
              <h3>{assignedPlan.days[dayIdx].day} - {assignedPlan.days[dayIdx].focus}</h3>
              <span className="db-badge badge-blue">{assignedPlan.days[dayIdx].exercises.length} exercises</span>
            </div>
            <table className="db-table">
              <thead><tr><th>Exercise</th><th>Sets</th><th>Reps</th><th>Weight</th><th>Rest</th></tr></thead>
              <tbody>
                {assignedPlan.days[dayIdx].exercises.map((ex,i) => (
                  <tr key={i}>
                    <td><strong>{ex.name}</strong></td>
                    <td><span className="db-badge badge-blue">{ex.sets}</span></td>
                    <td>{ex.reps}</td>
                    <td><strong style={{ color:"var(--accent)" }}>{ex.weight}</strong></td>
                    <td style={{ color:"var(--text-secondary)", fontSize:".82rem" }}>{ex.rest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {tab === "attendance" && (
        <>
          <div className="db-stats-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
            <div className="db-stat-card"><div className="db-stat-icon" style={{ background:"rgba(249,115,22,.15)" }}>Gym</div><div className="db-stat-info"><span className="db-stat-value">{gymAttendance.length}</span><span className="db-stat-label">Total Visits</span></div></div>
            <div className="db-stat-card"><div className="db-stat-icon" style={{ background:"rgba(34,197,94,.15)" }}>Time</div><div className="db-stat-info"><span className="db-stat-value">{totalMins} min</span><span className="db-stat-label">Total Time</span></div></div>
            <div className="db-stat-card"><div className="db-stat-icon" style={{ background:"rgba(59,130,246,.15)" }}>Avg</div><div className="db-stat-info"><span className="db-stat-value">{Math.round(totalMins/gymAttendance.length)} min</span><span className="db-stat-label">Avg Duration</span></div></div>
          </div>
          <div className="db-card">
            <div className="db-card-header">
              <h3>Check-in History</h3>
              <input className="db-input" placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ maxWidth:200 }} />
            </div>
            {paged.length === 0 ? <p style={{ textAlign:"center", color:"var(--text-secondary)", padding:"30px 0" }}>No records found.</p> : (
              <table className="db-table">
                <thead><tr><th>Date</th><th>Check In</th><th>Check Out</th><th>Duration</th><th>Activity</th></tr></thead>
                <tbody>
                  {paged.map(a => (
                    <tr key={a.id}>
                      <td style={{ fontSize:".82rem" }}>{a.date}</td>
                      <td style={{ color:"#22c55e", fontWeight:700 }}>{a.checkIn}</td>
                      <td style={{ color:"#ef4444", fontWeight:700 }}>{a.checkOut}</td>
                      <td><span className="db-badge badge-blue">{a.duration}</span></td>
                      <td><strong>{a.activity}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {pages > 1 && (
              <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:14 }}>
                <button disabled={page===1} onClick={() => setPage(p=>p-1)} className="db-tab" style={{ padding:"6px 12px" }}>Prev</button>
                {Array.from({length:pages},(_,i) => <button key={i} className={`db-tab ${page===i+1?"db-tab--active":""}`} style={{ padding:"6px 12px" }} onClick={() => setPage(i+1)}>{i+1}</button>)}
                <button disabled={page===pages} onClick={() => setPage(p=>p+1)} className="db-tab" style={{ padding:"6px 12px" }}>Next</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
