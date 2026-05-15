import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaClock, FaUser, FaCalendarAlt, FaChartBar, FaSearch, FaDownload } from 'react-icons/fa';
import trainerAttendanceAPI from '../services/trainerAttendanceAPI';
import '../styles/trainer-attendance.css';

/**
 * TrainerAttendance Component
 * Displays attendance tracking, check-in/check-out, and analytics
 */
function TrainerAttendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('today'); // 'today', 'history', 'analytics'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [toast, setToast] = useState(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [checkInForm, setCheckInForm] = useState({
    memberId: '',
    branchId: '',
    notes: '',
  });

  useEffect(() => {
    fetchAttendanceData();
  }, [viewMode, selectedDate]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (viewMode === 'today') {
        const data = await trainerAttendanceAPI.getTodayAttendance();
        setAttendanceRecords(data.attendance || []);
      } else if (viewMode === 'history') {
        const data = await trainerAttendanceAPI.getAttendanceRecords(1, 50, {
          startDate: selectedDate,
          endDate: selectedDate,
        });
        setAttendanceRecords(data.attendance || []);
      } else if (viewMode === 'analytics') {
        const data = await trainerAttendanceAPI.getMonthlyAnalytics();
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError(err.message || 'Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    try {
      const record = await trainerAttendanceAPI.markAttendance(
        checkInForm.memberId,
        checkInForm.branchId,
        null,
        checkInForm.notes
      );
      setAttendanceRecords([record.attendance, ...attendanceRecords]);
      setShowCheckInModal(false);
      setCheckInForm({ memberId: '', branchId: '', notes: '' });
      showToast('Member checked in successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to check in member', 'error');
    }
  };

  const handleCheckOut = async (attendanceId) => {
    try {
      const updated = await trainerAttendanceAPI.checkOut(attendanceId);
      setAttendanceRecords(attendanceRecords.map(r => r.id === attendanceId ? updated.attendance : r));
      showToast('Member checked out successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to check out member', 'error');
    }
  };

  const handleDownloadReport = async () => {
    try {
      const report = await trainerAttendanceAPI.getAttendanceReport(selectedDate, selectedDate);
      // Convert to CSV and download
      const csv = generateCSV(report.records);
      downloadCSV(csv, `attendance-${selectedDate}.csv`);
      showToast('Report downloaded successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to download report', 'error');
    }
  };

  const generateCSV = (records) => {
    const headers = ['Member', 'Email', 'Check In', 'Check Out', 'Duration (min)', 'Status'];
    const rows = records.map(r => [
      r.member.name,
      r.member.email,
      new Date(r.checkIn).toLocaleString(),
      r.checkOut ? new Date(r.checkOut).toLocaleString() : 'N/A',
      r.duration || 'N/A',
      r.status,
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (csv, filename) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getStatusColor = (status) => {
    const colors = {
      'present': '#22c55e',
      'absent': '#ef4444',
      'late': '#f59e0b',
      'leave': '#6b7280',
    };
    return colors[status] || '#6b7280';
  };

  if (loading) {
    return <div className="trainer-attendance loading">⏳ Loading attendance data...</div>;
  }

  return (
    <div className="trainer-attendance">
      <div className="attendance-header">
        <h2><FaCheckCircle /> Attendance Tracking</h2>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setShowCheckInModal(true)}>
            <FaCheckCircle /> Check In Member
          </button>
          {viewMode === 'history' && (
            <button className="btn btn-outline" onClick={handleDownloadReport}>
              <FaDownload /> Download Report
            </button>
          )}
        </div>
      </div>

      <div className="view-tabs">
        <button className={`tab ${viewMode === 'today' ? 'active' : ''}`} onClick={() => setViewMode('today')}>
          Today
        </button>
        <button className={`tab ${viewMode === 'history' ? 'active' : ''}`} onClick={() => setViewMode('history')}>
          History
        </button>
        <button className={`tab ${viewMode === 'analytics' ? 'active' : ''}`} onClick={() => setViewMode('analytics')}>
          <FaChartBar /> Analytics
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      {viewMode === 'today' && (
        <div className="attendance-today">
          <div className="attendance-summary">
            <div className="summary-card">
              <div className="summary-icon" style={{ color: '#22c55e' }}>👥</div>
              <div className="summary-content">
                <div className="summary-value">{attendanceRecords.filter(r => r.attendanceStatus === 'present').length}</div>
                <div className="summary-label">Present Today</div>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon" style={{ color: '#ef4444' }}>❌</div>
              <div className="summary-content">
                <div className="summary-value">{attendanceRecords.filter(r => r.attendanceStatus === 'absent').length}</div>
                <div className="summary-label">Absent</div>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon" style={{ color: '#f59e0b' }}>⏰</div>
              <div className="summary-content">
                <div className="summary-value">{attendanceRecords.filter(r => r.attendanceStatus === 'late').length}</div>
                <div className="summary-label">Late</div>
              </div>
            </div>
          </div>

          <div className="attendance-list">
            <div className="list-header">
              <h3>Today's Check-ins</h3>
              <input
                type="text"
                placeholder="Search member..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            {attendanceRecords.length === 0 ? (
              <div className="empty-state">No check-ins today</div>
            ) : (
              <div className="records-table">
                <table>
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords
                      .filter(r => r.memberId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(record => (
                        <tr key={record.id}>
                          <td>
                            <div className="member-info">
                              <FaUser /> {record.memberId?.fullName || 'Unknown'}
                            </div>
                          </td>
                          <td>{new Date(record.checkInTime).toLocaleTimeString()}</td>
                          <td>{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}</td>
                          <td>{record.duration ? `${record.duration} min` : '-'}</td>
                          <td>
                            <span className="status-badge" style={{ backgroundColor: getStatusColor(record.attendanceStatus) }}>
                              {record.attendanceStatus}
                            </span>
                          </td>
                          <td>
                            {!record.checkOutTime && (
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleCheckOut(record.id)}
                              >
                                Check Out
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {viewMode === 'history' && (
        <div className="attendance-history">
          <div className="history-filters">
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="date-input"
            />
          </div>

          {attendanceRecords.length === 0 ? (
            <div className="empty-state">No attendance records for this date</div>
          ) : (
            <div className="records-table">
              <table>
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Branch</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map(record => (
                    <tr key={record.id}>
                      <td>
                        <div className="member-info">
                          <FaUser /> {record.memberId?.fullName || 'Unknown'}
                        </div>
                      </td>
                      <td>{new Date(record.checkInTime).toLocaleTimeString()}</td>
                      <td>{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}</td>
                      <td>{record.duration ? `${record.duration} min` : '-'}</td>
                      <td>
                        <span className="status-badge" style={{ backgroundColor: getStatusColor(record.attendanceStatus) }}>
                          {record.attendanceStatus}
                        </span>
                      </td>
                      <td>{record.branchId?.branchName || 'Unknown'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {viewMode === 'analytics' && stats && (
        <div className="attendance-analytics">
          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>Monthly Summary</h3>
              <div className="stat-row">
                <span>Total Records:</span>
                <strong>{stats.summary?.totalRecords || 0}</strong>
              </div>
              <div className="stat-row">
                <span>Unique Members:</span>
                <strong>{stats.summary?.uniqueMembers || 0}</strong>
              </div>
              <div className="stat-row">
                <span>Avg Visits/Day:</span>
                <strong>{stats.summary?.averageVisitsPerDay || 0}</strong>
              </div>
            </div>

            <div className="analytics-card">
              <h3>Status Breakdown</h3>
              <div className="stat-row">
                <span style={{ color: '#22c55e' }}>Present:</span>
                <strong>{stats.dailyStats?.reduce((sum, d) => sum + d.present, 0) || 0}</strong>
              </div>
              <div className="stat-row">
                <span style={{ color: '#ef4444' }}>Absent:</span>
                <strong>{stats.dailyStats?.reduce((sum, d) => sum + d.absent, 0) || 0}</strong>
              </div>
              <div className="stat-row">
                <span style={{ color: '#f59e0b' }}>Late:</span>
                <strong>{stats.dailyStats?.reduce((sum, d) => sum + d.late, 0) || 0}</strong>
              </div>
            </div>
          </div>

          <div className="top-members">
            <h3>Top Members by Visits</h3>
            <div className="members-list">
              {stats.memberStats?.slice(0, 10).map((member, idx) => (
                <div key={idx} className="member-row">
                  <span className="rank">{idx + 1}</span>
                  <span className="name">{member.memberName}</span>
                  <span className="visits">{member.totalVisits} visits</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showCheckInModal && (
        <div className="modal-overlay" onClick={() => setShowCheckInModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Check In Member</h2>
              <button className="close-btn" onClick={() => setShowCheckInModal(false)}>×</button>
            </div>
            <form onSubmit={handleCheckIn} className="checkin-form">
              <div className="form-group">
                <label>Member ID *</label>
                <input
                  type="text"
                  value={checkInForm.memberId}
                  onChange={e => setCheckInForm({ ...checkInForm, memberId: e.target.value })}
                  placeholder="Enter member ID"
                  required
                />
              </div>
              <div className="form-group">
                <label>Branch ID *</label>
                <input
                  type="text"
                  value={checkInForm.branchId}
                  onChange={e => setCheckInForm({ ...checkInForm, branchId: e.target.value })}
                  placeholder="Enter branch ID"
                  required
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={checkInForm.notes}
                  onChange={e => setCheckInForm({ ...checkInForm, notes: e.target.value })}
                  placeholder="Optional notes"
                  rows="3"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowCheckInModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Check In</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainerAttendance;
