import { useState, useEffect } from "react";
import "./QuoteAnimation.css";

const QUOTES = [
  "Chasing invoices at midnight?",
  "Which customer owes you money?",
  "Is your inventory accurate right now?",
  "How much did you earn last month?",
  "Who placed the last order?",
  "Still managing this in a spreadsheet?",
  "What if it was all in one place?",
];

// Fixed positions spread across the screen (percentages)
// Kept away from edges so text doesn't overflow the 520px shell
const POSITIONS: { x: number; y: number }[] = [
  { x: 8,  y: 10 },
  { x: 50, y: 6  },
  { x: 5,  y: 48 },
  { x: 46, y: 40 },
  { x: 14, y: 70 },
  { x: 52, y: 64 },
  { x: 24, y: 28 },
];

const FADE_IN   = 600;   // ms — quote fades in
const HOLD      = 2400;  // ms — quote stays fully visible
const FADE_OUT  = 700;   // ms — quote fades out
const QUOTE_DUR = FADE_IN + HOLD + FADE_OUT; // 3700ms total
const INTERVAL  = 1700;  // ms — new quote appears every 1700ms (creates overlap)

export default function QuoteAnimation() {
  const [visible, setVisible]       = useState<number[]>([]);
  const [fading, setFading]         = useState<Set<number>>(new Set());
  const [showPunchline, setShowPunchline] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    QUOTES.forEach((_, i) => {
      // Fade in
      timers.push(setTimeout(() => {
        setVisible(v => [...v, i]);
      }, i * INTERVAL));

      // Start fade out
      timers.push(setTimeout(() => {
        setFading(f => new Set([...f, i]));
      }, i * INTERVAL + FADE_IN + HOLD));

      // Remove from DOM
      timers.push(setTimeout(() => {
        setVisible(v => v.filter(q => q !== i));
        setFading(f => { const s = new Set(f); s.delete(i); return s; });
      }, i * INTERVAL + QUOTE_DUR));
    });

    // Punchline appears as the last quote starts fading
    const punchlineDelay = (QUOTES.length - 1) * INTERVAL + FADE_IN + HOLD;
    timers.push(setTimeout(() => setShowPunchline(true), punchlineDelay));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="qa">
      {visible.map(i => (
        <span
          key={i}
          className={`qa__quote${fading.has(i) ? " qa__quote--out" : ""}`}
          style={{ left: `${POSITIONS[i].x}%`, top: `${POSITIONS[i].y}%` }}
        >
          {QUOTES[i]}
        </span>
      ))}

      {showPunchline && (
        <div className="qa__punchline">
          <span className="qa__punchline-main">Get in control.</span>
          <span className="qa__punchline-sub">Meet the Bizniz Optimizer.</span>
        </div>
      )}
    </div>
  );
}