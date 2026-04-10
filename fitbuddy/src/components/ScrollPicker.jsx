import { useRef, useEffect, useCallback } from 'react';

const ITEM_H = 50; // px per item slot

/**
 * ScrollPicker — iOS-style drum roller for numbers.
 * @param {number[]} values  — array of values to display
 * @param {number}   value   — currently selected value
 * @param {function} onChange — called with new value on snap
 */
export default function ScrollPicker({ values, value, onChange }) {
  const ref         = useRef(null);
  const ticking     = useRef(false);
  const currentIdx  = values.indexOf(value);

  // Sync scroll to the selected value on mount or external change
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTop = currentIdx * ITEM_H;
  }, [currentIdx]);

  // Debounced scroll handler — snaps to nearest item
  const handleScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      const el = ref.current;
      if (el) {
        const rawIdx = el.scrollTop / ITEM_H;
        const snapped = Math.round(rawIdx);
        const clamped = Math.max(0, Math.min(snapped, values.length - 1));
        if (values[clamped] !== undefined && values[clamped] !== value) {
          onChange(values[clamped]);
        }
      }
      ticking.current = false;
    });
  }, [values, value, onChange]);

  const scrollTo = (idx) => {
    ref.current?.scrollTo({ top: idx * ITEM_H, behavior: 'smooth' });
    onChange(values[idx]);
  };

  return (
    <div style={wrapStyle}>
      {/* Centre highlight bar */}
      <div style={highlightStyle} />

      {/* Top fade */}
      <div style={{ ...fadeStyle, top: 0, background: 'linear-gradient(to bottom, rgba(11,12,16,0.97) 0%, transparent 100%)' }} />
      {/* Bottom fade */}
      <div style={{ ...fadeStyle, bottom: 0, background: 'linear-gradient(to top,   rgba(11,12,16,0.97) 0%, transparent 100%)' }} />

      {/* Scrollable drum */}
      <div ref={ref} onScroll={handleScroll} style={drumStyle}>
        {/* padding spacers so first/last values can reach centre */}
        <div style={{ height: ITEM_H * 2, flexShrink: 0 }} />
        {values.map((v, i) => {
          const dist    = Math.abs(i - currentIdx);
          const opacity = dist === 0 ? 1 : dist === 1 ? 0.45 : 0.18;
          const scale   = dist === 0 ? 1 : dist === 1 ? 0.82 : 0.68;
          const color   = dist === 0 ? 'var(--color-accent-primary)' : 'var(--color-text-faded)';
          return (
            <div
              key={v}
              onClick={() => scrollTo(i)}
              style={{
                height: ITEM_H,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                scrollSnapAlign: 'center',
                fontFamily: 'Syne, sans-serif',
                fontSize: '28px',
                fontWeight: 700,
                color,
                opacity,
                transform: `scale(${scale})`,
                transition: 'opacity 0.15s, transform 0.15s, color 0.15s',
                cursor: 'pointer',
                userSelect: 'none',
                letterSpacing: '0.02em',
              }}
            >
              {String(v).padStart(2, '0')}
            </div>
          );
        })}
        <div style={{ height: ITEM_H * 2, flexShrink: 0 }} />
      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────
const wrapStyle = {
  position: 'relative',
  height: ITEM_H * 5,   // shows 5 slots, middle = selected
  width: '90px',
  overflow: 'hidden',
};

const highlightStyle = {
  position: 'absolute',
  top: '50%',
  left: '6px',
  right: '6px',
  height: ITEM_H,
  transform: 'translateY(-50%)',
  background: 'rgba(0, 229, 255, 0.07)',
  border: '1.5px solid rgba(0, 229, 255, 0.2)',
  borderRadius: '12px',
  pointerEvents: 'none',
  zIndex: 1,
  boxShadow: '0 0 12px rgba(0,229,255,0.06) inset',
};

const fadeStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  height: '38%',
  pointerEvents: 'none',
  zIndex: 2,
};

const drumStyle = {
  height: '100%',
  overflowY: 'scroll',
  scrollSnapType: 'y mandatory',
  scrollbarWidth: 'none',          // Firefox
  msOverflowStyle: 'none',         // IE
  display: 'flex',
  flexDirection: 'column',
  WebkitOverflowScrolling: 'touch',  // iOS momentum
};
