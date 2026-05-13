import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { userData, paymentHistory, offers } from "../data/dashboardData";

export default function DashboardBilling({ tab: initialTab = "payments" }) {
  const [tab, setTab] = useState(initialTab);

  // Sync tab state when prop changes
  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);
  const [copied, setCopied] = useState(null);
  const pct = Math.round((userData.daysLeft / 180) * 100);

  const copyCode = (code) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="db-section">
      <div className="db-section-header">
        <h2>Billing</h2>
        <Link to="/pricing" className="btn btn-primary db-btn-sm">Renew Membership</Link>
      </div>

      <div className="db-tabs">
        {[["payments","Payments"],["offers","Offers & Coupons"]].map(([id,l]) => (
          <button key={id} className={`db-tab ${tab===id?"db-tab--active":""}`} onClick={() => setTab(id)}>{l}</button>
        ))}
      </div>

      {tab === "payments" && (
        <>
          <div className="db-card db-billing-summary">
            <div className="db-billing-row">
              <div><span>Current Plan</span><strong>{userData.membershipPlan}</strong></div>
              <div><span>Expires</span><strong>{userData.planExpiry}</strong></div>
              <div><span>Days Left</span><strong>{userData.daysLeft} days</strong></div>
              <div><span>Status</span><span className="db-badge badge-green">Active</span></div>
            </div>
            <div className="db-progress-bar-wrap" style={{ marginTop:"1rem" }}>
              <div className="db-progress-bar"><div className="db-progress-fill" style={{ width:`${pct}%` }} /></div>
              <span style={{ fontSize:"0.8rem", color:"var(--text-secondary)" }}>{pct}% remaining</span>
            </div>
          </div>
          <div className="db-card">
            <div className="db-card-header"><h3>Payment History</h3></div>
            <table className="db-table">
              <thead><tr><th>Invoice</th><th>Date</th><th>Plan</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {paymentHistory.map(p => (
                  <tr key={p.id}>
                    <td><code style={{ color:"var(--accent)", fontSize:"0.8rem" }}>{p.id}</code></td>
                    <td>{p.date}</td>
                    <td>{p.plan}</td>
                    <td><strong>{p.amount}</strong></td>
                    <td><span className="db-badge badge-green">{p.status}</span></td>
                    <td><button className="db-btn-link">Download PDF</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "offers" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
          {offers.map(o => (
            <div key={o.id} className="db-card" style={{ opacity:o.valid?1:.6, position:"relative", overflow:"hidden" }}>
              {!o.valid && <div style={{ position:"absolute", top:12, right:12, background:"#ef4444", color:"#fff", fontSize:".65rem", fontWeight:700, padding:"2px 8px", borderRadius:50 }}>EXPIRED</div>}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <span style={{ fontSize:"1.6rem", fontWeight:800, color:"var(--accent)" }}>{o.discount}</span>
                <span className={`db-badge ${o.valid?"badge-green":"badge-red"}`}>{o.valid?"Valid":"Expired"}</span>
              </div>
              <p style={{ fontSize:".85rem", color:"var(--text-primary)", marginBottom:10 }}>{o.description}</p>
              <div style={{ background:"var(--bg-primary)", border:"2px dashed var(--border-color)", borderRadius:8, padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <code style={{ fontSize:"1rem", fontWeight:800, color:"var(--accent)", letterSpacing:2 }}>{o.code}</code>
                {o.valid && (
                  <button className="btn btn-primary db-btn-sm" onClick={() => copyCode(o.code)}>
                    {copied===o.code?"Copied!":"Copy"}
                  </button>
                )}
              </div>
              <span style={{ fontSize:".72rem", color:"var(--text-secondary)" }}>Expires: {o.expiry}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


