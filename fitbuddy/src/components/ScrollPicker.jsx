import '../styles/ScrollPicker.css';
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
    <div className="fb-scroll-wrap">
      {/* Centre highlight bar */}
      <div className="fb-scroll-hl" />

      {/* Top fade */}
      <div className="fb-scroll-fade" style={{ top: 0, background: 'linear-gradient(to bottom, rgba(11,12,16,0.97) 0%, transparent 100%)' }} />
      {/* Bottom fade */}
      <div className="fb-scroll-fade" style={{ bottom: 0, background: 'linear-gradient(to top,   rgba(11,12,16,0.97) 0%, transparent 100%)' }} />

      {/* Scrollable drum */}
      <div ref={ref} onScroll={handleScroll} className="fb-scroll-drum">
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
              className="fb-scroll-item"
              style={{
                color,
                opacity,
                transform: `scale(${scale})`,
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
