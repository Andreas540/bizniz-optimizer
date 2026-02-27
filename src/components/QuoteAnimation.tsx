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

const POSITIONS: { x: number; y: number }[] = [
  { x: 8,  y: 10 },
  { x: 50, y: 6  },
  { x: 5,  y: 48 },
  { x: 46, y: 40 },
  { x: 14, y: 70 },
  { x: 52, y: 64 },
  { x: 24, y: 28 },
];

const FADE_IN   = 600;
const HOLD      = 2400;
const FADE_OUT  = 700;
const QUOTE_DUR = FADE_IN + HOLD + FADE_OUT;
const INTERVAL  = 1700;

const MENU_ITEMS = [
  { label: "Previews",    id: null      },
  { label: "Contact us!", id: "contact" },
  { label: "Pricing",     id: "pricing" },
  { label: "Q&A",         id: null      },
];

interface Props {
  onNavigate?: (id: string) => void;
}

export default function QuoteAnimation({ onNavigate }: Props) {
  const [visible, setVisible]               = useState<number[]>([]);
  const [fading, setFading]                 = useState<Set<number>>(new Set());
  const [showPunchline, setShowPunchline]   = useState(false);
  const [punchlineMoved, setPunchlineMoved] = useState(false);
  const [showMenu, setShowMenu]             = useState(false);
  const [visibleItems, setVisibleItems]     = useState<number[]>([]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    QUOTES.forEach((_, i) => {
      timers.push(setTimeout(() => {
        setVisible(v => [...v, i]);
      }, i * INTERVAL));

      timers.push(setTimeout(() => {
        setFading(f => new Set([...f, i]));
      }, i * INTERVAL + FADE_IN + HOLD));

      timers.push(setTimeout(() => {
        setVisible(v => v.filter(q => q !== i));
        setFading(f => { const s = new Set(f); s.delete(i); return s; });
      }, i * INTERVAL + QUOTE_DUR));
    });

    // Punchline fades in — truly centred (nav not in DOM yet)
    const punchlineAt = (QUOTES.length - 1) * INTERVAL + FADE_IN + HOLD;
    timers.push(setTimeout(() => setShowPunchline(true), punchlineAt));

    // After 2 s centred → start sliding up
    const moveAt = punchlineAt + 2000;
    timers.push(setTimeout(() => setPunchlineMoved(true), moveAt));

    // Mount the nav roughly halfway through the slide (450ms in)
    // so it appears to grow in naturally as the block settles
    timers.push(setTimeout(() => setShowMenu(true), moveAt + 450));

    // Menu items appear one-by-one after nav is mounted
    MENU_ITEMS.forEach((_, i) => {
      timers.push(setTimeout(() => {
        setVisibleItems(v => [...v, i]);
      }, moveAt + 500 + i * 300));
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleClick = (id: string | null) => {
    if (id && onNavigate) onNavigate(id);
  };

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
        <div className={`qa__end${punchlineMoved ? " qa__end--moved" : ""}`}>
          <div className="qa__punchline">
            <span className="qa__punchline-main">Get in control.</span>
            <span className="qa__punchline-sub">Meet the Bizniz Optimizer.</span>
          </div>

          {/* Nav only mounted after move starts — keeps centering accurate */}
          {showMenu && (
            <nav className="qa__menu">
              {MENU_ITEMS.map((item, i) => (
                <button
                  key={item.label}
                  className={`qa__menu-item${visibleItems.includes(i) ? " qa__menu-item--visible" : ""}${!item.id ? " qa__menu-item--dead" : ""}`}
                  onClick={() => handleClick(item.id)}
                  disabled={!item.id}
                >
                  <img src="/images/logo-cropped.png" alt="" className="qa__menu-logo" />
                  <span className="qa__menu-label">{item.label}</span>
                </button>
              ))}
            </nav>
          )}
        </div>
      )}
    </div>
  );
}