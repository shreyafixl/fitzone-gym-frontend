import { useState, useCallback, memo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt, FaUsers, FaCalendarAlt, FaClipboardList, FaChartBar,
  FaCog, FaShieldAlt, FaHome, FaBell, FaDownload, FaPlus, FaEdit, FaTrash,
  FaMoneyBillWave, FaChartLine, FaSearch, FaCheckCircle, FaTimesCircle,
  FaSync, FaWrench, FaTools, FaTag, FaTags, FaEnvelope, FaBullhorn,
  FaUserCog, FaLock, FaChartPie, FaFileAlt, FaReceipt, FaCreditCard,
  FaExclamationTriangle, FaTicketAlt, FaAngleDown, FaKey, FaSpinner,
} from "react-icons/fa";
import {
  adminInfo, kpiData, revenueData, memberGrowthData,
  members, trainers, classes, enquiries, equipmentLog,
  pendingPayments, dueRenewals, attendanceData, popularClasses,
  attendanceLogs, classBookings, notificationsData, coupons,
  discounts, weeklySchedule, completedPayments, maintenanceLogs,
} from "../data/adminDashboardData";
import FormModal from "../components/FormModal";
import { FormRenderer, formTitles } from "../components/DynamicForms";
import { useFormModal } from "../hooks/useFormModal";
import DashboardThemeSwitcher, { useDashboardTheme } from "../components/DashboardThemeSwitcher";
import TrainerProfileSidebar from "../components/TrainerProfileSidebar";
import { adminMembersAPI, adminAttendanceAPI, adminCheckinsAPI, adminTrainersAPI, adminPermissionsAPI } from "../services/adminAPI";
import "../admin-dashboard.css";

// ─── NAV GROUPS ───────────────────────────────────────────────────────────────
// Dashboard is a DIRECT link — no dropdown, no children
const DASHBOARD_ITEM = { 
  id: "overview", 
  icon: <FaHome />, 
  label: "Dashboard",
  color: "#f97316",
};

const NAV_GROUPS = [
  {
    label: "Members",
    icon: <FaUsers />,
    color: "#3b82f6",
    items: [
      { id:"all-members", icon:<FaUsers />,        label:"All Members", color:"#3b82f6" },
      { id:"attendance",  icon:<FaCalendarAlt />,  label:"Attendance",  color:"#06b6d4" },
      { id:"checkins",    icon:<FaCheckCircle />,  label:"Check-ins",   color:"#22c55e" },
    ],
  },
  {
    label: "Staff",
    icon: <FaUserCog />,
    color: "#8b5cf6",
    items: [
      { id:"trainers",    icon:<FaUserCog />, label:"Trainers",    color:"#8b5cf6" },
      { id:"permissions", icon:<FaLock />,    label:"Permissions", color:"#a78bfa" },
    ],
  },
  {
    label: "Classes",
    icon: <FaCalendarAlt />,
    color: "#06b6d4",
    items: [
      { id:"schedule",   icon:<FaCalendarAlt />,  label:"Schedule",   color:"#06b6d4" },
      { id:"bookings",   icon:<FaClipboardList />, label:"Bookings",   color:"#0ea5e9" },
      { id:"categories", icon:<FaTags />,          label:"Categories", color:"#38bdf8" },
    ],
  },
  {
    label: "Enquiries",
    icon: <FaFileAlt />,
    color: "#f59e0b",
    items: [
      { id:"leads",       icon:<FaFileAlt />,       label:"Leads",       color:"#f59e0b" },
      { id:"followups",   icon:<FaEnvelope />,      label:"Follow-ups",  color:"#fbbf24" },
      { id:"conversions", icon:<FaChartLine />,     label:"Conversions", color:"#22c55e" },
    ],
  },
  {
    label: "Engagement",
    icon: <FaBell />,
    color: "#ec4899",
    items: [
      { id:"notifications", icon:<FaBell />,     label:"Notifications", color:"#ec4899" },
      { id:"announcements", icon:<FaBullhorn />, label:"Announcements", color:"#f43f5e" },
      { id:"communication", icon:<FaEnvelope />, label:"Communication", color:"#fb7185" },
    ],
  },
  {
    label: "Reports",
    icon: <FaFileAlt />,
    color: "#10b981",
    items: [
      { id:"rev-report",  icon:<FaMoneyBillWave />, label:"Revenue",     color:"#10b981" },
      { id:"att-report",  icon:<FaChartBar />,      label:"Attendance",  color:"#34d399" },
      { id:"perf-report", icon:<FaChartLine />,     label:"Performance", color:"#6ee7b7" },
    ],
  },
  {
    label: "Analytics",
    icon: <FaChartPie />,
    color: "#6366f1",
    items: [
      { id:"analytics-members", icon:<FaUsers />,    label:"Members",        color:"#6366f1" },
      { id:"analytics-revenue", icon:<FaChartLine />,label:"Revenue Trends", color:"#818cf8" },
      { id:"analytics-classes", icon:<FaChartPie />, label:"Popular Classes",color:"#a5b4fc" },
    ],
  },
  {
    label: "Operations",
    icon: <FaTools />,
    color: "#f97316",
    items: [
      { id:"equipment",   icon:<FaTools />,  label:"Equipment",   color:"#f97316" },
      { id:"maintenance", icon:<FaWrench />, label:"Maintenance", color:"#fb923c" },
    ],
  },
  {
    label: "Billing",
    icon: <FaCreditCard />,
    color: "#14b8a6",
    items: [
      { id:"payments",     icon:<FaCreditCard />,        label:"Payments",     color:"#14b8a6" },
      { id:"renewals",     icon:<FaSync />,              label:"Renewals",     color:"#2dd4bf" },
      { id:"pending-dues", icon:<FaExclamationTriangle />,label:"Pending Dues",color:"#ef4444" },
    ],
  },
  {
    label: "Offers",
    icon: <FaTag />,
    color: "#f43f5e",
    items: [
      { id:"coupons",   icon:<FaTicketAlt />, label:"Coupons",   color:"#f43f5e" },
      { id:"discounts", icon:<FaTag />,       label:"Discounts", color:"#fb7185" },
    ],
  },
  {
    label: "Settings",
    icon: <FaCog />,
    color: "#64748b",
    items: [{ id:"settings", icon:<FaCog />, label:"Settings", color:"#64748b" }],
  },
];

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const ABadge = memo(({ s }) => {
  const m = {
    active:"ad-green", expired:"ad-red", suspended:"ad-yellow", inactive:"ad-gray",
    new:"ad-blue", contacted:"ad-yellow", converted:"ad-green", not_interested:"ad-gray",
    operational:"ad-green", maintenance:"ad-yellow", out_of_order:"ad-red",
    paid:"ad-green", on_leave:"ad-yellow", confirmed:"ad-green",
    waitlisted:"ad-yellow", cancelled:"ad-red", "in-progress":"ad-yellow",
    pending:"ad-yellow", completed:"ad-green", enabled:"ad-green", disabled:"ad-gray",
    active_coupon:"ad-green", upcoming:"ad-blue", success:"ad-green", failed:"ad-red",
  };
  return <span className={`ad-badge ${m[s] || "ad-gray"}`}>{s?.replace(/_/g," ")}</span>;
});

function Toast({ msg, onClose }) {
  return (
    <div className="ad-toast">
      <span>✅ {msg}</span>
      <button onClick={onClose} className="ad-toast-close">×</button>
    </div>
  );
}

function useToast() {
  const [toast, setToast] = useState(null);
  const show = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);
  return { toast, show };
}

