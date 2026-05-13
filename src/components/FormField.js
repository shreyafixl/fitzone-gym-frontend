export function FormField({ label, error, required, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: ".78rem",
            fontWeight: 700,
            color: "var(--text-secondary)",
            marginBottom: 6,
            textTransform: "uppercase",
            letterSpacing: ".4px",
          }}
        >
          {label}
          {required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
        </label>
      )}
      {children}
      {error && (
        <p style={{ fontSize: ".72rem", color: "#ef4444", marginTop: 4, margin: "4px 0 0" }}>
          {error}
        </p>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  background: "var(--bg-primary)",
  border: "1px solid var(--border-color)",
  borderRadius: "8px",
  color: "var(--text-primary)",
  fontSize: ".88rem",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

export function InputField({ label, error, required, type = "text", ...props }) {
  return (
    <FormField label={label} error={error} required={required}>
      <input
        type={type}
        style={{
          ...inputStyle,
          borderColor: error ? "#ef4444" : "var(--border-color)",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
        onBlur={(e) => (e.target.style.borderColor = error ? "#ef4444" : "var(--border-color)")}
        {...props}
      />
    </FormField>
  );
}

export function SelectField({ label, error, required, options = [], placeholder, ...props }) {
  return (
    <FormField label={label} error={error} required={required}>
      <select
        style={{
          ...inputStyle,
          borderColor: error ? "#ef4444" : "var(--border-color)",
          cursor: "pointer",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
        onBlur={(e) => (e.target.style.borderColor = error ? "#ef4444" : "var(--border-color)")}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) =>
          typeof opt === "string" ? (
            <option key={opt} value={opt}>{opt}</option>
          ) : (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          )
        )}
      </select>
    </FormField>
  );
}

export function TextareaField({ label, error, required, rows = 3, ...props }) {
  return (
    <FormField label={label} error={error} required={required}>
      <textarea
        rows={rows}
        style={{
          ...inputStyle,
          resize: "vertical",
          borderColor: error ? "#ef4444" : "var(--border-color)",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
        onBlur={(e) => (e.target.style.borderColor = error ? "#ef4444" : "var(--border-color)")}
        {...props}
      />
    </FormField>
  );
}

export function FormRow({ children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {children}
    </div>
  );
}

export function FormActions({ onCancel, submitLabel = "Save", loading = false, accentColor }) {
  const accent = accentColor || "var(--accent)";
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        justifyContent: "flex-end",
        marginTop: 24,
        paddingTop: 16,
        borderTop: "1px solid var(--border-color)",
      }}
    >
      <button
        type="button"
        onClick={onCancel}
        style={{
          padding: "9px 20px",
          borderRadius: "8px",
          border: "1px solid var(--border-color)",
          background: "none",
          color: "var(--text-secondary)",
          fontSize: ".85rem",
          cursor: "pointer",
          fontWeight: 600,
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = accent;
          e.target.style.color = accent;
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = "var(--border-color)";
          e.target.style.color = "var(--text-secondary)";
        }}
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "9px 24px",
          borderRadius: "8px",
          border: "none",
          background: accent,
          color: "#fff",
          fontSize: ".85rem",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: 700,
          opacity: loading ? 0.7 : 1,
          transition: "opacity 0.2s",
        }}
      >
        {loading ? "Saving..." : submitLabel}
      </button>
    </div>
  );
}
