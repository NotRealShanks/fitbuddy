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
        <div className="fb-logo" style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-accent-secondary), var(--color-accent-primary))', boxShadow: '0 0 16px rgba(0, 229, 255, 0.7)' }} /> FitBuddy
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

        <div className="fb-sidebar-bottom" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
              className="fb-profile-card"
              style={{ borderColor: isMenuOpen ? 'var(--color-accent-primary)' : 'var(--color-border)', transition: 'border-color 0.2s' }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div style={{ position: 'relative', flexShrink: 0, width: '46px', height: '46px' }}>
                <img src="/image.png" alt="Profile" style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', display: 'block', border: '2px solid rgba(255,255,255,0.1)' }}
                  onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                />
                <div style={{ display: 'none', width: '46px', height: '46px', borderRadius: '50%', alignItems: 'center', justifyContent: 'center', fontSize: '22px', background: 'rgba(255,255,255,0.05)' }}>🌿</div>
                <div style={{ position: 'absolute', bottom: '1px', right: '1px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-accent-primary)', border: '2px solid var(--color-bg-dark)', boxShadow: '0 0 6px rgba(0,229,255,0.6)' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-main)', marginBottom: '2px', textTransform: 'capitalize' }}>{displayName}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-faded)' }}>Habit Tracker</div>
              </div>
              <div style={{ fontSize: '14px', color: 'var(--color-text-faded)', flexShrink: 0, opacity: 0.7, transition: 'transform 0.2s', transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▲</div>
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
        {/* Tappable profile area — opens bottom sheet on mobile */}
        <div
          className="fb-mobile-header__left fb-mobile-header__left--tappable"
          onClick={() => setIsMobileMenuOpen(true)}
          role="button"
          aria-label="Open profile menu"
        >
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src="/image.png"
              alt="Profile"
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', display: 'block', border: '2px solid rgba(0,229,255,0.3)' }}
              onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
            />
            <div style={{ display: 'none', width: '36px', height: '36px', borderRadius: '50%', alignItems: 'center', justifyContent: 'center', fontSize: '18px', background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(0,229,255,0.3)' }}>🌿</div>
            <div style={{ position: 'absolute', bottom: '1px', right: '1px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent-primary)', border: '2px solid var(--color-bg-dark)' }} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-main)' }}>{displayName}</div>
          </div>
        </div>

        <div className="fb-mobile-header__right">
          <div className="fb-streak-badge">
            <span className="fb-streak-badge__fire">🔥</span>
            <span className="fb-streak-badge__count">{streak}</span>
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
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img src="/image.png" alt="Profile"
                  style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(0,229,255,0.4)', display: 'block' }}
                  onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                />
                <div style={{ display: 'none', width: '52px', height: '52px', borderRadius: '50%', alignItems: 'center', justifyContent: 'center', fontSize: '24px', background: 'rgba(255,255,255,0.05)' }}>🌿</div>
                <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-accent-primary)', border: '2px solid var(--color-bg-dark)', boxShadow: '0 0 6px rgba(0,229,255,0.6)' }} />
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-text-main)', fontFamily: 'Syne, sans-serif' }}>{displayName}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-faded)', marginTop: '2px' }}>{user?.email}</div>
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
