import { userData } from "../data/dashboardData";

// Simple deterministic QR-like pattern
const QR_PATTERN = [
  [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,0,1,0,1,1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,0,0,1,1,1,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,0,1,0,0,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,1,0,1,1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0],
  [1,0,1,1,0,1,1,1,0,0,1,0,1,1,0,1,1,0,1],
  [0,1,0,0,1,0,0,0,1,0,0,1,0,0,1,0,0,1,0],
  [1,1,1,0,1,1,1,1,0,1,1,0,1,1,1,0,1,1,1],
  [0,0,0,0,0,0,0,0,1,0,1,1,0,1,0,0,0,0,0],
  [1,1,1,1,1,1,1,0,0,1,0,0,1,0,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,1,0,1,1,0,1,0,0,0,0,1],
  [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,0,1,0,0,1,0,1,0,1,1,0,1],
  [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,1,1,0,1,0,1,0,0,0,0,1],
  [1,1,1,1,1,1,1,0,0,0,1,0,1,0,1,1,1,1,1],
];

export default function DashboardMemberCard() {
  return (
    <div className="db-section">
      <div className="db-section-header"><h2>Digital Membership Card</h2></div>

      <div className="db-card-center">
        {/* The Card */}
        <div className="db-member-card">
          <div className="db-member-card-glow" />
          <div className="db-member-card-top">
            <span className="db-member-card-logo">⚡ FitZone</span>
            <span className="db-member-card-plan-tag">{userData.membershipPlan}</span>
          </div>
          <div className="db-member-card-mid">
            <div className="db-member-card-avatar">{userData.avatar}</div>
            <div>
              <div className="db-member-card-name">{userData.name}</div>
              <div className="db-member-card-id">ID: {userData.memberId}</div>
            </div>
          </div>
          <div className="db-member-card-qr-wrap">
            <svg viewBox="0 0 190 190" className="db-qr-svg" aria-label="QR Code">
              {QR_PATTERN.map((row, r) =>
                row.map((cell, c) =>
                  cell ? <rect key={`${r}-${c}`} x={c*10} y={r*10} width="9" height="9" rx="1" fill="currentColor" /> : null
                )
              )}
            </svg>
            <span className="db-qr-label">Scan to verify</span>
          </div>
          <div className="db-member-card-bottom">
            <span>Valid until: <strong>{userData.planExpiry}</strong></span>
            <span>Since: <strong>{userData.memberSince}</strong></span>
          </div>
        </div>

        {/* Actions */}
        <div className="db-card-actions">
          <button className="btn btn-outline db-btn-sm">⬇ Download</button>
          <button className="btn btn-outline db-btn-sm">📤 Share</button>
          <button className="btn btn-primary db-btn-sm">🖨 Print</button>
        </div>

        {/* Details */}
        <div className="db-card db-member-details">
          <div className="db-card-header"><h3>Member Details</h3></div>
          <div className="db-details-grid">
            <div><span>Full Name</span><strong>{userData.name}</strong></div>
            <div><span>Member ID</span><strong>{userData.memberId}</strong></div>
            <div><span>Email</span><strong>{userData.email}</strong></div>
            <div><span>Phone</span><strong>{userData.phone}</strong></div>
            <div><span>Plan</span><strong>{userData.membershipPlan}</strong></div>
            <div><span>Member Since</span><strong>{userData.memberSince}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}
