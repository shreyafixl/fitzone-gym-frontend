import { useState, useCallback, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { userData, notifications } from "../data/dashboardData";
import { useDashboardTheme } from "../components/DashboardThemeSwitcher";
import DashboardThemeSwitcher from "../components/DashboardThemeSwitcher";
import "../dashboard.css";

const DashboardOverview   = lazy(() => import("../dashboard/DashboardOverview"));
const DashboardBookings   = lazy(() => import("../dashboard/DashboardBookings"));
const DashboardProgress   = lazy(() => import("../dashboard/DashboardProgress"));
const DashboardHistory    = lazy(() => import("../dashboard/DashboardHistory"));
const DashboardSchedule   = lazy(() => import("../dashboard/DashboardSchedule"));
const DashboardTrainer    = lazy(() => import("../dashboard/DashboardTrainer"));
const DashboardBilling    = lazy(() => import("../dashboard/DashboardBilling"));
const DashboardMemberCard = lazy(() => import("../dashboard/DashboardMemberCard"));
const DashboardGoals      = lazy(() => import("../dashboard/DashboardGoals"));
const DashboardWorkout    = lazy(() => import("../dashboard/DashboardWorkout"));
const DashboardNutrition  = lazy(() => import("../dashboard/DashboardNutrition"));
const DashboardNotifications = lazy(() => import("../dashboard/DashboardNotifications"));
const DashboardSettings   = lazy(() => import("../dashboard/DashboardSettings"));
const DashboardReports    = lazy(() => import("../dashboard/DashboardReports"));

// Dashboard is a DIRECT link — no dropdown, no children
const DASHBOARD_ITEM = { 
  id: "overview", 
  icon: "🏠", 
  label: "Dashboard",
  color: "#f97316",
};

const NAV_GROUPS = [
  { label:"Bookings", icon:"📅", color:"#3b82f6", items:[
    { id:"bookings",        icon:"📅", label:"My Bookings"     },
    { id:"booking-history", icon:"🕐", label:"Booking History" },
    { id:"schedule",        icon:"🗓️", label:"Class Schedule"  },
  ]},
  { label:"Progress", icon:"📈", color:"#22c55e", items:[
    { id:"progress", icon:"📈", label:"Progress Stats" },
    { id:"goals",    icon:"🎯", label:"My Goals"       },
    { id:"reports",  icon:"📊", label:"Reports"        },
  ]},
  { label:"Workout", icon:"🏋️", color:"#8b5cf6", items:[
    { id:"history",  icon:"🕐", label:"Workout History" },
    { id:"workout",  icon:"💪", label:"Assigned Plans"  },
    { id:"attendance",icon:"✅", label:"Attendance"     },
  ]},
  { label:"Nutrition", icon:"🥗", color:"#10b981", items:[
    { id:"diet",    icon:"🥗", label:"Diet Plan"    },
    { id:"meals",   icon:"🍽️", label:"Meal Tracker" },
    { id:"water",   icon:"💧", label:"Water Intake" },
  ]},
  { label:"Trainer", icon:"👤", color:"#ec4899", items:[
    { id:"trainer", icon:"👤", label:"My Trainer" },
    { id:"chat",    icon:"💬", label:"Chat"        },
  ]},
  { label:"Billing", icon:"💳", color:"#14b8a6", items:[
    { id:"billing", icon:"💳", label:"Payments"        },
    { id:"offers",  icon:"🎁", label:"Offers & Coupons"},
  ]},
  { label:"More", icon:"⚙️", color:"#64748b", items:[
    { id:"notifications", icon:"🔔", label:"Notifications" },
    { id:"card",          icon:"🪪", label:"Member Card"   },
    { id:"settings",      icon:"⚙️", label:"Settings"      },
  ]},
];

const SECTION_MAP = {
  overview:         <DashboardOverview />,
  bookings:         <DashboardBookings tab="upcoming" />,
  "booking-history":<DashboardBookings tab="history" />,
  schedule:         <DashboardSchedule />,
  progress:         <DashboardProgress />,
  goals:            <DashboardGoals />,
  reports:          <DashboardReports />,
  history:          <DashboardHistory />,
  workout:          <DashboardWorkout tab="plans" />,
  attendance:       <DashboardWorkout tab="attendance" />,
  diet:             <DashboardNutrition tab="diet" />,
  meals:            <DashboardNutrition tab="meals" />,
  water:            <DashboardNutrition tab="water" />,
  trainer:          <DashboardTrainer tab="profile" />,
  chat:             <DashboardTrainer tab="chat" />,
  billing:          <DashboardBilling tab="payments" />,
  offers:           <DashboardBilling tab="offers" />,
  notifications:    <DashboardNotifications />,
  card:             <DashboardMemberCard />,
  settings:         <DashboardSettings />,
};

function SectionLoader() {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"40vh" }}>
      <div className="loader-spinner" />
    </div>
  );
}

