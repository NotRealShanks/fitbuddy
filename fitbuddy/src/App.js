import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from './firebase'; // Added Firebase import
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Added Auth hooks
import Auth from './components/Auth'; // Added Auth screen
import './App.css'; // Imported your new CSS file

import {
  fetchAll,
  addHabitAsync,
  deleteHabitAsync,
  completeHabitAsync,
} from './store/habitsSlice';
import {
  selectCompletedToday,
  selectStreak,
  selectWeeklyData,
  selectHabitStats,
  selectTodayKey,
} from './store/selectors';
import HabitCard    from './components/HabitCard';
import AddHabitForm from './components/AddHabitForm';
import WeeklyStats  from './components/WeeklyStats';

function App() {
  const [view, setView] = useState('today');
  
  // Auth State
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const dispatch       = useDispatch();
  const habits         = useSelector(state => state.habits.habits);
  const loading        = useSelector(state => state.habits.loading);
  const error          = useSelector(state => state.habits.error);
  const completedToday = useSelector(selectCompletedToday);
  const streak         = useSelector(selectStreak);
  const weeklyData     = useSelector(selectWeeklyData);
  const habitStats     = useSelector(selectHabitStats);

  // Listen for login/logout
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch habits ONLY if a user is successfully logged in
  useEffect(() => { 
    if (user) {
      dispatch(fetchAll()); 
    }
  }, [dispatch, user]);

  function handleComplete(id) { dispatch(completeHabitAsync({ date: selectTodayKey(), id })); }
  function handleAdd(habit)   { dispatch(addHabitAsync(habit)); }
  function handleDelete(id)   { dispatch(deleteHabitAsync(id)); }

  const completedCount  = completedToday.size;
  const totalCount      = habits.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const today = new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' });

  // 1. Show auth loading screen while Firebase checks session
  if (authLoading) return (
    <div className="splash">
      <div className="splash-inner">
        <span style={{ fontSize: '56px' }}>⏳</span>
        <h1 className="splash-title">FitBuddy</h1>
        <p className="splash-sub">Authenticating...</p>
      </div>
    </div>
  );

  // 2. If no user is logged in, show the login screen
  if (!user) return <Auth />;

  // 3. Show data loading screen
  if (loading) return (
    <div className="splash">
      <div className="splash-inner">
        <span style={{ fontSize: '56px' }}>💪</span>
        <h1 className="splash-title">FitBuddy</h1>
        <p className="splash-sub">Loading your program...</p>
      </div>
    </div>
  );

  // 4. Show Error Screen
  if (error) return (
    <div className="splash">
      <div className="splash-inner">
        <span style={{ fontSize: '48px' }}>⚠️</span>
        <p style={{ color: '#ff4444', fontWeight: '700', marginTop: '16px' }}>{error}</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '8px' }}>
          Run <code style={{ color: '#ff6b00' }}>node server.js</code> in fitbuddy-server
        </p>
      </div>
    </div>
  );

  // 5. Main App Render
  return (
    <div className="page">
      {/* ── TOP NAVBAR ── */}
      <nav className="navbar">
        <div className="nav-brand">
          <span className="nav-icon">💪</span>
          <span className="nav-title">FitBuddy</span>
        </div>
        <div className="nav-center">
          <button
            className={`nav-btn ${view === 'today' ? 'active' : ''}`}
            onClick={() => setView('today')}
          >
            Today
          </button>
          <button
            className={`nav-btn ${view === 'stats' ? 'active' : ''}`}
            onClick={() => setView('stats')}
          >
            Weekly Stats
          </button>
        </div>
        <div className="nav-right">
          {streak > 0 && <div className="streak-pill">🔥 {streak} day streak</div>}
          <button className="logout-btn" onClick={() => { signOut(auth).then(() => window.location.reload()); }}>Logout</button>
        </div>
      </nav>

      {/* ── HERO BANNER ── */}
      <div className="hero">
        <div className="hero-content">
          <p className="hero-date">{today}</p>
          <h1 className="hero-title">
            {completedCount === totalCount && totalCount > 0
              ? 'Beast Mode Activated! 🎉'
              : 'Time to crush your goals.'}
          </h1>
          <p className="hero-sub">
            {completedCount} of {totalCount} habits completed today
          </p>

          <div className="hero-bar">
            <div className="hero-bar-track">
              <div className="hero-bar-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="hero-bar-pct">{progressPercent}%</span>
          </div>
        </div>

        <div className="hero-pills">
          <div className="pill">
            <span className="pill-num">{totalCount}</span>
            <span className="pill-label">Habits</span>
          </div>
          <div className="pill-divider" />
          <div className="pill">
            <span className="pill-num">{streak}</span>
            <span className="pill-label">Day Streak</span>
          </div>
          <div className="pill-divider" />
          <div className="pill">
            <span className="pill-num">
              {weeklyData.filter(d => d.count === d.total && d.total > 0).length}
            </span>
            <span className="pill-label">Perfect Days</span>
          </div>
          <div className="pill-divider" />
          <div className="pill">
            <span className="pill-num">
              {weeklyData.reduce((s, d) => s + d.count, 0)}
            </span>
            <span className="pill-label">This Week</span>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="main">
        {view === 'today' && (
          <>
            <div className="section-header">
              <div>
                <h2 className="section-title">Today's Habits</h2>
                <p className="section-sub">Track your daily progress</p>
              </div>
              <div className="progress-badge">
                {completedCount} / {totalCount} done
              </div>
            </div>

            <div className="grid">
              {habits.map(habit => (
                <HabitCard
                  key={habit.id}
                  name={habit.name}
                  emoji={habit.emoji}
                  goal={habit.goal}
                  unit={habit.unit}
                  done={completedToday.has(habit.id)}
                  onComplete={() => handleComplete(habit.id)}
                  onDelete={() => handleDelete(habit.id)}
                />
              ))}
              <AddHabitForm onAdd={handleAdd} />
            </div>
          </>
        )}

        {view === 'stats' && (
          <>
            <div className="section-header">
              <div>
                <h2 className="section-title">Weekly Overview</h2>
                <p className="section-sub">Your performance over the last 7 days</p>
              </div>
            </div>
            <WeeklyStats
              streak={streak}
              weeklyData={weeklyData}
              habitStats={habitStats}
            />
          </>
        )}
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <span className="footer-text">💪 FitBuddy — Build your best self, one habit at a time.</span>
      </footer>
    </div>
  );
}

export default App;