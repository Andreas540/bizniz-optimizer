import { useState, useEffect, useRef, useCallback } from "react";
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

const TOP_PCT    = 4;
const BOTTOM_PCT = 76;
const STEP = (BOTTOM_PCT - TOP_PCT) / (QUOTES.length - 1);

const POSITIONS: { side: "left" | "right"; top: number }[] = QUOTES.map((_, i) => ({
  side: i % 2 === 0 ? "left" : "right",
  top:  Math.round((TOP_PCT + i * STEP) * 10) / 10,
}));

const FADE_MS    = 400;
const SOLO_MS    = 2000;
const STEP_MS    = 2000;
const TW_CHAR_MS = 45;
const TW_SOLO_MS = 2800;

const quoteStart     = (i: number) => i === 0 ? 0 : SOLO_MS + (i - 1) * STEP_MS;
const quoteFadeStart = (i: number) => quoteStart(i) + 2 * STEP_MS - FADE_MS;
const quoteEnd       = (i: number) => quoteStart(i) + 2 * STEP_MS;

const TW_START     = quoteEnd(QUOTES.length - 1);
const PUNCHLINE_AT = TW_START + TYPEWRITER_TEXT.length * TW_CHAR_MS + TW_SOLO_MS;

const MENU_ITEMS = [
  { label: "Previews",    id: "previews" },
  { label: "Contact us!", id: "contact"  },
  { label: "Pricing",     id: "pricing"  },
  { label: "Q&A",         id: "qa"  },
];

interface Props {
  onNavigate?: (id: string) => void;
}

function useAnimationState() {
  const [activeQuotes, setActiveQuotes]     = useState<Set<number>>(new Set());
  const [fadingQuotes, setFadingQuotes]     = useState<Set<number>>(new Set());
  const [twChars, setTwChars]               = useState(0);
  const [twFading, setTwFading]             = useState(false);
  const [showPunchline, setShowPunchline]   = useState(false);
  const [punchlineMoved, setPunchlineMoved] = useState(false);
  const [showMenu, setShowMenu]             = useState(false);
  const [visibleItems, setVisibleItems]     = useState<number[]>([]);
  const [showSkip, setShowSkip]             = useState(true);
  const [showRefresh, setShowRefresh]       = useState(false);
  const [runKey, setRunKey]                 = useState(0);

  const reset = useCallback(() => {
    setActiveQuotes(new Set());
    setFadingQuotes(new Set());
    setTwChars(0);
    setTwFading(false);
    setShowPunchline(false);
    setPunchlineMoved(false);
    setShowMenu(false);
    setVisibleItems([]);
    setShowSkip(true);
    setShowRefresh(false);
    setRunKey(k => k + 1);
  }, []);

  return {
    activeQuotes, setActiveQuotes,
    fadingQuotes, setFadingQuotes,
    twChars, setTwChars,
    twFading, setTwFading,
    showPunchline, setShowPunchline,
    punchlineMoved, setPunchlineMoved,
    showMenu, setShowMenu,
    visibleItems, setVisibleItems,
    showSkip, setShowSkip,
    showRefresh, setShowRefresh,
    runKey, reset,
  };
}

