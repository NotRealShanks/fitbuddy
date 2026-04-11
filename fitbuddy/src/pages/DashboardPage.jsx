import '../styles/DashboardPage.css';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MainLayout from '../layouts/MainLayout';
import HabitCard, { CARD_ACCENTS } from '../components/HabitCard';
import AddHabitForm from '../components/AddHabitForm';
import WeeklyStats from '../components/WeeklyStats';
import PomodoroTimer from '../components/PomodoroTimer';

import { fetchAll, addHabitAsync, deleteHabitAsync, completeHabitAsync } from '../store/habitsSlice';
import { selectCompletedToday, selectStreak, selectWeeklyData, selectHabitStats, selectTodayKey } from '../store/selectors';

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return { text: 'Good morning',   emoji: '🌅', gradient: 'linear-gradient(90deg, #f43f5e, #f97316, #facc15)' };
  if (h >= 12 && h < 17) return { text: 'Good afternoon', emoji: '☀️', gradient: 'linear-gradient(90deg, #facc15, #00e5ff, #7c3aed)' };
  if (h >= 17 && h < 21) return { text: 'Good evening',   emoji: '🌇', gradient: 'linear-gradient(90deg, #f97316, #f43f5e, #7c3aed)' };
  return                         { text: 'Good night',     emoji: '🌙', gradient: 'linear-gradient(90deg, #7c3aed, #00e5ff)' };
}

export default function DashboardPage({ user }) {
  const [view, setView] = useState('today');
  const greeting = getGreeting();

  const dispatch       = useDispatch();
  const habits         = useSelector(s => s.habits.habits);
  const loading        = useSelector(s => s.habits.loading);
  const error          = useSelector(s => s.habits.error);
  const completedToday = useSelector(selectCompletedToday);
  const streak         = useSelector(selectStreak);
  const weeklyData     = useSelector(selectWeeklyData);
  const habitStats     = useSelector(selectHabitStats);

  useEffect(() => { 
    if (user) dispatch(fetchAll()); 
  }, [dispatch, user]);

  function handleComplete(id) { dispatch(completeHabitAsync({ date: selectTodayKey(), id })); }
  function handleAdd(habit)   { dispatch(addHabitAsync(habit)); }
  function handleDelete(id)   { dispatch(deleteHabitAsync(id)); }

  const completedCount  = completedToday.size;
  const totalCount      = habits.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  if (loading) return (
    <div className="centered-container">
      <p className="fb-loading-icon">🌿</p>
      <p className="fb-loading-text">Loading FitBuddy…</p>
    </div>
  );

  if (error) return (
    <div className="centered-container">
      <p className="fb-error-icon">⚠️</p>
      <p className="fb-error-text">{error}</p>
      <p className="fb-error-sub">
        Run <code className="fb-error-code">node server.js</code> in the fitbuddy-server folder
      </p>
    </div>
  );

  return (
    <MainLayout user={user} streak={streak} view={view} setView={setView}>
      <div className="dashboard-header">
        <div className="dashboard-title-group">
          <div className="fb-dashboard-greeting-wrap">
            <span>{greeting.emoji}</span>
            <span className="fb-dashboard-greeting" style={{ '--greeting-gradient': greeting.gradient }}>
              {greeting.text}
            </span>
          </div>
          <div className="fb-dashboard-title">Let's crush it.</div>
        </div>
        <div className="fb-date-badge">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {view === 'today' && (
        <>
          <div className="fb-stats-grid">
            <div className="fb-stat-card fb-stat-card--primary">
              <div className="fb-stat-label">Completed</div>
              <div className="fb-stat-val" style={{ color: 'var(--color-accent-primary)' }}>{completedCount}</div>
              <div className="fb-stat-sub fb-stat-sub--primary">of {totalCount} habits</div>
            </div>
            <div className="fb-stat-card fb-stat-card--secondary">
              <div className="fb-stat-label">Streak</div>
              <div className="fb-stat-val" style={{ color: 'var(--color-accent-secondary)' }}>{streak}</div>
              <div className="fb-stat-sub fb-stat-sub--secondary">days</div>
            </div>
            <div className="fb-stat-card fb-stat-card--tertiary">
              <div className="fb-stat-label">Today</div>
              <div className="fb-stat-val" style={{ color: 'var(--color-accent-tertiary)' }}>{progressPercent}%</div>
              <div className="fb-stat-sub fb-stat-sub--tertiary">done</div>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div className="fb-prog-header">
              <span className="fb-prog-title">Today's progress</span>
              <span className="fb-prog-pct">{progressPercent}%</span>
            </div>
            <div className="fb-prog-track">
              <div className="fb-prog-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            {totalCount > 0 && completedCount === totalCount && (
              <p className="fb-prog-done-msg">All habits done! Amazing day!</p>
            )}
          </div>

          <div className="fb-section-title">Today's habits</div>
          {habits.map((habit, i) => (
            <HabitCard
              key={habit.id}
              name={habit.name}
              emoji={habit.emoji}
              goal={habit.goal}
              unit={habit.unit}
              done={completedToday.has(habit.id)}
              accentColor={CARD_ACCENTS ? CARD_ACCENTS[i % CARD_ACCENTS.length] : undefined}
              onComplete={() => handleComplete(habit.id)}
              onDelete={() => handleDelete(habit.id)}
            />
          ))}
          <AddHabitForm onAdd={handleAdd} habits={habits} />
        </>
      )}

      {view === 'stats' && <WeeklyStats streak={streak} weeklyData={weeklyData} habitStats={habitStats} />}
      {view === 'pomodoro' && <PomodoroTimer />}
    </MainLayout>
  );
}
