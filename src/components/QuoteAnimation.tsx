import { useState, useEffect, useRef } from "react";
import "./QuoteAnimation.css";

// ── Content ────────────────────────────────────────────────
const QUOTES = [
  "Match your production\nwith customer demand",
  "Easily create and send\ninvoices from your phone",
  "Set the right price",
  "Keep track of\nproductivity",
  "Prioritize your best\ncustomers",
  "Be a trusted business\npartner",
  "When can you deliver?\nDid they really pay?",
];

const TYPEWRITER_TEXT = "Always know the answer.";

// left = left-anchored (24px from left edge)
// right = right-anchored (starts at 50% + 8px, respects 24px right margin)
const POSITIONS: { side: "left" | "right"; top: number }[] = [
  { side: "left",  top: 12 },
  { side: "right", top: 27 },
  { side: "left",  top: 42 },
  { side: "right", top: 54 },
  { side: "left",  top: 64 },
  { side: "right", top: 74 },
  { side: "left",  top: 84 },
];

// ── Timing constants ───────────────────────────────────────
const FADE_MS        = 400;   // fade in / fade out duration
const SOLO_MS        = 2000;  // Q1 alone before Q2 enters
const STEP_MS        = 2000;  // new quote every 2 s → each quote lives 4 s total
const TW_CHAR_MS     = 45;    // ms per typewriter character — fast
const TW_SOLO_MS     = 800;   // pause after typewriter finishes before punchline

// Derived
// Q[i] appears at: i === 0 ? 0 : SOLO_MS + (i - 1) * STEP_MS
const quoteStart = (i: number) =>
  i === 0 ? 0 : SOLO_MS + (i - 1) * STEP_MS;

// Q[i] starts fading at: start + 4000 - FADE_MS
const quoteFadeStart = (i: number) => quoteStart(i) + 2 * STEP_MS - FADE_MS;

// Q[i] fully gone at: start + 4000
const quoteEnd = (i: number) => quoteStart(i) + 2 * STEP_MS;

// Typewriter begins when last quote has faded
const TW_START = quoteEnd(QUOTES.length - 1);

// Punchline appears after typewriter finishes + pause
const PUNCHLINE_AT = TW_START + TYPEWRITER_TEXT.length * TW_CHAR_MS + TW_SOLO_MS;

interface Props {
  onNavigate?: (id: string) => void;
}

const MENU_ITEMS = [
  { label: "Previews",    id: null      },
  { label: "Contact us!", id: "contact" },
  { label: "Pricing",     id: "pricing" },
  { label: "Q&A",         id: null      },
];

export default function QuoteAnimation({ onNavigate }: Props) {
  const [activeQuotes, setActiveQuotes] = useState<Set<number>>(new Set());
  const [fadingQuotes, setFadingQuotes] = useState<Set<number>>(new Set());
  const [twChars, setTwChars]           = useState(0);
  const [twFading, setTwFading]         = useState(false);
  const [showPunchline, setShowPunchline]   = useState(false);
  const [punchlineMoved, setPunchlineMoved] = useState(false);
  const [showMenu, setShowMenu]             = useState(false);
  const [visibleItems, setVisibleItems]     = useState<number[]>([]);
  const twInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Schedule each quote
    QUOTES.forEach((_, i) => {
      // Appear
      timers.push(setTimeout(() => {
        setActiveQuotes(s => new Set([...s, i]));
      }, quoteStart(i)));

      // Start fading
      timers.push(setTimeout(() => {
        setFadingQuotes(s => new Set([...s, i]));
      }, quoteFadeStart(i)));

      // Remove
      timers.push(setTimeout(() => {
        setActiveQuotes(s => { const n = new Set(s); n.delete(i); return n; });
        setFadingQuotes(s => { const n = new Set(s); n.delete(i); return n; });
      }, quoteEnd(i)));
    });

    // Typewriter — tick character by character
    timers.push(setTimeout(() => {
      let count = 0;
      twInterval.current = setInterval(() => {
        count++;
        setTwChars(count);
        if (count >= TYPEWRITER_TEXT.length) {
          clearInterval(twInterval.current!);
        }
      }, TW_CHAR_MS);
    }, TW_START));

    // Fade typewriter out just before punchline
    timers.push(setTimeout(() => setTwFading(true), PUNCHLINE_AT - 500));

    // Punchline
    timers.push(setTimeout(() => setShowPunchline(true), PUNCHLINE_AT));

    // Slide up
    const moveAt = PUNCHLINE_AT + 2000;
    timers.push(setTimeout(() => setPunchlineMoved(true), moveAt));

    // Mount menu after slide fully completes
    timers.push(setTimeout(() => setShowMenu(true), moveAt + 920));

    // Stagger menu items
    MENU_ITEMS.forEach((_, i) => {
      timers.push(setTimeout(() => {
        setVisibleItems(v => [...v, i]);
      }, moveAt + 970 + i * 300));
    });

    return () => {
      timers.forEach(clearTimeout);
      if (twInterval.current) clearInterval(twInterval.current);
    };
  }, []);

  const handleClick = (id: string | null) => {
    if (id && onNavigate) onNavigate(id);
  };

  return (
    <div className="qa">

      {/* Floating quotes */}
      {[...activeQuotes].map(i => (
        <span
          key={i}
          className={`qa__quote qa__quote--${POSITIONS[i].side}${fadingQuotes.has(i) ? " qa__quote--out" : ""}`}
          style={{ top: `${POSITIONS[i].top}%` }}
        >
          {QUOTES[i].split("\n").map((line, j) => (
            <span key={j} className="qa__line">{line}</span>
          ))}
        </span>
      ))}

      {/* Typewriter */}
      {twChars > 0 && (
        <span className={`qa__typewriter${twFading ? " qa__typewriter--out" : ""}`}>
          {TYPEWRITER_TEXT.slice(0, twChars)}
          {twChars < TYPEWRITER_TEXT.length && (
            <span className="qa__cursor">|</span>
          )}
        </span>
      )}

      {/* Punchline + menu */}
      {showPunchline && (
        <div className={`qa__end${punchlineMoved ? " qa__end--moved" : ""}`}>
          <div className="qa__punchline">
            <span className="qa__punchline-main">Get in control.</span>
            <span className="qa__punchline-sub">Meet the Bizniz Optimizer.</span>
          </div>

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