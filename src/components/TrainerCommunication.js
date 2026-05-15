import React, { useState, useEffect } from 'react';
import {
  FaEnvelope, FaBell, FaBullhorn, FaSearch, FaPlus, FaTrash, FaCheck,
  FaCheckDouble, FaReply, FaTimes, FaSpinner, FaExclamationTriangle
} from 'react-icons/fa';
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

// Messages Tab
function MessagesTab() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast, show } = useToast();

  useEffect(() => {
    fetchConversations();
    fetchUnreadCount();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await trainerCommunicationAPI.getInbox(1, 20);
      setConversations(data.conversations || []);
    } catch (error) {
      show(error.message || 'Failed to load conversations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await trainerCommunicationAPI.getUnreadCount();
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const handleSelectConversation = async (conversation) => {
    try {
      setSelectedConversation(conversation);
      const data = await trainerCommunicationAPI.getConversation(conversation.memberId, 1, 50);
      setMessages(data.messages || []);
      await fetchUnreadCount();
    } catch (error) {
      show(error.message || 'Failed to load conversation', 'error');
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) {
      show('Please type a message', 'error');
      return;
    }

    try {
      setSending(true);
      await trainerCommunicationAPI.sendMessage({
        receiverId: selectedConversation.memberId,
        message: messageText,
      });
      setMessageText('');
      await handleSelectConversation(selectedConversation);
      show('Message sent successfully');
    } catch (error) {
      show(error.message || 'Failed to send message', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Delete this message?')) return;

    try {
      await trainerCommunicationAPI.deleteMessage(messageId);
      setMessages(messages.filter(m => m.id !== messageId));
      show('Message deleted');
    } catch (error) {
      show(error.message || 'Failed to delete message', 'error');
    }
  };

  if (loading) {
    return (
      <div className="tc-loading">
        <FaSpinner className="tc-spinner" />
        <p>Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="tc-messages-container">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => {}} />}

      <div className="tc-conversations-list">
        <div className="tc-list-header">
          <h3><FaEnvelope /> Messages</h3>
          {unreadCount > 0 && <span className="tc-badge tc-badge-red">{unreadCount} unread</span>}
        </div>

        {conversations.length === 0 ? (
          <div className="tc-empty">
            <FaEnvelope style={{ fontSize: '2rem', opacity: 0.3 }} />
            <p>No conversations yet</p>
          </div>
        ) : (
          conversations.map(conv => (
            <div
              key={conv.memberId}
              className={`tc-conversation-item ${selectedConversation?.memberId === conv.memberId ? 'tc-active' : ''}`}
              onClick={() => handleSelectConversation(conv)}
            >
              <div className="tc-conv-avatar">
                {conv.member?.profileImage ? (
                  <img src={conv.member.profileImage} alt={conv.member.fullName} />
                ) : (
                  <div className="tc-avatar-placeholder">
                    {conv.member?.fullName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="tc-conv-info">
                <strong>{conv.member?.fullName}</strong>
                <p>{conv.lastMessage?.substring(0, 40)}...</p>
              </div>
              {conv.unreadCount > 0 && (
                <span className="tc-unread-badge">{conv.unreadCount}</span>
              )}
            </div>
          ))
        )}
      </div>

      <div className="tc-messages-view">
        {selectedConversation ? (
          <>
            <div className="tc-messages-header">
              <h3>{selectedConversation.member?.fullName}</h3>
              <p>{selectedConversation.member?.email}</p>
            </div>

            <div className="tc-messages-body">
              {messages.length === 0 ? (
                <div className="tc-empty">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className={`tc-message ${msg.senderId === selectedConversation.memberId ? 'tc-received' : 'tc-sent'}`}>
                    <div className="tc-message-content">
                      <p>{msg.message}</p>
                      <small>{new Date(msg.sentAt).toLocaleString()}</small>
                    </div>
                    {msg.senderId !== selectedConversation.memberId && (
                      <button
                        className="tc-delete-btn"
                        onClick={() => handleDeleteMessage(msg.id)}
                        title="Delete message"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="tc-message-input">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message..."
                rows={3}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleSendMessage();
                  }
                }}
              />
              <button
                className="tc-btn tc-btn-primary"
                onClick={handleSendMessage}
                disabled={sending || !messageText.trim()}
              >
                {sending ? <FaSpinner className="tc-spinner" /> : <FaReply />}
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </>
        ) : (
          <div className="tc-empty" style={{ height: '100%' }}>
            <FaEnvelope style={{ fontSize: '3rem', opacity: 0.2 }} />
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Notifications Tab
function NotificationsTab() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const { toast, show } = useToast();

  useEffect(() => {
    fetchNotifications();
    fetchStats();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await trainerCommunicationAPI.getAllNotifications(1, 50);
      setNotifications(data.notifications || []);
    } catch (error) {
      show(error.message || 'Failed to load notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await trainerCommunicationAPI.getNotificationStats();
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (!window.confirm('Delete this notification?')) return;

    try {
      await trainerCommunicationAPI.deleteNotification(notificationId);
      setNotifications(notifications.filter(n => n.id !== notificationId));
      show('Notification deleted');
    } catch (error) {
      show(error.message || 'Failed to delete notification', 'error');
    }
  };

  if (loading) {
    return (
      <div className="tc-loading">
        <FaSpinner className="tc-spinner" />
        <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="tc-notifications-container">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => {}} />}

      {stats && (
        <div className="tc-stats-grid">
          <div className="tc-stat-card">
            <strong>{stats.total}</strong>
            <span>Total Sent</span>
          </div>
          <div className="tc-stat-card">
            <strong>{stats.totalRead}</strong>
            <span>Read</span>
          </div>
          <div className="tc-stat-card">
            <strong>{stats.totalUnread}</strong>
            <span>Unread</span>
          </div>
          <div className="tc-stat-card">
            <strong>{stats.readRate}%</strong>
            <span>Read Rate</span>
          </div>
        </div>
      )}

      <div className="tc-notifications-list">
        {notifications.length === 0 ? (
          <div className="tc-empty">
            <FaBell style={{ fontSize: '2rem', opacity: 0.3 }} />
            <p>No notifications sent yet</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div key={notif.id} className={`tc-notification-item tc-priority-${notif.priority}`}>
              <div className="tc-notif-header">
                <strong>{notif.title}</strong>
                <small>{new Date(notif.sentAt).toLocaleString()}</small>
              </div>
              <p>{notif.message}</p>
              <div className="tc-notif-footer">
                <span className={`tc-badge tc-badge-${notif.priority}`}>{notif.priority}</span>
                <span className={`tc-badge tc-badge-${notif.isRead ? 'green' : 'gray'}`}>
                  {notif.isRead ? 'Read' : 'Unread'}
                </span>
                <button
                  className="tc-delete-btn"
                  onClick={() => handleDeleteNotification(notif.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Announcements Tab
function AnnouncementsTab() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const { toast, show } = useToast();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await trainerCommunicationAPI.getAnnouncements(1, 50);
      setAnnouncements(data.announcements || []);
    } catch (error) {
      show(error.message || 'Failed to load announcements', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewAnnouncement = async (announcement) => {
    try {
      const data = await trainerCommunicationAPI.getAnnouncementById(announcement.id);
      setSelectedAnnouncement(data.announcement);
    } catch (error) {
      show(error.message || 'Failed to load announcement', 'error');
    }
  };

  if (loading) {
    return (
      <div className="tc-loading">
        <FaSpinner className="tc-spinner" />
        <p>Loading announcements...</p>
      </div>
    );
  }

  return (
    <div className="tc-announcements-container">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => {}} />}

      {selectedAnnouncement ? (
        <div className="tc-announcement-detail">
          <button
            className="tc-back-btn"
            onClick={() => setSelectedAnnouncement(null)}
          >
            ← Back
          </button>
          <h2>{selectedAnnouncement.title}</h2>
          <div className="tc-announcement-meta">
            <span className={`tc-badge tc-badge-${selectedAnnouncement.priority}`}>
              {selectedAnnouncement.priority}
            </span>
            <span className={`tc-badge tc-badge-${selectedAnnouncement.category}`}>
              {selectedAnnouncement.category}
            </span>
            <small>{new Date(selectedAnnouncement.publishDate).toLocaleString()}</small>
          </div>
          <div className="tc-announcement-body">
            {selectedAnnouncement.description}
          </div>
          {selectedAnnouncement.attachments && selectedAnnouncement.attachments.length > 0 && (
            <div className="tc-attachments">
              <h4>Attachments</h4>
              {selectedAnnouncement.attachments.map((att, idx) => (
                <a key={idx} href={att.fileUrl} target="_blank" rel="noopener noreferrer">
                  📎 {att.fileName}
                </a>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="tc-announcements-list">
          {announcements.length === 0 ? (
            <div className="tc-empty">
              <FaBullhorn style={{ fontSize: '2rem', opacity: 0.3 }} />
              <p>No announcements</p>
            </div>
          ) : (
            announcements.map(ann => (
              <div
                key={ann.id}
                className={`tc-announcement-item ${ann.isPinned ? 'tc-pinned' : ''}`}
                onClick={() => handleViewAnnouncement(ann)}
              >
                {ann.isPinned && <span className="tc-pin-icon">📌</span>}
                <h4>{ann.title}</h4>
                <p>{ann.description.substring(0, 100)}...</p>
                <div className="tc-ann-footer">
                  <span className={`tc-badge tc-badge-${ann.priority}`}>{ann.priority}</span>
                  <small>{new Date(ann.publishDate).toLocaleDateString()}</small>
                  <small>👁 {ann.viewCount} views</small>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// Main Communication Component
export default function TrainerCommunication() {
  const [activeTab, setActiveTab] = useState('messages');

  const tabs = [
    { id: 'messages', label: 'Messages', icon: <FaEnvelope /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
    { id: 'announcements', label: 'Announcements', icon: <FaBullhorn /> },
  ];

  return (
    <div className="tc-container">
      <div className="tc-header">
        <h1>Communication Center</h1>
        <p>Manage messages, notifications, and announcements</p>
      </div>

      <div className="tc-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tc-tab ${activeTab === tab.id ? 'tc-tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="tc-content">
        {activeTab === 'messages' && <MessagesTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'announcements' && <AnnouncementsTab />}
      </div>
    </div>
  );
}
