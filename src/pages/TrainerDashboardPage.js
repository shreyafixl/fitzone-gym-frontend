import { useState, useCallback, memo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaHome, FaUsers, FaCalendarAlt, FaDumbbell, FaClipboardList, FaEnvelope,
  FaChartBar, FaCheckCircle, FaClock, FaBell, FaArrowLeft, FaSearch, FaPlus,
  FaStickyNote, FaPaperPlane, FaEdit, FaStar, FaUserCircle,
  FaTrophy, FaAppleAlt, FaTint, FaBullhorn, FaCog, FaWeight,
  FaHeartbeat, FaFire, FaChartLine, FaComments,
  FaDownload, FaTrash, FaUserPlus, FaCalendarCheck, FaAngleDown,
} from "react-icons/fa";
import {
  trainerInfo, todaySchedule, pendingTasks, clients, clientProgressNotes,
  exerciseLibrary, workoutTemplates, trainerMessages, trainerReports,
  calendarEvents, clientProgressData, clientGoals, clientAttendance,
  sessions, availability, assignedPlans, dietPlans, mealTracking,
  waterIntake, trainerNotifications, trainerFeedback,
} from "../data/trainerDashboardData";
import FormModal from "../components/FormModal";
import { FormRenderer, formTitles } from "../components/DynamicForms";
import { useFormModal } from "../hooks/useFormModal";
import "../trainer-dashboard.css";

// NAV GROUPS
// Dashboard is a DIRECT link — no dropdown, no children
const DASHBOARD_ITEM = { id: "home", icon: <FaHome />, label: "Dashboard", color: "#f97316" };

const NAV_GROUPS = [
  { label:"Clients", icon:<FaUsers />, color:"#3b82f6", items:[
    { id:"my-clients",       icon:<FaUsers />,        label:"My Clients",       color:"#3b82f6" },
    { id:"progress-tracker", icon:<FaChartLine />,    label:"Progress Tracker", color:"#6366f1" },
    { id:"goals",            icon:<FaTrophy />,       label:"Goals",            color:"#f59e0b" },
    { id:"attendance",       icon:<FaCalendarCheck />,label:"Attendance",       color:"#22c55e" },
  ]},
  { label:"Schedule", icon:<FaCalendarAlt />, color:"#06b6d4", items:[
    { id:"calendar",     icon:<FaCalendarAlt />, label:"Calendar View", color:"#06b6d4" },
    { id:"sessions",     icon:<FaClock />,       label:"Sessions",      color:"#0ea5e9" },
    { id:"availability", icon:<FaCheckCircle />, label:"Availability",  color:"#22c55e" },
  ]},
  { label:"Classes", icon:<FaDumbbell />, color:"#8b5cf6", items:[
    { id:"class-list",        icon:<FaDumbbell />,     label:"Class List",   color:"#8b5cf6" },
    { id:"class-attendance",  icon:<FaCalendarCheck />,label:"Attendance",   color:"#a78bfa" },
    { id:"class-performance", icon:<FaChartBar />,     label:"Performance",  color:"#6366f1" },
  ]},
  { label:"Workout Plans", icon:<FaClipboardList />, color:"#f97316", items:[
    { id:"all-plans",    icon:<FaClipboardList />, label:"All Plans",    color:"#f97316" },
    { id:"create-plan",  icon:<FaPlus />,          label:"Create Plan",  color:"#fb923c" },
    { id:"assign-plans", icon:<FaUserPlus />,      label:"Assign Plans", color:"#fbbf24" },
  ]},
  { label:"Nutrition", icon:<FaAppleAlt />, color:"#10b981", items:[
    { id:"diet-plans",    icon:<FaAppleAlt />, label:"Diet Plans",    color:"#10b981" },
    { id:"meal-tracking", icon:<FaFire />,     label:"Meal Tracking", color:"#ef4444" },
    { id:"water-intake",  icon:<FaTint />,     label:"Water Intake",  color:"#0ea5e9" },
  ]},
  { label:"Communication", icon:<FaEnvelope />, color:"#ec4899", items:[
    { id:"messages",      icon:<FaEnvelope />,  label:"Messages",       color:"#ec4899" },
    { id:"notifications", icon:<FaBell />,      label:"Notifications",  color:"#f43f5e" },
    { id:"announcements", icon:<FaBullhorn />,  label:"Announcements",  color:"#fb7185" },
  ]},
  { label:"Reports", icon:<FaChartBar />, color:"#14b8a6", items:[
    { id:"client-reports",    icon:<FaUsers />,    label:"Client Reports",      color:"#14b8a6" },
    { id:"progress-analytics",icon:<FaChartLine />,label:"Progress Analytics",  color:"#2dd4bf" },
    { id:"session-reports",   icon:<FaChartBar />, label:"Session Reports",     color:"#34d399" },
  ]},
  { label:"Feedback", icon:<FaStar />, color:"#f59e0b", items:[
    { id:"ratings", icon:<FaStar />,     label:"Ratings", color:"#f59e0b" },
    { id:"reviews", icon:<FaComments />, label:"Reviews", color:"#fbbf24" },
  ]},
  { label:"Settings", icon:<FaCog />, color:"#64748b", items:[
    { id:"settings", icon:<FaCog />, label:"Settings", color:"#64748b" },
  ]},
];

const TBadge = memo(({ s }) => {
  const m = {
    completed:"td-badge-green", ongoing:"td-badge-orange", upcoming:"td-badge-blue",
    active:"td-badge-green", inactive:"td-badge-gray", paused:"td-badge-gray",
    high:"td-badge-red", medium:"td-badge-orange", low:"td-badge-blue",
    present:"td-badge-green", absent:"td-badge-red", missed:"td-badge-red",
    "in-progress":"td-badge-orange", achieved:"td-badge-green",
    Beginner:"td-badge-blue", Intermediate:"td-badge-orange", Advanced:"td-badge-red",
  };
  return <span className={`td-badge ${m[s] || "td-badge-gray"}`}>{s?.replace(/_/g," ")}</span>;
});

