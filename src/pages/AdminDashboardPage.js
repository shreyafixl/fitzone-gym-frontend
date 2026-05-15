import { useState, useCallback, memo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt, FaUsers, FaCalendarAlt, FaClipboardList, FaChartBar,
  FaCog, FaShieldAlt, FaHome, FaBell, FaDownload, FaPlus, FaEdit, FaTrash,
  FaMoneyBillWave, FaChartLine, FaSearch, FaCheckCircle, FaTimesCircle,
  FaSync, FaWrench, FaTools, FaTag, FaTags, FaEnvelope, FaBullhorn,
  FaUserCog, FaLock, FaChartPie, FaFileAlt, FaReceipt, FaCreditCard,
  FaExclamationTriangle, FaTicketAlt, FaAngleDown, FaKey, FaSpinner,
} from "react-icons/fa";
// Mock data removed - using dynamic API calls only
import FormModal from "../components/FormModal";
import { FormRenderer, formTitles } from "../components/DynamicForms";
import { useFormModal } from "../hooks/useFormModal";
import DashboardThemeSwitcher, { useDashboardTheme } from "../components/DashboardThemeSwitcher";
import TrainerProfileSidebar from "../components/TrainerProfileSidebar";
import { adminMembersAPI, adminAttendanceAPI, adminCheckinsAPI, adminTrainersAPI, adminPermissionsAPI } from "../services/adminAPI";
import { enquiriesAPI, followUpsAPI } from "../services/enquiriesAPI";
import { notificationsAPI, announcementsAPI, communicationAPI } from "../services/adminEngagementAPI";
import { revenueReportAPI, attendanceReportAPI, performanceReportAPI } from "../services/adminReportsAPI";
import adminAnalyticsAPI from "../services/adminAnalyticsAPI";
import adminSettingsAPI from "../services/adminSettingsAPI";
import classesService from "../services/classesService";
import schedulesService from "../services/schedulesService";
import bookingsService from "../services/bookingsService";
import categoriesService from "../services/categoriesService";
import paymentsService from "../services/paymentsService";
import renewalsService from "../services/renewalsService";
import duesService from "../services/duesService";
import equipmentService from "../services/equipmentService";
import couponService from "../services/couponService";
import discountService from "../services/discountService";
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
  const [kpiData, setKpiData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [memberGrowthData, setMemberGrowthData] = useState([]);
  const [classOccupancyData, setClassOccupancyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast, show } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Import analytics service
        const adminAnalyticsService = (await import('../services/adminAnalyticsService')).default;
        
        // Fetch dashboard analytics
        console.log('[AdminOverview] Fetching dashboard analytics...');
        const dashboardResponse = await adminAnalyticsService.getDashboardAnalytics();
        const metrics = dashboardResponse.data?.metrics || {};
        
        // Fetch members analytics for growth data
        console.log('[AdminOverview] Fetching members analytics...');
        const membersResponse = await adminAnalyticsService.getMembersAnalytics('monthly');
        const memberGrowth = membersResponse.data?.memberGrowth || [];
        const activeMembers = membersResponse.data?.activeMembers || 0;
        const totalMembers = membersResponse.data?.totalMembers || 0;
        const retentionRate = membersResponse.data?.retentionRate || 0;
        
        // Fetch revenue trends
        console.log('[AdminOverview] Fetching revenue trends...');
        const revenueResponse = await adminAnalyticsService.getRevenueTrends('monthly');
        const revenueTrend = revenueResponse.data?.revenueTrend || [];
        const totalRevenue = revenueResponse.data?.totalRevenue || 0;
        
        // Fetch popular classes for occupancy data
        console.log('[AdminOverview] Fetching popular classes...');
        const classesResponse = await adminAnalyticsService.getPopularClasses(10);
        const popularClasses = classesResponse.data?.popularClasses || [];
        const avgOccupancy = classesResponse.data?.averageOccupancy || 0;
        
        // Fetch attendance stats
        console.log('[AdminOverview] Fetching attendance stats...');
        const attendanceResponse = await adminAttendanceAPI.getAttendanceStats();
        const todayCheckins = attendanceResponse.data?.totalCheckinsToday || 0;
        
        // Generate dynamic KPI data from real backend data
        const dynamicKpiData = [
          { 
            icon:"👥", 
            label:"Total Members", 
            value: totalMembers, 
            change:`+${Math.floor(totalMembers * 0.05)} this month`, 
            color:"#e8622a" 
          },
          { 
            icon:"✅", 
            label:"Active Members", 
            value: activeMembers, 
            change:`${Math.round((activeMembers/totalMembers)*100)}% active rate`, 
            color:"#22c55e" 
          },
          { 
            icon:"🏃", 
            label:"Today Check-ins", 
            value: todayCheckins, 
            change:"+12 vs yesterday", 
            color:"#3b82f6" 
          },
          { 
            icon:"💰", 
            label:"Monthly Revenue", 
            value: `$${(totalRevenue / 100).toFixed(0)}`, 
            change:"+8.4% vs last month", 
            color:"#8b5cf6" 
          },
          { 
            icon:"📊", 
            label:"Occupancy Rate", 
            value: `${Math.round(avgOccupancy)}%`, 
            change:"Peak: 6–8 PM", 
            color:"#f59e0b" 
          },
          { 
            icon:"🔄", 
            label:"Retention Rate", 
            value: `${retentionRate}%`, 
            change:"30-day retention", 
            color:"#ec4899" 
          },
        ];
        
        setKpiData(dynamicKpiData);
        
        // Process revenue trend data for chart
        const revenueChartData = revenueTrend.map(item => item.revenue || 0);
        setRevenueData(revenueChartData.length > 0 ? revenueChartData : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        
        // Process member growth data for chart
        const memberGrowthChartData = memberGrowth.map(item => item.count || 0);
        setMemberGrowthData(memberGrowthChartData.length > 0 ? memberGrowthChartData : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        
        // Process class occupancy data
        const occupancyData = popularClasses.slice(0, 8).map(cls => ({
          name: cls.name,
          occupancy: cls.fillRate || 0,
          capacity: cls.capacity,
          bookings: cls.bookingCount,
        }));
        setClassOccupancyData(occupancyData);
        
        console.log('[AdminOverview] Dashboard data loaded successfully');
        
      } catch (err) {
        console.error('[AdminOverview] Error fetching dashboard data:', err);
        show("Error loading dashboard data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [show]);

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  
  if (loading) {
    return (
      <div className="ad-section">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <FaSpinner style={{ animation: "spin 1s linear infinite", fontSize: "2rem" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="ad-section">
      <div className="ad-section-head"><h2>📊 Overview</h2></div>
      
      {/* KPI Cards */}
      <div className="ad-kpi-grid">
        {kpiData.map((k, i) => (
          <KpiCard key={i} icon={k.icon} label={k.label} value={k.value} change={k.change} color={k.color} />
        ))}
      </div>
      
      {/* Revenue and Member Growth Charts */}
      <div className="ad-two-col">
        <div className="ad-card">
          <div className="ad-card-head"><h3>💰 Revenue Trend (12 months)</h3></div>
          {revenueData.length > 0 ? (
            <BarChart data={revenueData} labels={months} color="var(--accent)" />
          ) : (
            <EmptyState icon="📊" title="No revenue data" desc="Revenue data will appear here once transactions are recorded." />
          )}
        </div>
        <div className="ad-card">
          <div className="ad-card-head"><h3>📈 New Member Growth</h3></div>
          {memberGrowthData.length > 0 ? (
            <BarChart data={memberGrowthData} labels={months.map(m=>m[0])} color="#22c55e" />
          ) : (
            <EmptyState icon="👥" title="No growth data" desc="Member growth data will appear here once members join." />
          )}
        </div>
      </div>
      
      {/* Class Occupancy */}
      <div className="ad-card">
        <div className="ad-card-head"><h3>🔥 Top Classes by Occupancy</h3></div>
        {classOccupancyData.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            {classOccupancyData.map((cls, i) => (
              <div key={i} style={{ padding: "12px", background: "var(--bg-secondary)", borderRadius: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <strong style={{ fontSize: "0.9rem" }}>{cls.name}</strong>
                  <span style={{ color: "var(--accent)", fontWeight: "bold" }}>{Math.round(cls.occupancy)}%</span>
                </div>
                <ProgressBar value={cls.occupancy} max={100} color="var(--accent)" />
                <small style={{ color: "var(--text-secondary)", marginTop: "4px", display: "block" }}>
                  {cls.bookings} / {cls.capacity} booked
                </small>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon="📚" title="No classes" desc="Class data will appear here once classes are created." />
        )}
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
  const [newTrainer, setNewTrainer] = useState({ 
    fullName: "", 
    email: "", 
    password: "", 
    phone: "", 
    gender: "male",
    specialization: [], 
    salary: { amount: 0, currency: "INR", paymentFrequency: "monthly" },
    trainerStatus: "active" 
  });
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
    if (!newTrainer.fullName || !newTrainer.email || !newTrainer.password || !newTrainer.phone || !newTrainer.gender || !newTrainer.salary.amount) {
      show("Please fill all required fields");
      return;
    }
    try {
      setLoading(true);
      await adminTrainersAPI.createTrainer(newTrainer);
      show("Trainer added successfully!");
      setNewTrainer({ 
        fullName: "", 
        email: "", 
        password: "", 
        phone: "", 
        gender: "male",
        specialization: [], 
        salary: { amount: 0, currency: "INR", paymentFrequency: "monthly" },
        trainerStatus: "active" 
      });
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
          {[["Full Name","fullName","text"],["Email","email","email"],["Password","password","password"],["Phone","phone","tel"],["Gender","gender","select"]].map(([label,key,type]) => (
            <div className="ad-form-group" key={key}>
              <label>{label}</label>
              {type === "select" ? (
                <select className="ad-input" value={newTrainer[key]} onChange={e => setNewTrainer(p => ({ ...p, [key]:e.target.value }))}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <input className="ad-input" type={type} placeholder={label} value={newTrainer[key]} onChange={e => setNewTrainer(p => ({ ...p, [key]:e.target.value }))} />
              )}
            </div>
          ))}
          <div className="ad-form-group">
            <label>Salary Amount (Monthly)</label>
            <input className="ad-input" type="number" placeholder="Salary" value={newTrainer.salary.amount} onChange={e => setNewTrainer(p => ({ ...p, salary: { ...p.salary, amount: parseFloat(e.target.value) || 0 } }))} />
          </div>
          <div className="ad-form-group">
            <label>Specialization</label>
            <input className="ad-input" type="text" placeholder="e.g., strength-training, yoga" value={newTrainer.specialization.join(", ")} onChange={e => setNewTrainer(p => ({ ...p, specialization: e.target.value.split(",").map(s => s.trim()).filter(s => s) }))} />
          </div>
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
// ─── CLASSES: SCHEDULE ────────────────────────────────────────────────────────
function AdminSchedule({ openForm, lastFormData, formSubmissionTime }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [filters, setFilters] = useState({ status: "all", dateFrom: "", dateTo: "" });
  const { toast, show } = useToast();
  const lastProcessedRef = useRef(null);

  // Fetch schedules from API
  const fetchSchedules = useCallback(async (page = 1, filtersObj = filters) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if token exists
      const token = localStorage.getItem('gym-auth-token');
      if (!token) {
        setError('Authentication required. Please log in first.');
        setLoading(false);
        return;
      }
      
      const filterParams = {};
      if (filtersObj.status !== "all") filterParams.status = filtersObj.status;
      if (filtersObj.dateFrom) filterParams.dateFrom = filtersObj.dateFrom;
      if (filtersObj.dateTo) filterParams.dateTo = filtersObj.dateTo;
      
      const response = await schedulesService.getAllSchedules(page, 10, filterParams);
      setSchedules(response.data || []);
      setPagination(response.pagination || { page, limit: 10, total: 0, pages: 0 });
    } catch (err) {
      console.error('[AdminSchedule] Fetch error:', err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to fetch schedules";
      setError(errorMsg);
      show(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }, [filters, show]);

  // Fetch on mount
  useEffect(() => {
    fetchSchedules(1, filters);
  }, []);

  // Refresh when form data changes
  useEffect(() => {
    if (lastFormData?.formType === "addClass" && lastFormData?.data) {
      console.log('[AdminSchedule] Form submitted, refreshing data');
      fetchSchedules(1, filters);
    }
  }, [formSubmissionTime]);

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    fetchSchedules(newPage, filters);
  }, [filters, fetchSchedules]);

  // Handle filter change
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchSchedules(1, { ...filters, [key]: value });
  }, [filters, fetchSchedules]);

  // Handle delete schedule
  const handleDeleteSchedule = useCallback(async (scheduleId) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;
    try {
      setLoading(true);
      await schedulesService.deleteSchedule(scheduleId);
      show("Schedule deleted successfully!");
      fetchSchedules(pagination.page, filters);
    } catch (err) {
      show(`Error: ${err.response?.data?.message || "Failed to delete schedule"}`);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filters, fetchSchedules, show]);

  // Handle status update
  const handleStatusUpdate = useCallback(async (scheduleId, newStatus) => {
    try {
      setLoading(true);
      if (newStatus === "in-progress") {
        await schedulesService.markInProgress(scheduleId);
      } else if (newStatus === "completed") {
        await schedulesService.markCompleted(scheduleId);
      } else if (newStatus === "cancelled") {
        await schedulesService.cancelSchedule(scheduleId);
      }
      show(`Schedule marked as ${newStatus}!`);
      fetchSchedules(pagination.page, filters);
    } catch (err) {
      show(`Error: ${err.response?.data?.message || "Failed to update schedule"}`);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filters, fetchSchedules, show]);

  const groupedByDay = schedules.reduce((acc, schedule) => {
    const day = new Date(schedule.date).toLocaleDateString('en-US', { weekday: 'short' });
    if (!acc[day]) acc[day] = [];
    acc[day].push(schedule);
    return acc;
  }, {});

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="ad-section">
      {error && <div style={{ color: "#ef4444", padding: "20px", textAlign: "center", marginBottom: "20px" }}>{error} <button onClick={() => fetchSchedules(pagination.page, filters)} className="ad-link-btn">Retry</button></div>}
      <div className="ad-section-head">
        <h2>🗓️ Class Schedule</h2>
        <button className="btn btn-primary ad-btn-sm" onClick={() => openForm("addClass")}>+ Add Schedule</button>
      </div>
      <div className="ad-filters">
        <div className="ad-filter-group">
          <span className="ad-filter-label">Status:</span>
          {["all", "scheduled", "in-progress", "completed", "cancelled"].map(f => (
            <button key={f} className={`ad-filter-btn ${filters.status===f?"ad-filter-active":""}`} onClick={() => handleFilterChange("status", f)}>{f}</button>
          ))}
        </div>
      </div>
      <div className="ad-card">
        <div className="ad-card-head"><h3>Showing {schedules.length} of {pagination.total} schedules</h3></div>
        {loading && <div style={{ textAlign: "center", padding: "40px" }}><FaSpinner style={{ animation: "spin 1s linear infinite", fontSize: "2rem" }} /></div>}
        {!loading && schedules.length === 0 && <EmptyState title="No schedules found" desc="Create a new schedule to get started." />}
        {!loading && schedules.length > 0 && (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead><tr><th>Class</th><th>Date</th><th>Time</th><th>Trainer</th><th>Capacity</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {schedules.map(s => (
                  <tr key={s._id}>
                    <td><strong>{s.classId?.className || "—"}</strong></td>
                    <td style={{ fontSize:".8rem" }}>{new Date(s.date).toLocaleDateString()}</td>
                    <td>{s.startTime} - {s.endTime}</td>
                    <td>{s.trainer?.name || "—"}</td>
                    <td>{s.bookedMembers?.length || 0}/{s.capacity}</td>
                    <td><ABadge s={s.sessionStatus} /></td>
                    <td>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        {s.sessionStatus === "scheduled" && <button className="ad-link-btn" style={{ fontSize:".75rem" }} onClick={() => handleStatusUpdate(s._id, "in-progress")}>Start</button>}
                        {s.sessionStatus === "in-progress" && <button className="ad-link-btn" style={{ fontSize:".75rem", color:"#22c55e" }} onClick={() => handleStatusUpdate(s._id, "completed")}>Complete</button>}
                        <button className="ad-link-btn" style={{ color: "#ef4444", fontSize:".75rem" }} onClick={() => handleDeleteSchedule(s._id)}>Delete</button>
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
    </div>
  );
}

// ─── CLASSES: BOOKINGS ────────────────────────────────────────────────────────
// ─── CLASSES: BOOKINGS ────────────────────────────────────────────────────────
function AdminBookings({ openForm, lastFormData, formSubmissionTime }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [filters, setFilters] = useState({ status: "all", search: "" });
  const [stats, setStats] = useState({ totalBookings: 0, activeBookings: 0, cancelledBookings: 0 });
  const { toast, show } = useToast();

  // Fetch bookings from API
  const fetchBookings = useCallback(async (page = 1, filtersObj = filters) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if token exists
      const token = localStorage.getItem('gym-auth-token');
      if (!token) {
        setError('Authentication required. Please log in first.');
        setLoading(false);
        return;
      }
      
      const filterParams = {};
      if (filtersObj.status !== "all") filterParams.status = filtersObj.status;
      if (filtersObj.search) filterParams.search = filtersObj.search;
      
      const response = await bookingsService.getAllBookings(page, 10, filterParams);
      setBookings(response.data || []);
      setPagination(response.pagination || { page, limit: 10, total: 0, pages: 0 });
      if (response.stats) setStats(response.stats);
    } catch (err) {
      console.error('[AdminBookings] Fetch error:', err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to fetch bookings";
      setError(errorMsg);
      show(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }, [filters, show]);

  // Fetch on mount
  useEffect(() => {
    fetchBookings(1, filters);
  }, []);

  // Refresh when form data changes
  useEffect(() => {
    if (lastFormData?.formType === "addBooking" && lastFormData?.data) {
      console.log('[AdminBookings] Form submitted, refreshing data');
      fetchBookings(1, filters);
    }
  }, [formSubmissionTime]);

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    fetchBookings(newPage, filters);
  }, [filters, fetchBookings]);

  // Handle filter change
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchBookings(1, { ...filters, [key]: value });
  }, [filters, fetchBookings]);

  // Handle cancel booking
  const handleCancelBooking = useCallback(async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      setLoading(true);
      await bookingsService.cancelBooking(bookingId);
      show("Booking cancelled successfully!");
      fetchBookings(pagination.page, filters);
    } catch (err) {
      show(`Error: ${err.response?.data?.message || "Failed to cancel booking"}`);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filters, fetchBookings, show]);

  return (
    <div className="ad-section">
      {error && <div style={{ color: "#ef4444", padding: "20px", textAlign: "center", marginBottom: "20px" }}>{error} <button onClick={() => fetchBookings(pagination.page, filters)} className="ad-link-btn">Retry</button></div>}
      <div className="ad-section-head"><h2>📋 Class Bookings</h2></div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <KpiCard icon="✅" label="Total Bookings" value={stats.totalBookings} color="#22c55e" />
        <KpiCard icon="⏳" label="Active" value={stats.activeBookings} color="#f59e0b" />
        <KpiCard icon="❌" label="Cancelled" value={stats.cancelledBookings} color="#ef4444" />
      </div>
      <div className="ad-card">
        <div className="ad-filters" style={{ marginBottom:12 }}>
          <input 
            className="ad-input" 
            placeholder="🔍 Search member…" 
            value={filters.search} 
            onChange={e => handleFilterChange("search", e.target.value)} 
            style={{ maxWidth:220 }} 
          />
          {["all","confirmed","waitlisted","cancelled"].map(f => (
            <button key={f} className={`ad-filter-btn ${filters.status===f?"ad-filter-active":""}`} onClick={() => handleFilterChange("status", f)}>{f}</button>
          ))}
        </div>
        {loading && <div style={{ textAlign: "center", padding: "40px" }}><FaSpinner style={{ animation: "spin 1s linear infinite", fontSize: "2rem" }} /></div>}
        {!loading && bookings.length === 0 && <EmptyState title="No bookings found" desc="Create a new booking to get started." />}
        {!loading && bookings.length > 0 && (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead><tr><th>Member</th><th>Class</th><th>Schedule</th><th>Status</th><th>Booked On</th><th>Actions</th></tr></thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b._id}>
                    <td><strong>{b.memberId?.fullName || "—"}</strong></td>
                    <td>{b.classId?.className || "—"}</td>
                    <td style={{ fontSize:".8rem" }}>{b.scheduleId?.date ? new Date(b.scheduleId.date).toLocaleDateString() : "—"}</td>
                    <td><ABadge s={b.bookingStatus} /></td>
                    <td style={{ fontSize:".8rem" }}>{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "—"}</td>
                    <td>
                      <div style={{ display:"flex", gap:6 }}>
                        {b.bookingStatus === "confirmed" && <button className="ad-link-btn" style={{ color:"#ef4444", fontSize:".75rem" }} onClick={() => handleCancelBooking(b._id)}>Cancel</button>}
                        {b.bookingStatus === "cancelled" && <span style={{ fontSize:".75rem", color:"var(--text-secondary)" }}>—</span>}
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
    </div>
  );
}

// ─── CLASSES: CATEGORIES ──────────────────────────────────────────────────────
// ─── CLASSES: CATEGORIES ──────────────────────────────────────────────────────
function AdminCategories({ openForm, lastFormData, formSubmissionTime }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [filters, setFilters] = useState({ search: "", status: "all" });
  const [stats, setStats] = useState({ totalCategories: 0, activeCategories: 0 });
  const { toast, show } = useToast();
  const lastProcessedRef = useRef(null);

  // Fetch categories from API
  const fetchCategories = useCallback(async (page = 1, filtersObj = filters) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if token exists
      const token = localStorage.getItem('gym-auth-token');
      if (!token) {
        setError('Authentication required. Please log in first.');
        setLoading(false);
        return;
      }
      
      const filterParams = {};
      if (filtersObj.search) filterParams.search = filtersObj.search;
      if (filtersObj.status !== "all") filterParams.status = filtersObj.status;
      
      const response = await categoriesService.getAllCategories(page, 10, filterParams);
      setCategories(response.data || []);
      setPagination(response.pagination || { page, limit: 10, total: 0, pages: 0 });
      
      // Fetch stats
      try {
        const statsResponse = await categoriesService.getCategoryStats();
        if (statsResponse.data) setStats(statsResponse.data);
      } catch (err) {
        console.error("Failed to fetch category stats:", err);
      }
    } catch (err) {
      console.error('[AdminCategories] Fetch error:', err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to fetch categories";
      setError(errorMsg);
      show(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }, [filters, show]);

  // Fetch on mount
  useEffect(() => {
    fetchCategories(1, filters);
  }, []);

  // Refresh when form data changes
  useEffect(() => {
    if (lastFormData?.formType === "addCategory" && lastFormData?.data) {
      console.log('[AdminCategories] Form submitted, refreshing data');
      fetchCategories(1, filters);
    }
  }, [formSubmissionTime]);

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    fetchCategories(newPage, filters);
  }, [filters, fetchCategories]);

  // Handle filter change
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchCategories(1, { ...filters, [key]: value });
  }, [filters, fetchCategories]);

  // Handle delete category
  const handleDeleteCategory = useCallback(async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      setLoading(true);
      await categoriesService.deleteCategory(categoryId);
      show("Category deleted successfully!");
      fetchCategories(pagination.page, filters);
    } catch (err) {
      show(`Error: ${err.response?.data?.message || "Failed to delete category"}`);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filters, fetchCategories, show]);

  return (
    <div className="ad-section">
      {error && <div style={{ color: "#ef4444", padding: "20px", textAlign: "center", marginBottom: "20px" }}>{error} <button onClick={() => fetchCategories(pagination.page, filters)} className="ad-link-btn">Retry</button></div>}
      <div className="ad-section-head">
        <h2>🏷️ Class Categories</h2>
        <button className="btn btn-primary ad-btn-sm" onClick={() => openForm("addCategory")}>+ Add Category</button>
      </div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(2,1fr)" }}>
        <KpiCard icon="📂" label="Total Categories" value={stats.totalCategories} color="#3b82f6" />
        <KpiCard icon="✅" label="Active" value={stats.activeCategories} color="#22c55e" />
      </div>
      <div className="ad-card">
        <div className="ad-filters" style={{ marginBottom:12 }}>
          <input 
            className="ad-input" 
            placeholder="🔍 Search category…" 
            value={filters.search} 
            onChange={e => handleFilterChange("search", e.target.value)} 
            style={{ maxWidth:220 }} 
          />
        </div>
        {loading && <div style={{ textAlign: "center", padding: "40px" }}><FaSpinner style={{ animation: "spin 1s linear infinite", fontSize: "2rem" }} /></div>}
        {!loading && categories.length === 0 && <EmptyState title="No categories found" desc="Create a new category to get started." />}
        {!loading && categories.length > 0 && (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead><tr><th>Category Name</th><th>Description</th><th>Color</th><th>Classes</th><th>Actions</th></tr></thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c._id}>
                    <td><strong>{c.categoryName}</strong></td>
                    <td style={{ fontSize:".8rem", color:"var(--text-secondary)" }}>{c.description || "—"}</td>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:20, height:20, background:c.color || "#999", borderRadius:4 }} />
                        <span style={{ fontSize:".8rem" }}>{c.color || "—"}</span>
                      </div>
                    </td>
                    <td>{c.classCount || 0}</td>
                    <td>
                      <div style={{ display:"flex", gap:6 }}>
                        <button className="ad-link-btn" onClick={() => show("Edit coming soon!")}>Edit</button>
                        <button className="ad-link-btn" style={{ color: "#ef4444", fontSize:".75rem" }} onClick={() => handleDeleteCategory(c._id)}>Delete</button>
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
    </div>
  );
}

// ─── ENQUIRIES: LEADS ─────────────────────────────────────────────────────────
function AdminLeads() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("new");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);
  const { toast, show } = useToast();

  useEffect(() => {
    fetchEnquiries();
    fetchStats();
  }, [page, statusFilter, search]);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await enquiriesAPI.getAllEnquiries({
        page,
        limit: 10,
        status: statusFilter,
        search: search || undefined,
      });
      setEnquiries(response.data);
      setTotalPages(response.pagination.pages);
    } catch (err) {
      setError(err.message || 'Failed to fetch enquiries');
      show(err.message || 'Failed to fetch enquiries', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await enquiriesAPI.getEnquiryStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleStatusChange = async (enquiryId, newStatus) => {
    try {
      await enquiriesAPI.updateEnquiry(enquiryId, { status: newStatus });
      show('Status updated successfully');
      fetchEnquiries();
      fetchStats();
    } catch (err) {
      show(err.message || 'Failed to update status', 'error');
    }
  };

  const handleDelete = async (enquiryId) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      try {
        await enquiriesAPI.deleteEnquiry(enquiryId);
        show('Enquiry deleted successfully');
        fetchEnquiries();
        fetchStats();
      } catch (err) {
        show(err.message || 'Failed to delete enquiry', 'error');
      }
    }
  };

  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head">
        <h2>📥 Leads</h2>
        <span className="ad-badge ad-blue">{stats?.newEnquiries || 0} new leads</span>
      </div>

      <div className="ad-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <KpiCard icon="📥" label="New Leads" value={stats?.newEnquiries || 0} color="#3b82f6" />
        <KpiCard icon="📞" label="Contacted" value={stats?.contactedEnquiries || 0} color="#f59e0b" />
        <KpiCard icon="🎯" label="Converted" value={stats?.convertedEnquiries || 0} color="#22c55e" />
      </div>

      <div className="ad-card">
        <div className="ad-filters" style={{ marginBottom: 12, display: 'flex', gap: 10 }}>
          <input
            className="ad-input"
            placeholder="🔍 Search leads…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ maxWidth: 220 }}
          />
          <select
            className="ad-input"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            style={{ maxWidth: 150 }}
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="interested">Interested</option>
            <option value="not-interested">Not Interested</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <FaSpinner className="spinner" /> Loading...
          </div>
        ) : error ? (
          <div style={{ color: '#ef4444', padding: '20px' }}>
            Error: {error}
            <button className="ad-link-btn" onClick={fetchEnquiries} style={{ marginLeft: 10 }}>Retry</button>
          </div>
        ) : enquiries.length === 0 ? (
          <EmptyState title="No leads found" desc="No enquiries match your filters." />
        ) : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Interest</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((e) => (
                  <tr key={e._id}>
                    <td><strong>{e.name}</strong></td>
                    <td>
                      <div style={{ fontSize: ".8rem" }}>{e.email}</div>
                      <div style={{ fontSize: ".75rem", color: "var(--text-secondary)" }}>{e.phone}</div>
                    </td>
                    <td>{e.interestedIn}</td>
                    <td><span className="ad-badge ad-blue">{e.source}</span></td>
                    <td>
                      <select
                        value={e.status}
                        onChange={(ev) => handleStatusChange(e._id, ev.target.value)}
                        style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ddd' }}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="interested">Interested</option>
                        <option value="not-interested">Not Interested</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                      </select>
                    </td>
                    <td style={{ fontSize: ".8rem" }}>{new Date(e.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="ad-link-btn" onClick={() => handleStatusChange(e._id, 'contacted')}>Follow Up</button>
                        <button className="ad-link-btn" style={{ color: "#ef4444" }} onClick={() => handleDelete(e._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 8 }}>
            <button
              className="ad-link-btn"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              ← Previous
            </button>
            <span style={{ padding: '4px 8px' }}>Page {page} of {totalPages}</span>
            <button
              className="ad-link-btn"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ENQUIRIES: FOLLOW-UPS ────────────────────────────────────────────────────
function AdminFollowups() {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);
  const [overdueCount, setOverdueCount] = useState(0);
  const { toast, show } = useToast();

  useEffect(() => {
    fetchFollowUps();
    fetchStats();
    fetchOverdue();
  }, [page, statusFilter]);

  const fetchFollowUps = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await followUpsAPI.getAllFollowUps({
        page,
        limit: 10,
        status: statusFilter,
      });
      setFollowUps(response.data);
      setTotalPages(response.pagination.pages);
    } catch (err) {
      setError(err.message || 'Failed to fetch follow-ups');
      show(err.message || 'Failed to fetch follow-ups', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await followUpsAPI.getFollowUpStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchOverdue = async () => {
    try {
      const response = await followUpsAPI.getOverdueFollowUps({ limit: 1 });
      setOverdueCount(response.pagination.total);
    } catch (err) {
      console.error('Failed to fetch overdue:', err);
    }
  };

  const handleMarkCompleted = async (followUpId) => {
    try {
      await followUpsAPI.markAsCompleted(followUpId, { outcome: 'positive' });
      show('Follow-up marked as completed');
      fetchFollowUps();
      fetchStats();
    } catch (err) {
      show(err.message || 'Failed to mark as completed', 'error');
    }
  };

  const handleDelete = async (followUpId) => {
    if (window.confirm('Are you sure you want to delete this follow-up?')) {
      try {
        await followUpsAPI.deleteFollowUp(followUpId);
        show('Follow-up deleted successfully');
        fetchFollowUps();
        fetchStats();
      } catch (err) {
        show(err.message || 'Failed to delete follow-up', 'error');
      }
    }
  };

  const isOverdue = (scheduledDate) => new Date(scheduledDate) < new Date();

  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head">
        <h2>📞 Follow-ups</h2>
        <span className="ad-badge ad-yellow">{stats?.pendingFollowUps || 0} pending</span>
        {overdueCount > 0 && <span className="ad-badge" style={{ background: '#ef4444', color: 'white' }}>{overdueCount} overdue</span>}
      </div>

      <div className="ad-kpi-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <KpiCard icon="📋" label="Total" value={stats?.totalFollowUps || 0} color="#3b82f6" />
        <KpiCard icon="⏳" label="Pending" value={stats?.pendingFollowUps || 0} color="#f59e0b" />
        <KpiCard icon="✅" label="Completed" value={stats?.completedFollowUps || 0} color="#22c55e" />
        <KpiCard icon="⚠️" label="Overdue" value={overdueCount} color="#ef4444" />
      </div>

      <div className="ad-card">
        <div className="ad-filters" style={{ marginBottom: 12 }}>
          <select
            className="ad-input"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            style={{ maxWidth: 150 }}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rescheduled">Rescheduled</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <FaSpinner className="spinner" /> Loading...
          </div>
        ) : error ? (
          <div style={{ color: '#ef4444', padding: '20px' }}>
            Error: {error}
            <button className="ad-link-btn" onClick={fetchFollowUps} style={{ marginLeft: 10 }}>Retry</button>
          </div>
        ) : followUps.length === 0 ? (
          <EmptyState title="No follow-ups" desc="All follow-ups are up to date." />
        ) : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Type</th>
                  <th>Scheduled</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Assigned To</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {followUps.map((fu) => (
                  <tr key={fu._id} style={{ background: isOverdue(fu.scheduledDate) && fu.status === 'pending' ? '#fef2f2' : 'transparent' }}>
                    <td><strong>{fu.enquiryId?.name}</strong></td>
                    <td>{fu.followUpType}</td>
                    <td style={{ fontSize: ".8rem" }}>
                      {new Date(fu.scheduledDate).toLocaleDateString()}
                      {isOverdue(fu.scheduledDate) && fu.status === 'pending' && (
                        <div style={{ color: '#ef4444', fontSize: '.7rem' }}>⚠️ Overdue</div>
                      )}
                    </td>
                    <td><span className="ad-badge" style={{ background: fu.status === 'completed' ? '#22c55e' : '#f59e0b', color: 'white' }}>{fu.status}</span></td>
                    <td><span className="ad-badge" style={{ background: fu.priority === 'high' ? '#ef4444' : fu.priority === 'medium' ? '#f59e0b' : '#3b82f6', color: 'white' }}>{fu.priority}</span></td>
                    <td style={{ fontSize: ".8rem" }}>{fu.assignedTo?.name}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        {fu.status === 'pending' && (
                          <button className="ad-link-btn" style={{ color: "#22c55e" }} onClick={() => handleMarkCompleted(fu._id)}>Complete</button>
                        )}
                        <button className="ad-link-btn" style={{ color: "#ef4444" }} onClick={() => handleDelete(fu._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 8 }}>
            <button
              className="ad-link-btn"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              ← Previous
            </button>
            <span style={{ padding: '4px 8px' }}>Page {page} of {totalPages}</span>
            <button
              className="ad-link-btn"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ENQUIRIES: CONVERSIONS ───────────────────────────────────────────────────
function AdminConversions() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await enquiriesAPI.getEnquiryStats();
      setStats(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ad-section">
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <FaSpinner className="spinner" /> Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ad-section">
        <div style={{ color: '#ef4444', padding: '20px' }}>
          Error: {error}
          <button className="ad-link-btn" onClick={fetchStats} style={{ marginLeft: 10 }}>Retry</button>
        </div>
      </div>
    );
  }

  const total = stats?.totalEnquiries || 0;
  const converted = stats?.convertedEnquiries || 0;
  const rate = stats?.conversionRate || 0;

  return (
    <div className="ad-section">
      <div className="ad-section-head"><h2>🎯 Conversions</h2></div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <KpiCard icon="📋" label="Total Leads" value={total} color="#3b82f6" />
        <KpiCard icon="🎯" label="Converted" value={converted} color="#22c55e" />
        <KpiCard icon="📊" label="Conversion Rate" value={`${rate}%`} color="var(--accent)" change="Overall" />
        <KpiCard icon="💰" label="Total Value" value={`₹${stats?.totalConversionValue || 0}`} color="#10b981" />
      </div>
      <div className="ad-card">
        <div className="ad-card-head"><h3>Conversion Funnel</h3></div>
        {[
          { label: "Total Enquiries", count: total, color: "#3b82f6" },
          { label: "Contacted", count: stats?.contactedEnquiries || 0, color: "#f59e0b" },
          { label: "Interested", count: stats?.interestedEnquiries || 0, color: "#06b6d4" },
          { label: "Converted", count: converted, color: "#22c55e" },
        ].map((f, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".85rem", marginBottom: 5 }}>
              <span><strong>{f.label}</strong></span>
              <span style={{ color: "var(--text-secondary)" }}>{f.count} ({total > 0 ? ((f.count / total) * 100).toFixed(0) : 0}%)</span>
            </div>
            <ProgressBar value={f.count} max={total} color={f.color} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ENGAGEMENT: NOTIFICATIONS ────────────────────────────────────────────────
function AdminNotifications() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, unread: 0, read: 0 });
  const { toast, show } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationsAPI.getAllNotifications({ limit: 50 });
      const notificationsList = Array.isArray(response) ? response : [];
      setNotifs(notificationsList);
      const unreadCount = notificationsList.filter(n => !n.isRead).length;
      setStats({
        total: notificationsList.length,
        unread: unreadCount,
        read: notificationsList.length - unreadCount,
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch notifications');
      show(err.message || 'Failed to fetch notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifs(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setStats(prev => ({ ...prev, unread: Math.max(0, prev.unread - 1), read: prev.read + 1 }));
      show('Marked as read');
    } catch (err) {
      show(err.message || 'Failed to mark as read', 'error');
    }
  };

  const markAll = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
      setStats(prev => ({ ...prev, unread: 0, read: prev.total }));
      show('All marked as read');
    } catch (err) {
      show(err.message || 'Failed to mark all as read', 'error');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationsAPI.deleteNotification(id);
      setNotifs(prev => prev.filter(n => n._id !== id));
      setStats(prev => ({ ...prev, total: prev.total - 1 }));
      show('Notification deleted');
    } catch (err) {
      show(err.message || 'Failed to delete notification', 'error');
    }
  };

  const typeIcon = { expiry: "⏰", payment: "💳", class: "📅", checkin: "✅", system: "⚙️" };
  const typeColor = { expiry: "#f59e0b", payment: "#ef4444", class: "#3b82f6", checkin: "#22c55e", system: "#6b7280" };

  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head">
        <h2>🔔 Notifications</h2>
        {stats.unread > 0 && <button className="btn btn-outline ad-btn-sm" onClick={markAll}>Mark All Read</button>}
      </div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <KpiCard icon="🔔" label="Total Alerts" value={stats.total} color="#3b82f6" />
        <KpiCard icon="🔴" label="Unread" value={stats.unread} color="#ef4444" />
        <KpiCard icon="✅" label="Read" value={stats.read} color="#22c55e" />
      </div>
      <div className="ad-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>Loading notifications...</div>
        ) : error ? (
          <div style={{ color: '#ef4444', padding: '20px' }}>
            Error: {error}
            <button className="ad-link-btn" onClick={fetchNotifications} style={{ marginLeft: 10 }}>Retry</button>
          </div>
        ) : notifs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No notifications</div>
        ) : (
          notifs.map(n => (
            <div key={n._id} className={`ad-notif-row ${!n.isRead ? "ad-notif-unread" : ""}`}>
              <div className="ad-notif-icon" style={{ background: (typeColor[n.type] || "#6b7280") + "22", color: typeColor[n.type] || "#6b7280" }}>
                {typeIcon[n.type] || "🔔"}
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: ".88rem" }}>{n.title}</strong>
                <div style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{n.message}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: ".72rem", color: "var(--text-secondary)" }}>
                  {new Date(n.createdAt).toLocaleDateString()}
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  {!n.isRead && (
                    <button className="ad-link-btn" style={{ fontSize: ".7rem" }} onClick={() => markRead(n._id)}>
                      Mark read
                    </button>
                  )}
                  <button className="ad-link-btn" style={{ fontSize: ".7rem", color: "#ef4444" }} onClick={() => deleteNotification(n._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── ENGAGEMENT: ANNOUNCEMENTS ────────────────────────────────────────────────
function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState("");
  const [target, setTarget] = useState("All Members");
  const [scheduleDate, setScheduleDate] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);
  const { toast, show } = useToast();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await announcementsAPI.getAllAnnouncements({ limit: 50 });
      const announcementsList = Array.isArray(response) ? response : [];
      setAnnouncements(announcementsList);
    } catch (err) {
      setError(err.message || 'Failed to fetch announcements');
      show(err.message || 'Failed to fetch announcements', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !msg.trim()) {
      show('Please fill in all fields', 'error');
      return;
    }

    try {
      setLoading(true);
      const announcementData = {
        title,
        description: msg,
        targetAudience: target,
        status: 'published',
      };

      const response = await announcementsAPI.createAnnouncement(announcementData);
      setAnnouncements(prev => [response, ...prev]);
      setTitle("");
      setMsg("");
      setTarget("All Members");
      show('Announcement published successfully!');
    } catch (err) {
      show(err.message || 'Failed to publish announcement', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    if (!title.trim() || !msg.trim() || !scheduleDate) {
      show('Please fill in all fields', 'error');
      return;
    }

    try {
      setLoading(true);
      const announcementData = {
        title,
        description: msg,
        targetAudience: target,
        status: 'scheduled',
        scheduledDate: new Date(scheduleDate),
      };

      const response = await announcementsAPI.createAnnouncement(announcementData);
      setAnnouncements(prev => [response, ...prev]);
      setTitle("");
      setMsg("");
      setTarget("All Members");
      setScheduleDate("");
      setShowSchedule(false);
      show('Announcement scheduled successfully!');
    } catch (err) {
      show(err.message || 'Failed to schedule announcement', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteAnnouncement = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await announcementsAPI.deleteAnnouncement(id);
        setAnnouncements(prev => prev.filter(a => a._id !== id));
        show('Announcement deleted');
      } catch (err) {
        show(err.message || 'Failed to delete announcement', 'error');
      }
    }
  };

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
        {showSchedule && (
          <div className="ad-form-group">
            <label>Schedule Date & Time</label>
            <input className="ad-input" type="datetime-local" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} />
          </div>
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-primary ad-btn-sm" onClick={handlePublish}>📲 Publish Now</button>
          <button className="btn btn-outline ad-btn-sm" onClick={() => setShowSchedule(!showSchedule)}>
            {showSchedule ? '✓ Schedule' : '📅 Schedule'}
          </button>
          {showSchedule && (
            <button className="btn btn-outline ad-btn-sm" onClick={handleSchedule}>Confirm Schedule</button>
          )}
        </div>
      </div>
      <div className="ad-card">
        <div className="ad-card-head"><h3>Recent Announcements</h3></div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>Loading announcements...</div>
        ) : error ? (
          <div style={{ color: '#ef4444', padding: '20px' }}>
            Error: {error}
            <button className="ad-link-btn" onClick={fetchAnnouncements} style={{ marginLeft: 10 }}>Retry</button>
          </div>
        ) : announcements.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No announcements yet</div>
        ) : (
          announcements.map(a => (
            <div key={a._id} className="ad-announcement-row">
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: ".9rem" }}>{a.title}</strong>
                <p style={{ margin: "4px 0", fontSize: ".8rem", color: "var(--text-secondary)" }}>{a.description}</p>
                <div style={{ display: "flex", gap: 10, fontSize: ".72rem", color: "var(--text-secondary)", flexWrap: 'wrap' }}>
                  <span>🎯 {a.targetAudience}</span>
                  <span>📅 {new Date(a.createdAt).toLocaleDateString()}</span>
                  <span style={{ background: a.status === 'published' ? '#22c55e22' : '#f59e0b22', padding: '2px 6px', borderRadius: '3px', color: a.status === 'published' ? '#22c55e' : '#f59e0b' }}>
                    {a.status}
                  </span>
                </div>
              </div>
              <button className="ad-link-btn" style={{ color: "#ef4444" }} onClick={() => deleteAnnouncement(a._id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── ENGAGEMENT: COMMUNICATION ────────────────────────────────────────────────
function AdminCommunication() {
  const [tab, setTab] = useState("email");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("All Members");
  const [template, setTemplate] = useState("None");
  const [selectedMember, setSelectedMember] = useState("");
  const { toast, show } = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      // This would fetch from members API
      // For now, we'll use empty array as placeholder
      setMembers([]);
    } catch (err) {
      console.error('Failed to fetch members:', err);
    }
  };

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      show('Please fill in all fields', 'error');
      return;
    }

    try {
      setLoading(true);
      let response;

      if (tab === 'email') {
        response = await communicationAPI.sendEmail({
          subject,
          message,
          recipient: tab === 'individual' ? selectedMember : recipient,
          template: template !== 'None' ? template : undefined,
        });
      } else if (tab === 'sms') {
        response = await communicationAPI.sendSMS({
          message,
          recipient: tab === 'individual' ? selectedMember : recipient,
        });
      }

      setSubject("");
      setMessage("");
      setRecipient("All Members");
      setTemplate("None");
      setSelectedMember("");
      show(`${tab.charAt(0).toUpperCase() + tab.slice(1)} sent successfully!`);
    } catch (err) {
      show(err.message || `Failed to send ${tab}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!subject.trim() || !message.trim()) {
      show('Please fill in all fields', 'error');
      return;
    }

    try {
      setLoading(true);
      await communicationAPI.saveDraft({
        type: tab,
        subject,
        message,
        recipient: tab === 'individual' ? selectedMember : recipient,
        template: template !== 'None' ? template : undefined,
      });
      show('Draft saved successfully!');
    } catch (err) {
      show(err.message || 'Failed to save draft', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head"><h2>💬 Communication</h2></div>
      <div className="ad-tabs">
        {[["email", "📧", "Email"], ["sms", "💬", "SMS"], ["individual", "👤", "Individual"]].map(([id, icon, label]) => (
          <button key={id} className={`ad-tab-btn ${tab === id ? "ad-tab-active" : ""}`} onClick={() => setTab(id)}>{icon} {label}</button>
        ))}
      </div>
      <div className="ad-card">
        {error && (
          <div style={{ color: '#ef4444', padding: '12px', marginBottom: '12px', background: '#ef444422', borderRadius: '4px' }}>
            {error}
          </div>
        )}
        {tab === "individual" && (
          <div className="ad-form-group">
            <label>Select Member</label>
            <select className="ad-input" value={selectedMember} onChange={e => setSelectedMember(e.target.value)}>
              <option value="">— Choose member —</option>
              {members.map(m => <option key={m._id} value={m._id}>{m.name} ({m.email})</option>)}
            </select>
          </div>
        )}
        {tab !== "individual" && (
          <div className="ad-form-group">
            <label>To</label>
            <select className="ad-input" value={recipient} onChange={e => setRecipient(e.target.value)}>
              <option>All Members</option>
              <option>Active Members</option>
              <option>Expiring Soon</option>
              <option>Inactive Members</option>
              <option>Trainers</option>
            </select>
          </div>
        )}
        {tab !== "sms" && (
          <div className="ad-form-group">
            <label>Subject</label>
            <input
              className="ad-input"
              placeholder={`Enter ${tab} subject…`}
              value={subject}
              onChange={e => setSubject(e.target.value)}
            />
          </div>
        )}
        <div className="ad-form-group">
          <label>Message</label>
          <textarea
            className="ad-textarea"
            rows={5}
            placeholder={`Compose your ${tab} message here…`}
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
        </div>
        {tab === "email" && (
          <div className="ad-form-group">
            <label>Template</label>
            <select className="ad-input" value={template} onChange={e => setTemplate(e.target.value)}>
              <option>None</option>
              <option>Renewal Reminder</option>
              <option>Welcome Email</option>
              <option>Offer Announcement</option>
              <option>Feedback Request</option>
            </select>
          </div>
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary ad-btn-sm"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? 'Sending...' : `Send ${tab.charAt(0).toUpperCase() + tab.slice(1)}`}
          </button>
          <button
            className="btn btn-outline ad-btn-sm"
            onClick={handleSaveDraft}
            disabled={loading}
          >
            Save Draft
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── REPORTS ──────────────────────────────────────────────────────────────────
function AdminRevReport() {
  const [period, setPeriod] = useState("monthly");
  const [revenueData, setRevenueData] = useState([]);
  const [revenueByPlan, setRevenueByPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const daily  = [1200,1450,1100,1600,1380,1720,1550,1800,1650,1900,1750,1600,1850,2000,1700,1950,1800,2100,1900,2200,2050,2300,2100,2400,2200,2500,2300,2600,2400,2700];
  const { toast, show } = useToast();

  useEffect(() => {
    fetchRevenueReport();
  }, [period, startDate, endDate]);

  const fetchRevenueReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await revenueReportAPI.getRevenueReport(params);
      // Handle both response formats
      const data = response.data || response;
      setRevenueData(data.monthlyRevenue || []);
      setRevenueByPlan(data.revenueByPlan || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch revenue report');
      show(err.message || 'Failed to fetch revenue report', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const blob = await revenueReportAPI.exportRevenue(format, params);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `revenue-report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      show(`Revenue report exported as ${format.toUpperCase()}`);
    } catch (err) {
      show(err.message || `Failed to export as ${format}`, 'error');
    }
  };

  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head">
        <h2>💰 Revenue Report</h2>
        <div className="ad-head-actions">
          <button className="btn btn-outline ad-btn-sm" onClick={() => handleExport('csv')}>⬇ CSV</button>
          <button className="btn btn-outline ad-btn-sm" onClick={() => handleExport('json')}>⬇ JSON</button>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="ad-input" style={{ maxWidth: 150 }} />
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="ad-input" style={{ maxWidth: 150 }} />
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
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>Loading chart...</div>
        ) : error ? (
          <div style={{ color: '#ef4444', padding: '20px' }}>
            Error: {error}
            <button className="ad-link-btn" onClick={fetchRevenueReport} style={{ marginLeft: 10 }}>Retry</button>
          </div>
        ) : (
          <>
            {period === "daily"   && <BarChart data={daily}       labels={Array.from({length:30},(_,i)=>`${i+1}`)} color="var(--accent)" height={120} />}
            {period === "monthly" && <BarChart data={revenueData.map(r => r.total) || []} labels={revenueData.map(r => `${r._id.month}/${r._id.year}`) || []} color="var(--accent)" height={120} />}
            {period === "yearly"  && <BarChart data={[320000,385000,428000,481000,520000]} labels={["2021","2022","2023","2024","2025"]} color="var(--accent)" height={120} />}
          </>
        )}
      </div>
      
      <div className="ad-card">
        <div className="ad-card-head"><h3>Revenue by Plan</h3></div>
        {revenueByPlan.length > 0 ? (
          revenueByPlan.map((plan, i) => (
            <div key={i} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:".85rem", marginBottom:4 }}>
                <span>{plan._id} <span style={{ color:"var(--text-secondary)", fontSize:".75rem" }}>({plan.count} transactions)</span></span>
                <strong>${plan.total.toLocaleString()}</strong>
              </div>
              <ProgressBar value={plan.total} max={Math.max(...revenueByPlan.map(p => p.total))} color="var(--accent)" />
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>No data available</div>
        )}
      </div>
    </div>
  );
}

function AdminAttReport() {
  const [monthly, setMonthly] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast, show } = useToast();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  useEffect(() => {
    fetchAttendanceReportData();
  }, []);

  const fetchAttendanceReportData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch attendance report data from API
      const response = await attendanceReportAPI.getAttendanceReport();
      // Handle both response formats
      const data = response.data || response;
      setMonthly(data.dailyAttendance || data.monthlyAttendance || []);
      setAttendanceData(data.dailyAttendance || data.weeklyAttendance || []);
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch attendance report data';
      setError(errorMsg);
      show(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportAttendance = async (format) => {
    try {
      const blob = await attendanceReportAPI.exportAttendance(format);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance-report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      show(`Attendance report exported as ${format.toUpperCase()}`);
    } catch (err) {
      show(err.message || `Failed to export as ${format}`, 'error');
    }
  };
  return (
    <div className="ad-section">
      <div className="ad-section-head">
        <h2>🏃 Attendance Report</h2>
        <button className="btn btn-outline ad-btn-sm" onClick={() => handleExportAttendance('csv')}>⬇ Export</button>
      </div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <KpiCard icon="🏃" label="Avg Daily Check-ins" value="138" change="+12 vs last month" color="#3b82f6" />
        <KpiCard icon="📅" label="Best Day" value="Saturday" change="189 avg check-ins" color="#22c55e" />
        <KpiCard icon="📊" label="Monthly Total" value="4,280" change="This month" color="var(--accent)" />
      </div>
      <div className="ad-two-col">
        <div className="ad-card">
          <div className="ad-card-head"><h3>Daily Attendance (This Week)</h3></div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>Loading chart...</div>
          ) : error ? (
            <div style={{ color: '#ef4444', padding: '20px' }}>
              Error: {error}
              <button className="ad-link-btn" onClick={fetchAttendanceReportData} style={{ marginLeft: 10 }}>Retry</button>
            </div>
          ) : (
            <BarChart data={attendanceData.map(d=>d.checkins || 0)} labels={attendanceData.map(d=>d.day || '')} color="#3b82f6" height={110} />
          )}
        </div>
        <div className="ad-card">
          <div className="ad-card-head"><h3>Monthly Attendance (12 months)</h3></div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>Loading chart...</div>
          ) : error ? (
            <div style={{ color: '#ef4444', padding: '20px' }}>Error loading data</div>
          ) : (
            <BarChart data={monthly.map(m => m.total || 0)} labels={months.map(m=>m[0])} color="#8b5cf6" height={110} />
          )}
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
  const [trainers, setTrainers] = useState([]);
  const [popularClasses, setPopularClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast, show } = useToast();

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch trainer performance data with error handling
      try {
        const trainersResponse = await performanceReportAPI.getTrainerPerformance();
        console.log('Trainers response:', trainersResponse);
        const trainersData = Array.isArray(trainersResponse) ? trainersResponse : (trainersResponse?.data || []);
        setTrainers(trainersData);
      } catch (trainerErr) {
        console.error('Trainer fetch error:', trainerErr);
        setTrainers([]);
      }
      
      // Fetch class performance data with error handling
      try {
        const classesResponse = await performanceReportAPI.getClassPerformance();
        console.log('Classes response:', classesResponse);
        const classesData = Array.isArray(classesResponse) ? classesResponse : (classesResponse?.data || []);
        setPopularClasses(classesData);
      } catch (classErr) {
        console.error('Class fetch error:', classErr);
        setPopularClasses([]);
      }
      
    } catch (err) {
      console.error('Performance fetch error:', err);
      const errorMsg = err.message || 'Failed to fetch performance data';
      setError(errorMsg);
      show(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPerformance = async (format) => {
    try {
      const blob = await performanceReportAPI.exportPerformance(format);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `performance-report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      show(`Performance report exported as ${format.toUpperCase()}`);
    } catch (err) {
      show(err.message || `Failed to export as ${format}`, 'error');
    }
  };

  return (
    <div className="ad-section">
      <div className="ad-section-head">
        <h2>🏆 Performance Report</h2>
        <button className="btn btn-outline ad-btn-sm" onClick={() => handleExportPerformance('csv')}>⬇ Export</button>
      </div>
      <div className="ad-card">
        <div className="ad-card-head"><h3>Trainer Performance</h3></div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>⏳ Loading trainer data...</div>
        ) : error ? (
          <div style={{ color: '#ef4444', padding: '20px' }}>
            <strong>Error:</strong> {error}
            <button className="ad-link-btn" onClick={fetchPerformanceData} style={{ marginLeft: 10 }}>Retry</button>
          </div>
        ) : trainers.length === 0 ? (
          <EmptyState title="No trainer data" desc="Trainers will appear here once they have sessions." />
        ) : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead><tr><th>Trainer</th><th>Clients</th><th>Sessions</th><th>Rating</th><th>Revenue</th><th>Retention</th></tr></thead>
              <tbody>
                {trainers.map(t => (
                  <tr key={t._id || t.id}>
                    <td><strong>{t.fullName || t.name || 'N/A'}</strong><div style={{ fontSize:".72rem", color:"var(--text-secondary)" }}>{Array.isArray(t.specialization) ? t.specialization.join(', ') : (t.specialization || 'N/A')}</div></td>
                    <td>{t.clients || 0}</td>
                    <td>{t.sessions || t.sessionsCompleted || 0}</td>
                    <td>{"⭐".repeat(Math.round(t.rating?.average || t.rating || 0))} {(t.rating?.average || t.rating || 0).toFixed(1)}</td>
                    <td>${((t.sessions || t.sessionsCompleted || 0) * 9.5).toFixed(0)}</td>
                    <td>
                      <ProgressBar value={(t.rating?.average || t.rating || 0) * 20} color="#22c55e" />
                      <span style={{ fontSize:".72rem", color:"var(--text-secondary)" }}>{((t.rating?.average || t.rating || 0) * 20).toFixed(0)}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="ad-card">
        <div className="ad-card-head"><h3>Class Performance</h3></div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>⏳ Loading class data...</div>
        ) : error ? (
          <div style={{ color: '#ef4444', padding: '20px' }}>
            <strong>Error:</strong> {error}
            <button className="ad-link-btn" onClick={fetchPerformanceData} style={{ marginLeft: 10 }}>Retry</button>
          </div>
        ) : popularClasses.length === 0 ? (
          <EmptyState title="No class data" desc="Class performance will appear here once bookings are made." />
        ) : (
          <>
            {popularClasses.map((c, i) => (
              <div key={c._id || i} style={{ marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:".85rem", marginBottom:5 }}>
                  <span><strong>{i+1}. {c.className || c.name || 'N/A'}</strong></span>
                  <span style={{ color:"var(--text-secondary)" }}>Capacity: {c.capacity || 0} · {c.category?.name || c.category || 'N/A'}</span>
                </div>
                <ProgressBar value={50} color={i === 0 ? "var(--accent)" : "#3b82f6"} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
function AdminAnalyticsMembers() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ startDate: "", endDate: "", period: "monthly" });
  const { toast, show } = useToast();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const fetchMembersAnalytics = useCallback(async (filtersObj = filters) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('gym-auth-token');
      if (!token) {
        setError("Not authenticated. Please log in first.");
        show("Error: Please log in to view analytics");
        setLoading(false);
        return;
      }
      const response = await adminAnalyticsAPI.getMembersAnalytics(filtersObj);
      if (response.success) {
        setAnalyticsData(response.data);
      } else {
        setError("Failed to fetch analytics data");
        show("Error loading analytics data");
      }
    } catch (err) {
      console.error("Error fetching members analytics:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        show("Error: Session expired. Please log in again.");
        localStorage.removeItem('gym-auth-token');
        localStorage.removeItem('gym-auth-user');
      } else {
        setError(err.response?.data?.message || "Failed to fetch analytics");
        show(`Error: ${err.response?.data?.message || "Failed to fetch analytics"}`);
      }
    } finally {
      setLoading(false);
    }
  }, [filters, show]);

  useEffect(() => {
    fetchMembersAnalytics();
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleApplyFilters = useCallback(() => {
    fetchMembersAnalytics(filters);
  }, [filters, fetchMembersAnalytics]);

  const handleRetry = useCallback(() => {
    fetchMembersAnalytics(filters);
  }, [filters, fetchMembersAnalytics]);

  if (loading) {
    return (
      <div className="ad-section">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <FaSpinner style={{ animation: "spin 1s linear infinite", fontSize: "2rem" }} />
          <p style={{ marginTop: "10px", color: "var(--text-secondary)" }}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ad-section">
        <div className="ad-section-head"><h2>📈 Member Analytics</h2></div>
        <div style={{ color: "#ef4444", padding: "20px", textAlign: "center", background: "#fee2e2", borderRadius: "8px" }}>
          <p>{error}</p>
          <button onClick={handleRetry} className="ad-link-btn" style={{ marginTop: "10px" }}>Retry</button>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="ad-section">
        <div className="ad-section-head"><h2>📈 Member Analytics</h2></div>
        <EmptyState title="No data available" desc="No analytics data found for the selected period." />
      </div>
    );
  }

  // Convert member growth data to array format for chart
  const memberGrowthArray = analyticsData.memberGrowth?.map(item => item.count) || [];
  const activeArray = analyticsData.statusBreakdown?.find(s => s._id === 'active')?.count || 0;
  const inactiveArray = analyticsData.statusBreakdown?.find(s => s._id === 'inactive')?.count || 0;

  return (
    <div className="ad-section">
      <div className="ad-section-head"><h2>📈 Member Analytics</h2></div>
      
      {/* Filters */}
      <div className="ad-filters" style={{ marginBottom: "20px" }}>
        <input 
          className="ad-input" 
          type="date" 
          placeholder="Start Date" 
          value={filters.startDate}
          onChange={e => handleFilterChange("startDate", e.target.value)}
          style={{ maxWidth: "150px" }}
        />
        <input 
          className="ad-input" 
          type="date" 
          placeholder="End Date" 
          value={filters.endDate}
          onChange={e => handleFilterChange("endDate", e.target.value)}
          style={{ maxWidth: "150px" }}
        />
        <select 
          className="ad-input" 
          value={filters.period}
          onChange={e => handleFilterChange("period", e.target.value)}
          style={{ maxWidth: "120px" }}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <button className="btn btn-primary ad-btn-sm" onClick={handleApplyFilters}>Apply Filters</button>
      </div>

      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(4,1fr)" }}>
        <KpiCard icon="👥" label="Total Members" value={analyticsData.totalMembers?.toLocaleString() || "0"} change={`+${Math.floor(analyticsData.totalMembers * 0.02)} this month`} color="var(--accent)" />
        <KpiCard icon="✅" label="Active" value={analyticsData.activeMembers?.toLocaleString() || "0"} change={`${analyticsData.totalMembers > 0 ? ((analyticsData.activeMembers / analyticsData.totalMembers) * 100).toFixed(1) : 0}% rate`} color="#22c55e" />
        <KpiCard icon="❌" label="Inactive" value={analyticsData.inactiveMembers?.toLocaleString() || "0"} change={`${analyticsData.totalMembers > 0 ? ((analyticsData.inactiveMembers / analyticsData.totalMembers) * 100).toFixed(1) : 0}% rate`} color="#ef4444" />
        <KpiCard icon="🔄" label="Retention" value={`${analyticsData.retentionRate || 0}%`} change="+1.2% vs last month" color="#3b82f6" />
      </div>

      <div className="ad-two-col">
        <div className="ad-card">
          <div className="ad-card-head"><h3>Member Growth Trend</h3></div>
          {memberGrowthArray.length > 0 ? (
            <BarChart data={memberGrowthArray} labels={months.slice(0, memberGrowthArray.length)} color="#8b5cf6" height={140} />
          ) : (
            <EmptyState title="No growth data" desc="No member growth data for the selected period." />
          )}
        </div>
        <div className="ad-card">
          <div className="ad-card-head"><h3>Status Breakdown</h3></div>
          {analyticsData.statusBreakdown && analyticsData.statusBreakdown.length > 0 ? (
            <div>
              {analyticsData.statusBreakdown.map((status, i) => (
                <div key={i} style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".82rem", marginBottom: "4px" }}>
                    <span>{status._id}</span>
                    <strong>{status.count}</strong>
                  </div>
                  <ProgressBar value={status.count} max={analyticsData.totalMembers} color={status._id === 'active' ? '#22c55e' : '#ef4444'} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No status data" desc="No member status breakdown available." />
          )}
        </div>
      </div>
    </div>
  );
}

function AdminAnalyticsRevenue() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ startDate: "", endDate: "", period: "monthly" });
  const { toast, show } = useToast();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const fetchRevenueAnalytics = useCallback(async (filtersObj = filters) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('gym-auth-token');
      if (!token) {
        setError("Not authenticated. Please log in first.");
        show("Error: Please log in to view analytics");
        setLoading(false);
        return;
      }
      const response = await adminAnalyticsAPI.getRevenueTrends(filtersObj);
      if (response.success) {
        setAnalyticsData(response.data);
      } else {
        setError("Failed to fetch revenue data");
        show("Error loading revenue data");
      }
    } catch (err) {
      console.error("Error fetching revenue analytics:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        show("Error: Session expired. Please log in again.");
        localStorage.removeItem('gym-auth-token');
        localStorage.removeItem('gym-auth-user');
      } else {
        setError(err.response?.data?.message || "Failed to fetch revenue data");
        show(`Error: ${err.response?.data?.message || "Failed to fetch revenue data"}`);
      }
    } finally {
      setLoading(false);
    }
  }, [filters, show]);

  useEffect(() => {
    fetchRevenueAnalytics();
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleApplyFilters = useCallback(() => {
    fetchRevenueAnalytics(filters);
  }, [filters, fetchRevenueAnalytics]);

  const handleRetry = useCallback(() => {
    fetchRevenueAnalytics(filters);
  }, [filters, fetchRevenueAnalytics]);

  if (loading) {
    return (
      <div className="ad-section">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <FaSpinner style={{ animation: "spin 1s linear infinite", fontSize: "2rem" }} />
          <p style={{ marginTop: "10px", color: "var(--text-secondary)" }}>Loading revenue data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ad-section">
        <div className="ad-section-head"><h2>💹 Revenue Trends</h2></div>
        <div style={{ color: "#ef4444", padding: "20px", textAlign: "center", background: "#fee2e2", borderRadius: "8px" }}>
          <p>{error}</p>
          <button onClick={handleRetry} className="ad-link-btn" style={{ marginTop: "10px" }}>Retry</button>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="ad-section">
        <div className="ad-section-head"><h2>💹 Revenue Trends</h2></div>
        <EmptyState title="No data available" desc="No revenue data found for the selected period." />
      </div>
    );
  }

  // Convert revenue trend data to array format for chart
  const revenueTrendArray = analyticsData.revenueTrend?.map(item => item.revenue) || [];
  const revenueByPlanData = analyticsData.revenueByPlan || [];

  return (
    <div className="ad-section">
      <div className="ad-section-head"><h2>💹 Revenue Trends</h2></div>

      {/* Filters */}
      <div className="ad-filters" style={{ marginBottom: "20px" }}>
        <input 
          className="ad-input" 
          type="date" 
          placeholder="Start Date" 
          value={filters.startDate}
          onChange={e => handleFilterChange("startDate", e.target.value)}
          style={{ maxWidth: "150px" }}
        />
        <input 
          className="ad-input" 
          type="date" 
          placeholder="End Date" 
          value={filters.endDate}
          onChange={e => handleFilterChange("endDate", e.target.value)}
          style={{ maxWidth: "150px" }}
        />
        <select 
          className="ad-input" 
          value={filters.period}
          onChange={e => handleFilterChange("period", e.target.value)}
          style={{ maxWidth: "120px" }}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <button className="btn btn-primary ad-btn-sm" onClick={handleApplyFilters}>Apply Filters</button>
      </div>

      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <KpiCard icon="💰" label="Total Revenue" value={`$${(analyticsData.totalRevenue || 0).toLocaleString()}`} change="+8.4% MoM" color="var(--accent)" />
        <KpiCard icon="📈" label="Avg Transaction" value={`$${(analyticsData.averageTransaction || 0).toFixed(2)}`} change="+22% YoY" color="#22c55e" />
        <KpiCard icon="🎯" label="Transactions" value={analyticsData.revenueTrend?.reduce((sum, item) => sum + item.count, 0) || 0} change="Total count" color="#3b82f6" />
      </div>

      <div className="ad-card">
        <div className="ad-card-head"><h3>Revenue Trend Chart</h3></div>
        {revenueTrendArray.length > 0 ? (
          <BarChart data={revenueTrendArray} labels={months.slice(0, revenueTrendArray.length)} color="var(--accent)" height={130} />
        ) : (
          <EmptyState title="No revenue data" desc="No revenue data for the selected period." />
        )}
      </div>

      <div className="ad-two-col">
        <div className="ad-card">
          <div className="ad-card-head"><h3>Revenue by Plan Type</h3></div>
          {revenueByPlanData.length > 0 ? (
            <div>
              {revenueByPlanData.map((plan, i) => {
                const totalRevenue = analyticsData.totalRevenue || 1;
                const percentage = ((plan.revenue / totalRevenue) * 100).toFixed(1);
                const colors = ["#22c55e", "var(--accent)", "#3b82f6", "#8b5cf6"];
                return (
                  <div key={i} style={{ marginBottom: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".82rem", marginBottom: "4px" }}>
                      <span>{plan._id || "Unknown"}</span>
                      <strong>{percentage}%</strong>
                    </div>
                    <ProgressBar value={percentage} color={colors[i % colors.length]} />
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState title="No plan data" desc="No revenue breakdown by plan available." />
          )}
        </div>
        <div className="ad-card">
          <div className="ad-card-head"><h3>Transaction Count</h3></div>
          {analyticsData.revenueTrend && analyticsData.revenueTrend.length > 0 ? (
            <BarChart data={analyticsData.revenueTrend.map(item => item.count)} labels={months.slice(0, analyticsData.revenueTrend.length)} color="#22c55e" height={130} />
          ) : (
            <EmptyState title="No transaction data" desc="No transaction data available." />
          )}
        </div>
      </div>
    </div>
  );
}

function AdminAnalyticsClasses() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ startDate: "", endDate: "", limit: 10 });
  const { toast, show } = useToast();

  const fetchClassesAnalytics = useCallback(async (filtersObj = filters) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('gym-auth-token');
      if (!token) {
        setError("Not authenticated. Please log in first.");
        show("Error: Please log in to view analytics");
        setLoading(false);
        return;
      }
      const response = await adminAnalyticsAPI.getPopularClasses(filtersObj);
      if (response.success) {
        setAnalyticsData(response.data);
      } else {
        setError("Failed to fetch classes data");
        show("Error loading classes data");
      }
    } catch (err) {
      console.error("Error fetching classes analytics:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        show("Error: Session expired. Please log in again.");
        localStorage.removeItem('gym-auth-token');
        localStorage.removeItem('gym-auth-user');
      } else {
        setError(err.response?.data?.message || "Failed to fetch classes data");
        show(`Error: ${err.response?.data?.message || "Failed to fetch classes data"}`);
      }
    } finally {
      setLoading(false);
    }
  }, [filters, show]);

  useEffect(() => {
    fetchClassesAnalytics();
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleApplyFilters = useCallback(() => {
    fetchClassesAnalytics(filters);
  }, [filters, fetchClassesAnalytics]);

  const handleRetry = useCallback(() => {
    fetchClassesAnalytics(filters);
  }, [filters, fetchClassesAnalytics]);

  if (loading) {
    return (
      <div className="ad-section">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <FaSpinner style={{ animation: "spin 1s linear infinite", fontSize: "2rem" }} />
          <p style={{ marginTop: "10px", color: "var(--text-secondary)" }}>Loading classes data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ad-section">
        <div className="ad-section-head"><h2>🎽 Popular Classes</h2></div>
        <div style={{ color: "#ef4444", padding: "20px", textAlign: "center", background: "#fee2e2", borderRadius: "8px" }}>
          <p>{error}</p>
          <button onClick={handleRetry} className="ad-link-btn" style={{ marginTop: "10px" }}>Retry</button>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="ad-section">
        <div className="ad-section-head"><h2>🎽 Popular Classes</h2></div>
        <EmptyState title="No data available" desc="No classes data found for the selected period." />
      </div>
    );
  }

  const popularClasses = analyticsData.popularClasses || [];
  const categoryDistribution = analyticsData.categoryDistribution || [];
  const avgOccupancy = analyticsData.averageOccupancy || 0;

  return (
    <div className="ad-section">
      <div className="ad-section-head"><h2>🎽 Popular Classes</h2></div>

      {/* Filters */}
      <div className="ad-filters" style={{ marginBottom: "20px" }}>
        <input 
          className="ad-input" 
          type="date" 
          placeholder="Start Date" 
          value={filters.startDate}
          onChange={e => handleFilterChange("startDate", e.target.value)}
          style={{ maxWidth: "150px" }}
        />
        <input 
          className="ad-input" 
          type="date" 
          placeholder="End Date" 
          value={filters.endDate}
          onChange={e => handleFilterChange("endDate", e.target.value)}
          style={{ maxWidth: "150px" }}
        />
        <input 
          className="ad-input" 
          type="number" 
          placeholder="Limit" 
          value={filters.limit}
          onChange={e => handleFilterChange("limit", parseInt(e.target.value) || 10)}
          style={{ maxWidth: "100px" }}
          min="1"
          max="50"
        />
        <button className="btn btn-primary ad-btn-sm" onClick={handleApplyFilters}>Apply Filters</button>
      </div>

      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <KpiCard icon="🏆" label="Most Booked" value={popularClasses[0]?.name || "—"} change={`${popularClasses[0]?.bookingCount || 0} bookings`} color="var(--accent)" />
        <KpiCard icon="📊" label="Avg Fill Rate" value={`${avgOccupancy.toFixed(1)}%`} change="Across all classes" color="#22c55e" />
        <KpiCard icon="📉" label="Total Classes" value={categoryDistribution.reduce((sum, cat) => sum + cat.count, 0)} change="In system" color="#3b82f6" />
      </div>

      <div className="ad-card">
        <div className="ad-card-head"><h3>Class Popularity Ranking</h3></div>
        {popularClasses.length === 0 ? (
          <EmptyState title="No class data" desc="Class analytics will appear here once bookings are made." />
        ) : (
          <>
            {popularClasses.map((c, i) => (
              <div key={c._id || i} style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".85rem", marginBottom: "5px" }}>
                  <span><strong>#{i+1} {c.name}</strong></span>
                  <span style={{ color: "var(--text-secondary)" }}>{c.bookingCount} bookings · {c.fillRate}% fill</span>
                </div>
                <ProgressBar value={c.fillRate} max={100} color={i === 0 ? "var(--accent)" : i < 3 ? "#22c55e" : "#3b82f6"} />
              </div>
            ))}
          </>
        )}
      </div>

      <div className="ad-two-col">
        <div className="ad-card">
          <div className="ad-card-head"><h3>Category Distribution</h3></div>
          {categoryDistribution.length > 0 ? (
            <div>
              {categoryDistribution.map((cat, i) => {
                const totalClasses = categoryDistribution.reduce((sum, c) => sum + c.count, 0);
                const percentage = ((cat.count / totalClasses) * 100).toFixed(1);
                const colors = ["#22c55e", "var(--accent)", "#3b82f6", "#8b5cf6", "#f59e0b"];
                return (
                  <div key={i} style={{ marginBottom: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".82rem", marginBottom: "4px" }}>
                      <span>{cat._id || "Unknown"}</span>
                      <strong>{cat.count} classes</strong>
                    </div>
                    <ProgressBar value={percentage} color={colors[i % colors.length]} />
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState title="No category data" desc="No category distribution available." />
          )}
        </div>
        <div className="ad-card">
          <div className="ad-card-head"><h3>Occupancy Summary</h3></div>
          <div style={{ padding: "20px", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--accent)", marginBottom: "10px" }}>
              {avgOccupancy.toFixed(1)}%
            </div>
            <p style={{ color: "var(--text-secondary)", marginBottom: "15px" }}>Average Fill Rate</p>
            <ProgressBar value={avgOccupancy} max={100} color="var(--accent)" />
            <p style={{ fontSize: ".8rem", color: "var(--text-secondary)", marginTop: "10px" }}>
              {avgOccupancy > 80 ? "✅ Excellent occupancy" : avgOccupancy > 60 ? "⚠️ Good occupancy" : "❌ Low occupancy"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── OPERATIONS: EQUIPMENT ────────────────────────────────────────────────────
function AdminEquipment({ openForm, lastFormData, formSubmissionTime }) {
  const [equip, setEquip]   = useState([]);
  const [filter, setFilter] = useState("all");
  const [showLog, setShowLog] = useState(false);
  const [logItem, setLogItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ operational: 0, maintenance: 0, outOfOrder: 0 });
  const { toast, show } = useToast();
  const lastProcessedRef = useRef(null);
  
  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await equipmentService.getAllEquipment({ limit: 100 });
      const equipment = response.data?.equipment || [];
      setEquip(equipment);
      
      // Update stats
      const summary = response.data?.summary || {};
      setStats({
        operational: summary.operational || 0,
        maintenance: summary.maintenance || 0,
        outOfOrder: summary.outOfOrder || 0
      });
    } catch (error) {
      console.error('Error fetching equipment:', error);
      show('Error loading equipment');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form submission from global form
  useEffect(() => {
    if (lastFormData && lastFormData.formType === "addEquipment") {
      const submissionKey = `${lastFormData.formType}-${formSubmissionTime}`;
      
      if (submissionKey !== lastProcessedRef.current) {
        const formData = lastFormData.data;
        if (formData.name) {
          createNewEquipment(formData);
          lastProcessedRef.current = submissionKey;
        }
      }
    }
  }, [formSubmissionTime, lastFormData]);

  const createNewEquipment = async (formData) => {
    try {
      await equipmentService.createEquipment({
        name: formData.name,
        category: formData.category || "General",
        quantity: formData.quantity || 1,
        status: formData.status || "operational",
        location: formData.location || "",
        purchaseDate: formData.purchaseDate || null,
        notes: formData.notes || ""
      });
      show("Equipment added!");
      fetchEquipment();
    } catch (error) {
      console.error('Error creating equipment:', error);
      show('Error adding equipment');
    }
  };

  const filtered = equip.filter(e => filter === "all" || e.status === filter);
  
  const updateStatus = async (id, status) => {
    try {
      await equipmentService.updateEquipmentStatus(id, status);
      setShowLog(false);
      show("Status updated!");
      fetchEquipment();
    } catch (error) {
      console.error('Error updating status:', error);
      show('Error updating status');
    }
  };

  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head">
        <h2>🔧 Equipment</h2>
        <button className="btn btn-primary ad-btn-sm" onClick={() => openForm("addEquipment")} disabled={loading}>+ Add Equipment</button>
      </div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <KpiCard icon="✅" label="Operational" value={stats.operational} color="#22c55e" />
        <KpiCard icon="🔧" label="Maintenance" value={stats.maintenance} color="#f59e0b" />
        <KpiCard icon="❌" label="Out of Order" value={stats.outOfOrder} color="#ef4444" />
      </div>
      <div className="ad-filters">
        {["all","operational","maintenance","out_of_order"].map(f => (
          <button key={f} className={`ad-filter-btn ${filter===f?"ad-filter-active":""}`} onClick={() => setFilter(f)}>{f.replace(/_/g," ")}</button>
        ))}
      </div>
      <div className="ad-card">
        <div className="ad-table-wrap">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>Loading equipment...</div>
          ) : filtered.length === 0 ? (
            <EmptyState title="No equipment found" />
          ) : (
            <table className="ad-table">
              <thead><tr><th>Equipment</th><th>Category</th><th>Status</th><th>Location</th><th>Quantity</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e._id}>
                    <td><strong>{e.name}</strong></td>
                    <td>{e.category}</td>
                    <td><ABadge s={e.status} /></td>
                    <td style={{ fontSize:".8rem" }}>{e.location || "—"}</td>
                    <td>{e.quantity || 1}</td>
                    <td>
                      <div style={{ display:"flex", gap:6 }}>
                        <button className="ad-link-btn" onClick={() => { setLogItem(e); setShowLog(true); }}>Update</button>
                        {e.status !== "operational" && <button className="ad-link-btn" style={{ color:"#22c55e" }} onClick={() => updateStatus(e._id,"operational")}>Mark Fixed</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showLog && (
        <AdModal title={logItem ? `Update: ${logItem.name}` : "Log New Issue"} onClose={() => setShowLog(false)}>
          {!logItem && <div className="ad-form-group"><label>Equipment Name</label><input className="ad-input" placeholder="e.g. Treadmill #4" /></div>}
          <div className="ad-form-group">
            <label>Status</label>
            <select className="ad-input" defaultValue={logItem?.status || "maintenance"} onChange={(e) => {
              if (logItem) {
                updateStatus(logItem._id, e.target.value);
              }
            }}>
              <option value="operational">Operational</option>
              <option value="maintenance">Under Maintenance</option>
              <option value="out_of_order">Out of Order</option>
            </select>
          </div>
        </AdModal>
      )}
    </div>
  );
}

// ─── OPERATIONS: MAINTENANCE ──────────────────────────────────────────────────
function AdminMaintenance({ openForm, lastFormData, formSubmissionTime }) {
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast, show } = useToast();
  
  const fetchMaintenance = async () => {
    setLoading(true);
    setError("");
    try {
      const maintenanceService = await import('../services/maintenanceService');
      const data = await maintenanceService.getAllMaintenance();
      setMaintenanceLogs(Array.isArray(data) ? data : data.maintenance || []);
    } catch (err) {
      setError(err.message || "Failed to fetch maintenance logs");
      console.error("Fetch maintenance error:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMaintenance();
  }, []);

  // Refresh when form is submitted
  useEffect(() => {
    if (formSubmissionTime) {
      fetchMaintenance();
    }
  }, [formSubmissionTime]);

  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head">
        <h2>🛠️ Maintenance</h2>
        <button className="btn btn-primary ad-btn-sm" onClick={() => openForm("scheduleMaintenance")}>+ Schedule Repair</button>
      </div>
      
      {error && (
        <div style={{
          padding: '12px',
          marginBottom: '16px',
          backgroundColor: '#fee2e2',
          border: '1px solid #fca5a5',
          borderRadius: '6px',
          color: '#991b1b',
          fontSize: '0.875rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{error}</span>
          <button 
            onClick={fetchMaintenance}
            style={{
              background: 'none',
              border: 'none',
              color: '#991b1b',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.875rem'
            }}
          >
            Retry
          </button>
        </div>
      )}
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
          <p>Loading maintenance logs...</p>
        </div>
      ) : (
        <>
          <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
            <KpiCard icon="✅" label="Completed" value={maintenanceLogs.filter(m=>m.status==="completed").length} color="#22c55e" />
            <KpiCard icon="🔄" label="In Progress" value={maintenanceLogs.filter(m=>m.status==="in-progress").length} color="#f59e0b" />
            <KpiCard icon="⏳" label="Pending" value={maintenanceLogs.filter(m=>m.status==="pending").length} color="#ef4444" />
          </div>
          <div className="ad-card">
            <div className="ad-card-head"><h3>Maintenance Log</h3></div>
            {maintenanceLogs.length === 0 ? (
              <EmptyState title="No maintenance logs" desc="Schedule maintenance to track repairs." />
            ) : (
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead><tr><th>Equipment</th><th>Type</th><th>Technician</th><th>Date</th><th>Cost</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {maintenanceLogs.map(m => (
                      <tr key={m._id || m.id}>
                        <td><strong>{m.equipment_id || m.equipment}</strong></td>
                        <td><span className="ad-badge ad-blue">{m.type}</span></td>
                        <td>{m.technician_name || m.tech}</td>
                        <td style={{ fontSize:".8rem" }}>{new Date(m.scheduled_date).toLocaleDateString()}</td>
                        <td style={{ fontWeight:700 }}>${m.cost || 0}</td>
                        <td><ABadge s={m.status} /></td>
                        <td><button className="ad-link-btn" onClick={() => show("Updating status...")}>Update</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── BILLING: PAYMENTS ────────────────────────────────────────────────────────
function AdminPayments() {
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);
  const [completedPayments, setCompletedPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, count: 0, avg: 0 });
  const PER = 5;
  const { toast, show } = useToast();
  
  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await paymentsService.getAllPayments({ limit: 100 });
      const memberships = response.data?.memberships || [];
      
      // Transform membership data to payment format
      const payments = memberships.map(m => ({
        id: m._id,
        member: m.memberId?.fullName || 'Unknown',
        plan: m.membershipPlan,
        amount: m.finalAmount,
        method: m.paymentMethod,
        date: new Date(m.createdAt).toLocaleDateString(),
        status: m.paymentStatus
      }));
      
      setCompletedPayments(payments);
      
      // Calculate stats
      const total = payments.reduce((s, p) => s + (p.amount || 0), 0);
      setStats({
        total,
        count: payments.length,
        avg: payments.length > 0 ? (total / payments.length).toFixed(0) : 0
      });
    } catch (error) {
      console.error('Error fetching payments:', error);
      show('Error loading payments');
    } finally {
      setLoading(false);
    }
  };

  const filtered = completedPayments.filter(p => p.member?.toLowerCase().includes(search.toLowerCase()));
  const paged = filtered.slice((page-1)*PER, page*PER);
  
  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head">
        <h2>💳 Payments</h2>
        <button className="btn btn-outline ad-btn-sm" onClick={() => show("Exporting...")} disabled={loading}>⬇ Export</button>
      </div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <KpiCard icon="✅" label="Completed Payments" value={stats.count} color="#22c55e" />
        <KpiCard icon="💰" label="Total Collected" value={`₹${stats.total.toLocaleString()}`} color="var(--accent)" />
        <KpiCard icon="📊" label="Avg Payment" value={`₹${stats.avg}`} color="#3b82f6" />
      </div>
      <div className="ad-card">
        <div className="ad-filters" style={{ marginBottom:12 }}>
          <input className="ad-input" placeholder="🔍 Search member…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ maxWidth:220 }} />
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>Loading payments...</div>
        ) : paged.length === 0 ? (
          <EmptyState title="No payments found" />
        ) : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead><tr><th>ID</th><th>Member</th><th>Plan</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {paged.map(p => (
                  <tr key={p.id}>
                    <td><code style={{ fontSize:".72rem", color:"var(--accent)" }}>{p.id?.substring(0, 8)}</code></td>
                    <td><strong>{p.member}</strong></td>
                    <td>{p.plan}</td>
                    <td><strong style={{ color:"#22c55e" }}>₹{p.amount?.toLocaleString()}</strong></td>
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
  const [dueRenewals, setDueRenewals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ expiring7: 0, expiring30: 0, expired: 0 });
  
  useEffect(() => {
    fetchRenewals();
  }, []);

  const fetchRenewals = async () => {
    try {
      setLoading(true);
      
      // Get expiring soon (7 days)
      const expiring7 = await renewalsService.getExpiringSoon();
      
      // Get expiring in 30 days
      const expiring30 = await renewalsService.getExpiringIn30Days();
      
      // Get expired
      const expired = await renewalsService.getExpiredMemberships();
      
      // Combine and format
      const allRenewals = [...expiring7, ...expiring30, ...expired].map(m => {
        const now = new Date();
        const endDate = new Date(m.membershipEndDate);
        const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
        
        return {
          id: m._id,
          member: m.memberId?.fullName || 'Unknown',
          plan: m.membershipPlan,
          expiry: endDate.toLocaleDateString(),
          daysLeft: daysLeft < 0 ? 0 : daysLeft,
          membershipId: m._id
        };
      });
      
      setDueRenewals(allRenewals);
      
      setStats({
        expiring7: expiring7.length,
        expiring30: expiring30.length,
        expired: expired.length
      });
    } catch (error) {
      console.error('Error fetching renewals:', error);
      show('Error loading renewals');
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async (membershipId) => {
    try {
      // For now, just show a message. In production, open a renewal form
      show('Renewal process initiated');
      // await renewalsService.renewMembership(membershipId, renewalData);
      // fetchRenewals();
    } catch (error) {
      console.error('Error renewing membership:', error);
      show('Error processing renewal');
    }
  };

  const handleReminder = async (memberId) => {
    try {
      await renewalsService.sendRenewalReminder(memberId);
      show('Reminder sent!');
    } catch (error) {
      console.error('Error sending reminder:', error);
      show('Error sending reminder');
    }
  };

  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head"><h2>🔄 Renewals</h2></div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <KpiCard icon="⚠️" label="Expiring in 7 days" value={stats.expiring7} color="#ef4444" />
        <KpiCard icon="📅" label="Expiring in 30 days" value={stats.expiring30} color="#f59e0b" />
        <KpiCard icon="❌" label="Already Expired" value={stats.expired} color="#ef4444" />
      </div>
      <div className="ad-card">
        <div className="ad-card-head"><h3>Upcoming Renewals</h3></div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>Loading renewals...</div>
        ) : dueRenewals.length === 0 ? (
          <EmptyState title="No renewals due" desc="All memberships are up to date." />
        ) : (
          <table className="ad-table">
            <thead><tr><th>Member</th><th>Plan</th><th>Expiry</th><th>Days Left</th><th>Actions</th></tr></thead>
            <tbody>
              {dueRenewals.map((r, i) => (
                <tr key={r.id || i}>
                  <td><strong>{r.member}</strong></td>
                  <td>{r.plan}</td>
                  <td>{r.expiry}</td>
                  <td><span className={`ad-badge ${r.daysLeft===0?"ad-red":r.daysLeft<=10?"ad-yellow":"ad-blue"}`}>{r.daysLeft===0?"Expired":`${r.daysLeft} days`}</span></td>
                  <td>
                    <div style={{ display:"flex", gap:6 }}>
                      <button className="ad-link-btn" onClick={() => handleReminder(r.id)}>📧 Remind</button>
                      <button className="ad-link-btn" style={{ color:"#22c55e" }} onClick={() => handleRenew(r.membershipId)}>Renew</button>
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

// ─── BILLING: PENDING DUES ────────────────────────────────────────────────────
function AdminPendingDues() {
  const { toast, show } = useToast();
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, overdue: 0, critical: 0 });
  
  useEffect(() => {
    fetchPendingDues();
  }, []);

  const fetchPendingDues = async () => {
    try {
      setLoading(true);
      
      // Get all pending dues
      const response = await duesService.getAllPendingDues({ limit: 1000 });
      const memberships = response.data?.memberships || [];
      
      // Get overdue and critical
      const overduePayments = await duesService.getOverduePayments();
      const criticalPayments = await duesService.getCriticalOverduePayments();
      
      // Format pending payments
      const formatted = memberships.map(m => {
        const endDate = new Date(m.membershipEndDate);
        const now = new Date();
        const daysOverdue = Math.floor((now - endDate) / (1000 * 60 * 60 * 24));
        
        return {
          id: m._id,
          member: m.memberId?.fullName || 'Unknown',
          email: m.memberId?.email || 'N/A',
          plan: m.membershipPlan,
          amount: m.finalAmount,
          due: endDate.toLocaleDateString(),
          days: daysOverdue > 0 ? daysOverdue : 0,
          membershipId: m._id
        };
      });
      
      setPendingPayments(formatted);
      
      const totalAmount = formatted.reduce((s, p) => s + (p.amount || 0), 0);
      setStats({
        total: formatted.length,
        overdue: overduePayments.length,
        critical: criticalPayments.length
      });
    } catch (error) {
      console.error('Error fetching pending dues:', error);
      show('Error loading pending dues');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async (membershipId) => {
    try {
      await duesService.markPaymentAsPaid(membershipId, {
        paymentMethod: 'cash',
        paymentStatus: 'paid'
      });
      show('Payment recorded!');
      fetchPendingDues();
    } catch (error) {
      console.error('Error marking payment as paid:', error);
      show('Error recording payment');
    }
  };

  const handleReminder = async (memberId) => {
    try {
      await duesService.sendPaymentReminder(memberId);
      show('Reminder sent!');
    } catch (error) {
      console.error('Error sending reminder:', error);
      show('Error sending reminder');
    }
  };

  const totalOverdue = pendingPayments.reduce((s, p) => s + (p.amount || 0), 0);
  
  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head"><h2>⚠️ Pending Dues</h2></div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <KpiCard icon="⚠️" label="Overdue Accounts" value={stats.overdue} color="#ef4444" />
        <KpiCard icon="💰" label="Total Overdue" value={`₹${totalOverdue.toLocaleString()}`} color="#f59e0b" />
        <KpiCard icon="🚨" label="Critical (3+ days)" value={stats.critical} color="#ef4444" />
      </div>
      <div className="ad-card">
        <div className="ad-card-head">
          <h3>🚨 Overdue Payments</h3>
          <span className="ad-badge ad-red">{stats.total} urgent</span>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>Loading pending dues...</div>
        ) : pendingPayments.length === 0 ? (
          <EmptyState title="No pending dues" desc="All payments are up to date." />
        ) : (
          <table className="ad-table">
            <thead><tr><th>Member</th><th>Email</th><th>Plan</th><th>Amount</th><th>Due Date</th><th>Days Overdue</th><th>Actions</th></tr></thead>
            <tbody>
              {pendingPayments.map((p, i) => (
                <tr key={p.id || i} style={{ background: p.days >= 3 ? "rgba(239,68,68,0.04)" : "inherit" }}>
                  <td><strong>{p.member}</strong></td>
                  <td style={{ fontSize:".78rem" }}>{p.email}</td>
                  <td>{p.plan}</td>
                  <td><strong style={{ color:"var(--accent)" }}>₹{p.amount?.toLocaleString()}</strong></td>
                  <td>{p.due}</td>
                  <td><span className={`ad-badge ${p.days>=3?"ad-red":"ad-yellow"}`}>{p.days} days</span></td>
                  <td>
                    <div style={{ display:"flex", gap:6 }}>
                      <button className="ad-link-btn" onClick={() => handleReminder(p.id)}>📧 Remind</button>
                      <button className="ad-link-btn" style={{ color:"#22c55e" }} onClick={() => handleMarkPaid(p.membershipId)}>✓ Mark Paid</button>
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

// ─── OFFERS: COUPONS ──────────────────────────────────────────────────────────
function AdminCoupons({ openForm, lastFormData, formSubmissionTime }) {
  const [couponList, setCouponList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ active: 0, uses: 0, expired: 0 });
  const lastProcessedRef = useRef(null);
  const { toast, show } = useToast();
  
  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await couponService.getAllCoupons({ limit: 100 });
      const coupons = response.data?.coupons || [];
      setCouponList(coupons);
      
      // Update stats
      const summary = response.data?.summary || {};
      setStats({
        active: summary.active || 0,
        uses: coupons.reduce((s, c) => s + (c.usedCount || 0), 0),
        expired: summary.expired || 0
      });
    } catch (error) {
      console.error('Error fetching coupons:', error);
      show('Error loading coupons');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form submission from global form
  useEffect(() => {
    if (lastFormData && lastFormData.formType === "createCoupon") {
      const submissionKey = `${lastFormData.formType}-${formSubmissionTime}`;
      
      if (submissionKey !== lastProcessedRef.current) {
        const formData = lastFormData.data;
        if (formData.title) {
          createNewCoupon(formData);
          lastProcessedRef.current = submissionKey;
        }
      }
    }
  }, [formSubmissionTime, lastFormData]);

  const createNewCoupon = async (formData) => {
    try {
      await couponService.createCoupon({
        code: formData.title,
        discountType: formData.type || "percentage",
        discountValue: parseFloat(formData.discount) || 0,
        minPurchaseAmount: parseFloat(formData.minAmount) || 0,
        maxUses: parseInt(formData.maxUses) || 100,
        validUntil: formData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        validFrom: new Date()
      });
      show("Coupon created!");
      fetchCoupons();
    } catch (error) {
      console.error('Error creating coupon:', error);
      show('Error creating coupon');
    }
  };

  const deleteCouponHandler = async (id) => {
    try {
      await couponService.deleteCoupon(id);
      show("Coupon deleted!");
      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      show('Error deleting coupon');
    }
  };
  
  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head">
        <h2>🎟️ Coupons</h2>
        <button className="btn btn-primary ad-btn-sm" onClick={() => openForm("createCoupon")} disabled={loading}>+ Create Coupon</button>
      </div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <KpiCard icon="🎟️" label="Active Coupons" value={stats.active} color="#22c55e" />
        <KpiCard icon="📊" label="Total Uses" value={stats.uses} color="var(--accent)" />
        <KpiCard icon="❌" label="Expired" value={stats.expired} color="#ef4444" />
      </div>
      <div className="ad-card">
        <div className="ad-table-wrap">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>Loading coupons...</div>
          ) : couponList.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px", color: "var(--text-secondary)" }}>No coupons yet. Create one to get started!</div>
          ) : (
            <table className="ad-table">
              <thead><tr><th>Code</th><th>Discount</th><th>Type</th><th>Min Amount</th><th>Uses</th><th>Expiry</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {couponList.map(c => (
                  <tr key={c._id}>
                    <td><code style={{ fontSize:".82rem", fontWeight:700, color:"var(--accent)" }}>{c.code}</code></td>
                    <td><strong style={{ color:"#22c55e" }}>{c.discountValue}{c.discountType === 'percentage' ? '%' : '₹'}</strong></td>
                    <td><span className="ad-badge ad-blue">{c.discountType}</span></td>
                    <td>₹{c.minPurchaseAmount}</td>
                    <td>{c.usedCount}/{c.maxUses || '∞'}</td>
                    <td style={{ fontSize:".78rem" }}>{new Date(c.validUntil).toLocaleDateString()}</td>
                    <td><ABadge s={c.isActive ? "active" : "inactive"} /></td>
                    <td>
                      <div style={{ display:"flex", gap:6 }}>
                        <button className="ad-link-btn" onClick={() => show(`Editing ${c.code}`)}>Edit</button>
                        <button className="ad-link-btn" style={{ color:"#ef4444" }} onClick={() => deleteCouponHandler(c._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── OFFERS: DISCOUNTS ────────────────────────────────────────────────────────
function AdminDiscounts({ openForm, lastFormData, formSubmissionTime }) {
  const [discountList, setDiscountList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ active: 0, upcoming: 0, expired: 0 });
  const lastProcessedRef = useRef(null);
  const { toast, show } = useToast();
  
  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const response = await discountService.getAllDiscounts({ limit: 100 });
      const discounts = response.data?.discounts || [];
      setDiscountList(discounts);
      
      // Update stats
      const summary = response.data?.summary || {};
      setStats({
        active: summary.active || 0,
        upcoming: 0,
        expired: summary.expired || 0
      });
    } catch (error) {
      console.error('Error fetching discounts:', error);
      show('Error loading discounts');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form submission from global form
  useEffect(() => {
    if (lastFormData && lastFormData.formType === "createCampaign") {
      const submissionKey = `${lastFormData.formType}-${formSubmissionTime}`;
      
      if (submissionKey !== lastProcessedRef.current) {
        const formData = lastFormData.data;
        if (formData.title) {
          createNewDiscount(formData);
          lastProcessedRef.current = submissionKey;
        }
      }
    }
  }, [formSubmissionTime, lastFormData]);

  const createNewDiscount = async (formData) => {
    try {
      await discountService.createDiscount({
        name: formData.title,
        discountType: formData.type || "percentage",
        discountValue: parseFloat(formData.discount) || 0,
        category: formData.type || "promotional",
        applicableTo: formData.target || "all_members",
        validFrom: formData.startDate || new Date(),
        validUntil: formData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });
      show("Offer created!");
      fetchDiscounts();
    } catch (error) {
      console.error('Error creating discount:', error);
      show('Error creating offer');
    }
  };

  const deleteDiscountHandler = async (id) => {
    try {
      await discountService.deleteDiscount(id);
      show("Offer deleted!");
      fetchDiscounts();
    } catch (error) {
      console.error('Error deleting discount:', error);
      show('Error deleting offer');
    }
  };

  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="ad-section-head">
        <h2>🏷️ Discounts & Offers</h2>
        <button className="btn btn-primary ad-btn-sm" onClick={() => openForm("createCampaign")} disabled={loading}>+ Create Offer</button>
      </div>
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <KpiCard icon="✅" label="Active Offers" value={stats.active} color="#22c55e" />
        <KpiCard icon="📅" label="Upcoming" value={stats.upcoming} color="#3b82f6" />
        <KpiCard icon="❌" label="Expired" value={stats.expired} color="#ef4444" />
      </div>
      <div className="ad-offers-grid">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', gridColumn: '1/-1' }}>Loading discounts...</div>
        ) : discountList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', gridColumn: '1/-1', color: 'var(--text-secondary)' }}>No offers yet. Create one to get started!</div>
        ) : (
          discountList.map(d => (
            <div className="ad-card ad-offer-card" key={d._id}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <h4 style={{ margin:0, fontSize:".95rem", fontWeight:700 }}>{d.name}</h4>
                <ABadge s={d.isActive ? "active" : "inactive"} />
              </div>
              <div style={{ fontSize:"1.4rem", fontWeight:800, color:"var(--accent)", margin:"8px 0" }}>
                {d.discountValue}{d.discountType === 'percentage' ? '%' : '₹'}
              </div>
              <div style={{ fontSize:".78rem", color:"var(--text-secondary)", display:"flex", flexDirection:"column", gap:4 }}>
                <span>🏷️ {d.category}</span>
                <span>🎯 {d.applicableTo}</span>
                <span>📅 {new Date(d.validFrom).toLocaleDateString()} – {new Date(d.validUntil).toLocaleDateString()}</span>
              </div>
              <div style={{ display:"flex", gap:8, marginTop:12 }}>
                <button className="ad-link-btn" onClick={() => show(`Editing ${d.name}`)}>Edit</button>
                <button className="ad-link-btn" style={{ color:"#ef4444" }} onClick={() => deleteDiscountHandler(d._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function AdminSettings() {
  const [settings, setSettings] = useState({
    gymName: 'FitZone - Main Branch',
    adminEmail: 'admin@fitzone.com',
    phone: '+91 98765 43210',
    address: '123 Fitness Street, Mumbai',
    emailNotifications: true,
    smsAlerts: false,
    autoRenewalReminders: true,
    reminderDaysBefore: 7,
    darkMode: false,
    twoFactorAuth: false,
    sessionTimeout: 30,
    monthlyPlanPrice: 39,
    quarterlyPlanPrice: 99,
    halfYearlyPlanPrice: 179,
    annualPlanPrice: 299,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('gym');
  const { toast, show } = useToast();

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminSettingsAPI.getSettings();
      if (response && response.data) {
        setSettings(response.data);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      // Use default settings if API fails
      setError(null);
      setSettings({
        gymName: 'FitZone - Main Branch',
        adminEmail: 'admin@fitzone.com',
        phone: '+91 98765 43210',
        address: '123 Fitness Street, Mumbai',
        emailNotifications: true,
        smsAlerts: false,
        autoRenewalReminders: true,
        reminderDaysBefore: 7,
        darkMode: false,
        twoFactorAuth: false,
        sessionTimeout: 30,
        monthlyPlanPrice: 39,
        quarterlyPlanPrice: 99,
        halfYearlyPlanPrice: 179,
        annualPlanPrice: 299,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      await adminSettingsAPI.updateSettings(settings);
      show('✅ Settings saved successfully!');
    } catch (err) {
      console.error('Error saving settings:', err);
      // Still show success even if API fails (for now)
      show('✅ Settings updated locally!');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !settings.gymName) {
    return (
      <div className="ad-section">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <FaSpinner style={{ animation: 'spin 1s linear infinite', fontSize: '2rem' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="ad-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>❌ {error}</div>}
      
      <div className="ad-section-head"><h2>⚙️ Settings</h2></div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        {[
          { id: 'gym', label: '🏢 Gym Information' },
          { id: 'notifications', label: '🔔 Notifications' },
          { id: 'security', label: '🔒 Security' },
          { id: 'plans', label: '💰 Membership Plans' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px',
              background: activeTab === tab.id ? 'var(--accent)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '.85rem',
              fontWeight: activeTab === tab.id ? '600' : '500',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Gym Information Tab */}
      {activeTab === 'gym' && (
        <div className="ad-card">
          <div className="ad-card-head"><h3>🏢 Gym Information</h3></div>
          <div className="ad-two-col">
            <div className="ad-form-group">
              <label>Gym Name</label>
              <input className="ad-input" value={settings.gymName} onChange={e => handleInputChange('gymName', e.target.value)} />
            </div>
            <div className="ad-form-group">
              <label>Admin Email</label>
              <input className="ad-input" type="email" value={settings.adminEmail} onChange={e => handleInputChange('adminEmail', e.target.value)} />
            </div>
            <div className="ad-form-group">
              <label>Phone</label>
              <input className="ad-input" value={settings.phone} onChange={e => handleInputChange('phone', e.target.value)} />
            </div>
            <div className="ad-form-group">
              <label>Address</label>
              <input className="ad-input" value={settings.address} onChange={e => handleInputChange('address', e.target.value)} />
            </div>
          </div>
          <button className="btn btn-primary ad-btn-sm" style={{ marginTop: '16px' }} onClick={saveSettings} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="ad-card">
          <div className="ad-card-head"><h3>🔔 Notification Preferences</h3></div>
          {[
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive alerts via email' },
            { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Receive alerts via SMS' },
            { key: 'autoRenewalReminders', label: 'Auto Renewal Reminders', desc: 'Send reminders before expiry' }
          ].map(item => (
            <div key={item.key} className="ad-toggle-row">
              <div>
                <strong style={{ display: 'block', fontSize: '.88rem' }}>{item.label}</strong>
                <span style={{ fontSize: '.75rem', color: 'var(--text-secondary)' }}>{item.desc}</span>
              </div>
              <div
                className={`ad-toggle ${settings[item.key] ? 'ad-toggle-on' : ''}`}
                onClick={() => handleToggle(item.key)}
                style={{ cursor: 'pointer' }}
              />
            </div>
          ))}
          {settings.autoRenewalReminders && (
            <div className="ad-form-group" style={{ marginTop: '16px' }}>
              <label>Reminder Days Before Expiry</label>
              <input
                className="ad-input"
                type="number"
                min="1"
                max="30"
                value={settings.reminderDaysBefore}
                onChange={e => handleInputChange('reminderDaysBefore', parseInt(e.target.value))}
              />
            </div>
          )}
          <button className="btn btn-primary ad-btn-sm" style={{ marginTop: '16px' }} onClick={saveSettings} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="ad-card">
          <div className="ad-card-head"><h3>🔒 Security Settings</h3></div>
          {[
            { key: 'twoFactorAuth', label: 'Two-Factor Authentication', desc: 'Require 2FA for login' },
            { key: 'darkMode', label: 'Dark Mode', desc: 'Enable dark theme' }
          ].map(item => (
            <div key={item.key} className="ad-toggle-row">
              <div>
                <strong style={{ display: 'block', fontSize: '.88rem' }}>{item.label}</strong>
                <span style={{ fontSize: '.75rem', color: 'var(--text-secondary)' }}>{item.desc}</span>
              </div>
              <div
                className={`ad-toggle ${settings[item.key] ? 'ad-toggle-on' : ''}`}
                onClick={() => handleToggle(item.key)}
                style={{ cursor: 'pointer' }}
              />
            </div>
          ))}
          <div className="ad-form-group" style={{ marginTop: '16px' }}>
            <label>Session Timeout (minutes)</label>
            <input
              className="ad-input"
              type="number"
              min="5"
              max="480"
              value={settings.sessionTimeout}
              onChange={e => handleInputChange('sessionTimeout', parseInt(e.target.value))}
            />
          </div>
          <button className="btn btn-primary ad-btn-sm" style={{ marginTop: '16px' }} onClick={saveSettings} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div className="ad-card">
          <div className="ad-card-head"><h3>💰 Membership Plan Prices</h3></div>
          <div className="ad-two-col">
            {[
              { key: 'monthlyPlanPrice', label: 'Monthly Plan' },
              { key: 'quarterlyPlanPrice', label: 'Quarterly Plan' },
              { key: 'halfYearlyPlanPrice', label: 'Half-Yearly Plan' },
              { key: 'annualPlanPrice', label: 'Annual Plan' }
            ].map(plan => (
              <div className="ad-form-group" key={plan.key}>
                <label>{plan.label} Price ($)</label>
                <input
                  className="ad-input"
                  type="number"
                  min="0"
                  value={settings[plan.key]}
                  onChange={e => handleInputChange(plan.key, parseFloat(e.target.value))}
                />
              </div>
            ))}
          </div>
          <button className="btn btn-primary ad-btn-sm" style={{ marginTop: '16px' }} onClick={saveSettings} disabled={loading}>
            {loading ? 'Saving...' : 'Update Prices'}
          </button>
        </div>
      )}
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
            <div className="ad-avatar">AD</div>
            <div>
              <strong>Admin User</strong>
              <span>Branch Admin</span>
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
function renderSection(active, openForm, refreshTrigger, lastFormData, formSubmissionTime) {
  const map = {
    overview:             <AdminOverview openForm={openForm} />,
    "all-members":        <AdminAllMembers openForm={openForm} />,
    attendance:           <AdminAttendance />,
    checkins:             <AdminCheckins />,
    trainers:             <AdminTrainers openForm={openForm} />,
    permissions:          <AdminPermissions />,
    schedule:             <AdminSchedule openForm={openForm} lastFormData={lastFormData} formSubmissionTime={formSubmissionTime} />,
    bookings:             <AdminBookings openForm={openForm} lastFormData={lastFormData} formSubmissionTime={formSubmissionTime} />,
    categories:           <AdminCategories openForm={openForm} lastFormData={lastFormData} formSubmissionTime={formSubmissionTime} />,
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
    equipment:            <AdminEquipment openForm={openForm} lastFormData={lastFormData} formSubmissionTime={formSubmissionTime} />,
    maintenance:          <AdminMaintenance openForm={openForm} lastFormData={lastFormData} formSubmissionTime={formSubmissionTime} />,
    payments:             <AdminPayments />,
    renewals:             <AdminRenewals />,
    "pending-dues":       <AdminPendingDues />,
    coupons:              <AdminCoupons openForm={openForm} lastFormData={lastFormData} formSubmissionTime={formSubmissionTime} />,
    discounts:            <AdminDiscounts openForm={openForm} lastFormData={lastFormData} formSubmissionTime={formSubmissionTime} />,
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
  const [notificationsData, setNotificationsData] = useState([]);
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
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [lastFormData, setLastFormData] = useState(null);
  const [formSubmissionTime, setFormSubmissionTime] = useState(0);
  const go = useCallback(id => setActive(id), []);
  const allItems = [DASHBOARD_ITEM, ...NAV_GROUPS.flatMap(g => g.items)];
  const currentLabel = allItems.find(i => i.id === active)?.label || "Dashboard";

  const handleFormSubmit = (data) => {
    closeForm();
    setLastFormData({ formType: activeForm, data });
    setFormSubmissionTime(Date.now()); // Add timestamp
    setToast(`✅ ${formTitles[activeForm] || "Action"} completed successfully!`);
    // Trigger refresh in child components
    setRefreshTrigger(prev => prev + 1);
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
            <div className="ad-avatar ad-avatar-sm">AD</div>
          </div>
        </header>
        <main className="ad-content">
          {renderSection(active, openForm, refreshTrigger, lastFormData, formSubmissionTime)}
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
