import '../styles/PomodoroTimer.css';
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
    <div className="fb-pomodoro-card">
      <h2 className="fb-pomodoro-title">Pomodoro Timer</h2>

      {/* Session name input */}
      {!running && (
        <input
          className="fb-pomodoro-input"
          placeholder="Session name (e.g. Study)"
          value={sessionName}
          onChange={e => setSessionName(e.target.value)}
        />
      )}

      {/* Active session label */}
      {activeName && <p className="fb-pomodoro-active-name">🎯 {activeName}</p>}

      {/* MM : SS Drum pickers — shown only when not running */}
      {!running && (
        <div className="fb-picker-row">
          <div className="fb-picker-col">
            <ScrollPicker
              values={MINUTES_LIST}
              value={pickerMin}
              onChange={onMinChange}
            />
            <div className="fb-picker-label">min</div>
          </div>

          <div className="fb-picker-sep">:</div>

          <div className="fb-picker-col">
            <ScrollPicker
              values={SECONDS_LIST}
              value={pickerSec}
              onChange={onSecChange}
            />
            <div className="fb-picker-label">sec</div>
          </div>
        </div>
      )}

      {/* SVG ring timer */}
      <div className="fb-ring-wrap">
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
        <div className="fb-timer-text">
          {String(disMins).padStart(2, '0')}:{String(disSecs).padStart(2, '0')}
        </div>
      </div>

      {/* Controls */}
      <div className="fb-timer-buttons">
        <button className="fb-timer-btn fb-timer-btn--start" onClick={handleStart}>▶ Start</button>
        <button className="fb-timer-btn fb-timer-btn--pause" onClick={() => setRunning(false)}>⏸ Pause</button>
        <button className="fb-timer-btn fb-timer-btn--reset" onClick={handleReset}>↺ Reset</button>
      </div>

      {/* Sessions count */}
      <p className="fb-timer-sessions">🔥 Sessions today: <strong style={{ color: 'var(--color-accent-primary)' }}>{sessions}</strong></p>

      {!running && seconds === 0 && (
        <p className="fb-timer-done">✅ Session complete!</p>
      )}
    </div>
  );
}

export default PomodoroTimer;