function Toast({ msg, onClose }) {
  return <div className="td-toast"><span>&#x2705; {msg}</span><button onClick={onClose} className="td-toast-close">x</button></div>;
}
function useToast() {
  const [toast, setToast] = useState(null);
  const show = useCallback((msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); }, []);
  return { toast, show };
}
function TModal({ title, onClose, children }) {
  return (
    <div className="td-modal-overlay" onClick={onClose}>
      <div className="td-modal" onClick={e => e.stopPropagation()}>
        <div className="td-modal-head"><h3>{title}</h3><button onClick={onClose} className="td-modal-close">x</button></div>
        <div className="td-modal-body">{children}</div>
      </div>
    </div>
  );
}
function ProgressBar({ value, max = 100, color = "var(--accent)", height = 7 }) {
  return (
    <div style={{ background:"var(--border-color)", borderRadius:4, height, overflow:"hidden" }}>
      <div style={{ width:`${Math.min((value/max)*100,100)}%`, height:"100%", background:color, borderRadius:4, transition:"width .5s" }} />
    </div>
  );
}
function BarChart({ data, labels, color = "var(--accent)", height = 130 }) {
  const max = Math.max(...data.filter(Boolean));
  return (
    <div className="td-bar-chart" style={{ height }}>
      {data.map((v, i) => (
        <div className="td-bar-col" key={i}>
          <span className="td-bar-val">{v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}</span>
          <div className="td-bar" style={{ height:`${(v/max)*100}%`, background:color }} />
          <span className="td-bar-label">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}
function EmptyState({ icon = "&#x1F4ED;", title = "No data found", desc = "Nothing to display here yet." }) {
  return <div className="td-empty"><div className="td-empty-icon">{icon}</div><h4>{title}</h4><p>{desc}</p></div>;
}
function Pagination({ total, page, perPage, onChange }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  return (
    <div className="td-pagination">
      <button disabled={page === 1} onClick={() => onChange(page - 1)} className="td-page-btn">&#x2039;</button>
      {Array.from({ length: pages }, (_, i) => (
        <button key={i} className={`td-page-btn ${page === i+1 ? "td-page-active" : ""}`} onClick={() => onChange(i+1)}>{i+1}</button>
      ))}
      <button disabled={page === pages} onClick={() => onChange(page + 1)} className="td-page-btn">&#x203A;</button>
    </div>
  );
}

// DASHBOARD HOME
function TrainerHome({ setSection, setSelectedClient }) {
  const [tasks, setTasks] = useState(pendingTasks);
  const toggle = id => setTasks(p => p.map(t => t.id === id ? { ...t, done:!t.done } : t));
  const r = trainerReports;
  const months = ["J","F","M","A","M","J","J","A","S","O","N","D"];
  return (
    <div className="td-section">
      <div className="td-section-head">
        <div>
          <h2>Welcome back, {trainerInfo.name.split(" ")[0]}!</h2>
          <p style={{ fontSize:".82rem", color:"var(--text-secondary)", marginTop:2 }}>Wednesday, May 6, 2026 - {todaySchedule.length} sessions today</p>
        </div>
        <span className="td-badge td-badge-green">Active</span>
      </div>
      <div className="td-kpi-grid">
        {[
          { icon:<FaUsers />, label:"Total Clients", value:trainerInfo.totalClients, sub:"All time", color:"#e8622a" },
          { icon:<FaCheckCircle />, label:"Active Clients", value:trainerInfo.activeClients, sub:"Currently active", color:"#22c55e" },
          { icon:<FaCalendarAlt />, label:"Sessions Today", value:todaySchedule.length, sub:"Scheduled", color:"#3b82f6" },
          { icon:<FaStar />, label:"Rating", value:trainerInfo.rating, sub:"Average score", color:"#f59e0b" },
          { icon:<FaChartBar />, label:"Sessions/Month", value:trainerInfo.sessionsThisMonth, sub:"This month", color:"#8b5cf6" },
          { icon:<FaFire />, label:"Today Revenue", value:`Rs.${trainerInfo.todayRevenue}`, sub:"From PT sessions", color:"#ef4444" },
        ].map((k, i) => (
          <div className="td-kpi-card" key={i}>
            <div className="td-kpi-icon" style={{ background:k.color+"22", color:k.color }}>{k.icon}</div>
            <div><strong>{k.value}</strong><span>{k.label}</span><small>{k.sub}</small></div>
          </div>
        ))}
      </div>
      <div className="td-two-col">
        <div className="td-card">
          <div className="td-card-head"><h3><FaCalendarAlt style={{ marginRight:6 }} />Today's Schedule</h3></div>
          <div className="td-timeline">
            {todaySchedule.map(s => (
              <div className={`td-timeline-item td-tl-${s.status}`} key={s.id}>
                <div className="td-tl-time">{s.time}</div>
                <div className="td-tl-dot" />
                <div className="td-tl-body">
                  <strong>{s.client}</strong>
                  <span>{s.type} - {s.duration}</span>
                  <TBadge s={s.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="td-card">
          <div className="td-card-head">
            <h3><FaClock style={{ marginRight:6 }} />Pending Tasks</h3>
            <span className="td-badge td-badge-red">{tasks.filter(t => !t.done).length} pending</span>
          </div>
          <div className="td-tasks">
            {tasks.map(t => (
              <div className={`td-task ${t.done ? "td-task-done" : ""}`} key={t.id}>
                <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
                <span className="td-task-text">{t.task}</span>
                <TBadge s={t.priority} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="td-card">
        <div className="td-card-head">
          <h3><FaUsers style={{ marginRight:6 }} />Active Clients</h3>
          <button className="td-link-btn" onClick={() => setSection("my-clients")}>View All</button>
        </div>
        <div className="td-client-mini-grid">
          {clients.filter(c => c.status === "active").slice(0, 4).map(c => (
            <div className="td-client-mini" key={c.id} onClick={() => { setSelectedClient(c); setSection("clientProfile"); }}>
              <img src={c.photo} alt={c.name} />
              <strong>{c.name}</strong>
              <span>{c.plan}</span>
              <div className="td-mini-progress">
                <div style={{ flex:1, height:5, background:"var(--border-color)", borderRadius:3, overflow:"hidden" }}>
                  <div style={{ width:`${c.progress}%`, height:"100%", background:"var(--accent)", borderRadius:3 }} />
                </div>
                <span>{c.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="td-two-col">
        <div className="td-card">
          <div className="td-card-head"><h3><FaChartBar style={{ marginRight:6 }} />Monthly Revenue</h3></div>
          <BarChart data={r.monthlyRevenue} labels={months} color="var(--accent)" height={120} />
        </div>
        <div className="td-card">
          <div className="td-card-head"><h3><FaChartLine style={{ marginRight:6 }} />Session Stats</h3></div>
          <div className="td-session-stats-grid">
            {[["Completed",r.sessionStats.completed,"#22c55e"],["Missed",r.sessionStats.missed,"#ef4444"],["Upcoming",r.sessionStats.upcoming,"#3b82f6"],["Total",r.sessionStats.total,"var(--accent)"]].map(([label,val,color]) => (
              <div key={label} className="td-stat-box" style={{ borderColor:color }}>
                <strong style={{ color }}>{val}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// MY CLIENTS
function TrainerClients({ setSection, setSelectedClient }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const filtered = clients.filter(c =>
    (filter === "all" || c.status === filter) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="td-section">
      <div className="td-section-head">
        <h2><FaUsers style={{ marginRight:8 }} />My Clients</h2>
        <button className="btn btn-primary td-btn-sm"><FaPlus style={{ marginRight:6 }} />Add Client</button>
      </div>
      <div className="td-kpi-grid" style={{ gridTemplateColumns:"repeat(4,1fr)" }}>
        <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#22c55e22", color:"#22c55e" }}><FaUsers /></div><div><strong>{clients.filter(c=>c.status==="active").length}</strong><span>Active</span></div></div>
        <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#ef444422", color:"#ef4444" }}><FaUsers /></div><div><strong>{clients.filter(c=>c.status==="inactive").length}</strong><span>Inactive</span></div></div>
        <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#3b82f622", color:"#3b82f6" }}><FaCalendarAlt /></div><div><strong>{clients.reduce((s,c)=>s+c.sessions,0)}</strong><span>Total Sessions</span></div></div>
        <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#f9731622", color:"var(--accent)" }}><FaChartBar /></div><div><strong>{Math.round(clients.reduce((s,c)=>s+c.progress,0)/clients.length)}%</strong><span>Avg Progress</span></div></div>
      </div>
      <div className="td-filters">
        <div style={{ position:"relative" }}>
          <FaSearch style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"var(--text-secondary)", fontSize:".8rem" }} />
          <input className="td-input" placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft:30, maxWidth:240 }} />
        </div>
        {["all","active","inactive"].map(f => (
          <button key={f} className={`td-filter-btn ${filter === f ? "td-filter-active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      {filtered.length === 0 ? <EmptyState title="No clients found" desc="Try adjusting your search or filters." /> : (
        <div className="td-clients-grid">
          {filtered.map(c => (
            <div className="td-client-card" key={c.id} onClick={() => { setSelectedClient(c); setSection("clientProfile"); }}>
              <div className="td-client-card-top">
                <img src={c.photo} alt={c.name} className="td-client-photo" />
                <TBadge s={c.status} />
              </div>
              <h4>{c.name}</h4>
              <span className="td-client-plan">{c.plan}</span>
              <div className="td-client-meta">
                <span><FaCalendarAlt style={{ marginRight:4 }} />{c.lastVisit}</span>
                <span><FaDumbbell style={{ marginRight:4 }} />{c.sessions} sessions</span>
                <span><FaCheckCircle style={{ marginRight:4 }} />{c.goal}</span>
              </div>
              <div className="td-progress-row"><span>Progress</span><span>{c.progress}%</span></div>
              <div className="td-progress-bar"><div className="td-progress-fill" style={{ width:`${c.progress}%` }} /></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// CLIENT PROFILE
function ClientProfile({ client, setSection }) {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState(clientProgressNotes);
  const [tab, setTab] = useState("overview");
  const { toast, show } = useToast();
  const addNote = () => {
    if (!note.trim()) return;
    setNotes(p => [{ date:"Today", note, trainer:"Vikram" }, ...p]);
    setNote(""); show("Note added!");
  };
  if (!client) return <div className="td-section"><EmptyState title="No client selected" /></div>;
  const cGoals = clientGoals.filter(g => g.clientId === client.id);
  const cAtt = clientAttendance.filter(a => a.clientId === client.id);
  return (
    <div className="td-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="td-section-head">
        <button className="td-back-btn" onClick={() => setSection("my-clients")}><FaArrowLeft style={{ marginRight:6 }} />Back</button>
        <h2>Client Profile</h2>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn btn-primary td-btn-sm" onClick={() => show("Plan assigned!")}><FaClipboardList style={{ marginRight:6 }} />Assign Plan</button>
          <button className="btn btn-outline td-btn-sm" onClick={() => setSection("messages")}><FaEnvelope style={{ marginRight:6 }} />Message</button>
        </div>
      </div>
      <div className="td-profile-grid">
        <div className="td-card td-profile-left">
          <img src={client.photo} alt={client.name} className="td-profile-photo" />
          <h3>{client.name}</h3>
          <TBadge s={client.status} />
          <div className="td-profile-stats">
            {[["Plan",client.plan],["Goal",client.goal],["Weight",client.weight],["Sessions",client.sessions],["Joined",client.joined],["Last Visit",client.lastVisit],["Age",client.age],["Phone",client.phone]].map(([l,v]) => (
              <div key={l}><span>{l}</span><strong>{v}</strong></div>
            ))}
          </div>
          <div className="td-progress-row"><span>Overall Progress</span><span>{client.progress}%</span></div>
          <div className="td-progress-bar"><div className="td-progress-fill" style={{ width:`${client.progress}%` }} /></div>
        </div>
        <div className="td-profile-right">
          <div className="td-tabs">
            {["overview","goals","attendance","notes"].map(t => (
              <button key={t} className={`td-tab ${tab === t ? "td-tab-active" : ""}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
            ))}
          </div>
          {tab === "overview" && (
            <div className="td-card">
              <div className="td-card-head"><h3><FaChartBar style={{ marginRight:6 }} />Performance</h3></div>
              <div className="td-perf-chart">
                {[["Strength",78],["Cardio",65],["Flexibility",55],["Consistency",88],["Nutrition",70]].map(([l,v]) => (
                  <div className="td-perf-row" key={l}>
                    <span>{l}</span>
                    <div className="td-perf-bar-wrap"><div className="td-perf-bar" style={{ width:`${v}%` }} /></div>
                    <span>{v}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === "goals" && (
            <div className="td-card">
              <div className="td-card-head"><h3><FaTrophy style={{ marginRight:6 }} />Goals</h3></div>
              {cGoals.length === 0 ? <EmptyState icon="target" title="No goals set" /> : cGoals.map(g => (
                <div key={g.id} style={{ padding:"12px 0", borderBottom:"1px solid var(--border-color)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <strong style={{ fontSize:".88rem" }}>{g.goal}</strong><TBadge s={g.status} />
                  </div>
                  <div style={{ fontSize:".75rem", color:"var(--text-secondary)", marginBottom:6 }}>Target: {g.target} - Current: {g.current} - Deadline: {g.deadline}</div>
                  <ProgressBar value={g.progress} color={g.status === "achieved" ? "#22c55e" : "var(--accent)"} />
                </div>
              ))}
            </div>
          )}
          {tab === "attendance" && (
            <div className="td-card">
              <div className="td-card-head"><h3><FaCalendarCheck style={{ marginRight:6 }} />Attendance History</h3></div>
              {cAtt.length === 0 ? <EmptyState title="No records" /> : (
                <table className="td-table">
                  <thead><tr><th>Date</th><th>Session</th><th>Duration</th><th>Status</th></tr></thead>
                  <tbody>{cAtt.map(a => <tr key={a.id}><td style={{ fontSize:".8rem" }}>{a.date}</td><td>{a.session}</td><td>{a.duration}</td><td><TBadge s={a.status} /></td></tr>)}</tbody>
                </table>
              )}
            </div>
          )}
          {tab === "notes" && (
            <div className="td-card">
              <div className="td-card-head"><h3><FaStickyNote style={{ marginRight:6 }} />Progress Notes</h3></div>
              <div className="td-notes-list">
                {notes.map((n, i) => (
                  <div className="td-note" key={i}>
                    <div className="td-note-head"><strong>{n.date}</strong><span>{n.trainer}</span></div>
                    <p>{n.note}</p>
                  </div>
                ))}
              </div>
              <div className="td-note-input">
                <textarea className="td-textarea" placeholder="Add progress note..." value={note} onChange={e => setNote(e.target.value)} rows={3} />
                <button className="btn btn-primary td-btn-sm" onClick={addNote}>Add Note</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// PROGRESS TRACKER
function ProgressTracker() {
  const [selectedClient, setSelectedClient] = useState(clients[0]);
  const [metric, setMetric] = useState("weight");
  const data = clientProgressData[selectedClient.id];
  const metricData = data ? data[metric] : [];
  const metricLabels = data ? data.months : [];
  const metricColors = { weight:"#3b82f6", bodyFat:"#ef4444", strength:"#22c55e" };
  const metricUnits = { weight:"kg", bodyFat:"%", strength:"kg" };
  return (
    <div className="td-section">
      <div className="td-section-head"><h2><FaChartLine style={{ marginRight:8 }} />Progress Tracker</h2></div>
      <div className="td-filters">
        <select className="td-input" style={{ maxWidth:200 }} value={selectedClient.id} onChange={e => setSelectedClient(clients.find(c => c.id === +e.target.value))}>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {["weight","bodyFat","strength"].map(m => (
          <button key={m} className={`td-filter-btn ${metric === m ? "td-filter-active" : ""}`} onClick={() => setMetric(m)}>
            {m === "bodyFat" ? "Body Fat" : m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>
      {data ? (
        <>
          <div className="td-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
            <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#3b82f622", color:"#3b82f6" }}><FaWeight /></div><div><strong>{data.weight[data.weight.length-1]} kg</strong><span>Current Weight</span><small>Started: {data.weight[0]} kg</small></div></div>
            <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#ef444422", color:"#ef4444" }}><FaHeartbeat /></div><div><strong>{data.bodyFat[data.bodyFat.length-1]}%</strong><span>Body Fat</span><small>Started: {data.bodyFat[0]}%</small></div></div>
            <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#22c55e22", color:"#22c55e" }}><FaDumbbell /></div><div><strong>{data.strength[data.strength.length-1]} kg</strong><span>Strength (1RM)</span><small>Started: {data.strength[0]} kg</small></div></div>
          </div>
          <div className="td-card">
            <div className="td-card-head">
              <h3>{metric === "bodyFat" ? "Body Fat" : metric.charAt(0).toUpperCase() + metric.slice(1)} Trend - {selectedClient.name}</h3>
              <span className="td-badge td-badge-blue">12 months</span>
            </div>
            <BarChart data={metricData} labels={metricLabels} color={metricColors[metric]} height={130} />
            <p style={{ fontSize:".75rem", color:"var(--text-secondary)", marginTop:8 }}>
              Change: {metricData[0]} to {metricData[metricData.length-1]} {metricUnits[metric]}
              <span style={{ color: metric === "weight" || metric === "bodyFat" ? "#22c55e" : "var(--accent)", marginLeft:8, fontWeight:700 }}>
                ({metric === "weight" || metric === "bodyFat" ? "Down" : "Up"} {Math.abs(metricData[metricData.length-1] - metricData[0]).toFixed(1)} {metricUnits[metric]})
              </span>
            </p>
          </div>
          <div className="td-card">
            <div className="td-card-head"><h3>All Metrics Overview</h3></div>
            {[["Weight",data.weight[data.weight.length-1],data.weight[0],"kg","#3b82f6",true],["Body Fat",data.bodyFat[data.bodyFat.length-1],data.bodyFat[0],"%","#ef4444",true],["Strength",data.strength[data.strength.length-1],data.strength[0],"kg","#22c55e",false]].map(([label,curr,start,unit,color,lower]) => {
              const pct = lower ? ((start - curr) / start * 100) : ((curr - start) / start * 100);
              return (
                <div key={label} style={{ marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:".85rem", marginBottom:5 }}>
                    <span><strong>{label}</strong></span>
                    <span style={{ color }}>{curr} {unit} <span style={{ color:"var(--text-secondary)", fontSize:".75rem" }}>(from {start} {unit})</span></span>
                  </div>
                  <ProgressBar value={Math.abs(pct)} color={color} />
                  <span style={{ fontSize:".72rem", color }}>{pct.toFixed(1)}% improvement</span>
                </div>
              );
            })}
          </div>
        </>
      ) : <EmptyState title="No progress data" desc="Progress data not available for this client yet." />}
    </div>
  );
}

// GOALS
function ClientGoals() {
  const [goals, setGoals] = useState(clientGoals);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ clientName:"", goal:"", type:"weight_loss", target:"", deadline:"" });
  const { toast, show } = useToast();
  const save = () => {
    if (!form.goal || !form.clientName) return;
    setGoals(prev => [...prev, { ...form, id:Date.now(), clientId:0, current:"--", status:"in-progress", progress:0 }]);
    setForm({ clientName:"", goal:"", type:"weight_loss", target:"", deadline:"" });
    setShowAdd(false); show("Goal created!");
  };
  const markAchieved = (id) => { setGoals(prev => prev.map(g => g.id === id ? { ...g, status:"achieved", progress:100 } : g)); show("Goal achieved!"); };
  const filtered = goals.filter(g => filter === "all" || g.status === filter);
  return (
    <div className="td-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="td-section-head">
        <h2><FaTrophy style={{ marginRight:8 }} />Client Goals</h2>
        <button className="btn btn-primary td-btn-sm" onClick={() => setShowAdd(true)}><FaPlus style={{ marginRight:6 }} />Add Goal</button>
      </div>
      <div className="td-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#f59e0b22", color:"#f59e0b" }}><FaTrophy /></div><div><strong>{goals.length}</strong><span>Total Goals</span></div></div>
        <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#22c55e22", color:"#22c55e" }}><FaCheckCircle /></div><div><strong>{goals.filter(g=>g.status==="achieved").length}</strong><span>Achieved</span></div></div>
        <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#f9731622", color:"var(--accent)" }}><FaClock /></div><div><strong>{goals.filter(g=>g.status==="in-progress").length}</strong><span>In Progress</span></div></div>
      </div>
      <div className="td-filters">
        {["all","in-progress","achieved"].map(f => (
          <button key={f} className={`td-filter-btn ${filter === f ? "td-filter-active" : ""}`} onClick={() => setFilter(f)}>{f.replace("-"," ")}</button>
        ))}
      </div>
      <div className="td-goals-grid">
        {filtered.map(g => (
          <div className="td-card td-goal-card" key={g.id}>
            <div className="td-goal-head">
              <div><strong>{g.goal}</strong><span style={{ fontSize:".75rem", color:"var(--accent)", display:"block" }}>{g.clientName}</span></div>
              <TBadge s={g.status} />
            </div>
            <div className="td-goal-meta">
              <span>Target: <strong>{g.target}</strong></span>
              <span>Current: <strong>{g.current}</strong></span>
              <span>Deadline: <strong>{g.deadline}</strong></span>
            </div>
            <div style={{ marginTop:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:".78rem", marginBottom:4 }}><span>Progress</span><span>{g.progress}%</span></div>
              <ProgressBar value={g.progress} color={g.status === "achieved" ? "#22c55e" : "var(--accent)"} />
            </div>
            {g.status !== "achieved" && (
              <button className="td-link-btn" style={{ marginTop:10, color:"#22c55e" }} onClick={() => markAchieved(g.id)}>Mark Achieved</button>
            )}
          </div>
        ))}
      </div>
      {showAdd && (
        <TModal title="Add Client Goal" onClose={() => setShowAdd(false)}>
          <div className="td-form-group"><label>Client</label>
            <select className="td-input" value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName:e.target.value }))}>
              <option value="">-- Select client --</option>
              {clients.map(c => <option key={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="td-form-group"><label>Goal Description</label><input className="td-input" placeholder="e.g. Lose 5kg" value={form.goal} onChange={e => setForm(f => ({ ...f, goal:e.target.value }))} /></div>
          <div className="td-form-group"><label>Type</label>
            <select className="td-input" value={form.type} onChange={e => setForm(f => ({ ...f, type:e.target.value }))}>
              <option value="weight_loss">Weight Loss</option><option value="strength">Strength</option><option value="cardio">Cardio</option><option value="flexibility">Flexibility</option>
            </select>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div className="td-form-group"><label>Target</label><input className="td-input" placeholder="e.g. 70 kg" value={form.target} onChange={e => setForm(f => ({ ...f, target:e.target.value }))} /></div>
            <div className="td-form-group"><label>Deadline</label><input className="td-input" type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline:e.target.value }))} /></div>
          </div>
          <button className="btn btn-primary" style={{ width:"100%", marginTop:8 }} onClick={save}>Create Goal</button>
        </TModal>
      )}
    </div>
  );
}

// ATTENDANCE
function ClientAttendanceView() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [showMark, setShowMark] = useState(false);
  const { toast, show } = useToast();
  const PER = 6;
  const filtered = clientAttendance.filter(a =>
    (filter === "all" || a.status === filter) &&
    a.clientName.toLowerCase().includes(search.toLowerCase())
  );
  const paged = filtered.slice((page-1)*PER, page*PER);
  return (
    <div className="td-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="td-section-head">
        <h2><FaCalendarCheck style={{ marginRight:8 }} />Client Attendance</h2>
        <button className="btn btn-primary td-btn-sm" onClick={() => setShowMark(true)}><FaPlus style={{ marginRight:6 }} />Mark Attendance</button>
      </div>
      <div className="td-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#22c55e22", color:"#22c55e" }}><FaCheckCircle /></div><div><strong>{clientAttendance.filter(a=>a.status==="present").length}</strong><span>Present</span></div></div>
        <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#ef444422", color:"#ef4444" }}><FaClock /></div><div><strong>{clientAttendance.filter(a=>a.status==="absent").length}</strong><span>Absent</span></div></div>
        <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#f9731622", color:"var(--accent)" }}><FaChartBar /></div><div><strong>{Math.round(clientAttendance.filter(a=>a.status==="present").length/clientAttendance.length*100)}%</strong><span>Attendance Rate</span></div></div>
      </div>
      <div className="td-filters">
        <div style={{ position:"relative" }}>
          <FaSearch style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"var(--text-secondary)", fontSize:".8rem" }} />
          <input className="td-input" placeholder="Search client..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ paddingLeft:30, maxWidth:220 }} />
        </div>
        {["all","present","absent"].map(f => (
          <button key={f} className={`td-filter-btn ${filter === f ? "td-filter-active" : ""}`} onClick={() => { setFilter(f); setPage(1); }}>{f}</button>
        ))}
      </div>
      <div className="td-card">
        {paged.length === 0 ? <EmptyState title="No records found" /> : (
          <table className="td-table">
            <thead><tr><th>Client</th><th>Date</th><th>Session</th><th>Duration</th><th>Status</th></tr></thead>
            <tbody>{paged.map(a => <tr key={a.id}><td><strong>{a.clientName}</strong></td><td style={{ fontSize:".8rem" }}>{a.date}</td><td>{a.session}</td><td>{a.duration}</td><td><TBadge s={a.status} /></td></tr>)}</tbody>
          </table>
        )}
        <Pagination total={filtered.length} page={page} perPage={PER} onChange={setPage} />
      </div>
      {showMark && (
        <TModal title="Mark Attendance" onClose={() => setShowMark(false)}>
          <div className="td-form-group"><label>Client</label><select className="td-input"><option value="">-- Select --</option>{clients.map(c => <option key={c.id}>{c.name}</option>)}</select></div>
          <div className="td-form-group"><label>Session</label><select className="td-input"><option>PT Session</option><option>Group Class</option><option>HIIT Blast</option></select></div>
          <div className="td-form-group"><label>Date</label><input className="td-input" type="date" defaultValue="2026-05-06" /></div>
          <div className="td-form-group"><label>Status</label><select className="td-input"><option value="present">Present</option><option value="absent">Absent</option></select></div>
          <button className="btn btn-primary" style={{ width:"100%", marginTop:8 }} onClick={() => { setShowMark(false); show("Attendance marked!"); }}>Save</button>
        </TModal>
      )}
    </div>
  );
}

// CALENDAR VIEW
function TrainerCalendar() {
  const days = ["Mon 5","Tue 6","Wed 7","Thu 8","Fri 9","Sat 10","Sun 11"];
  const [selected, setSelected] = useState(null);
  const { toast, show } = useToast();
  return (
    <div className="td-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="td-section-head">
        <h2><FaCalendarAlt style={{ marginRight:8 }} />Calendar View</h2>
        <button className="btn btn-primary td-btn-sm" onClick={() => show("New session added!")}><FaPlus style={{ marginRight:6 }} />New Session</button>
      </div>
      <div className="td-calendar-grid">
        {days.map((day, di) => (
          <div className="td-cal-day" key={day}>
            <div className="td-cal-day-head">{day}</div>
            {calendarEvents.filter((_, i) => i % 7 === di).map(ev => (
              <div className={`td-cal-event td-ev-${ev.type}`} key={ev.id} onClick={() => setSelected(ev)}>
                <span>{ev.time}</span>
                <span>{ev.title}</span>
              </div>
            ))}
            <button className="td-add-slot" onClick={() => show("Slot added!")}><FaPlus style={{ marginRight:4 }} />Add</button>
          </div>
        ))}
      </div>
      {selected && (
        <div className="td-card td-event-detail">
          <div className="td-card-head">
            <h3>Session Details</h3>
            <button onClick={() => setSelected(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-secondary)", fontSize:"1.1rem" }}>x</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {[["Title",selected.title],["Date",selected.date],["Time",selected.time],["Type",selected.type]].map(([l,v]) => (
              <div key={l} style={{ background:"var(--bg-primary)", borderRadius:8, padding:"10px 12px" }}>
                <span style={{ fontSize:".72rem", color:"var(--text-secondary)", display:"block" }}>{l}</span>
                <strong style={{ fontSize:".88rem" }}>{v}</strong>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:8, marginTop:12 }}>
            <button className="btn btn-primary td-btn-sm" onClick={() => { setSelected(null); show("Session updated!"); }}>Edit Session</button>
            <button className="btn btn-outline td-btn-sm" onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

// SESSIONS
function TrainerSessions() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER = 5;
  const filtered = sessions.filter(s =>
    (filter === "all" || s.status === filter) &&
    s.client.toLowerCase().includes(search.toLowerCase())
  );
  const paged = filtered.slice((page-1)*PER, page*PER);
  return (
    <div className="td-section">
      <div className="td-section-head"><h2><FaClock style={{ marginRight:8 }} />Sessions</h2></div>
      <div className="td-kpi-grid" style={{ gridTemplateColumns:"repeat(4,1fr)" }}>
        {[["Completed",sessions.filter(s=>s.status==="completed").length,"#22c55e"],["Upcoming",sessions.filter(s=>s.status==="upcoming").length,"#3b82f6"],["Missed",sessions.filter(s=>s.status==="missed").length,"#ef4444"],["Ongoing",sessions.filter(s=>s.status==="ongoing").length,"#f97316"]].map(([label,val,color]) => (
          <div className="td-kpi-card" key={label}>
            <div className="td-kpi-icon" style={{ background:color+"22", color }}><FaClock /></div>
            <div><strong>{val}</strong><span>{label}</span></div>
          </div>
        ))}
      </div>
      <div className="td-filters">
        <div style={{ position:"relative" }}>
          <FaSearch style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"var(--text-secondary)", fontSize:".8rem" }} />
          <input className="td-input" placeholder="Search client..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ paddingLeft:30, maxWidth:220 }} />
        </div>
        {["all","completed","upcoming","missed","ongoing"].map(f => (
          <button key={f} className={`td-filter-btn ${filter === f ? "td-filter-active" : ""}`} onClick={() => { setFilter(f); setPage(1); }}>{f}</button>
        ))}
      </div>
      <div className="td-card">
        {paged.length === 0 ? <EmptyState title="No sessions found" /> : (
          <table className="td-table">
            <thead><tr><th>Client</th><th>Type</th><th>Date</th><th>Time</th><th>Duration</th><th>Status</th><th>Rating</th><th>Notes</th></tr></thead>
            <tbody>
              {paged.map(s => (
                <tr key={s.id}>
                  <td><strong>{s.client}</strong></td>
                  <td><span className="td-badge td-badge-blue">{s.type}</span></td>
                  <td style={{ fontSize:".8rem" }}>{s.date}</td>
                  <td style={{ fontSize:".8rem", color:"var(--accent)", fontWeight:700 }}>{s.time}</td>
                  <td>{s.duration}</td>
                  <td><TBadge s={s.status} /></td>
                  <td>{s.rating > 0 ? Array(s.rating).fill("*").join("") : "--"}</td>
                  <td style={{ fontSize:".75rem", color:"var(--text-secondary)", maxWidth:160 }}>{s.notes || "--"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination total={filtered.length} page={page} perPage={PER} onChange={setPage} />
      </div>
    </div>
  );
}

// AVAILABILITY
function TrainerAvailability() {
  const [avail, setAvail] = useState(availability);
  const { toast, show } = useToast();
  const toggleSlot = (dayIdx, slot) => {
    setAvail(prev => prev.map((d, i) => {
      if (i !== dayIdx) return d;
      const booked = d.booked.includes(slot) ? d.booked.filter(s => s !== slot) : [...d.booked, slot];
      return { ...d, booked };
    }));
    show("Availability updated!");
  };
  return (
    <div className="td-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="td-section-head">
        <h2><FaCheckCircle style={{ marginRight:8 }} />Availability</h2>
        <button className="btn btn-outline td-btn-sm" onClick={() => show("Schedule saved!")}>Save Schedule</button>
      </div>
      <div className="td-card">
        <p style={{ fontSize:".82rem", color:"var(--text-secondary)", marginBottom:16 }}>
          <span style={{ display:"inline-block", width:12, height:12, background:"#22c55e", borderRadius:3, marginRight:6 }} />Available
          <span style={{ display:"inline-block", width:12, height:12, background:"#ef4444", borderRadius:3, marginRight:6, marginLeft:16 }} />Booked
        </p>
        <div className="td-avail-grid">
          {avail.map((day, di) => (
            <div key={day.day} className="td-avail-day">
              <div className="td-avail-day-label">{day.day}</div>
              {day.slots.length === 0 ? (
                <div style={{ fontSize:".75rem", color:"var(--text-secondary)", padding:"8px 0" }}>Day off</div>
              ) : day.slots.map(slot => (
                <div key={slot} className={`td-avail-slot ${day.booked.includes(slot) ? "td-slot-booked" : "td-slot-free"}`} onClick={() => toggleSlot(di, slot)}>{slot}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// CLASSES
const classList = [
  { id:1, name:"HIIT Blast", date:"May 5", time:"9:00 AM", enrolled:12, attended:10, status:"completed" },
  { id:2, name:"Strength Builder", date:"May 5", time:"5:30 PM", enrolled:15, attended:0, status:"upcoming" },
  { id:3, name:"CrossFit", date:"May 6", time:"6:00 PM", enrolled:8, attended:0, status:"upcoming" },
  { id:4, name:"Boxing Basics", date:"May 7", time:"7:00 PM", enrolled:10, attended:9, status:"completed" },
];

function ClassList({ openForm }) {
  const { toast, show } = useToast();
  return (
    <div className="td-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="td-section-head">
        <h2><FaDumbbell style={{ marginRight:8 }} />Class List</h2>
        <button className="btn btn-primary td-btn-sm" onClick={() => openForm("addClass")}><FaPlus style={{ marginRight:6 }} />Add Class</button>
      </div>
      <div className="td-classes-list">
        {classList.map(c => (
          <div className="td-class-item td-card" key={c.id}>
            <div className="td-class-info">
              <h4>{c.name}</h4>
              <span><FaCalendarAlt style={{ marginRight:4 }} />{c.date} - <FaClock style={{ marginRight:4 }} />{c.time}</span>
              <span><FaUsers style={{ marginRight:4 }} />{c.enrolled} enrolled</span>
            </div>
            <div className="td-class-attendance">
              <span>Attended: <strong>{c.attended}/{c.enrolled}</strong></span>
              <ProgressBar value={c.attended} max={c.enrolled} color={c.attended/c.enrolled > 0.8 ? "#22c55e" : "var(--accent)"} />
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}><TBadge s={c.status} /></div>
            <div className="td-class-actions">
              <button className="btn btn-primary td-btn-sm" onClick={() => show("Attendance marked!")}>Mark All Present</button>
              <button className="btn btn-outline td-btn-sm" onClick={() => show("Notes saved!")}><FaStickyNote style={{ marginRight:6 }} />Notes</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClassAttendanceView() {
  const [attendance, setAttendance] = useState({});
  const [selectedClass, setSelectedClass] = useState(classList[0]);
  const { toast, show } = useToast();
  const classMembers = { 1:["Aryan Mehta","Priya Sharma","Neha Joshi","Rahul Gupta","Sunita Rao"], 2:["Aryan Mehta","Neha Joshi","Sunita Rao"], 3:["Priya Sharma","Rahul Gupta","Amit Patel"], 4:["Aryan Mehta","Priya Sharma","Neha Joshi","Rahul Gupta"] };
  const members = classMembers[selectedClass.id] || [];
  const toggle = (name) => setAttendance(prev => ({ ...prev, [`${selectedClass.id}-${name}`]: !prev[`${selectedClass.id}-${name}`] }));
  return (
    <div className="td-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="td-section-head"><h2><FaCalendarCheck style={{ marginRight:8 }} />Class Attendance</h2></div>
      <div className="td-filters">
        {classList.map(c => <button key={c.id} className={`td-filter-btn ${selectedClass.id === c.id ? "td-filter-active" : ""}`} onClick={() => setSelectedClass(c)}>{c.name}</button>)}
      </div>
      <div className="td-card">
        <div className="td-card-head">
          <h3>{selectedClass.name} - {selectedClass.date} {selectedClass.time}</h3>
          <button className="btn btn-primary td-btn-sm" onClick={() => { members.forEach(m => setAttendance(prev => ({ ...prev, [`${selectedClass.id}-${m}`]:true }))); show("All marked present!"); }}>Mark All Present</button>
        </div>
        {members.map(name => {
          const key = `${selectedClass.id}-${name}`;
          const present = attendance[key] ?? false;
          return (
            <div key={name} className="td-attendance-row">
              <div className="td-avatar" style={{ width:32, height:32, fontSize:".65rem" }}>{name.split(" ").map(n=>n[0]).join("")}</div>
              <span style={{ flex:1, fontSize:".88rem" }}>{name}</span>
              <TBadge s={present ? "present" : "absent"} />
              <div className={`td-toggle ${present ? "td-toggle-on" : ""}`} onClick={() => toggle(name)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ClassPerformance() {
  const r = trainerReports;
  return (
    <div className="td-section">
      <div className="td-section-head"><h2><FaChartBar style={{ marginRight:8 }} />Class Performance</h2></div>
      <div className="td-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#22c55e22", color:"#22c55e" }}><FaTrophy /></div><div><strong>HIIT Blast</strong><span>Most Popular</span><small>94% fill rate</small></div></div>
        <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#f9731622", color:"var(--accent)" }}><FaChartBar /></div><div><strong>87%</strong><span>Avg Attendance</span><small>Across all classes</small></div></div>
        <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#3b82f622", color:"#3b82f6" }}><FaCalendarAlt /></div><div><strong>64</strong><span>Total Sessions</span><small>This month</small></div></div>
      </div>
      <div className="td-card">
        <div className="td-card-head"><h3>Class Attendance Rates</h3></div>
        {r.classAttendance.map((c, i) => (
          <div key={i} style={{ marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:".85rem", marginBottom:5 }}>
              <span><strong>{c.class}</strong> <span style={{ color:"var(--text-secondary)", fontSize:".75rem" }}>({c.sessions} sessions)</span></span>
              <span style={{ color: c.rate > 90 ? "#22c55e" : c.rate > 80 ? "var(--accent)" : "#ef4444", fontWeight:700 }}>{c.rate}%</span>
            </div>
            <ProgressBar value={c.rate} color={c.rate > 90 ? "#22c55e" : c.rate > 80 ? "var(--accent)" : "#ef4444"} />
          </div>
        ))}
      </div>
      <div className="td-two-col">
        <div className="td-card">
          <div className="td-card-head"><h3>Popular Classes</h3></div>
          {[...r.classAttendance].sort((a,b) => b.rate - a.rate).slice(0,3).map((c,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 0", borderBottom:"1px solid var(--border-color)" }}>
              <span style={{ fontSize:"1.2rem" }}>{["1st","2nd","3rd"][i]}</span>
              <div style={{ flex:1 }}><strong style={{ fontSize:".88rem" }}>{c.class}</strong></div>
              <span className="td-badge td-badge-green">{c.rate}%</span>
            </div>
          ))}
        </div>
        <div className="td-card">
          <div className="td-card-head"><h3>Needs Improvement</h3></div>
          {[...r.classAttendance].sort((a,b) => a.rate - b.rate).slice(0,2).map((c,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 0", borderBottom:"1px solid var(--border-color)" }}>
              <span style={{ fontSize:"1.2rem" }}>!</span>
              <div style={{ flex:1 }}><strong style={{ fontSize:".88rem" }}>{c.class}</strong></div>
              <span className="td-badge td-badge-orange">{c.rate}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// WORKOUT PLANS
function AllPlans() {
  const [search, setSearch] = useState("");
  const { toast, show } = useToast();
  const filtered = workoutTemplates.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="td-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="td-section-head">
        <h2><FaClipboardList style={{ marginRight:8 }} />All Plans</h2>
        <button className="btn btn-outline td-btn-sm" onClick={() => show("Exporting plans...")}><FaDownload style={{ marginRight:6 }} />Export</button>
      </div>
      <div className="td-filters">
        <div style={{ position:"relative" }}>
          <FaSearch style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"var(--text-secondary)", fontSize:".8rem" }} />
          <input className="td-input" placeholder="Search plans..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft:30, maxWidth:240 }} />
        </div>
      </div>
      <div className="td-templates-grid">
        {filtered.map(t => (
          <div className="td-template-card td-card" key={t.id}>
            <div className="td-template-level"><TBadge s={t.level} /></div>
            <h4>{t.name}</h4>
            <p style={{ fontSize:".78rem", color:"var(--text-secondary)", margin:"6px 0 10px" }}>{t.description}</p>
            <div className="td-template-meta">
              <span><FaCalendarAlt style={{ marginRight:4 }} />{t.days} days/week</span>
              <span><FaDumbbell style={{ marginRight:4 }} />{t.exercises} exercises</span>
              <span><FaUsers style={{ marginRight:4 }} />{t.clients} clients</span>
            </div>
            <div className="td-template-actions">
              <button className="btn btn-primary td-btn-sm" onClick={() => show(`${t.name} assigned!`)}>Assign</button>
              <button className="btn btn-outline td-btn-sm" onClick={() => show("Editing plan...")}><FaEdit style={{ marginRight:4 }} />Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CreatePlan() {
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState("");
  const [planName, setPlanName] = useState("");
  const [level, setLevel] = useState("Beginner");
  const { toast, show } = useToast();
  const filtered = exerciseLibrary.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
  const addExercise = (ex) => { if (!exercises.find(e => e.id === ex.id)) { setExercises(prev => [...prev, ex]); show(`${ex.name} added!`); } };
  const removeExercise = (id) => setExercises(prev => prev.filter(e => e.id !== id));
  return (
    <div className="td-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="td-section-head"><h2><FaPlus style={{ marginRight:8 }} />Create Plan</h2></div>
      <div className="td-two-col">
        <div className="td-card">
          <div className="td-card-head"><h3>Plan Details</h3></div>
          <div className="td-form-group"><label>Plan Name</label><input className="td-input" placeholder="e.g. 8-Week Strength Program" value={planName} onChange={e => setPlanName(e.target.value)} /></div>
          <div className="td-form-group"><label>Level</label>
            <select className="td-input" value={level} onChange={e => setLevel(e.target.value)}>
              <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
            </select>
          </div>
          <div className="td-form-group"><label>Days per Week</label>
            <select className="td-input"><option>3</option><option>4</option><option>5</option><option>6</option></select>
          </div>
          <div className="td-form-group"><label>Description</label><textarea className="td-textarea" rows={3} placeholder="Describe the plan..." /></div>
          <div className="td-card-head" style={{ marginTop:16 }}><h3>Selected Exercises ({exercises.length})</h3></div>
          {exercises.length === 0 ? <EmptyState icon="dumbbell" title="No exercises added" desc="Search and add exercises from the library." /> : (
            <table className="td-table">
              <thead><tr><th>Exercise</th><th>Muscle</th><th>Sets</th><th></th></tr></thead>
              <tbody>{exercises.map(e => <tr key={e.id}><td><strong>{e.name}</strong></td><td>{e.muscle}</td><td>{e.sets}</td><td><button className="td-link-btn" style={{ color:"#ef4444" }} onClick={() => removeExercise(e.id)}><FaTrash /></button></td></tr>)}</tbody>
            </table>
          )}
          <button className="btn btn-primary" style={{ width:"100%", marginTop:16 }} onClick={() => { if(planName && exercises.length > 0) show("Plan created!"); else show("Add a name and exercises first!"); }}>Create Plan</button>
        </div>
        <div className="td-card">
          <div className="td-card-head"><h3>Exercise Library</h3></div>
          <div style={{ position:"relative", marginBottom:12 }}>
            <FaSearch style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"var(--text-secondary)", fontSize:".8rem" }} />
            <input className="td-input" placeholder="Search exercises..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft:30 }} />
          </div>
          <table className="td-table">
            <thead><tr><th>Exercise</th><th>Muscle</th><th>Sets</th><th></th></tr></thead>
            <tbody>{filtered.map(e => <tr key={e.id}><td><strong>{e.name}</strong></td><td>{e.muscle}</td><td>{e.sets}</td><td><button className="td-link-btn" onClick={() => addExercise(e)}><FaPlus /></button></td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AssignPlans({ openForm }) {
  const { toast, show } = useToast();
  return (
    <div className="td-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="td-section-head">
        <h2><FaUserPlus style={{ marginRight:8 }} />Assign Plans</h2>
        <button className="btn btn-primary td-btn-sm" onClick={() => openForm("assignPlan")}><FaPlus style={{ marginRight:6 }} />New Assignment</button>
      </div>
      <div className="td-card">
        <table className="td-table">
          <thead><tr><th>Client</th><th>Plan</th><th>Assigned</th><th>Progress</th><th>Next Review</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {assignedPlans.map(p => (
              <tr key={p.id}>
                <td><strong>{p.client}</strong></td>
                <td>{p.plan}</td>
                <td style={{ fontSize:".78rem", color:"var(--text-secondary)" }}>{p.assignedDate}</td>
                <td>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ flex:1, minWidth:80 }}><ProgressBar value={p.progress} /></div>
                    <span style={{ fontSize:".78rem", fontWeight:700 }}>{p.progress}%</span>
                  </div>
                </td>
                <td style={{ fontSize:".78rem" }}>{p.nextReview}</td>
                <td><TBadge s={p.status} /></td>
                <td>
                  <div style={{ display:"flex", gap:6 }}>
                    <button className="td-link-btn" onClick={() => show("Editing...")}><FaEdit /></button>
                    <button className="td-link-btn" style={{ color:"#ef4444" }} onClick={() => show("Removed")}><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── NUTRITION: DIET PLANS ────────────────────────────────────────────────────
function DietPlans({ openForm }) {
  const { toast, show } = useToast();
  return (
    <div className="td-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="td-section-head">
        <h2><FaAppleAlt style={{ marginRight:8 }} />Diet Plans</h2>
        <button className="btn btn-primary td-btn-sm" onClick={() => openForm("addDietPlan")}><FaPlus style={{ marginRight:6 }} />New Plan</button>
      </div>
      <div className="td-card">
        <table className="td-table">
          <thead><tr><th>Client</th><th>Plan Name</th><th>Calories</th><th>Protein</th><th>Carbs</th><th>Fat</th><th>Status</th></tr></thead>
          <tbody>
            {dietPlans.map((p, i) => (
              <tr key={i}>
                <td><strong>{p.client}</strong></td>
                <td>{p.planName}</td>
                <td>{p.calories} kcal</td>
                <td>{p.protein}g</td>
                <td>{p.carbs}g</td>
                <td>{p.fat}g</td>
                <td><TBadge s={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── NUTRITION: MEAL TRACKING ─────────────────────────────────────────────────
function MealTracking({ openForm }) {
  const { toast, show } = useToast();
  return (
    <div className="td-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="td-section-head">
        <h2><FaFire style={{ marginRight:8 }} />Meal Tracking</h2>
        <button className="btn btn-primary td-btn-sm" onClick={() => openForm("logMeal")}><FaPlus style={{ marginRight:6 }} />Log Meal</button>
      </div>
      <div className="td-card">
        <table className="td-table">
          <thead><tr><th>Client</th><th>Date</th><th>Meal</th><th>Calories</th><th>Protein</th><th>Notes</th></tr></thead>
          <tbody>
            {mealTracking.map((m, i) => (
              <tr key={i}>
                <td><strong>{m.client}</strong></td>
                <td style={{ fontSize:".78rem", color:"var(--text-secondary)" }}>{m.date}</td>
                <td>{m.meal}</td>
                <td>{m.calories} kcal</td>
                <td>{m.protein}g</td>
                <td style={{ fontSize:".78rem", color:"var(--text-secondary)" }}>{m.notes || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── NUTRITION: WATER INTAKE ──────────────────────────────────────────────────
function WaterIntakeView() {
  return (
    <div className="td-section">
      <div className="td-section-head"><h2><FaTint style={{ marginRight:8 }} />Water Intake</h2></div>
      <div className="td-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <div className="td-kpi-card">
          <div className="td-kpi-icon" style={{ background:"rgba(59,130,246,.15)", color:"#3b82f6", fontSize:"1.4rem" }}><FaTint /></div>
          <div><strong>2.9L</strong><span>Avg Daily (This Week)</span></div>
        </div>
        <div className="td-kpi-card">
          <div className="td-kpi-icon" style={{ background:"rgba(34,197,94,.15)", color:"#22c55e", fontSize:"1.4rem" }}><FaCheckCircle /></div>
          <div><strong>{waterIntake.length}</strong><span>Clients Tracked</span></div>
        </div>
        <div className="td-kpi-card">
          <div className="td-kpi-icon" style={{ background:"rgba(239,68,68,.15)", color:"#ef4444", fontSize:"1.4rem" }}><FaHeartbeat /></div>
          <div><strong>1</strong><span>Below Goal</span></div>
        </div>
      </div>
      {waterIntake.map(w => {
        const avg = (w.logged.reduce((a, b) => a + b, 0) / w.logged.length).toFixed(1);
        const pct = Math.round((avg / w.target) * 100);
        return (
          <div className="td-card" key={w.clientId}>
            <div className="td-card-head">
              <h3>{w.clientName}</h3>
              <span style={{ fontSize:".8rem", color:"var(--text-secondary)" }}>Target: {w.target}L/day</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <strong style={{ color: pct >= 100 ? "#22c55e" : pct >= 75 ? "#f97316" : "#ef4444" }}>{avg}L avg</strong>
              <div style={{ flex:1 }}><ProgressBar value={pct} color={pct >= 100 ? "#22c55e" : pct >= 75 ? "#f97316" : "#ef4444"} /></div>
              <span style={{ fontSize:".75rem", fontWeight:700 }}>{pct}%</span>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              {w.days.map((day, i) => {
                const dayPct = Math.round((w.logged[i] / w.target) * 100);
                return (
                  <div key={day} style={{ flex:1, textAlign:"center" }}>
                    <div style={{ fontSize:".65rem", color:"var(--text-secondary)", marginBottom:4 }}>{day}</div>
                    <div style={{ height:50, background:"var(--bg-primary)", borderRadius:4, position:"relative", overflow:"hidden" }}>
                      <div style={{ position:"absolute", bottom:0, width:"100%", height:`${Math.min(dayPct,100)}%`, background: dayPct >= 100 ? "#22c55e" : "#3b82f6", borderRadius:4, transition:"height .3s" }} />
                    </div>
                    <div style={{ fontSize:".65rem", marginTop:3, fontWeight:700 }}>{w.logged[i]}L</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── COMMUNICATION: MESSAGES ──────────────────────────────────────────────────
function TrainerMessages() {
  const [selected, setSelected] = useState(trainerMessages[0]);
  const [reply, setReply] = useState("");
  const { toast, show } = useToast();
  return (
    <div className="td-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="td-section-head"><h2><FaEnvelope style={{ marginRight:8 }} />Messages</h2></div>
      <div className="td-two-col">
        <div className="td-card" style={{ maxHeight:480, overflowY:"auto" }}>
          <div className="td-card-head">
            <h3>Inbox</h3>
            <span className="td-badge td-badge-orange">{trainerMessages.filter(m => m.unread > 0).length} new</span>
          </div>
          {trainerMessages.map(m => (
            <div
              key={m.id}
              onClick={() => setSelected(m)}
              style={{ padding:"10px 14px", cursor:"pointer", borderBottom:"1px solid var(--border-color)", background: selected?.id === m.id ? "rgba(var(--accent-rgb),.08)" : "transparent", borderRadius:6 }}
            >
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div className="td-avatar" style={{ width:30, height:30, fontSize:".65rem" }}>{m.avatar}</div>
                  <strong style={{ fontSize:".85rem" }}>{m.client}</strong>
                </div>
                <small style={{ color:"var(--text-secondary)" }}>{m.time}</small>
              </div>
              <p style={{ fontSize:".78rem", color:"var(--text-secondary)", margin:"4px 0 0 38px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{m.lastMsg}</p>
              {m.unread > 0 && <span className="td-badge td-badge-orange" style={{ fontSize:".65rem", marginLeft:38 }}>{m.unread} new</span>}
            </div>
          ))}
        </div>
        <div className="td-card">
          {selected ? (
            <>
              <div className="td-card-head">
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div className="td-avatar" style={{ width:36, height:36, fontSize:".7rem" }}>{selected.avatar}</div>
                  <div>
                    <strong>{selected.client}</strong>
                    <div style={{ fontSize:".72rem", color:"var(--text-secondary)" }}>{selected.time}</div>
                  </div>
                </div>
              </div>
              <div style={{ padding:"12px 0", fontSize:".88rem", lineHeight:1.6, color:"var(--text-secondary)", borderBottom:"1px solid var(--border-color)", marginBottom:12 }}>
                {selected.lastMsg}
              </div>
              <textarea
                className="td-input"
                rows={3}
                placeholder="Type your reply..."
                value={reply}
                onChange={e => setReply(e.target.value)}
                style={{ width:"100%", resize:"vertical" }}
              />
              <button className="btn btn-primary td-btn-sm" style={{ marginTop:8 }} onClick={() => { show("Reply sent!"); setReply(""); }}>
                <FaPaperPlane style={{ marginRight:6 }} />Send Reply
              </button>
            </>
          ) : <div style={{ padding:40, textAlign:"center", color:"var(--text-secondary)" }}>Select a message</div>}
        </div>
      </div>
    </div>
  );
}

// ─── COMMUNICATION: NOTIFICATIONS ────────────────────────────────────────────
function TrainerNotifications() {
  const [notifs, setNotifs] = useState(trainerNotifications);
  const markAll = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const unread = notifs.filter(n => !n.read).length;
  return (
    <div className="td-section">
      <div className="td-section-head">
        <h2><FaBell style={{ marginRight:8 }} />Notifications</h2>
        {unread > 0 && <button className="btn btn-outline td-btn-sm" onClick={markAll}>Mark All Read</button>}
      </div>
      <div className="td-card">
        {notifs.length === 0 ? (
          <div style={{ padding:40, textAlign:"center", color:"var(--text-secondary)" }}>No notifications</div>
        ) : notifs.map(n => (
          <div
            key={n.id}
            style={{ display:"flex", gap:12, padding:"12px 16px", borderBottom:"1px solid var(--border-color)", background: !n.read ? "rgba(var(--accent-rgb),.04)" : "transparent", cursor:"pointer" }}
            onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read:true } : x))}
          >
            <div style={{ fontSize:"1.2rem", marginTop:2 }}>{n.icon || "🔔"}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <strong style={{ fontSize:".85rem" }}>{n.title}</strong>
                <small style={{ color:"var(--text-secondary)" }}>{n.time}</small>
              </div>
              <p style={{ fontSize:".78rem", color:"var(--text-secondary)", margin:"2px 0 0" }}>{n.message}</p>
            </div>
            {!n.read && <div style={{ width:8, height:8, borderRadius:"50%", background:"var(--accent)", marginTop:6, flexShrink:0 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── COMMUNICATION: ANNOUNCEMENTS ────────────────────────────────────────────
function TrainerAnnouncements() {
  const { toast, show } = useToast();
  const items = [
    { id:1, title:"New Class Schedule Released", date:"May 5, 2026", body:"Updated weekly schedule is now live. Please review your assigned slots.", priority:"high" },
    { id:2, title:"Equipment Maintenance Notice", date:"May 3, 2026", body:"The free weights area will be closed for maintenance on May 8th from 6–9 AM.", priority:"medium" },
    { id:3, title:"Monthly Performance Review", date:"Apr 28, 2026", body:"Performance reviews for April are due by May 10th. Please submit your self-assessment.", priority:"low" },
    { id:4, title:"New Member Orientation", date:"Apr 25, 2026", body:"15 new members joining next week. Orientation session on May 7th at 10 AM.", priority:"medium" },
  ];
  const colors = { high:"#ef4444", medium:"#f97316", low:"#3b82f6" };
  return (
    <div className="td-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="td-section-head"><h2><FaBullhorn style={{ marginRight:8 }} />Announcements</h2></div>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {items.map(a => (
          <div className="td-card" key={a.id} style={{ borderLeft:`3px solid ${colors[a.priority]}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
              <strong style={{ fontSize:".92rem" }}>{a.title}</strong>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <span style={{ fontSize:".72rem", background:`${colors[a.priority]}22`, color:colors[a.priority], padding:"2px 8px", borderRadius:50, fontWeight:700 }}>{a.priority}</span>
                <small style={{ color:"var(--text-secondary)" }}>{a.date}</small>
              </div>
            </div>
            <p style={{ fontSize:".83rem", color:"var(--text-secondary)", lineHeight:1.5, margin:0 }}>{a.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── REPORTS: CLIENT REPORTS ──────────────────────────────────────────────────
function ClientReports() {
  const { toast, show } = useToast();
  return (
    <div className="td-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="td-section-head">
        <h2><FaUsers style={{ marginRight:8 }} />Client Reports</h2>
        <button className="btn btn-outline td-btn-sm" onClick={() => show("Exporting...")}><FaDownload style={{ marginRight:6 }} />Export</button>
      </div>
      <div className="td-card">
        <table className="td-table">
          <thead><tr><th>Client</th><th>Plan</th><th>Goal</th><th>Sessions</th><th>Progress</th><th>Last Visit</th><th>Status</th></tr></thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id}>
                <td>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div className="td-avatar" style={{ width:30, height:30, fontSize:".65rem" }}>{c.avatar}</div>
                    <strong>{c.name}</strong>
                  </div>
                </td>
                <td style={{ fontSize:".8rem" }}>{c.plan}</td>
                <td style={{ fontSize:".8rem", color:"var(--text-secondary)" }}>{c.goal}</td>
                <td>{c.sessions}</td>
                <td>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ flex:1, minWidth:60 }}><ProgressBar value={c.progress} /></div>
                    <span style={{ fontSize:".75rem", fontWeight:700 }}>{c.progress}%</span>
                  </div>
                </td>
                <td style={{ fontSize:".78rem", color:"var(--text-secondary)" }}>{c.lastVisit}</td>
                <td><TBadge s={c.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── REPORTS: PROGRESS ANALYTICS ─────────────────────────────────────────────
function ProgressAnalytics() {
  const clientIds = Object.keys(clientProgressData);
  const [clientId, setClientId] = useState(clientIds[0]);
  const [metric, setMetric] = useState("weight");
  const data = clientProgressData[clientId] || {};
  const values = data[metric] || [];
  const months = data.months || [];
  const max = Math.max(...values, 1);
  const clientName = clients.find(c => c.id === Number(clientId))?.name || `Client ${clientId}`;
  return (
    <div className="td-section">
      <div className="td-section-head"><h2><FaChartLine style={{ marginRight:8 }} />Progress Analytics</h2></div>
      <div className="td-kpi-grid" style={{ gridTemplateColumns:"repeat(4,1fr)" }}>
        {[["Avg Weight Loss","3.2 kg","#22c55e"],["Avg Body Fat ↓","1.8%","#3b82f6"],["Strength Gain","50%","#f97316"],["Active Clients",clients.filter(c=>c.status==="active").length,"#8b5cf6"]].map(([l,v,c]) => (
          <div className="td-kpi-card" key={l}>
            <div className="td-kpi-icon" style={{ background:`${c}22`, color:c, fontSize:"1.2rem" }}><FaChartLine /></div>
            <div><strong>{v}</strong><span>{l}</span></div>
          </div>
        ))}
      </div>
      <div className="td-card">
        <div className="td-card-head">
          <h3>{clientName} — {metric.charAt(0).toUpperCase() + metric.slice(1)} Trend</h3>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            <div style={{ display:"flex", gap:4, marginRight:8 }}>
              {clientIds.map(id => (
                <button key={id} className={`td-filter-btn ${clientId === id ? "td-filter-active" : ""}`} onClick={() => setClientId(id)} style={{ fontSize:".7rem" }}>
                  {clients.find(c => c.id === Number(id))?.name.split(" ")[0] || id}
                </button>
              ))}
            </div>
            {["weight","bodyFat","strength"].map(m => (
              <button key={m} className={`td-filter-btn ${metric === m ? "td-filter-active" : ""}`} onClick={() => setMetric(m)} style={{ textTransform:"capitalize" }}>{m}</button>
            ))}
          </div>
        </div>
        {values.length > 0 ? (
          <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:130, padding:"8px 0" }}>
            {values.map((v, i) => (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <span style={{ fontSize:".6rem", color:"var(--text-secondary)" }}>{v}</span>
                <div style={{ width:"100%", background:"var(--accent)", borderRadius:"4px 4px 0 0", height:`${(v/max)*100}%`, opacity:.8 }} />
                <span style={{ fontSize:".6rem", color:"var(--text-secondary)" }}>{months[i]}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding:40, textAlign:"center", color:"var(--text-secondary)" }}>No data available</div>
        )}
      </div>
    </div>
  );
}

// ─── REPORTS: SESSION REPORTS ─────────────────────────────────────────────────
function SessionReports() {
  const { toast, show } = useToast();
  const r = trainerReports;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const maxRev = Math.max(...r.monthlyRevenue);
  return (
    <div className="td-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="td-section-head">
        <h2><FaChartBar style={{ marginRight:8 }} />Session Reports</h2>
        <button className="btn btn-outline td-btn-sm" onClick={() => show("Exporting report...")}><FaDownload style={{ marginRight:6 }} />Export</button>
      </div>
      <div className="td-kpi-grid" style={{ gridTemplateColumns:"repeat(4,1fr)" }}>
        <div className="td-kpi-card">
          <div className="td-kpi-icon" style={{ background:"rgba(var(--accent-rgb),.15)", fontSize:"1.3rem" }}><FaCalendarCheck /></div>
          <div><strong>{r.sessionStats.total}</strong><span>Total Sessions</span></div>
        </div>
        <div className="td-kpi-card">
          <div className="td-kpi-icon" style={{ background:"rgba(34,197,94,.15)", color:"#22c55e", fontSize:"1.3rem" }}><FaCheckCircle /></div>
          <div><strong>{r.sessionStats.completed}</strong><span>Completed</span></div>
        </div>
        <div className="td-kpi-card">
          <div className="td-kpi-icon" style={{ background:"rgba(239,68,68,.15)", color:"#ef4444", fontSize:"1.3rem" }}><FaClock /></div>
          <div><strong>{r.sessionStats.missed}</strong><span>Missed</span></div>
        </div>
        <div className="td-kpi-card">
          <div className="td-kpi-icon" style={{ background:"rgba(59,130,246,.15)", color:"#3b82f6", fontSize:"1.3rem" }}><FaCalendarAlt /></div>
          <div><strong>{r.sessionStats.upcoming}</strong><span>Upcoming</span></div>
        </div>
      </div>
      <div className="td-card">
        <div className="td-card-head"><h3>Monthly Revenue (12 months)</h3></div>
        <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:120, padding:"8px 0" }}>
          {r.monthlyRevenue.map((v, i) => (
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <span style={{ fontSize:".6rem", color:"var(--text-secondary)" }}>${(v/1000).toFixed(1)}k</span>
              <div style={{ width:"100%", background:"var(--accent)", borderRadius:"4px 4px 0 0", height:`${(v/maxRev)*100}%`, opacity:.85 }} />
              <span style={{ fontSize:".6rem", color:"var(--text-secondary)" }}>{months[i]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="td-card">
        <div className="td-card-head"><h3>Class Attendance Rates</h3></div>
        {r.classAttendance.map((c, i) => (
          <div key={i} style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:".82rem", marginBottom:4 }}>
              <span>{c.class}</span>
              <strong>{c.rate}% · {c.sessions} sessions</strong>
            </div>
            <ProgressBar value={c.rate} color={c.rate >= 90 ? "#22c55e" : c.rate >= 75 ? "#f97316" : "#ef4444"} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FEEDBACK: RATINGS ────────────────────────────────────────────────────────
function TrainerRatings() {
  const avg = trainerFeedback.length
    ? (trainerFeedback.reduce((a, b) => a + b.rating, 0) / trainerFeedback.length).toFixed(1)
    : "—";
  return (
    <div className="td-section">
      <div className="td-section-head"><h2><FaStar style={{ marginRight:8 }} />Ratings</h2></div>
      <div className="td-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <div className="td-kpi-card">
          <div className="td-kpi-icon" style={{ background:"rgba(251,191,36,.15)", color:"#fbbf24", fontSize:"1.4rem" }}><FaStar /></div>
          <div><strong>{avg}</strong><span>Average Rating</span></div>
        </div>
        <div className="td-kpi-card">
          <div className="td-kpi-icon" style={{ background:"rgba(34,197,94,.15)", color:"#22c55e", fontSize:"1.4rem" }}><FaCheckCircle /></div>
          <div><strong>{trainerFeedback.filter(f => f.rating >= 4).length}</strong><span>Positive Reviews</span></div>
        </div>
        <div className="td-kpi-card">
          <div className="td-kpi-icon" style={{ background:"rgba(var(--accent-rgb),.15)", fontSize:"1.4rem" }}><FaUsers /></div>
          <div><strong>{trainerFeedback.length}</strong><span>Total Reviews</span></div>
        </div>
      </div>
      <div className="td-card">
        <div className="td-card-head"><h3>Rating Distribution</h3></div>
        {[5,4,3,2,1].map(star => {
          const count = trainerFeedback.filter(f => f.rating === star).length;
          const pct = trainerFeedback.length ? Math.round((count / trainerFeedback.length) * 100) : 0;
          return (
            <div key={star} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <span style={{ fontSize:".82rem", width:20, textAlign:"right", fontWeight:700 }}>{star}</span>
              <FaStar style={{ color:"#fbbf24", fontSize:".75rem" }} />
              <div style={{ flex:1 }}><ProgressBar value={pct} color="#fbbf24" /></div>
              <span style={{ fontSize:".75rem", color:"var(--text-secondary)", width:36 }}>{count} ({pct}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── FEEDBACK: REVIEWS ────────────────────────────────────────────────────────
function TrainerReviews() {
  return (
    <div className="td-section">
      <div className="td-section-head"><h2><FaComments style={{ marginRight:8 }} />Reviews</h2></div>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {trainerFeedback.map((f, i) => (
          <div className="td-card" key={i}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
              <div>
                <strong style={{ fontSize:".88rem" }}>{f.client}</strong>
                <div style={{ display:"flex", gap:2, marginTop:3 }}>
                  {Array.from({ length: 5 }, (_, j) => (
                    <FaStar key={j} style={{ fontSize:".75rem", color: j < f.rating ? "#fbbf24" : "var(--border-color)" }} />
                  ))}
                </div>
              </div>
              <small style={{ color:"var(--text-secondary)" }}>{f.date}</small>
            </div>
            <p style={{ fontSize:".83rem", color:"var(--text-secondary)", lineHeight:1.5, margin:0 }}>{f.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function TrainerSettings() {
  const { toast, show } = useToast();
  const [form, setForm] = useState({
    name: trainerInfo.name,
    email: trainerInfo.email || "trainer@fitzone.com",
    phone: trainerInfo.phone || "",
    specialization: trainerInfo.specialization,
    bio: trainerInfo.bio || "",
    notifications: true,
    emailAlerts: true,
    darkMode: false,
  });
  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));
  return (
    <div className="td-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="td-section-head"><h2><FaCog style={{ marginRight:8 }} />Settings</h2></div>
      <div className="td-two-col">
        <div className="td-card">
          <div className="td-card-head"><h3>Profile Settings</h3></div>
          {[["Full Name","name","text"],["Email","email","email"],["Phone","phone","tel"],["Specialization","specialization","text"]].map(([label,key,type]) => (
            <div className="td-form-group" key={key}>
              <label>{label}</label>
              <input className="td-input" type={type} value={form[key]} onChange={e => set(key, e.target.value)} />
            </div>
          ))}
          <div className="td-form-group">
            <label>Bio</label>
            <textarea className="td-input" rows={3} value={form.bio} onChange={e => set("bio", e.target.value)} style={{ resize:"vertical" }} />
          </div>
          <button className="btn btn-primary td-btn-sm" style={{ marginTop:8 }} onClick={() => show("Profile saved!")}>Save Changes</button>
        </div>
        <div className="td-card">
          <div className="td-card-head"><h3>Preferences</h3></div>
          {[["Push Notifications","notifications"],["Email Alerts","emailAlerts"],["Dark Mode","darkMode"]].map(([label,key]) => (
            <div key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid var(--border-color)" }}>
              <span style={{ fontSize:".85rem" }}>{label}</span>
              <div
                onClick={() => set(key, !form[key])}
                style={{ width:40, height:22, borderRadius:11, background: form[key] ? "var(--accent)" : "var(--border-color)", cursor:"pointer", position:"relative", transition:"background .2s" }}
              >
                <div style={{ position:"absolute", top:3, left: form[key] ? 20 : 3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left .2s" }} />
              </div>
            </div>
          ))}
          <button className="btn btn-outline td-btn-sm" style={{ marginTop:16, width:"100%" }} onClick={() => show("Preferences saved!")}>Save Preferences</button>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ active, onNav, open, onClose }) {
  const [expanded, setExpanded] = useState(() => {
    const group = NAV_GROUPS.find(g => g.items.some(i => i.id === active));
    return group ? group.label : null;
  });
  const [collapsed, setCollapsed] = useState(false);
  const toggle = (label) => setExpanded(prev => prev === label ? null : label);

  return (
    <>
      <aside className={`td-sidebar ${open ? "td-sidebar-open" : ""} ${collapsed ? "td-sidebar-collapsed" : ""}`}>
        {/* Brand + collapse button */}
        <div className="td-sidebar-brand">
          {!collapsed && <span className="td-brand-text">FitZone <em>Trainer</em></span>}
          <button
            className="td-sidebar-collapse-btn"
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {/* User */}
        {!collapsed && (
          <div className="td-sidebar-user">
            <div className="td-avatar">{trainerInfo.avatar}</div>
            <div>
              <strong>{trainerInfo.name}</strong>
              <span>{trainerInfo.specialization}</span>
            </div>
          </div>
        )}

        <nav className="td-nav">
          {/* ── Dashboard: direct link, no dropdown ── */}
          <div className="td-nav-direct">
            <button
              className={`td-nav-item td-nav-direct-item ${active === DASHBOARD_ITEM.id ? "td-nav-active" : ""}`}
              onClick={() => { onNav(DASHBOARD_ITEM.id); onClose(); }}
            >
              <span
                className="td-nav-icon-bubble"
                style={{ background: `${DASHBOARD_ITEM.color}22`, color: DASHBOARD_ITEM.color }}
              >
                {DASHBOARD_ITEM.icon}
              </span>
              <span>{DASHBOARD_ITEM.label}</span>
            </button>
          </div>

          {/* ── Grouped dropdown items ── */}
          {NAV_GROUPS.map(group => {
            const isOpen = expanded === group.label;
            const hasActive = group.items.some(i => i.id === active);
            return (
              <div key={group.label} className={`td-nav-group ${hasActive ? "td-nav-group-has-active" : ""}`}>
                <button
                  className={`td-nav-group-header ${isOpen ? "td-nav-group-header-open" : ""} ${hasActive ? "td-nav-group-header-has-active" : ""}`}
                  onClick={() => toggle(group.label)}
                  aria-expanded={isOpen}
                  title={collapsed ? group.label : undefined}
                >
                  <span
                    className="td-nav-icon-bubble"
                    style={{ background: `${group.color}22`, color: group.color }}
                  >
                    {group.icon}
                  </span>
                  {!collapsed && <span className="td-nav-group-label">{group.label}</span>}
                  {!collapsed && (
                    <span className={`td-nav-chevron ${isOpen ? "td-nav-chevron-open" : ""}`}>
                      <FaAngleDown />
                    </span>
                  )}
                </button>
                <div className={`td-nav-group-items ${isOpen && !collapsed ? "td-nav-group-items-open" : ""}`}>
                  {group.items.map(n => (
                    <button
                      key={n.id}
                      className={`td-nav-item ${active === n.id ? "td-nav-active" : ""}`}
                      onClick={() => { onNav(n.id); onClose(); }}
                    >
                      <span
                        className="td-nav-icon-bubble td-nav-icon-bubble-sm"
                        style={{ background: `${n.color}22`, color: n.color }}
                      >
                        {n.icon}
                      </span>
                      <span>{n.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="td-sidebar-foot">
          <Link to="/" className="td-nav-item">
            <span className="td-nav-icon-bubble" style={{ background: "rgba(100,116,139,.15)", color: "#64748b" }}><FaHome /></span>
            <span>Back to Site</span>
          </Link>
          <Link to="/dashboard" className="td-nav-item">
            <span className="td-nav-icon-bubble" style={{ background: "rgba(249,115,22,.15)", color: "#f97316" }}><FaUserCircle /></span>
            <span>Member View</span>
          </Link>
        </div>
      </aside>
      {open && <div className="td-overlay" onClick={onClose} />}
    </>
  );
}

// ─── SECTION ROUTER ───────────────────────────────────────────────────────────
function renderSection(active, setActive, selectedClient, setSelectedClient, openForm) {
  const map = {
    home:                <TrainerHome setSection={setActive} setSelectedClient={setSelectedClient} />,
    "my-clients":        <TrainerClients setSection={setActive} setSelectedClient={setSelectedClient} />,
    clientProfile:       <ClientProfile client={selectedClient} setSection={setActive} />,
    "progress-tracker":  <ProgressTracker />,
    goals:               <ClientGoals />,
    attendance:          <ClientAttendanceView />,
    calendar:            <TrainerCalendar />,
    sessions:            <TrainerSessions />,
    availability:        <TrainerAvailability />,
    "class-list":        <ClassList openForm={openForm} />,
    "class-attendance":  <ClassAttendanceView />,
    "class-performance": <ClassPerformance />,
    "all-plans":         <AllPlans />,
    "create-plan":       <CreatePlan />,
    "assign-plans":      <AssignPlans openForm={openForm} />,
    "diet-plans":        <DietPlans openForm={openForm} />,
    "meal-tracking":     <MealTracking openForm={openForm} />,
    "water-intake":      <WaterIntakeView />,
    messages:            <TrainerMessages />,
    notifications:       <TrainerNotifications />,
    announcements:       <TrainerAnnouncements />,
    "client-reports":    <ClientReports />,
    "progress-analytics":<ProgressAnalytics />,
    "session-reports":   <SessionReports />,
    ratings:             <TrainerRatings />,
    reviews:             <TrainerReviews />,
    settings:            <TrainerSettings />,
  };
  return map[active] || (
    <div className="td-section">
      <div className="td-card" style={{ textAlign:"center", padding:"60px", color:"var(--text-secondary)" }}>
        <FaCog style={{ fontSize:"3rem", marginBottom:12, opacity:.4 }} />
        <p>Section under development.</p>
      </div>
    </div>
  );
}

// ─── TOPBAR BELL ──────────────────────────────────────────────────────────────
function TopbarBell({ onNav }) {
  const [open, setOpen] = useState(false);
  const unread = trainerNotifications.filter(n => !n.read).length;
  return (
    <div style={{ position:"relative" }}>
      <button
        style={{ background:"none", border:"none", cursor:"pointer", position:"relative", fontSize:"1.1rem", color:"var(--text-secondary)" }}
        onClick={() => setOpen(o => !o)}
      >
        <FaBell />
        {unread > 0 && <span className="td-notif-badge">{unread}</span>}
      </button>
      {open && (
        <div className="td-notif-dropdown">
          <div className="td-notif-dropdown-head">
            <strong>Notifications</strong>
            <span className="td-badge td-badge-red">{unread} new</span>
          </div>
          {trainerNotifications.slice(0, 4).map(n => (
            <div key={n.id} className={`td-notif-item ${!n.read ? "td-notif-item-unread" : ""}`}>
              <strong>{n.title}</strong>
              <p>{n.message}</p>
              <small>{n.time}</small>
            </div>
          ))}
          <button className="td-notif-view-all" onClick={() => { setOpen(false); onNav("notifications"); }}>View All</button>
        </div>
      )}
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function TrainerDashboardPage() {
  const [active, setActive]               = useState(DASHBOARD_ITEM.id);
  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const { activeForm, formData, openForm, closeForm, isOpen } = useFormModal();
  const [toast, setToast] = useState(null);
  const go = useCallback(id => setActive(id), []);

  const allItems = [DASHBOARD_ITEM, ...NAV_GROUPS.flatMap(g => g.items)];
  const currentLabel = allItems.find(i => i.id === active)?.label || "Dashboard";

  const handleFormSubmit = () => {
    closeForm();
    setToast(`✅ ${formTitles[activeForm] || "Action"} completed successfully!`);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="td-layout">
      <Sidebar active={active} onNav={go} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="td-main">
        <header className="td-topbar">
          <button className="td-menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
          <span className="td-topbar-title">Trainer Dashboard · {currentLabel}</span>
          <div className="td-topbar-right">
            <TopbarBell onNav={go} />
            <div className="td-avatar td-avatar-sm">{trainerInfo.avatar}</div>
          </div>
        </header>
        <main className="td-content">
          {renderSection(active, setActive, selectedClient, setSelectedClient, openForm)}
        </main>
      </div>

      {/* Global Form Modal */}
      <FormModal
        isOpen={isOpen}
        onClose={closeForm}
        title={formTitles[activeForm] || "Form"}
        size="md"
      >
        <FormRenderer
          formType={activeForm}
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
          accentColor="var(--accent)"
          data={{ clients, ...formData }}
        />
      </FormModal>

      {/* Global Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 10000,
          background: "var(--bg-secondary)", border: "1px solid var(--border-color)",
          borderLeft: "4px solid #22c55e", borderRadius: 10,
          padding: "14px 20px", fontSize: ".88rem", color: "var(--text-primary)",
          boxShadow: "0 8px 24px rgba(0,0,0,.2)", animation: "slideUp 0.3s ease-out",
          display: "flex", alignItems: "center", gap: 10, maxWidth: 360,
        }}>
          {toast}
          <button onClick={() => setToast(null)} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", marginLeft: "auto", fontSize: "1.1rem" }}>×</button>
        </div>
      )}
    </div>
  );
}
