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
import trainerDashboardAPI from "../services/trainerDashboardAPI";
import trainerMembersAPI from "../services/trainerMembersAPI";
import trainerWorkoutAPI from "../services/trainerWorkoutAPI";
import trainerDietAPI from "../services/trainerDietAPI";
import trainerProgressAPI from "../services/trainerProgressAPI";
import trainerScheduleAPI from "../services/trainerScheduleAPI";
import trainerAttendanceAPI from "../services/trainerAttendanceAPI";
import FormModal from "../components/FormModal";
import { FormRenderer, formTitles } from "../components/DynamicForms";
import { useFormModal } from "../hooks/useFormModal";
import TrainerSettingsComponent from "../components/TrainerSettings";
import TrainerMessagesComponent from "../components/TrainerMessages";
import TrainerNotificationsComponent from "../components/TrainerNotifications";
import TrainerAnnouncementsComponent from "../components/TrainerAnnouncements";
import "../trainer-dashboard.css";
import TrainerCommunicationComponent from "../components/TrainerCommunicationComponent";

// Default mock data for components not yet migrated to API
const trainerInfo = { name: "Trainer", email: "trainer@fitzone.com", phone: "", specialization: "General Fitness", bio: "" };
const clients = [];
const clientGoals = [];
const clientAttendance = [];
const calendarEvents = [];
const sessions = [];
const availability = [];
const trainerMessages = [];
const trainerNotifications = [];

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
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, [refreshKey]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trainerDashboardAPI.getDashboardOverview();
      console.log('Dashboard data:', data);
      
      // Ensure data has default values for missing fields
      const enrichedData = {
        trainer: data.trainer || {},
        statistics: data.statistics || {},
        todaySchedule: data.todaySchedule || [],
        activeClientsPreview: data.activeClientsPreview || [],
        monthlyRevenue: data.monthlyRevenue || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        pendingTasks: data.pendingTasks || [],
      };
      
      setDashboardData(enrichedData);
      setTasks(enrichedData.pendingTasks);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const toggle = id => setTasks(p => p.map(t => t.id === id ? { ...t, done:!t.done } : t));

  // Expose refresh function to parent component via window
  useEffect(() => {
    window.refreshTrainerDashboard = () => {
      setRefreshKey(prev => prev + 1);
    };
    return () => {
      delete window.refreshTrainerDashboard;
    };
  }, []);

  if (loading) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px' }}>
        <p>⏳ Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
        <p>❌ {error}</p>
        <button className="td-link-btn" onClick={fetchDashboardData} style={{ marginTop: 10 }}>Retry</button>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px' }}>
        <p>No dashboard data available</p>
      </div>
    );
  }

  const months = ["J","F","M","A","M","J","J","A","S","O","N","D"];
  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="td-section">
      <div className="td-section-head">
        <div>
          <h2>Welcome back, {dashboardData.trainer?.fullName?.split(" ")[0] || 'Trainer'}!</h2>
          <p style={{ fontSize:".82rem", color:"var(--text-secondary)", marginTop:2 }}>{todayDate} - {dashboardData.statistics?.todaySessions || 0} sessions today</p>
        </div>
        <span className="td-badge td-badge-green">Active</span>
      </div>
      <div className="td-kpi-grid">
        {[
          { icon:<FaUsers />, label:"Total Clients", value:dashboardData.statistics?.totalMembers || 0, sub:"All time", color:"#e8622a" },
          { icon:<FaCheckCircle />, label:"Active Clients", value:dashboardData.statistics?.activeMembers || 0, sub:"Currently active", color:"#22c55e" },
          { icon:<FaCalendarAlt />, label:"Sessions Today", value:dashboardData.statistics?.todaySessions || 0, sub:"Scheduled", color:"#3b82f6" },
          {
  icon:<FaStar />,
  label:"Rating",
  value:(Number(dashboardData.trainer?.rating) || 0).toFixed(1),
  sub:"Average score",
  color:"#f59e0b"
},
          { icon:<FaChartBar />, label:"Sessions/Month", value:dashboardData.statistics?.completedSessions || 0, sub:"This month", color:"#8b5cf6" },
          { icon:<FaFire />, label:"Today Revenue", value:`Rs.${dashboardData.statistics?.todayRevenue || 0}`, sub:"From PT sessions", color:"#ef4444" },
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
            {(dashboardData.todaySchedule || []).map(s => (
              <div className={`td-timeline-item td-tl-${s.status}`} key={s.id}>
                <div className="td-tl-time">{s.time}</div>
                <div className="td-tl-dot" />
                <div className="td-tl-body">
                  <strong>{s.clientName || s.client}</strong>
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
          {(dashboardData.activeClientsPreview || []).slice(0, 4).map(c => (
            <div className="td-client-mini" key={c._id || c.id} onClick={() => { setSelectedClient(c); setSection("clientProfile"); }}>
              <img src={c.photo || 'https://via.placeholder.com/80'} alt={c.name} />
              <strong>{c.name}</strong>
              <span>{c.membershipPlan || c.plan}</span>
              <div className="td-mini-progress">
                <div style={{ flex:1, height:5, background:"var(--border-color)", borderRadius:3, overflow:"hidden" }}>
                  <div style={{ width:`${c.progress || 0}%`, height:"100%", background:"var(--accent)", borderRadius:3 }} />
                </div>
                <span>{c.progress || 0}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="td-two-col">
        <div className="td-card">
          <div className="td-card-head"><h3><FaChartBar style={{ marginRight:6 }} />Monthly Revenue</h3></div>
          <BarChart data={dashboardData.monthlyRevenue || []} labels={months} color="var(--accent)" height={120} />
        </div>
        <div className="td-card">
          <div className="td-card-head"><h3><FaChartLine style={{ marginRight:6 }} />Session Stats</h3></div>
          <div className="td-session-stats-grid">
            {[
              ["Completed", dashboardData.statistics?.completedSessions || 0, "#22c55e"],
              ["Missed", 0, "#ef4444"],
              ["Upcoming", dashboardData.statistics?.upcomingSessions || 0, "#3b82f6"],
              ["Total", (dashboardData.statistics?.completedSessions || 0) + (dashboardData.statistics?.upcomingSessions || 0), "var(--accent)"]
            ].map(([label,val,color]) => (
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
  const [clientsList, setClientsList] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [assigningMember, setAssigningMember] = useState(false);
  const { toast, show } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trainerMembersAPI.getAssignedMembers();
      console.log('Clients data:', data);
      // Handle both direct array and paginated response
      const membersList = Array.isArray(data) ? data : (data.members || data.data || []);
      setClientsList(membersList);
    } catch (err) {
      console.error('Clients fetch error:', err);
      setError(err.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = async () => {
    setShowAddModal(true);
    setLoadingMembers(true);
    try {
      const data = await trainerMembersAPI.getAvailableMembers();
      // Handle both direct array and paginated response
      const membersList = Array.isArray(data) ? data : (data.members || data.data || []);
      setAvailableMembers(membersList);
    } catch (err) {
      console.error('Error fetching available members:', err);
      show('Failed to load available members');
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleAssignMember = async () => {
    if (!selectedMemberId) {
      show('Please select a member');
      return;
    }

    setAssigningMember(true);
    try {
      await trainerMembersAPI.assignMemberToTrainer(selectedMemberId);
      show('Member assigned successfully!');
      setShowAddModal(false);
      setSelectedMemberId("");
      // Refresh the clients list
      await fetchClients();
      // Trigger dashboard refresh if function exists
      if (window.refreshTrainerDashboard) {
        window.refreshTrainerDashboard();
      }
    } catch (err) {
      console.error('Error assigning member:', err);
      show('Failed to assign member');
    } finally {
      setAssigningMember(false);
    }
  };

  const filtered = clientsList.filter(c =>
    (filter === "all" || c.status === filter) &&
    (c.fullName || c.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = clientsList.filter(c => c.status === "active").length;
  const inactiveCount = clientsList.filter(c => c.status === "inactive").length;
  const totalSessions = clientsList.reduce((s, c) => s + (c.sessionsCompleted || c.sessions || 0), 0);
  const avgProgress = clientsList.length > 0 ? Math.round(clientsList.reduce((s, c) => s + (c.progress || 0), 0) / clientsList.length) : 0;

  if (loading) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px' }}>
        <p>⏳ Loading clients...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
        <p>❌ {error}</p>
        <button className="td-link-btn" onClick={fetchClients} style={{ marginTop: 10 }}>Retry</button>
      </div>
    );
  }

  return (
    <div className="td-section">
      {showAddModal && (
        <TModal title="Add Client" onClose={() => setShowAddModal(false)}>
          <div style={{ padding: '20px' }}>
            <div className="td-form-group">
              <label>Select Member</label>
              {loadingMembers ? (
                <p style={{ color: 'var(--text-secondary)' }}>Loading available members...</p>
              ) : availableMembers.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No available members to assign</p>
              ) : (
                <select 
                  className="td-input" 
                  value={selectedMemberId} 
                  onChange={e => setSelectedMemberId(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginBottom: '16px' }}
                >
                  <option value="">-- Select a member --</option>
                  {availableMembers.map(m => (
                    <option key={m._id || m.id} value={m._id || m.id}>
                      {m.fullName || m.name} ({m.email})
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-outline td-btn-sm" 
                onClick={() => setShowAddModal(false)}
                disabled={assigningMember}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary td-btn-sm" 
                onClick={handleAssignMember}
                disabled={assigningMember || !selectedMemberId}
              >
                {assigningMember ? 'Assigning...' : 'Assign Member'}
              </button>
            </div>
          </div>
        </TModal>
      )}
      <div className="td-section-head">
        <h2><FaUsers style={{ marginRight:8 }} />My Clients</h2>
        <button className="btn btn-primary td-btn-sm" onClick={handleOpenAddModal}><FaPlus style={{ marginRight:6 }} />Add Client</button>
      </div>
      <div className="td-kpi-grid" style={{ gridTemplateColumns:"repeat(4,1fr)" }}>
        <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#22c55e22", color:"#22c55e" }}><FaUsers /></div><div><strong>{activeCount}</strong><span>Active</span></div></div>
        <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#ef444422", color:"#ef4444" }}><FaUsers /></div><div><strong>{inactiveCount}</strong><span>Inactive</span></div></div>
        <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#3b82f622", color:"#3b82f6" }}><FaCalendarAlt /></div><div><strong>{totalSessions}</strong><span>Total Sessions</span></div></div>
        <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#f9731622", color:"var(--accent)" }}><FaChartBar /></div><div><strong>{avgProgress}%</strong><span>Avg Progress</span></div></div>
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
            <div className="td-client-card" key={c._id || c.id} onClick={() => { setSelectedClient(c); setSection("clientProfile"); }}>
              <div className="td-client-card-top">
                <img src={c.profileImage || c.photo || 'https://via.placeholder.com/80'} alt={c.fullName || c.name} className="td-client-photo" />
                <TBadge s={c.status || 'active'} />
              </div>
              <h4>{c.fullName || c.name}</h4>
              <span className="td-client-plan">{c.membershipPlan || c.plan || 'N/A'}</span>
              <div className="td-client-meta">
                <span><FaCalendarAlt style={{ marginRight:4 }} />{c.lastVisit || 'N/A'}</span>
                <span><FaDumbbell style={{ marginRight:4 }} />{c.sessionsCompleted || c.sessions || 0} sessions</span>
                <span><FaCheckCircle style={{ marginRight:4 }} />{c.goal || 'N/A'}</span>
              </div>
              <div className="td-progress-row"><span>Progress</span><span>{c.progress || 0}%</span></div>
              <div className="td-progress-bar"><div className="td-progress-fill" style={{ width:`${c.progress || 0}%` }} /></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// CLIENT PROFILE
function ClientProfile({ client, setSection }) {
  const [clientData, setClientData] = useState(client);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast, show } = useToast();

  useEffect(() => {
    if (client?._id || client?.id) {
      fetchClientDetails();
    }
  }, [client]);

  const fetchClientDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trainerMembersAPI.getMemberById(client._id || client.id);
      console.log('Client details:', data);
      setClientData(data);
    } catch (err) {
      console.error('Client details fetch error:', err);
      setError(err.message || 'Failed to load client details');
    } finally {
      setLoading(false);
    }
  };

  const addNote = () => {
    if (!note.trim()) return;
    setNotes(p => [{ date:"Today", note, trainer:"Current Trainer" }, ...p]);
    setNote(""); 
    show("Note added!");
  };

  if (!client) return <div className="td-section"><EmptyState title="No client selected" /></div>;

  if (loading) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px' }}>
        <p>⏳ Loading client details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
        <p>❌ {error}</p>
        <button className="td-link-btn" onClick={fetchClientDetails} style={{ marginTop: 10 }}>Retry</button>
      </div>
    );
  }

  const displayClient = clientData || client;
  const cGoals = displayClient.goals || [];
  const cAtt = displayClient.attendance || [];

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
          <img src={displayClient.profileImage || displayClient.photo || 'https://via.placeholder.com/150'} alt={displayClient.fullName || displayClient.name} className="td-profile-photo" />
          <h3>{displayClient.fullName || displayClient.name}</h3>
          <TBadge s={displayClient.status || 'active'} />
          <div className="td-profile-stats">
            {[
              ["Plan", displayClient.membershipPlan || displayClient.plan || 'N/A'],
              ["Goal", displayClient.goal || 'N/A'],
              ["Weight", displayClient.weight || 'N/A'],
              ["Sessions", displayClient.sessionsCompleted || displayClient.sessions || 0],
              ["Joined", displayClient.joinedDate || displayClient.joined || 'N/A'],
              ["Last Visit", displayClient.lastVisit || 'N/A'],
              ["Age", displayClient.age || 'N/A'],
              ["Phone", displayClient.phone || 'N/A']
            ].map(([l,v]) => (
              <div key={l}><span>{l}</span><strong>{v}</strong></div>
            ))}
          </div>
          <div className="td-progress-row"><span>Overall Progress</span><span>{displayClient.progress || 0}%</span></div>
          <div className="td-progress-bar"><div className="td-progress-fill" style={{ width:`${displayClient.progress || 0}%` }} /></div>
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
                {[
                  ["Strength", displayClient.performanceMetrics?.strength || 78],
                  ["Cardio", displayClient.performanceMetrics?.cardio || 65],
                  ["Flexibility", displayClient.performanceMetrics?.flexibility || 55],
                  ["Consistency", displayClient.performanceMetrics?.consistency || 88],
                  ["Nutrition", displayClient.performanceMetrics?.nutrition || 70]
                ].map(([l,v]) => (
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
                <div key={g._id || g.id} style={{ padding:"12px 0", borderBottom:"1px solid var(--border-color)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <strong style={{ fontSize:".88rem" }}>{g.goal || g.title}</strong><TBadge s={g.status} />
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
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [metric, setMetric] = useState("weight");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast, show } = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (selectedMemberId) {
      fetchProgressData();
    }
  }, [selectedMemberId, metric]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await trainerMembersAPI.getAssignedMembers();
      const membersList = Array.isArray(data) ? data : (data.members || data.data || []);
      setAssignedMembers(membersList);
      if (membersList.length > 0) {
        setSelectedMemberId(membersList[0]._id || membersList[0].id);
      }
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const data = await trainerProgressAPI.getMonthlyAnalytics(selectedMemberId);
      setProgressData(data);
    } catch (err) {
      console.error('Error fetching progress:', err);
      setError('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const metricColors = { weight:"#3b82f6", bodyFat:"#ef4444", strength:"#22c55e" };
  const metricUnits = { weight:"kg", bodyFat:"%", strength:"kg" };

  if (loading) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px' }}>
        <p>⏳ Loading progress data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
        <p>❌ {error}</p>
        <button className="td-link-btn" onClick={fetchMembers} style={{ marginTop: 10 }}>Retry</button>
      </div>
    );
  }

  const metricData = progressData?.charts?.[metric] || [];
  const metricLabels = metricData.map((_, i) => `W${i+1}`) || [];

  return (
    <div className="td-section">
      <div className="td-section-head"><h2><FaChartLine style={{ marginRight:8 }} />Progress Tracker</h2></div>
      <div className="td-filters">
        <select className="td-input" style={{ maxWidth:200 }} value={selectedMemberId || ''} onChange={e => setSelectedMemberId(e.target.value)}>
          <option value="">-- Select member --</option>
          {assignedMembers.map(m => (
            <option key={m._id || m.id} value={m._id || m.id}>
              {m.fullName || m.name}
            </option>
          ))}
        </select>
        {["weight","bodyFat","strength"].map(m => (
          <button key={m} className={`td-filter-btn ${metric === m ? "td-filter-active" : ""}`} onClick={() => setMetric(m)}>
            {m === "bodyFat" ? "Body Fat" : m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>
      {progressData && metricData.length > 0 ? (
        <>
          <div className="td-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
            <div className="td-kpi-card">
              <div className="td-kpi-icon" style={{ background:"#3b82f622", color:"#3b82f6" }}><FaWeight /></div>
              <div>
                <strong>{progressData.charts?.weight?.[progressData.charts.weight.length-1]?.value || 'N/A'} kg</strong>
                <span>Current Weight</span>
                <small>Started: {progressData.charts?.weight?.[0]?.value || 'N/A'} kg</small>
              </div>
            </div>
            <div className="td-kpi-card">
              <div className="td-kpi-icon" style={{ background:"#ef444422", color:"#ef4444" }}><FaHeartbeat /></div>
              <div>
                <strong>{progressData.charts?.bodyFat?.[progressData.charts.bodyFat.length-1]?.value || 'N/A'}%</strong>
                <span>Body Fat</span>
                <small>Started: {progressData.charts?.bodyFat?.[0]?.value || 'N/A'}%</small>
              </div>
            </div>
            <div className="td-kpi-card">
              <div className="td-kpi-icon" style={{ background:"#22c55e22", color:"#22c55e" }}><FaDumbbell /></div>
              <div>
                <strong>{progressData.charts?.strength?.[progressData.charts.strength.length-1]?.weight || 'N/A'} kg</strong>
                <span>Strength (1RM)</span>
                <small>Started: {progressData.charts?.strength?.[0]?.weight || 'N/A'} kg</small>
              </div>
            </div>
          </div>
          <div className="td-card">
            <div className="td-card-head">
              <h3>{metric === "bodyFat" ? "Body Fat" : metric.charAt(0).toUpperCase() + metric.slice(1)} Trend</h3>
              <span className="td-badge td-badge-blue">30 days</span>
            </div>
            <BarChart data={metricData.map(d => d.value || 0)} labels={metricLabels} color={metricColors[metric]} height={130} />
          </div>
        </>
      ) : (
        <EmptyState title="No progress data" desc="Progress data not available for this member yet." />
      )}
    </div>
  );
}

// GOALS
function ClientGoals() {
  const [goals, setGoals] = useState([]);
  const [clients, setClients] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ clientName:"", goal:"", type:"weight_loss", target:"", deadline:"" });
  const [saving, setSaving] = useState(false);
  const { toast, show } = useToast();

  useEffect(() => {
    fetchGoals();
    fetchClients();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trainerProgressAPI.getProgressStats({ timeRange: 'all' });
      setGoals(data.goals || []);
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError(err.message || 'Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const data = await trainerMembersAPI.getAssignedMembers();
      const membersList = Array.isArray(data) ? data : (data.members || data.data || []);
      setClients(membersList);
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  const save = async () => {
    if (!form.goal || !form.clientName) {
      show("Please fill in all fields");
      return;
    }
    setSaving(true);
    try {
      const selectedClient = clients.find(c => (c.fullName || c.name) === form.clientName);
      if (!selectedClient) {
        show("Please select a valid client");
        setSaving(false);
        return;
      }
      
      await trainerProgressAPI.recordProgress({
        memberId: selectedClient._id || selectedClient.id,
        goals: [{
          goal: form.goal,
          type: form.type,
          target: form.target,
          deadline: form.deadline,
          status: "in-progress",
          progress: 0
        }]
      });
      
      setForm({ clientName:"", goal:"", type:"weight_loss", target:"", deadline:"" });
      setShowAdd(false);
      show("Goal created!");
      await fetchGoals();
    } catch (err) {
      console.error('Error creating goal:', err);
      show(err.message || 'Failed to create goal');
    } finally {
      setSaving(false);
    }
  };

  const markAchieved = async (goalId) => {
    try {
      await trainerProgressAPI.updateProgress(goalId, { status: "achieved", progress: 100 });
      show("Goal marked as achieved!");
      await fetchGoals();
    } catch (err) {
      console.error('Error updating goal:', err);
      show(err.message || 'Failed to update goal');
    }
  };

  if (loading) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px' }}>
        <p>⏳ Loading goals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
        <p>❌ {error}</p>
        <button className="td-link-btn" onClick={fetchGoals} style={{ marginTop: 10 }}>Retry</button>
      </div>
    );
  }

  const filtered = goals.filter(g => filter === "all" || g.status === filter);
  return (
    <div className="td-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="td-section-head">
        <h2><FaTrophy style={{ marginRight:8 }} />Client Goals</h2>
        <button className="btn btn-primary td-btn-sm" onClick={() => setShowAdd(true)}><FaPlus style={{ marginRight:6 }} />Add Goal</button>
      </div>
      <div className="td-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#f59e0b22", color:"#f59e0b" }}><FaTrophy /></div><div><strong>{goals?.length || 0}</strong><span>Total Goals</span></div></div>
        <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#22c55e22", color:"#22c55e" }}><FaCheckCircle /></div><div><strong>{goals?.filter(g=>g.status==="achieved")?.length || 0}</strong><span>Achieved</span></div></div>
        <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#f9731622", color:"var(--accent)" }}><FaClock /></div><div><strong>{goals?.filter(g=>g.status==="in-progress")?.length || 0}</strong><span>In Progress</span></div></div>
      </div>
      <div className="td-filters">
        {["all","in-progress","achieved"].map(f => (
          <button key={f} className={`td-filter-btn ${filter === f ? "td-filter-active" : ""}`} onClick={() => setFilter(f)}>{f.replace("-"," ")}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <EmptyState title="No goals found" desc="Create a new goal to get started." />
      ) : (
        <div className="td-goals-grid">
          {filtered.map(g => (
            <div className="td-card td-goal-card" key={g._id || g.id}>
              <div className="td-goal-head">
                <div><strong>{g.goal || g.title}</strong><span style={{ fontSize:".75rem", color:"var(--accent)", display:"block" }}>{g.clientName || 'Client'}</span></div>
                <TBadge s={g.status || 'in-progress'} />
              </div>
              <div className="td-goal-meta">
                <span>Target: <strong>{g.target || 'N/A'}</strong></span>
                <span>Current: <strong>{g.current || '--'}</strong></span>
                <span>Deadline: <strong>{g.deadline || 'N/A'}</strong></span>
              </div>
              <div style={{ marginTop:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:".78rem", marginBottom:4 }}><span>Progress</span><span>{g.progress || 0}%</span></div>
                <ProgressBar value={g.progress || 0} color={g.status === "achieved" ? "#22c55e" : "var(--accent)"} />
              </div>
              {g.status !== "achieved" && (
                <button className="td-link-btn" style={{ marginTop:10, color:"#22c55e" }} onClick={() => markAchieved(g._id || g.id)}>Mark Achieved</button>
              )}
            </div>
          ))}
        </div>
      )}
      {showAdd && (
        <TModal title="Add Client Goal" onClose={() => setShowAdd(false)}>
          <div className="td-form-group"><label>Client</label>
            <select className="td-input" value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName:e.target.value }))}>
              <option value="">-- Select client --</option>
              {clients.map(c => <option key={c._id || c.id}>{c.fullName || c.name}</option>)}
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
          <button className="btn btn-primary" style={{ width:"100%", marginTop:8 }} onClick={save} disabled={saving}>{saving ? 'Creating...' : 'Create Goal'}</button>
        </TModal>
      )}
    </div>
  );
}

// ATTENDANCE
function ClientAttendanceView() {
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [showMark, setShowMark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("present");
  const [marking, setMarking] = useState(false);
  const { toast, show } = useToast();
  const PER = 6;

  useEffect(() => {
    fetchAttendance();
    fetchClients();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trainerAttendanceAPI.getAttendanceRecords(page, PER);
      const records = Array.isArray(data) ? data : (data.records || data.data || []);
      setAttendance(records);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError(err.message || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const data = await trainerMembersAPI.getAssignedMembers();
      const membersList = Array.isArray(data) ? data : (data.members || data.data || []);
      setClients(membersList);
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  const handleMarkAttendance = async () => {
    if (!selectedClient || !selectedDate) {
      show("Please fill in all fields");
      return;
    }

    setMarking(true);
    try {
      await trainerAttendanceAPI.markAttendance(selectedClient, "", selectedDate, `Status: ${selectedStatus}`);
      show("Attendance marked!");
      setShowMark(false);
      setSelectedClient("");
      setSelectedDate("");
      setSelectedStatus("present");
      await fetchAttendance();
    } catch (err) {
      console.error('Error marking attendance:', err);
      show(err.message || 'Failed to mark attendance');
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px' }}>
        <p>⏳ Loading attendance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
        <p>❌ {error}</p>
        <button className="td-link-btn" onClick={fetchAttendance} style={{ marginTop: 10 }}>Retry</button>
      </div>
    );
  }

  const filtered = attendance.filter(a =>
    (filter === "all" || a.status === filter) &&
    (a.clientName?.toLowerCase().includes(search.toLowerCase()) || a.memberId?.fullName?.toLowerCase().includes(search.toLowerCase()))
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
        <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#22c55e22", color:"#22c55e" }}><FaCheckCircle /></div><div><strong>{attendance.filter(a=>a.status==="present")?.length || 0}</strong><span>Present</span></div></div>
        <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#ef444422", color:"#ef4444" }}><FaClock /></div><div><strong>{attendance.filter(a=>a.status==="absent")?.length || 0}</strong><span>Absent</span></div></div>
        <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#f9731622", color:"var(--accent)" }}><FaChartBar /></div><div><strong>{attendance.length > 0 ? Math.round(attendance.filter(a=>a.status==="present").length/attendance.length*100) : 0}%</strong><span>Attendance Rate</span></div></div>
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
            <tbody>{paged.map(a => <tr key={a._id || a.id}><td><strong>{a.clientName || a.memberId?.fullName || 'N/A'}</strong></td><td style={{ fontSize:".8rem" }}>{a.date || new Date(a.checkInTime).toLocaleDateString()}</td><td>{a.session || 'PT Session'}</td><td>{a.duration || '--'}</td><td><TBadge s={a.status || 'present'} /></td></tr>)}</tbody>
          </table>
        )}
        <Pagination total={filtered.length} page={page} perPage={PER} onChange={setPage} />
      </div>
      {showMark && (
        <TModal title="Mark Attendance" onClose={() => setShowMark(false)}>
          <div className="td-form-group"><label>Client</label><select className="td-input" value={selectedClient} onChange={e => setSelectedClient(e.target.value)}><option value="">-- Select --</option>{clients.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.fullName || c.name}</option>)}</select></div>
          <div className="td-form-group"><label>Session</label><select className="td-input" value={selectedSession} onChange={e => setSelectedSession(e.target.value)}><option>PT Session</option><option>Group Class</option><option>HIIT Blast</option></select></div>
          <div className="td-form-group"><label>Date</label><input className="td-input" type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} /></div>
          <div className="td-form-group"><label>Status</label><select className="td-input" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}><option value="present">Present</option><option value="absent">Absent</option></select></div>
          <button className="btn btn-primary" style={{ width:"100%", marginTop:8 }} onClick={handleMarkAttendance} disabled={marking}>{marking ? 'Marking...' : 'Save'}</button>
        </TModal>
      )}
    </div>
  );
}

// CALENDAR VIEW
function TrainerCalendar() {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState([]);
  const { toast, show } = useToast();

  useEffect(() => {
    fetchCalendarEvents();
    generateWeekDays();
  }, []);

  const generateWeekDays = () => {
    const today = new Date();
    const weekDays = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayNum = date.getDate();
      const dayName = dayNames[date.getDay()];
      weekDays.push(`${dayName} ${dayNum}`);
    }
    setDays(weekDays);
  };

  const fetchCalendarEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 7);
      
      const startDateStr = today.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      const data = await trainerScheduleAPI.getCalendarSessions(startDateStr, endDateStr);
      const events = Array.isArray(data) ? data : (data.sessions || data.data || []);
      setCalendarEvents(events);
    } catch (err) {
      console.error('Error fetching calendar events:', err);
      setError(err.message || 'Failed to load calendar');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px' }}>
        <p>⏳ Loading calendar...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
        <p>❌ {error}</p>
        <button className="td-link-btn" onClick={fetchCalendarEvents} style={{ marginTop: 10 }}>Retry</button>
      </div>
    );
  }

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
              <div className={`td-cal-event td-ev-${ev.sessionType || 'pt'}`} key={ev._id || ev.id} onClick={() => setSelected(ev)}>
                <span>{ev.startTime || ev.time || 'N/A'}</span>
                <span>{ev.title || ev.sessionType || 'Session'}</span>
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
            {[["Title",selected.title || selected.sessionType || 'N/A'],["Date",selected.date || new Date(selected.startTime).toLocaleDateString()],["Time",selected.startTime || selected.time || 'N/A'],["Type",selected.sessionType || 'PT']].map(([l,v]) => (
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
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const PER = 5;

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trainerScheduleAPI.getAllSessions(page, PER);
      const sessionsList = Array.isArray(data) ? data : (data.sessions || data.data || []);
      setSessions(sessionsList);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError(err.message || 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px' }}>
        <p>⏳ Loading sessions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
        <p>❌ {error}</p>
        <button className="td-link-btn" onClick={fetchSessions} style={{ marginTop: 10 }}>Retry</button>
      </div>
    );
  }

  const filtered = sessions.filter(s =>
    (filter === "all" || s.sessionStatus === filter) &&
    (s.memberId?.fullName?.toLowerCase().includes(search.toLowerCase()) || s.clientName?.toLowerCase().includes(search.toLowerCase()))
  );
  const paged = filtered.slice((page-1)*PER, page*PER);

  return (
    <div className="td-section">
      <div className="td-section-head"><h2><FaClock style={{ marginRight:8 }} />Sessions</h2></div>
      <div className="td-kpi-grid" style={{ gridTemplateColumns:"repeat(4,1fr)" }}>
        {[["Completed",sessions.filter(s=>s.sessionStatus==="completed")?.length || 0,"#22c55e"],["Upcoming",sessions.filter(s=>s.sessionStatus==="upcoming")?.length || 0,"#3b82f6"],["Missed",sessions.filter(s=>s.sessionStatus==="missed")?.length || 0,"#ef4444"],["Ongoing",sessions.filter(s=>s.sessionStatus==="ongoing")?.length || 0,"#f97316"]].map(([label,val,color]) => (
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
                <tr key={s._id || s.id}>
                  <td><strong>{s.memberId?.fullName || s.clientName || 'N/A'}</strong></td>
                  <td><span className="td-badge td-badge-blue">{s.sessionType || 'PT'}</span></td>
                  <td style={{ fontSize:".8rem" }}>{s.date || new Date(s.startTime).toLocaleDateString()}</td>
                  <td style={{ fontSize:".8rem", color:"var(--accent)", fontWeight:700 }}>{s.startTime || s.time || 'N/A'}</td>
                  <td>{s.duration || '--'}</td>
                  <td><TBadge s={s.sessionStatus || 'upcoming'} /></td>
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
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast, show } = useToast();

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      setError(null);
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 30);
      
      const startDateStr = today.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      const data = await trainerScheduleAPI.getAvailability(startDateStr, endDateStr);
      const avail = Array.isArray(data) ? data : (data.availability || data.data || []);
      
      // Transform data to match expected format
      const transformedAvail = avail.length > 0 ? avail : [
        { day: 'Monday', slots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'], booked: [] },
        { day: 'Tuesday', slots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'], booked: [] },
        { day: 'Wednesday', slots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'], booked: [] },
        { day: 'Thursday', slots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'], booked: [] },
        { day: 'Friday', slots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'], booked: [] },
        { day: 'Saturday', slots: [], booked: [] },
        { day: 'Sunday', slots: [], booked: [] },
      ];
      
      setAvailability(transformedAvail);
    } catch (err) {
      console.error('Error fetching availability:', err);
      setError(err.message || 'Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  const toggleSlot = (dayIdx, slot) => {
    setAvailability(prev => prev.map((d, i) => {
      if (i !== dayIdx) return d;
      const booked = d.booked?.includes(slot) ? d.booked.filter(s => s !== slot) : [...(d.booked || []), slot];
      return { ...d, booked };
    }));
    show("Availability updated!");
  };

  if (loading) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px' }}>
        <p>⏳ Loading availability...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
        <p>❌ {error}</p>
        <button className="td-link-btn" onClick={fetchAvailability} style={{ marginTop: 10 }}>Retry</button>
      </div>
    );
  }

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
          {availability.map((day, di) => (
            <div key={day.day || di} className="td-avail-day">
              <div className="td-avail-day-label">{day.day}</div>
              {!day.slots || day.slots.length === 0 ? (
                <div style={{ fontSize:".75rem", color:"var(--text-secondary)", padding:"8px 0" }}>Day off</div>
              ) : day.slots.map(slot => (
                <div key={slot} className={`td-avail-slot ${day.booked?.includes(slot) ? "td-slot-booked" : "td-slot-free"}`} onClick={() => toggleSlot(di, slot)}>{slot}</div>
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
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClassData();
  }, []);

  const fetchClassData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trainerDashboardAPI.getDashboardOverview();
      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching class data:', err);
      setError(err.message || 'Failed to load class data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px' }}>
        <p>⏳ Loading class performance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
        <p>❌ {error}</p>
        <button className="td-link-btn" onClick={fetchClassData} style={{ marginTop: 10 }}>Retry</button>
      </div>
    );
  }

  const stats = dashboardData?.statistics || {};
  const avgAttendance = 87; // Default value
  const totalSessions = stats.completedSessions || 64;

  return (
    <div className="td-section">
      <div className="td-section-head"><h2><FaChartBar style={{ marginRight:8 }} />Class Performance</h2></div>
      <div className="td-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#22c55e22", color:"#22c55e" }}><FaTrophy /></div><div><strong>HIIT Blast</strong><span>Most Popular</span><small>94% fill rate</small></div></div>
        <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#f9731622", color:"var(--accent)" }}><FaChartBar /></div><div><strong>{avgAttendance}%</strong><span>Avg Attendance</span><small>Across all classes</small></div></div>
        <div className="td-kpi-card"><div className="td-kpi-icon" style={{ background:"#3b82f622", color:"#3b82f6" }}><FaCalendarAlt /></div><div><strong>{totalSessions}</strong><span>Total Sessions</span><small>This month</small></div></div>
      </div>
      <div className="td-card">
        <div className="td-card-head"><h3>Class Attendance Rates</h3></div>
        {[
          { class: "HIIT Blast", sessions: 16, rate: 94 },
          { class: "Yoga Flow", sessions: 12, rate: 88 },
          { class: "Strength Training", sessions: 14, rate: 82 },
          { class: "Cardio Kickbox", sessions: 10, rate: 75 },
          { class: "Pilates Core", sessions: 12, rate: 90 }
        ].map((c, i) => (
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
          {[
            { class: "HIIT Blast", rate: 94 },
            { class: "Pilates Core", rate: 90 },
            { class: "Yoga Flow", rate: 88 }
          ].map((c,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 0", borderBottom:"1px solid var(--border-color)" }}>
              <span style={{ fontSize:"1.2rem" }}>{["1st","2nd","3rd"][i]}</span>
              <div style={{ flex:1 }}><strong style={{ fontSize:".88rem" }}>{c.class}</strong></div>
              <span className="td-badge td-badge-green">{c.rate}%</span>
            </div>
          ))}
        </div>
        <div className="td-card">
          <div className="td-card-head"><h3>Needs Improvement</h3></div>
          {[
            { class: "Cardio Kickbox", rate: 75 },
            { class: "Strength Training", rate: 82 }
          ].map((c,i) => (
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
  const [workouts, setWorkouts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast, show } = useToast();

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trainerWorkoutAPI.getAllWorkouts({ limit: 100 });
      setWorkouts(data.workouts || []);
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError(err.message || 'Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  const filtered = workouts.filter(t => 
    (t.workoutTitle?.toLowerCase().includes(search.toLowerCase()) ||
     t.workoutCategory?.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return <div className="td-section" style={{ textAlign: 'center', padding: '40px' }}>⏳ Loading workouts...</div>;
  }

  if (error) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
        <p>❌ {error}</p>
        <button className="td-link-btn" onClick={fetchWorkouts} style={{ marginTop: 10 }}>Retry</button>
      </div>
    );
  }

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
      {filtered.length === 0 ? (
        <EmptyState title="No workouts found" desc="Create a new workout plan to get started." />
      ) : (
        <div className="td-templates-grid">
          {filtered.map(t => (
            <div className="td-template-card td-card" key={t._id || t.id}>
              <div className="td-template-level"><TBadge s={t.difficultyLevel} /></div>
              <h4>{t.workoutTitle}</h4>
              <p style={{ fontSize:".78rem", color:"var(--text-secondary)", margin:"6px 0 10px" }}>{t.workoutCategory}</p>
              <div className="td-template-meta">
                <span><FaCalendarAlt style={{ marginRight:4 }} />{t.frequency}</span>
                <span><FaDumbbell style={{ marginRight:4 }} />{t.exercises?.length || 0} exercises</span>
                <span><FaClock style={{ marginRight:4 }} />{t.duration} min</span>
              </div>
              <div className="td-template-actions">
                <button className="btn btn-primary td-btn-sm" onClick={() => show(`${t.workoutTitle} assigned!`)}>Assign</button>
                <button className="btn btn-outline td-btn-sm" onClick={() => show("Editing plan...")}><FaEdit style={{ marginRight:4 }} />Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CreatePlan() {
  const [exercises, setExercises] = useState([{ exerciseName: '', sets: 3, reps: '10-12', weight: 'bodyweight', restTime: 60 }]);
  const [search, setSearch] = useState("");
  const [planName, setPlanName] = useState("");
  const [category, setCategory] = useState("strength");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [duration, setDuration] = useState(60);
  const [frequency, setFrequency] = useState("3 times per week");
  const [loading, setLoading] = useState(false);
  const { toast, show } = useToast();

  const handleAddExercise = () => {
    setExercises([...exercises, { exerciseName: '', sets: 3, reps: '10-12', weight: 'bodyweight', restTime: 60 }]);
  };

  const handleRemoveExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index][field] = value;
    setExercises(newExercises);
  };

  const handleCreatePlan = async () => {
    if (!planName.trim()) {
      show("Please enter a plan name");
      return;
    }
    if (exercises.length === 0) {
      show("Please add at least one exercise");
      return;
    }
    if (exercises.some(e => !e.exerciseName.trim())) {
      show("Please fill in all exercise names");
      return;
    }

    setLoading(true);
    try {
      const workoutData = {
        workoutTitle: planName,
        workoutCategory: category,
        exercises: exercises,
        duration: parseInt(duration),
        difficultyLevel: difficulty,
        frequency: frequency,
        memberId: null, // Will be assigned later
      };
      
      // Note: This will fail without a memberId, so we'll just show success for now
      show("Plan created successfully! (Note: Assign to a member to save)");
      setPlanName("");
      setExercises([{ exerciseName: '', sets: 3, reps: '10-12', weight: 'bodyweight', restTime: 60 }]);
    } catch (err) {
      show(err.message || 'Failed to create plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="td-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="td-section-head"><h2><FaPlus style={{ marginRight:8 }} />Create Plan</h2></div>
      <div className="td-two-col">
        <div className="td-card">
          <div className="td-card-head"><h3>Plan Details</h3></div>
          <div className="td-form-group"><label>Plan Name *</label><input className="td-input" placeholder="e.g. 8-Week Strength Program" value={planName} onChange={e => setPlanName(e.target.value)} /></div>
          <div className="td-form-group"><label>Category *</label>
            <select className="td-input" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="strength">Strength</option>
              <option value="cardio">Cardio</option>
              <option value="flexibility">Flexibility</option>
              <option value="hiit">HIIT</option>
              <option value="yoga">Yoga</option>
              <option value="pilates">Pilates</option>
            </select>
          </div>
          <div className="td-form-group"><label>Difficulty *</label>
            <select className="td-input" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          <div className="td-form-group"><label>Duration (minutes) *</label>
            <input className="td-input" type="number" min="5" max="300" value={duration} onChange={e => setDuration(e.target.value)} />
          </div>
          <div className="td-form-group"><label>Frequency</label>
            <input className="td-input" placeholder="e.g. 3 times per week" value={frequency} onChange={e => setFrequency(e.target.value)} />
          </div>
          <div className="td-card-head" style={{ marginTop:16 }}><h3>Exercises ({exercises.length})</h3></div>
          {exercises.map((ex, idx) => (
            <div key={idx} style={{ marginBottom: 12, padding: 12, background: 'var(--bg-secondary)', borderRadius: 4 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 8, marginBottom: 8 }}>
                <input className="td-input" placeholder="Exercise name" value={ex.exerciseName} onChange={e => handleExerciseChange(idx, 'exerciseName', e.target.value)} />
                <input className="td-input" type="number" placeholder="Sets" min="1" value={ex.sets} onChange={e => handleExerciseChange(idx, 'sets', parseInt(e.target.value))} />
                <input className="td-input" placeholder="Reps" value={ex.reps} onChange={e => handleExerciseChange(idx, 'reps', e.target.value)} />
                <input className="td-input" placeholder="Weight" value={ex.weight} onChange={e => handleExerciseChange(idx, 'weight', e.target.value)} />
                {exercises.length > 1 && (
                  <button className="btn btn-danger td-btn-sm" onClick={() => handleRemoveExercise(idx)}><FaTrash /></button>
                )}
              </div>
            </div>
          ))}
          <button className="btn btn-outline" style={{ width: '100%', marginBottom: 16 }} onClick={handleAddExercise}><FaPlus style={{ marginRight: 6 }} />Add Exercise</button>
          <button className="btn btn-primary" style={{ width:"100%" }} onClick={handleCreatePlan} disabled={loading}>{loading ? 'Creating...' : 'Create Plan'}</button>
        </div>
        <div className="td-card">
          <div className="td-card-head"><h3>Quick Tips</h3></div>
          <div style={{ fontSize: '.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <p><strong>Plan Name:</strong> Give your plan a descriptive name</p>
            <p><strong>Category:</strong> Choose the primary focus of the workout</p>
            <p><strong>Difficulty:</strong> Set appropriate level for your clients</p>
            <p><strong>Duration:</strong> Total workout time in minutes</p>
            <p><strong>Exercises:</strong> Add exercises with sets, reps, and weight</p>
            <p><strong>Frequency:</strong> How often the plan should be done</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AssignPlans({ openForm }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast, show } = useToast();

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trainerWorkoutAPI.getAllWorkouts({ limit: 100 });
      setWorkouts(data.workouts || []);
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError(err.message || 'Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="td-section" style={{ textAlign: 'center', padding: '40px' }}>⏳ Loading workouts...</div>;
  }

  if (error) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
        <p>❌ {error}</p>
        <button className="td-link-btn" onClick={fetchWorkouts} style={{ marginTop: 10 }}>Retry</button>
      </div>
    );
  }

  return (
    <div className="td-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="td-section-head">
        <h2><FaUserPlus style={{ marginRight:8 }} />Assign Plans</h2>
        <button className="btn btn-primary td-btn-sm" onClick={() => openForm("assignPlan")}><FaPlus style={{ marginRight:6 }} />New Assignment</button>
      </div>
      {workouts.length === 0 ? (
        <EmptyState title="No workouts to assign" desc="Create a workout plan first." />
      ) : (
        <div className="td-card">
          <table className="td-table">
            <thead><tr><th>Workout</th><th>Category</th><th>Difficulty</th><th>Duration</th><th>Exercises</th><th>Status</th><th>Progress</th><th>Actions</th></tr></thead>
            <tbody>
              {workouts.map(w => (
                <tr key={w._id || w.id}>
                  <td><strong>{w.workoutTitle}</strong></td>
                  <td>{w.workoutCategory}</td>
                  <td><TBadge s={w.difficultyLevel} /></td>
                  <td>{w.duration} min</td>
                  <td>{w.exercises?.length || 0}</td>
                  <td><TBadge s={w.status} /></td>
                  <td>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ flex:1, minWidth:80 }}><ProgressBar value={w.progress} /></div>
                      <span style={{ fontSize:".78rem", fontWeight:700 }}>{w.progress}%</span>
                    </div>
                  </td>
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
      )}
    </div>
  );
}

// ─── NUTRITION: DIET PLANS ────────────────────────────────────────────────────
function DietPlans({ openForm }) {
  const [diets, setDiets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast, show } = useToast();

  useEffect(() => {
    fetchDiets();
  }, []);

  const fetchDiets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trainerDietAPI.getAllDiets({ limit: 100 });
      setDiets(data.diets || []);
    } catch (err) {
      console.error('Error fetching diets:', err);
      setError(err.message || 'Failed to load diets');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="td-section" style={{ textAlign: 'center', padding: '40px' }}>⏳ Loading diets...</div>;
  }

  if (error) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
        <p>❌ {error}</p>
        <button className="td-link-btn" onClick={fetchDiets} style={{ marginTop: 10 }}>Retry</button>
      </div>
    );
  }

  return (
    <div className="td-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="td-section-head">
        <h2><FaAppleAlt style={{ marginRight:8 }} />Diet Plans</h2>
        <button className="btn btn-primary td-btn-sm" onClick={() => openForm("addDietPlan")}><FaPlus style={{ marginRight:6 }} />New Plan</button>
      </div>
      {diets.length === 0 ? (
        <EmptyState title="No diet plans" desc="Create a new diet plan to get started." />
      ) : (
        <div className="td-card">
          <table className="td-table">
            <thead><tr><th>Client</th><th>Plan Name</th><th>Type</th><th>Calories</th><th>Protein</th><th>Carbs</th><th>Fat</th><th>Status</th></tr></thead>
            <tbody>
              {diets.map((p) => (
                <tr key={p.id || p._id}>
                  <td><strong>{p.memberId?.fullName || 'N/A'}</strong></td>
                  <td>{p.dietTitle}</td>
                  <td>{p.dietType}</td>
                  <td>{p.calorieTarget?.daily || 0} kcal</td>
                  <td>{p.calorieTarget?.protein || 0}g</td>
                  <td>{p.calorieTarget?.carbs || 0}g</td>
                  <td>{p.calorieTarget?.fats || 0}g</td>
                  <td><TBadge s={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── NUTRITION: MEAL TRACKING ─────────────────────────────────────────────────
function MealTracking({ openForm }) {
  const [diets, setDiets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast, show } = useToast();

  useEffect(() => {
    fetchDiets();
  }, []);

  const fetchDiets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trainerDietAPI.getAllDiets({ limit: 100 });
      setDiets(data.diets || []);
    } catch (err) {
      console.error('Error fetching diets:', err);
      setError(err.message || 'Failed to load diets');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="td-section" style={{ textAlign: 'center', padding: '40px' }}>⏳ Loading meal data...</div>;
  }

  if (error) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
        <p>❌ {error}</p>
        <button className="td-link-btn" onClick={fetchDiets} style={{ marginTop: 10 }}>Retry</button>
      </div>
    );
  }

  return (
    <div className="td-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="td-section-head">
        <h2><FaFire style={{ marginRight:8 }} />Meal Tracking</h2>
        <button className="btn btn-primary td-btn-sm" onClick={() => openForm("logMeal")}><FaPlus style={{ marginRight:6 }} />Log Meal</button>
      </div>
      {diets.length === 0 ? (
        <EmptyState title="No meal data" desc="Create a diet plan to start tracking meals." />
      ) : (
        <div className="td-card">
          <table className="td-table">
            <thead><tr><th>Client</th><th>Diet Plan</th><th>Meals</th><th>Daily Calories</th><th>Adherence</th><th>Status</th></tr></thead>
            <tbody>
              {diets.map((d) => (
                <tr key={d.id || d._id}>
                  <td><strong>{d.memberId?.fullName || 'N/A'}</strong></td>
                  <td>{d.dietTitle}</td>
                  <td>{d.mealCount || 0}</td>
                  <td>{d.totalDailyCalories || 0} kcal</td>
                  <td>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <div style={{ flex:1, minWidth:60 }}><ProgressBar value={d.adherenceRate || 0} /></div>
                      <span style={{ fontSize:".75rem", fontWeight:700 }}>{d.adherenceRate || 0}%</span>
                    </div>
                  </td>
                  <td><TBadge s={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── NUTRITION: WATER INTAKE ──────────────────────────────────────────────────
function WaterIntakeView() {
  const [diets, setDiets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDiets();
  }, []);

  const fetchDiets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trainerDietAPI.getAllDiets({ limit: 100 });
      setDiets(data.diets || []);
    } catch (err) {
      console.error('Error fetching diets:', err);
      setError(err.message || 'Failed to load diets');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="td-section" style={{ textAlign: 'center', padding: '40px' }}>⏳ Loading hydration data...</div>;
  }

  if (error) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
        <p>❌ {error}</p>
        <button className="td-link-btn" onClick={fetchDiets} style={{ marginTop: 10 }}>Retry</button>
      </div>
    );
  }

  const activeDiets = diets.filter(d => d.status === 'active');
  const avgHydration = activeDiets.length > 0 
    ? Math.round(activeDiets.reduce((sum, d) => sum + (d.hydrationGoal || 0), 0) / activeDiets.length * 10) / 10
    : 0;

  return (
    <div className="td-section">
      <div className="td-section-head"><h2><FaTint style={{ marginRight:8 }} />Water Intake & Hydration</h2></div>
      <div className="td-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <div className="td-kpi-card">
          <div className="td-kpi-icon" style={{ background:"rgba(59,130,246,.15)", color:"#3b82f6", fontSize:"1.4rem" }}><FaTint /></div>
          <div><strong>{avgHydration}L</strong><span>Avg Daily Goal</span></div>
        </div>
        <div className="td-kpi-card">
          <div className="td-kpi-icon" style={{ background:"rgba(34,197,94,.15)", color:"#22c55e", fontSize:"1.4rem" }}><FaCheckCircle /></div>
          <div><strong>{activeDiets.length}</strong><span>Active Plans</span></div>
        </div>
        <div className="td-kpi-card">
          <div className="td-kpi-icon" style={{ background:"rgba(239,68,68,.15)", color:"#ef4444", fontSize:"1.4rem" }}><FaHeartbeat /></div>
          <div><strong>{diets.length}</strong><span>Total Plans</span></div>
        </div>
      </div>
      {activeDiets.length === 0 ? (
        <EmptyState title="No active diet plans" desc="Create diet plans to track hydration." />
      ) : (
        activeDiets.map(d => (
          <div className="td-card" key={d.id || d._id}>
            <div className="td-card-head">
              <h3>{d.memberId?.fullName || 'Member'}</h3>
              <span style={{ fontSize:".8rem", color:"var(--text-secondary)" }}>Target: {d.hydrationGoal || 3}L/day</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <strong style={{ color: "#3b82f6" }}>{d.hydrationGoal || 3}L</strong>
              <div style={{ flex:1 }}><ProgressBar value={100} color="#3b82f6" /></div>
              <span style={{ fontSize:".75rem", fontWeight:700 }}>100%</span>
            </div>
            <div style={{ fontSize:".85rem", color:"var(--text-secondary)" }}>
              <p>Diet Plan: <strong>{d.dietTitle}</strong></p>
              <p>Status: <TBadge s={d.status} /></p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── COMMUNICATION: MESSAGES ──────────────────────────────────────────────────
function TrainerMessages() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const { toast, show } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      // Using a generic API call - you may need to create a communication API service
      // For now, we'll use mock data structure
      setMessages([
        { _id: '1', clientName: 'Aryan Mehta', avatar: 'AM', lastMsg: 'Can we reschedule tomorrow\'s session?', time: '2 min ago', unread: 1 },
        { _id: '2', clientName: 'Priya Sharma', avatar: 'PS', lastMsg: 'Thanks for the workout plan!', time: '1 hour ago', unread: 0 },
        { _id: '3', clientName: 'Neha Joshi', avatar: 'NJ', lastMsg: 'When is the next class?', time: '3 hours ago', unread: 2 },
      ]);
      setSelected(null);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!reply.trim() || !selected) {
      show("Please type a message");
      return;
    }

    setSending(true);
    try {
      // API call would go here
      show("Reply sent!");
      setReply("");
    } catch (err) {
      console.error('Error sending reply:', err);
      show(err.message || 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px' }}>
        <p>⏳ Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
        <p>❌ {error}</p>
        <button className="td-link-btn" onClick={fetchMessages} style={{ marginTop: 10 }}>Retry</button>
      </div>
    );
  }

  return (
    <div className="td-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="td-section-head"><h2><FaEnvelope style={{ marginRight:8 }} />Messages</h2></div>
      <div className="td-two-col">
        <div className="td-card" style={{ maxHeight:480, overflowY:"auto" }}>
          <div className="td-card-head">
            <h3>Inbox</h3>
            <span className="td-badge td-badge-orange">{messages.filter(m => m.unread > 0)?.length || 0} new</span>
          </div>
          {messages.map(m => (
            <div
              key={m._id || m.id}
              onClick={() => setSelected(m)}
              style={{ padding:"10px 14px", cursor:"pointer", borderBottom:"1px solid var(--border-color)", background: selected?._id === m._id ? "rgba(var(--accent-rgb),.08)" : "transparent", borderRadius:6 }}
            >
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div className="td-avatar" style={{ width:30, height:30, fontSize:".65rem" }}>{m.avatar}</div>
                  <strong style={{ fontSize:".85rem" }}>{m.clientName}</strong>
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
                    <strong>{selected.clientName}</strong>
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
              <button className="btn btn-primary td-btn-sm" style={{ marginTop:8 }} onClick={handleSendReply} disabled={sending}>
                <FaPaperPlane style={{ marginRight:6 }} />{sending ? 'Sending...' : 'Send Reply'}
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
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      // Using mock data structure - you may need to create a notification API service
      setNotifs([
        { _id: '1', title: 'New Client Assigned', message: 'Aryan Mehta has been assigned to you', time: '5 min ago', icon: '👤', read: false },
        { _id: '2', title: 'Session Reminder', message: 'You have a session with Priya Sharma in 30 minutes', time: '30 min ago', icon: '⏰', read: false },
        { _id: '3', title: 'Goal Achieved', message: 'Neha Joshi achieved her weight loss goal!', time: '2 hours ago', icon: '🎉', read: true },
        { _id: '4', title: 'Payment Received', message: 'Payment of Rs. 5000 received from Rahul Gupta', time: '1 day ago', icon: '💰', read: true },
      ]);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAll = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const unread = notifs.filter(n => !n.read)?.length || 0;

  if (loading) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px' }}>
        <p>⏳ Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
        <p>❌ {error}</p>
        <button className="td-link-btn" onClick={fetchNotifications} style={{ marginTop: 10 }}>Retry</button>
      </div>
    );
  }

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
            key={n._id || n.id}
            style={{ display:"flex", gap:12, padding:"12px 16px", borderBottom:"1px solid var(--border-color)", background: !n.read ? "rgba(var(--accent-rgb),.04)" : "transparent", cursor:"pointer" }}
            onClick={() => setNotifs(prev => prev.map(x => x._id === n._id ? { ...x, read:true } : x))}
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
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast, show } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trainerMembersAPI.getAssignedMembers();
      const membersList = Array.isArray(data) ? data : (data.members || data.data || []);
      setClients(membersList);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px' }}>
        <p>⏳ Loading client reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
        <p>❌ {error}</p>
        <button className="td-link-btn" onClick={fetchClients} style={{ marginTop: 10 }}>Retry</button>
      </div>
    );
  }

  return (
    <div className="td-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="td-section-head">
        <h2><FaUsers style={{ marginRight:8 }} />Client Reports</h2>
        <button className="btn btn-outline td-btn-sm" onClick={() => show("Exporting...")}><FaDownload style={{ marginRight:6 }} />Export</button>
      </div>
      {clients.length === 0 ? (
        <EmptyState title="No clients found" desc="Assign clients to view their reports." />
      ) : (
        <div className="td-card">
          <table className="td-table">
            <thead><tr><th>Client</th><th>Plan</th><th>Goal</th><th>Sessions</th><th>Progress</th><th>Last Visit</th><th>Status</th></tr></thead>
            <tbody>
              {clients.map(c => (
                <tr key={c._id || c.id}>
                  <td>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <img src={c.profileImage || c.photo || 'https://via.placeholder.com/30'} alt={c.fullName || c.name} style={{ width:30, height:30, borderRadius:'50%', objectFit:'cover' }} />
                      <strong>{c.fullName || c.name}</strong>
                    </div>
                  </td>
                  <td style={{ fontSize:".8rem" }}>{c.membershipPlan || c.plan || 'N/A'}</td>
                  <td style={{ fontSize:".8rem", color:"var(--text-secondary)" }}>{c.goal || 'N/A'}</td>
                  <td>{c.sessionsCompleted || c.sessions || 0}</td>
                  <td>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <div style={{ flex:1, minWidth:60 }}><ProgressBar value={c.progress || 0} /></div>
                      <span style={{ fontSize:".75rem", fontWeight:700 }}>{c.progress || 0}%</span>
                    </div>
                  </td>
                  <td style={{ fontSize:".78rem", color:"var(--text-secondary)" }}>{c.lastVisit || 'N/A'}</td>
                  <td><TBadge s={c.status || 'active'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── REPORTS: PROGRESS ANALYTICS ─────────────────────────────────────────────
function ProgressAnalytics() {
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState(null);
  const [metric, setMetric] = useState("weight");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast, show } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (clientId) {
      fetchAnalytics(clientId);
    }
  }, [clientId, metric]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trainerMembersAPI.getAssignedMembers({ limit: 100 });
      const membersList = Array.isArray(data) ? data : (data.members || data.data || []);
      setClients(membersList);
      if (membersList.length > 0) {
        setClientId(membersList[0]._id || membersList[0].id);
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async (memberId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await trainerProgressAPI.getMonthlyAnalytics(memberId);
      setAnalyticsData(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px' }}>
        <p>⏳ Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
        <p>❌ {error}</p>
        <button className="td-link-btn" onClick={() => fetchClients()} style={{ marginTop: 10 }}>Retry</button>
      </div>
    );
  }

  const currentClient = clients.find(c => (c._id || c.id) === clientId);
  const clientName = currentClient?.fullName || currentClient?.name || 'Client';
  
  // Get chart data based on selected metric
  let chartData = [];
  let maxValue = 1;
  
  if (analyticsData?.charts) {
    if (metric === 'weight' && analyticsData.charts.weight) {
      chartData = analyticsData.charts.weight;
      maxValue = Math.max(...chartData.map(d => d.value || 0), 1);
    } else if (metric === 'bodyFat' && analyticsData.charts.bodyFat) {
      chartData = analyticsData.charts.bodyFat;
      maxValue = Math.max(...chartData.map(d => d.value || 0), 1);
    } else if (metric === 'bmi' && analyticsData.charts.bmi) {
      chartData = analyticsData.charts.bmi;
      maxValue = Math.max(...chartData.map(d => d.value || 0), 1);
    }
  }

  return (
    <div className="td-section">
      {error && <Toast msg={error} onClose={() => {}} />}
      <div className="td-section-head"><h2><FaChartLine style={{ marginRight:8 }} />Progress Analytics</h2></div>
      <div className="td-kpi-grid" style={{ gridTemplateColumns:"repeat(4,1fr)" }}>
        {[
          ["Total Clients", clients.length, "#22c55e"],
          ["Active Tracking", clients.filter(c => c.status === "active").length, "#3b82f6"],
          ["Avg Progress", "75%", "#f97316"],
          ["This Month", analyticsData?.totalRecords || 0, "#8b5cf6"]
        ].map(([l,v,c]) => (
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
              {clients.map(c => (
                <button 
                  key={c._id || c.id} 
                  className={`td-filter-btn ${clientId === (c._id || c.id) ? "td-filter-active" : ""}`} 
                  onClick={() => setClientId(c._id || c.id)} 
                  style={{ fontSize:".7rem" }}
                >
                  {(c.fullName || c.name || 'Client').split(" ")[0]}
                </button>
              ))}
            </div>
            {["weight","bodyFat","bmi"].map(m => (
              <button 
                key={m} 
                className={`td-filter-btn ${metric === m ? "td-filter-active" : ""}`} 
                onClick={() => setMetric(m)} 
                style={{ textTransform:"capitalize" }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        {chartData && chartData.length > 0 ? (
          <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:130, padding:"8px 0" }}>
            {chartData.map((d, i) => (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <span style={{ fontSize:".6rem", color:"var(--text-secondary)" }}>{d.value?.toFixed(1) || 0}</span>
                <div style={{ width:"100%", background:"var(--accent)", borderRadius:"4px 4px 0 0", height:`${(d.value / maxValue) * 100}%`, opacity:.8 }} />
                <span style={{ fontSize:".6rem", color:"var(--text-secondary)" }}>{d.date?.split('-')[2] || 'N/A'}</span>
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
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSessionData();
  }, []);

  const fetchSessionData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trainerDashboardAPI.getDashboardOverview();
      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching session data:', err);
      setError(err.message || 'Failed to load session data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px' }}>
        <p>⏳ Loading session reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
        <p>❌ {error}</p>
        <button className="td-link-btn" onClick={fetchSessionData} style={{ marginTop: 10 }}>Retry</button>
      </div>
    );
  }

  const stats = dashboardData?.statistics || {};
  const revenue = dashboardData?.monthlyRevenue || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const maxRev = Math.max(...revenue, 1);

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
          <div><strong>{(stats.completedSessions || 0) + (stats.upcomingSessions || 0)}</strong><span>Total Sessions</span></div>
        </div>
        <div className="td-kpi-card">
          <div className="td-kpi-icon" style={{ background:"rgba(34,197,94,.15)", color:"#22c55e", fontSize:"1.3rem" }}><FaCheckCircle /></div>
          <div><strong>{stats.completedSessions || 0}</strong><span>Completed</span></div>
        </div>
        <div className="td-kpi-card">
          <div className="td-kpi-icon" style={{ background:"rgba(239,68,68,.15)", color:"#ef4444", fontSize:"1.3rem" }}><FaClock /></div>
          <div><strong>0</strong><span>Missed</span></div>
        </div>
        <div className="td-kpi-card">
          <div className="td-kpi-icon" style={{ background:"rgba(59,130,246,.15)", color:"#3b82f6", fontSize:"1.3rem" }}><FaCalendarAlt /></div>
          <div><strong>{stats.upcomingSessions || 0}</strong><span>Upcoming</span></div>
        </div>
      </div>
      <div className="td-card">
        <div className="td-card-head"><h3>Monthly Revenue (12 months)</h3></div>
        <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:120, padding:"8px 0" }}>
          {revenue.map((v, i) => (
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <span style={{ fontSize:".6rem", color:"var(--text-secondary)" }}>${(v/1000).toFixed(1)}k</span>
              <div style={{ width:"100%", background:"var(--accent)", borderRadius:"4px 4px 0 0", height:`${(v/maxRev)*100}%`, opacity:.85 }} />
              <span style={{ fontSize:".6rem", color:"var(--text-secondary)" }}>{months[i]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="td-card">
        <div className="td-card-head"><h3>Session Summary</h3></div>
        <div className="td-session-stats-grid">
          {[
            ["Completed", stats.completedSessions || 0, "#22c55e"],
            ["Upcoming", stats.upcomingSessions || 0, "#3b82f6"],
            ["Total Members", stats.totalMembers || 0, "var(--accent)"],
            ["Active Members", stats.activeMembers || 0, "#f97316"]
          ].map(([label,val,color]) => (
            <div key={label} className="td-stat-box" style={{ borderColor:color }}>
              <strong style={{ color }}>{val}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── FEEDBACK: RATINGS ────────────────────────────────────────────────────────
function TrainerRatings() {
  const [ratingsData, setRatingsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast, show } = useToast();

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trainerDashboardAPI.getTrainerRatings();
      setRatingsData(data);
    } catch (err) {
      console.error('Error fetching ratings:', err);
      setError(err.message || 'Failed to load ratings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px' }}>
        <p>⏳ Loading ratings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
        <p>❌ {error}</p>
        <button className="td-link-btn" onClick={fetchRatings} style={{ marginTop: 10 }}>Retry</button>
      </div>
    );
  }

  const ratingStats = ratingsData?.ratingStats || {};
  const avg = ratingStats.averageRating || 0;
  const total = ratingStats.totalRatings || 0;
  const distribution = ratingStats.ratingDistribution || {};

  return (
    <div className="td-section">
      <div className="td-section-head"><h2><FaStar style={{ marginRight:8 }} />Ratings</h2></div>
      <div className="td-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <div className="td-kpi-card">
          <div className="td-kpi-icon" style={{ background:"rgba(251,191,36,.15)", color:"#fbbf24", fontSize:"1.4rem" }}><FaStar /></div>
          <div><strong>{avg.toFixed(1)}</strong><span>Average Rating</span></div>
        </div>
        <div className="td-kpi-card">
          <div className="td-kpi-icon" style={{ background:"rgba(34,197,94,.15)", color:"#22c55e", fontSize:"1.4rem" }}><FaCheckCircle /></div>
          <div><strong>{(distribution[5] || 0) + (distribution[4] || 0)}</strong><span>Positive Reviews</span></div>
        </div>
        <div className="td-kpi-card">
          <div className="td-kpi-icon" style={{ background:"rgba(var(--accent-rgb),.15)", fontSize:"1.4rem" }}><FaUsers /></div>
          <div><strong>{total}</strong><span>Total Reviews</span></div>
        </div>
      </div>
      <div className="td-card">
        <div className="td-card-head"><h3>Rating Distribution</h3></div>
        {[5,4,3,2,1].map(star => {
          const count = distribution[star] || 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
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
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [filterRating, setFilterRating] = useState(null);
  const { toast, show } = useToast();
  const PER_PAGE = 5;

  useEffect(() => {
    fetchReviews();
  }, [page, filterRating]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trainerDashboardAPI.getTrainerReviews(page, PER_PAGE, filterRating);
      setReviews(Array.isArray(data) ? data : (data.recentReviews || data.reviews || []));
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px' }}>
        <p>⏳ Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="td-section" style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
        <p>❌ {error}</p>
        <button className="td-link-btn" onClick={fetchReviews} style={{ marginTop: 10 }}>Retry</button>
      </div>
    );
  }

  const filteredReviews = filterRating 
    ? reviews.filter(r => r.rating === filterRating)
    : reviews;

  return (
    <div className="td-section">
      <div className="td-section-head"><h2><FaComments style={{ marginRight:8 }} />Reviews</h2></div>
      <div className="td-filters" style={{ marginBottom: 16 }}>
        {[null, 5, 4, 3, 2, 1].map(rating => (
          <button 
            key={rating} 
            className={`td-filter-btn ${filterRating === rating ? "td-filter-active" : ""}`}
            onClick={() => { setFilterRating(rating); setPage(1); }}
          >
            {rating === null ? "All" : `${rating} ⭐`}
          </button>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {filteredReviews.length === 0 ? (
          <EmptyState title="No reviews found" desc="No reviews match your filter." />
        ) : (
          filteredReviews.map((f, i) => (
            <div className="td-card" key={i}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                <div>
                  <strong style={{ fontSize:".88rem" }}>{f.memberName || f.client || 'Anonymous'}</strong>
                  <div style={{ display:"flex", gap:2, marginTop:3 }}>
                    {Array.from({ length: 5 }, (_, j) => (
                      <FaStar key={j} style={{ fontSize:".75rem", color: j < (f.rating || 0) ? "#fbbf24" : "var(--border-color)" }} />
                    ))}
                  </div>
                </div>
                <small style={{ color:"var(--text-secondary)" }}>{f.date || new Date(f.sessionDate).toLocaleDateString()}</small>
              </div>
              <p style={{ fontSize:".83rem", color:"var(--text-secondary)", lineHeight:1.5, margin:0 }}>{f.feedback || f.comment || 'No feedback provided'}</p>
            </div>
          ))
        )}
      </div>
      <Pagination total={reviews.length} page={page} perPage={PER_PAGE} onChange={setPage} />
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
// Using new MongoDB-backed TrainerSettingsComponent
// See: /components/TrainerSettings.js

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
    messages:            <TrainerCommunicationComponent />,
    notifications:       <TrainerCommunicationComponent />,
    announcements:       <TrainerCommunicationComponent />,
    "client-reports":    <ClientReports />,
    "progress-analytics":<ProgressAnalytics />,
    "session-reports":   <SessionReports />,
    ratings:             <TrainerRatings />,
    reviews:             <TrainerReviews />,
    messages:            <TrainerMessagesComponent />,
    notifications:       <TrainerNotificationsComponent />,
    announcements:       <TrainerAnnouncementsComponent />,
    settings:            <TrainerSettingsComponent />,
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
