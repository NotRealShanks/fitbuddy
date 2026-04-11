import '../styles/MainLayout.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import LoadingOverlay from '../components/LoadingOverlay';

const NAV = [
  { key: 'today',    label: 'Today',   icon: '🏠', color: 'var(--color-accent-primary)' },
  { key: 'stats',    label: 'Stats',   icon: '📊', color: 'var(--color-accent-secondary)' },
  { key: 'pomodoro', label: 'Timer',   icon: '⏱️', color: 'var(--color-accent-tertiary)' },
];

export default function MainLayout({ children, user, streak, view, setView }) {
  const [isMenuOpen,       setIsMenuOpen]       = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut,     setIsLoggingOut]     = useState(false);
  const navigate = useNavigate();

  const logoutMessages = [
    "Saving your progress...",
    "Logging you out...",
    "See you next time!",
  ];

  const handleLogout = async () => {
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
    setIsLoggingOut(true);
    await signOut(auth);
    window.location.reload();
  };

  const handleSettings = () => {
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/settings');
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'My Profile';

  return (
    <div className="fb-shell">
      {isLoggingOut && <LoadingOverlay messages={logoutMessages} />}

      {/* ────────────────── DESKTOP SIDEBAR ────────────────── */}
      <aside className="fb-sidebar">
        <div className="fb-sidebar-brand">
          <div className="fb-sidebar-brand-dot" /> FitBuddy
        </div>

        {NAV.map(n => (
          <div
            key={n.key}
            className={`fb-nav-item ${view === n.key ? 'active' : ''}`}
            onClick={() => setView(n.key)}
          >
            <span className="fb-nav-icon">{n.icon}</span>
            <div className="fb-nav-dot fb-nav-dot--desktop" style={{ background: n.color, boxShadow: `0 0 6px ${n.color}` }} />
            {n.label}
          </div>
        ))}

        <div className="fb-sidebar-bottom">
          {/* Streak Card */}
          <div className="fb-streak-card">
            <div className="fb-streak-card__glow" />
            <div className="fb-streak-card__top">
              <span className="fb-streak-card__fire">🔥</span>
              <div className="fb-streak-card__meta">
                <div className="fb-streak-card__number">{streak}</div>
                <div className="fb-streak-card__label">day streak</div>
              </div>
            </div>
            <div className="fb-streak-card__bar-track">
              <div className="fb-streak-card__bar-fill" style={{ width: `${Math.min((streak / 7) * 100, 100)}%` }} />
            </div>
            <div className="fb-streak-card__caption">Keep the fire alive! 🧨</div>
          </div>

          {/* Desktop Profile Card */}
          <div style={{ position: 'relative', marginTop: '10px' }}>
            <div
              className={`fb-profile-card ${isMenuOpen ? 'active' : ''}`}
              style={{ borderColor: isMenuOpen ? 'var(--color-accent-primary)' : 'var(--color-border)', transition: 'border-color 0.2s' }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="fb-avatar-wrap fb-avatar-wrap--desktop">
                <img src="/image.png" alt="Profile" className="fb-avatar fb-avatar--desktop"
                  onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                />
                <div className="fb-avatar-fallback fb-avatar-fallback--desktop" style={{ display: 'none' }}>🌿</div>
                <div className="fb-status-dot fb-status-dot--desktop" />
              </div>
              <div className="fb-profile-info">
                <div className="fb-profile-name fb-profile-name--desktop">{displayName}</div>
                <div className="fb-profile-role">Habit Tracker</div>
              </div>
              <div className="fb-profile-chevron" style={{ transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▲</div>
            </div>

            {isMenuOpen && (
              <div className="fb-profile-menu fb-profile-menu--animated">
                <div className="fb-menu-item" onClick={handleSettings}>
                  <span>⚙️</span> Account Settings
                </div>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '4px 8px' }} />
                <div className="fb-menu-item fb-menu-item--danger" onClick={handleLogout}>
                  <span>🚪</span> Log Out
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ─── MOBILE-ONLY TOP HEADER ─── */}
      <div className="fb-mobile-header">
        {/* Brand name on the left */}
        <div className="fb-mobile-header__left">
          <div className="fb-mobile-brand">
            <div className="fb-sidebar-brand-dot" />
            <span>FitBuddy</span>
          </div>
        </div>

        {/* Profile avatar + streak on the right */}
        <div className="fb-mobile-header__right">
          <div className="fb-streak-badge">
            <span className="fb-streak-badge__fire">🔥</span>
            <span className="fb-streak-badge__count">{streak}</span>
          </div>
          <div
            className="fb-mobile-header__avatar-btn"
            onClick={() => setIsMobileMenuOpen(true)}
            role="button"
            aria-label="Open profile menu"
          >
            <div className="fb-avatar-wrap fb-avatar-wrap--header">
              <img
                src="/image.png"
                alt="Profile"
                className="fb-avatar fb-avatar--header"
                onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
              />
              <div className="fb-avatar-fallback fb-avatar-fallback--header" style={{ display: 'none' }}>🌿</div>
              <div className="fb-status-dot fb-status-dot--header" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── MOBILE PROFILE BOTTOM SHEET ─── */}
      {isMobileMenuOpen && (
        <div className="fb-bottom-sheet-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fb-bottom-sheet" onClick={e => e.stopPropagation()}>
            {/* Handle bar */}
            <div className="fb-bottom-sheet__handle" />

            {/* User info header */}
            <div className="fb-bottom-sheet__user">
              <div className="fb-avatar-wrap fb-avatar-wrap--sheet">
                <img src="/image.png" alt="Profile"
                  className="fb-avatar fb-avatar--sheet"
                  onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                />
                <div className="fb-avatar-fallback fb-avatar-fallback--sheet" style={{ display: 'none' }}>🌿</div>
                <div className="fb-status-dot fb-status-dot--sheet" />
              </div>
              <div className="fb-profile-info">
                <div className="fb-profile-name fb-profile-name--sheet">{displayName}</div>
                <div className="fb-profile-email">{user?.email}</div>
              </div>
            </div>

            {/* Streak row inside sheet */}
            <div className="fb-bottom-sheet__streak">
              <span style={{ fontSize: '20px' }}>🔥</span>
              <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 800, background: 'linear-gradient(90deg, #fb923c, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{streak} day streak</span>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '4px 0 8px' }} />

            {/* Menu items */}
            <button className="fb-sheet-btn" onClick={handleSettings}>
              <span className="fb-sheet-btn__icon">⚙️</span>
              <span>Account Settings</span>
              <span className="fb-sheet-btn__arrow">›</span>
            </button>

            <button className="fb-sheet-btn fb-sheet-btn--danger" onClick={handleLogout}>
              <span className="fb-sheet-btn__icon">🚪</span>
              <span>Log Out</span>
              <span className="fb-sheet-btn__arrow">›</span>
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────── MAIN CONTENT ─────────────────── */}
      <main className="fb-main">
        {children}
      </main>
    </div>
  );
}
