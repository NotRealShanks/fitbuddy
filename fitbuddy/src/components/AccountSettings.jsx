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
    <div style={styles.page}>
      {isDeleting && <LoadingOverlay messages={deleteMessages} />}

      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
        <h1 style={styles.title}>Account Settings</h1>
      </div>

      {/* Profile Card */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <span style={styles.cardIcon}>👤</span>
          <h2 style={styles.cardTitle}>Profile</h2>
        </div>

        <div style={styles.avatarRow}>
          <div style={styles.avatarWrap}>
            <img
              src="/image.png"
              alt="Avatar"
              style={styles.avatar}
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
            <div style={{ ...styles.avatarFallback, display: 'none' }}>🌿</div>
            <div style={styles.onlineDot} />
          </div>
          <div>
            <div style={styles.avatarName}>{user?.displayName || user?.email?.split('@')[0] || 'User'}</div>
            <div style={styles.avatarEmail}>{user?.email}</div>
          </div>
        </div>

        <label style={styles.label}>Display Name</label>
        <input
          style={styles.input}
          type="text"
          value={displayName}
          placeholder="Your name"
          onChange={e => setDisplayName(e.target.value)}
        />

        <label style={styles.label}>New Password</label>
        <input
          style={styles.input}
          type="password"
          value={newPassword}
          placeholder="Leave blank to keep current"
          onChange={e => setNewPassword(e.target.value)}
        />

        {saveMsg   && <p style={styles.successMsg}>✅ {saveMsg}</p>}
        {saveError && <p style={styles.errorMsg}>⚠️ {saveError}</p>}

        <button style={styles.saveBtn} onClick={handleSaveProfile}>
          Save Changes
        </button>
      </div>

      {/* App Info Card */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <span style={styles.cardIcon}>ℹ️</span>
          <h2 style={styles.cardTitle}>About FitBuddy</h2>
        </div>
        <div style={styles.infoRow}><span style={styles.infoLabel}>Version</span><span style={styles.infoVal}>1.0.0</span></div>
        <div style={styles.infoRow}><span style={styles.infoLabel}>Stack</span><span style={styles.infoVal}>React + Firebase</span></div>
        <div style={styles.infoRow}><span style={styles.infoLabel}>Theme</span><span style={styles.infoVal}>Midnight Aurora</span></div>
      </div>

      {/* Danger Zone */}
      <div style={{ ...styles.card, borderColor: 'rgba(244,63,94,0.35)', background: 'rgba(244,63,94,0.05)' }}>
        <div style={styles.cardHeader}>
          <span style={styles.cardIcon}>⚠️</span>
          <h2 style={{ ...styles.cardTitle, color: 'var(--color-accent-tertiary)' }}>Danger Zone</h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--color-text-faded)', marginBottom: '16px', lineHeight: 1.6 }}>
          Once you delete your account, there is no going back. All your habits,
          progress and history will be permanently erased from FitBuddy.
        </p>
        <button style={styles.deleteBtn} onClick={() => setShowDeleteModal(true)}>
          🗑️ Delete My Account
        </button>
      </div>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚠️</div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '10px' }}>
              Are you absolutely sure?
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-faded)', lineHeight: 1.6, marginBottom: '24px' }}>
              This will permanently delete your FitBuddy account and all your data. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={styles.cancelBtn} onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>
                Cancel
              </button>
              <button style={styles.confirmDeleteBtn} onClick={handleDeleteAccount} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    maxWidth: '560px',
    margin: '0 auto',
    padding: '32px 24px 80px',
    fontFamily: 'Inter, sans-serif',
    position: 'relative',
    zIndex: 1,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '28px',
  },
  backBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    padding: '8px 14px',
    color: 'var(--color-text-faded)',
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  title: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '22px',
    fontWeight: 800,
    background: 'linear-gradient(90deg, var(--color-text-main), var(--color-accent-primary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
  },
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--color-border)',
    borderRadius: '20px',
    padding: '22px',
    marginBottom: '16px',
    backdropFilter: 'blur(16px)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '18px',
  },
  cardIcon: { fontSize: '18px' },
  cardTitle: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--color-text-main)',
    margin: 0,
  },
  avatarRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '20px',
    padding: '12px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    border: '1px solid var(--color-border)',
  },
  avatarWrap: { position: 'relative', flexShrink: 0 },
  avatar: { width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(0,229,255,0.35)', display: 'block' },
  avatarFallback: { width: '52px', height: '52px', borderRadius: '50%', alignItems: 'center', justifyContent: 'center', fontSize: '24px', background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(0,229,255,0.3)' },
  onlineDot: { position: 'absolute', bottom: '2px', right: '2px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-accent-primary)', border: '2px solid var(--color-bg-dark)', boxShadow: '0 0 6px rgba(0,229,255,0.6)' },
  avatarName: { fontSize: '14px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '2px' },
  avatarEmail: { fontSize: '12px', color: 'var(--color-text-faded)' },
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--color-text-faded)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '6px',
    marginTop: '14px',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--color-border)',
    borderRadius: '10px',
    fontSize: '14px',
    color: 'var(--color-text-main)',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    outline: 'none',
  },
  saveBtn: {
    marginTop: '18px',
    width: '100%',
    padding: '12px',
    background: 'rgba(0,229,255,0.12)',
    border: '1px solid rgba(0,229,255,0.4)',
    borderRadius: '10px',
    color: 'var(--color-accent-primary)',
    fontFamily: 'Syne, sans-serif',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    letterSpacing: '0.04em',
  },
  successMsg: { fontSize: '13px', color: 'var(--color-accent-primary)', marginTop: '10px' },
  errorMsg: { fontSize: '13px', color: 'var(--color-accent-tertiary)', marginTop: '10px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  infoLabel: { fontSize: '13px', color: 'var(--color-text-faded)' },
  infoVal: { fontSize: '13px', fontWeight: '600', color: 'var(--color-text-main)' },
  deleteBtn: {
    width: '100%',
    padding: '12px',
    background: 'rgba(244,63,94,0.12)',
    border: '1px solid rgba(244,63,94,0.4)',
    borderRadius: '10px',
    color: 'var(--color-accent-tertiary)',
    fontFamily: 'Syne, sans-serif',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999, padding: '20px',
  },
  modal: {
    background: 'rgba(15,15,20,0.95)',
    border: '1px solid rgba(244,63,94,0.3)',
    borderRadius: '24px',
    padding: '32px 28px',
    maxWidth: '360px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
  },
  cancelBtn: {
    flex: 1, padding: '12px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--color-border)',
    borderRadius: '10px',
    color: 'var(--color-text-faded)',
    fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit',
  },
  confirmDeleteBtn: {
    flex: 1, padding: '12px',
    background: 'rgba(244,63,94,0.15)',
    border: '1px solid rgba(244,63,94,0.5)',
    borderRadius: '10px',
    color: 'var(--color-accent-tertiary)',
    fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit',
  },
};