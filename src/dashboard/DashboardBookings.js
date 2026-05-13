import { useState, useCallback } from "react";
import { upcomingBookings, bookingHistory } from "../data/dashboardData";
import classesData from "../data/classesData";

export default function DashboardBookings({ tab: initialTab = "upcoming" }) {
  const [tab, setTab]       = useState(initialTab);
  const [bookings, setBookings] = useState(upcomingBookings);
  const [showBook, setShowBook] = useState(false);
  const [booked, setBooked]     = useState(null);
  const [search, setSearch]     = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const cancelBooking = useCallback((id) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  }, []);

  const bookClass = useCallback((cls) => {
    const newBooking = {
      id: Date.now(), date: "May 12, 2026", time: "07:00 AM",
      class: cls.name, trainer: cls.trainer, duration: cls.duration,
      status: "confirmed", type: "Group Class", slot: "1/15",
    };
    setBookings(prev => [...prev, newBooking]);
    setBooked(cls.name); setShowBook(false);
    setTimeout(() => setBooked(null), 3000);
  }, []);

  const filteredHistory = bookingHistory.filter(b =>
    (typeFilter === "all" || b.type === typeFilter) &&
    b.class.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="db-section">
      <div className="db-section-header">
        <h2>Bookings</h2>
        {tab === "upcoming" && (
          <button className="btn btn-primary" onClick={() => setShowBook(s => !s)}>
            {showBook ? "Close" : "+ Book New Class"}
          </button>
        )}
      </div>

      <div className="db-tabs">
        {[["upcoming","Upcoming"],["history","History"]].map(([id,l]) => (
          <button key={id} className={`db-tab ${tab===id?"db-tab--active":""}`} onClick={() => setTab(id)}>{l}</button>
        ))}
      </div>

      {booked && <div className="db-toast">Booked: {booked}!</div>}

      {tab === "upcoming" && (
        <>
          {showBook && (
            <div className="db-book-panel">
              <h3>Available Classes</h3>
              <div className="db-book-grid">
                {classesData.slice(0, 6).map(cls => (
                  <div className="db-book-card" key={cls.id}>
                    <img src={cls.image} alt={cls.name} />
                    <div className="db-book-info">
                      <strong>{cls.name}</strong>
                      <span>{cls.trainer} Â· {cls.duration}</span>
                      <span className="db-difficulty">{cls.difficulty}</span>
                    </div>
                    <button className="btn btn-primary db-btn-sm" onClick={() => bookClass(cls)}>Book</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="db-stats-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
            <div className="db-stat-card"><div className="db-stat-icon" style={{ background:"rgba(34,197,94,.15)" }}>Conf</div><div className="db-stat-info"><span className="db-stat-value">{bookings.filter(b=>b.status==="confirmed").length}</span><span className="db-stat-label">Confirmed</span></div></div>
            <div className="db-stat-card"><div className="db-stat-icon" style={{ background:"rgba(234,179,8,.15)" }}>Pend</div><div className="db-stat-info"><span className="db-stat-value">{bookings.filter(b=>b.status==="pending").length}</span><span className="db-stat-label">Pending</span></div></div>
            <div className="db-stat-card"><div className="db-stat-icon" style={{ background:"rgba(249,115,22,.15)" }}>Total</div><div className="db-stat-info"><span className="db-stat-value">{bookings.length}</span><span className="db-stat-label">Total</span></div></div>
          </div>
          {bookings.length === 0 ? (
            <p className="db-empty">No upcoming bookings. Book a class above!</p>
          ) : (
            <div className="db-bookings-list">
              {bookings.map(b => (
                <div className="db-booking-item" key={b.id}>
                  <div className="db-booking-type-icon">{b.type === "PT Session" ? "ðŸ…" : "ðŸƒ"}</div>
                  <div className="db-booking-details">
                    <strong>{b.class}</strong>
                    <span>Trainer: {b.trainer}</span>
                    <span>{b.date} Â· {b.time} Â· {b.slot && `Slot: ${b.slot}`}</span>
                  </div>
                  <div className="db-booking-right">
                    <span className={`db-status db-status--${b.status}`}>{b.status}</span>
                    <button className="db-cancel-btn" onClick={() => cancelBooking(b.id)}>Cancel</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "history" && (
        <>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
            <div style={{ position:"relative" }}>
              <input className="db-input" placeholder="Search class..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth:220, paddingLeft:30 }} />
              <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:".8rem", color:"var(--text-secondary)" }}>ðŸ”</span>
            </div>
            {["all","Group Class","PT Session"].map(f => (
              <button key={f} className={`db-tab ${typeFilter===f?"db-tab--active":""}`} style={{ padding:"8px 14px" }} onClick={() => setTypeFilter(f)}>{f}</button>
            ))}
          </div>
          <div className="db-card">
            {filteredHistory.length === 0 ? <p style={{ textAlign:"center", color:"var(--text-secondary)", padding:"30px 0" }}>No records found.</p> : (
              <table className="db-table">
                <thead><tr><th>Class</th><th>Trainer</th><th>Date</th><th>Time</th><th>Type</th><th>Status</th></tr></thead>
                <tbody>
                  {filteredHistory.map(b => (
                    <tr key={b.id}>
                      <td><strong>{b.class}</strong></td>
                      <td>{b.trainer}</td>
                      <td style={{ fontSize:".82rem" }}>{b.date}</td>
                      <td style={{ fontSize:".82rem", color:"var(--accent)", fontWeight:700 }}>{b.time}</td>
                      <td><span className="db-badge badge-blue">{b.type}</span></td>
                      <td><span className={`db-badge ${b.status==="completed"?"badge-green":b.status==="cancelled"?"badge-red":"badge-yellow"}`}>{b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