export default function QuoteAnimation({ onNavigate }: Props) {
  const state = useAnimationState();
  const timersRef  = useRef<ReturnType<typeof setTimeout>[]>([]);
  const twInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAll = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (twInterval.current) { clearInterval(twInterval.current); twInterval.current = null; }
  }, []);

  // Shared helper — run from punchline phase onwards
  const runPunchlinePhase = useCallback((s: typeof state) => {
    s.setShowPunchline(true);
    const moveAt = 2000;
    timersRef.current.push(setTimeout(() => s.setPunchlineMoved(true), moveAt));
    timersRef.current.push(setTimeout(() => s.setShowMenu(true), moveAt + 920));
    MENU_ITEMS.forEach((_, i) => {
      timersRef.current.push(setTimeout(() => {
        s.setVisibleItems(v => [...v, i]);
      }, moveAt + 970 + i * 300));
    });
    // Show refresh when last item appears
    const lastItemAt = moveAt + 970 + (MENU_ITEMS.length - 1) * 300 + 350;
    timersRef.current.push(setTimeout(() => s.setShowRefresh(true), lastItemAt));
  }, []);

  useEffect(() => {
    clearAll();

    // Full animation
    QUOTES.forEach((_, i) => {
      timersRef.current.push(setTimeout(() => {
        state.setActiveQuotes(s => new Set([...s, i]));
      }, quoteStart(i)));

      timersRef.current.push(setTimeout(() => {
        state.setFadingQuotes(s => new Set([...s, i]));
      }, quoteFadeStart(i)));

      timersRef.current.push(setTimeout(() => {
        state.setActiveQuotes(s => { const n = new Set(s); n.delete(i); return n; });
        state.setFadingQuotes(s => { const n = new Set(s); n.delete(i); return n; });
      }, quoteEnd(i)));
    });

    // Typewriter
    timersRef.current.push(setTimeout(() => {
      let count = 0;
      twInterval.current = setInterval(() => {
        count++;
        state.setTwChars(count);
        if (count >= TYPEWRITER_TEXT.length) clearInterval(twInterval.current!);
      }, TW_CHAR_MS);
    }, TW_START));

    timersRef.current.push(setTimeout(() => state.setTwFading(true), PUNCHLINE_AT - 500));

    timersRef.current.push(setTimeout(() => {
      state.setShowSkip(false);
      runPunchlinePhase(state);
    }, PUNCHLINE_AT));

    return clearAll;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.runKey]);

  const handleSkip = useCallback(() => {
    clearAll();
    // Clear all quotes and typewriter instantly
    state.setActiveQuotes(new Set());
    state.setFadingQuotes(new Set());
    state.setTwChars(0);
    state.setTwFading(false);
    state.setShowSkip(false);
    runPunchlinePhase(state);
  }, [clearAll, runPunchlinePhase, state]);

  const handleClick = (id: string | null) => {
    if (id && onNavigate) onNavigate(id);
  };

  return (
    <div className="qa">
      {[...state.activeQuotes].map(i => (
        <span
          key={i}
          className={`qa__quote qa__quote--${POSITIONS[i].side}${state.fadingQuotes.has(i) ? " qa__quote--out" : ""}`}
          style={{ top: `${POSITIONS[i].top}%` }}
        >
          {QUOTES[i].split("\n").map((line, j) => (
            <span key={j} className="qa__line">{line}</span>
          ))}
        </span>
      ))}

      {state.twChars > 0 && (
        <span className={`qa__typewriter${state.twFading ? " qa__typewriter--out" : ""}`}>
          {TYPEWRITER_TEXT.slice(0, state.twChars)}
          {state.twChars < TYPEWRITER_TEXT.length && (
            <span className="qa__cursor">|</span>
          )}
        </span>
      )}

      {state.showPunchline && (
        <div className={`qa__end${state.punchlineMoved ? " qa__end--moved" : ""}`}>
          <div className="qa__punchline">
            <span className="qa__punchline-main">Get in control.</span>
            <span className="qa__punchline-sub">Meet the Bizniz Optimizer.</span>
          </div>

          {state.showMenu && (
            <nav className="qa__menu">
              {MENU_ITEMS.map((item, i) => (
                <button
                  key={item.label}
                  className={`qa__menu-item${state.visibleItems.includes(i) ? " qa__menu-item--visible" : ""}${!item.id ? " qa__menu-item--dead" : ""}`}
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

      {/* Skip — visible during animation */}
      {state.showSkip && (
        <button className="qa__skip" onClick={handleSkip}>
          Skip
        </button>
      )}

      {/* Refresh — visible after animation completes */}
      {state.showRefresh && (
        <button className="qa__refresh" onClick={state.reset} aria-label="Restart animation">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
               strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      )}
    </div>
  );
}