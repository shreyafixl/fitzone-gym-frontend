import { useEffect, useState } from "react";
import {
  FaTimes, FaStar, FaUsers, FaCalendarAlt, FaEnvelope,
  FaPhone, FaUserCog, FaCheckCircle, FaClock, FaEdit,
  FaUserPlus, FaDumbbell, FaAward,
} from "react-icons/fa";

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    active:   { bg: "rgba(34,197,94,.15)",  color: "#22c55e", label: "Active"   },
    on_leave: { bg: "rgba(234,179,8,.15)",  color: "#ca8a04", label: "On Leave" },
    inactive: { bg: "rgba(107,114,128,.15)",color: "#6b7280", label: "Inactive" },
  };
  const s = map[status] || map.inactive;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.color,
      padding: "3px 10px", borderRadius: 50,
      fontSize: ".72rem", fontWeight: 700,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color }} />
      {s.label}
    </span>
  );
}

// ─── STAT PILL ────────────────────────────────────────────────────────────────
function StatPill({ icon, label, value, color }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 4, padding: "14px 10px",
      background: `${color}12`,
      border: `1px solid ${color}30`,
      borderRadius: 10, flex: 1, minWidth: 0,
    }}>
      <span style={{ color, fontSize: "1.1rem" }}>{icon}</span>
      <strong style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>{value}</strong>
      <span style={{ fontSize: ".68rem", color: "var(--text-secondary)", textAlign: "center" }}>{label}</span>
    </div>
  );
}

// ─── STAR RATING ──────────────────────────────────────────────────────────────
function StarRating({ rating }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <FaStar
          key={i}
          style={{
            fontSize: ".85rem",
            color: i <= Math.round(rating) ? "#fbbf24" : "var(--border-color)",
          }}
        />
      ))}
      <span style={{ fontSize: ".82rem", fontWeight: 700, color: "var(--text-primary)", marginLeft: 4 }}>
        {rating}
      </span>
    </div>
  );
}

