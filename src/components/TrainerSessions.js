import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaUsers, FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimes } from 'react-icons/fa';
import trainerScheduleAPI from '../services/trainerScheduleAPI';
import '../styles/trainer-sessions.css';

/**
 * TrainerSessions Component
 * Displays trainer's sessions with calendar view, create/edit/delete functionality
 */
function TrainerSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [formData, setFormData] = useState({
    sessionType: 'personal-training',
    sessionTitle: '',
    sessionDescription: '',
    sessionDate: '',
    startTime: '',
    endTime: '',
    branchId: '',
    location: '',
    maxParticipants: 1,
    sessionCategory: 'other',
    difficultyLevel: 'all-levels',
    price: 0,
    notes: '',
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trainerScheduleAPI.getAllSessions(1, 100);
      setSessions(data.sessions || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError(err.message || 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      const newSession = await trainerScheduleAPI.createSession(formData);
      setSessions([...sessions, newSession.session]);
      setShowModal(false);
      resetForm();
      showToast('Session created successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to create session', 'error');
    }
  };

  const handleUpdateSession = async (e) => {
    e.preventDefault();
    try {
      const updated = await trainerScheduleAPI.updateSession(editingSession._id, formData);
      setSessions(sessions.map(s => s.id === editingSession._id ? updated.session : s));
      setShowModal(false);
      setEditingSession(null);
      resetForm();
      showToast('Session updated successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to update session', 'error');
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    try {
      await trainerScheduleAPI.deleteSession(sessionId);
      setSessions(sessions.filter(s => s.id !== sessionId));
      showToast('Session deleted successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to delete session', 'error');
    }
  };

  const handleCancelSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to cancel this session?')) return;
    try {
      const updated = await trainerScheduleAPI.cancelSession(sessionId, 'Cancelled by trainer');
      setSessions(sessions.map(s => s.id === sessionId ? updated.session : s));
      showToast('Session cancelled successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to cancel session', 'error');
    }
  };

  const handleEditClick = (session) => {
    setEditingSession(session);
    setFormData({
      sessionType: session.sessionType,
      sessionTitle: session.sessionTitle,
      sessionDescription: session.sessionDescription || '',
      sessionDate: new Date(session.sessionDate).toISOString().split('T')[0],
      startTime: new Date(session.startTime).toTimeString().slice(0, 5),
      endTime: new Date(session.endTime).toTimeString().slice(0, 5),
      branchId: session.branchId._id || session.branchId,
      location: session.location || '',
      maxParticipants: session.maxParticipants,
      sessionCategory: session.sessionCategory,
      difficultyLevel: session.difficultyLevel,
      price: session.price,
      notes: session.notes || '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      sessionType: 'personal-training',
      sessionTitle: '',
      sessionDescription: '',
      sessionDate: '',
      startTime: '',
      endTime: '',
      branchId: '',
      location: '',
      maxParticipants: 1,
      sessionCategory: 'other',
      difficultyLevel: 'all-levels',
      price: 0,
      notes: '',
    });
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getSessionsForDate = (date) => {
    return sessions.filter(s => {
      const sessionDate = new Date(s.sessionDate);
      return sessionDate.toDateString() === date.toDateString();
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'scheduled': '#3b82f6',
      'in-progress': '#f59e0b',
      'completed': '#22c55e',
      'cancelled': '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  if (loading) {
    return <div className="trainer-sessions loading">⏳ Loading sessions...</div>;
  }

  return (
    <div className="trainer-sessions">
      <div className="sessions-header">
        <h2><FaCalendarAlt /> Sessions & Calendar</h2>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => { setEditingSession(null); resetForm(); setShowModal(true); }}>
            <FaPlus /> New Session
          </button>
          <div className="view-toggle">
            <button className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>List</button>
            <button className={`toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`} onClick={() => setViewMode('calendar')}>Calendar</button>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      {viewMode === 'list' ? (
        <div className="sessions-list">
          {sessions.length === 0 ? (
            <div className="empty-state">No sessions scheduled</div>
          ) : (
            sessions.map(session => (
              <div key={session.id} className="session-card" style={{ borderLeftColor: getStatusColor(session.sessionStatus) }}>
                <div className="session-header">
                  <h3>{session.sessionTitle}</h3>
                  <span className="session-status" style={{ backgroundColor: getStatusColor(session.sessionStatus) }}>
                    {session.sessionStatus}
                  </span>
                </div>
                <div className="session-details">
                  <div className="detail-row">
                    <FaCalendarAlt /> {new Date(session.sessionDate).toLocaleDateString()}
                  </div>
                  <div className="detail-row">
                    <FaClock /> {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="detail-row">
                    <FaUsers /> {session.participantCount || 0} / {session.maxParticipants} participants
                  </div>
                  {session.location && <div className="detail-row">📍 {session.location}</div>}
                </div>
                <div className="session-actions">
                  {session.sessionStatus === 'scheduled' && (
                    <>
                      <button className="btn btn-sm btn-outline" onClick={() => handleEditClick(session)}>
                        <FaEdit /> Edit
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleCancelSession(session.id)}>
                        <FaTimes /> Cancel
                      </button>
                    </>
                  )}
                  {session.sessionStatus !== 'completed' && session.sessionStatus !== 'cancelled' && (
                    <button className="btn btn-sm btn-primary" onClick={() => handleDeleteSession(session.id)}>
                      <FaTrash /> Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="calendar-view">
          <div className="calendar-header">
            <button onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 7 * 24 * 60 * 60 * 1000))}>← Prev Week</button>
            <h3>{selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
            <button onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000))}>Next Week →</button>
          </div>
          <div className="calendar-grid">
            {Array.from({ length: 7 }).map((_, i) => {
              const date = new Date(selectedDate);
              date.setDate(date.getDate() - date.getDay() + i);
              const daySessions = getSessionsForDate(date);
              return (
                <div key={i} className="calendar-day">
                  <div className="day-header">{date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                  <div className="day-sessions">
                    {daySessions.map(session => (
                      <div key={session.id} className="day-session" style={{ backgroundColor: getStatusColor(session.sessionStatus) + '20', borderColor: getStatusColor(session.sessionStatus) }}>
                        <div className="session-time">{new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        <div className="session-title">{session.sessionTitle}</div>
                        <div className="session-participants">{session.participantCount || 0}/{session.maxParticipants}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingSession ? 'Edit Session' : 'Create New Session'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={editingSession ? handleUpdateSession : handleCreateSession} className="session-form">
              <div className="form-group">
                <label>Session Title *</label>
                <input
                  type="text"
                  value={formData.sessionTitle}
                  onChange={e => setFormData({ ...formData, sessionTitle: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Session Type *</label>
                  <select
                    value={formData.sessionType}
                    onChange={e => setFormData({ ...formData, sessionType: e.target.value })}
                    required
                  >
                    <option value="personal-training">Personal Training</option>
                    <option value="group-class">Group Class</option>
                    <option value="consultation">Consultation</option>
                    <option value="assessment">Assessment</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={formData.sessionDate}
                    onChange={e => setFormData({ ...formData, sessionDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Time *</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Time *</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Max Participants</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.maxParticipants}
                    onChange={e => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Price (Rs.)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.sessionDescription}
                  onChange={e => setFormData({ ...formData, sessionDescription: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingSession ? 'Update Session' : 'Create Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainerSessions;