function NotifBell({ onNav }) {
  const [open, setOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;
  const typeIcon = { session:"📅", trainer:"💬", payment:"💳", goal:"🎯", announce:"📢" };
  return (
    <div style={{ position:"relative" }}>
      <button className="db-notif-btn" onClick={() => setOpen(o => !o)} style={{ position:"relative" }}>
        🔔
        {unread > 0 && (
          <span style={{ position:"absolute", top:-4, right:-4, background:"#ef4444", color:"#fff", borderRadius:"50%", width:16, height:16, fontSize:".65rem", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{unread}</span>
        )}
      </button>
      {open && (
        <div className="db-notif-dropdown">
          <div className="db-notif-dropdown-head">
            <strong>Notifications</strong>
            <span className="db-badge badge-red">{unread} new</span>
          </div>
          {notifications.slice(0,5).map(n => (
            <div key={n.id} className={`db-notif-item ${!n.read ? "db-notif-item--unread" : ""}`}>
              <span style={{ fontSize:"1.1rem" }}>{typeIcon[n.type] || "🔔"}</span>
              <div style={{ flex:1 }}>
                <strong>{n.title}</strong>
                <p>{n.message}</p>
                <small>{n.time}</small>
              </div>
            </div>
          ))}
          <button className="db-notif-view-all" onClick={() => { setOpen(false); onNav("notifications"); }}>View All</button>
        </div>
      )}
    </div>
  );
}

function Sidebar({ active, onNav, open, onClose }) {
  const activeGroup = NAV_GROUPS.find(g => g.items.some(i => i.id === active));
  const [expanded, setExpanded] = useState(activeGroup?.label || null);
  const [collapsed, setCollapsed] = useState(false);
  
  const toggle = (label) => {
    if (collapsed) { setCollapsed(false); setExpanded(label); return; }
    setExpanded(p => p === label ? null : label);
  };

  return (
    <>
      <aside className={`db-sidebar ${open ? "db-sidebar--open" : ""} ${collapsed ? "db-sidebar--collapsed" : ""}`}>
        {/* Brand + collapse button */}
        <div className="db-sidebar-brand">
          {!collapsed && <span className="db-brand-logo">⚡ FitZone</span>}
          <button
            className="db-collapse-btn"
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {/* User info — hidden when collapsed */}
        {!collapsed && (
          <div className="db-sidebar-user">
            <div className="db-avatar">{userData.avatar}</div>
            <div className="db-user-meta">
              <strong>{userData.name}</strong>
              <span>{userData.membershipPlan} Member</span>
            </div>
          </div>
        )}

        <nav className="db-nav">
          {/* ── Dashboard: direct link, no dropdown ── */}
          <div className="db-nav-direct">
            <button
              className={`db-nav-item db-nav-direct-item ${active === DASHBOARD_ITEM.id ? "db-nav-item--active" : ""}`}
              onClick={() => { onNav(DASHBOARD_ITEM.id); onClose(); }}
              title={collapsed ? DASHBOARD_ITEM.label : undefined}
            >
              <span className="db-nav-icon" style={{ fontSize: collapsed ? "1.2rem" : "1rem" }}>
                {DASHBOARD_ITEM.icon}
              </span>
              {!collapsed && <span className="db-nav-label">{DASHBOARD_ITEM.label}</span>}
            </button>
          </div>

          {/* ── Grouped dropdown items ── */}
          {NAV_GROUPS.map(group => {
            const isOpen = !collapsed && expanded === group.label;
            const hasActive = group.items.some(i => i.id === active);
            return (
              <div key={group.label} className="db-nav-group">
                <button
                  className={`db-nav-group-header ${hasActive ? "db-nav-group-header--active" : ""}`}
                  onClick={() => toggle(group.label)}
                  title={collapsed ? group.label : undefined}
                >
                  <span style={{ display:"flex", alignItems:"center", gap: collapsed ? 0 : 10 }}>
                    <span className="db-nav-group-icon" style={{ fontSize: collapsed ? "1.2rem" : "1rem" }}>
                      {group.icon}
                    </span>
                    {!collapsed && <span>{group.label}</span>}
                  </span>
                  {!collapsed && (
                    <span className={`db-nav-chevron ${isOpen ? "db-nav-chevron--open" : ""}`}>▾</span>
                  )}
                </button>
                {isOpen && (
                  <div className="db-nav-group-items">
                    {group.items.map(item => (
                      <button
                        key={item.id}
                        className={`db-nav-item db-nav-item--sub ${active === item.id ? "db-nav-item--active" : ""}`}
                        onClick={() => { onNav(item.id); onClose(); }}
                      >
                        <span className="db-nav-icon">{item.icon}</span>
                        <span className="db-nav-label">{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="db-sidebar-footer">
          <Link to="/" className="db-nav-item" title={collapsed ? "Back to Site" : undefined}>
            <span className="db-nav-icon" style={{ fontSize: collapsed ? "1.2rem" : "1rem" }}>←</span>
            {!collapsed && <span className="db-nav-label">Back to Site</span>}
          </Link>
        </div>
      </aside>
      {open && <div className="db-overlay" onClick={onClose} />}
    </>
  );
}

export default function DashboardPage() {
  const [active, setActive] = useState(DASHBOARD_ITEM.id);
  const [open, setOpen]     = useState(false);
  const { themeId, setThemeId, themes } = useDashboardTheme();
  const go = useCallback((id) => { setActive(id); setOpen(false); }, []);
  const allItems = [DASHBOARD_ITEM, ...NAV_GROUPS.flatMap(g => g.items)];
  const current  = allItems.find(n => n.id === active);

  return (
    <div className="db-layout">
      <Sidebar active={active} onNav={go} open={open} onClose={() => setOpen(false)} />
      <div className="db-main">
        <header className="db-topbar">
          <button className="db-menu-btn" onClick={() => setOpen(true)} aria-label="Open menu">☰</button>
          <div className="db-topbar-title">{current?.icon} {current?.label}</div>
          <div className="db-topbar-right">
            <DashboardThemeSwitcher themeId={themeId} setThemeId={setThemeId} themes={themes} />
            <NotifBell onNav={go} />
            <div className="db-avatar db-avatar-sm">{userData.avatar}</div>
          </div>
        </header>
        <main className="db-content">
          <Suspense fallback={<SectionLoader />}>
            {SECTION_MAP[active] || <DashboardOverview />}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
