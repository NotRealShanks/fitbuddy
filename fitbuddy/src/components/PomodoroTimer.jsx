import { useState, useEffect } from 'react';
import ScrollPicker from './ScrollPicker';

const MINUTES_LIST = Array.from({ length: 60 }, (_, i) => i + 1); // 1–60
const SECONDS_LIST = Array.from({ length: 60 }, (_, i) => i);      // 0–59

const DEFAULT_MIN = 25;
const DEFAULT_SEC = 0;

function PomodoroTimer() {
  const [pickerMin,  setPickerMin]  = useState(DEFAULT_MIN);
  const [pickerSec,  setPickerSec]  = useState(DEFAULT_SEC);
  const [seconds,    setSeconds]    = useState(DEFAULT_MIN * 60);
  const [running,    setRunning]    = useState(false);
  const [sessions,   setSessions]   = useState(0);
  const [sessionName, setSessionName] = useState('');
  const [activeName,  setActiveName]  = useState('');

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev === 0) {
          setRunning(false);
          setSessions(s => s + 1);
          setActiveName('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  const totalSeconds = pickerMin * 60 + pickerSec;
  const elapsed      = totalSeconds - seconds;
  const progress     = totalSeconds === 0 ? 0 : (elapsed / totalSeconds) * 100;

  const disMins = Math.floor(seconds / 60);
  const disSecs = seconds % 60;

  const R    = 54;
  const CIRC = 2 * Math.PI * R;
  const dash = CIRC - (progress / 100) * CIRC;

  function handleStart() {
    if (seconds === 0) setSeconds(pickerMin * 60 + pickerSec);
    setActiveName(sessionName || 'Focus Session');
    setRunning(true);
  }

  function handleReset() {
    setRunning(false);
    setSeconds(pickerMin * 60 + pickerSec);
    setActiveName('');
  }

  // When picker changes while timer is idle, reset seconds
  function onMinChange(v) {
    setPickerMin(v);
    if (!running) setSeconds(v * 60 + pickerSec);
  }

  function onSecChange(v) {
    setPickerSec(v);
    if (!running) setSeconds(pickerMin * 60 + v);
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Pomodoro Timer</h2>

      {/* Session name input */}
      {!running && (
        <input
          style={styles.input}
          placeholder="Session name (e.g. Study)"
          value={sessionName}
          onChange={e => setSessionName(e.target.value)}
        />
      )}

      {/* Active session label */}
      {activeName && <p style={styles.activeName}>🎯 {activeName}</p>}

      {/* MM : SS Drum pickers — shown only when not running */}
      {!running && (
        <div style={styles.pickerRow}>
          <div style={styles.pickerCol}>
            <ScrollPicker
              values={MINUTES_LIST}
              value={pickerMin}
              onChange={onMinChange}
            />
            <div style={styles.pickerLabel}>min</div>
          </div>

          <div style={styles.pickerSep}>:</div>

          <div style={styles.pickerCol}>
            <ScrollPicker
              values={SECONDS_LIST}
              value={pickerSec}
              onChange={onSecChange}
            />
            <div style={styles.pickerLabel}>sec</div>
          </div>
        </div>
      )}

      {/* SVG ring timer */}
      <div style={styles.ringWrap}>
        <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="65" cy="65" r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
          <circle
            cx="65" cy="65" r={R}
            fill="none"
            stroke="url(#timerGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={dash}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
          <defs>
            <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="var(--color-accent-secondary)" />
              <stop offset="100%" stopColor="var(--color-accent-primary)" />
            </linearGradient>
          </defs>
        </svg>
        <div style={styles.timerText}>
          {String(disMins).padStart(2, '0')}:{String(disSecs).padStart(2, '0')}
        </div>
      </div>

      {/* Controls */}
      <div style={styles.buttons}>
        <button style={{ ...styles.btn, ...styles.startBtn }} onClick={handleStart}>▶ Start</button>
        <button style={{ ...styles.btn, ...styles.pauseBtn }} onClick={() => setRunning(false)}>⏸ Pause</button>
        <button style={{ ...styles.btn, ...styles.resetBtn }} onClick={handleReset}>↺ Reset</button>
      </div>

      {/* Sessions count */}
      <p style={styles.sessions}>🔥 Sessions today: <strong style={{ color: 'var(--color-accent-primary)' }}>{sessions}</strong></p>

      {!running && seconds === 0 && (
        <p style={styles.done}>✅ Session complete!</p>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: 'rgba(11,12,16,0.65)',
    border: '1px solid var(--color-border)',
    borderRadius: '16px',
    padding: '24px 20px',
    textAlign: 'center',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    marginBottom: '16px',
    maxWidth: '480px',
    margin: '0 auto 16px',
    boxSizing: 'border-box',
    width: '100%',
  },
  title: {
    fontSize: '15px', fontWeight: '600',
    color: 'var(--color-text-main)', marginBottom: '16px',
    textTransform: 'uppercase', letterSpacing: '0.08em',
  },
  input: {
    width: '100%', padding: '10px 12px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px', fontSize: '13px',
    color: 'var(--color-text-main)', fontFamily: 'inherit',
    marginBottom: '16px', outline: 'none',
    boxSizing: 'border-box',
  },
  activeName: {
    fontSize: '13px', color: 'var(--color-accent-primary)',
    fontWeight: '500', marginBottom: '10px',
  },
  // Drum picker layout
  pickerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  pickerCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  pickerLabel: {
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--color-text-faded)',
  },
  pickerSep: {
    fontSize: '36px',
    fontFamily: 'Syne, sans-serif',
    fontWeight: 700,
    color: 'var(--color-text-faded)',
    marginBottom: '18px', // pushes sep to align with drum
    opacity: 0.5,
  },
  ringWrap: {
    position: 'relative', width: '130px',
    height: '130px', margin: '16px auto',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  timerText: {
    position: 'absolute',
    fontSize: '26px', fontWeight: '700',
    color: 'var(--color-text-main)', fontFamily: 'Syne, sans-serif',
    letterSpacing: '0.02em',
  },
  buttons: {
    display: 'flex', justifyContent: 'center',
    gap: '8px', marginBottom: '14px', flexWrap: 'wrap',
  },
  btn: {
    padding: '10px 20px', borderRadius: '8px',
    fontSize: '13px', fontWeight: '500',
    cursor: 'pointer', fontFamily: 'inherit',
    border: '1.5px solid', transition: 'all 0.2s',
    flex: 1, minWidth: '80px',
  },
  startBtn: {
    background: 'rgba(0, 229, 255, 0.15)',
    borderColor: 'rgba(0, 229, 255, 0.45)',
    color: 'var(--color-accent-primary)',
  },
  pauseBtn: {
    background: 'rgba(244, 63, 94, 0.15)',
    borderColor: 'rgba(244, 63, 94, 0.4)',
    color: 'var(--color-accent-tertiary)',
  },
  resetBtn: {
    background: 'rgba(124, 58, 237, 0.12)',
    borderColor: 'rgba(124, 58, 237, 0.35)',
    color: 'var(--color-accent-secondary)',
  },
  sessions: { fontSize: '13px', color: 'var(--color-text-faded)' },
  done: { marginTop: '10px', fontSize: '13px', color: 'var(--color-accent-primary)', fontWeight: '500' },
};

export default PomodoroTimer;