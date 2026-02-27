import { useMemo, useRef, useEffect, useCallback } from "react";
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

  // Use a ref for current index — no re-render needed, event listeners read it directly
  const currentIdxRef = useRef(0);
  const isSnapping = useRef(false);
  const mainRef = useRef<HTMLElement | null>(null);

  const sectionRefs = useRef<Record<SectionId, HTMLElement | null>>({
    intro: null, contact: null, pricing: null, making: null,
  });

  const applyTransforms = useCallback((idx: number) => {
    SECTION_IDS.forEach((id, i) => {
      const el = sectionRefs.current[id];
      if (el) el.style.transform = `translateY(${(i - idx) * 100}%)`;
    });
  }, []);

  const goTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(SECTION_IDS.length - 1, idx));
    if (clamped === currentIdxRef.current) return;
    isSnapping.current = true;
    currentIdxRef.current = clamped;
    applyTransforms(clamped);
    setTimeout(() => { isSnapping.current = false; }, 450);
  }, [applyTransforms]);

  // Set initial positions
  useEffect(() => { applyTransforms(0); }, [applyTransforms]);

  // Wheel
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    let wheelAccum = 0;
    let wheelTimer: ReturnType<typeof setTimeout> | null = null;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isSnapping.current) return;
      wheelAccum += e.deltaY;
      if (wheelTimer) clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => { wheelAccum = 0; }, 200);
      if (Math.abs(wheelAccum) >= 60) {
        const dir = wheelAccum > 0 ? 1 : -1;
        wheelAccum = 0;
        goTo(currentIdxRef.current + dir);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [goTo]);

  // Touch
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    let touchStartY = 0;
    let touchStartX = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (isSnapping.current) return;
      const dy = touchStartY - e.changedTouches[0].clientY;
      const dx = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(dx) > Math.abs(dy)) return;
      if (Math.abs(dy) < 40) return;
      goTo(currentIdxRef.current + (dy > 0 ? 1 : -1));
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [goTo]);

  const scrollToSection = useCallback((id: string) => {
    const idx = SECTION_IDS.indexOf(id as SectionId);
    if (idx !== -1) goTo(idx);
  }, [goTo]);

  const setSectionRef = (id: SectionId) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
    if (el) {
      el.style.transform = `translateY(${(SECTION_IDS.indexOf(id) - currentIdxRef.current) * 100}%)`;
    }
  };

  return (
    <div className="shell">
      <Header
        titleLine1="Get in control of your business"
        titleLine2="with the Bizniz Optimizer App"
        links={links}
        onNavigate={scrollToSection}
      />

      <main className="main" ref={mainRef}>
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
