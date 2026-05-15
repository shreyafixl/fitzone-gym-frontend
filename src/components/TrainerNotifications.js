import React, { useState, useEffect } from 'react';
import { FaBell, FaCheck, FaTrash, FaCheckDouble } from 'react-icons/fa';
import trainerCommunicationAPI from '../services/trainerCommunicationAPI';
import '../styles/trainer-communication.css';

function Toast({ msg, type = 'success', onClose }) {
  return (
    <div className={`tc-toast tc-toast-${type}`}>
      <span>{type === 'success' ? '✓' : '✕'} {msg}</span>
      <button onClick={onClose} className="tc-toast-close">×</button>
    </div>
  );
}

function useToast() {
  const [toast, setToast] = useState(null);
  const show = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };
  return { toast, show };
}

export default function TrainerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast, show } = useToast();

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [filter, page]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const isRead = filter === 'unread' ? false : filter === 'read' ? true : null;
      const data = await trainerCommunicationAPI.getNotifications(page, 20, isRead);
      setNotifications(data.notifications || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      show(error.message || 'Failed to load notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await trainerCommunicationAPI.getUnreadNotificationCount();
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await trainerCommunicationAPI.markNotificationAsRead(notificationId);
      setNotifications(notifications.map(n =>
        n._id === notificationId ? { ...n, isRead: true } : n
      ));
      await fetchUnreadCount();
      show('Notification marked as read');
    } catch (error) {
      show(error.message || 'Failed to mark notification as read', 'error');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await trainerCommunicationAPI.markAllNotificationsAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      show('All notifications marked as read');
    } catch (error) {
      show(error.message || 'Failed to mark all as read', 'error');
    }
  };

  const handleDelete = async (notificationId) => {
    if (!window.confirm('Delete this notification?')) return;

    try {
      await trainerCommunicationAPI.deleteNotification(notificationId);
      setNotifications(notifications.filter(n => n._id !== notificationId));
      await fetchUnreadCount();
      show('Notification deleted');
    } catch (error) {
      show(error.message || 'Failed to delete notification', 'error');
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#3b82f6',
      medium: '#f59e0b',
      high: '#ef4444',
      urgent: '#dc2626',
    };
    return colors[priority] || '#64748b';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      booking: '📅',
      message: '💬',
      payment: '💳',
      system: '⚙️',
      member: '👤',
      announcement: '📢',
    };
    return icons[category] || '🔔';
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="tc-section" style={{ textAlign: 'center', padding: '40px' }}>
        <p>⏳ Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="tc-notifications-container">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => {}} />}

      <div className="tc-notifications-header">
        <div>
          <h2><FaBell /> Notifications</h2>
          {unreadCount > 0 && (
            <span className="tc-unread-badge" style={{ marginLeft: '12px' }}>
              {unreadCount} unread
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            className="tc-btn tc-btn-secondary"
            onClick={handleMarkAllAsRead}
          >
            <FaCheckDouble /> Mark all as read
          </button>
        )}
      </div>

      <div className="tc-filter-tabs">
        {['all', 'unread', 'read'].map(f => (
          <button
            key={f}
            className={`tc-filter-tab ${filter === f ? 'tc-active' : ''}`}
            onClick={() => {
              setFilter(f);
              setPage(1);
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="tc-notifications-list">
        {notifications.length === 0 ? (
          <div className="tc-empty-state">
            <FaBell style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }} />
            <p>No notifications</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification._id}
              className={`tc-notification-item ${!notification.isRead ? 'tc-unread' : ''}`}
            >
              <div className="tc-notification-icon">
                {getCategoryIcon(notification.category)}
              </div>

              <div className="tc-notification-content">
                <div className="tc-notification-header">
                  <h4>{notification.title}</h4>
                  <span
                    className="tc-priority-badge"
                    style={{ borderColor: getPriorityColor(notification.priority) }}
                  >
                    {notification.priority}
                  </span>
                </div>
                <p className="tc-notification-message">{notification.message}</p>
                {notification.description && (
                  <p className="tc-notification-description">{notification.description}</p>
                )}
                <small className="tc-notification-time">
                  {new Date(notification.createdAt).toLocaleString()}
                </small>
              </div>

              <div className="tc-notification-actions">
                {!notification.isRead && (
                  <button
                    className="tc-action-btn"
                    onClick={() => handleMarkAsRead(notification._id)}
                    title="Mark as read"
                  >
                    <FaCheck />
                  </button>
                )}
                <button
                  className="tc-action-btn tc-delete"
                  onClick={() => handleDelete(notification._id)}
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="tc-pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="tc-page-btn"
          >
            ← Previous
          </button>
          <span className="tc-page-info">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="tc-page-btn"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
