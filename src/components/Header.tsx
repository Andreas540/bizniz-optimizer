import { useEffect, useState } from "react";
import "./Header.css";

type LinkItem = { id: string; label: string };

export default function Header({
  titleLine1,
  titleLine2,
  links,
  onNavigate,
}: {
  titleLine1: string;
  titleLine2: string;
  links: LinkItem[];
  onNavigate: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <>
      <header className="header">
        <div className="header__title">
          <div className="header__line1">{titleLine1}</div>
          <div className="header__line2">{titleLine2}</div>
        </div>

        <button className="burger" aria-label="Open menu" onClick={() => setOpen(true)}>
          <span />
          <span />
          <span />
        </button>
      </header>

      <div className={`menuOverlay ${open ? "menuOverlay--open" : ""}`} onClick={() => setOpen(false)} />

      <aside className={`menu ${open ? "menu--open" : ""}`} aria-hidden={!open}>
        <nav className="menu__nav">
          {links.map((l) => (
            <button key={l.id} className="menu__item" onClick={() => go(l.id)}>
              {l.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}