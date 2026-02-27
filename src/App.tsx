import { useMemo, useRef, useEffect, useCallback, useState } from "react";
import Header from "./components/Header";
import VideoHero from "./components/VideoHero";
import ContactSection from "./components/ContactSection";
import PricingSection from "./components/PricingSection";
import "./App.css";

type SectionId = "intro" | "contact" | "pricing" | "making";
const SECTION_IDS: SectionId[] = ["intro", "contact", "pricing", "making"];

export default function App() {
  const links = useMemo(
    () => [
      { id: "intro",   label: "Introduction videos" },
      { id: "contact", label: "Contact us!" },
      { id: "pricing", label: "Pricing" },
      { id: "making",  label: "In the making" },
    ],
    []
  );

  const [currentIdx, setCurrentIdx] = useState(0);
  const sectionRefs = useRef<Record<SectionId, HTMLElement | null>>({
    intro: null, contact: null, pricing: null, making: null,
  });

  // Position all sections via transform
  const applyTransforms = useCallback((idx: number) => {
    SECTION_IDS.forEach((id, i) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      el.style.transform = `translateY(${(i - idx) * 100}%)`;
    });
  }, []);

  // On mount, position sections
  useEffect(() => {
    applyTransforms(0);
  }, [applyTransforms]);

  const goTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(SECTION_IDS.length - 1, idx));
    setCurrentIdx(clamped);
    applyTransforms(clamped);
  }, [applyTransforms]);

  // Wheel snap
  useEffect(() => {
    let lastSnap = 0;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      // Throttle: ignore events within 600ms of last snap
      if (now - lastSnap < 600) return;
      // Only snap on intentional scroll (skip tiny trackpad drift)
      if (Math.abs(e.deltaY) < 30) return;
      lastSnap = now;
      setCurrentIdx((prev) => {
        const next = e.deltaY > 0 ? prev + 1 : prev - 1;
        const clamped = Math.max(0, Math.min(SECTION_IDS.length - 1, next));
        applyTransforms(clamped);
        return clamped;
      });
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [applyTransforms]);

  // Touch snap
  useEffect(() => {
    let touchStartY = 0;
    let touchStartX = 0;
    let lastSnap = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const dy = touchStartY - e.changedTouches[0].clientY;
      const dx = touchStartX - e.changedTouches[0].clientX;
      const now = Date.now();

      // Ignore mostly-horizontal swipes
      if (Math.abs(dx) > Math.abs(dy)) return;
      // Require meaningful swipe distance
      if (Math.abs(dy) < 40) return;
      // Throttle
      if (now - lastSnap < 600) return;
      lastSnap = now;

      setCurrentIdx((prev) => {
        const next = dy > 0 ? prev + 1 : prev - 1;
        const clamped = Math.max(0, Math.min(SECTION_IDS.length - 1, next));
        applyTransforms(clamped);
        return clamped;
      });
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [applyTransforms]);

  const scrollToSection = useCallback((id: string) => {
    const idx = SECTION_IDS.indexOf(id as SectionId);
    if (idx !== -1) goTo(idx);
  }, [goTo]);

  const setSectionRef = (id: SectionId) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
    // Re-apply transforms whenever a ref is set
    if (el) el.style.transform = `translateY(${(SECTION_IDS.indexOf(id) - currentIdx) * 100}%)`;
  };

  return (
    <div className="shell">
      <Header
        titleLine1="Get in control of your business"
        titleLine2="with the Bizniz Optimizer App"
        links={links}
        onNavigate={scrollToSection}
      />

      <main className="main">
        <section ref={setSectionRef("intro")} id="intro" className="section section--hero">
          <VideoHero
            items={[
              { title: "Register customers", src: "/videos/register-customers.mp4" },
              { title: "Register products",  src: "/videos/register-products.mp4" },
              { title: "Register orders",    src: "/videos/register-orders.mp4" },
              { title: "Register payments",  src: "/videos/register-payments.mp4" },
            ]}
          />
        </section>

        <section ref={setSectionRef("contact")} id="contact" className="section">
          <ContactSection />
        </section>

        <section ref={setSectionRef("pricing")} id="pricing" className="section">
          <PricingSection />
        </section>

        <section ref={setSectionRef("making")} id="making" className="section">
          <h2 className="h2" style={{ padding: "28px 16px 10px" }}>In the making</h2>
          <p className="p" style={{ padding: "0 16px" }}>Roadmap, features, etc.</p>
        </section>
      </main>
    </div>
  );
}
