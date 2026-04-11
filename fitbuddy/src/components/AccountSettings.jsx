import '../styles/AccountSettings.css';
import LoadingOverlay from './LoadingOverlay';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { deleteUser, updateProfile, updatePassword } from 'firebase/auth';

export default function AccountSettings() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting]           = useState(false);
  const [displayName, setDisplayName]         = useState(auth.currentUser?.displayName || '');
  const [newPassword, setNewPassword]         = useState('');
  const [saveMsg, setSaveMsg]                 = useState('');
  const [saveError, setSaveError]             = useState('');
  const navigate = useNavigate();

  const user = auth.currentUser;

  const deleteMessages = [
    "Erasing habit history...",
    "Removing profile data...",
    "Saying goodbye...",
  ];

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      if (user) {
        await deleteUser(user);
        navigate('/signup');
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. You may need to log out and log back in first.");
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaveMsg(''); setSaveError('');
    try {
      if (displayName.trim() && displayName !== user?.displayName) {
        await updateProfile(user, { displayName: displayName.trim() });
      }
      if (newPassword.trim().length >= 6) {
        await updatePassword(user, newPassword.trim());
      }
      setSaveMsg('Changes saved successfully!');
      setNewPassword('');
    } catch (err) {
      setSaveError(err.message || 'Failed to save. Please try again.');
    }
  };

  return (
    <div className="fb-settings-page">
      {isDeleting && <LoadingOverlay messages={deleteMessages} />}

      {/* Header */}
      <div className="fb-settings-header">
        <button className="fb-settings-back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1 className="fb-settings-title">Account Settings</h1>
      </div>

      {/* Profile Card */}
      <div className="fb-settings-card">
        <div className="fb-settings-card-header">
          <span className="fb-settings-card-icon">👤</span>
          <h2 className="fb-settings-card-title">Profile</h2>
        </div>

        <div className="fb-settings-avatar-row">
          <div className="fb-avatar-wrap fb-avatar-wrap--sheet">
            <img
              src="/image.png"
              alt="Avatar"
              className="fb-avatar fb-avatar--sheet"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
            <div className="fb-avatar-fallback fb-avatar-fallback--sheet" style={{ display: 'none' }}>🌿</div>
            <div className="fb-status-dot fb-status-dot--sheet" />
          </div>
          <div>
            <div className="fb-profile-name fb-profile-name--sheet">{user?.displayName || user?.email?.split('@')[0] || 'User'}</div>
            <div className="fb-profile-email">{user?.email}</div>
          </div>
        </div>

        <label className="fb-settings-label">Display Name</label>
        <input
          className="fb-settings-input"
          type="text"
          value={displayName}
          placeholder="Your name"
          onChange={e => setDisplayName(e.target.value)}
        />

        <label className="fb-settings-label">New Password</label>
        <input
          className="fb-settings-input"
          type="password"
          value={newPassword}
          placeholder="Leave blank to keep current"
          onChange={e => setNewPassword(e.target.value)}
        />

        {saveMsg   && <p className="fb-settings-msg-success">✅ {saveMsg}</p>}
        {saveError && <p className="fb-settings-msg-error">⚠️ {saveError}</p>}

        <button className="fb-settings-save-btn" onClick={handleSaveProfile}>
          Save Changes
        </button>
      </div>

      {/* App Info Card */}
      <div className="fb-settings-card">
        <div className="fb-settings-card-header">
          <span className="fb-settings-card-icon">ℹ️</span>
          <h2 className="fb-settings-card-title">About FitBuddy</h2>
        </div>
        <div className="fb-settings-info-row"><span className="fb-settings-info-label">Version</span><span className="fb-settings-info-val">1.0.0</span></div>
        <div className="fb-settings-info-row"><span className="fb-settings-info-label">Stack</span><span className="fb-settings-info-val">React + Firebase</span></div>
        <div className="fb-settings-info-row"><span className="fb-settings-info-label">Theme</span><span className="fb-settings-info-val">Midnight Aurora</span></div>
      </div>

      {/* Danger Zone */}
      <div className="fb-settings-card fb-settings-card--danger">
        <div className="fb-settings-card-header">
          <span className="fb-settings-card-icon">⚠️</span>
          <h2 className="fb-settings-card-title fb-settings-card-title--danger">Danger Zone</h2>
        </div>
        <p className="fb-settings-danger-desc">
          Once you delete your account, there is no going back. All your habits,
          progress and history will be permanently erased from FitBuddy.
        </p>
        <button className="fb-settings-delete-btn" onClick={() => setShowDeleteModal(true)}>
          🗑️ Delete My Account
        </button>
      </div>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div className="fb-modal-overlay">
          <div className="fb-modal-box">
            <div className="fb-modal-icon">⚠️</div>
            <h3 className="fb-modal-title">
              Are you absolutely sure?
            </h3>
            <p className="fb-modal-desc">
              This will permanently delete your FitBuddy account and all your data. This cannot be undone.
            </p>
            <div className="fb-modal-actions">
              <button className="fb-modal-cancel-btn" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>
                Cancel
              </button>
              <button className="fb-modal-confirm-btn" onClick={handleDeleteAccount} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}