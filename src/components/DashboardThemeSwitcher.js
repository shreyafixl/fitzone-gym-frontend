import { useState, useEffect, useRef } from "react";

// Available accent themes for dashboards
const THEMES = [
  { id: "orange",  label: "Orange",  accent: "#f97316", hover: "#ea580c" },
  { id: "blue",    label: "Blue",    accent: "#3b82f6", hover: "#2563eb" },
  { id: "green",   label: "Green",   accent: "#22c55e", hover: "#16a34a" },
  { id: "purple",  label: "Purple",  accent: "#8b5cf6", hover: "#7c3aed" },
  { id: "red",     label: "Red",     accent: "#ef4444", hover: "#dc2626" },
  { id: "teal",    label: "Teal",    accent: "#14b8a6", hover: "#0d9488" },
];

const STORAGE_KEY = "dashboard-accent-theme";

export function useDashboardTheme() {
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || "orange";
  });

  useEffect(() => {
    const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];
    const root = document.documentElement;
    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--accent-hover", theme.hover);
    localStorage.setItem(STORAGE_KEY, themeId);
  }, [themeId]);

  return { themeId, setThemeId, themes: THEMES };
}

export default function DashboardThemeSwitcher({ themeId, setThemeId, themes }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = themes.find((t) => t.id === themeId) || themes[0];

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        title="Change theme color"
        aria-label="Change theme color"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "1px solid var(--border-color)",
          borderRadius: 8,
          padding: "5px 10px",
          cursor: "pointer",
          color: "var(--text-secondary)",
          fontSize: ".78rem",
          fontWeight: 600,
          transition: "border-color .2s, color .2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = current.accent;
          e.currentTarget.style.color = current.accent;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border-color)";
          e.currentTarget.style.color = "var(--text-secondary)";
        }}
      >
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: current.accent,
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        Theme
      </button>

      {/* Dropdown palette */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: 10,
            padding: "12px 14px",
            zIndex: 10000,
            boxShadow: "0 8px 24px rgba(0,0,0,.2)",
            minWidth: 180,
            animation: "slideUp 0.2s ease-out",
          }}
        >
          <p
            style={{
              fontSize: ".68rem",
              fontWeight: 700,
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: ".6px",
              marginBottom: 10,
            }}
          >
            Accent Color
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => { setThemeId(t.id); setOpen(false); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: themeId === t.id ? `${t.accent}18` : "none",
                  border: themeId === t.id ? `1px solid ${t.accent}` : "1px solid transparent",
                  borderRadius: 7,
                  padding: "7px 10px",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  transition: "background .15s",
                }}
                onMouseEnter={(e) => {
                  if (themeId !== t.id) e.currentTarget.style.background = `${t.accent}10`;
                }}
                onMouseLeave={(e) => {
                  if (themeId !== t.id) e.currentTarget.style.background = "none";
                }}
              >
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: t.accent,
                    flexShrink: 0,
                    boxShadow: themeId === t.id ? `0 0 0 2px ${t.accent}55` : "none",
                  }}
                />
                <span
                  style={{
                    fontSize: ".82rem",
                    fontWeight: themeId === t.id ? 700 : 500,
                    color: themeId === t.id ? t.accent : "var(--text-primary)",
                  }}
                >
                  {t.label}
                </span>
                {themeId === t.id && (
                  <span style={{ marginLeft: "auto", color: t.accent, fontSize: ".75rem" }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
