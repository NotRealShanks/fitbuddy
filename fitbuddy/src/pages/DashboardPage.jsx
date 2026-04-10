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
      <p style={{ fontSize: '32px' }}>🌿</p>
      <p style={{ color: '#8aab8a', marginTop: '8px' }}>Loading FitBuddy…</p>
    </div>
  );

  if (error) return (
    <div className="centered-container">
      <p style={{ fontSize: '32px' }}>⚠️</p>
      <p style={{ color: '#e8a830', fontWeight: '600' }}>{error}</p>
      <p style={{ color: '#8a7060', fontSize: '13px', marginTop: '6px' }}>
        Run <code style={{ color: '#4db8d4' }}>node server.js</code> in the fitbuddy-server folder
      </p>
    </div>
  );

  return (
    <MainLayout user={user} streak={streak} view={view} setView={setView}>
      <div className="dashboard-header">
        <div className="dashboard-title-group">
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '13px', fontWeight: '600', letterSpacing: '0.04em',
            background: greeting.gradient,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: '4px',
          }}>
            {greeting.emoji} {greeting.text}
          </span>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '30px', fontWeight: 800, background: 'linear-gradient(90deg, var(--color-text-main) 20%, var(--color-accent-primary), var(--color-accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Let's crush it.</div>
        </div>
        <div style={{ background: 'rgba(124,58,237,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', color: '#c4b5fd', whiteSpace: 'nowrap' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {view === 'today' && (
        <>
          <div className="fb-stats-grid">
            <div className="fb-stat-card" style={{ background: 'rgba(0, 229, 255, 0.1)' }}>
              <div className="fb-stat-label">Completed</div>
              <div className="fb-stat-val" style={{ color: 'var(--color-accent-primary)' }}>{completedCount}</div>
              <div style={{ fontSize: '11px', marginTop: '2px', color: 'rgba(0, 229, 255, 0.6)' }}>of {totalCount} habits</div>
            </div>
            <div className="fb-stat-card" style={{ background: 'rgba(124, 58, 237, 0.15)' }}>
              <div className="fb-stat-label">Streak</div>
              <div className="fb-stat-val" style={{ color: 'var(--color-accent-secondary)' }}>{streak}</div>
              <div style={{ fontSize: '11px', marginTop: '2px', color: 'rgba(124, 58, 237, 0.6)' }}>days</div>
            </div>
            <div className="fb-stat-card" style={{ background: 'rgba(244, 63, 94, 0.15)' }}>
              <div className="fb-stat-label">Today</div>
              <div className="fb-stat-val" style={{ color: 'var(--color-accent-tertiary)' }}>{progressPercent}%</div>
              <div style={{ fontSize: '11px', marginTop: '2px', color: 'rgba(244, 63, 94, 0.6)' }}>done</div>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-faded)' }}>Today's progress</span>
              <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '13px', fontWeight: 700, color: 'var(--color-accent-primary)' }}>{progressPercent}%</span>
            </div>
            <div className="fb-prog-track">
              <div className="fb-prog-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            {totalCount > 0 && completedCount === totalCount && (
              <p style={{ textAlign: 'center', color: 'var(--color-accent-tertiary)', fontWeight: '600', margin: '10px 0 0', fontSize: '14px' }}>All habits done! Amazing day!</p>
            )}
          </div>

          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-faded)', fontWeight: '500', marginBottom: '12px' }}>Today's habits</div>
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
