import { useState, useCallback, memo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt, FaUsers, FaCodeBranch, FaFileAlt, FaTags,
  FaChartLine, FaCog, FaShieldAlt, FaHome, FaUserShield,
  FaBell, FaDownload, FaPlus, FaEdit, FaTrash, FaMapMarkerAlt,
  FaMoneyBillWave, FaHeartbeat, FaServer, FaChevronDown, FaChevronRight,
  FaReceipt, FaChartBar, FaUsers as FaUsersAlt, FaBullhorn, FaEnvelope,
  FaTools, FaBuilding, FaWrench, FaPlug, FaDatabase, FaRobot,
  FaFlag, FaEye, FaLock, FaHistory, FaExclamationTriangle,
  FaTicketAlt, FaStar, FaSearch, FaFilter, FaSync, FaUpload,
  FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaInfoCircle,
  FaToggleOn, FaToggleOff, FaLightbulb, FaSignal, FaCloudUploadAlt,
  FaCloudDownloadAlt, FaShieldVirus, FaComments, FaSms, FaAngleDown,
  FaAngleRight, FaBoxOpen, FaStore, FaCalendarAlt, FaUserClock,
  FaChartPie, FaWallet, FaCreditCard, FaFileInvoiceDollar,
  FaUserTie, FaClock, FaSpinner,
} from "react-icons/fa";
import {
  globalStats, branches, allUsers, membershipPlans, auditLog,
  loginHistory, systemLogs, financialReports, transactions, subscriptions,
  memberGrowth, notifications, campaigns, equipment, vendors,
  maintenanceLogs, integrations, featureFlags, supportTickets,
  feedbackData, liveMonitoring, aiInsights, systemSettings,
} from "../data/superAdminData";
import FormModal from "../components/FormModal";
import { FormRenderer, formTitles } from "../components/DynamicForms";
import { useFormModal } from "../hooks/useFormModal";
import DashboardThemeSwitcher, { useDashboardTheme } from "../components/DashboardThemeSwitcher";
import superAdminAPI from "../services/superAdminAPI";
import { SABilling, SARevenue, SATransactions, SAPlans } from "../components/FinanceIntegration";
import { SAReports, SAMemberAnalytics, SAFinancialAnalytics } from "../components/AnalyticsIntegration";
import "../superadmin-dashboard.css";

// ─── NAV STRUCTURE ────────────────────────────────────────────────────────────
// Dashboard is a DIRECT link — no dropdown, no children
const DASHBOARD_ITEM = { 
  id: "overview", 
  icon: <FaHome />, 
  label: "Dashboard",
  color: "#ef4444",
};

const NAV_GROUPS = [
  {
    label: "Management",
    icon: <FaUsers />,
    color: "#3b82f6",
    items: [
      { id: "users",    icon: <FaUsers />,       label: "User Management", color: "#3b82f6" },
      { id: "branches", icon: <FaCodeBranch />,  label: "Branches",        color: "#0ea5e9" },
      { id: "content",  icon: <FaFileAlt />,     label: "Content",         color: "#06b6d4" },
    ],
  },
  {
    label: "Finance",
    icon: <FaMoneyBillWave />,
    color: "#10b981",
    items: [
      { id: "billing",      icon: <FaReceipt />,           label: "Billing",         color: "#10b981" },
      { id: "revenue",      icon: <FaChartBar />,          label: "Revenue",         color: "#34d399" },
      { id: "transactions", icon: <FaCreditCard />,        label: "Transactions",    color: "#14b8a6" },
      { id: "plans",        icon: <FaTags />,              label: "Plans & Pricing", color: "#2dd4bf" },
    ],
  },
  {
    label: "Analytics",
    icon: <FaChartLine />,
    color: "#6366f1",
    items: [
      { id: "reports",           icon: <FaFileInvoiceDollar />, label: "Reports",             color: "#6366f1" },
      { id: "members-analytics", icon: <FaUsers />,             label: "Member Analytics",    color: "#818cf8" },
      { id: "fin-analytics",     icon: <FaChartPie />,          label: "Financial Analytics", color: "#a5b4fc" },
    ],
  },
  {
    label: "Engagement",
    icon: <FaBell />,
    color: "#ec4899",
    items: [
      { id: "notifications-center", icon: <FaBell />,      label: "Notifications", color: "#ec4899" },
      { id: "campaigns",            icon: <FaBullhorn />,  label: "Campaigns",     color: "#f43f5e" },
      { id: "communication",        icon: <FaEnvelope />,  label: "Communication", color: "#fb7185" },
    ],
  },
  {
    label: "Operations",
    icon: <FaTools />,
    color: "#f97316",
    items: [
      { id: "equipment",   icon: <FaTools />,  label: "Equipment",   color: "#f97316" },
      { id: "vendors",     icon: <FaStore />,  label: "Vendors",     color: "#fb923c" },
      { id: "maintenance", icon: <FaWrench />, label: "Maintenance", color: "#fbbf24" },
    ],
  },
  {
    label: "Integrations",
    icon: <FaPlug />,
    color: "#8b5cf6",
    items: [
      { id: "api-settings", icon: <FaPlug />,    label: "API Settings",     color: "#8b5cf6" },
      { id: "third-party",  icon: <FaBoxOpen />, label: "Third-party Apps", color: "#a78bfa" },
    ],
  },
  {
    label: "Data Center",
    icon: <FaDatabase />,
    color: "#0ea5e9",
    items: [
      { id: "import-data", icon: <FaCloudUploadAlt />,   label: "Import Data", color: "#0ea5e9" },
      { id: "export-data", icon: <FaCloudDownloadAlt />, label: "Export Data", color: "#38bdf8" },
      { id: "backups",     icon: <FaDatabase />,         label: "Backups",     color: "#7dd3fc" },
    ],
  },
  {
    label: "Advanced",
    icon: <FaRobot />,
    color: "#f59e0b",
    items: [
      { id: "ai-insights",     icon: <FaRobot />,  label: "AI Insights",    color: "#f59e0b" },
      { id: "feature-flags",   icon: <FaFlag />,   label: "Feature Flags",  color: "#fbbf24" },
      { id: "live-monitoring", icon: <FaSignal />, label: "Live Monitoring", color: "#22c55e" },
    ],
  },
  {
    label: "Security",
    icon: <FaShieldAlt />,
    color: "#ef4444",
    items: [
      { id: "audit",         icon: <FaShieldAlt />,          label: "Audit & Logs",  color: "#ef4444" },
      { id: "login-history", icon: <FaUserClock />,          label: "Login History", color: "#f87171" },
      { id: "system-logs",   icon: <FaExclamationTriangle />,label: "System Logs",   color: "#fca5a5" },
    ],
  },
  {
    label: "Settings",
    icon: <FaCog />,
    color: "#64748b",
    items: [
      { id: "settings",       icon: <FaCog />,    label: "General Settings",     color: "#64748b" },
      { id: "notif-settings", icon: <FaBell />,   label: "Notifications",        color: "#94a3b8" },
      { id: "sys-config",     icon: <FaServer />, label: "System Configuration", color: "#475569" },
    ],
  },
  {
    label: "Support",
    icon: <FaTicketAlt />,
    color: "#06b6d4",
    items: [
      { id: "tickets",  icon: <FaTicketAlt />, label: "Tickets",  color: "#06b6d4" },
      { id: "feedback", icon: <FaStar />,      label: "Feedback", color: "#fbbf24" },
    ],
  },
];

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const SABadge = memo(({ s }) => {
  const m = {
    active:"sa-green", inactive:"sa-gray", planned:"sa-yellow", new:"sa-blue",
    member:"sa-blue", trainer:"sa-orange", admin:"sa-purple", superadmin:"sa-red",
    reception:"sa-gray", success:"sa-green", failed:"sa-red", refunded:"sa-yellow",
    working:"sa-green", maintenance:"sa-yellow", broken:"sa-red",
    open:"sa-red", "in-progress":"sa-yellow", closed:"sa-green",
    high:"sa-red", medium:"sa-yellow", low:"sa-blue",
    completed:"sa-green", pending:"sa-yellow", blocked:"sa-red",
    expiring:"sa-yellow", expired:"sa-gray", draft:"sa-gray",
    error:"sa-red", warning:"sa-yellow", info:"sa-blue", system:"sa-purple",
    enabled:"sa-green", disabled:"sa-gray",
    production:"sa-green", beta:"sa-yellow", alpha:"sa-orange",
  };
  return <span className={`sa-badge ${m[s] || "sa-gray"}`}>{s}</span>;
});

const Toast = memo(({ msg, onClose }) => (
  <div className="sa-toast">
    <FaCheckCircle style={{ color: "#22c55e", marginRight: 8 }} />
    {msg}
    <button onClick={onClose} className="sa-toast-close">×</button>
  </div>
));

function useToast() {
  const [toast, setToast] = useState(null);
  const show = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);
  return { toast, show };
}

