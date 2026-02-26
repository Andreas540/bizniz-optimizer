import { useMemo, useRef } from "react";
import Header from "./components/Header";
import VideoHero from "./components/VideoHero";
import "./App.css";

export default function App() {
  const sections = useMemo(
    () => [
      { id: "intro", label: "Introduction videos" },
      { id: "contact", label: "Contact us!" },
      { id: "pricing", label: "Pricing" },
      { id: "making", label: "In the making" },
    ],
    []
  );

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="page">
      <Header titleLine1="Get in control of your business" titleLine2="with the Bizniz Optimizer App" links={sections} onNavigate={scrollToSection} />

      <main className="main">
        <section
  ref={(el) => {
    sectionRefs.current["intro"] = el;
  }}
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

        <section
  ref={(el) => {
    sectionRefs.current["contact"] = el;
  }}
  id="contact"
  className="section"
>
          <h2 className="h2">Contact us!</h2>
          <p className="p">Add your contact form / email / CTA here.</p>
        </section>

        <section
  ref={(el) => {
    sectionRefs.current["pricing"] = el;
  }}
  id="pricing"
  className="section"
>
          <h2 className="h2">Pricing</h2>
          <p className="p">Add pricing cards here.</p>
        </section>

        <section
  ref={(el) => {
    sectionRefs.current["making"] = el;
  }}
  id="making"
  className="section"
>
          <h2 className="h2">In the making</h2>
          <p className="p">Roadmap, features, etc.</p>
        </section>
      </main>
    </div>
  );
}
