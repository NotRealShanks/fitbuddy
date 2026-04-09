import { useState, useEffect } from 'react';

const DEFAULT_TIME = 25;

function PomodoroTimer() {
  const [minutesInput, setMinutesInput] = useState(DEFAULT_TIME);
  const [seconds, setSeconds]           = useState(DEFAULT_TIME * 60);
  const [running, setRunning]           = useState(false);
  const [sessions, setSessions]         = useState(0);
  const [sessionName, setSessionName]   = useState('');
  const [activeName, setActiveName]     = useState('');

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

  const totalSeconds = minutesInput * 60;
  const elapsed      = totalSeconds - seconds;
  const progress     = totalSeconds === 0 ? 0 : (elapsed / totalSeconds) * 100;

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  function handleStart() {
    if (seconds === 0) setSeconds(minutesInput * 60);
    setActiveName(sessionName || 'Focus Session');
    setRunning(true);
  }

  // Ring dimensions
  const R = 54;
  const CIRC = 2 * Math.PI * R;
  const dash = CIRC - (progress / 100) * CIRC;

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Pomodoro Timer</h2>

      {/* Inputs — only when not running */}
      {!running && (
        <>
          <input
            style={styles.input}
            placeholder="Session name (e.g. Study)"
            value={sessionName}
            onChange={e => setSessionName(e.target.value)}
          />
          <input
            style={styles.input}
            type="number"
            min="1"
            placeholder="Minutes (default 25)"
            value={minutesInput}
            onChange={e => {
              const v = Number(e.target.value);
              setMinutesInput(v);
              if (!running) setSeconds(v * 60);
            }}
          />
        </>
      )}

      {/* Active session label */}
      {activeName && (
        <p style={styles.activeName}>🎯 {activeName}</p>
      )}

      {/* SVG ring timer */}
      <div style={styles.ringWrap}>
        <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            cx="65" cy="65" r={R}
            fill="none"
            stroke="rgba(138,171,138,0.1)"
            strokeWidth="7"
          />
          {/* Progress */}
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
              <stop offset="0%" stopColor="#c8860a" />
              <stop offset="100%" stopColor="#4db8d4" />
            </linearGradient>
          </defs>
        </svg>
        <div style={styles.timerText}>
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </div>
      </div>

      {/* Controls */}
      <div style={styles.buttons}>
        <button style={{ ...styles.btn, ...styles.startBtn }} onClick={handleStart}>
          Start
        </button>
        <button style={{ ...styles.btn, ...styles.pauseBtn }} onClick={() => setRunning(false)}>
          Pause
        </button>
        <button style={{ ...styles.btn, ...styles.resetBtn }} onClick={() => {
          setRunning(false);
          setSeconds(minutesInput * 60);
          setActiveName('');
        }}>
          Reset
        </button>
      </div>

      {/* Sessions count */}
      <p style={styles.sessions}>🔥 Sessions today: <strong style={{ color: '#e8a830' }}>{sessions}</strong></p>

      {!running && seconds === 0 && (
        <p style={styles.done}>✅ Session complete!</p>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: 'rgba(40,18,4,0.65)',
    border: '1px solid rgba(138,171,138,0.28)',
    borderRadius: '16px',
    padding: '24px 20px',
    textAlign: 'center',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    marginBottom: '16px',
  },
  title: {
    fontSize: '15px', fontWeight: '600',
    color: '#f5ede0', marginBottom: '16px',
    textTransform: 'uppercase', letterSpacing: '0.08em',
  },
  input: {
    width: '100%', padding: '10px 12px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(138,171,138,0.25)',
    borderRadius: '8px', fontSize: '13px',
    color: '#f5ede0', fontFamily: 'inherit',
    marginBottom: '8px', outline: 'none',
    boxSizing: 'border-box',
  },
  activeName: {
    fontSize: '13px', color: '#8aab8a',
    fontWeight: '500', marginBottom: '10px',
  },
  ringWrap: {
    position: 'relative', width: '130px',
    height: '130px', margin: '16px auto',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  timerText: {
    position: 'absolute',
    fontSize: '26px', fontWeight: '700',
    color: '#f5ede0', fontFamily: 'Syne, sans-serif',
    letterSpacing: '0.02em',
  },
  buttons: {
    display: 'flex', justifyContent: 'center',
    gap: '8px', marginBottom: '14px',
  },
  btn: {
    padding: '8px 16px', borderRadius: '8px',
    fontSize: '13px', fontWeight: '500',
    cursor: 'pointer', fontFamily: 'inherit',
    border: '1.5px solid', transition: 'all 0.2s',
  },
  startBtn: {
    background: 'rgba(138,171,138,0.15)',
    borderColor: 'rgba(138,171,138,0.45)',
    color: '#8aab8a',
  },
  pauseBtn: {
    background: 'rgba(200,134,10,0.15)',
    borderColor: 'rgba(200,134,10,0.4)',
    color: '#e8a830',
  },
  resetBtn: {
    background: 'rgba(77,184,212,0.12)',
    borderColor: 'rgba(77,184,212,0.35)',
    color: '#4db8d4',
  },
  sessions: { fontSize: '13px', color: '#8a7060' },
  done: { marginTop: '10px', fontSize: '13px', color: '#8aab8a', fontWeight: '500' },
};

export default PomodoroTimer;