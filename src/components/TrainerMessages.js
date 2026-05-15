import React, { useState, useEffect, useRef } from 'react';
import { FaEnvelope, FaSearch, FaPaperPlane, FaTrash, FaArrowLeft, FaCircle } from 'react-icons/fa';
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

export default function TrainerMessages() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const { toast, show } = useToast();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.conversationId);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await trainerCommunicationAPI.getConversations();
      setConversations(Array.isArray(data) ? data : data.conversations || []);
    } catch (error) {
      show(error.message || 'Failed to load conversations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const data = await trainerCommunicationAPI.getConversationMessages(conversationId);
      setMessages(data.messages || []);
    } catch (error) {
      show(error.message || 'Failed to load messages', 'error');
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) {
      show('Please enter a message', 'error');
      return;
    }

    try {
      setSending(true);
      const recipientId = selectedConversation.recipient._id;
      await trainerCommunicationAPI.sendMessage(recipientId, messageText);
      setMessageText('');
      await fetchMessages(selectedConversation.conversationId);
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
      setMessages(messages.filter(m => m._id !== messageId));
      show('Message deleted successfully');
    } catch (error) {
      show(error.message || 'Failed to delete message', 'error');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    (conv.recipient?.fullName || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="tc-section" style={{ textAlign: 'center', padding: '40px' }}>
        <p>⏳ Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="tc-messages-container">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => {}} />}

      <div className="tc-messages-layout">
        {/* Conversations List */}
        <div className="tc-conversations-panel">
          <div className="tc-panel-header">
            <h3><FaEnvelope /> Messages</h3>
          </div>

          <div className="tc-search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="tc-search-input"
            />
          </div>

          <div className="tc-conversations-list">
            {filteredConversations.length === 0 ? (
              <div className="tc-empty-state">
                <p>No conversations yet</p>
              </div>
            ) : (
              filteredConversations.map(conv => (
                <div
                  key={conv.conversationId}
                  className={`tc-conversation-item ${selectedConversation?.conversationId === conv.conversationId ? 'tc-active' : ''}`}
                  onClick={() => setSelectedConversation(conv)}
                >
                  <img
                    src={conv.recipient?.profileImage || 'https://via.placeholder.com/40'}
                    alt={conv.recipient?.fullName}
                    className="tc-avatar"
                  />
                  <div className="tc-conv-info">
                    <strong>{conv.recipient?.fullName}</strong>
                    <p className="tc-last-message">{conv.lastMessage}</p>
                    <small>{new Date(conv.lastMessageTime).toLocaleDateString()}</small>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="tc-unread-badge">{conv.unreadCount}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Messages Panel */}
        <div className="tc-messages-panel">
          {selectedConversation ? (
            <>
              <div className="tc-messages-header">
                <button
                  className="tc-back-btn"
                  onClick={() => setSelectedConversation(null)}
                >
                  <FaArrowLeft />
                </button>
                <div className="tc-header-info">
                  <img
                    src={selectedConversation.recipient?.profileImage || 'https://via.placeholder.com/40'}
                    alt={selectedConversation.recipient?.fullName}
                    className="tc-avatar"
                  />
                  <div>
                    <h4>{selectedConversation.recipient?.fullName}</h4>
                    <small>
                      <FaCircle style={{ fontSize: '6px', marginRight: '4px' }} />
                      Active
                    </small>
                  </div>
                </div>
              </div>

              <div className="tc-messages-content">
                {messages.map(msg => (
                  <div
                    key={msg._id}
                    className={`tc-message ${msg.senderId._id === msg.senderId._id ? 'tc-sent' : 'tc-received'}`}
                  >
                    <div className="tc-message-bubble">
                      <p>{msg.messageText}</p>
                      <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
                    </div>
                    {msg.senderId._id === msg.senderId._id && (
                      <button
                        className="tc-delete-btn"
                        onClick={() => handleDeleteMessage(msg._id)}
                        title="Delete message"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="tc-message-input">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="tc-input"
                />
                <button
                  className="tc-send-btn"
                  onClick={handleSendMessage}
                  disabled={sending || !messageText.trim()}
                >
                  <FaPaperPlane /> {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </>
          ) : (
            <div className="tc-empty-state" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <FaEnvelope style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }} />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