function BarChart({ data, labels, color = "var(--accent)", height = 130 }) {
  const max = Math.max(...data);
  return (
    <div className="ad-bar-chart" style={{ height }}>
      {data.map((v, i) => (
        <div className="ad-bar-col" key={i}>
          <span className="ad-bar-val">{v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}</span>
          <div className="ad-bar" style={{ height:`${(v/max)*100}%`, background: color }} />
          <span className="ad-bar-label">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function ProgressBar({ value, max = 100, color = "var(--accent)" }) {
  return (
    <div style={{ background:"var(--bg-primary)", borderRadius:4, height:8, overflow:"hidden" }}>
      <div style={{ width:`${Math.min((value/max)*100,100)}%`, height:"100%", background:color, borderRadius:4, transition:"width .4s" }} />
    </div>
  );
}

function KpiCard({ icon, label, value, change, color }) {
  return (
    <div className="ad-kpi-card">
      <div className="ad-kpi-icon" style={{ background: color + "22" }}>{icon}</div>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
        {change && <small>{change}</small>}
      </div>
    </div>
  );
}

function EmptyState({ icon = "📭", title = "No data found", desc = "Nothing to display here yet." }) {
  return (
    <div className="ad-empty">
      <div className="ad-empty-icon">{icon}</div>
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
  );
}

function AdModal({ title, onClose, children }) {
  return (
    <div className="ad-modal-overlay" onClick={onClose}>
      <div className="ad-modal" onClick={e => e.stopPropagation()}>
        <div className="ad-modal-head">
          <h3>{title}</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="ad-modal-body">{children}</div>
      </div>
    </div>
  );
}

function Pagination({ total, page, perPage, onChange }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  return (
    <div className="ad-pagination">
      <button disabled={page === 1} onClick={() => onChange(page - 1)} className="ad-page-btn">‹</button>
      {Array.from({ length: pages }, (_, i) => (
        <button key={i} className={`ad-page-btn ${page === i+1 ? "ad-page-active" : ""}`} onClick={() => onChange(i+1)}>{i+1}</button>
      ))}
      <button disabled={page === pages} onClick={() => onChange(page + 1)} className="ad-page-btn">›</button>
    </div>
  );
}

// ─── OVERVIEW ─────────────────────────────────────────────────────────────────
function AdminOverview() {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return (
    <div className="ad-section">
      <div className="ad-section-head"><h2>📊 Overview</h2></div>
      <div className="ad-kpi-grid">
        {kpiData.map((k, i) => (
          <KpiCard key={i} icon={k.icon} label={k.label} value={k.value} change={k.change} color={k.color} />
        ))}
      </div>
      <div className="ad-two-col">
        <div className="ad-card">
          <div className="ad-card-head"><h3>💰 Revenue Trend (12 months)</h3></div>
          <BarChart data={revenueData} labels={months} color="var(--accent)" />
        </div>
        <div className="ad-card">
          <div className="ad-card-head"><h3>📈 New Member Growth</h3></div>
          <BarChart data={memberGrowthData} labels={months.map(m=>m[0])} color="#22c55e" />
        </div>
      </div>
      <div className="ad-two-col">
        <div className="ad-card">
          <div className="ad-card-head"><h3>🏃 Weekly Attendance</h3></div>
          <BarChart data={attendanceData.map(d=>d.checkins)} labels={attendanceData.map(d=>d.day)} color="#3b82f6" height={110} />
        </div>
        <div className="ad-card">
          <div className="ad-card-head"><h3>🔥 Class Occupancy Heatmap</h3></div>
          <div className="ad-heatmap">
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
              <div className="ad-heatmap-row" key={d}>
                <span>{d}</span>
                {["6AM","8AM","10AM","12PM","3PM","5PM","7PM","9PM"].map(t => {
                  const v = Math.floor(Math.random() * 100);
                  return <div key={t} className="ad-heat-cell" style={{ background:`rgba(232,98,42,${v/100})` }} title={`${d} ${t}: ${v}%`} />;
                })}
              </div>
            ))}
            <div className="ad-heatmap-times">
              {["6AM","8AM","10AM","12PM","3PM","5PM","7PM","9PM"].map(t => <span key={t}>{t}</span>)}
            </div>
          </div>
        </div>
      </div>
      <div className="ad-card">
        <div className="ad-card-head">
          <h3>⚠️ Due Renewals</h3>
          <span className="ad-badge ad-red">{pendingPayments.length} overdue</span>
        </div>
        <table className="ad-table">
          <thead><tr><th>Member</th><th>Plan</th><th>Amount</th><th>Due Date</th><th>Days Overdue</th><th>Action</th></tr></thead>
          <tbody>
            {pendingPayments.map((p, i) => (
              <tr key={i}>
                <td><strong>{p.member}</strong></td>
                <td>{p.plan}</td>
                <td><strong>{p.amount}</strong></td>
                <td>{p.due}</td>
                <td><span className="ad-badge ad-red">{p.days} days</span></td>
                <td><button className="ad-link-btn">Send Reminder</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── MEMBERS: ALL MEMBERS ─────────────────────────────────────────────────────
function AdminAllMembers({ openForm }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [filters, setFilters] = useState({ status: "all", plan: "all", search: "" });
  const [showAdd, setShowAdd] = useState(false);
  const [viewMember, setViewMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [newMember, setNewMember] = useState({ name: "", email: "", phone: "", age: 18, plan: "monthly", status: "active" });
  const { toast, show } = useToast();

  // Fetch members from API
  const fetchMembers = useCallback(async (page = 1, filtersObj = filters) => {
    try {
      setLoading(true);
      setError(null);
      const filterParams = {};
      if (filtersObj.status !== "all") filterParams.status = filtersObj.status;
      if (filtersObj.plan !== "all") filterParams.plan = filtersObj.plan;
      if (filtersObj.search) filterParams.search = filtersObj.search;
      
      const response = await adminMembersAPI.getAllMembers(page, 10, filterParams);
      setMembers(response.data.members || []);
      setPagination(response.data.pagination || { page, limit: 10, total: 0, pages: 0 });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch members");
      show(`Error: ${err.response?.data?.message || "Failed to fetch members"}`);
    } finally {
      setLoading(false);
    }
  }, [filters, show]);

  // Fetch on mount
  useEffect(() => {
    fetchMembers(1, filters);
  }, []);

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    fetchMembers(newPage, filters);
  }, [filters, fetchMembers]);

  // Handle filter change
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchMembers(1, { ...filters, [key]: value });
  }, [filters, fetchMembers]);

  // Handle add member
  const handleAddMember = useCallback(async () => {
    if (!newMember.name || !newMember.email || !newMember.phone || !newMember.age) {
      show("Please fill all required fields");
      return;
    }
    if (newMember.age < 13 || newMember.age > 120) {
      show("Age must be between 13 and 120");
      return;
    }
    try {
      setLoading(true);
      await adminMembersAPI.createMember(newMember);
      show("Member added successfully!");
      setNewMember({ name: "", email: "", phone: "", age: 18, plan: "monthly", status: "active" });
      setShowAdd(false);
      fetchMembers(1, filters);
    } catch (err) {
      show(`Error: ${err.response?.data?.message || "Failed to add member"}`);
    } finally {
      setLoading(false);
    }
  }, [newMember, filters, fetchMembers, show]);

  // Handle edit member
  const handleEditMember = useCallback(async () => {
    if (!editingMember._id) return;
    try {
      setLoading(true);
      await adminMembersAPI.updateMember(editingMember._id, editingMember);
      show("Member updated successfully!");
      setEditingMember(null);
      setViewMember(null);
      fetchMembers(pagination.page, filters);
    } catch (err) {
      show(`Error: ${err.response?.data?.message || "Failed to update member"}`);
    } finally {
      setLoading(false);
    }
  }, [editingMember, pagination.page, filters, fetchMembers, show]);

  // Handle delete member
  const handleDeleteMember = useCallback(async (memberId) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      setLoading(true);
      await adminMembersAPI.deleteMember(memberId);
      show("Member deleted successfully!");
      fetchMembers(pagination.page, filters);
    } catch (err) {
      show(`Error: ${err.response?.data?.message || "Failed to delete member"}`);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filters, fetchMembers, show]);

  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head">
        <h2>👥 All Members</h2>
        <div className="ad-head-actions">
          <button className="btn btn-primary ad-btn-sm" onClick={() => setShowAdd(true)}>+ Add Member</button>
          <button className="btn btn-outline ad-btn-sm" onClick={() => show("Exporting CSV...")}>⬇ Export CSV</button>
        </div>
      </div>
      <div className="ad-filters">
        <input 
          className="ad-input" 
          placeholder="🔍 Search name or email…" 
          value={filters.search} 
          onChange={e => handleFilterChange("search", e.target.value)} 
          style={{ maxWidth:220 }} 
        />
        <div className="ad-filter-group">
          <span className="ad-filter-label">Plan:</span>
          {["all","monthly","quarterly","half-yearly","yearly"].map(f => (
            <button key={f} className={`ad-filter-btn ${filters.plan===f?"ad-filter-active":""}`} onClick={() => handleFilterChange("plan", f)}>{f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>
        <div className="ad-filter-group">
          <span className="ad-filter-label">Status:</span>
          {["all","active","expired","suspended","inactive"].map(f => (
            <button key={f} className={`ad-filter-btn ${filters.status===f?"ad-filter-active":""}`} onClick={() => handleFilterChange("status", f)}>{f}</button>
          ))}
        </div>
      </div>
      <div className="ad-card">
        <div className="ad-card-head"><h3>Showing {members.length} of {pagination.total} members</h3></div>
        {loading && <div style={{ textAlign: "center", padding: "40px" }}><FaSpinner style={{ animation: "spin 1s linear infinite", fontSize: "2rem" }} /></div>}
        {error && <div style={{ color: "#ef4444", padding: "20px", textAlign: "center" }}>{error} <button onClick={() => fetchMembers(pagination.page, filters)} className="ad-link-btn">Retry</button></div>}
        {!loading && members.length === 0 && <EmptyState title="No members found" desc="Try adjusting your search or filters." />}
        {!loading && members.length > 0 && (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead><tr><th>Name</th><th>Email</th><th>Plan</th><th>Status</th><th>Joined</th><th>Check-ins</th><th>Actions</th></tr></thead>
              <tbody>
                {members.map(m => (
                  <tr key={m._id}>
                    <td><strong>{m.fullName}</strong></td>
                    <td style={{ fontSize:".8rem" }}>{m.email}</td>
                    <td>{m.membershipPlan}</td>
                    <td><ABadge s={m.membershipStatus} /></td>
                    <td style={{ fontSize:".8rem" }}>{m.joinDate ? new Date(m.joinDate).toLocaleDateString() : "—"}</td>
                    <td>{m.checkins || 0}</td>
                    <td>
                      <div style={{ display:"flex", gap:6 }}>
                        <button className="ad-link-btn" onClick={() => { setEditingMember(m); setViewMember(m); }}>Edit</button>
                        <button className="ad-link-btn" style={{ color: "#ef4444" }} onClick={() => handleDeleteMember(m._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && pagination.pages > 1 && <Pagination total={pagination.total} page={pagination.page} perPage={pagination.limit} onChange={handlePageChange} />}
      </div>

      {showAdd && (
        <AdModal title="Add New Member" onClose={() => setShowAdd(false)}>
          {[["Full Name","name","text"],["Email","email","email"],["Phone","phone","tel"],["Age","age","number"]].map(([label,key,type]) => (
            <div className="ad-form-group" key={key}>
              <label>{label}</label>
              <input className="ad-input" type={type} placeholder={label} value={newMember[key]} onChange={e => setNewMember(p => ({ ...p, [key]: type === "number" ? parseInt(e.target.value) || 0 : e.target.value }))} />
            </div>
          ))}
          <div className="ad-form-group">
            <label>Membership Plan</label>
            <select className="ad-input" value={newMember.plan} onChange={e => setNewMember(p => ({ ...p, plan:e.target.value }))}>
              {["monthly","quarterly","half-yearly","yearly"].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" style={{ width:"100%", marginTop:8 }} onClick={handleAddMember} disabled={loading}>Add Member</button>
        </AdModal>
      )}

      {viewMember && editingMember && (
        <AdModal title="Edit Member" onClose={() => { setViewMember(null); setEditingMember(null); }}>
          <div className="ad-form-group">
            <label>Name</label>
            <input className="ad-input" type="text" value={editingMember.fullName || ""} onChange={e => setEditingMember(p => ({ ...p, fullName:e.target.value, name:e.target.value }))} />
          </div>
          <div className="ad-form-group">
            <label>Email</label>
            <input className="ad-input" type="email" value={editingMember.email || ""} onChange={e => setEditingMember(p => ({ ...p, email:e.target.value }))} />
          </div>
          <div className="ad-form-group">
            <label>Phone</label>
            <input className="ad-input" type="tel" value={editingMember.phone || ""} onChange={e => setEditingMember(p => ({ ...p, phone:e.target.value }))} />
          </div>
          <div className="ad-form-group">
            <label>Plan</label>
            <select className="ad-input" value={editingMember.membershipPlan || ""} onChange={e => setEditingMember(p => ({ ...p, membershipPlan:e.target.value, plan:e.target.value }))}>
              {["monthly","quarterly","half-yearly","yearly"].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>
          </div>
          <div className="ad-form-group">
            <label>Status</label>
            <select className="ad-input" value={editingMember.membershipStatus || ""} onChange={e => setEditingMember(p => ({ ...p, membershipStatus:e.target.value, status:e.target.value }))}>
              {["active","inactive","suspended","expired"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display:"flex", gap:8, marginTop:12 }}>
            <button className="btn btn-primary ad-btn-sm" onClick={handleEditMember} disabled={loading}>Save Changes</button>
            <button className="btn btn-outline ad-btn-sm" onClick={() => { setViewMember(null); setEditingMember(null); }}>Cancel</button>
          </div>
        </AdModal>
      )}
    </div>
  );
}

// ─── MEMBERS: ATTENDANCE ──────────────────────────────────────────────────────
function AdminAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [filters, setFilters] = useState({ memberId: "", dateFrom: "", dateTo: "" });
  const [stats, setStats] = useState({ totalCheckins: 0, avgDuration: 0, peakHours: [] });
  const { toast, show } = useToast();

  // Fetch attendance from API
  const fetchAttendance = useCallback(async (page = 1, filtersObj = filters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAttendanceAPI.getAttendance(page, 10, filtersObj);
      setAttendance(response.data || []);
      setPagination(response.pagination || { page, limit: 10, total: 0, pages: 0 });
      if (response.stats) setStats(response.stats);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch attendance");
      show(`Error: ${err.response?.data?.message || "Failed to fetch attendance"}`);
    } finally {
      setLoading(false);
    }
  }, [filters, show]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await adminAttendanceAPI.getAttendanceStats();
      setStats(response);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchAttendance(1, filters);
    fetchStats();
  }, []);

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    fetchAttendance(newPage, filters);
  }, [filters, fetchAttendance]);

  // Handle filter change
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchAttendance(1, { ...filters, [key]: value });
  }, [filters, fetchAttendance]);

  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  return (
    <div className="ad-section">
      <div className="ad-section-head"><h2>📅 Attendance</h2></div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <KpiCard icon="🏃" label="Total Check-ins" value={stats.totalCheckins || 0} color="#3b82f6" />
        <KpiCard icon="📅" label="Avg Duration" value={stats.avgDuration ? `${Math.round(stats.avgDuration)}m` : "—"} color="#22c55e" />
        <KpiCard icon="📊" label="Peak Hours" value={stats.peakHours?.[0] || "—"} color="var(--accent)" />
      </div>
      <div className="ad-card">
        <div className="ad-card-head"><h3>📋 Attendance Records</h3></div>
        <div className="ad-filters" style={{ marginBottom:12 }}>
          <input 
            className="ad-input" 
            placeholder="🔍 Search member…" 
            value={filters.memberId} 
            onChange={e => handleFilterChange("memberId", e.target.value)} 
            style={{ maxWidth:220 }} 
          />
          <input 
            className="ad-input" 
            type="date"
            placeholder="From Date"
            value={filters.dateFrom}
            onChange={e => handleFilterChange("dateFrom", e.target.value)}
            style={{ maxWidth:150 }}
          />
          <input 
            className="ad-input" 
            type="date"
            placeholder="To Date"
            value={filters.dateTo}
            onChange={e => handleFilterChange("dateTo", e.target.value)}
            style={{ maxWidth:150 }}
          />
        </div>
        {loading && <div style={{ textAlign: "center", padding: "40px" }}><FaSpinner style={{ animation: "spin 1s linear infinite", fontSize: "2rem" }} /></div>}
        {error && <div style={{ color: "#ef4444", padding: "20px", textAlign: "center" }}>{error} <button onClick={() => fetchAttendance(pagination.page, filters)} className="ad-link-btn">Retry</button></div>}
        {!loading && attendance.length === 0 && <EmptyState title="No attendance records found" />}
        {!loading && attendance.length > 0 && (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead><tr><th>Member</th><th>Date</th><th>Check-in</th><th>Check-out</th><th>Duration</th></tr></thead>
              <tbody>
                {attendance.map(a => (
                  <tr key={a._id}>
                    <td><strong>{a.memberId?.name || "—"}</strong></td>
                    <td style={{ fontSize:".8rem" }}>{a.date ? new Date(a.date).toLocaleDateString() : "—"}</td>
                    <td style={{ color:"#22c55e", fontWeight:700 }}>{a.checkInTime ? new Date(a.checkInTime).toLocaleTimeString() : "—"}</td>
                    <td style={{ color:"var(--text-secondary)" }}>{a.checkOutTime ? new Date(a.checkOutTime).toLocaleTimeString() : "—"}</td>
                    <td><span className="ad-badge ad-blue">{a.duration ? `${a.duration}m` : "—"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && pagination.pages > 1 && <Pagination total={pagination.total} page={pagination.page} perPage={pagination.limit} onChange={handlePageChange} />}
      </div>
    </div>
  );
}

// ─── MEMBERS: CHECK-INS ───────────────────────────────────────────────────────
function AdminCheckins() {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [filters, setFilters] = useState({ status: "all", memberId: "", dateFrom: "" });
  const [stats, setStats] = useState({ activeMembers: 0, totalCheckinsToday: 0, avgDuration: 0 });
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [members, setMembers] = useState([]);
  const { toast, show } = useToast();

  // Fetch check-ins from API
  const fetchCheckins = useCallback(async (page = 1, filtersObj = filters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminCheckinsAPI.getCheckins(page, 10, filtersObj);
      setCheckins(response.data || []);
      setPagination(response.pagination || { page, limit: 10, total: 0, pages: 0 });
      if (response.stats) setStats(response.stats);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch check-ins");
      show(`Error: ${err.response?.data?.message || "Failed to fetch check-ins"}`);
    } finally {
      setLoading(false);
    }
  }, [filters, show]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await adminCheckinsAPI.getCheckinsStats();
      setStats(response);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, []);

  // Fetch members for modal
  const fetchMembers = useCallback(async () => {
    try {
      const response = await adminMembersAPI.getAllMembers(1, 100, { status: "active" });
      setMembers(response.data || []);
    } catch (err) {
      console.error("Failed to fetch members:", err);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchCheckins(1, filters);
    fetchStats();
    fetchMembers();
  }, []);

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    fetchCheckins(newPage, filters);
  }, [filters, fetchCheckins]);

  // Handle filter change
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchCheckins(1, { ...filters, [key]: value });
  }, [filters, fetchCheckins]);

  // Handle check-in
  const handleCheckin = useCallback(async () => {
    if (!selectedMemberId) {
      show("Please select a member");
      return;
    }
    try {
      setLoading(true);
      await adminCheckinsAPI.createCheckin(selectedMemberId);
      show("Check-in recorded successfully!");
      setShowCheckinModal(false);
      setSelectedMemberId("");
      fetchCheckins(pagination.page, filters);
      fetchStats();
    } catch (err) {
      show(`Error: ${err.response?.data?.message || "Failed to record check-in"}`);
    } finally {
      setLoading(false);
    }
  }, [selectedMemberId, pagination.page, filters, fetchCheckins, fetchStats, show]);

  // Handle check-out
  const handleCheckout = useCallback(async (checkinId) => {
    try {
      setLoading(true);
      await adminCheckinsAPI.checkoutMember(checkinId);
      show("Check-out recorded successfully!");
      fetchCheckins(pagination.page, filters);
      fetchStats();
    } catch (err) {
      show(`Error: ${err.response?.data?.message || "Failed to record check-out"}`);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filters, fetchCheckins, fetchStats, show]);

  return (
    <div className="ad-section">
      <div className="ad-section-head">
        <h2>✅ Check-ins</h2>
        <span className="ad-badge ad-green">{stats.activeMembers || 0} active</span>
      </div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <KpiCard icon="✅" label="Active Members" value={stats.activeMembers || 0} color="#22c55e" />
        <KpiCard icon="📊" label="Today Check-ins" value={stats.totalCheckinsToday || 0} color="var(--accent)" />
        <KpiCard icon="⏱️" label="Avg Duration" value={stats.avgDuration ? `${Math.round(stats.avgDuration)}m` : "—"} color="#3b82f6" />
      </div>
      <div className="ad-card">
        <div className="ad-card-head">
          <h3>🔴 Check-in Records</h3>
          <button className="btn btn-primary ad-btn-sm" onClick={() => setShowCheckinModal(true)}>+ Check-in</button>
        </div>
        <div className="ad-filters" style={{ marginBottom:12 }}>
          <select 
            className="ad-input" 
            value={filters.status} 
            onChange={e => handleFilterChange("status", e.target.value)}
            style={{ maxWidth:150 }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <input 
            className="ad-input" 
            type="date"
            value={filters.dateFrom}
            onChange={e => handleFilterChange("dateFrom", e.target.value)}
            style={{ maxWidth:150 }}
          />
        </div>
        {loading && <div style={{ textAlign: "center", padding: "40px" }}><FaSpinner style={{ animation: "spin 1s linear infinite", fontSize: "2rem" }} /></div>}
        {error && <div style={{ color: "#ef4444", padding: "20px", textAlign: "center" }}>{error} <button onClick={() => fetchCheckins(pagination.page, filters)} className="ad-link-btn">Retry</button></div>}
        {!loading && checkins.length === 0 && <EmptyState title="No check-ins recorded" />}
        {!loading && checkins.length > 0 && (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead><tr><th>Member</th><th>Check-in Time</th><th>Check-out Time</th><th>Duration</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {checkins.map(c => (
                  <tr key={c._id}>
                    <td><strong>{c.memberId?.name || "—"}</strong></td>
                    <td style={{ fontSize:".8rem" }}>{c.checkInTime ? new Date(c.checkInTime).toLocaleTimeString() : "—"}</td>
                    <td style={{ fontSize:".8rem" }}>{c.checkOutTime ? new Date(c.checkOutTime).toLocaleTimeString() : "—"}</td>
                    <td><span className="ad-badge ad-blue">{c.duration ? `${c.duration}m` : "—"}</span></td>
                    <td><ABadge s={c.status} /></td>
                    <td>
                      {c.status === "active" && (
                        <button className="ad-link-btn" onClick={() => handleCheckout(c._id)} disabled={loading}>Check-out</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && pagination.pages > 1 && <Pagination total={pagination.total} page={pagination.page} perPage={pagination.limit} onChange={handlePageChange} />}
      </div>

      {showCheckinModal && (
        <AdModal title="Record Check-in" onClose={() => setShowCheckinModal(false)}>
          <div className="ad-form-group">
            <label>Select Member</label>
            <select 
              className="ad-input" 
              value={selectedMemberId} 
              onChange={e => setSelectedMemberId(e.target.value)}
            >
              <option value="">— Choose member —</option>
              {members.map(m => <option key={m._id} value={m._id}>{m.name} ({m.plan})</option>)}
            </select>
          </div>
          <div style={{ display:"flex", gap:8, marginTop:12 }}>
            <button className="btn btn-primary ad-btn-sm" onClick={handleCheckin} disabled={loading || !selectedMemberId}>Record Check-in</button>
            <button className="btn btn-outline ad-btn-sm" onClick={() => setShowCheckinModal(false)}>Cancel</button>
          </div>
        </AdModal>
      )}
    </div>
  );
}

// ─── STAFF: TRAINERS ──────────────────────────────────────────────────────────
function AdminTrainers({ openForm }) {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [filters, setFilters] = useState({ search: "", trainerStatus: "all", specialization: "all" });
  const [showAdd, setShowAdd] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [profileTrainer, setProfileTrainer] = useState(null);
  const [newTrainer, setNewTrainer] = useState({ fullName: "", email: "", phone: "", specialization: "", trainerStatus: "active" });
  const { toast, show } = useToast();

  // Fetch trainers from API
  const fetchTrainers = useCallback(async (page = 1, filtersObj = filters) => {
    try {
      setLoading(true);
      setError(null);
      const filterParams = {};
      if (filtersObj.trainerStatus !== "all") filterParams.trainerStatus = filtersObj.trainerStatus;
      if (filtersObj.search) filterParams.search = filtersObj.search;
      
      const response = await adminTrainersAPI.getAllTrainers(page, 10, filterParams);
      setTrainers(response.data.trainers || []);
      setPagination(response.data.pagination || { page, limit: 10, total: 0, pages: 0 });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch trainers");
      show(`Error: ${err.response?.data?.message || "Failed to fetch trainers"}`);
    } finally {
      setLoading(false);
    }
  }, [filters, show]);

  // Fetch on mount
  useEffect(() => {
    fetchTrainers(1, filters);
  }, []);

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    fetchTrainers(newPage, filters);
  }, [filters, fetchTrainers]);

  // Handle filter change
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchTrainers(1, { ...filters, [key]: value });
  }, [filters, fetchTrainers]);

  // Handle add trainer
  const handleAddTrainer = useCallback(async () => {
    if (!newTrainer.fullName || !newTrainer.email || !newTrainer.phone) {
      show("Please fill all required fields");
      return;
    }
    try {
      setLoading(true);
      await adminTrainersAPI.createTrainer(newTrainer);
      show("Trainer added successfully!");
      setNewTrainer({ fullName: "", email: "", phone: "", specialization: "", trainerStatus: "active" });
      setShowAdd(false);
      fetchTrainers(1, filters);
    } catch (err) {
      show(`Error: ${err.response?.data?.message || "Failed to add trainer"}`);
    } finally {
      setLoading(false);
    }
  }, [newTrainer, filters, fetchTrainers, show]);

  // Handle edit trainer
  const handleEditTrainer = useCallback(async () => {
    if (!editingTrainer._id) return;
    try {
      setLoading(true);
      await adminTrainersAPI.updateTrainer(editingTrainer._id, editingTrainer);
      show("Trainer updated successfully!");
      setEditingTrainer(null);
      setProfileTrainer(null);
      fetchTrainers(pagination.page, filters);
    } catch (err) {
      show(`Error: ${err.response?.data?.message || "Failed to update trainer"}`);
    } finally {
      setLoading(false);
    }
  }, [editingTrainer, pagination.page, filters, fetchTrainers, show]);

  // Handle delete trainer
  const handleDeleteTrainer = useCallback(async (trainerId) => {
    if (!window.confirm("Are you sure you want to delete this trainer?")) return;
    try {
      setLoading(true);
      await adminTrainersAPI.deleteTrainer(trainerId);
      show("Trainer deleted successfully!");
      fetchTrainers(pagination.page, filters);
    } catch (err) {
      show(`Error: ${err.response?.data?.message || "Failed to delete trainer"}`);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filters, fetchTrainers, show]);

  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head">
        <h2>🏋️ Trainers</h2>
        <button className="btn btn-primary ad-btn-sm" onClick={() => setShowAdd(true)}>+ Add Trainer</button>
      </div>
      <div className="ad-filters">
        <input 
          className="ad-input" 
          placeholder="🔍 Search trainer…" 
          value={filters.search} 
          onChange={e => handleFilterChange("search", e.target.value)} 
          style={{ maxWidth:220 }} 
        />
        <div className="ad-filter-group">
          <span className="ad-filter-label">Status:</span>
          {["all","active","inactive","on-leave"].map(f => (
            <button key={f} className={`ad-filter-btn ${filters.trainerStatus===f?"ad-filter-active":""}`} onClick={() => handleFilterChange("trainerStatus", f)}>{f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>
      </div>
      <div className="ad-card">
        <div className="ad-card-head"><h3>Showing {trainers.length} of {pagination.total} trainers</h3></div>
        {loading && <div style={{ textAlign: "center", padding: "40px" }}><FaSpinner style={{ animation: "spin 1s linear infinite", fontSize: "2rem" }} /></div>}
        {error && <div style={{ color: "#ef4444", padding: "20px", textAlign: "center" }}>{error} <button onClick={() => fetchTrainers(pagination.page, filters)} className="ad-link-btn">Retry</button></div>}
        {!loading && trainers.length === 0 && <EmptyState title="No trainers found" desc="Try adjusting your search or filters." />}
        {!loading && trainers.length > 0 && (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead><tr><th>Name</th><th>Email</th><th>Specialization</th><th>Status</th><th>Members</th><th>Actions</th></tr></thead>
              <tbody>
                {trainers.map(t => (
                  <tr key={t._id}>
                    <td><strong>{t.fullName}</strong></td>
                    <td style={{ fontSize:".8rem" }}>{t.email}</td>
                    <td>{t.specialization || "—"}</td>
                    <td><ABadge s={t.trainerStatus} /></td>
                    <td>{t.activeMembersCount || 0}</td>
                    <td>
                      <div style={{ display:"flex", gap:6 }}>
                        <button className="ad-link-btn" onClick={() => { setEditingTrainer(t); setProfileTrainer(t); }}>Edit</button>
                        <button className="ad-link-btn" style={{ color: "#ef4444" }} onClick={() => handleDeleteTrainer(t._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && pagination.pages > 1 && <Pagination total={pagination.total} page={pagination.page} perPage={pagination.limit} onChange={handlePageChange} />}
      </div>

      {showAdd && (
        <AdModal title="Add New Trainer" onClose={() => setShowAdd(false)}>
          {[["Full Name","fullName","text"],["Email","email","email"],["Phone","phone","tel"],["Specialization","specialization","text"]].map(([label,key,type]) => (
            <div className="ad-form-group" key={key}>
              <label>{label}</label>
              <input className="ad-input" type={type} placeholder={label} value={newTrainer[key]} onChange={e => setNewTrainer(p => ({ ...p, [key]:e.target.value }))} />
            </div>
          ))}
          <button className="btn btn-primary" style={{ width:"100%", marginTop:8 }} onClick={handleAddTrainer} disabled={loading}>Add Trainer</button>
        </AdModal>
      )}

      {profileTrainer && editingTrainer && (
        <AdModal title="Edit Trainer" onClose={() => { setProfileTrainer(null); setEditingTrainer(null); }}>
          <div className="ad-form-group">
            <label>Full Name</label>
            <input className="ad-input" type="text" value={editingTrainer.fullName || ""} onChange={e => setEditingTrainer(p => ({ ...p, fullName:e.target.value }))} />
          </div>
          <div className="ad-form-group">
            <label>Email</label>
            <input className="ad-input" type="email" value={editingTrainer.email || ""} onChange={e => setEditingTrainer(p => ({ ...p, email:e.target.value }))} />
          </div>
          <div className="ad-form-group">
            <label>Phone</label>
            <input className="ad-input" type="tel" value={editingTrainer.phone || ""} onChange={e => setEditingTrainer(p => ({ ...p, phone:e.target.value }))} />
          </div>
          <div className="ad-form-group">
            <label>Specialization</label>
            <input className="ad-input" type="text" value={editingTrainer.specialization || ""} onChange={e => setEditingTrainer(p => ({ ...p, specialization:e.target.value }))} />
          </div>
          <div className="ad-form-group">
            <label>Status</label>
            <select className="ad-input" value={editingTrainer.trainerStatus || ""} onChange={e => setEditingTrainer(p => ({ ...p, trainerStatus:e.target.value }))}>
              {["active","inactive","on-leave"].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div style={{ display:"flex", gap:8, marginTop:12 }}>
            <button className="btn btn-primary ad-btn-sm" onClick={handleEditTrainer} disabled={loading}>Save Changes</button>
            <button className="btn btn-outline ad-btn-sm" onClick={() => { setProfileTrainer(null); setEditingTrainer(null); }}>Cancel</button>
          </div>
        </AdModal>
      )}
    </div>
  );
}

// ─── STAFF: PERMISSIONS ───────────────────────────────────────────────────────
function AdminPermissions() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast, show } = useToast();

  // Fetch permissions on mount
  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminPermissionsAPI.getAllPermissions();
      setPermissions(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch permissions");
      show(`Error: ${err.response?.data?.message || "Failed to fetch permissions"}`);
    } finally {
      setLoading(false);
    }
  }, [show]);

  const handleTogglePermission = useCallback(async (staffId, permissionKey) => {
    try {
      const staff = permissions.find(p => p._id === staffId);
      if (!staff) return;

      const updatedPermissions = {
        ...staff.permissions,
        [permissionKey]: !staff.permissions[permissionKey]
      };

      await adminPermissionsAPI.updatePermissions(staffId, updatedPermissions);
      
      // Update local state
      setPermissions(prev => prev.map(p => 
        p._id === staffId 
          ? { ...p, permissions: updatedPermissions }
          : p
      ));
      
      show("Permission updated successfully!");
    } catch (err) {
      show(`Error: ${err.response?.data?.message || "Failed to update permission"}`);
    }
  }, [permissions, show]);

  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head"><h2>🔐 Permissions</h2></div>
      
      {loading && <div style={{ textAlign: "center", padding: "40px" }}><FaSpinner style={{ animation: "spin 1s linear infinite", fontSize: "2rem" }} /></div>}
      {error && <div style={{ color: "#ef4444", padding: "20px", textAlign: "center" }}>{error} <button onClick={fetchPermissions} className="ad-link-btn">Retry</button></div>}
      
      {!loading && permissions.length === 0 && <EmptyState title="No staff members found" desc="Add trainers first to manage permissions." />}
      
      {!loading && permissions.length > 0 && (
        <div className="ad-card">
          <div className="ad-card-head"><h3>Role-Based Access Control</h3></div>
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Staff Member</th>
                  <th>Role</th>
                  <th>Members Access</th>
                  <th>Billing Access</th>
                  <th>Reports Access</th>
                  <th>Settings Access</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map(staff => (
                  <tr key={staff._id}>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <strong>{staff.fullName}</strong>
                      </div>
                    </td>
                    <td><ABadge s={staff.role} /></td>
                    {["canManageMembers", "canManageBilling", "canViewReports", "canManageSettings"].map(key => (
                      <td key={key}>
                        <div 
                          className={`ad-toggle ${staff.permissions && staff.permissions[key] ? "ad-toggle-on" : ""}`} 
                          onClick={() => handleTogglePermission(staff._id, key)} 
                          style={{ cursor:"pointer" }} 
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="ad-card">
        <div className="ad-card-head"><h3>Permission Legend</h3></div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {[
            ["Members Access","View and manage member profiles, attendance, and check-ins"],
            ["Billing Access","View payment history, process renewals, send payment reminders"],
            ["Reports Access","View revenue reports, analytics, and performance metrics"],
            ["Settings Access","Manage system settings, configurations, and integrations"],
          ].map(([title, desc]) => (
            <div key={title} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
              <span style={{ fontSize:"1rem" }}>🔑</span>
              <div><strong style={{ fontSize:".88rem" }}>{title}</strong><p style={{ margin:0, fontSize:".78rem", color:"var(--text-secondary)" }}>{desc}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CLASSES: SCHEDULE ────────────────────────────────────────────────────────
function AdminSchedule({ openForm }) {
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  return (
    <div className="ad-section">
      <div className="ad-section-head">
        <h2>🗓️ Weekly Schedule</h2>
        <button className="btn btn-primary ad-btn-sm" onClick={() => openForm("addClass")}>+ Add Class Slot</button>
      </div>
      {days.map(day => {
        const slots = weeklySchedule[day] || [];
        return (
          <div className="ad-card" key={day}>
            <div className="ad-card-head">
              <h3>{day}</h3>
              <span className="ad-badge ad-blue">{slots.length} classes</span>
            </div>
            {slots.length === 0 ? <EmptyState icon="📅" title="No classes scheduled" desc={`Add classes for ${day}`} /> : (
              <div className="ad-schedule-grid">
                {slots.map((s, i) => (
                  <div key={i} className="ad-schedule-slot">
                    <div className="ad-schedule-time">{s.time}</div>
                    <div className="ad-schedule-class"><strong>{s.class}</strong></div>
                    <div className="ad-schedule-trainer">🏋️ {s.trainer}</div>
                    <div className="ad-schedule-fill">
                      <span style={{ fontSize:".75rem", color:"var(--text-secondary)" }}>{s.enrolled}/{s.capacity}</span>
                      <ProgressBar value={s.enrolled} max={s.capacity} color={s.enrolled/s.capacity > 0.8 ? "#ef4444" : "var(--accent)"} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── CLASSES: BOOKINGS ────────────────────────────────────────────────────────
function AdminBookings() {
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");
  const [page, setPage] = useState(1);
  const PER = 6;
  const filtered = classBookings.filter(b =>
    (statusF === "all" || b.status === statusF) &&
    b.member.toLowerCase().includes(search.toLowerCase())
  );
  const paged = filtered.slice((page-1)*PER, page*PER);
  return (
    <div className="ad-section">
      <div className="ad-section-head"><h2>📋 Class Bookings</h2></div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <KpiCard icon="✅" label="Confirmed" value={classBookings.filter(b=>b.status==="confirmed").length} color="#22c55e" />
        <KpiCard icon="⏳" label="Waitlisted" value={classBookings.filter(b=>b.status==="waitlisted").length} color="#f59e0b" />
        <KpiCard icon="❌" label="Cancelled" value={classBookings.filter(b=>b.status==="cancelled").length} color="#ef4444" />
      </div>
      <div className="ad-card">
        <div className="ad-filters" style={{ marginBottom:12 }}>
          <input className="ad-input" placeholder="🔍 Search member…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ maxWidth:220 }} />
          {["all","confirmed","waitlisted","cancelled"].map(f => (
            <button key={f} className={`ad-filter-btn ${statusF===f?"ad-filter-active":""}`} onClick={() => { setStatusF(f); setPage(1); }}>{f}</button>
          ))}
        </div>
        {paged.length === 0 ? <EmptyState title="No bookings found" /> : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead><tr><th>Member</th><th>Class</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {paged.map(b => (
                  <tr key={b.id}>
                    <td><strong>{b.member}</strong></td>
                    <td>{b.class}</td>
                    <td style={{ fontSize:".8rem" }}>{b.date}</td>
                    <td><ABadge s={b.status} /></td>
                    <td>
                      <div style={{ display:"flex", gap:6 }}>
                        {b.status === "waitlisted" && <button className="ad-link-btn" style={{ color:"#22c55e" }}>Confirm</button>}
                        {b.status === "confirmed" && <button className="ad-link-btn" style={{ color:"#ef4444" }}>Cancel</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination total={filtered.length} page={page} perPage={PER} onChange={setPage} />
      </div>
    </div>
  );
}

// ─── CLASSES: CATEGORIES ──────────────────────────────────────────────────────
function AdminCategories({ openForm }) {
  const [classList, setClassList] = useState(classes);
  const [catFilter, setCatFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [newClass, setNewClass] = useState({ name:"", category:"Cardio", trainer:"", time:"", days:"", capacity:15 });
  const { toast, show } = useToast();
  const categories = ["all", ...new Set(classes.map(c => c.category))];
  const filtered = classList.filter(c => catFilter === "all" || c.category === catFilter);
  const toggleClass = (id) => {
    setClassList(prev => prev.map(c => c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c));
    show("Class status updated!");
  };
  const addClass = () => {
    if (!newClass.name) return;
    setClassList(prev => [...prev, { ...newClass, id:Date.now(), enrolled:0, status:"active" }]);
    setNewClass({ name:"", category:"Cardio", trainer:"", time:"", days:"", capacity:15 });
    setShowAdd(false);
    show("Class added successfully!");
  };
  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head">
        <h2>🏷️ Class Categories</h2>
        <button className="btn btn-primary ad-btn-sm" onClick={() => openForm("addClass")}>+ Add Class</button>
      </div>
      <div className="ad-filters">
        {categories.map(c => (
          <button key={c} className={`ad-filter-btn ${catFilter===c?"ad-filter-active":""}`} onClick={() => setCatFilter(c)}>{c}</button>
        ))}
      </div>
      <div className="ad-class-grid">
        {filtered.map(c => (
          <div className="ad-card ad-class-card" key={c.id} style={{ opacity: c.status === "inactive" ? 0.6 : 1 }}>
            <div className="ad-class-header">
              <div><strong>{c.name}</strong><span className="ad-class-cat">{c.category}</span></div>
              <ABadge s={c.status} />
            </div>
            <div className="ad-class-meta">
              <span>🏋️ {c.trainer}</span>
              <span>🕐 {c.time}</span>
              <span>📆 {c.days}</span>
            </div>
            <div className="ad-class-fill">
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:".75rem", marginBottom:4 }}>
                <span>Enrollment</span>
                <span>{c.enrolled}/{c.capacity}</span>
              </div>
              <ProgressBar value={c.enrolled} max={c.capacity} color={c.enrolled/c.capacity > 0.8 ? "#ef4444" : "var(--accent)"} />
            </div>
            <div style={{ display:"flex", gap:8, marginTop:12 }}>
              <button className="ad-link-btn" onClick={() => show("Edit form coming soon!")}>Edit</button>
              <button className="ad-link-btn" style={{ color: c.status === "active" ? "#ef4444" : "#22c55e" }} onClick={() => toggleClass(c.id)}>
                {c.status === "active" ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <AdModal title="Add New Class" onClose={() => setShowAdd(false)}>
          {[["Class Name","name","text"],["Time","time","text"],["Days","days","text"]].map(([l,k,t]) => (
            <div className="ad-form-group" key={k}>
              <label>{l}</label>
              <input className="ad-input" type={t} placeholder={l} value={newClass[k]} onChange={e => setNewClass(p => ({ ...p, [k]:e.target.value }))} />
            </div>
          ))}
          <div className="ad-form-group">
            <label>Category</label>
            <select className="ad-input" value={newClass.category} onChange={e => setNewClass(p => ({ ...p, category:e.target.value }))}>
              {["Cardio","Strength","Yoga","Dance","CrossFit","Flexibility"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="ad-form-group">
            <label>Trainer</label>
            <select className="ad-input" value={newClass.trainer} onChange={e => setNewClass(p => ({ ...p, trainer:e.target.value }))}>
              <option value="">— Select trainer —</option>
              {trainers.filter(t => t.role !== "Reception").map(t => <option key={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="ad-form-group">
            <label>Capacity</label>
            <input className="ad-input" type="number" value={newClass.capacity} onChange={e => setNewClass(p => ({ ...p, capacity:+e.target.value }))} />
          </div>
          <button className="btn btn-primary" style={{ width:"100%", marginTop:8 }} onClick={addClass}>Add Class</button>
        </AdModal>
      )}
    </div>
  );
}

// ─── ENQUIRIES: LEADS ─────────────────────────────────────────────────────────
function AdminLeads() {
  const [enqs, setEnqs]     = useState(enquiries.filter(e => e.status === "new"));
  const [search, setSearch] = useState("");
  const { toast, show } = useToast();
  const filtered = enqs.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head">
        <h2>📥 Leads</h2>
        <span className="ad-badge ad-blue">{enqs.length} new leads</span>
      </div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <KpiCard icon="📥" label="New Leads" value={enquiries.filter(e=>e.status==="new").length} color="#3b82f6" />
        <KpiCard icon="📞" label="Contacted" value={enquiries.filter(e=>e.status==="contacted").length} color="#f59e0b" />
        <KpiCard icon="🎯" label="Converted" value={enquiries.filter(e=>e.status==="converted").length} color="#22c55e" />
      </div>
      <div className="ad-card">
        <div className="ad-filters" style={{ marginBottom:12 }}>
          <input className="ad-input" placeholder="🔍 Search leads…" value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth:220 }} />
        </div>
        {filtered.length === 0 ? <EmptyState title="No new leads" desc="All leads have been followed up." /> : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead><tr><th>Name</th><th>Contact</th><th>Interest</th><th>Source</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.id}>
                    <td><strong>{e.name}</strong></td>
                    <td>
                      <div style={{ fontSize:".8rem" }}>{e.email}</div>
                      <div style={{ fontSize:".75rem", color:"var(--text-secondary)" }}>{e.phone}</div>
                    </td>
                    <td>{e.interest}</td>
                    <td><span className="ad-badge ad-blue">{e.source}</span></td>
                    <td style={{ fontSize:".8rem" }}>{e.date}</td>
                    <td>
                      <div style={{ display:"flex", gap:6 }}>
                        <button className="ad-link-btn" onClick={() => { setEnqs(p => p.map(x => x.id===e.id ? {...x, status:"contacted"} : x)); show("Marked as contacted!"); }}>Follow Up</button>
                        <button className="ad-link-btn" style={{ color:"#22c55e" }} onClick={() => { setEnqs(p => p.filter(x => x.id!==e.id)); show("Lead converted to member!"); }}>Convert →</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ENQUIRIES: FOLLOW-UPS ────────────────────────────────────────────────────
function AdminFollowups() {
  const [enqs, setEnqs] = useState(enquiries.filter(e => e.status === "contacted"));
  const { toast, show } = useToast();
  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head">
        <h2>📞 Follow-ups</h2>
        <span className="ad-badge ad-yellow">{enqs.length} pending</span>
      </div>
      <div className="ad-card">
        {enqs.length === 0 ? <EmptyState title="No follow-ups pending" /> : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead><tr><th>Name</th><th>Contact</th><th>Interest</th><th>Follow-up Note</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {enqs.map(e => (
                  <tr key={e.id}>
                    <td><strong>{e.name}</strong></td>
                    <td style={{ fontSize:".8rem" }}>{e.phone}</td>
                    <td>{e.interest}</td>
                    <td style={{ fontSize:".78rem", color:"var(--text-secondary)" }}>{e.followUp || "—"}</td>
                    <td style={{ fontSize:".8rem" }}>{e.date}</td>
                    <td><ABadge s={e.status} /></td>
                    <td>
                      <div style={{ display:"flex", gap:6 }}>
                        <button className="ad-link-btn" style={{ color:"#22c55e" }} onClick={() => { setEnqs(p => p.filter(x => x.id!==e.id)); show("Lead converted!"); }}>Convert →</button>
                        <button className="ad-link-btn" style={{ color:"#ef4444" }} onClick={() => { setEnqs(p => p.filter(x => x.id!==e.id)); show("Marked not interested"); }}>Not Interested</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ENQUIRIES: CONVERSIONS ───────────────────────────────────────────────────
function AdminConversions() {
  const converted = enquiries.filter(e => e.status === "converted");
  const total = enquiries.length;
  const rate = ((converted.length / total) * 100).toFixed(0);
  return (
    <div className="ad-section">
      <div className="ad-section-head"><h2>🎯 Conversions</h2></div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(4,1fr)" }}>
        <KpiCard icon="📋" label="Total Leads" value={total} color="#3b82f6" />
        <KpiCard icon="🎯" label="Converted" value={converted.length} color="#22c55e" />
        <KpiCard icon="📊" label="Conversion Rate" value={`${rate}%`} color="var(--accent)" change="This month" />
        <KpiCard icon="❌" label="Not Interested" value={enquiries.filter(e=>e.status==="not_interested").length} color="#ef4444" />
      </div>
      <div className="ad-card">
        <div className="ad-card-head"><h3>Conversion Funnel</h3></div>
        {[
          { label:"Total Enquiries", count:total, color:"#3b82f6" },
          { label:"Contacted",       count:enquiries.filter(e=>e.status==="contacted").length, color:"#f59e0b" },
          { label:"Converted",       count:converted.length, color:"#22c55e" },
        ].map((f, i) => (
          <div key={i} style={{ marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:".85rem", marginBottom:5 }}>
              <span><strong>{f.label}</strong></span>
              <span style={{ color:"var(--text-secondary)" }}>{f.count} ({((f.count/total)*100).toFixed(0)}%)</span>
            </div>
            <ProgressBar value={f.count} max={total} color={f.color} />
          </div>
        ))}
      </div>
      <div className="ad-card">
        <div className="ad-card-head"><h3>Converted Leads</h3></div>
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead><tr><th>Name</th><th>Interest</th><th>Source</th><th>Date</th><th>Note</th></tr></thead>
            <tbody>
              {converted.map(e => (
                <tr key={e.id}>
                  <td><strong>{e.name}</strong></td>
                  <td>{e.interest}</td>
                  <td><span className="ad-badge ad-blue">{e.source}</span></td>
                  <td style={{ fontSize:".8rem" }}>{e.date}</td>
                  <td style={{ fontSize:".78rem", color:"#22c55e" }}>{e.followUp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── ENGAGEMENT: NOTIFICATIONS ────────────────────────────────────────────────
function AdminNotifications() {
  const [notifs, setNotifs] = useState(notificationsData);
  const { toast, show } = useToast();
  const markRead = (id) => { setNotifs(prev => prev.map(n => n.id===id ? {...n, read:true} : n)); };
  const markAll  = () => { setNotifs(prev => prev.map(n => ({...n, read:true}))); show("All marked as read"); };
  const typeIcon = { expiry:"⏰", payment:"💳", class:"📅", checkin:"✅" };
  const typeColor = { expiry:"#f59e0b", payment:"#ef4444", class:"#3b82f6", checkin:"#22c55e" };
  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head">
        <h2>🔔 Notifications</h2>
        <button className="btn btn-outline ad-btn-sm" onClick={markAll}>Mark All Read</button>
      </div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <KpiCard icon="🔔" label="Total Alerts" value={notifs.length} color="#3b82f6" />
        <KpiCard icon="🔴" label="Unread" value={notifs.filter(n=>!n.read).length} color="#ef4444" />
        <KpiCard icon="✅" label="Read" value={notifs.filter(n=>n.read).length} color="#22c55e" />
      </div>
      <div className="ad-card">
        {notifs.map(n => (
          <div key={n.id} className={`ad-notif-row ${!n.read ? "ad-notif-unread" : ""}`}>
            <div className="ad-notif-icon" style={{ background:(typeColor[n.type]||"#6b7280")+"22", color:typeColor[n.type]||"#6b7280" }}>
              {typeIcon[n.type] || "🔔"}
            </div>
            <div style={{ flex:1 }}>
              <strong style={{ fontSize:".88rem" }}>{n.title}</strong>
              <div style={{ fontSize:".78rem", color:"var(--text-secondary)" }}>{n.message}</div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <div style={{ fontSize:".72rem", color:"var(--text-secondary)" }}>{n.time}</div>
              {!n.read && <button className="ad-link-btn" style={{ fontSize:".7rem" }} onClick={() => markRead(n.id)}>Mark read</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ENGAGEMENT: ANNOUNCEMENTS ────────────────────────────────────────────────
function AdminAnnouncements() {
  const [title, setTitle] = useState("");
  const [msg, setMsg]     = useState("");
  const [target, setTarget] = useState("All Members");
  const { toast, show } = useToast();
  const announcements = [
    { id:1, title:"Gym Closed on May 10", message:"The gym will be closed for maintenance on May 10, 2026.", target:"All Members", date:"May 5, 2026", sent:1089 },
    { id:2, title:"New CrossFit Batch Starting", message:"A new CrossFit Pro batch starts May 15. Limited seats!", target:"Active Members", date:"May 4, 2026", sent:1089 },
    { id:3, title:"Summer Offer – 20% Off", message:"Get 20% off on all plans this June. Use code SUMMER20.", target:"All Members", date:"May 3, 2026", sent:1247 },
  ];
  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head"><h2>📢 Announcements</h2></div>
      <div className="ad-card">
        <div className="ad-card-head"><h3>Broadcast Message</h3></div>
        <div className="ad-form-group"><label>Title</label><input className="ad-input" placeholder="Announcement title" value={title} onChange={e => setTitle(e.target.value)} /></div>
        <div className="ad-form-group"><label>Message</label><textarea className="ad-textarea" rows={3} placeholder="Write your message…" value={msg} onChange={e => setMsg(e.target.value)} /></div>
        <div className="ad-form-group">
          <label>Target Audience</label>
          <select className="ad-input" value={target} onChange={e => setTarget(e.target.value)}>
            <option>All Members</option><option>Active Members Only</option><option>Trainers Only</option><option>Expired Members</option>
          </select>
        </div>
        <div style={{ display:"flex", gap:10, marginTop:10 }}>
          <button className="btn btn-primary ad-btn-sm" onClick={() => { if(title && msg) { setTitle(""); setMsg(""); show("Push notification sent!"); } }}>📲 Push Notification</button>
          <button className="btn btn-outline ad-btn-sm" onClick={() => show("Email sent to all!")}>📧 Email All</button>
          <button className="btn btn-outline ad-btn-sm" onClick={() => show("SMS blast sent!")}>💬 SMS Blast</button>
        </div>
      </div>
      <div className="ad-card">
        <div className="ad-card-head"><h3>Recent Announcements</h3></div>
        {announcements.map(a => (
          <div key={a.id} className="ad-announcement-row">
            <div style={{ flex:1 }}>
              <strong style={{ fontSize:".9rem" }}>{a.title}</strong>
              <p style={{ margin:"4px 0", fontSize:".8rem", color:"var(--text-secondary)" }}>{a.message}</p>
              <div style={{ display:"flex", gap:10, fontSize:".72rem", color:"var(--text-secondary)" }}>
                <span>🎯 {a.target}</span>
                <span>📅 {a.date}</span>
                <span>📨 {a.sent} recipients</span>
              </div>
            </div>
            <button className="ad-link-btn" style={{ color:"#ef4444" }} onClick={() => show("Announcement deleted")}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ENGAGEMENT: COMMUNICATION ────────────────────────────────────────────────
function AdminCommunication() {
  const [tab, setTab] = useState("email");
  const { toast, show } = useToast();
  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head"><h2>💬 Communication</h2></div>
      <div className="ad-tabs">
        {[["email","📧","Email"],["sms","💬","SMS"],["individual","👤","Individual"]].map(([id,icon,label]) => (
          <button key={id} className={`ad-tab-btn ${tab===id?"ad-tab-active":""}`} onClick={() => setTab(id)}>{icon} {label}</button>
        ))}
      </div>
      <div className="ad-card">
        {tab === "individual" && (
          <div className="ad-form-group">
            <label>Select Member</label>
            <select className="ad-input">
              <option value="">— Choose member —</option>
              {members.map(m => <option key={m.id}>{m.name} ({m.email})</option>)}
            </select>
          </div>
        )}
        {tab !== "individual" && (
          <div className="ad-form-group">
            <label>To</label>
            <select className="ad-input"><option>All Members</option><option>Active Members</option><option>Expiring Soon</option><option>Inactive Members</option></select>
          </div>
        )}
        {tab !== "sms" && <div className="ad-form-group"><label>Subject</label><input className="ad-input" placeholder={`Enter ${tab} subject…`} /></div>}
        <div className="ad-form-group"><label>Message</label><textarea className="ad-textarea" rows={5} placeholder={`Compose your ${tab} message here…`} /></div>
        {tab === "email" && (
          <div className="ad-form-group">
            <label>Template</label>
            <select className="ad-input"><option>None</option><option>Renewal Reminder</option><option>Welcome Email</option><option>Offer Announcement</option></select>
          </div>
        )}
        <div style={{ display:"flex", gap:8, marginTop:8 }}>
          <button className="btn btn-primary ad-btn-sm" onClick={() => show(`${tab.charAt(0).toUpperCase()+tab.slice(1)} sent!`)}>Send {tab.charAt(0).toUpperCase()+tab.slice(1)}</button>
          <button className="btn btn-outline ad-btn-sm" onClick={() => show("Saved as draft")}>Save Draft</button>
        </div>
      </div>
    </div>
  );
}

// ─── REPORTS ──────────────────────────────────────────────────────────────────
function AdminRevReport() {
  const [period, setPeriod] = useState("monthly");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const daily  = [1200,1450,1100,1600,1380,1720,1550,1800,1650,1900,1750,1600,1850,2000,1700,1950,1800,2100,1900,2200,2050,2300,2100,2400,2200,2500,2300,2600,2400,2700];
  const { toast, show } = useToast();
  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head">
        <h2>💰 Revenue Report</h2>
        <div className="ad-head-actions">
          <button className="btn btn-outline ad-btn-sm" onClick={() => show("Exporting PDF...")}>⬇ PDF</button>
          <button className="btn btn-outline ad-btn-sm" onClick={() => show("Exporting CSV...")}>⬇ CSV</button>
        </div>
      </div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <KpiCard icon="💰" label="Monthly Revenue" value="$48,200" change="+8.4% vs last month" color="var(--accent)" />
        <KpiCard icon="📈" label="YTD Revenue" value="$218,700" change="+22% vs last year" color="#22c55e" />
        <KpiCard icon="🎯" label="Avg Per Member" value="$44.2" change="Per active member" color="#3b82f6" />
      </div>
      <div className="ad-card">
        <div className="ad-card-head">
          <h3>Revenue Chart</h3>
          <div style={{ display:"flex", gap:6 }}>
            {["daily","monthly","yearly"].map(p => (
              <button key={p} className={`ad-filter-btn ${period===p?"ad-filter-active":""}`} onClick={() => setPeriod(p)} style={{ padding:"4px 10px", fontSize:".75rem" }}>{p}</button>
            ))}
          </div>
        </div>
        {period === "daily"   && <BarChart data={daily}       labels={Array.from({length:30},(_,i)=>`${i+1}`)} color="var(--accent)" height={120} />}
        {period === "monthly" && <BarChart data={revenueData} labels={months}                                   color="var(--accent)" height={120} />}
        {period === "yearly"  && <BarChart data={[320000,385000,428000,481000,520000]} labels={["2021","2022","2023","2024","2025"]} color="var(--accent)" height={120} />}
      </div>
      <div className="ad-card">
        <div className="ad-card-head"><h3>Revenue by Plan</h3></div>
        {[["Monthly Plans","$3,900",10],["Quarterly Plans","$8,910",9],["Half-Yearly Plans","$14,320",8],["Annual Plans","$21,070",7]].map(([label,amount,count],i) => (
          <div key={i} style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:".85rem", marginBottom:4 }}>
              <span>{label} <span style={{ color:"var(--text-secondary)", fontSize:".75rem" }}>({count} members)</span></span>
              <strong>{amount}</strong>
            </div>
            <ProgressBar value={parseInt(amount.replace(/[$,]/g,""))} max={21070} color="var(--accent)" />
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminAttReport() {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthly = [3200,3450,3100,3600,3380,3720,3550,3800,3650,3900,3750,4280];
  return (
    <div className="ad-section">
      <div className="ad-section-head">
        <h2>🏃 Attendance Report</h2>
        <button className="btn btn-outline ad-btn-sm">⬇ Export</button>
      </div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <KpiCard icon="🏃" label="Avg Daily Check-ins" value="138" change="+12 vs last month" color="#3b82f6" />
        <KpiCard icon="📅" label="Best Day" value="Saturday" change="189 avg check-ins" color="#22c55e" />
        <KpiCard icon="📊" label="Monthly Total" value="4,280" change="This month" color="var(--accent)" />
      </div>
      <div className="ad-two-col">
        <div className="ad-card">
          <div className="ad-card-head"><h3>Daily Attendance (This Week)</h3></div>
          <BarChart data={attendanceData.map(d=>d.checkins)} labels={attendanceData.map(d=>d.day)} color="#3b82f6" height={110} />
        </div>
        <div className="ad-card">
          <div className="ad-card-head"><h3>Monthly Attendance (12 months)</h3></div>
          <BarChart data={monthly} labels={months.map(m=>m[0])} color="#8b5cf6" height={110} />
        </div>
      </div>
      <div className="ad-card">
        <div className="ad-card-head"><h3>Peak Hours Analysis</h3></div>
        {[["6–8 AM","Morning Rush",85],["9–11 AM","Mid Morning",45],["12–2 PM","Lunch Break",30],["3–5 PM","Afternoon",40],["5–8 PM","Evening Peak",92],["8–10 PM","Night",55]].map(([time,label,pct]) => (
          <div key={time} style={{ marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:".85rem", marginBottom:4 }}>
              <span><strong>{time}</strong> <span style={{ color:"var(--text-secondary)", fontSize:".75rem" }}>{label}</span></span>
              <span style={{ color: pct > 80 ? "#ef4444" : "var(--text-secondary)" }}>{pct}% capacity</span>
            </div>
            <ProgressBar value={pct} color={pct > 80 ? "#ef4444" : "var(--accent)"} />
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminPerfReport() {
  return (
    <div className="ad-section">
      <div className="ad-section-head">
        <h2>🏆 Performance Report</h2>
        <button className="btn btn-outline ad-btn-sm">⬇ Export</button>
      </div>
      <div className="ad-card">
        <div className="ad-card-head"><h3>Trainer Performance</h3></div>
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead><tr><th>Trainer</th><th>Clients</th><th>Sessions</th><th>Rating</th><th>Revenue</th><th>Retention</th></tr></thead>
            <tbody>
              {trainers.filter(t=>t.role!=="Reception").map(t => (
                <tr key={t.id}>
                  <td><strong>{t.name}</strong><div style={{ fontSize:".72rem", color:"var(--text-secondary)" }}>{t.specialization}</div></td>
                  <td>{t.clients}</td>
                  <td>{t.sessions}</td>
                  <td>{"⭐".repeat(Math.round(t.rating))} {t.rating}</td>
                  <td>${(t.sessions * 9.5).toFixed(0)}</td>
                  <td>
                    <ProgressBar value={t.rating * 20} color="#22c55e" />
                    <span style={{ fontSize:".72rem", color:"var(--text-secondary)" }}>{(t.rating * 20).toFixed(0)}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="ad-card">
        <div className="ad-card-head"><h3>Class Performance</h3></div>
        {popularClasses.map((c, i) => (
          <div key={i} style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:".85rem", marginBottom:5 }}>
              <span><strong>{i+1}. {c.name}</strong></span>
              <span style={{ color:"var(--text-secondary)" }}>{c.bookings} bookings · {c.fill}% fill</span>
            </div>
            <ProgressBar value={c.fill} color={i === 0 ? "var(--accent)" : "#3b82f6"} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
function AdminAnalyticsMembers() {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const active   = [820,840,860,870,890,910,930,950,970,1000,1040,1089];
  const inactive = [180,170,165,160,155,150,145,140,135,130,125,120];
  const maxVal = Math.max(...active);
  return (
    <div className="ad-section">
      <div className="ad-section-head"><h2>📈 Member Analytics</h2></div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(4,1fr)" }}>
        <KpiCard icon="👥" label="Total Members" value="1,247" change="+23 this month" color="var(--accent)" />
        <KpiCard icon="✅" label="Active" value="1,089" change="87.3% rate" color="#22c55e" />
        <KpiCard icon="❌" label="Inactive" value="158" change="12.7% rate" color="#ef4444" />
        <KpiCard icon="🔄" label="Retention" value="89%" change="+1.2% vs last month" color="#3b82f6" />
      </div>
      <div className="ad-two-col">
        <div className="ad-card">
          <div className="ad-card-head"><h3>Active vs Inactive (12 months)</h3></div>
          <div className="ad-bar-chart" style={{ height:140 }}>
            {months.map((m, i) => (
              <div className="ad-bar-col" key={i}>
                <div style={{ display:"flex", gap:1, alignItems:"flex-end", height:"100%" }}>
                  <div className="ad-bar" style={{ height:`${(active[i]/maxVal)*100}%`, background:"#22c55e", flex:2 }} />
                  <div className="ad-bar" style={{ height:`${(inactive[i]/maxVal)*100}%`, background:"#ef4444", flex:1 }} />
                </div>
                <span className="ad-bar-label">{m[0]}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:16, marginTop:8, fontSize:".75rem" }}>
            <span><span style={{ display:"inline-block", width:10, height:10, background:"#22c55e", borderRadius:2, marginRight:4 }} />Active</span>
            <span><span style={{ display:"inline-block", width:10, height:10, background:"#ef4444", borderRadius:2, marginRight:4 }} />Inactive</span>
          </div>
        </div>
        <div className="ad-card">
          <div className="ad-card-head"><h3>New Member Growth</h3></div>
          <BarChart data={memberGrowthData} labels={months.map(m=>m[0])} color="#8b5cf6" height={140} />
        </div>
      </div>
      <div className="ad-card">
        <div className="ad-card-head"><h3>Retention Rate Trend</h3></div>
        {[["Jun","87%",87],["Aug","88%",88],["Oct","88.5%",88.5],["Dec","89%",89],["Feb","89.2%",89.2],["May","89%",89]].map(([m,v,pct]) => (
          <div key={m} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
            <span style={{ width:32, fontSize:".78rem", color:"var(--text-secondary)" }}>{m}</span>
            <div style={{ flex:1 }}><ProgressBar value={pct} max={100} color="#22c55e" /></div>
            <strong style={{ width:48, fontSize:".82rem", color:"#22c55e" }}>{v}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminAnalyticsRevenue() {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return (
    <div className="ad-section">
      <div className="ad-section-head"><h2>💹 Revenue Trends</h2></div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <KpiCard icon="💰" label="Monthly Revenue" value="$48,200" change="+8.4% MoM" color="var(--accent)" />
        <KpiCard icon="📈" label="YTD Revenue" value="$218,700" change="+22% YoY" color="#22c55e" />
        <KpiCard icon="🎯" label="Projected Annual" value="$580k" change="Based on trend" color="#3b82f6" />
      </div>
      <div className="ad-card">
        <div className="ad-card-head"><h3>Monthly Income Chart</h3></div>
        <BarChart data={revenueData} labels={months} color="var(--accent)" height={130} />
      </div>
      <div className="ad-two-col">
        <div className="ad-card">
          <div className="ad-card-head"><h3>Revenue by Plan Type</h3></div>
          {[["Annual","#22c55e",43],["Half-Yearly","var(--accent)",30],["Quarterly","#3b82f6",18],["Monthly","#8b5cf6",9]].map(([plan,color,pct]) => (
            <div key={plan} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:".82rem", marginBottom:4 }}>
                <span>{plan}</span><strong>{pct}%</strong>
              </div>
              <ProgressBar value={pct} color={color} />
            </div>
          ))}
        </div>
        <div className="ad-card">
          <div className="ad-card-head"><h3>MoM Growth Rate</h3></div>
          <BarChart data={[3.2,4.1,-1.8,5.2,3.8,6.1,4.2,7.1,5.8,8.2,6.4,8.4]} labels={months.map(m=>m[0])} color="#22c55e" height={130} />
        </div>
      </div>
    </div>
  );
}

function AdminAnalyticsClasses() {
  return (
    <div className="ad-section">
      <div className="ad-section-head"><h2>🎽 Popular Classes</h2></div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <KpiCard icon="🏆" label="Most Booked" value="HIIT Blast" change="312 bookings" color="var(--accent)" />
        <KpiCard icon="📊" label="Avg Fill Rate" value="72%" change="Across all classes" color="#22c55e" />
        <KpiCard icon="📉" label="Lowest Fill" value="Morning Stretch" change="40% fill rate" color="#ef4444" />
      </div>
      <div className="ad-card">
        <div className="ad-card-head"><h3>Class Popularity Ranking</h3></div>
        {popularClasses.map((c, i) => (
          <div key={i} style={{ marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:".85rem", marginBottom:5 }}>
              <span><strong>#{i+1} {c.name}</strong></span>
              <span style={{ color:"var(--text-secondary)" }}>{c.bookings} bookings · {c.fill}% fill</span>
            </div>
            <ProgressBar value={c.fill} color={i === 0 ? "var(--accent)" : i < 3 ? "#22c55e" : "#3b82f6"} />
          </div>
        ))}
      </div>
      <div className="ad-card">
        <div className="ad-card-head"><h3>Low-Performing Classes</h3></div>
        {classes.filter(c => c.enrolled / c.capacity < 0.5).map(c => (
          <div key={c.id} className="ad-announcement-row">
            <div style={{ flex:1 }}>
              <strong>{c.name}</strong>
              <div style={{ fontSize:".78rem", color:"var(--text-secondary)" }}>{c.trainer} · {c.time} · {c.days}</div>
              <div style={{ marginTop:6 }}>
                <ProgressBar value={c.enrolled} max={c.capacity} color="#ef4444" />
                <span style={{ fontSize:".72rem", color:"#ef4444" }}>{c.enrolled}/{c.capacity} enrolled ({((c.enrolled/c.capacity)*100).toFixed(0)}%)</span>
              </div>
            </div>
            <button className="btn btn-outline ad-btn-sm" style={{ marginLeft:12 }}>Promote</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── OPERATIONS: EQUIPMENT ────────────────────────────────────────────────────
function AdminEquipment({ openForm }) {
  const [equip, setEquip]   = useState(equipmentLog);
  const [filter, setFilter] = useState("all");
  const [showLog, setShowLog] = useState(false);
  const [logItem, setLogItem] = useState(null);
  const { toast, show } = useToast();
  const filtered = equip.filter(e => filter === "all" || e.status === filter);
  const updateStatus = (id, status) => { setEquip(prev => prev.map(e => e.id===id ? {...e, status} : e)); setShowLog(false); show("Status updated!"); };
  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head">
        <h2>🔧 Equipment</h2>
        <button className="btn btn-primary ad-btn-sm" onClick={() => openForm("addEquipment")}>+ Add Equipment</button>
      </div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <KpiCard icon="✅" label="Operational" value={equip.filter(e=>e.status==="operational").length} color="#22c55e" />
        <KpiCard icon="🔧" label="Maintenance" value={equip.filter(e=>e.status==="maintenance").length} color="#f59e0b" />
        <KpiCard icon="❌" label="Out of Order" value={equip.filter(e=>e.status==="out_of_order").length} color="#ef4444" />
      </div>
      <div className="ad-filters">
        {["all","operational","maintenance","out_of_order"].map(f => (
          <button key={f} className={`ad-filter-btn ${filter===f?"ad-filter-active":""}`} onClick={() => setFilter(f)}>{f.replace(/_/g," ")}</button>
        ))}
      </div>
      <div className="ad-card">
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead><tr><th>Equipment</th><th>Category</th><th>Status</th><th>Last Service</th><th>Next Service</th><th>Issue</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id}>
                  <td><strong>{e.name}</strong></td>
                  <td>{e.category}</td>
                  <td><ABadge s={e.status} /></td>
                  <td style={{ fontSize:".8rem" }}>{e.lastService}</td>
                  <td style={{ fontSize:".8rem", color: e.nextService==="ASAP"?"#ef4444":"inherit", fontWeight: e.nextService==="ASAP"?700:400 }}>{e.nextService}</td>
                  <td style={{ fontSize:".78rem", color:"#ef4444" }}>{e.issue || "—"}</td>
                  <td>
                    <div style={{ display:"flex", gap:6 }}>
                      <button className="ad-link-btn" onClick={() => { setLogItem(e); setShowLog(true); }}>Update</button>
                      {e.status !== "operational" && <button className="ad-link-btn" style={{ color:"#22c55e" }} onClick={() => updateStatus(e.id,"operational")}>Mark Fixed</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showLog && (
        <AdModal title={logItem ? `Update: ${logItem.name}` : "Log New Issue"} onClose={() => setShowLog(false)}>
          {!logItem && <div className="ad-form-group"><label>Equipment Name</label><input className="ad-input" placeholder="e.g. Treadmill #4" /></div>}
          <div className="ad-form-group">
            <label>Status</label>
            <select className="ad-input" defaultValue={logItem?.status || "maintenance"}>
              <option value="operational">Operational</option>
              <option value="maintenance">Under Maintenance</option>
              <option value="out_of_order">Out of Order</option>
            </select>
          </div>
          <div className="ad-form-group"><label>Issue Description</label><textarea className="ad-textarea" rows={3} defaultValue={logItem?.issue || ""} placeholder="Describe the issue…" /></div>
          <div className="ad-form-group"><label>Next Service Date</label><input className="ad-input" type="date" /></div>
          <button className="btn btn-primary" style={{ width:"100%", marginTop:8 }} onClick={() => { setShowLog(false); show("Issue logged!"); }}>Save</button>
        </AdModal>
      )}
    </div>
  );
}

// ─── OPERATIONS: MAINTENANCE ──────────────────────────────────────────────────
function AdminMaintenance({ openForm }) {
  const { toast, show } = useToast();
  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head">
        <h2>🛠️ Maintenance</h2>
        <button className="btn btn-primary ad-btn-sm" onClick={() => openForm("scheduleMaintenance")}>+ Schedule Repair</button>
      </div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <KpiCard icon="✅" label="Completed" value={maintenanceLogs.filter(m=>m.status==="completed").length} color="#22c55e" />
        <KpiCard icon="🔄" label="In Progress" value={maintenanceLogs.filter(m=>m.status==="in-progress").length} color="#f59e0b" />
        <KpiCard icon="⏳" label="Pending" value={maintenanceLogs.filter(m=>m.status==="pending").length} color="#ef4444" />
      </div>
      <div className="ad-card">
        <div className="ad-card-head"><h3>Maintenance Log</h3></div>
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead><tr><th>Equipment</th><th>Type</th><th>Technician</th><th>Date</th><th>Cost</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {maintenanceLogs.map(m => (
                <tr key={m.id}>
                  <td><strong>{m.equipment}</strong></td>
                  <td><span className="ad-badge ad-blue">{m.type}</span></td>
                  <td>{m.tech}</td>
                  <td style={{ fontSize:".8rem" }}>{m.date}</td>
                  <td style={{ fontWeight:700 }}>{m.cost}</td>
                  <td><ABadge s={m.status} /></td>
                  <td><button className="ad-link-btn" onClick={() => show("Updating status...")}>Update</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── BILLING: PAYMENTS ────────────────────────────────────────────────────────
function AdminPayments() {
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);
  const PER = 5;
  const { toast, show } = useToast();
  const filtered = completedPayments.filter(p => p.member.toLowerCase().includes(search.toLowerCase()));
  const paged = filtered.slice((page-1)*PER, page*PER);
  const total = completedPayments.reduce((s, p) => s + parseInt(p.amount.replace("$","")), 0);
  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head">
        <h2>💳 Payments</h2>
        <button className="btn btn-outline ad-btn-sm" onClick={() => show("Exporting...")}>⬇ Export</button>
      </div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <KpiCard icon="✅" label="Completed Payments" value={completedPayments.length} color="#22c55e" />
        <KpiCard icon="💰" label="Total Collected" value={`$${total.toLocaleString()}`} color="var(--accent)" />
        <KpiCard icon="📊" label="Avg Payment" value={`$${(total/completedPayments.length).toFixed(0)}`} color="#3b82f6" />
      </div>
      <div className="ad-card">
        <div className="ad-filters" style={{ marginBottom:12 }}>
          <input className="ad-input" placeholder="🔍 Search member…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ maxWidth:220 }} />
        </div>
        {paged.length === 0 ? <EmptyState title="No payments found" /> : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead><tr><th>ID</th><th>Member</th><th>Plan</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {paged.map(p => (
                  <tr key={p.id}>
                    <td><code style={{ fontSize:".72rem", color:"var(--accent)" }}>{p.id}</code></td>
                    <td><strong>{p.member}</strong></td>
                    <td>{p.plan}</td>
                    <td><strong style={{ color:"#22c55e" }}>{p.amount}</strong></td>
                    <td style={{ fontSize:".8rem" }}>{p.method}</td>
                    <td style={{ fontSize:".78rem", color:"var(--text-secondary)" }}>{p.date}</td>
                    <td><ABadge s={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination total={filtered.length} page={page} perPage={PER} onChange={setPage} />
      </div>
    </div>
  );
}

// ─── BILLING: RENEWALS ────────────────────────────────────────────────────────
function AdminRenewals() {
  const { toast, show } = useToast();
  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head"><h2>🔄 Renewals</h2></div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <KpiCard icon="⚠️" label="Expiring in 7 days" value={dueRenewals.filter(r=>r.daysLeft<=7&&r.daysLeft>0).length} color="#ef4444" />
        <KpiCard icon="📅" label="Expiring in 30 days" value={dueRenewals.filter(r=>r.daysLeft<=30&&r.daysLeft>0).length} color="#f59e0b" />
        <KpiCard icon="❌" label="Already Expired" value={dueRenewals.filter(r=>r.daysLeft===0).length} color="#ef4444" />
      </div>
      <div className="ad-card">
        <div className="ad-card-head"><h3>Upcoming Renewals</h3></div>
        <table className="ad-table">
          <thead><tr><th>Member</th><th>Plan</th><th>Expiry</th><th>Days Left</th><th>Actions</th></tr></thead>
          <tbody>
            {dueRenewals.map((r, i) => (
              <tr key={i}>
                <td><strong>{r.member}</strong></td>
                <td>{r.plan}</td>
                <td>{r.expiry}</td>
                <td><span className={`ad-badge ${r.daysLeft===0?"ad-red":r.daysLeft<=10?"ad-yellow":"ad-blue"}`}>{r.daysLeft===0?"Expired":`${r.daysLeft} days`}</span></td>
                <td>
                  <div style={{ display:"flex", gap:6 }}>
                    <button className="ad-link-btn" onClick={() => show("Reminder sent!")}>📧 Remind</button>
                    <button className="ad-link-btn" style={{ color:"#22c55e" }} onClick={() => show("Renewal processed!")}>Renew</button>
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

// ─── BILLING: PENDING DUES ────────────────────────────────────────────────────
function AdminPendingDues() {
  const { toast, show } = useToast();
  const totalOverdue = pendingPayments.reduce((s, p) => s + parseFloat(p.amount.replace("$","")), 0);
  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head"><h2>⚠️ Pending Dues</h2></div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <KpiCard icon="⚠️" label="Overdue Accounts" value={pendingPayments.length} color="#ef4444" />
        <KpiCard icon="💰" label="Total Overdue" value={`$${totalOverdue}`} color="#f59e0b" />
        <KpiCard icon="🚨" label="Critical (5+ days)" value={pendingPayments.filter(p=>p.days>=3).length} color="#ef4444" />
      </div>
      <div className="ad-card">
        <div className="ad-card-head">
          <h3>🚨 Overdue Payments</h3>
          <span className="ad-badge ad-red">{pendingPayments.length} urgent</span>
        </div>
        <table className="ad-table">
          <thead><tr><th>Member</th><th>Email</th><th>Plan</th><th>Amount</th><th>Due Date</th><th>Days Overdue</th><th>Actions</th></tr></thead>
          <tbody>
            {pendingPayments.map((p, i) => (
              <tr key={i} style={{ background: p.days >= 3 ? "rgba(239,68,68,0.04)" : "inherit" }}>
                <td><strong>{p.member}</strong></td>
                <td style={{ fontSize:".78rem" }}>{p.email}</td>
                <td>{p.plan}</td>
                <td><strong style={{ color:"var(--accent)" }}>{p.amount}</strong></td>
                <td>{p.due}</td>
                <td><span className={`ad-badge ${p.days>=3?"ad-red":"ad-yellow"}`}>{p.days} days</span></td>
                <td>
                  <div style={{ display:"flex", gap:6 }}>
                    <button className="ad-link-btn" onClick={() => show("Reminder sent!")}>📧 Remind</button>
                    <button className="ad-link-btn" style={{ color:"#22c55e" }} onClick={() => show("Marked as paid!")}>✅ Mark Paid</button>
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

// ─── OFFERS: COUPONS ──────────────────────────────────────────────────────────
function AdminCoupons({ openForm }) {
  const [couponList, setCouponList] = useState(coupons);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ code:"", discount:"", type:"percentage", minAmount:0, maxUses:100, expiry:"" });
  const { toast, show } = useToast();
  const save = () => {
    if (!form.code) return;
    setCouponList(prev => [...prev, { ...form, id:Date.now(), uses:0, status:"active" }]);
    setForm({ code:"", discount:"", type:"percentage", minAmount:0, maxUses:100, expiry:"" });
    setShowAdd(false);
    show("Coupon created!");
  };
  const del = (id) => { setCouponList(prev => prev.filter(c => c.id !== id)); show("Coupon deleted!"); };
  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head">
        <h2>🎟️ Coupons</h2>
        <button className="btn btn-primary ad-btn-sm" onClick={() => openForm("createCampaign")}>+ Create Coupon</button>
      </div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <KpiCard icon="🎟️" label="Active Coupons" value={couponList.filter(c=>c.status==="active").length} color="#22c55e" />
        <KpiCard icon="📊" label="Total Uses" value={couponList.reduce((s,c)=>s+c.uses,0)} color="var(--accent)" />
        <KpiCard icon="❌" label="Expired" value={couponList.filter(c=>c.status==="expired").length} color="#ef4444" />
      </div>
      <div className="ad-card">
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead><tr><th>Code</th><th>Discount</th><th>Type</th><th>Min Amount</th><th>Uses</th><th>Expiry</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {couponList.map(c => (
                <tr key={c.id}>
                  <td><code style={{ fontSize:".82rem", fontWeight:700, color:"var(--accent)" }}>{c.code}</code></td>
                  <td><strong style={{ color:"#22c55e" }}>{c.discount}</strong></td>
                  <td><span className="ad-badge ad-blue">{c.type}</span></td>
                  <td>${c.minAmount}</td>
                  <td>{c.uses}/{c.maxUses}</td>
                  <td style={{ fontSize:".78rem" }}>{c.expiry}</td>
                  <td><ABadge s={c.status} /></td>
                  <td>
                    <div style={{ display:"flex", gap:6 }}>
                      <button className="ad-link-btn" onClick={() => show(`Editing ${c.code}`)}>Edit</button>
                      <button className="ad-link-btn" style={{ color:"#ef4444" }} onClick={() => del(c.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <AdModal title="Create Coupon" onClose={() => setShowAdd(false)}>
          <div className="ad-form-group"><label>Coupon Code</label><input className="ad-input" placeholder="e.g. SUMMER20" value={form.code} onChange={e => setForm(f=>({...f,code:e.target.value.toUpperCase()}))} /></div>
          <div className="ad-form-group"><label>Discount Value</label><input className="ad-input" placeholder="e.g. 20% or $50" value={form.discount} onChange={e => setForm(f=>({...f,discount:e.target.value}))} /></div>
          <div className="ad-form-group">
            <label>Type</label>
            <select className="ad-input" value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))}>
              <option value="percentage">Percentage</option><option value="flat">Flat Amount</option>
            </select>
          </div>
          <div className="ad-form-group"><label>Min Purchase Amount ($)</label><input className="ad-input" type="number" value={form.minAmount} onChange={e => setForm(f=>({...f,minAmount:+e.target.value}))} /></div>
          <div className="ad-form-group"><label>Max Uses</label><input className="ad-input" type="number" value={form.maxUses} onChange={e => setForm(f=>({...f,maxUses:+e.target.value}))} /></div>
          <div className="ad-form-group"><label>Expiry Date</label><input className="ad-input" type="date" value={form.expiry} onChange={e => setForm(f=>({...f,expiry:e.target.value}))} /></div>
          <button className="btn btn-primary" style={{ width:"100%", marginTop:8 }} onClick={save}>Create Coupon</button>
        </AdModal>
      )}
    </div>
  );
}

// ─── OFFERS: DISCOUNTS ────────────────────────────────────────────────────────
function AdminDiscounts({ openForm }) {
  const [discountList, setDiscountList] = useState(discounts);
  const [showAdd, setShowAdd] = useState(false);
  const { toast, show } = useToast();
  const del = (id) => { setDiscountList(prev => prev.filter(d => d.id !== id)); show("Offer deleted!"); };
  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head">
        <h2>🏷️ Discounts & Offers</h2>
        <button className="btn btn-primary ad-btn-sm" onClick={() => openForm("createCampaign")}>+ Create Offer</button>
      </div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <KpiCard icon="✅" label="Active Offers" value={discountList.filter(d=>d.status==="active").length} color="#22c55e" />
        <KpiCard icon="📅" label="Upcoming" value={discountList.filter(d=>d.status==="upcoming").length} color="#3b82f6" />
        <KpiCard icon="❌" label="Expired" value={discountList.filter(d=>d.status==="expired").length} color="#ef4444" />
      </div>
      <div className="ad-offers-grid">
        {discountList.map(d => (
          <div className="ad-card ad-offer-card" key={d.id}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
              <h4 style={{ margin:0, fontSize:".95rem", fontWeight:700 }}>{d.name}</h4>
              <ABadge s={d.status} />
            </div>
            <div style={{ fontSize:"1.4rem", fontWeight:800, color:"var(--accent)", margin:"8px 0" }}>{d.discount}</div>
            <div style={{ fontSize:".78rem", color:"var(--text-secondary)", display:"flex", flexDirection:"column", gap:4 }}>
              <span>🏷️ {d.type}</span>
              <span>🎯 {d.target}</span>
              <span>📅 {d.validity}</span>
            </div>
            <div style={{ display:"flex", gap:8, marginTop:12 }}>
              <button className="ad-link-btn" onClick={() => show(`Editing ${d.name}`)}>Edit</button>
              <button className="ad-link-btn" style={{ color:"#ef4444" }} onClick={() => del(d.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <AdModal title="Create Offer" onClose={() => setShowAdd(false)}>
          <div className="ad-form-group"><label>Offer Name</label><input className="ad-input" placeholder="e.g. Summer Fitness Drive" /></div>
          <div className="ad-form-group"><label>Discount</label><input className="ad-input" placeholder="e.g. 20% off all plans" /></div>
          <div className="ad-form-group">
            <label>Type</label>
            <select className="ad-input"><option>Seasonal</option><option>Referral</option><option>Segment</option><option>Corporate</option></select>
          </div>
          <div className="ad-form-group"><label>Target Audience</label><input className="ad-input" placeholder="e.g. All Members" /></div>
          <div className="ad-form-group"><label>Validity</label><input className="ad-input" placeholder="e.g. Jun 1 – Jun 30, 2026" /></div>
          <button className="btn btn-primary" style={{ width:"100%", marginTop:8 }} onClick={() => { setShowAdd(false); show("Offer created!"); }}>Create Offer</button>
        </AdModal>
      )}
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function AdminSettings() {
  const [settings, setSettings] = useState({ emailNotif:true, smsAlerts:false, autoReminders:true, darkMode:false, twoFactor:false });
  const { toast, show } = useToast();
  const toggle = (key) => { setSettings(s => ({...s, [key]:!s[key]})); show("Setting updated!"); };
  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head"><h2>⚙️ Settings</h2></div>
      <div className="ad-two-col">
        <div className="ad-card">
          <div className="ad-card-head"><h3>Gym Information</h3></div>
          {[["Gym Name","FitZone - Main Branch"],["Admin Email","rajesh@fitzone.com"],["Phone","+91 98765 43210"],["Address","123 Fitness Street, Mumbai"]].map(([l,v]) => (
            <div className="ad-form-group" key={l}><label>{l}</label><input className="ad-input" defaultValue={v} /></div>
          ))}
          <button className="btn btn-primary ad-btn-sm" style={{ marginTop:8 }} onClick={() => show("Settings saved!")}>Save Changes</button>
        </div>
        <div className="ad-card">
          <div className="ad-card-head"><h3>Notification Preferences</h3></div>
          {[["emailNotif","Email Notifications","Receive alerts via email"],["smsAlerts","SMS Alerts","Receive alerts via SMS"],["autoReminders","Auto Renewal Reminders","Send reminders 7 days before expiry"],["darkMode","Dark Mode","Enable dark theme"],["twoFactor","Two-Factor Auth","Require 2FA for login"]].map(([key,label,desc]) => (
            <div key={key} className="ad-toggle-row">
              <div><strong style={{ display:"block", fontSize:".88rem" }}>{label}</strong><span style={{ fontSize:".75rem", color:"var(--text-secondary)" }}>{desc}</span></div>
              <div className={`ad-toggle ${settings[key]?"ad-toggle-on":""}`} onClick={() => toggle(key)} style={{ cursor:"pointer" }} />
            </div>
          ))}
        </div>
      </div>
      <div className="ad-card">
        <div className="ad-card-head"><h3>Membership Plan Defaults</h3></div>
        <div className="ad-two-col">
          {[["Monthly","$39"],["Quarterly","$99"],["Half-Yearly","$179"],["Annual","$299"]].map(([plan,price]) => (
            <div className="ad-form-group" key={plan}><label>{plan} Plan Price</label><input className="ad-input" defaultValue={price} /></div>
          ))}
        </div>
        <button className="btn btn-primary ad-btn-sm" style={{ marginTop:8 }} onClick={() => show("Plan prices updated!")}>Update Prices</button>
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

  const toggle = (label) => {
    if (collapsed) { setCollapsed(false); setExpanded(label); return; }
    setExpanded(prev => prev === label ? null : label);
  };

  return (
    <>
      <aside className={`ad-sidebar ${open ? "ad-sidebar-open" : ""} ${collapsed ? "ad-sidebar-collapsed" : ""}`}>
        {/* Brand */}
        <div className="ad-sidebar-brand">
          <span className="ad-brand-icon">⚡</span>
          {!collapsed && <span className="ad-brand-text">FitZone <em>Admin</em></span>}
          <button
            className="ad-sidebar-collapse-btn"
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <FaAngleDown style={{ transform: "rotate(-90deg)" }} /> : <FaAngleDown style={{ transform: "rotate(90deg)" }} />}
          </button>
        </div>

        {/* User */}
        {!collapsed && (
          <div className="ad-sidebar-user">
            <div className="ad-avatar">{adminInfo.avatar}</div>
            <div>
              <strong>{adminInfo.name}</strong>
              <span>{adminInfo.role}</span>
            </div>
          </div>
        )}

        <nav className="ad-nav">
          {/* ── Dashboard: direct link, no dropdown ── */}
          <div className="ad-nav-direct">
            <button
              className={`ad-nav-item ad-nav-direct-item ${active === DASHBOARD_ITEM.id ? "ad-nav-active" : ""}`}
              onClick={() => { onNav(DASHBOARD_ITEM.id); onClose(); }}
              title={collapsed ? DASHBOARD_ITEM.label : undefined}
            >
              <span
                className="ad-nav-icon-bubble"
                style={{ background: `${DASHBOARD_ITEM.color}22`, color: DASHBOARD_ITEM.color }}
              >
                {DASHBOARD_ITEM.icon}
              </span>
              {!collapsed && <span>{DASHBOARD_ITEM.label}</span>}
            </button>
          </div>

          {/* ── Grouped dropdown items ── */}
          {NAV_GROUPS.map(group => {
            const isOpen = !collapsed && expanded === group.label;
            const hasActive = group.items.some(i => i.id === active);
            return (
              <div key={group.label} className={`ad-nav-group ${hasActive ? "ad-nav-group-has-active" : ""}`}>
                <button
                  className={`ad-nav-group-header ${isOpen ? "ad-nav-group-header-open" : ""} ${hasActive ? "ad-nav-group-header-has-active" : ""}`}
                  onClick={() => toggle(group.label)}
                  aria-expanded={isOpen}
                  title={collapsed ? group.label : undefined}
                >
                  <span
                    className="ad-nav-icon-bubble"
                    style={{ background: `${group.color}22`, color: group.color }}
                  >
                    {group.icon}
                  </span>
                  {!collapsed && (
                    <>
                      <span className="ad-nav-group-label">{group.label}</span>
                      <span className={`ad-nav-chevron ${isOpen ? "ad-nav-chevron-open" : ""}`}>
                        <FaAngleDown />
                      </span>
                    </>
                  )}
                </button>
                {!collapsed && (
                  <div className={`ad-nav-group-items ${isOpen ? "ad-nav-group-items-open" : ""}`}>
                    {group.items.map(n => (
                      <button
                        key={n.id}
                        className={`ad-nav-item ${active === n.id ? "ad-nav-active" : ""}`}
                        onClick={() => { onNav(n.id); onClose(); }}
                      >
                        <span
                          className="ad-nav-icon-bubble ad-nav-icon-bubble-sm"
                          style={{ background: `${n.color}22`, color: n.color }}
                        >
                          {n.icon}
                        </span>
                        <span>{n.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="ad-sidebar-foot">
          <Link to="/" className="ad-nav-item" title={collapsed ? "Back to Site" : undefined}>
            <span className="ad-nav-icon-bubble" style={{ background: "rgba(100,116,139,.15)", color: "#64748b" }}><FaHome /></span>
            {!collapsed && <span>Back to Site</span>}
          </Link>
          <Link to="/dashboard/superadmin" className="ad-nav-item" title={collapsed ? "Super Admin" : undefined}>
            <span className="ad-nav-icon-bubble" style={{ background: "rgba(139,92,246,.15)", color: "#8b5cf6" }}><FaKey /></span>
            {!collapsed && <span>Super Admin</span>}
          </Link>
        </div>
      </aside>
      {open && <div className="ad-overlay" onClick={onClose} />}
    </>
  );
}

// ─── SECTION ROUTER ───────────────────────────────────────────────────────────
function renderSection(active, openForm) {
  const map = {
    overview:             <AdminOverview openForm={openForm} />,
    "all-members":        <AdminAllMembers openForm={openForm} />,
    attendance:           <AdminAttendance />,
    checkins:             <AdminCheckins />,
    trainers:             <AdminTrainers openForm={openForm} />,
    permissions:          <AdminPermissions />,
    schedule:             <AdminSchedule openForm={openForm} />,
    bookings:             <AdminBookings />,
    categories:           <AdminCategories openForm={openForm} />,
    leads:                <AdminLeads />,
    followups:            <AdminFollowups />,
    conversions:          <AdminConversions />,
    notifications:        <AdminNotifications />,
    announcements:        <AdminAnnouncements />,
    communication:        <AdminCommunication />,
    "rev-report":         <AdminRevReport />,
    "att-report":         <AdminAttReport />,
    "perf-report":        <AdminPerfReport />,
    "analytics-members":  <AdminAnalyticsMembers />,
    "analytics-revenue":  <AdminAnalyticsRevenue />,
    "analytics-classes":  <AdminAnalyticsClasses />,
    equipment:            <AdminEquipment openForm={openForm} />,
    maintenance:          <AdminMaintenance openForm={openForm} />,
    payments:             <AdminPayments />,
    renewals:             <AdminRenewals />,
    "pending-dues":       <AdminPendingDues />,
    coupons:              <AdminCoupons openForm={openForm} />,
    discounts:            <AdminDiscounts openForm={openForm} />,
    settings:             <AdminSettings />,
  };
  return map[active] || (
    <div className="ad-section">
      <div className="ad-card" style={{ textAlign:"center", padding:"60px", color:"var(--text-secondary)" }}>
        <div style={{ fontSize:"3rem", marginBottom:12, opacity:.4 }}>⚙️</div>
        <p>Section under development.</p>
      </div>
    </div>
  );
}

// ─── TOPBAR NOTIFICATION BELL ─────────────────────────────────────────────────
function TopbarBell({ onNav }) {
  const [open, setOpen] = useState(false);
  const unread = notificationsData.filter(n => !n.read).length;
  return (
    <div style={{ position:"relative" }}>
      <button style={{ background:"none", border:"none", cursor:"pointer", position:"relative", fontSize:"1.1rem" }} onClick={() => setOpen(o => !o)}>
        🔔
        {unread > 0 && <span className="ad-notif-badge">{unread}</span>}
      </button>
      {open && (
        <div className="ad-notif-dropdown">
          <div className="ad-notif-dropdown-head">
            <strong>Notifications</strong>
            <span className="ad-badge ad-red">{unread} new</span>
          </div>
          {notificationsData.slice(0,4).map(n => (
            <div key={n.id} className={`ad-notif-item ${!n.read?"ad-notif-item-unread":""}`}>
              <strong>{n.title}</strong>
              <p>{n.message}</p>
              <small>{n.time}</small>
            </div>
          ))}
          <button className="ad-notif-view-all" onClick={() => { setOpen(false); onNav("notifications"); }}>View All</button>
        </div>
      )}
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [active, setActive] = useState(DASHBOARD_ITEM.id);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { activeForm, formData, openForm, closeForm, isOpen } = useFormModal();
  const [toast, setToast] = useState(null);
  const { themeId, setThemeId, themes } = useDashboardTheme();
  const go = useCallback(id => setActive(id), []);
  const allItems = [DASHBOARD_ITEM, ...NAV_GROUPS.flatMap(g => g.items)];
  const currentLabel = allItems.find(i => i.id === active)?.label || "Dashboard";

  const handleFormSubmit = (data) => {
    closeForm();
    setToast(`✅ ${formTitles[activeForm] || "Action"} completed successfully!`);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="ad-layout">
      <Sidebar active={active} onNav={go} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="ad-main">
        <header className="ad-topbar">
          <button className="ad-menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
          <span className="ad-topbar-title">Admin Dashboard · {currentLabel}</span>
          <div className="ad-topbar-right">
            <DashboardThemeSwitcher themeId={themeId} setThemeId={setThemeId} themes={themes} />
            <TopbarBell onNav={go} />
            <div className="ad-avatar ad-avatar-sm">{adminInfo.avatar}</div>
          </div>
        </header>
        <main className="ad-content">
          {renderSection(active, openForm)}
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
          data={formData}
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
