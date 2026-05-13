import { useState } from "react";
import { userData, userSettings } from "../data/dashboardData";

export default function DashboardSettings() {
  const [settings, setSettings] = useState(userSettings);
  const [profile, setProfile] = useState({ name:userData.name, email:userData.email, phone:userData.phone, dob:"1998-03-15", gender:"Male", address:"Mumbai, Maharashtra" });
  const [tab, setTab] = useState("profile");
  const [toast, setToast] = useState(null);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const toggle = (key) => { setSettings(s => ({...s,[key]:!s[key]})); showToast("Setting updated!"); };

  return (
    <div className="db-section">
      {toast && <div className="db-toast-notif">{toast}</div>}
      <div className="db-section-header"><h2>Settings</h2></div>
      <div className="db-tabs">
        {[["profile","Profile Settings"],["preferences","Preferences"]].map(([id,l]) => (
          <button key={id} className={`db-tab ${tab===id?"db-tab--active":""}`} onClick={() => setTab(id)}>{l}</button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="db-card">
          <div className="db-card-header">
            <h3>Personal Details</h3>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div className="db-avatar">{userData.avatar}</div>
              <div>
                <strong style={{ display:"block" }}>{userData.name}</strong>
                <span style={{ fontSize:".78rem", color:"var(--accent)" }}>{userData.membershipPlan} Member</span>
              </div>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            {[["Full Name","name","text"],["Email","email","email"],["Phone","phone","tel"],["Date of Birth","dob","date"],["Gender","gender","text"],["Address","address","text"]].map(([l,k,t]) => (
              <div className="db-form-group" key={k}>
                <label>{l}</label>
                <input className="db-input" type={t} value={profile[k]} onChange={e => setProfile(p => ({...p,[k]:e.target.value}))} />
              </div>
            ))}
          </div>
          <button className="btn btn-primary db-btn-sm" style={{ marginTop:8 }} onClick={() => showToast("Profile saved!")}>Save Changes</button>
        </div>
      )}

      {tab === "preferences" && (
        <div className="db-card">
          <div className="db-card-header"><h3>Notification Preferences</h3></div>
          {[
            ["emailNotif","Email Notifications","Receive alerts via email"],
            ["smsAlerts","SMS Alerts","Receive alerts via SMS"],
            ["sessionReminders","Session Reminders","Get reminded 30 min before class"],
            ["trainerMessages","Trainer Messages","Notifications for trainer messages"],
            ["paymentAlerts","Payment Alerts","Billing and renewal reminders"],
          ].map(([key,label,desc]) => (
            <div key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid var(--border-color)" }}>
              <div>
                <strong style={{ display:"block", fontSize:".88rem" }}>{label}</strong>
                <span style={{ fontSize:".75rem", color:"var(--text-secondary)" }}>{desc}</span>
              </div>
              <div onClick={() => toggle(key)} style={{ width:44, height:24, background:settings[key]?"var(--accent)":"var(--border-color)", borderRadius:50, position:"relative", cursor:"pointer", transition:"background .3s" }}>
                <div style={{ position:"absolute", width:18, height:18, background:"#fff", borderRadius:"50%", top:3, left:settings[key]?23:3, transition:"left .3s" }} />
              </div>
            </div>
          ))}
          <div className="db-card-header" style={{ marginTop:20 }}><h3>UI Preferences</h3></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginTop:8 }}>
            <div className="db-form-group"><label>Language</label>
              <select className="db-select" value={settings.language} onChange={e => setSettings(s=>({...s,language:e.target.value}))}>
                <option>English</option><option>Hindi</option><option>Marathi</option>
              </select>
            </div>
            <div className="db-form-group"><label>Timezone</label>
              <select className="db-select" value={settings.timezone} onChange={e => setSettings(s=>({...s,timezone:e.target.value}))}>
                <option>IST (UTC+5:30)</option><option>UTC</option><option>EST (UTC-5)</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary db-btn-sm" style={{ marginTop:8 }} onClick={() => showToast("Preferences saved!")}>Save Preferences</button>
        </div>
      )}
    </div>
  );
}
