import { useEffect, useState } from "react";
import "./Header.css";

type Link = { id: string; label: string };

export default function Header({
  titleLine1,
  titleLine2,
  links,
  onNavigate,
}: {
  titleLine1: string;
  titleLine2: string;
  links: Link[];
  onNavigate: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <>
      {/* Sticky header bar */}
      <header className="header">
        <div className="header__title">
          <div className="header__line1">{titleLine1}</div>
          <div className="header__line2">{titleLine2}</div>
        </div>

        <button
          className="burger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {/* Overlay — rendered at document root level via fixed positioning */}
      {open && (
        <div className="menuOverlay" onClick={() => setOpen(false)} />
      )}

      {/* Drawer — completely outside header so sticky never traps it */}
      <nav className={`menu ${open ? "menu--open" : ""}`} aria-hidden={!open}>
        <div className="menu__nav">
          {links.map((l) => (
            <button key={l.id} className="menu__item" onClick={() => go(l.id)}>
              {l.label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}