// ─── ASSIGN CLIENT MODAL ──────────────────────────────────────────────────────
function AssignClientPanel({ trainer, members, onAssign, onCancel }) {
  const [selectedMember, setSelectedMember] = useState("");
  const [sessionType, setSessionType]       = useState("Personal Training");
  const [startDate, setStartDate]           = useState("");
  const [error, setError]                   = useState("");

  const handleAssign = () => {
    if (!selectedMember) { setError("Please select a member."); return; }
    if (!startDate)       { setError("Please pick a start date."); return; }
    onAssign({ trainer: trainer.name, member: selectedMember, sessionType, startDate });
  };

  const inputStyle = {
    width: "100%", padding: "9px 12px",
    background: "var(--bg-primary)", border: "1px solid var(--border-color)",
    borderRadius: 8, color: "var(--text-primary)", fontSize: ".85rem",
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{
      marginTop: 16, padding: 16,
      background: "var(--bg-primary)",
      border: "1px solid var(--border-color)",
      borderRadius: 10,
    }}>
      <h4 style={{ fontSize: ".9rem", fontWeight: 700, marginBottom: 12, color: "var(--text-primary)" }}>
        Assign Client to {trainer.name}
      </h4>

      <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: ".75rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: ".4px" }}>
          Select Member *
        </label>
        <select style={inputStyle} value={selectedMember} onChange={e => { setSelectedMember(e.target.value); setError(""); }}>
          <option value="">— Choose member —</option>
          {(members || []).filter(m => m.status === "active").map(m => (
            <option key={m.id} value={m.name}>{m.name} ({m.plan})</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: ".75rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: ".4px" }}>
          Session Type
        </label>
        <select style={inputStyle} value={sessionType} onChange={e => setSessionType(e.target.value)}>
          <option>Personal Training</option>
          <option>Group Class</option>
          <option>Nutrition Coaching</option>
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: ".75rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: ".4px" }}>
          Start Date *
        </label>
        <input type="date" style={inputStyle} value={startDate} onChange={e => { setStartDate(e.target.value); setError(""); }} />
      </div>

      {error && (
        <p style={{ fontSize: ".75rem", color: "#ef4444", marginBottom: 10 }}>{error}</p>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={handleAssign}
          style={{
            flex: 1, padding: "9px 0", borderRadius: 8, border: "none",
            background: "var(--accent)", color: "#fff",
            fontSize: ".85rem", fontWeight: 700, cursor: "pointer",
          }}
        >
          Confirm Assignment
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: "9px 16px", borderRadius: 8,
            border: "1px solid var(--border-color)",
            background: "none", color: "var(--text-secondary)",
            fontSize: ".85rem", cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function TrainerProfileSidebar({ trainer, members = [], onClose, onAssigned, onEdit }) {
  const [showAssign, setShowAssign] = useState(false);
  const [toast, setToast]           = useState(null);

  // ESC key closes sidebar
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = trainer ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [trainer]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAssign = (data) => {
    setShowAssign(false);
    showToast(`✅ ${data.member} assigned to ${data.trainer}!`);
    if (onAssigned) onAssigned(data);
  };

  // Derive initials for avatar fallback
  const initials = trainer
    ? trainer.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "";

  // Revenue estimate
  const revenue = trainer ? `$${(trainer.sessions * 9.5).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : "";

  return (
    <>
      {/* ── Dim overlay ── */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.45)",
          zIndex: 8000,
          opacity: trainer ? 1 : 0,
          pointerEvents: trainer ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* ── Drawer panel ── */}
      <aside
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: "clamp(320px, 38vw, 480px)",
          background: "var(--bg-secondary)",
          borderLeft: "1px solid var(--border-color)",
          zIndex: 8001,
          display: "flex", flexDirection: "column",
          transform: trainer ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: trainer ? "-8px 0 40px rgba(0,0,0,.25)" : "none",
          overflowY: "auto",
        }}
      >
        {trainer && (
          <>
            {/* ── Header ── */}
            <div style={{
              padding: "18px 20px",
              borderBottom: "1px solid var(--border-color)",
              display: "flex", alignItems: "center",
              justifyContent: "space-between",
              position: "sticky", top: 0,
              background: "var(--bg-secondary)", zIndex: 1,
              flexShrink: 0,
            }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                Trainer Profile
              </h3>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {onEdit && (
                  <button
                    onClick={() => onEdit(trainer)}
                    title="Edit Profile"
                    style={{
                      background: "rgba(var(--accent-rgb),.1)", border: "none",
                      borderRadius: 7, padding: "6px 10px",
                      color: "var(--accent)", cursor: "pointer",
                      fontSize: ".8rem", fontWeight: 600,
                      display: "flex", alignItems: "center", gap: 5,
                    }}
                  >
                    <FaEdit style={{ fontSize: ".75rem" }} /> Edit
                  </button>
                )}
                <button
                  onClick={onClose}
                  aria-label="Close"
                  style={{
                    background: "none", border: "none",
                    fontSize: "1.4rem", color: "var(--text-secondary)",
                    cursor: "pointer", padding: "2px 6px",
                    borderRadius: 6, lineHeight: 1,
                    transition: "background .2s, color .2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,.1)"; e.currentTarget.style.color = "#ef4444"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* ── Body ── */}
            <div style={{ padding: "20px", flex: 1 }}>

              {/* Avatar + name block */}
              <div style={{
                display: "flex", alignItems: "center", gap: 16,
                marginBottom: 20,
                padding: 16,
                background: "var(--bg-primary)",
                borderRadius: 12,
                border: "1px solid var(--border-color)",
              }}>
                {/* Avatar — image if available, else initials */}
                {trainer.image ? (
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    style={{
                      width: 72, height: 72, borderRadius: "50%",
                      objectFit: "cover", flexShrink: 0,
                      border: "3px solid var(--accent)",
                    }}
                    onError={e => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <div style={{
                    width: 72, height: 72, borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--accent), #dc2626)",
                    color: "#fff", fontWeight: 800, fontSize: "1.3rem",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, border: "3px solid var(--accent)",
                  }}>
                    {initials}
                  </div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 4px" }}>
                    {trainer.name}
                  </h2>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                    <span style={{ fontSize: ".78rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                      {trainer.role}
                    </span>
                    <span style={{ color: "var(--border-color)" }}>·</span>
                    <StatusBadge status={trainer.status} />
                  </div>
                  <StarRating rating={trainer.rating} />
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                <StatPill icon={<FaUsers />}       label="Clients"  value={trainer.clients}  color="#3b82f6" />
                <StatPill icon={<FaCalendarAlt />} label="Sessions" value={trainer.sessions} color="#22c55e" />
                <StatPill icon={<FaStar />}        label="Rating"   value={trainer.rating}   color="#fbbf24" />
                <StatPill icon={<FaDumbbell />}    label="Revenue"  value={revenue}          color="var(--accent)" />
              </div>

              {/* Details */}
              <div style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: 12, overflow: "hidden",
                marginBottom: 16,
              }}>
                {[
                  { icon: <FaUserCog />,    label: "Specialization", value: trainer.specialization, color: "#8b5cf6" },
                  { icon: <FaAward />,      label: "Joined",         value: trainer.joined,         color: "#f59e0b" },
                  { icon: <FaCheckCircle />,label: "Status",         value: trainer.status?.replace("_", " "), color: "#22c55e" },
                  ...(trainer.email ? [{ icon: <FaEnvelope />, label: "Email", value: trainer.email, color: "#06b6d4" }] : []),
                  ...(trainer.phone ? [{ icon: <FaPhone />,   label: "Phone", value: trainer.phone, color: "#10b981" }] : []),
                  ...(trainer.certification ? [{ icon: <FaAward />, label: "Certification", value: trainer.certification, color: "#f97316" }] : []),
                ].map(({ icon, label, value, color }, i, arr) => (
                  <div
                    key={label}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 12,
                      padding: "12px 16px",
                      borderBottom: i < arr.length - 1 ? "1px solid var(--border-color)" : "none",
                    }}
                  >
                    <span style={{
                      width: 28, height: 28, borderRadius: 7,
                      background: `${color}18`, color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: ".8rem", flexShrink: 0, marginTop: 1,
                    }}>
                      {icon}
                    </span>
                    <div>
                      <div style={{ fontSize: ".68rem", color: "var(--text-secondary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 2 }}>
                        {label}
                      </div>
                      <div style={{ fontSize: ".88rem", color: "var(--text-primary)", fontWeight: 500, textTransform: label === "Status" ? "capitalize" : "none" }}>
                        {value || "—"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bio / About */}
              {trainer.bio && (
                <div style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: 12, padding: 16, marginBottom: 16,
                }}>
                  <div style={{ fontSize: ".72rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 8 }}>
                    About
                  </div>
                  <p style={{ fontSize: ".85rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                    {trainer.bio}
                  </p>
                </div>
              )}

              {/* Assign Client panel */}
              {showAssign ? (
                <AssignClientPanel
                  trainer={trainer}
                  members={members}
                  onAssign={handleAssign}
                  onCancel={() => setShowAssign(false)}
                />
              ) : (
                trainer.role !== "Reception" && (
                  <button
                    onClick={() => setShowAssign(true)}
                    style={{
                      width: "100%", padding: "11px 0",
                      borderRadius: 9, border: "none",
                      background: "var(--accent)", color: "#fff",
                      fontSize: ".88rem", fontWeight: 700,
                      cursor: "pointer", display: "flex",
                      alignItems: "center", justifyContent: "center", gap: 8,
                      transition: "opacity .2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = ".88"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    <FaUserPlus /> Assign Client
                  </button>
                )
              )}
            </div>

            {/* ── Toast ── */}
            {toast && (
              <div style={{
                position: "fixed", bottom: 24, right: 24, zIndex: 9999,
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderLeft: "4px solid #22c55e",
                borderRadius: 10, padding: "12px 18px",
                fontSize: ".85rem", color: "var(--text-primary)",
                boxShadow: "0 8px 24px rgba(0,0,0,.2)",
                display: "flex", alignItems: "center", gap: 10,
                animation: "slideUp .3s ease-out",
              }}>
                {toast}
              </div>
            )}
          </>
        )}
      </aside>
    </>
  );
}
