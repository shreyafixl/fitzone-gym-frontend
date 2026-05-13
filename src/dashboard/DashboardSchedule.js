import { useState } from "react";
import { weeklySchedule } from "../data/dashboardData";

const statusColor = { available:"badge-green", booked:"badge-blue", live:"badge-red", full:"badge-gray" };

export default function DashboardSchedule() {
  const [booked, setBooked] = useState([]);

  const book = (dayIdx, classIdx) => {
    const key = `${dayIdx}-${classIdx}`;
    setBooked(prev => prev.includes(key) ? prev : [...prev, key]);
  };

  return (
    <div className="db-section">
      <div className="db-section-header">
        <h2>Class Schedule</h2>
        <div className="db-legend">
          <span><span className="db-dot" style={{background:"#22c55e"}}/>Available</span>
          <span><span className="db-dot" style={{background:"#3b82f6"}}/>Booked</span>
          <span><span className="db-dot" style={{background:"#ef4444"}}/>Live</span>
          <span><span className="db-dot" style={{background:"#6b7280"}}/>Full</span>
        </div>
      </div>

      <div className="db-schedule-grid">
        {weeklySchedule.map((day, di) => (
          <div className="db-day-col" key={day.day}>
            <div className="db-day-header">{day.day}</div>
            {day.classes.map((cls, ci) => {
              const key = `${di}-${ci}`;
              const isBooked = booked.includes(key) || cls.status === "booked";
              const status = isBooked ? "booked" : cls.status;
              return (
                <div className={`db-class-slot db-slot-${status}`} key={ci}>
                  {status === "live" && <span className="db-live-dot">🔴 LIVE</span>}
                  <span className="db-slot-time">{cls.time}</span>
                  <span className="db-slot-name">{cls.name}</span>
                  <span className="db-slot-trainer">{cls.trainer}</span>
                  <div className="db-slot-footer">
                    <span className={`db-badge ${statusColor[status]}`}>
                      {status === "live" ? "Live" : status === "booked" ? "Booked" : status === "full" ? "Full" : `${cls.spots} spots`}
                    </span>
                    {status === "available" && (
                      <button className="db-book-btn" onClick={() => book(di, ci)}>Book</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
