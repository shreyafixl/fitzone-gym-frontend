import { useMemo } from "react";
import { userData, weightLog, upcomingBookings } from "../data/dashboardData";
import trainersData from "../data/trainersData";

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="db-stat-card">
      <div className="db-stat-icon" style={{ background: color }}>{icon}</div>
      <div className="db-stat-info">
        <span className="db-stat-value">{value}</span>
        <span className="db-stat-label">{label}</span>
        {sub && <span className="db-stat-sub">{sub}</span>}
      </div>
    </div>
  );
}

function BMICard() {
  const bmi = userData.bmi;
  const category =
    bmi < 18.5 ? { label: "Underweight", color: "#3b82f6" } :
    bmi < 25   ? { label: "Normal",       color: "#22c55e" } :
    bmi < 30   ? { label: "Overweight",   color: "#f97316" } :
                 { label: "Obese",        color: "#ef4444" };

  // needle position: BMI 15–40 mapped to 0–100%
  const needlePos = Math.min(100, Math.max(0, ((bmi - 15) / 25) * 100));

  return (
    <div className="db-bmi-card">
      <h3>BMI & Fitness Score</h3>
      <div className="db-bmi-row">
        <div className="db-bmi-gauge">
          <div className="db-bmi-bar">
            <div className="db-bmi-needle" style={{ left: `${needlePos}%` }} />
          </div>
          <div className="db-bmi-labels">
            <span>Under</span><span>Normal</span><span>Over</span><span>Obese</span>
          </div>
          <div className="db-bmi-value" style={{ color: category.color }}>
            {bmi} <span>{category.label}</span>
          </div>
        </div>
        <div className="db-fitness-score">
          <svg viewBox="0 0 100 100" className="db-score-ring">
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border-color)" strokeWidth="10" />
            <circle
              cx="50" cy="50" r="40" fill="none"
              stroke="#f97316" strokeWidth="10"
              strokeDasharray={`${(userData.fitnessScore / 100) * 251.2} 251.2`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="db-score-text">
            <strong>{userData.fitnessScore}</strong>
            <span>Fitness Score</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function WeightProgress() {
  const first = weightLog[0].weight;
  const last  = weightLog[weightLog.length - 1].weight;
  const lost  = (first - last).toFixed(1);
  const toGo  = (last - userData.targetWeight).toFixed(1);
  const pct   = Math.min(100, Math.round(((first - last) / (first - userData.targetWeight)) * 100));

  return (
    <div className="db-weight-card">
      <h3>Weight Progress</h3>
      <div className="db-weight-nums">
        <div><strong>{last} kg</strong><span>Current</span></div>
        <div><strong>{userData.targetWeight} kg</strong><span>Target</span></div>
        <div><strong>-{lost} kg</strong><span>Lost</span></div>
        <div><strong>{toGo} kg</strong><span>To Go</span></div>
      </div>
      <div className="db-progress-bar-wrap">
        <div className="db-progress-bar">
          <div className="db-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span>{pct}% to goal</span>
      </div>
      <div className="db-mini-chart">
        {weightLog.map((entry, i) => {
          const h = Math.round(((entry.weight - userData.targetWeight) / (first - userData.targetWeight)) * 60);
          return (
            <div key={i} className="db-mini-bar-wrap" title={`${entry.weight} kg`}>
              <div className="db-mini-bar" style={{ height: `${Math.max(8, h)}px` }} />
              <span>{entry.date.slice(5, 7)}/{entry.date.slice(2, 4)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardOverview() {
  const trainer = useMemo(() => trainersData.find(t => t.id === userData.assignedTrainer), []);

  const expiryDate = new Date(userData.membershipExpiry);
  const today      = new Date();
  const daysLeft   = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

  const nextBooking = upcomingBookings[0];

  return (
    <div className="db-overview">
      {/* Welcome Banner */}
      <div className="db-welcome-banner">
        <div className="db-welcome-left">
          <div className="db-avatar">{userData.avatar}</div>
          <div>
            <h1>Welcome back, {userData.name.split(" ")[0]}! 👋</h1>
            <p>Keep pushing — you're on a <strong>{userData.attendanceStreak}-day streak!</strong></p>
          </div>
        </div>
        <div className="db-welcome-right">
          <div className="db-membership-badge">
            <span className="db-plan-icon">⭐</span>
            <div>
              <strong>{userData.membershipPlan} Member</strong>
              <span>{daysLeft} days remaining</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="db-stats-grid">
        <StatCard icon="🔥" label="Attendance Streak" value={`${userData.attendanceStreak} days`}  sub="Personal best: 18 days" color="rgba(249,115,22,0.15)" />
        <StatCard icon="🏋️" label="Sessions Attended" value={userData.totalSessions}               sub="This month: 9"          color="rgba(99,102,241,0.15)" />
        <StatCard icon="⚡" label="Calories Burned"   value={`${(userData.caloriesBurned/1000).toFixed(1)}k`} sub="This week: 1,240"  color="rgba(239,68,68,0.15)" />
        <StatCard icon="📅" label="Next Session"      value={nextBooking.class}                    sub={`${nextBooking.date} · ${nextBooking.time}`} color="rgba(34,197,94,0.15)" />
      </div>

      {/* BMI + Weight */}
      <div className="db-cards-row">
        <BMICard />
        <WeightProgress />
      </div>

      {/* Trainer Snapshot */}
      {trainer && (
        <div className="db-trainer-snapshot">
          <img src={trainer.image} alt={trainer.name} />
          <div>
            <span className="db-trainer-label">Your Trainer</span>
            <h3>{trainer.name}</h3>
            <p>{trainer.specialization} · {trainer.experience}</p>
          </div>
          <div className="db-trainer-actions">
            <button className="btn btn-primary">💬 Message</button>
            <button className="btn btn-outline">📅 Book PT</button>
          </div>
        </div>
      )}
    </div>
  );
}
