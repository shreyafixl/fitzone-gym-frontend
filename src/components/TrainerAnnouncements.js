import React, { useState, useEffect } from 'react';
import { FaBullhorn, FaCheck, FaArrowRight } from 'react-icons/fa';
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

export default function TrainerAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast, show } = useToast();

  useEffect(() => {
    fetchAnnouncements();
  }, [filter, page]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const isRead = filter === 'unread' ? false : filter === 'read' ? true : null;
      const data = await trainerCommunicationAPI.getAnnouncements(page, 10, isRead);
      setAnnouncements(data.announcements || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      show(error.message || 'Failed to load announcements', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (announcement) => {
    try {
      const data = await trainerCommunicationAPI.getAnnouncementDetails(announcement._id);
      setSelectedAnnouncement(data);
      show('Announcement marked as read');
    } catch (error) {
      show(error.message || 'Failed to load announcement', 'error');
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      general: '#3b82f6',
      urgent: '#ef4444',
      maintenance: '#f59e0b',
      feature: '#10b981',
      policy: '#8b5cf6',
      event: '#ec4899',
    };
    return colors[type] || '#64748b';
  };

  const getTypeIcon = (type) => {
    const icons = {
      general: '📢',
      urgent: '🚨',
      maintenance: '🔧',
      feature: '✨',
      policy: '📋',
      event: '🎉',
    };
    return icons[type] || '📢';
  };

  if (loading && announcements.length === 0) {
    return (
      <div className="tc-section" style={{ textAlign: 'center', padding: '40px' }}>
        <p>⏳ Loading announcements...</p>
      </div>
    );
  }

  if (selectedAnnouncement) {
    return (
      <div className="tc-announcement-detail">
        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => {}} />}

        <button
          className="tc-back-btn"
          onClick={() => setSelectedAnnouncement(null)}
          style={{ marginBottom: '20px' }}
        >
          ← Back to Announcements
        </button>

        <div className="tc-detail-card">
          {selectedAnnouncement.imageUrl && (
            <img
              src={selectedAnnouncement.imageUrl}
              alt={selectedAnnouncement.title}
              className="tc-detail-image"
            />
          )}

          <div className="tc-detail-header">
            <div>
              <h1>{selectedAnnouncement.title}</h1>
              <p className="tc-detail-meta">
                By {selectedAnnouncement.createdBy?.fullName} •{' '}
                {new Date(selectedAnnouncement.publishedAt).toLocaleDateString()}
              </p>
            </div>
            <span
              className="tc-type-badge"
              style={{ backgroundColor: getTypeColor(selectedAnnouncement.announcementType) }}
            >
              {getTypeIcon(selectedAnnouncement.announcementType)} {selectedAnnouncement.announcementType}
            </span>
          </div>

          <div className="tc-detail-content">
            <p>{selectedAnnouncement.content}</p>
          </div>

          {selectedAnnouncement.attachments && selectedAnnouncement.attachments.length > 0 && (
            <div className="tc-attachments">
              <h3>Attachments</h3>
              {selectedAnnouncement.attachments.map((att, idx) => (
                <a
                  key={idx}
                  href={att.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tc-attachment-link"
                >
                  📎 {att.fileName}
                </a>
              ))}
            </div>
          )}

          {selectedAnnouncement.actionUrl && (
            <a
              href={selectedAnnouncement.actionUrl}
              className="tc-btn tc-btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              {selectedAnnouncement.actionLabel || 'View'} <FaArrowRight />
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="tc-announcements-container">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => {}} />}

      <div className="tc-announcements-header">
        <h2><FaBullhorn /> Announcements</h2>
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

      <div className="tc-announcements-list">
        {announcements.length === 0 ? (
          <div className="tc-empty-state">
            <FaBullhorn style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }} />
            <p>No announcements</p>
          </div>
        ) : (
          announcements.map(announcement => (
            <div
              key={announcement._id}
              className={`tc-announcement-card ${!announcement.isReadByTrainer ? 'tc-unread' : ''}`}
              onClick={() => handleViewDetails(announcement)}
            >
              <div className="tc-announcement-icon">
                {getTypeIcon(announcement.announcementType)}
              </div>

              <div className="tc-announcement-content">
                <div className="tc-announcement-header">
                  <h3>{announcement.title}</h3>
                  {announcement.imageUrl && (
                    <img
                      src={announcement.imageUrl}
                      alt={announcement.title}
                      className="tc-announcement-thumb"
                    />
                  )}
                </div>
                <p className="tc-announcement-description">
                  {announcement.description || announcement.content.substring(0, 100)}...
                </p>
                <div className="tc-announcement-footer">
                  <small>
                    By {announcement.createdBy?.fullName} •{' '}
                    {new Date(announcement.publishedAt).toLocaleDateString()}
                  </small>
                  <span
                    className="tc-type-badge"
                    style={{ backgroundColor: getTypeColor(announcement.announcementType) }}
                  >
                    {announcement.announcementType}
                  </span>
                </div>
              </div>

              <div className="tc-announcement-action">
                {!announcement.isReadByTrainer && (
                  <span className="tc-unread-indicator">
                    <FaCheck />
                  </span>
                )}
                <FaArrowRight />
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