const MiniBarChart = ({ data, color = "#ef4444" }) => {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="sa-mini-bar-chart">
      {data.map((d, i) => (
        <div key={i} className="sa-mini-bar-col">
          <div className="sa-mini-bar" style={{ height: `${(d.value / max) * 100}%`, background: color }} />
          <span className="sa-mini-bar-label">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

const LineChart = ({ data, color = "#ef4444", height = 100 }) => {
  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const range = max - min || 1;
  const w = 100 / (data.length - 1);
  const points = data.map((d, i) => `${i * w},${height - ((d.value - min) / range) * (height - 10) - 5}`).join(" ");
  return (
    <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{ width: "100%", height }}>
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
      {data.map((d, i) => (
        <circle key={i} cx={i * w} cy={height - ((d.value - min) / range) * (height - 10) - 5} r="2" fill={color} />
      ))}
    </svg>
  );
};

const KpiCard = ({ icon, label, value, change, color, trend }) => (
  <div className="sa-kpi-card">
    <div className="sa-kpi-icon" style={{ background: color + "22" }}>{icon}</div>
    <div>
      <strong>{value}</strong>
      <span>{label}</span>
      {change && <small style={{ color: trend === "up" ? "#22c55e" : trend === "down" ? "#ef4444" : "var(--text-secondary)" }}>{change}</small>}
    </div>
  </div>
);

const EmptyState = ({ icon, title, desc }) => (
  <div className="sa-empty">
    <div className="sa-empty-icon">{icon || <FaBoxOpen />}</div>
    <h4>{title || "No data found"}</h4>
    <p>{desc || "Nothing to display here yet."}</p>
  </div>
);

const LoadingState = () => (
  <div className="sa-loading">
    <div className="sa-spinner" />
    <span>Loading...</span>
  </div>
);

function SAModal({ title, onClose, children }) {
  return (
    <div className="sa-modal-overlay" onClick={onClose}>
      <div className="sa-modal" onClick={e => e.stopPropagation()}>
        <div className="sa-modal-head">
          <h3>{title}</h3>
          <button className="sa-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="sa-modal-body">{children}</div>
      </div>
    </div>
  );
}

function Pagination({ total, page, perPage, onChange }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  return (
    <div className="sa-pagination">
      <button disabled={page === 1} onClick={() => onChange(page - 1)} className="sa-page-btn">‹</button>
      {Array.from({ length: pages }, (_, i) => (
        <button key={i} className={`sa-page-btn ${page === i + 1 ? "sa-page-active" : ""}`} onClick={() => onChange(i + 1)}>{i + 1}</button>
      ))}
      <button disabled={page === pages} onClick={() => onChange(page + 1)} className="sa-page-btn">›</button>
    </div>
  );
}

// ─── OVERVIEW ─────────────────────────────────────────────────────────────────
function SAOverview() {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [branchesData, setBranchesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch dashboard stats
        const statsResponse = await superAdminAPI.analytics.getDashboardStats();
        console.log('[SAOverview] Stats Response:', statsResponse);
        // Extract data from response (ApiResponse wraps data in a data property)
        const statsData = statsResponse?.data || statsResponse;
        setDashboardStats(statsData);

        // Fetch branches
        const branchesResponse = await superAdminAPI.branches.getAllBranches();
        console.log('[SAOverview] Branches Response:', branchesResponse);
        // Extract branches array from response.data.branches
        const branchesArray = branchesResponse?.data?.branches || branchesResponse?.branches || [];
        console.log('[SAOverview] Branches Array:', branchesArray);
        setBranchesData(Array.isArray(branchesArray) ? branchesArray : []);
      } catch (err) {
        console.error('[SAOverview] Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Convert dashboard stats to KPI cards format
  const convertStatsToKPIs = (statsData) => {
    if (!statsData) return [];
    
    const kpis = [];
    
    // Overview stats
    if (statsData.overview) {
      kpis.push(
        { icon: <FaUsers />, label: "Total Users", value: statsData.overview.totalUsers || 0, color: "#3b82f6", change: "All roles" },
        { icon: <FaUsers />, label: "Total Members", value: statsData.overview.totalMembers || 0, color: "#0ea5e9", change: "Active members" },
        { icon: <FaHeartbeat />, label: "Total Trainers", value: statsData.overview.totalTrainers || 0, color: "#06b6d4", change: "Assigned trainers" },
        { icon: <FaCodeBranch />, label: "Total Branches", value: statsData.overview.totalBranches || 0, color: "#10b981", change: "All branches" }
      );
    }
    
    // Membership stats
    if (statsData.memberships) {
      kpis.push(
        { icon: <FaCheckCircle />, label: "Active Memberships", value: statsData.memberships.active || 0, color: "#22c55e", change: `${statsData.memberships.activePercentage}% active` }
      );
    }
    
    // Revenue stats
    if (statsData.revenue) {
      kpis.push(
        { icon: <FaMoneyBillWave />, label: "Total Revenue", value: `₹${(statsData.revenue.total / 100000).toFixed(1)}L`, color: "#f59e0b", change: "All time" }
      );
    }
    
    return kpis;
  };

  // Use fetched data or empty arrays
  const stats = convertStatsToKPIs(dashboardStats);
  const branchList = branchesData.length > 0 ? branchesData : [];
  // Don't use mock data - use empty array if no real data
  const rev = [];
  const maxRev = 1;

  return (
    <div className="sa-section">
      <div className="sa-section-head">
        <h2><FaTachometerAlt style={{ marginRight: 8 }} />System Overview</h2>
        <span className="sa-badge sa-green">All Systems Operational</span>
      </div>
      {loading && <LoadingState />}
      {error && <div className="sa-error" style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "12px" }}>Error: {error}</div>}
      {!loading && !error && (
        <>
          <div className="sa-kpi-grid">
            {Array.isArray(stats) && stats.length > 0 ? stats.map((k, i) => (
              <div className="sa-kpi-card" key={i}>
                <div className="sa-kpi-icon" style={{ background: k.color + "22", fontSize: "1.4rem" }}>{k.icon}</div>
                <div>
                  <strong>{k.value}</strong>
                  <span>{k.label}</span>
                  <small style={{ color: "var(--text-secondary)" }}>{k.change}</small>
                </div>
              </div>
            )) : <EmptyState title="No stats available" desc="Dashboard data will appear here" />}
          </div>
          <div className="sa-two-col">
            <div className="sa-card">
              <div className="sa-card-head"><h3><FaMoneyBillWave style={{ marginRight: 6 }} />Global Revenue Trend</h3></div>
              <div className="sa-bar-chart">
                {rev.length > 0 ? rev.map((v, i) => (
                  <div className="sa-bar-col" key={i}>
                    <span className="sa-bar-val">${(v.revenue / 1000).toFixed(0)}k</span>
                    <div className="sa-bar" style={{ height: `${(v.revenue / maxRev) * 100}%` }} />
                    <span className="sa-bar-label">{v.month}</span>
                  </div>
                )) : <EmptyState title="No revenue data" desc="Revenue data will appear here" />}
              </div>
            </div>
            <div className="sa-card">
              <div className="sa-card-head"><h3><FaCodeBranch style={{ marginRight: 6 }} />Branch Performance</h3></div>
              {branchList.length > 0 ? branchList.map(b => (
                <div className="sa-branch-row" key={b.id || b._id}>
                  <div><strong>{b.branchName || b.name}</strong><span>{b.city || b.location || 'N/A'}</span></div>
                  <div className="sa-branch-stats">
                    <span><FaUsers style={{ marginRight: 4 }} />{b.totalMembers || b.members || b.memberCount || 0}</span>
                    <span>{b.revenue || '$0'}</span>
                    <span style={{ color: "#22c55e", fontWeight: 700 }}>{b.growth || '+0%'}</span>
                    <SABadge s={b.branchStatus || b.status || 'active'} />
                  </div>
                </div>
              )) : <EmptyState title="No branches" desc="Create a branch to get started" />}
            </div>
          </div>
          <div className="sa-card">
            <div className="sa-card-head"><h3><FaServer style={{ marginRight: 6 }} />Platform Health</h3></div>
            <div className="sa-health-grid">
              {[["API Server","99.9%","#22c55e"],["Database","99.8%","#22c55e"],["CDN","100%","#22c55e"],["Email Service","98.2%","#f97316"],["SMS Gateway","97.5%","#f97316"],["Backup System","100%","#22c55e"]].map(([s, v, c]) => (
                <div className="sa-health-item" key={s}>
                  <div className="sa-health-dot" style={{ background: c }} />
                  <span>{s}</span>
                  <strong style={{ color: c }}>{v}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="sa-card">
            <div className="sa-card-head"><h3><FaBell style={{ marginRight: 6 }} />Recent Alerts</h3></div>
            <EmptyState title="No alerts" desc="All systems running smoothly" />
          </div>
        </>
      )}
    </div>
  );
}

// ─── USER MANAGEMENT ──────────────────────────────────────────────────────────
function SAUsers({ openForm, dataChangeKey }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast, show } = useToast();
  const PER = 5;

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminAPI.users.getAllUsers();
      // Extract users array from response.data.users
      const usersArray = response?.data?.users || [];
      setUsers(Array.isArray(usersArray) ? usersArray : []);
    } catch (err) {
      console.error('[SAUsers] Error fetching users:', err);
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Listen for data changes from parent
  useEffect(() => {
    if (dataChangeKey !== undefined) {
      fetchUsers();
    }
  }, [dataChangeKey, fetchUsers]);

  const userList = users.length > 0 ? users : [];
  const filtered = userList.filter(u =>
    (roleFilter === "all" || u.role === roleFilter) &&
    ((u.fullName || u.name || '').toLowerCase().includes(search.toLowerCase()) || (u.email || '').toLowerCase().includes(search.toLowerCase()))
  );
  const paged = filtered.slice((page - 1) * PER, page * PER);

  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaUsers style={{ marginRight: 8 }} />User Management</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-primary sa-btn-sm" onClick={() => openForm("createUser")}><FaPlus style={{ marginRight: 6 }} />Add User</button>
          <button className="btn btn-outline sa-btn-sm" onClick={() => show("Users exported!")}><FaDownload style={{ marginRight: 6 }} />Export</button>
        </div>
      </div>
      {loading && <LoadingState />}
      {error && <div className="sa-error" style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "12px" }}>Error: {error}</div>}
      {!loading && !error && (
        <>
          <div className="sa-filters">
            <div className="sa-search-wrap"><FaSearch className="sa-search-icon" /><input className="sa-input sa-input-search" placeholder="Search users..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
            {["all", "member", "trainer", "admin", "superadmin"].map(r => (
              <button key={r} className={`sa-filter-btn ${roleFilter === r ? "sa-filter-active" : ""}`} onClick={() => { setRoleFilter(r); setPage(1); }}>{r}</button>
            ))}
          </div>
          <div className="sa-card">
            {paged.length === 0 ? <EmptyState title="No users found" desc="Try adjusting your search or filters." /> : (
              <table className="sa-table">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Branch</th><th>Last Login</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {paged.map(u => (
                    <tr key={u.id || u._id}>
                      <td><strong>{u.fullName || u.name}</strong></td>
                      <td style={{ color: "var(--text-secondary)" }}>{u.email}</td>
                      <td><SABadge s={u.role || 'member'} /></td>
                      <td>{u.branch || u.branchId || 'N/A'}</td>
                      <td style={{ color: "var(--text-secondary)", fontSize: ".78rem" }}>{u.lastLogin || 'Never'}</td>
                      <td><SABadge s={u.isActive ? 'active' : 'inactive'} /></td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="sa-link-btn" onClick={() => show(`Editing ${u.fullName || u.name}`)}><FaEdit /></button>
                          <button className="sa-link-btn" style={{ color: "#ef4444" }} onClick={() => show(`${u.fullName || u.name} removed`)}><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <Pagination total={filtered.length} page={page} perPage={PER} onChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}

// ─── BRANCHES ─────────────────────────────────────────────────────────────────
function SABranches({ openForm, dataChangeKey }) {
  const [branchesData, setBranchesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast, show } = useToast();

  const fetchBranches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminAPI.branches.getAllBranches();
      // Extract branches array from response.data.branches
      const branchesArray = response?.data?.branches || [];
      setBranchesData(Array.isArray(branchesArray) ? branchesArray : []);
    } catch (err) {
      console.error('[SABranches] Error fetching branches:', err);
      setError(err.message);
      setBranchesData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  // Listen for data changes from parent
  useEffect(() => {
    if (dataChangeKey !== undefined) {
      fetchBranches();
    }
  }, [dataChangeKey, fetchBranches]);

  const branchList = branchesData.length > 0 ? branchesData : [];

  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaCodeBranch style={{ marginRight: 8 }} />Branch Management</h2>
        <button className="btn btn-primary sa-btn-sm" onClick={() => openForm("createBranch")}><FaPlus style={{ marginRight: 6 }} />Add Branch</button>
      </div>
      {loading && <LoadingState />}
      {error && <div className="sa-error" style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "12px" }}>Error: {error}</div>}
      {!loading && !error && (
        <div className="sa-branches-grid">
          {branchList.length > 0 ? branchList.map(b => (
            <div className="sa-branch-card sa-card" key={b.id || b._id}>
              <div className="sa-branch-card-head"><h4>{b.branchName || b.name}</h4><SABadge s={b.branchStatus || b.status || 'active'} /></div>
              <p className="sa-branch-city"><FaMapMarkerAlt style={{ marginRight: 4 }} />{b.city || b.location || 'N/A'}</p>
              <div className="sa-branch-kpis">
                <div><strong>{b.totalMembers || b.members || b.memberCount || 0}</strong><span>Members</span></div>
                <div><strong>{b.revenue || '$0'}</strong><span>Revenue</span></div>
                <div><strong>{b.assignedTrainers?.length || b.trainers || b.trainerCount || 0}</strong><span>Trainers</span></div>
              </div>
              <div className="sa-branch-growth"><FaChartLine style={{ marginRight: 4, color: "#22c55e" }} /><span style={{ color: "#22c55e", fontWeight: 700 }}>{b.growth || '+0%'}</span><span style={{ color: "var(--text-secondary)", fontSize: ".75rem" }}> growth</span></div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button className="btn btn-outline sa-btn-sm">View</button>
                <button className="btn btn-outline sa-btn-sm" onClick={() => show(`Editing ${b.branchName || b.name}`)}><FaEdit style={{ marginRight: 4 }} />Edit</button>
              </div>
            </div>
          )) : <EmptyState title="No branches" desc="Create a branch to get started" />}
        </div>
      )}
    </div>
  );
}

// ─── CONTENT ──────────────────────────────────────────────────────────────────
function SAContent({ openForm }) {
  const { toast, show } = useToast();
  const items = [
    { id: 1, title: "Summer Fitness Tips", type: "Blog", status: "published", date: "May 1, 2026" },
    { id: 2, title: "New Equipment Arrival", type: "Announcement", status: "published", date: "Apr 28, 2026" },
    { id: 3, title: "Yoga Class Schedule", type: "Schedule", status: "draft", date: "Apr 25, 2026" },
    { id: 4, title: "Member Success Story", type: "Blog", status: "published", date: "Apr 20, 2026" },
  ];
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaFileAlt style={{ marginRight: 8 }} />Content Management</h2>
        <button className="btn btn-primary sa-btn-sm" onClick={() => openForm("newContent")}><FaPlus style={{ marginRight: 6 }} />New Content</button>
      </div>
      <div className="sa-card">
        <table className="sa-table">
          <thead><tr><th>Title</th><th>Type</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map(c => (
              <tr key={c.id}>
                <td><strong>{c.title}</strong></td>
                <td><SABadge s={c.type.toLowerCase()} /></td>
                <td><SABadge s={c.status} /></td>
                <td style={{ color: "var(--text-secondary)", fontSize: ".78rem" }}>{c.date}</td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="sa-link-btn" onClick={() => show("Editing content...")}><FaEdit /></button>
                    <button className="sa-link-btn" style={{ color: "#ef4444" }} onClick={() => show("Content deleted")}><FaTrash /></button>
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





// ─── ENGAGEMENT: NOTIFICATIONS ────────────────────────────────────────────────
function SANotificationsCenter() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast, show } = useToast();

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = {};
      if (typeFilter !== "all") filters.type = typeFilter;
      if (statusFilter !== "all") filters.status = statusFilter;
      const response = await superAdminAPI.engagement.getNotifications(filters);
      const notifsArray = response?.data?.notifications || [];
      setNotifs(Array.isArray(notifsArray) ? notifsArray : []);
    } catch (err) {
      console.error('[SANotificationsCenter] Error fetching notifications:', err);
      setError(err.message);
      setNotifs([]);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, statusFilter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markRead = useCallback(async (id) => {
    try {
      await superAdminAPI.engagement.markNotificationRead(id);
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      show("Notification marked as read");
    } catch (err) {
      console.error('[SANotificationsCenter] Error marking as read:', err);
      show("Error marking notification");
    }
  }, [show]);

  const markAll = useCallback(async () => {
    try {
      await superAdminAPI.engagement.markAllNotificationsRead();
      setNotifs(prev => prev.map(n => ({ ...n, read: true })));
      show("All marked as read");
    } catch (err) {
      console.error('[SANotificationsCenter] Error marking all as read:', err);
      show("Error marking all notifications");
    }
  }, [show]);

  const deleteNotif = useCallback(async (id) => {
    try {
      await superAdminAPI.engagement.deleteNotification(id);
      setNotifs(prev => prev.filter(n => n.id !== id));
      show("Notification deleted");
    } catch (err) {
      console.error('[SANotificationsCenter] Error deleting notification:', err);
      show("Error deleting notification");
    }
  }, [show]);

  const typeIcon = { expiry: <FaCalendarAlt />, payment: <FaCreditCard />, system: <FaServer />, alert: <FaExclamationTriangle />, info: <FaInfoCircle /> };
  const typeColor = { expiry: "#f97316", payment: "#ef4444", system: "#3b82f6", alert: "#ef4444", info: "#22c55e" };

  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaBell style={{ marginRight: 8 }} />Notifications</h2>
        <button className="btn btn-outline sa-btn-sm" onClick={markAll} disabled={loading}>Mark All Read</button>
      </div>
      {loading && <LoadingState />}
      {error && <div className="sa-error" style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "12px" }}>Error: {error}</div>}
      {!loading && !error && (
        <>
          <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
            <KpiCard icon={<FaBell />} label="Total Alerts" value={notifs.length} color="#3b82f6" />
            <KpiCard icon={<FaExclamationCircle />} label="Unread" value={notifs.filter(n => !n.read).length} color="#ef4444" />
            <KpiCard icon={<FaCheckCircle />} label="Read" value={notifs.filter(n => n.read).length} color="#22c55e" />
          </div>
          <div className="sa-filters">
            {["all", "expiry", "payment", "system", "alert", "info"].map(t => (
              <button key={t} className={`sa-filter-btn ${typeFilter === t ? "sa-filter-active" : ""}`} onClick={() => setTypeFilter(t)}>{t}</button>
            ))}
          </div>
          <div className="sa-card">
            {notifs.length === 0 ? <EmptyState title="No notifications" desc="All caught up!" /> : notifs.map(n => (
              <div key={n.id} className={`sa-notif-row ${!n.read ? "sa-notif-unread" : ""}`}>
                <div className="sa-notif-icon" style={{ background: (typeColor[n.type] || "#6b7280") + "22", color: typeColor[n.type] || "#6b7280" }}>
                  {typeIcon[n.type] || <FaBell />}
                </div>
                <div className="sa-notif-body">
                  <strong>{n.title}</strong>
                  <span>{n.message}</span>
                </div>
                <div className="sa-notif-meta">
                  <small>{n.timestamp || n.time}</small>
                  <div style={{ display: "flex", gap: 6 }}>
                    {!n.read && <button className="sa-link-btn" style={{ fontSize: ".7rem" }} onClick={() => markRead(n.id)}>Mark read</button>}
                    <button className="sa-link-btn" style={{ fontSize: ".7rem", color: "#ef4444" }} onClick={() => deleteNotif(n.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── ENGAGEMENT: CAMPAIGNS ────────────────────────────────────────────────────
function SACampaigns({ openForm }) {
  const [campaignsData, setCampaignsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", type: "email", target: "", discount: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast, show } = useToast();

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminAPI.engagement.getCampaigns();
      console.log('[SACampaigns] Response:', response);
      const campaignsArray = response?.data?.announcements || response?.announcements || [];
      setCampaignsData(Array.isArray(campaignsArray) ? campaignsArray : []);
    } catch (err) {
      console.error('[SACampaigns] Error fetching campaigns:', err);
      setError(err.message);
      setCampaignsData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleCreateCampaign = useCallback(async () => {
    if (!form.name || !form.target || !form.message) {
      show("Please fill all required fields");
      return;
    }
    try {
      setIsSubmitting(true);
      const campaignData = {
        name: form.name,
        type: form.type,
        targetAudience: form.target,
        message: form.message,
        discount: form.type === "discount" ? parseFloat(form.discount) : null,
      };
      console.log('[SACampaigns] Creating campaign:', campaignData);
      await superAdminAPI.engagement.createCampaign(campaignData);
      show("Campaign created successfully!");
      setShowModal(false);
      setForm({ name: "", type: "email", target: "", discount: "", message: "" });
      fetchCampaigns();
    } catch (err) {
      console.error('[SACampaigns] Error creating campaign:', err);
      show("Error creating campaign: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  }, [form, show, fetchCampaigns]);

  const handleDeleteCampaign = useCallback(async (campaignId) => {
    try {
      await superAdminAPI.engagement.deleteCampaign(campaignId);
      show("Campaign deleted successfully!");
      fetchCampaigns();
    } catch (err) {
      console.error('[SACampaigns] Error deleting campaign:', err);
      show("Error deleting campaign");
    }
  }, [show, fetchCampaigns]);

  const handleLaunchCampaign = useCallback(async (campaignId) => {
    try {
      await superAdminAPI.engagement.launchCampaign(campaignId);
      show("Campaign launched successfully!");
      fetchCampaigns();
    } catch (err) {
      console.error('[SACampaigns] Error launching campaign:', err);
      show("Error launching campaign");
    }
  }, [show, fetchCampaigns]);

  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaBullhorn style={{ marginRight: 8 }} />Campaigns</h2>
        <button className="btn btn-primary sa-btn-sm" onClick={() => setShowModal(true)} disabled={loading}><FaPlus style={{ marginRight: 6 }} />Create Campaign</button>
      </div>
      {loading && <LoadingState />}
      {error && <div className="sa-error" style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "12px" }}>Error: {error}</div>}
      {!loading && !error && (
        <>
          <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
            <KpiCard icon={<FaBullhorn />} label="Active Campaigns" value={campaignsData.filter(c => c.status === "published").length} color="#22c55e" />
            <KpiCard icon={<FaEnvelope />} label="Total Campaigns" value={campaignsData.length} color="#3b82f6" />
            <KpiCard icon={<FaEye />} label="Draft Campaigns" value={campaignsData.filter(c => c.status === "draft").length} color="#8b5cf6" />
          </div>
          <div className="sa-card">
            {campaignsData.length === 0 ? <EmptyState title="No campaigns" desc="Create your first campaign to get started" /> : (
              <table className="sa-table">
                <thead><tr><th>Campaign</th><th>Type</th><th>Target</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
                <tbody>
                  {campaignsData.map(c => (
                    <tr key={c.id || c._id}>
                      <td><strong>{c.title || c.name}</strong></td>
                      <td><SABadge s={c.category || c.type || 'announcement'} /></td>
                      <td style={{ fontSize: ".8rem", color: "var(--text-secondary)" }}>{c.targetAudience || c.target || 'N/A'}</td>
                      <td><SABadge s={c.status || 'draft'} /></td>
                      <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          {c.status === "draft" && <button className="sa-link-btn" onClick={() => handleLaunchCampaign(c.id || c._id)} style={{ fontSize: ".7rem" }}>Launch</button>}
                          <button className="sa-link-btn" onClick={() => show(`Editing ${c.title || c.name}`)}><FaEdit /></button>
                          <button className="sa-link-btn" style={{ color: "#ef4444" }} onClick={() => handleDeleteCampaign(c.id || c._id)}><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
      {showModal && (
        <SAModal title="Create Campaign" onClose={() => setShowModal(false)}>
          <div className="sa-form-group"><label>Campaign Name</label><input className="sa-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Summer Offer" /></div>
          <div className="sa-form-group"><label>Type</label>
            <select className="sa-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="email">Email</option><option value="sms">SMS</option><option value="discount">Discount</option>
            </select>
          </div>
          <div className="sa-form-group"><label>Target Audience</label>
            <select className="sa-input" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))}>
              <option value="">Select Target Audience</option>
              <option value="all">All Members</option>
              <option value="members">Active Members</option>
              <option value="trainers">Trainers</option>
              <option value="staff">Staff</option>
              <option value="admins">Admins</option>
            </select>
          </div>
          {form.type === "discount" && <div className="sa-form-group"><label>Discount %</label><input className="sa-input" value={form.discount} onChange={e => setForm(f => ({ ...f, discount: e.target.value }))} placeholder="e.g. 20" /></div>}
          <div className="sa-form-group"><label>Message</label><textarea className="sa-input" rows={3} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Enter campaign message..." /></div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="btn btn-primary sa-btn-sm" onClick={handleCreateCampaign} disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Campaign"}</button>
            <button className="btn btn-outline sa-btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </SAModal>
      )}
    </div>
  );
}

// ─── ENGAGEMENT: COMMUNICATION ────────────────────────────────────────────────
function SACommunication() {
  const [tab, setTab] = useState("email");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ to: "all", subject: "", message: "", template: "none" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast, show } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminAPI.engagement.getAnnouncements();
      console.log('[SACommunication] Announcements Response:', response);
      const announcementsArray = response?.data?.announcements || [];
      setAnnouncements(Array.isArray(announcementsArray) ? announcementsArray : []);
    } catch (err) {
      console.error('[SACommunication] Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSend = useCallback(async () => {
    if (!form.message || !form.to) {
      show("Please fill all required fields");
      return;
    }
    try {
      setIsSubmitting(true);
      await superAdminAPI.engagement.createAnnouncement({
        title: form.subject || `${tab.charAt(0).toUpperCase() + tab.slice(1)} Message`,
        message: form.message,
        targetAudience: form.to,
      });
      show(`${tab.charAt(0).toUpperCase() + tab.slice(1)} sent successfully!`);
      setForm({ to: "all", subject: "", message: "", template: "none" });
      fetchData();
    } catch (err) {
      console.error('[SACommunication] Error sending:', err);
      show("Error sending message: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  }, [form, tab, show, fetchData]);

  const handleSaveDraft = useCallback(async () => {
    try {
      setIsSubmitting(true);
      await superAdminAPI.engagement.createAnnouncement({
        title: form.subject || `Draft ${tab.charAt(0).toUpperCase() + tab.slice(1)}`,
        message: form.message,
        targetAudience: form.to,
        status: "draft",
      });
      show("Saved as draft");
      setForm({ to: "all", subject: "", message: "", template: "none" });
      fetchData();
    } catch (err) {
      console.error('[SACommunication] Error saving draft:', err);
      show("Error saving draft: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  }, [form, tab, show, fetchData]);

  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head"><h2><FaEnvelope style={{ marginRight: 8 }} />Communication</h2></div>
      <div className="sa-tabs">
        {[["email", <FaEnvelope />, "Email"], ["sms", <FaSms />, "SMS"], ["announcement", <FaBullhorn />, "Announcement"]].map(([id, icon, label]) => (
          <button key={id} className={`sa-tab-btn ${tab === id ? "sa-tab-active" : ""}`} onClick={() => setTab(id)}>{icon}<span style={{ marginLeft: 6 }}>{label}</span></button>
        ))}
      </div>
      {loading && <LoadingState />}
      {error && <div className="sa-error" style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "12px" }}>Error: {error}</div>}
      {!loading && !error && (
        <div className="sa-card">
          <div className="sa-form-group"><label>To</label>
            <select className="sa-input" value={form.to} onChange={e => setForm(f => ({ ...f, to: e.target.value }))}>
              <option value="all">All Members</option>
              <option value="members">Active Members</option>
              <option value="trainers">Trainers</option>
              <option value="staff">Staff</option>
              <option value="admins">Admins</option>
            </select>
          </div>
          {tab !== "sms" && <div className="sa-form-group"><label>Subject</label><input className="sa-input" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder={`Enter ${tab} subject...`} /></div>}
          <div className="sa-form-group"><label>Message</label><textarea className="sa-input" rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder={`Compose your ${tab} message here...`} /></div>
          {tab === "email" && (
            <div className="sa-form-group"><label>Template</label>
              <select className="sa-input" value={form.template} onChange={e => setForm(f => ({ ...f, template: e.target.value }))}>
                <option value="none">None</option>
                <option value="renewal">Renewal Reminder</option>
                <option value="welcome">Welcome Email</option>
                <option value="offer">Offer Announcement</option>
              </select>
            </div>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="btn btn-primary sa-btn-sm" onClick={handleSend} disabled={isSubmitting}>{isSubmitting ? "Sending..." : `Send ${tab.charAt(0).toUpperCase() + tab.slice(1)}`}</button>
            <button className="btn btn-outline sa-btn-sm" onClick={handleSaveDraft} disabled={isSubmitting}>Save Draft</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── OPERATIONS: EQUIPMENT ────────────────────────────────────────────────────
function SAEquipment({ openForm }) {
  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", branch: "", status: "working" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast, show } = useToast();

  // Fetch equipment from backend
  const fetchEquipment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminAPI.operations.getEquipment();
      console.log('[SAEquipment] Response:', response);
      const equipmentArray = response?.data?.equipment || [];
      setEquipmentData(Array.isArray(equipmentArray) ? equipmentArray : []);
    } catch (err) {
      console.error('[SAEquipment] Error fetching equipment:', err);
      setError(err.message);
      setEquipmentData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  const filtered = equipmentData.filter(e =>
    (filter === "all" || e.status === filter) &&
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateEquipment = useCallback(async () => {
    if (!form.name || !form.category) {
      show("Please fill all required fields");
      return;
    }
    try {
      setIsSubmitting(true);
      await superAdminAPI.operations.createEquipment({
        name: form.name,
        category: form.category,
        branch: form.branch || 'N/A',
        status: form.status,
      });
      show("Equipment added successfully!");
      setShowModal(false);
      setForm({ name: "", category: "", branch: "", status: "working" });
      fetchEquipment();
    } catch (err) {
      console.error('[SAEquipment] Error creating equipment:', err);
      show("Error adding equipment: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  }, [form, show, fetchEquipment]);

  const handleDeleteEquipment = useCallback(async (equipmentId) => {
    try {
      await superAdminAPI.operations.deleteEquipment(equipmentId);
      show("Equipment deleted successfully!");
      fetchEquipment();
    } catch (err) {
      console.error('[SAEquipment] Error deleting equipment:', err);
      show("Error deleting equipment: " + (err.response?.data?.message || err.message));
    }
  }, [show, fetchEquipment]);

  const handleUpdateStatus = useCallback(async (equipmentId, newStatus) => {
    try {
      await superAdminAPI.operations.updateEquipment(equipmentId, { status: newStatus });
      show("Equipment status updated!");
      fetchEquipment();
    } catch (err) {
      console.error('[SAEquipment] Error updating equipment:', err);
      show("Error updating equipment: " + (err.response?.data?.message || err.message));
    }
  }, [show, fetchEquipment]);

  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaTools style={{ marginRight: 8 }} />Equipment</h2>
        <button className="btn btn-primary sa-btn-sm" onClick={() => setShowModal(true)} disabled={loading}><FaPlus style={{ marginRight: 6 }} />Add Equipment</button>
      </div>
      {loading && <LoadingState />}
      {error && <div className="sa-error" style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "12px" }}>Error: {error}</div>}
      {!loading && !error && (
        <>
          <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
            <KpiCard icon={<FaCheckCircle />} label="Working" value={equipmentData.filter(e => e.status === "working").length} color="#22c55e" />
            <KpiCard icon={<FaWrench />} label="Under Maintenance" value={equipmentData.filter(e => e.status === "maintenance").length} color="#f97316" />
            <KpiCard icon={<FaTimesCircle />} label="Broken" value={equipmentData.filter(e => e.status === "broken").length} color="#ef4444" />
          </div>
          <div className="sa-filters">
            <div className="sa-search-wrap"><FaSearch className="sa-search-icon" /><input className="sa-input sa-input-search" placeholder="Search equipment..." value={search} onChange={e => setSearch(e.target.value)} /></div>
            {["all", "working", "maintenance", "broken"].map(f => (
              <button key={f} className={`sa-filter-btn ${filter === f ? "sa-filter-active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
          <div className="sa-card">
            {filtered.length === 0 ? <EmptyState title="No equipment found" desc="Add your first equipment to get started" /> : (
              <table className="sa-table">
                <thead><tr><th>Equipment</th><th>Category</th><th>Branch</th><th>Status</th><th>Last Service</th><th>Next Service</th><th>Actions</th></tr></thead>
                <tbody>
                  {filtered.map(e => (
                    <tr key={e._id}>
                      <td><strong>{e.name}</strong></td>
                      <td><SABadge s={(e.category || 'general').toLowerCase()} /></td>
                      <td>{e.branch || 'N/A'}</td>
                      <td><SABadge s={e.status || 'working'} /></td>
                      <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{e.lastService ? new Date(e.lastService).toLocaleDateString() : 'N/A'}</td>
                      <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{e.nextService ? new Date(e.nextService).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="sa-link-btn" onClick={() => show(`Editing ${e.name}`)}><FaEdit /></button>
                          <button className="sa-link-btn" onClick={() => handleUpdateStatus(e._id, 'maintenance')}><FaWrench /></button>
                          <button className="sa-link-btn" style={{ color: "#ef4444" }} onClick={() => handleDeleteEquipment(e._id)}><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
      {showModal && (
        <SAModal title="Add Equipment" onClose={() => setShowModal(false)}>
          <div className="sa-form-group"><label>Equipment Name</label><input className="sa-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Treadmill" /></div>
          <div className="sa-form-group"><label>Category</label>
            <select className="sa-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              <option value="">Select Category</option>
              <option value="Cardio">Cardio</option>
              <option value="Strength">Strength</option>
              <option value="Functional">Functional</option>
              <option value="Flexibility">Flexibility</option>
            </select>
          </div>
          <div className="sa-form-group"><label>Branch</label><input className="sa-input" value={form.branch} onChange={e => setForm(f => ({ ...f, branch: e.target.value }))} placeholder="Branch name" /></div>
          <div className="sa-form-group"><label>Status</label>
            <select className="sa-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              <option value="working">Working</option>
              <option value="maintenance">Maintenance</option>
              <option value="broken">Broken</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="btn btn-primary sa-btn-sm" onClick={handleCreateEquipment} disabled={isSubmitting}>{isSubmitting ? "Adding..." : "Add Equipment"}</button>
            <button className="btn btn-outline sa-btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </SAModal>
      )}
    </div>
  );
}

// ─── OPERATIONS: VENDORS ──────────────────────────────────────────────────────
function SAVendors({ openForm }) {
  const [vendorsData, setVendorsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editVendor, setEditVendor] = useState(null);
  const [form, setForm] = useState({ name: "", category: "", contact: "", phone: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast, show } = useToast();

  // Fetch vendors from backend
  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminAPI.operations.getVendors();
      console.log('[SAVendors] Response:', response);
      const vendorsArray = response?.data?.vendors || [];
      setVendorsData(Array.isArray(vendorsArray) ? vendorsArray : []);
    } catch (err) {
      console.error('[SAVendors] Error fetching vendors:', err);
      setError(err.message);
      setVendorsData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const handleSaveVendor = useCallback(async () => {
    if (!form.name || !form.category || !form.contact) {
      show("Please fill all required fields");
      return;
    }
    try {
      setIsSubmitting(true);
      if (editVendor) {
        await superAdminAPI.operations.updateVendor(editVendor._id, {
          name: form.name,
          category: form.category,
          contact: form.contact,
          phone: form.phone,
          email: form.email,
        });
        show("Vendor updated successfully!");
      } else {
        await superAdminAPI.operations.createVendor({
          name: form.name,
          category: form.category,
          contact: form.contact,
          phone: form.phone,
          email: form.email,
        });
        show("Vendor added successfully!");
      }
      setShowModal(false);
      setEditVendor(null);
      setForm({ name: "", category: "", contact: "", phone: "", email: "" });
      fetchVendors();
    } catch (err) {
      console.error('[SAVendors] Error saving vendor:', err);
      show("Error saving vendor: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  }, [form, editVendor, show, fetchVendors]);

  const handleDeleteVendor = useCallback(async (vendorId) => {
    try {
      await superAdminAPI.operations.deleteVendor(vendorId);
      show("Vendor deleted successfully!");
      fetchVendors();
    } catch (err) {
      console.error('[SAVendors] Error deleting vendor:', err);
      show("Error deleting vendor: " + (err.response?.data?.message || err.message));
    }
  }, [show, fetchVendors]);

  const openEditModal = (vendor) => {
    setEditVendor(vendor);
    setForm({
      name: vendor.name,
      category: vendor.category,
      contact: vendor.contact,
      phone: vendor.phone,
      email: vendor.email,
    });
    setShowModal(true);
  };

  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaStore style={{ marginRight: 8 }} />Vendors</h2>
        <button className="btn btn-primary sa-btn-sm" onClick={() => { setEditVendor(null); setForm({ name: "", category: "", contact: "", phone: "", email: "" }); setShowModal(true); }} disabled={loading}><FaPlus style={{ marginRight: 6 }} />Add Vendor</button>
      </div>
      {loading && <LoadingState />}
      {error && <div className="sa-error" style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "12px" }}>Error: {error}</div>}
      {!loading && !error && (
        <div className="sa-card">
          {vendorsData.length === 0 ? <EmptyState title="No vendors found" desc="Add your first vendor to get started" /> : (
            <table className="sa-table">
              <thead><tr><th>Vendor</th><th>Category</th><th>Contact</th><th>Phone</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {vendorsData.map(v => (
                  <tr key={v._id}>
                    <td><strong>{v.name}</strong></td>
                    <td><SABadge s={(v.category || 'general').toLowerCase()} /></td>
                    <td>{v.contact || 'N/A'}</td>
                    <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{v.phone || 'N/A'}</td>
                    <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{v.email || 'N/A'}</td>
                    <td><SABadge s={v.status || 'active'} /></td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="sa-link-btn" onClick={() => openEditModal(v)}><FaEdit /></button>
                        <button className="sa-link-btn" style={{ color: "#ef4444" }} onClick={() => handleDeleteVendor(v._id)}><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      {showModal && (
        <SAModal title={editVendor ? "Edit Vendor" : "Add Vendor"} onClose={() => setShowModal(false)}>
          <div className="sa-form-group"><label>Vendor Name</label><input className="sa-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Company name" /></div>
          <div className="sa-form-group"><label>Category</label>
            <select className="sa-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              <option value="">Select Category</option>
              <option value="Equipment">Equipment</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Nutrition">Nutrition</option>
            </select>
          </div>
          <div className="sa-form-group"><label>Contact Person</label><input className="sa-input" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} placeholder="Contact name" /></div>
          <div className="sa-form-group"><label>Phone</label><input className="sa-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" /></div>
          <div className="sa-form-group"><label>Email</label><input className="sa-input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="vendor@email.com" /></div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="btn btn-primary sa-btn-sm" onClick={handleSaveVendor} disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</button>
            <button className="btn btn-outline sa-btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </SAModal>
      )}
    </div>
  );
}

// ─── OPERATIONS: MAINTENANCE ──────────────────────────────────────────────────
function SAMaintenance({ openForm }) {
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ equipmentId: "", type: "", technician_name: "", scheduled_date: "", cost: "", status: "pending", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast, show } = useToast();

  // Fetch maintenance from backend
  const fetchMaintenance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminAPI.operations.getMaintenance();
      console.log('[SAMaintenance] Response:', response);
      const maintenanceArray = response?.data?.maintenance || [];
      setMaintenanceData(Array.isArray(maintenanceArray) ? maintenanceArray : []);
    } catch (err) {
      console.error('[SAMaintenance] Error fetching maintenance:', err);
      setError(err.message);
      setMaintenanceData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMaintenance();
  }, [fetchMaintenance]);

  const handleCreateMaintenance = useCallback(async () => {
    if (!form.equipmentId || !form.type || !form.technician_name || !form.scheduled_date || !form.cost) {
      show("Please fill all required fields");
      return;
    }
    try {
      setIsSubmitting(true);
      await superAdminAPI.operations.createMaintenance(form.equipmentId, {
        type: form.type,
        technician_name: form.technician_name,
        scheduled_date: form.scheduled_date,
        cost: parseFloat(form.cost),
        status: form.status,
        description: form.description,
      });
      show("Maintenance scheduled successfully!");
      setShowModal(false);
      setForm({ equipmentId: "", type: "", technician_name: "", scheduled_date: "", cost: "", status: "pending", description: "" });
      fetchMaintenance();
    } catch (err) {
      console.error('[SAMaintenance] Error creating maintenance:', err);
      show("Error scheduling maintenance: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  }, [form, show, fetchMaintenance]);

  const handleUpdateStatus = useCallback(async (maintenanceId, newStatus) => {
    try {
      await superAdminAPI.operations.updateMaintenance(maintenanceId, { status: newStatus });
      show("Maintenance status updated!");
      fetchMaintenance();
    } catch (err) {
      console.error('[SAMaintenance] Error updating maintenance:', err);
      show("Error updating maintenance: " + (err.response?.data?.message || err.message));
    }
  }, [show, fetchMaintenance]);

  const handleDeleteMaintenance = useCallback(async (maintenanceId) => {
    try {
      await superAdminAPI.operations.deleteMaintenance(maintenanceId);
      show("Maintenance record deleted!");
      fetchMaintenance();
    } catch (err) {
      console.error('[SAMaintenance] Error deleting maintenance:', err);
      show("Error deleting maintenance: " + (err.response?.data?.message || err.message));
    }
  }, [show, fetchMaintenance]);

  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaWrench style={{ marginRight: 8 }} />Maintenance</h2>
        <button className="btn btn-primary sa-btn-sm" onClick={() => setShowModal(true)} disabled={loading}><FaPlus style={{ marginRight: 6 }} />Schedule Maintenance</button>
      </div>
      {loading && <LoadingState />}
      {error && <div className="sa-error" style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "12px" }}>Error: {error}</div>}
      {!loading && !error && (
        <>
          <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
            <KpiCard icon={<FaCheckCircle />} label="Completed" value={maintenanceData.filter(m => m.status === "completed").length} color="#22c55e" />
            <KpiCard icon={<FaSync />} label="In Progress" value={maintenanceData.filter(m => m.status === "in-progress").length} color="#f97316" />
            <KpiCard icon={<FaExclamationCircle />} label="Pending" value={maintenanceData.filter(m => m.status === "pending").length} color="#ef4444" />
          </div>
          <div className="sa-card">
            <div className="sa-card-head"><h3>Maintenance Log</h3></div>
            {maintenanceData.length === 0 ? <EmptyState title="No maintenance records" desc="Schedule your first maintenance to get started" /> : (
              <table className="sa-table">
                <thead><tr><th>Equipment</th><th>Type</th><th>Technician</th><th>Date</th><th>Cost</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {maintenanceData.map(m => (
                    <tr key={m._id}>
                      <td><strong>{m.equipment_id || 'N/A'}</strong></td>
                      <td><SABadge s={(m.type || 'general').toLowerCase()} /></td>
                      <td>{m.technician_name || 'N/A'}</td>
                      <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{m.scheduled_date ? new Date(m.scheduled_date).toLocaleDateString() : 'N/A'}</td>
                      <td style={{ fontWeight: 700 }}>{m.cost ? `₹${m.cost}` : 'N/A'}</td>
                      <td><SABadge s={m.status || 'pending'} /></td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="sa-link-btn" onClick={() => handleUpdateStatus(m._id, m.status === 'completed' ? 'pending' : 'completed')}><FaEdit /></button>
                          <button className="sa-link-btn" style={{ color: "#ef4444" }} onClick={() => handleDeleteMaintenance(m._id)}><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
      {showModal && (
        <SAModal title="Schedule Maintenance" onClose={() => setShowModal(false)}>
          <div className="sa-form-group"><label>Equipment ID</label><input className="sa-input" value={form.equipmentId} onChange={e => setForm(f => ({ ...f, equipmentId: e.target.value }))} placeholder="Equipment ID (MongoDB ObjectId)" /></div>
          <div className="sa-form-group"><label>Type</label>
            <select className="sa-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="">Select Type</option>
              <option value="routine">Routine</option>
              <option value="repair">Repair</option>
              <option value="emergency">Emergency</option>
              <option value="inspection">Inspection</option>
            </select>
          </div>
          <div className="sa-form-group"><label>Technician Name</label><input className="sa-input" value={form.technician_name} onChange={e => setForm(f => ({ ...f, technician_name: e.target.value }))} placeholder="Technician name" /></div>
          <div className="sa-form-group"><label>Scheduled Date</label><input className="sa-input" type="date" value={form.scheduled_date} onChange={e => setForm(f => ({ ...f, scheduled_date: e.target.value }))} /></div>
          <div className="sa-form-group"><label>Cost</label><input className="sa-input" type="number" value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value }))} placeholder="Cost in rupees" /></div>
          <div className="sa-form-group"><label>Description</label><textarea className="sa-input" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Maintenance description" /></div>
          <div className="sa-form-group"><label>Status</label>
            <select className="sa-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="btn btn-primary sa-btn-sm" onClick={handleCreateMaintenance} disabled={isSubmitting}>{isSubmitting ? "Scheduling..." : "Schedule"}</button>
            <button className="btn btn-outline sa-btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </SAModal>
      )}
    </div>
  );
}

// ─── INTEGRATIONS: API SETTINGS ───────────────────────────────────────────────
function SAApiSettings() {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testingId, setTestingId] = useState(null);
  const { toast, show } = useToast();

  // Fetch integrations from backend
  const fetchIntegrations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminAPI.integrations.getIntegrations();
      console.log('[SAApiSettings] Response:', response);
      const integrationsArray = response?.data?.integrations || [];
      setIntegrations(Array.isArray(integrationsArray) ? integrationsArray : []);
    } catch (err) {
      console.error('[SAApiSettings] Error fetching integrations:', err);
      setError(err.message);
      setIntegrations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  const handleToggle = useCallback(async (id) => {
    try {
      await superAdminAPI.integrations.toggleIntegration(id);
      const integration = integrations.find(i => i._id === id);
      show(`${integration.name} ${integration.enabled ? "disabled" : "enabled"}`);
      fetchIntegrations();
    } catch (err) {
      console.error('[SAApiSettings] Error toggling integration:', err);
      show("Error toggling integration: " + (err.response?.data?.message || err.message));
    }
  }, [integrations, show, fetchIntegrations]);

  const handleTestConnection = useCallback(async (id) => {
    try {
      setTestingId(id);
      await superAdminAPI.integrations.testIntegrationConnection(id);
      show("Connection test successful!");
      fetchIntegrations();
    } catch (err) {
      console.error('[SAApiSettings] Error testing connection:', err);
      show("Connection test failed: " + (err.response?.data?.message || err.message));
    } finally {
      setTestingId(null);
    }
  }, [show, fetchIntegrations]);

  const handleRefreshKeys = useCallback(async () => {
    try {
      show("API keys refreshed!");
      fetchIntegrations();
    } catch (err) {
      console.error('[SAApiSettings] Error refreshing keys:', err);
      show("Error refreshing keys");
    }
  }, [show, fetchIntegrations]);

  const categories = [...new Set(integrations.map(i => i.category))];

  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaPlug style={{ marginRight: 8 }} />API Settings</h2>
        <button className="btn btn-outline sa-btn-sm" onClick={handleRefreshKeys} disabled={loading}><FaSync style={{ marginRight: 6 }} />Refresh Keys</button>
      </div>
      {loading && <LoadingState />}
      {error && <div className="sa-error" style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "12px" }}>Error: {error}</div>}
      {!loading && !error && (
        <>
          {categories.length === 0 ? (
            <EmptyState title="No integrations found" desc="No API integrations configured yet" />
          ) : (
            categories.map(cat => (
              <div className="sa-card" key={cat}>
                <div className="sa-card-head"><h3>{cat} Services</h3></div>
                {integrations.filter(i => i.category === cat).map(i => (
                  <div key={i._id} className="sa-integration-row">
                    <div className="sa-integration-icon">{i.icon}</div>
                    <div className="sa-integration-info">
                      <strong>{i.name}</strong>
                      <span>{i.description}</span>
                      <small style={{ color: i.connectionStatus === 'connected' ? '#22c55e' : '#ef4444', marginTop: 4, display: 'block' }}>
                        Status: {i.connectionStatus}
                      </small>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button 
                        className="btn btn-outline sa-btn-sm" 
                        onClick={() => handleTestConnection(i._id)}
                        disabled={testingId === i._id}
                        style={{ padding: "5px 10px", fontSize: ".75rem" }}
                      >
                        {testingId === i._id ? "Testing..." : "Test"}
                      </button>
                      <SABadge s={i.enabled ? "enabled" : "disabled"} />
                      <div 
                        className={`sa-toggle ${i.enabled ? "sa-toggle-on" : ""}`} 
                        onClick={() => handleToggle(i._id)} 
                        style={{ cursor: "pointer" }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

// ─── INTEGRATIONS: THIRD-PARTY APPS ──────────────────────────────────────────
function SAThirdParty() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [installingId, setInstallingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Payment", description: "", icon: "🔌", apiKey: "", apiSecret: "" });
  const { toast, show } = useToast();

  // Fetch available apps from backend
  const fetchApps = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminAPI.integrations.getAvailableApps();
      console.log('[SAThirdParty] Response:', response);
      const appsArray = response?.data?.apps || [];
      setApps(Array.isArray(appsArray) ? appsArray : []);
    } catch (err) {
      console.error('[SAThirdParty] Error fetching apps:', err);
      setError(err.message);
      setApps([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const handleInstallApp = useCallback(async (id) => {
    try {
      setInstallingId(id);
      await superAdminAPI.integrations.installApp(id);
      const app = apps.find(a => a.id === id);
      show(`${app.name} installed successfully!`);
      fetchApps();
    } catch (err) {
      console.error('[SAThirdParty] Error installing app:', err);
      show("Error installing app: " + (err.response?.data?.message || err.message));
    } finally {
      setInstallingId(null);
    }
  }, [apps, show, fetchApps]);

  const handleUninstallApp = useCallback(async (id) => {
    try {
      setInstallingId(id);
      await superAdminAPI.integrations.uninstallApp(id);
      const app = apps.find(a => a.id === id);
      show(`${app.name} uninstalled successfully!`);
      fetchApps();
    } catch (err) {
      console.error('[SAThirdParty] Error uninstalling app:', err);
      show("Error uninstalling app: " + (err.response?.data?.message || err.message));
    } finally {
      setInstallingId(null);
    }
  }, [apps, show, fetchApps]);

  const handleCreateIntegration = useCallback(async () => {
    try {
      if (!form.name || !form.category) {
        show("Please fill in all required fields");
        return;
      }
      setIsSubmitting(true);
      await superAdminAPI.integrations.createIntegration({
        name: form.name,
        category: form.category,
        description: form.description,
        icon: form.icon,
        apiKey: form.apiKey,
        apiSecret: form.apiSecret,
      });
      show("Integration created successfully!");
      setShowModal(false);
      setForm({ name: "", category: "Payment", description: "", icon: "🔌", apiKey: "", apiSecret: "" });
      fetchApps();
    } catch (err) {
      console.error('[SAThirdParty] Error creating integration:', err);
      show("Error creating integration: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  }, [form, show, fetchApps]);

  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaBoxOpen style={{ marginRight: 8 }} />Third-party Apps</h2>
        <button className="btn btn-primary sa-btn-sm" onClick={() => setShowModal(true)} disabled={loading}><FaPlus style={{ marginRight: 6 }} />Add Integration</button>
      </div>
      {loading && <LoadingState />}
      {error && <div className="sa-error" style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "12px" }}>Error: {error}</div>}
      {!loading && !error && (
        <div className="sa-integrations-grid">
          {apps.length === 0 ? (
            <EmptyState title="No apps available" desc="No third-party apps configured yet" />
          ) : (
            apps.map(app => (
              <div className="sa-card sa-integration-card" key={app.id}>
                <div className="sa-integration-card-icon">{app.icon}</div>
                <h4>{app.name}</h4>
                <span className="sa-integration-cat">{app.category}</span>
                <p>{app.description}</p>
                {app.permissions && app.permissions.length > 0 && (
                  <div style={{ fontSize: ".75rem", color: "var(--text-secondary)", marginTop: 8, marginBottom: 8 }}>
                    <strong>Permissions:</strong> {app.permissions.join(", ")}
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                  <SABadge s={app.installed ? "enabled" : "disabled"} />
                  <button 
                    className={`sa-btn-sm ${app.installed ? "btn btn-outline" : "btn btn-primary"}`} 
                    style={{ padding: "5px 12px", fontSize: ".78rem" }} 
                    onClick={() => app.installed ? handleUninstallApp(app.id) : handleInstallApp(app.id)}
                    disabled={installingId === app.id}
                  >
                    {installingId === app.id ? (app.installed ? "Uninstalling..." : "Installing...") : (app.installed ? "Uninstall" : "Install")}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {showModal && (
        <SAModal title="Add Integration" onClose={() => setShowModal(false)}>
          <div className="sa-form-group"><label>Integration Name *</label><input className="sa-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Razorpay" /></div>
          <div className="sa-form-group"><label>Category *</label>
            <select className="sa-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              <option value="Payment">Payment</option>
              <option value="SMS">SMS</option>
              <option value="Email">Email</option>
              <option value="Analytics">Analytics</option>
              <option value="Video">Video</option>
              <option value="Comms">Comms</option>
              <option value="Storage">Storage</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="sa-form-group"><label>Description</label><input className="sa-input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description" /></div>
          <div className="sa-form-group"><label>Icon</label><input className="sa-input" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="e.g. 💳" /></div>
          <div className="sa-form-group"><label>API Key</label><input className="sa-input" type="password" value={form.apiKey} onChange={e => setForm(f => ({ ...f, apiKey: e.target.value }))} placeholder="API key" /></div>
          <div className="sa-form-group"><label>API Secret</label><input className="sa-input" type="password" value={form.apiSecret} onChange={e => setForm(f => ({ ...f, apiSecret: e.target.value }))} placeholder="API secret" /></div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="btn btn-primary sa-btn-sm" onClick={handleCreateIntegration} disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Integration"}</button>
            <button className="btn btn-outline sa-btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </SAModal>
      )}
    </div>
  );
}

// ─── DATA CENTER ──────────────────────────────────────────────────────────────
function SAImportData() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [importType, setImportType] = useState("members");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importHistory, setImportHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const { toast, show } = useToast();

  // Fetch import history
  const fetchImportHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminAPI.dataManagement.getImportHistory();
      console.log('[SAImportData] History Response:', response);
      const historyArray = response?.data?.imports || [];
      setImportHistory(Array.isArray(historyArray) ? historyArray : []);
    } catch (err) {
      console.error('[SAImportData] Error fetching import history:', err);
      setError(err.message);
      setImportHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImportHistory();
  }, [fetchImportHistory]);

  // Validate file
  const validateFile = (file) => {
    const errors = [];
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/json'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type)) {
      errors.push('Invalid file type. Please upload CSV, Excel, or JSON files.');
    }
    
    if (file.size > maxSize) {
      errors.push('File size exceeds 10MB limit.');
    }
    
    if (file.name.length > 100) {
      errors.push('File name is too long (max 100 characters).');
    }
    
    return errors;
  };

  const handleImport = useCallback(async () => {
    if (!file) {
      show("Please select a file");
      return;
    }

    // Validate file
    const errors = validateFile(file);
    if (errors.length > 0) {
      setValidationErrors(errors);
      show("File validation failed. Please check the errors.");
      return;
    }
    setValidationErrors([]);

    try {
      setUploading(true);
      setUploadProgress(0);
      await superAdminAPI.dataManagement.importData(file, importType, (progress) => {
        setUploadProgress(progress);
      });
      show(`${file.name} imported successfully!`);
      setFile(null);
      setUploadProgress(0);
      fetchImportHistory();
    } catch (err) {
      console.error('[SAImportData] Error importing data:', err);
      show("Error importing data: " + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  }, [file, importType, show, fetchImportHistory]);

  const handleDownloadTemplate = useCallback(async () => {
    try {
      setDownloadingTemplate(true);
      const response = await superAdminAPI.dataManagement.exportData(`${importType}_template`, 'csv');
      
      // Create blob and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${importType}_template.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      show("Template downloaded successfully!");
    } catch (err) {
      console.error('[SAImportData] Error downloading template:', err);
      show("Error downloading template: " + (err.response?.data?.message || err.message));
    } finally {
      setDownloadingTemplate(false);
    }
  }, [importType, show]);

  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head"><h2><FaCloudUploadAlt style={{ marginRight: 8 }} />Import Data</h2></div>
      <div className="sa-card">
        <div className="sa-card-head"><h3>Upload CSV / Excel File</h3></div>
        <div
          className={`sa-dropzone ${dragging ? "sa-dropzone-active" : ""}`}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { 
            e.preventDefault(); 
            setDragging(false); 
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile) {
              const errors = validateFile(droppedFile);
              if (errors.length > 0) {
                setValidationErrors(errors);
                show("File validation failed. Please check the errors.");
              } else {
                setFile(droppedFile);
                setValidationErrors([]);
                show("File validated and ready to import!");
              }
            }
          }}
        >
          <FaCloudUploadAlt style={{ fontSize: "2.5rem", color: "var(--accent)", marginBottom: 12 }} />
          <p>Drag & drop your CSV file here</p>
          <span>or</span>
          <label className="btn btn-outline sa-btn-sm" style={{ marginTop: 8, cursor: "pointer" }}>
            Browse File <input type="file" accept=".csv,.xlsx,.json" style={{ display: "none" }} onChange={e => {
              const selectedFile = e.target.files[0];
              if (selectedFile) {
                const errors = validateFile(selectedFile);
                if (errors.length > 0) {
                  setValidationErrors(errors);
                  show("File validation failed. Please check the errors.");
                } else {
                  setFile(selectedFile);
                  setValidationErrors([]);
                  show("File selected and validated!");
                }
              }
            }} />
          </label>
          {file && <p style={{ marginTop: 12, color: "#22c55e", fontWeight: 600 }}>✓ {file.name}</p>}
          {uploading && uploadProgress > 0 && (
            <div style={{ marginTop: 12, width: "100%" }}>
              <div style={{ background: "#e5e7eb", borderRadius: "4px", height: "8px", overflow: "hidden" }}>
                <div style={{ background: "#22c55e", height: "100%", width: `${uploadProgress}%`, transition: "width 0.3s" }} />
              </div>
              <small style={{ color: "var(--text-secondary)", marginTop: 4, display: "block" }}>{uploadProgress}% uploaded</small>
            </div>
          )}
        </div>
        <div className="sa-form-group" style={{ marginTop: 16 }}><label>Import Type</label>
          <select className="sa-input" value={importType} onChange={e => setImportType(e.target.value)}>
            <option value="members">Members</option>
            <option value="transactions">Transactions</option>
            <option value="equipment">Equipment</option>
            <option value="attendance">Attendance</option>
            <option value="trainers">Trainers</option>
            <option value="branches">Branches</option>
          </select>
        </div>
        {validationErrors.length > 0 && (
          <div style={{ marginTop: 12, padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px" }}>
            <strong>Validation Errors:</strong>
            <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px" }}>
              {validationErrors.map((error, i) => (
                <li key={i} style={{ fontSize: ".8rem" }}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button className="btn btn-primary sa-btn-sm" onClick={handleImport} disabled={!file || uploading}>{uploading ? `Importing (${uploadProgress}%)...` : "Start Import"}</button>
          <button className="btn btn-outline sa-btn-sm" onClick={handleDownloadTemplate} disabled={downloadingTemplate}>
            {downloadingTemplate ? "Downloading..." : "Download Template"}
          </button>
        </div>
      </div>
      <div className="sa-card">
        <div className="sa-card-head"><h3>Recent Imports</h3></div>
        {loading && <LoadingState />}
        {error && <div className="sa-error" style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "12px" }}>Error: {error}</div>}
        {!loading && !error && (
          <table className="sa-table">
            <thead><tr><th>File</th><th>Type</th><th>Records</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {importHistory.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: "center", color: "var(--text-secondary)" }}>No imports yet</td></tr>
              ) : (
                importHistory.map((r, i) => (
                  <tr key={i}>
                    <td><strong>{r.fileName || r.file}</strong></td>
                    <td><SABadge s={(r.importType || r.type || "").toLowerCase()} /></td>
                    <td>{(r.recordsImported || r.records || 0).toLocaleString()}</td>
                    <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{new Date(r.createdAt || r.date).toLocaleDateString()}</td>
                    <td><SABadge s={r.status || "completed"} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function SAExportData() {
  const [exportOptions, setExportOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(null);
  const [exportHistory, setExportHistory] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const [scheduledExports, setScheduledExports] = useState([]);
  const { toast, show } = useToast();

  // Fetch export options
  const fetchExportOptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminAPI.dataManagement.getExportOptions();
      console.log('[SAExportData] Options Response:', response);
      const optionsArray = response?.data?.options || [
        { name: "All Members", desc: "Full member list with details", icon: <FaUsers />, color: "#3b82f6", type: "members" },
        { name: "Transactions", desc: "Payment history & logs", icon: <FaCreditCard />, color: "#22c55e", type: "transactions" },
        { name: "Revenue Report", desc: "Monthly revenue breakdown", icon: <FaMoneyBillWave />, color: "#f97316", type: "revenue" },
        { name: "Equipment List", desc: "All equipment with status", icon: <FaTools />, color: "#8b5cf6", type: "equipment" },
        { name: "Audit Logs", desc: "System activity history", icon: <FaShieldAlt />, color: "#ef4444", type: "audit" },
        { name: "Attendance Data", desc: "Check-in/check-out records", icon: <FaCalendarAlt />, color: "#06b6d4", type: "attendance" },
        { name: "Trainers", desc: "Trainer profiles and assignments", icon: <FaUserTie />, color: "#10b981", type: "trainers" },
        { name: "Branches", desc: "Branch information and statistics", icon: <FaBuilding />, color: "#f59e0b", type: "branches" },
      ];
      setExportOptions(Array.isArray(optionsArray) ? optionsArray : []);
    } catch (err) {
      console.error('[SAExportData] Error fetching export options:', err);
      setError(err.message);
      setExportOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch export history
  const fetchExportHistory = useCallback(async () => {
    try {
      const response = await superAdminAPI.dataManagement.getExportHistory();
      const historyArray = response?.data?.exports || [];
      setExportHistory(Array.isArray(historyArray) ? historyArray : []);
    } catch (err) {
      console.error('[SAExportData] Error fetching export history:', err);
      setExportHistory([]);
    }
  }, []);

  useEffect(() => {
    fetchExportOptions();
    fetchExportHistory();
  }, [fetchExportOptions, fetchExportHistory]);

  const handleExport = useCallback(async (exportType, format) => {
    try {
      setExporting(`${exportType}-${format}`);
      const response = await superAdminAPI.dataManagement.exportData(exportType, format, filters);
      
      // Create blob and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${exportType}_${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      show(`${exportType} exported as ${format.toUpperCase()}!`);
      fetchExportHistory(); // Refresh export history
    } catch (err) {
      console.error('[SAExportData] Error exporting data:', err);
      show("Error exporting data: " + (err.response?.data?.message || err.message));
    } finally {
      setExporting(null);
    }
  }, [filters, show, fetchExportHistory]);

  const handleScheduleExport = useCallback(async (exportType, schedule) => {
    try {
      // This would call a scheduled export API endpoint
      show(`Scheduled ${exportType} export: ${schedule}`);
    } catch (err) {
      console.error('[SAExportData] Error scheduling export:', err);
      show("Error scheduling export: " + (err.response?.data?.message || err.message));
    }
  }, [show]);

  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaCloudDownloadAlt style={{ marginRight: 8 }} />Export Data</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-outline sa-btn-sm" onClick={() => setShowFilters(!showFilters)}>
            <FaFilter style={{ marginRight: 6 }} />{showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          <button className="btn btn-outline sa-btn-sm" onClick={() => show("Scheduled exports coming soon!")}>
            <FaClock style={{ marginRight: 6 }} />Scheduled Exports
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="sa-card" style={{ marginBottom: 16 }}>
          <div className="sa-card-head"><h3>Export Filters</h3></div>
          <div className="sa-form-row" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            <div className="sa-form-group">
              <label>Date Range</label>
              <select className="sa-input" value={filters.dateRange || ""} onChange={e => setFilters({...filters, dateRange: e.target.value})}>
                <option value="">All Time</option>
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="last90days">Last 90 Days</option>
                <option value="thisyear">This Year</option>
              </select>
            </div>
            <div className="sa-form-group">
              <label>Status</label>
              <select className="sa-input" value={filters.status || ""} onChange={e => setFilters({...filters, status: e.target.value})}>
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="sa-form-group">
              <label>Format</label>
              <select className="sa-input" value={filters.format || ""} onChange={e => setFilters({...filters, format: e.target.value})}>
                <option value="">All Formats</option>
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
                <option value="json">JSON</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      {loading && <LoadingState />}
      {error && <div className="sa-error" style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "12px" }}>Error: {error}</div>}
      {!loading && !error && (
        <>
          <div className="sa-export-grid">
            {exportOptions.length === 0 ? (
              <EmptyState title="No export options available" desc="No data available for export" />
            ) : (
              exportOptions.map((e, i) => (
                <div className="sa-card sa-export-card" key={i}>
                  <div className="sa-export-icon" style={{ background: e.color + "22", color: e.color }}>{e.icon}</div>
                  <h4>{e.name}</h4>
                  <p>{e.desc}</p>
                  <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
                    <button 
                      className="btn btn-outline sa-btn-sm" 
                      onClick={() => handleExport(e.type || e.name.toLowerCase(), 'csv')}
                      disabled={exporting === `${e.type || e.name.toLowerCase()}-csv`}
                    >
                      <FaDownload style={{ marginRight: 4 }} />{exporting === `${e.type || e.name.toLowerCase()}-csv` ? "Exporting..." : "CSV"}
                    </button>
                    <button 
                      className="btn btn-outline sa-btn-sm" 
                      onClick={() => handleExport(e.type || e.name.toLowerCase(), 'excel')}
                      disabled={exporting === `${e.type || e.name.toLowerCase()}-excel`}
                    >
                      <FaDownload style={{ marginRight: 4 }} />{exporting === `${e.type || e.name.toLowerCase()}-excel` ? "Exporting..." : "Excel"}
                    </button>
                    <button 
                      className="btn btn-outline sa-btn-sm" 
                      onClick={() => handleExport(e.type || e.name.toLowerCase(), 'json')}
                      disabled={exporting === `${e.type || e.name.toLowerCase()}-json`}
                    >
                      <FaDownload style={{ marginRight: 4 }} />{exporting === `${e.type || e.name.toLowerCase()}-json` ? "Exporting..." : "JSON"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {exportHistory.length > 0 && (
            <div className="sa-card" style={{ marginTop: 24 }}>
              <div className="sa-card-head"><h3>Recent Exports</h3></div>
              <table className="sa-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Format</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Size</th>
                  </tr>
                </thead>
                <tbody>
                 {exportHistory.slice(0, 5).map((item, i) => (
  <tr key={i}>
    <td><strong>{item.type}</strong></td>
    <td><SABadge s={item.format} /></td>
    <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>
      {new Date(item.createdAt).toLocaleDateString()}
    </td>
    <td><SABadge s={item.status || "completed"} /></td>
    <td>{item.size || "N/A"}</td>
  </tr>
))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SABackups() {
  const { toast, show } = useToast();
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [restoringBackup, setRestoringBackup] = useState(null);
  const [deletingBackup, setDeletingBackup] = useState(null);
  const [backupSchedule, setBackupSchedule] = useState({
    dailyEnabled: true,
    weeklyEnabled: true,
    cloudSyncEnabled: true
  });
  const [stats, setStats] = useState({
    lastBackup: null,
    totalBackups: 0,
    successRate: 0
  });

  // Fetch backups
  const fetchBackups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminAPI.dataManagement.getBackups();
      const backupsArray = response?.data?.backups || [];
      setBackups(Array.isArray(backupsArray) ? backupsArray : []);
      
      // Calculate stats
      const totalBackups = backupsArray.length;
      const completedBackups = backupsArray.filter(b => b.status === 'completed').length;
      const successRate = totalBackups > 0 ? Math.round((completedBackups / totalBackups) * 100) : 0;
      const lastBackup = backupsArray.length > 0 ? backupsArray[0] : null;
      
      setStats({
        lastBackup: lastBackup ? new Date(lastBackup.createdAt).toLocaleString() : 'No backups yet',
        totalBackups,
        successRate
      });
    } catch (err) {
      console.error('[SABackups] Error fetching backups:', err);
      setError(err.message);
      setBackups([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch backup schedule
  const fetchBackupSchedule = useCallback(async () => {
    try {
      const response = await superAdminAPI.dataManagement.getBackupSchedule();
      const schedule = response?.data?.schedule || {
        dailyEnabled: true,
        weeklyEnabled: true,
        cloudSyncEnabled: true
      };
      setBackupSchedule(schedule);
    } catch (err) {
      console.error('[SABackups] Error fetching backup schedule:', err);
      // Keep default values on error
    }
  }, []);

  useEffect(() => {
    fetchBackups();
    fetchBackupSchedule();
  }, [fetchBackups, fetchBackupSchedule]);

  // Create backup
  const handleCreateBackup = useCallback(async () => {
    try {
      setCreatingBackup(true);
      const response = await superAdminAPI.dataManagement.createBackup({
        type: 'manual',
        description: 'Manual backup created from SuperAdmin Dashboard'
      });
      show('Manual backup created successfully!');
      fetchBackups(); // Refresh backups list
    } catch (err) {
      console.error('[SABackups] Error creating backup:', err);
      show('Error creating backup: ' + (err.response?.data?.message || err.message));
    } finally {
      setCreatingBackup(false);
    }
  }, [show, fetchBackups]);

  // Restore backup
  const handleRestoreBackup = useCallback(async (backupId) => {
    if (!window.confirm('Are you sure you want to restore this backup? This action cannot be undone.')) {
      return;
    }
    
    try {
      setRestoringBackup(backupId);
      await superAdminAPI.dataManagement.restoreBackup(backupId);
      show('Backup restoration initiated successfully!');
    } catch (err) {
      console.error('[SABackups] Error restoring backup:', err);
      show('Error restoring backup: ' + (err.response?.data?.message || err.message));
    } finally {
      setRestoringBackup(null);
    }
  }, [show]);

  // Delete backup
  const handleDeleteBackup = useCallback(async (backupId) => {
    if (!window.confirm('Are you sure you want to delete this backup? This action cannot be undone.')) {
      return;
    }
    
    try {
      setDeletingBackup(backupId);
      await superAdminAPI.dataManagement.deleteBackup(backupId);
      show('Backup deleted successfully!');
      fetchBackups(); // Refresh backups list
    } catch (err) {
      console.error('[SABackups] Error deleting backup:', err);
      show('Error deleting backup: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeletingBackup(null);
    }
  }, [show, fetchBackups]);

  // Download backup
  const handleDownloadBackup = useCallback(async (backupId, backupName) => {
    try {
      const response = await superAdminAPI.dataManagement.downloadBackup(backupId);
      
      // Create blob and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${backupName}.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      show('Backup downloaded successfully!');
    } catch (err) {
      console.error('[SABackups] Error downloading backup:', err);
      show('Error downloading backup: ' + (err.response?.data?.message || err.message));
    }
  }, [show]);

  // Update backup schedule
  const handleUpdateSchedule = useCallback(async (scheduleType) => {
    try {
      const newSchedule = {
        ...backupSchedule,
        [scheduleType]: !backupSchedule[scheduleType]
      };
      await superAdminAPI.dataManagement.updateBackupSchedule(newSchedule);
      setBackupSchedule(newSchedule);
      show(`${scheduleType.replace('Enabled', '')} backup schedule updated!`);
    } catch (err) {
      console.error('[SABackups] Error updating backup schedule:', err);
      show('Error updating backup schedule: ' + (err.response?.data?.message || err.message));
    }
  }, [backupSchedule, show]);

  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaDatabase style={{ marginRight: 8 }} />Backups</h2>
        <button className="btn btn-primary sa-btn-sm" onClick={handleCreateBackup} disabled={creatingBackup}>
          {creatingBackup ? 'Creating...' : <><FaPlus style={{ marginRight: 6 }} />Create Backup</>}
        </button>
      </div>
      
      <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <KpiCard icon={<FaDatabase />} label="Last Backup" value={stats.lastBackup} color="#22c55e" change={backups[0]?.size || "N/A"} />
        <KpiCard icon={<FaServer />} label="Total Backups" value={stats.totalBackups} color="#3b82f6" change="Last 30 days" />
        <KpiCard icon={<FaCheckCircle />} label="Success Rate" value={`${stats.successRate}%`} color="#22c55e" />
      </div>
      
      {loading && <LoadingState />}
      {error && <div className="sa-error" style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "12px" }}>Error: {error}</div>}
      
      {!loading && !error && (
        <div className="sa-two-col">
          <div className="sa-card">
            <div className="sa-card-head"><h3>Backup Actions</h3></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button className="btn btn-primary sa-btn-sm" onClick={handleCreateBackup} disabled={creatingBackup}>
                <FaDatabase style={{ marginRight: 8 }} />{creatingBackup ? 'Creating Backup...' : 'Create Manual Backup'}
              </button>
              <button className="btn btn-outline sa-btn-sm" onClick={() => show('Restore wizard coming soon!')}>
                <FaSync style={{ marginRight: 8 }} />Restore from Backup
              </button>
              <button className="btn btn-outline sa-btn-sm" onClick={() => backups.length > 0 && handleDownloadBackup(backups[0].id, backups[0].name)} disabled={backups.length === 0}>
                <FaDownload style={{ marginRight: 8 }} />Download Latest
              </button>
            </div>
            <div className="sa-toggle-row" style={{ marginTop: 16 }}>
              <span>Auto Daily Backup</span>
              <div 
                className={`sa-toggle ${backupSchedule.dailyEnabled ? "sa-toggle-on" : ""}`} 
                onClick={() => handleUpdateSchedule('dailyEnabled')}
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className="sa-toggle-row">
              <span>Weekly Full Backup</span>
              <div 
                className={`sa-toggle ${backupSchedule.weeklyEnabled ? "sa-toggle-on" : ""}`} 
                onClick={() => handleUpdateSchedule('weeklyEnabled')}
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className="sa-toggle-row">
              <span>Cloud Sync (AWS S3)</span>
              <div 
                className={`sa-toggle ${backupSchedule.cloudSyncEnabled ? "sa-toggle-on" : ""}`} 
                onClick={() => handleUpdateSchedule('cloudSyncEnabled')}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
          <div className="sa-card">
            <div className="sa-card-head"><h3>Backup History</h3></div>
            {backups.length === 0 ? (
              <div style={{ textAlign: "center", color: "var(--text-secondary)", padding: "40px 0" }}>
                <FaDatabase style={{ fontSize: "3rem", marginBottom: 16, opacity: 0.5 }} />
                <p>No backups available</p>
                <p style={{ fontSize: "0.9rem" }}>Create your first backup to get started</p>
              </div>
            ) : (
              backups.map((backup, i) => (
                <div key={backup.id || i} className="sa-backup-row">
                  <div>
                    <strong>{backup.name}</strong>
                    <span>{new Date(backup.createdAt).toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: ".75rem", color: "var(--text-secondary)" }}>{backup.size || 'N/A'}</span>
                    <SABadge s={backup.type || 'auto'} />
                    <SABadge s={backup.status || 'completed'} />
                    <button 
                      className="sa-link-btn" 
                      onClick={() => handleDownloadBackup(backup.id, backup.name)}
                      title="Download backup"
                    >
                      <FaDownload />
                    </button>
                    <button 
                      className="sa-link-btn" 
                      onClick={() => handleRestoreBackup(backup.id)}
                      disabled={restoringBackup === backup.id}
                      title="Restore backup"
                      style={{ color: restoringBackup === backup.id ? "#6b7280" : "#f59e0b" }}
                    >
                      {restoringBackup === backup.id ? <FaSpinner style={{ animation: "spin 1s linear infinite" }} /> : <FaSync />}
                    </button>
                    <button 
                      className="sa-link-btn" 
                      onClick={() => handleDeleteBackup(backup.id)}
                      disabled={deletingBackup === backup.id}
                      title="Delete backup"
                      style={{ color: deletingBackup === backup.id ? "#6b7280" : "#ef4444" }}
                    >
                      {deletingBackup === backup.id ? <FaSpinner style={{ animation: "spin 1s linear infinite" }} /> : <FaTrash />}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ADVANCED: AI INSIGHTS ────────────────────────────────────────────────────
function SAAIInsights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { toast, show } = useToast();
  const typeColor = { revenue: "#22c55e", churn: "#ef4444", equipment: "#f97316", growth: "#3b82f6", finance: "#8b5cf6", engagement: "#ec4899", retention: "#10b981" };

  // Fetch AI insights
  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminAPI.advanced.getAllAIInsights();
      console.log('[SAAIInsights] Response:', response);
      const insightsArray = response?.insights || [];
      setInsights(Array.isArray(insightsArray) ? insightsArray : []);
    } catch (err) {
      console.error('[SAAIInsights] Error fetching insights:', err);
      setError(err.message);
      setInsights([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const handleRefresh = async () => {
    setRefreshing(true);
    show("Refreshing AI analysis...");
    await fetchInsights();
    show("AI insights refreshed successfully");
  };

  const handleAcknowledge = async (insightId) => {
    try {
      await superAdminAPI.advanced.acknowledgeAIInsight(insightId);
      show("Insight acknowledged successfully");
      fetchInsights();
    } catch (err) {
      console.error('[SAAIInsights] Error acknowledging insight:', err);
      show("Error acknowledging insight: " + (err.response?.data?.message || err.message));
    }
  };

  const handleAction = async (insight) => {
    show(`Action: ${insight.action}`);
    // Here you could implement specific actions based on insight type
    if (insight.type === 'revenue') {
      // Navigate to campaigns or billing
    } else if (insight.type === 'churn') {
      // Navigate to member engagement
    } else if (insight.type === 'equipment') {
      // Navigate to equipment maintenance
    }
  };

  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaRobot style={{ marginRight: 8 }} />AI Insights</h2>
        <button 
          className="btn btn-outline sa-btn-sm" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <FaSync style={{ marginRight: 6, animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      <div className="sa-card" style={{ background: "linear-gradient(135deg, rgba(239,68,68,.08), rgba(139,92,246,.08))", border: "1px solid rgba(139,92,246,.2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <FaRobot style={{ fontSize: "1.5rem", color: "#8b5cf6" }} />
          <div>
            <strong style={{ color: "var(--text-primary)" }}>AI Analysis Engine</strong>
            <p style={{ margin: 0, fontSize: ".8rem", color: "var(--text-secondary)" }}>
              Last analyzed: {insights.length > 0 ? new Date(insights[0].createdAt).toLocaleString() : 'Never'} · {insights.length} insights generated
            </p>
          </div>
          <span className="sa-badge sa-green" style={{ marginLeft: "auto" }}>Active</span>
        </div>
      </div>
      {loading && <LoadingState />}
      {error && <div className="sa-error" style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "12px" }}>Error: {error}</div>}
      {!loading && !error && (
        <>
          {insights.length === 0 ? (
            <EmptyState title="No AI insights available" desc="AI insights will appear here as patterns are detected in your data" />
          ) : (
            <div className="sa-ai-grid">
              {insights.map(insight => (
                <div className="sa-card sa-ai-card" key={insight._id} style={{ borderLeft: `3px solid ${typeColor[insight.type] || "#6b7280"}` }}>
                  <div className="sa-ai-card-head">
                    <span className="sa-ai-icon">{insight.icon}</span>
                    <h4>{insight.title}</h4>
                    <SABadge s={insight.status} />
                  </div>
                  <p>{insight.insight}</p>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button 
                      className="btn btn-outline sa-btn-sm" 
                      onClick={() => handleAction(insight)}
                    >
                      {insight.action} →
                    </button>
                    {insight.status === 'active' && (
                      <button 
                        className="btn btn-outline sa-btn-sm" 
                        onClick={() => handleAcknowledge(insight._id)}
                      >
                        Acknowledge
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── ADVANCED: FEATURE FLAGS ──────────────────────────────────────────────────
function SAFeatureFlags({ openForm }) {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast, show } = useToast();

  // Fetch feature flags
  const fetchFlags = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminAPI.advanced.getAllFeatureFlags();
      console.log('[SAFeatureFlags] Response:', response);
      const flagsArray = response?.featureFlags || [];
      setFlags(Array.isArray(flagsArray) ? flagsArray : []);
    } catch (err) {
      console.error('[SAFeatureFlags] Error fetching flags:', err);
      setError(err.message);
      setFlags([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlags();
  }, [fetchFlags]);

  const toggle = async (id) => {
    try {
      const flag = flags.find(f => f._id === id);
      if (!flag) return;

      // Optimistic update
      setFlags(prev => prev.map(f => f._id === id ? { ...f, enabled: !f.enabled } : f));
      
      // Call API
      await superAdminAPI.advanced.toggleFeatureFlag(id);
      show(`${flag.name} ${flag.enabled ? "disabled" : "enabled"}`);
      
      // Refresh data
      fetchFlags();
    } catch (err) {
      console.error('[SAFeatureFlags] Error toggling flag:', err);
      show("Error toggling feature flag: " + (err.response?.data?.message || err.message));
      // Revert optimistic update
      setFlags(prev => prev.map(f => f._id === id ? { ...f, enabled: !f.enabled } : f));
    }
  };
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaFlag style={{ marginRight: 8 }} />Feature Flags</h2>
        <button className="btn btn-primary sa-btn-sm" onClick={() => openForm("addFeatureFlag")}><FaPlus style={{ marginRight: 6 }} />Add Flag</button>
      </div>
      <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <KpiCard icon={<FaToggleOn />} label="Enabled Features" value={flags.filter(f => f.enabled).length} color="#22c55e" />
        <KpiCard icon={<FaToggleOff />} label="Disabled Features" value={flags.filter(f => !f.enabled).length} color="#6b7280" />
        <KpiCard icon={<FaFlag />} label="Total Flags" value={flags.length} color="#3b82f6" />
      </div>
      {loading && <LoadingState />}
      {error && <div className="sa-error" style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "12px" }}>Error: {error}</div>}
      {!loading && !error && (
        <div className="sa-card">
          {flags.length === 0 ? (
            <EmptyState title="No feature flags found" desc="Create your first feature flag to get started" />
          ) : (
            <table className="sa-table">
              <thead><tr><th>Feature</th><th>Key</th><th>Environment</th><th>Description</th><th>Status</th><th>Toggle</th></tr></thead>
              <tbody>
                {flags.map(f => (
                  <tr key={f._id}>
                    <td><strong>{f.name}</strong></td>
                    <td><code style={{ fontSize: ".72rem", color: "var(--accent)" }}>{f.key}</code></td>
                    <td><SABadge s={f.environment} /></td>
                    <td style={{ fontSize: ".8rem", color: "var(--text-secondary)", maxWidth: 220 }}>{f.description}</td>
                    <td><SABadge s={f.enabled ? "enabled" : "disabled"} /></td>
                    <td>
                      <div className={`sa-toggle ${f.enabled ? "sa-toggle-on" : ""}`} onClick={() => toggle(f._id)} style={{ cursor: "pointer" }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

// ─── ADVANCED: LIVE MONITORING ────────────────────────────────────────────────
function SALiveMonitoring() {
  const [monitoringData, setMonitoringData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [tick, setTick] = useState(0);
  const { toast, show } = useToast();

  // Fetch live monitoring data
  const fetchMonitoringData = useCallback(async () => {
    try {
      if (!refreshing) setLoading(true);
      setError(null);
      const response = await superAdminAPI.advanced.getLiveMonitoringData();
      console.log('[SALiveMonitoring] Response:', response);
      const data = response?.monitoringData;
      setMonitoringData(data);
    } catch (err) {
      console.error('[SALiveMonitoring] Error fetching monitoring data:', err);
      setError(err.message);
      setMonitoringData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  useEffect(() => {
    fetchMonitoringData();
  }, [fetchMonitoringData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshing(true);
      fetchMonitoringData();
      setTick(prev => prev + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchMonitoringData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    show("Refreshing monitoring data...");
    await fetchMonitoringData();
    show("Monitoring data refreshed");
  };

  const handleAcknowledgeAlert = async (monitoringId, alertId) => {
    try {
      await superAdminAPI.advanced.acknowledgeMonitoringAlert(monitoringId, alertId);
      show("Alert acknowledged successfully");
      fetchMonitoringData();
    } catch (err) {
      console.error('[SALiveMonitoring] Error acknowledging alert:', err);
      show("Error acknowledging alert: " + (err.response?.data?.message || err.message));
    }
  };

  // Simulate live updates for active users
  const activeNow = monitoringData ? 
    monitoringData.activeUsers + Math.floor(Math.sin(tick) * 5) : 
    0;

  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaSignal style={{ marginRight: 8 }} />Live Monitoring</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", animation: "sa-pulse 1.5s infinite" }} />
          <span style={{ fontSize: ".8rem", color: "#22c55e", fontWeight: 700 }}>LIVE</span>
          <button 
            className="btn btn-outline sa-btn-sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <FaSync style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        </div>
      </div>
      {loading && <LoadingState />}
      {error && <div className="sa-error" style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "12px" }}>Error: {error}</div>}
      {!loading && !error && monitoringData && (
        <>
          <div className="sa-kpi-grid">
            <KpiCard icon={<FaUsers />} label="Active Users Now" value={activeNow} color="#22c55e" change="Real-time" />
            <KpiCard icon={<FaCalendarAlt />} label="Check-ins Today" value={monitoringData.checkInsToday} color="#3b82f6" change="Across all branches" />
            <KpiCard icon={<FaHeartbeat />} label="Peak Hour" value={monitoringData.peakHour} color="#f97316" />
            <KpiCard 
              icon={<FaServer />} 
              label="Server Load" 
              value={`${monitoringData.currentLoad}%`} 
              color={monitoringData.currentLoad > 80 ? "#ef4444" : "#22c55e"} 
              change={monitoringData.currentLoad > 80 ? "High load!" : "Normal"} 
            />
          </div>
          
          {/* Alerts Section */}
          {monitoringData.alerts && monitoringData.alerts.length > 0 && (
            <div className="sa-card" style={{ marginBottom: 16, borderLeft: "4px solid #ef4444" }}>
              <div className="sa-card-head">
                <h3>🚨 Active Alerts</h3>
              </div>
              {monitoringData.alerts.map((alert, index) => (
                <div key={index} style={{ 
                  padding: "8px 12px", 
                  background: alert.severity === 'critical' ? "#fef2f2" : "#fff7ed",
                  borderRadius: "4px",
                  marginBottom: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <strong style={{ color: alert.severity === 'critical' ? "#991b1b" : "#ea580c" }}>
                      {alert.type.replace('_', ' ').toUpperCase()}
                    </strong>
                    <p style={{ margin: "4px 0 0 0", fontSize: ".8rem", color: "var(--text-secondary)" }}>
                      {alert.message}
                    </p>
                  </div>
                  {!alert.acknowledged && (
                    <button 
                      className="btn btn-outline sa-btn-sm"
                      onClick={() => handleAcknowledgeAlert(monitoringData._id, alert._id || index)}
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="sa-card">
            <div className="sa-card-head">
              <h3>Branch Live Status</h3>
              <span style={{ fontSize: ".8rem", color: "var(--text-secondary)" }}>
                Updated: {monitoringData.timestamp ? new Date(monitoringData.timestamp).toLocaleTimeString() : 'Unknown'}
              </span>
            </div>
            {monitoringData.branchLive && monitoringData.branchLive.length > 0 ? (
              monitoringData.branchLive.map((b, i) => (
                <div key={i} className="sa-live-row">
                  <div className="sa-live-dot" />
                  <strong style={{ width: 120 }}>{b.branch}</strong>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".78rem", marginBottom: 4 }}>
                      <span>{b.active} active now</span>
                      <span>{b.checkins} check-ins today</span>
                    </div>
                    <div style={{ background: "var(--bg-primary)", borderRadius: 4, height: 8 }}>
                      <div style={{ 
                        width: `${Math.min((b.active / 80) * 100, 100)}%`, 
                        height: "100%", 
                        background: b.load > 80 ? "#ef4444" : "#22c55e", 
                        borderRadius: 4, 
                        transition: "width .5s" 
                      }} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
                No branch data available
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── SECURITY: AUDIT LOGS ─────────────────────────────────────────────────────
function SAAudit() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const filtered = auditLog.filter(a =>
    (filter === "all" || a.type === filter) &&
    (a.user.toLowerCase().includes(search.toLowerCase()) || a.action.toLowerCase().includes(search.toLowerCase()))
  );
  const typeColor = { create: "#22c55e", update: "#3b82f6", delete: "#ef4444", system: "#8b5cf6" };
  return (
    <div className="sa-section">
      <div className="sa-section-head">
        <h2><FaShieldAlt style={{ marginRight: 8 }} />Audit & Logs</h2>
        <button className="btn btn-outline sa-btn-sm"><FaDownload style={{ marginRight: 6 }} />Export Log</button>
      </div>
      <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <KpiCard icon={<FaShieldAlt />} label="Total Events" value={auditLog.length} color="#3b82f6" />
        <KpiCard icon={<FaPlus />} label="Create Events" value={auditLog.filter(a => a.type === "create").length} color="#22c55e" />
        <KpiCard icon={<FaEdit />} label="Update Events" value={auditLog.filter(a => a.type === "update").length} color="#f97316" />
        <KpiCard icon={<FaTrash />} label="Delete Events" value={auditLog.filter(a => a.type === "delete").length} color="#ef4444" />
      </div>
      <div className="sa-filters">
        <div className="sa-search-wrap"><FaSearch className="sa-search-icon" /><input className="sa-input sa-input-search" placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        {["all", "create", "update", "delete", "system"].map(f => (
          <button key={f} className={`sa-filter-btn ${filter === f ? "sa-filter-active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="sa-card">
        {filtered.length === 0 ? <EmptyState title="No audit events found" /> : (
          <table className="sa-table">
            <thead><tr><th>Time</th><th>User</th><th>Action</th><th>Target</th><th>IP</th><th>Type</th></tr></thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td style={{ fontSize: ".75rem", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{a.time}</td>
                  <td><strong>{a.user}</strong></td>
                  <td>{a.action}</td>
                  <td style={{ color: "var(--text-secondary)", fontSize: ".8rem" }}>{a.target}</td>
                  <td><code style={{ fontSize: ".72rem", color: "var(--accent)" }}>{a.ip}</code></td>
                  <td><span className="sa-badge" style={{ background: (typeColor[a.type] || "#6b7280") + "22", color: typeColor[a.type] || "#6b7280" }}>{a.type}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── SECURITY: LOGIN HISTORY ──────────────────────────────────────────────────
function SALoginHistory() {
  return (
    <div className="sa-section">
      <div className="sa-section-head">
        <h2><FaUserClock style={{ marginRight: 8 }} />Login History</h2>
        <button className="btn btn-outline sa-btn-sm"><FaDownload style={{ marginRight: 6 }} />Export</button>
      </div>
      <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <KpiCard icon={<FaCheckCircle />} label="Successful Logins" value={loginHistory.filter(l => l.status === "success").length} color="#22c55e" />
        <KpiCard icon={<FaTimesCircle />} label="Failed Attempts" value={loginHistory.filter(l => l.status === "failed").length} color="#ef4444" />
        <KpiCard icon={<FaShieldVirus />} label="Blocked" value={loginHistory.filter(l => l.status === "blocked").length} color="#8b5cf6" />
      </div>
      <div className="sa-card">
        <table className="sa-table">
          <thead><tr><th>User</th><th>Role</th><th>Time</th><th>Device</th><th>Location</th><th>Status</th></tr></thead>
          <tbody>
            {loginHistory.map(l => (
              <tr key={l.id}>
                <td><strong>{l.user}</strong></td>
                <td><SABadge s={l.role === "—" ? "gray" : l.role} /></td>
                <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{l.time}</td>
                <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{l.device}</td>
                <td style={{ fontSize: ".78rem" }}><FaMapMarkerAlt style={{ marginRight: 4, color: "var(--text-secondary)" }} />{l.location}</td>
                <td><SABadge s={l.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── SECURITY: SYSTEM LOGS ────────────────────────────────────────────────────
function SASystemLogs() {
  const [filter, setFilter] = useState("all");
  const filtered = systemLogs.filter(l => filter === "all" || l.level === filter);
  const levelIcon = { error: <FaTimesCircle />, warning: <FaExclamationTriangle />, info: <FaInfoCircle /> };
  const levelColor = { error: "#ef4444", warning: "#f97316", info: "#3b82f6" };
  return (
    <div className="sa-section">
      <div className="sa-section-head">
        <h2><FaExclamationTriangle style={{ marginRight: 8 }} />System Logs</h2>
        <button className="btn btn-outline sa-btn-sm"><FaDownload style={{ marginRight: 6 }} />Export Logs</button>
      </div>
      <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <KpiCard icon={<FaTimesCircle />} label="Errors" value={systemLogs.filter(l => l.level === "error").length} color="#ef4444" />
        <KpiCard icon={<FaExclamationTriangle />} label="Warnings" value={systemLogs.filter(l => l.level === "warning").length} color="#f97316" />
        <KpiCard icon={<FaInfoCircle />} label="Info" value={systemLogs.filter(l => l.level === "info").length} color="#3b82f6" />
      </div>
      <div className="sa-filters">
        {["all", "error", "warning", "info"].map(f => (
          <button key={f} className={`sa-filter-btn ${filter === f ? "sa-filter-active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="sa-card">
        {filtered.map(l => (
          <div key={l.id} className="sa-log-row" style={{ borderLeft: `3px solid ${levelColor[l.level]}` }}>
            <div style={{ color: levelColor[l.level], fontSize: "1rem", flexShrink: 0 }}>{levelIcon[l.level]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ fontSize: ".85rem" }}>{l.message}</strong>
                <small style={{ color: "var(--text-secondary)" }}>{l.time}</small>
              </div>
              <span style={{ fontSize: ".75rem", color: "var(--text-secondary)" }}>{l.service}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function SASettings() {
  const { toast, show } = useToast();
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head"><h2><FaCog style={{ marginRight: 8 }} />General Settings</h2></div>
      <div className="sa-two-col">
        <div className="sa-card">
          <div className="sa-card-head"><h3>Gym Information</h3></div>
          {[["Gym Name", systemSettings.gymName], ["Support Email", systemSettings.email], ["Phone", systemSettings.phone], ["Timezone", systemSettings.timezone], ["Currency", systemSettings.currency]].map(([l, v]) => (
            <div className="sa-form-group" key={l}><label>{l}</label><input className="sa-input" defaultValue={v} /></div>
          ))}
          <button className="btn btn-primary sa-btn-sm" style={{ marginTop: 8 }} onClick={() => show("Settings saved!")}>Save Changes</button>
        </div>
        <div className="sa-card">
          <div className="sa-card-head"><h3>Branding</h3></div>
          <div className="sa-form-group"><label>Logo URL</label><input className="sa-input" placeholder="https://..." /></div>
          <div className="sa-form-group"><label>Primary Color</label><input className="sa-input" defaultValue="#ef4444" type="color" style={{ height: 42 }} /></div>
          <div className="sa-form-group"><label>Tagline</label><input className="sa-input" defaultValue="Transform Your Body" /></div>
          <button className="btn btn-primary sa-btn-sm" style={{ marginTop: 8 }} onClick={() => show("Branding updated!")}>Update Branding</button>
        </div>
      </div>
    </div>
  );
}

function SANotifSettings() {
  const [settings, setSettings] = useState({
    emailNotif: true, smsAlerts: false, pushNotif: false, weeklyReports: true,
    paymentAlerts: true, expiryReminders: true, systemAlerts: true, marketingEmails: false,
  });
  const { toast, show } = useToast();
  const toggle = (key) => { setSettings(s => ({ ...s, [key]: !s[key] })); show("Setting updated!"); };
  const rows = [
    ["emailNotif", "Email Notifications", "Receive alerts via email"],
    ["smsAlerts", "SMS Alerts", "Receive alerts via SMS"],
    ["pushNotif", "Push Notifications", "Browser push notifications"],
    ["weeklyReports", "Weekly Reports", "Automated weekly summary"],
    ["paymentAlerts", "Payment Alerts", "Failed/successful payment alerts"],
    ["expiryReminders", "Expiry Reminders", "Member subscription expiry alerts"],
    ["systemAlerts", "System Alerts", "Server & platform alerts"],
    ["marketingEmails", "Marketing Emails", "Promotional campaign emails"],
  ];
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head"><h2><FaBell style={{ marginRight: 8 }} />Notification Settings</h2></div>
      <div className="sa-card">
        {rows.map(([key, label, desc]) => (
          <div key={key} className="sa-toggle-row">
            <div><strong style={{ display: "block", fontSize: ".88rem" }}>{label}</strong><span style={{ fontSize: ".75rem", color: "var(--text-secondary)" }}>{desc}</span></div>
            <div className={`sa-toggle ${settings[key] ? "sa-toggle-on" : ""}`} onClick={() => toggle(key)} style={{ cursor: "pointer" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SASysConfig() {
  const { toast, show } = useToast();
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head"><h2><FaServer style={{ marginRight: 8 }} />System Configuration</h2></div>
      <div className="sa-two-col">
        <div className="sa-card">
          <div className="sa-card-head"><h3>Performance</h3></div>
          {[["Cache TTL (seconds)", "3600"], ["Max Upload Size (MB)", "50"], ["Session Timeout (min)", "30"], ["API Rate Limit (req/min)", "100"]].map(([l, v]) => (
            <div className="sa-form-group" key={l}><label>{l}</label><input className="sa-input" defaultValue={v} type="number" /></div>
          ))}
          <button className="btn btn-primary sa-btn-sm" style={{ marginTop: 8 }} onClick={() => show("Config saved!")}>Save Config</button>
        </div>
        <div className="sa-card">
          <div className="sa-card-head"><h3>System Toggles</h3></div>
          {[["Maintenance Mode", false], ["Debug Logging", false], ["Two-Factor Auth", true], ["IP Whitelist", false], ["Auto-Scaling", true]].map(([l, v]) => (
            <div key={l} className="sa-toggle-row">
              <span>{l}</span>
              <div className={`sa-toggle ${v ? "sa-toggle-on" : ""}`} onClick={() => show(`${l} toggled`)} style={{ cursor: "pointer" }} />
            </div>
          ))}
        </div>
      </div>
      <div className="sa-card">
        <div className="sa-card-head"><h3>Danger Zone</h3></div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn sa-btn-sm" style={{ background: "#ef444422", color: "#ef4444", border: "1px solid #ef4444" }} onClick={() => show("Clearing cache...")}>Clear Cache</button>
          <button className="btn sa-btn-sm" style={{ background: "#ef444422", color: "#ef4444", border: "1px solid #ef4444" }} onClick={() => show("Flushing sessions...")}>Flush Sessions</button>
          <button className="btn sa-btn-sm" style={{ background: "#ef444422", color: "#ef4444", border: "1px solid #ef4444" }} onClick={() => show("Rebuilding search index...")}>Rebuild Index</button>
        </div>
      </div>
    </div>
  );
}

// ─── SUPPORT: TICKETS ─────────────────────────────────────────────────────────
function SATickets({ openForm }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { toast, show } = useToast();
  const filtered = supportTickets.filter(t =>
    (filter === "all" || t.status === filter) &&
    (t.user.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaTicketAlt style={{ marginRight: 8 }} />Support Tickets</h2>
        <button className="btn btn-primary sa-btn-sm" onClick={() => openForm("createTicket")}><FaPlus style={{ marginRight: 6 }} />New Ticket</button>
      </div>
      <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <KpiCard icon={<FaExclamationCircle />} label="Open" value={supportTickets.filter(t => t.status === "open").length} color="#ef4444" />
        <KpiCard icon={<FaSync />} label="In Progress" value={supportTickets.filter(t => t.status === "in-progress").length} color="#f97316" />
        <KpiCard icon={<FaCheckCircle />} label="Closed" value={supportTickets.filter(t => t.status === "closed").length} color="#22c55e" />
      </div>
      <div className="sa-filters">
        <div className="sa-search-wrap"><FaSearch className="sa-search-icon" /><input className="sa-input sa-input-search" placeholder="Search tickets..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        {["all", "open", "in-progress", "closed"].map(f => (
          <button key={f} className={`sa-filter-btn ${filter === f ? "sa-filter-active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="sa-card">
        {filtered.length === 0 ? <EmptyState title="No tickets found" /> : (
          <table className="sa-table">
            <thead><tr><th>ID</th><th>User</th><th>Subject</th><th>Priority</th><th>Assigned</th><th>Created</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td><code style={{ fontSize: ".72rem", color: "var(--accent)" }}>{t.id}</code></td>
                  <td><strong>{t.user}</strong></td>
                  <td style={{ maxWidth: 180 }}>{t.subject}</td>
                  <td><SABadge s={t.priority} /></td>
                  <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{t.assigned}</td>
                  <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{t.created}</td>
                  <td><SABadge s={t.status} /></td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="sa-link-btn" onClick={() => show(`Viewing ticket ${t.id}`)}>View</button>
                      <button className="sa-link-btn" onClick={() => show(`Assigning ${t.id}`)}>Assign</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── SUPPORT: FEEDBACK ────────────────────────────────────────────────────────
function SAFeedback() {
  const avgRating = (feedbackData.reduce((a, b) => a + b.rating, 0) / feedbackData.length).toFixed(1);
  return (
    <div className="sa-section">
      <div className="sa-section-head"><h2><FaStar style={{ marginRight: 8 }} />Feedback</h2></div>
      <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <KpiCard icon={<FaStar />} label="Average Rating" value={`${avgRating}/5`} color="#f97316" />
        <KpiCard icon={<FaComments />} label="Total Reviews" value={feedbackData.length} color="#3b82f6" />
        <KpiCard icon={<FaCheckCircle />} label="5-Star Reviews" value={feedbackData.filter(f => f.rating === 5).length} color="#22c55e" />
      </div>
      <div className="sa-card">
        <div className="sa-card-head"><h3>Rating Distribution</h3></div>
        {[5, 4, 3, 2, 1].map(r => {
          const count = feedbackData.filter(f => f.rating === r).length;
          return (
            <div key={r} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <span style={{ width: 20, fontSize: ".82rem", fontWeight: 700 }}>{r}★</span>
              <div style={{ flex: 1, background: "var(--bg-primary)", borderRadius: 4, height: 10 }}>
                <div style={{ width: `${(count / feedbackData.length) * 100}%`, height: "100%", background: "#f97316", borderRadius: 4 }} />
              </div>
              <span style={{ width: 20, fontSize: ".78rem", color: "var(--text-secondary)" }}>{count}</span>
            </div>
          );
        })}
      </div>
      <div className="sa-card">
        <div className="sa-card-head"><h3>Recent Feedback</h3></div>
        {feedbackData.map(f => (
          <div key={f.id} className="sa-feedback-row">
            <div className="sa-feedback-head">
              <strong>{f.user}</strong>
              <div style={{ display: "flex", gap: 2 }}>
                {Array.from({ length: 5 }, (_, i) => (
                  <FaStar key={i} style={{ color: i < f.rating ? "#f97316" : "var(--border-color)", fontSize: ".8rem" }} />
                ))}
              </div>
              <SABadge s={f.category.toLowerCase()} />
              <small style={{ color: "var(--text-secondary)", marginLeft: "auto" }}>{f.date}</small>
            </div>
            <p style={{ margin: "6px 0 0", fontSize: ".85rem", color: "var(--text-secondary)" }}>{f.comment}</p>
          </div>
        ))}
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

  const toggleGroup = (label) => {
    if (collapsed) { setCollapsed(false); setExpanded(label); return; }
    setExpanded(prev => prev === label ? null : label);
  };

  return (
    <>
      <aside className={`sa-sidebar ${open ? "sa-sidebar-open" : ""} ${collapsed ? "sa-sidebar-collapsed" : ""}`}>
        {/* Brand */}
        <div className="sa-sidebar-brand">
          <span className="sa-brand-icon">⚡</span>
          {!collapsed && <span className="sa-brand-text">FitZone <em>Super Admin</em></span>}
          <button
            className="sa-sidebar-collapse-btn"
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <FaAngleDown style={{ transform: "rotate(-90deg)" }} /> : <FaAngleDown style={{ transform: "rotate(90deg)" }} />}
          </button>
        </div>

        {/* User */}
        {!collapsed && (
          <div className="sa-sidebar-user">
            <div className="sa-avatar">SA</div>
            <div>
              <strong>Super Admin</strong>
              <span>System Owner</span>
            </div>
          </div>
        )}

        <nav className="sa-nav">
          {/* ── Dashboard: direct link, no dropdown ── */}
          <div className="sa-nav-direct">
            <button
              className={`sa-nav-item sa-nav-direct-item ${active === DASHBOARD_ITEM.id ? "sa-nav-active" : ""}`}
              onClick={() => { onNav(DASHBOARD_ITEM.id); onClose(); }}
              title={collapsed ? DASHBOARD_ITEM.label : undefined}
            >
              <span
                className="sa-nav-icon-bubble"
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
              <div key={group.label} className={`sa-nav-group ${hasActive ? "sa-nav-group-has-active" : ""}`}>
                <button
                  className={`sa-nav-group-header ${isOpen ? "sa-nav-group-header-open" : ""} ${hasActive ? "sa-nav-group-header-has-active" : ""}`}
                  onClick={() => toggleGroup(group.label)}
                  aria-expanded={isOpen}
                  title={collapsed ? group.label : undefined}
                >
                  <span
                    className="sa-nav-icon-bubble"
                    style={{ background: `${group.color}22`, color: group.color }}
                  >
                    {group.icon}
                  </span>
                  {!collapsed && (
                    <>
                      <span className="sa-nav-group-label">{group.label}</span>
                      <span className={`sa-nav-chevron ${isOpen ? "sa-nav-chevron-open" : ""}`}>
                        <FaAngleDown />
                      </span>
                    </>
                  )}
                </button>
                {!collapsed && (
                  <div className={`sa-nav-group-items ${isOpen ? "sa-nav-group-items-open" : ""}`}>
                    {group.items.map(n => (
                      <button
                        key={n.id}
                        className={`sa-nav-item ${active === n.id ? "sa-nav-active" : ""}`}
                        onClick={() => { onNav(n.id); onClose(); }}
                      >
                        <span
                          className="sa-nav-icon-bubble sa-nav-icon-bubble-sm"
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

        <div className="sa-sidebar-foot">
          <Link to="/" className="sa-nav-item" title={collapsed ? "Back to Site" : undefined}>
            <span className="sa-nav-icon-bubble" style={{ background: "rgba(100,116,139,.15)", color: "#64748b" }}><FaHome /></span>
            {!collapsed && <span>Back to Site</span>}
          </Link>
          <Link to="/dashboard/admin" className="sa-nav-item" title={collapsed ? "Admin View" : undefined}>
            <span className="sa-nav-icon-bubble" style={{ background: "rgba(239,68,68,.15)", color: "#ef4444" }}><FaUserShield /></span>
            {!collapsed && <span>Admin View</span>}
          </Link>
        </div>
      </aside>
      {open && <div className="sa-overlay" onClick={onClose} />}
    </>
  );
}

// ─── SECTION ROUTER ───────────────────────────────────────────────────────────
function renderSection(active, openForm, dataChangeKey) {
  const map = {
    overview:             <SAOverview />,
    users:                <SAUsers openForm={openForm} dataChangeKey={dataChangeKey} />,
    branches:             <SABranches openForm={openForm} dataChangeKey={dataChangeKey} />,
    content:              <SAContent openForm={openForm} />,
    billing:              <SABilling />,
    revenue:              <SARevenue />,
    transactions:         <SATransactions />,
    plans:                <SAPlans openForm={openForm} />,
    reports:              <SAReports />,
    "members-analytics":  <SAMemberAnalytics />,
    "fin-analytics":      <SAFinancialAnalytics />,
    "notifications-center": <SANotificationsCenter />,
    campaigns:            <SACampaigns openForm={openForm} />,
    communication:        <SACommunication />,
    equipment:            <SAEquipment openForm={openForm} />,
    vendors:              <SAVendors openForm={openForm} />,
    maintenance:          <SAMaintenance openForm={openForm} />,
    "api-settings":       <SAApiSettings />,
    "third-party":        <SAThirdParty />,
    "import-data":        <SAImportData />,
    "export-data":        <SAExportData />,
    backups:              <SABackups />,
    "ai-insights":        <SAAIInsights />,
    "feature-flags":      <SAFeatureFlags openForm={openForm} />,
    "live-monitoring":    <SALiveMonitoring />,
    audit:                <SAAudit />,
    "login-history":      <SALoginHistory />,
    "system-logs":        <SASystemLogs />,
    settings:             <SASettings />,
    "notif-settings":     <SANotifSettings />,
    "sys-config":         <SASysConfig />,
    tickets:              <SATickets openForm={openForm} />,
    feedback:             <SAFeedback />,
  };
  return map[active] || (
    <div className="sa-section">
      <div className="sa-card" style={{ textAlign: "center", padding: "60px", color: "var(--text-secondary)" }}>
        <FaCog style={{ fontSize: "3rem", marginBottom: 12, opacity: .4 }} />
        <p>Section under development.</p>
      </div>
    </div>
  );
}

// ─── TOPBAR NOTIFICATION BELL ─────────────────────────────────────────────────
function TopbarBell({ onNav }) {
  const [open, setOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;
  return (
    <div style={{ position: "relative" }}>
      <button style={{ background: "none", border: "none", cursor: "pointer", position: "relative", color: "var(--text-secondary)", fontSize: "1.1rem" }} onClick={() => setOpen(o => !o)}>
        <FaBell />
        {unread > 0 && <span className="sa-notif-badge">{unread}</span>}
      </button>
      {open && (
        <div className="sa-notif-dropdown">
          <div className="sa-notif-dropdown-head">
            <strong>Notifications</strong>
            <span className="sa-badge sa-red">{unread} new</span>
          </div>
          {notifications.slice(0, 4).map(n => (
            <div key={n.id} className={`sa-notif-item ${!n.read ? "sa-notif-item-unread" : ""}`}>
              <strong>{n.title}</strong>
              <p>{n.message}</p>
              <small>{n.time}</small>
            </div>
          ))}
          <button className="sa-notif-view-all" onClick={() => { setOpen(false); onNav("notifications-center"); }}>View All Notifications</button>
        </div>
      )}
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function SuperAdminDashboardPage() {
  const [active, setActive] = useState(DASHBOARD_ITEM.id);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { activeForm, formData, openForm, closeForm, isOpen } = useFormModal();
  const [toast, setToast] = useState(null);
  const { themeId, setThemeId, themes } = useDashboardTheme();
  const [dataChangeKey, setDataChangeKey] = useState(0);
  const go = useCallback(id => setActive(id), []);

  const allItems = [DASHBOARD_ITEM, ...NAV_GROUPS.flatMap(g => g.items)];
  const currentLabel = allItems.find(i => i.id === active)?.label || "Dashboard";

  const handleFormSubmit = () => {
    closeForm();
    setToast(`✅ ${formTitles[activeForm] || "Action"} completed successfully!`);
    setTimeout(() => setToast(null), 3500);
    
    // Trigger data refresh for affected components
    if (activeForm === 'createUser' || activeForm === 'createBranch') {
      setDataChangeKey(prev => prev + 1);
    }
  };

  // Create a callback that components can use to detect data changes
  const onDataChange = useCallback(() => {
    // This callback is called when data needs to be refreshed
    // Components listen to dataChangeKey changes
  }, []);

  return (
    <div className="sa-layout">
      <Sidebar active={active} onNav={go} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="sa-main">
        <header className="sa-topbar">
          <button className="sa-menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
          <span className="sa-topbar-title">Super Admin · {currentLabel}</span>
          <div className="sa-topbar-right">
            <DashboardThemeSwitcher themeId={themeId} setThemeId={setThemeId} themes={themes} />
            <TopbarBell onNav={go} />
            <div className="sa-avatar sa-avatar-sm">SA</div>
          </div>
        </header>
        <main className="sa-content">
          {renderSection(active, openForm, dataChangeKey)}
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
          accentColor="#ef4444"
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
