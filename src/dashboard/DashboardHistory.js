import { workoutHistory } from "../data/dashboardData";

export default function DashboardHistory() {
  const totalCals = workoutHistory.reduce((s, w) => s + w.calories, 0);
  const totalMins = workoutHistory.reduce((s, w) => s + parseInt(w.duration), 0);

  return (
    <div className="db-section">
      <div className="db-section-header">
        <h2>Workout History</h2>
        <span className="db-badge badge-blue">{workoutHistory.length} sessions</span>
      </div>

      <div className="db-stats-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <div className="db-stat-card">
          <div className="db-stat-icon" style={{ background: "rgba(249,115,22,0.15)" }}>🏋️</div>
          <div className="db-stat-info"><span className="db-stat-value">{workoutHistory.length}</span><span className="db-stat-label">Total Sessions</span></div>
        </div>
        <div className="db-stat-card">
          <div className="db-stat-icon" style={{ background: "rgba(239,68,68,0.15)" }}>🔥</div>
          <div className="db-stat-info"><span className="db-stat-value">{totalCals.toLocaleString()}</span><span className="db-stat-label">Calories Burned</span></div>
        </div>
        <div className="db-stat-card">
          <div className="db-stat-icon" style={{ background: "rgba(34,197,94,0.15)" }}>⏱</div>
          <div className="db-stat-info"><span className="db-stat-value">{totalMins} min</span><span className="db-stat-label">Total Time</span></div>
        </div>
      </div>

      <div className="db-card">
        <table className="db-table">
          <thead>
            <tr><th>Date</th><th>Class</th><th>Trainer</th><th>Duration</th><th>Calories</th><th>Rating</th></tr>
          </thead>
          <tbody>
            {workoutHistory.map(w => (
              <tr key={w.id}>
                <td>{w.date}</td>
                <td><strong>{w.class}</strong></td>
                <td>{w.trainer}</td>
                <td>⏱ {w.duration}</td>
                <td>🔥 {w.calories} kcal</td>
                <td>{"⭐".repeat(w.rating)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
