import React, { useState, useEffect } from 'react';
import {
  FaCog, FaUser, FaSlidersH, FaCalendarAlt, FaBell, FaLock, FaWallet, FaEye, FaLink,
  FaSave, FaTimes, FaCheck, FaExclamationTriangle, FaPlus, FaTrash, FaEdit
} from 'react-icons/fa';
import trainerSettingsAPI from '../services/trainerSettingsAPI';
import '../styles/trainer-settings.css';

function Toast({ msg, type = 'success', onClose }) {
  return (
    <div className={`ts-toast ts-toast-${type}`}>
      <span>{type === 'success' ? '✓' : '✕'} {msg}</span>
      <button onClick={onClose} className="ts-toast-close">×</button>
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

// Profile Settings Tab
function ProfileSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const { toast, show } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await trainerSettingsAPI.getProfileSettings();
      setSettings(data);
      setFormData(data);
    } catch (error) {
      show(error.message || 'Failed to load profile settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await trainerSettingsAPI.updateProfileSettings(formData);
      show('Profile settings updated successfully');
      setSettings(formData);
    } catch (error) {
      show(error.message || 'Failed to update profile settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="ts-loading">Loading...</div>;

  return (
    <div className="ts-tab-content">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => {}} />}
      
      <div className="ts-form-section">
        <h3><FaUser /> Profile Information</h3>
        
        <div className="ts-form-group">
          <label>Bio</label>
          <textarea
            name="bio"
            value={formData.bio || ''}
            onChange={handleChange}
            placeholder="Tell clients about yourself..."
            maxLength={1000}
            rows={4}
            className="ts-textarea"
          />
          <small>{(formData.bio || '').length}/1000 characters</small>
        </div>

        <div className="ts-form-group">
          <label>Experience (Years)</label>
          <input
            type="number"
            name="experience"
            value={formData.experience || 0}
            onChange={handleChange}
            min={0}
            max={50}
            className="ts-input"
          />
        </div>

        <div className="ts-form-group">
          <label>Specializations</label>
          <div className="ts-checkbox-group">
            {[
              'strength-training', 'cardio', 'yoga', 'pilates', 'crossfit',
              'bodybuilding', 'weight-loss', 'nutrition', 'sports-training',
              'rehabilitation', 'functional-training', 'hiit', 'zumba',
              'martial-arts', 'personal-training', 'group-fitness'
            ].map(spec => (
              <label key={spec} className="ts-checkbox-label">
                <input
                  type="checkbox"
                  checked={(formData.specializations || []).includes(spec)}
                  onChange={(e) => {
                    const specs = formData.specializations || [];
                    if (e.target.checked) {
                      setFormData(prev => ({ ...prev, specializations: [...specs, spec] }));
                    } else {
                      setFormData(prev => ({ ...prev, specializations: specs.filter(s => s !== spec) }));
                    }
                  }}
                />
                {spec.replace(/-/g, ' ')}
              </label>
            ))}
          </div>
        </div>

        <div className="ts-form-group">
          <label>Profile Visibility</label>
          <select
            name="profileVisibility"
            value={formData.profileVisibility || 'members-only'}
            onChange={handleChange}
            className="ts-select"
          >
            <option value="public">Public</option>
            <option value="members-only">Members Only</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className="ts-form-group">
          <label className="ts-checkbox-label">
            <input
              type="checkbox"
              name="showRatings"
              checked={formData.showRatings !== false}
              onChange={handleChange}
            />
            Show Ratings on Profile
          </label>
        </div>

        <div className="ts-form-group">
          <label className="ts-checkbox-label">
            <input
              type="checkbox"
              name="showAvailability"
              checked={formData.showAvailability !== false}
              onChange={handleChange}
            />
            Show Availability on Profile
          </label>
        </div>

        <button
          className="ts-btn ts-btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

// Trainer Preferences Tab
function TrainerPreferences() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const { toast, show } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await trainerSettingsAPI.getTrainerPreferences();
      setSettings(data);
      setFormData(data);
    } catch (error) {
      show(error.message || 'Failed to load preferences', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) : value)
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await trainerSettingsAPI.updateTrainerPreferences(formData);
      show('Preferences updated successfully');
      setSettings(formData);
    } catch (error) {
      show(error.message || 'Failed to update preferences', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="ts-loading">Loading...</div>;

  return (
    <div className="ts-tab-content">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => {}} />}
      
      <div className="ts-form-section">
        <h3><FaSlidersH /> Session Preferences</h3>
        
        <div className="ts-form-row">
          <div className="ts-form-group">
            <label>Default Session Duration (minutes)</label>
            <input
              type="number"
              name="sessionDuration"
              value={formData.sessionDuration || 60}
              onChange={handleChange}
              min={15}
              max={180}
              className="ts-input"
            />
          </div>

          <div className="ts-form-group">
            <label>Break Between Sessions (minutes)</label>
            <input
              type="number"
              name="breakBetweenSessions"
              value={formData.breakBetweenSessions || 15}
              onChange={handleChange}
              min={0}
              max={120}
              className="ts-input"
            />
          </div>
        </div>

        <div className="ts-form-row">
          <div className="ts-form-group">
            <label>Max Clients Per Day</label>
            <input
              type="number"
              name="maxClientsPerDay"
              value={formData.maxClientsPerDay || 10}
              onChange={handleChange}
              min={1}
              max={50}
              className="ts-input"
            />
          </div>

          <div className="ts-form-group">
            <label>Default Session Type</label>
            <select
              name="defaultSessionType"
              value={formData.defaultSessionType || 'personal-training'}
              onChange={handleChange}
              className="ts-select"
            >
              <option value="personal-training">Personal Training</option>
              <option value="group-class">Group Class</option>
              <option value="consultation">Consultation</option>
              <option value="assessment">Assessment</option>
            </select>
          </div>
        </div>

        <div className="ts-form-group">
          <label>Minimum Session Price (Rs.)</label>
          <input
            type="number"
            name="minimumSessionPrice"
            value={formData.minimumSessionPrice || 500}
            onChange={handleChange}
            min={0}
            className="ts-input"
          />
        </div>

        <div className="ts-form-group">
          <label className="ts-checkbox-label">
            <input
              type="checkbox"
              name="acceptGroupClasses"
              checked={formData.acceptGroupClasses !== false}
              onChange={handleChange}
            />
            Accept Group Classes
          </label>
        </div>

        <div className="ts-form-group">
          <label className="ts-checkbox-label">
            <input
              type="checkbox"
              name="acceptOnlineClasses"
              checked={formData.acceptOnlineClasses !== false}
              onChange={handleChange}
            />
            Accept Online Classes
          </label>
        </div>

        <button
          className="ts-btn ts-btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

// Availability Settings Tab
function AvailabilitySettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const { toast, show } = useToast();

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await trainerSettingsAPI.getAvailabilitySettings();
      setSettings(data);
      setFormData(data);
    } catch (error) {
      show(error.message || 'Failed to load availability settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDayChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      workingDays: {
        ...prev.workingDays,
        [day]: {
          ...prev.workingDays[day],
          [field]: value
        }
      }
    }));
  };

  const handleAddSlot = (day) => {
    setFormData(prev => ({
      ...prev,
      workingDays: {
        ...prev.workingDays,
        [day]: {
          ...prev.workingDays[day],
          slots: [...(prev.workingDays[day].slots || []), { startTime: '09:00', endTime: '10:00' }]
        }
      }
    }));
  };

  const handleSlotChange = (day, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      workingDays: {
        ...prev.workingDays,
        [day]: {
          ...prev.workingDays[day],
          slots: prev.workingDays[day].slots.map((slot, i) =>
            i === index ? { ...slot, [field]: value } : slot
          )
        }
      }
    }));
  };

  const handleRemoveSlot = (day, index) => {
    setFormData(prev => ({
      ...prev,
      workingDays: {
        ...prev.workingDays,
        [day]: {
          ...prev.workingDays[day],
          slots: prev.workingDays[day].slots.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await trainerSettingsAPI.updateAvailabilitySettings(formData);
      show('Availability settings updated successfully');
      setSettings(formData);
    } catch (error) {
      show(error.message || 'Failed to update availability settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="ts-loading">Loading...</div>;

  return (
    <div className="ts-tab-content">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => {}} />}
      
      <div className="ts-form-section">
        <h3><FaCalendarAlt /> Working Hours</h3>
        
        {days.map(day => (
          <div key={day} className="ts-day-schedule">
            <div className="ts-day-header">
              <label className="ts-checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.workingDays?.[day]?.isAvailable || false}
                  onChange={(e) => handleDayChange(day, 'isAvailable', e.target.checked)}
                />
                <strong>{day.charAt(0).toUpperCase() + day.slice(1)}</strong>
              </label>
            </div>

            {formData.workingDays?.[day]?.isAvailable && (
              <div className="ts-slots">
                {(formData.workingDays[day].slots || []).map((slot, index) => (
                  <div key={index} className="ts-slot">
                    <input
                      type="time"
                      value={slot.startTime || '09:00'}
                      onChange={(e) => handleSlotChange(day, index, 'startTime', e.target.value)}
                      className="ts-input"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={slot.endTime || '10:00'}
                      onChange={(e) => handleSlotChange(day, index, 'endTime', e.target.value)}
                      className="ts-input"
                    />
                    <button
                      className="ts-btn ts-btn-danger ts-btn-sm"
                      onClick={() => handleRemoveSlot(day, index)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  className="ts-btn ts-btn-secondary ts-btn-sm"
                  onClick={() => handleAddSlot(day)}
                >
                  <FaPlus /> Add Slot
                </button>
              </div>
            )}
          </div>
        ))}

        <div className="ts-form-section" style={{ marginTop: '30px' }}>
          <h3>Booking Settings</h3>
          
          <div className="ts-form-row">
            <div className="ts-form-group">
              <label>Booking Advance Notice (hours)</label>
              <input
                type="number"
                value={formData.bookingAdvanceNotice || 24}
                onChange={(e) => setFormData(prev => ({ ...prev, bookingAdvanceNotice: parseInt(e.target.value) }))}
                min={0}
                max={720}
                className="ts-input"
              />
            </div>

            <div className="ts-form-group">
              <label>Cancellation Policy</label>
              <select
                value={formData.cancellationPolicy || 'moderate'}
                onChange={(e) => setFormData(prev => ({ ...prev, cancellationPolicy: e.target.value }))}
                className="ts-select"
              >
                <option value="flexible">Flexible</option>
                <option value="moderate">Moderate</option>
                <option value="strict">Strict</option>
              </select>
            </div>
          </div>

          <div className="ts-form-group">
            <label className="ts-checkbox-label">
              <input
                type="checkbox"
                checked={formData.autoAcceptBookings || false}
                onChange={(e) => setFormData(prev => ({ ...prev, autoAcceptBookings: e.target.checked }))}
              />
              Auto-Accept Bookings
            </label>
          </div>
        </div>

        <button
          className="ts-btn ts-btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

// Notification Preferences Tab
function NotificationPreferences() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const { toast, show } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await trainerSettingsAPI.getNotificationPreferences();
      setSettings(data);
      setFormData(data);
    } catch (error) {
      show(error.message || 'Failed to load notification preferences', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChannelChange = (channel, event, value) => {
    setFormData(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [event]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await trainerSettingsAPI.updateNotificationPreferences(formData);
      show('Notification preferences updated successfully');
      setSettings(formData);
    } catch (error) {
      show(error.message || 'Failed to update notification preferences', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="ts-loading">Loading...</div>;

  const channels = ['email', 'sms', 'inApp', 'push'];
  const events = ['newBooking', 'bookingCancellation', 'bookingRescheduled', 'clientMessage', 'clientReview', 'paymentReceived'];

  return (
    <div className="ts-tab-content">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => {}} />}
      
      <div className="ts-form-section">
        <h3><FaBell /> Notification Channels</h3>
        
        <div className="ts-notification-grid">
          {channels.map(channel => (
            <div key={channel} className="ts-notification-channel">
              <h4>{channel.charAt(0).toUpperCase() + channel.slice(1)}</h4>
              {events.map(event => (
                <label key={event} className="ts-checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData[channel]?.[event] || false}
                    onChange={(e) => handleChannelChange(channel, event, e.target.checked)}
                  />
                  {event.replace(/([A-Z])/g, ' $1').trim()}
                </label>
              ))}
            </div>
          ))}
        </div>

        <div className="ts-form-section" style={{ marginTop: '30px' }}>
          <h3>Quiet Hours</h3>
          
          <label className="ts-checkbox-label">
            <input
              type="checkbox"
              checked={formData.quietHours?.isEnabled || false}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                quietHours: { ...prev.quietHours, isEnabled: e.target.checked }
              }))}
            />
            Enable Quiet Hours
          </label>

          {formData.quietHours?.isEnabled && (
            <div className="ts-form-row">
              <div className="ts-form-group">
                <label>Start Time</label>
                <input
                  type="time"
                  value={formData.quietHours?.startTime || '22:00'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    quietHours: { ...prev.quietHours, startTime: e.target.value }
                  }))}
                  className="ts-input"
                />
              </div>

              <div className="ts-form-group">
                <label>End Time</label>
                <input
                  type="time"
                  value={formData.quietHours?.endTime || '08:00'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    quietHours: { ...prev.quietHours, endTime: e.target.value }
                  }))}
                  className="ts-input"
                />
              </div>
            </div>
          )}
        </div>

        <button
          className="ts-btn ts-btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

// Account Settings Tab
function AccountSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const { toast, show } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await trainerSettingsAPI.getAccountSettings();
      setSettings(data);
      setFormData(data);
    } catch (error) {
      show(error.message || 'Failed to load account settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await trainerSettingsAPI.updateAccountSettings(formData);
      show('Account settings updated successfully');
      setSettings(formData);
    } catch (error) {
      show(error.message || 'Failed to update account settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="ts-loading">Loading...</div>;

  return (
    <div className="ts-tab-content">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => {}} />}
      
      <div className="ts-form-section">
        <h3><FaLock /> Security Settings</h3>
        
        <div className="ts-form-group">
          <label className="ts-checkbox-label">
            <input
              type="checkbox"
              checked={formData.twoFactorAuth?.isEnabled || false}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                twoFactorAuth: { ...prev.twoFactorAuth, isEnabled: e.target.checked }
              }))}
            />
            Enable Two-Factor Authentication
          </label>
        </div>

        {formData.twoFactorAuth?.isEnabled && (
          <div className="ts-form-group">
            <label>2FA Method</label>
            <select
              value={formData.twoFactorAuth?.method || 'email'}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                twoFactorAuth: { ...prev.twoFactorAuth, method: e.target.value }
              }))}
              className="ts-select"
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="authenticator">Authenticator App</option>
            </select>
          </div>
        )}

        <div className="ts-form-section" style={{ marginTop: '30px' }}>
          <h3>Login Security</h3>
          
          <div className="ts-form-group">
            <label>Session Timeout (minutes)</label>
            <input
              type="number"
              value={formData.loginSecurity?.sessionTimeout || 30}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                loginSecurity: { ...prev.loginSecurity, sessionTimeout: parseInt(e.target.value) }
              }))}
              min={5}
              max={480}
              className="ts-input"
            />
          </div>

          <label className="ts-checkbox-label">
            <input
              type="checkbox"
              checked={formData.loginSecurity?.allowRememberMe || false}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                loginSecurity: { ...prev.loginSecurity, allowRememberMe: e.target.checked }
              }))}
            />
            Allow Remember Me
          </label>
        </div>

        <div className="ts-form-section" style={{ marginTop: '30px' }}>
          <h3>Data Privacy</h3>
          
          <label className="ts-checkbox-label">
            <input
              type="checkbox"
              checked={formData.dataPrivacy?.shareAnalytics || false}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                dataPrivacy: { ...prev.dataPrivacy, shareAnalytics: e.target.checked }
              }))}
            />
            Share Analytics Data
          </label>

          <label className="ts-checkbox-label">
            <input
              type="checkbox"
              checked={formData.dataPrivacy?.shareUsageData || false}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                dataPrivacy: { ...prev.dataPrivacy, shareUsageData: e.target.checked }
              }))}
            />
            Share Usage Data
          </label>

          <label className="ts-checkbox-label">
            <input
              type="checkbox"
              checked={formData.dataPrivacy?.allowThirdPartyIntegration || false}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                dataPrivacy: { ...prev.dataPrivacy, allowThirdPartyIntegration: e.target.checked }
              }))}
            />
            Allow Third-Party Integration
          </label>
        </div>

        <button
          className="ts-btn ts-btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

// Main Settings Component
export default function TrainerSettings() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
    { id: 'preferences', label: 'Preferences', icon: <FaSlidersH /> },
    { id: 'availability', label: 'Availability', icon: <FaCalendarAlt /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
    { id: 'account', label: 'Account', icon: <FaLock /> },
  ];

  return (
    <div className="ts-container">
      <div className="ts-header">
        <h1><FaCog /> Trainer Settings</h1>
        <p>Manage your profile, preferences, and account settings</p>
      </div>

      <div className="ts-tabs-container">
        <div className="ts-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`ts-tab ${activeTab === tab.id ? 'ts-tab-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="ts-content">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'preferences' && <TrainerPreferences />}
          {activeTab === 'availability' && <AvailabilitySettings />}
          {activeTab === 'notifications' && <NotificationPreferences />}
          {activeTab === 'account' && <AccountSettings />}
        </div>
      </div>
    </div>
  );
}
