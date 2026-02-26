import { useMemo, useRef } from "react";
import Header from "./components/Header";
import VideoHero from "./components/VideoHero";
import ContactSection from "./components/ContactSection";
import PricingSection from "./components/PricingSection";
import "./App.css";

type SectionId = "intro" | "contact" | "pricing" | "making";

export default function App() {
  const links = useMemo(
    () => [
      { id: "intro", label: "Introduction videos" },
      { id: "contact", label: "Contact us!" },
      { id: "pricing", label: "Pricing" },
      { id: "making", label: "In the making" },
    ],
    []
  );

  const sectionRefs = useRef<Record<SectionId, HTMLElement | null>>({
    intro: null,
    contact: null,
    pricing: null,
    making: null,
  });

  const setSectionRef =
    (id: SectionId) =>
    (el: HTMLElement | null): void => {
      sectionRefs.current[id] = el;
    };

  const scrollToSection = (id: string) => {
    const key = id as SectionId;
    const el = sectionRefs.current[key];
    if (!el) return;
    const headerH = parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue("--header-h")
        .trim()
    );
    const top = el.getBoundingClientRect().top + window.scrollY - headerH;
    window.scrollTo({ top, behavior: "smooth" });
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
        <section
          ref={setSectionRef("intro")}
          id="intro"
          className="section section--hero"
        >
          <VideoHero
            items={[
              { title: "Register customers", src: "/videos/register-customers.mp4" },
              { title: "Register products", src: "/videos/register-products.mp4" },
              { title: "Register orders", src: "/videos/register-orders.mp4" },
              { title: "Register payments", src: "/videos/register-payments.mp4" },
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
          <h2 className="h2">In the making</h2>
          <p className="p">Roadmap, features, etc.</p>
        </section>
      </main>
    </div>
  );
}
