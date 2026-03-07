import { useEffect } from "react";
import "./TermsPage.css";

const EFFECTIVE_DATE = "June 1, 2025";
const COMPANY = "Framayson Enterprises LLC";
const PRIVACY_EMAIL = "privacy@framayson.com";

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="terms-section">
      <h2 className="terms-h2">{title}</h2>
      {children}
    </section>
  );
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="terms-sub">
      <h3 className="terms-h3">{title}</h3>
      {children}
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="terms-p">{children}</p>;
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul className="terms-ul">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
}

const TOC_ITEMS = [
  { href: "#tos", label: "Part 1 — Terms of Service" },
  { href: "#definitions", label: "1. Definitions" },
  { href: "#account", label: "2. Account Registration" },
  { href: "#payment", label: "3. Subscription and Payment" },
  { href: "#acceptable-use", label: "4. Acceptable Use" },
  { href: "#data-ownership", label: "5. Data Ownership" },
  { href: "#availability", label: "6. Service Availability" },
  { href: "#termination", label: "7. Termination" },
  { href: "#liability", label: "8. Limitation of Liability" },
  { href: "#warranties", label: "9. Disclaimer of Warranties" },
  { href: "#governing-law", label: "10. Governing Law" },
  { href: "#changes-tos", label: "11. Changes to Terms" },
  { href: "#privacy", label: "Part 2 — Privacy Policy" },
  { href: "#controller", label: "1. Data Controller" },
  { href: "#what-we-collect", label: "2. What Data We Collect" },
  { href: "#how-we-use", label: "3. How We Use Your Data" },
  { href: "#storage", label: "4. Data Storage and Transfers" },
  { href: "#sharing", label: "5. Data Sharing" },
  { href: "#retention", label: "6. Data Retention" },
  { href: "#security", label: "7. Security" },
  { href: "#gdpr", label: "8. Your Rights — EU/EEA (GDPR)" },
  { href: "#ccpa", label: "9. Your Rights — California (CCPA)" },
  { href: "#cookies", label: "10. Cookies" },
  { href: "#children", label: "11. Children's Privacy" },
  { href: "#changes-privacy", label: "12. Changes to Privacy Policy" },
  { href: "#contact", label: "13. Contact" },
];

export default function TermsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
  // Allow scrolling on this page (App.css sets overflow: hidden globally)
  document.documentElement.style.overflow = 'auto'
  document.body.style.overflow = 'auto'
  return () => {
    // Restore when leaving
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
  }
}, [])

  return (
    <div className="terms-root">
      {/* Header */}
      <header className="terms-header">
        <a href="/" className="terms-back">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          biznizoptimizer.com
        </a>
      </header>

      <div className="terms-layout">
        {/* Sidebar TOC — desktop only */}
        <aside className="terms-sidebar">
          <p className="terms-sidebar-label">On this page</p>
          <nav>
            {TOC_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`terms-toc-link ${item.href === "#tos" || item.href === "#privacy" ? "terms-toc-part" : ""}`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="terms-main">
          {/* Title block */}
          <div className="terms-title-block">
            <div className="terms-badge">Legal</div>
            <h1 className="terms-h1">Terms of Service<br />& Privacy Policy</h1>
            <p className="terms-meta">
              {COMPANY} &nbsp;·&nbsp; Effective {EFFECTIVE_DATE}
            </p>
            <P>
              This document governs your use of the Bizniz Optimizer platform, operated
              by {COMPANY} ("we", "us", or "our"), accessible at biznizoptimizer.com
              and app.biznizoptimizer.com. It combines our Terms of Service and Privacy
              Policy in a single document and is written to satisfy the requirements of
              applicable law in both the United States and the European Union, including
              GDPR and CCPA.
            </P>
            <P>
              By creating an account, subscribing, or otherwise using the Service, you
              agree to these terms. If you do not agree, do not use the Service.
            </P>
          </div>

          <div className="terms-divider" />

          {/* ── Part 1: Terms of Service ───────────────────────────────── */}
          <div id="tos" className="terms-part-heading">
            <span>Part 1</span>
            <h2>Terms of Service</h2>
          </div>

          <Section id="definitions" title="1. Definitions">
            <Ul items={[
              '"Service" means the Bizniz Optimizer platform, including the web application, APIs, and any related services.',
              '"Subscriber" or "you" means the legal entity or individual that creates an account and accepts these terms.',
              '"User" means any individual granted access to the Service under a Subscriber account.',
              '"Data" means all content, information, and materials uploaded or entered into the Service by Subscriber or Users.',
            ]} />
          </Section>

          <Section id="account" title="2. Account Registration">
            <P>
              You must provide accurate and complete registration information. You are
              responsible for maintaining the confidentiality of your credentials and for
              all activity under your account. You must notify us immediately of any
              unauthorized use at <a href={`mailto:${PRIVACY_EMAIL}`} className="terms-link">{PRIVACY_EMAIL}</a>.
            </P>
          </Section>

          <Section id="payment" title="3. Subscription and Payment">
            <P>
              Access to the Service requires a paid subscription. Fees are as described
              on the pricing page at the time of purchase. All fees are non-refundable
              unless otherwise stated. We reserve the right to change pricing with at
              least 30 days' notice to active subscribers. Failure to pay may result in
              suspension or termination of access.
            </P>
          </Section>

          <Section id="acceptable-use" title="4. Acceptable Use">
            <P>You agree not to:</P>
            <Ul items={[
              "Use the Service for any unlawful purpose or in violation of any applicable regulations.",
              "Attempt to gain unauthorized access to the Service or its underlying infrastructure.",
              "Reverse engineer, copy, or create derivative works from the Service.",
              "Upload or transmit malicious code, spam, or content that violates the rights of others.",
              "Resell or sublicense the Service without our prior written consent.",
            ]} />
          </Section>

          <Section id="data-ownership" title="5. Data Ownership">
            <P>
              You retain full ownership of all Data you submit to the Service. We claim
              no intellectual property rights over your Data. You grant us a limited,
              non-exclusive license to store, process, and transmit your Data solely as
              necessary to provide the Service.
            </P>
          </Section>

          <Section id="availability" title="6. Service Availability">
            <P>
              We aim to provide a reliable service but do not guarantee uninterrupted
              availability. We may perform maintenance that temporarily interrupts
              access. We are not liable for downtime caused by factors outside our
              reasonable control, including third-party infrastructure failures.
            </P>
          </Section>

          <Section id="termination" title="7. Termination">
            <P>
              Either party may terminate this agreement at any time. Upon termination,
              your access to the Service will cease. We will retain your Data for 30
              days following termination, after which it may be permanently deleted. You
              may request an export of your Data before termination.
            </P>
          </Section>

          <Section id="liability" title="8. Limitation of Liability">
            <P>
              To the maximum extent permitted by applicable law, our total liability for
              any claim arising out of or related to the Service is limited to the
              amount you paid us in the 12 months preceding the claim. We are not liable
              for indirect, incidental, special, consequential, or punitive damages.
            </P>
          </Section>

          <Section id="warranties" title="9. Disclaimer of Warranties">
            <P>
              The Service is provided "as is" and "as available" without warranties of
              any kind, express or implied, including but not limited to warranties of
              merchantability, fitness for a particular purpose, or non-infringement.
            </P>
          </Section>

          <Section id="governing-law" title="10. Governing Law and Dispute Resolution">
            <P>
              These terms are governed by the laws of the United States. For Subscribers
              located in the European Union, mandatory consumer protection provisions of
              EU member state law apply. Any dispute shall first be attempted to be
              resolved through good-faith negotiation. If unresolved, disputes shall be
              submitted to binding arbitration under applicable rules, except where
              prohibited by law.
            </P>
          </Section>

          <Section id="changes-tos" title="11. Changes to Terms">
            <P>
              We may update these terms at any time. We will notify active subscribers
              by email at least 14 days before material changes take effect. Continued
              use of the Service after the effective date constitutes acceptance of the
              updated terms.
            </P>
          </Section>

          <div className="terms-divider" />

          {/* ── Part 2: Privacy Policy ─────────────────────────────────── */}
          <div id="privacy" className="terms-part-heading">
            <span>Part 2</span>
            <h2>Privacy Policy</h2>
          </div>

          <P>
            {COMPANY} is committed to protecting your privacy. This Privacy Policy
            explains how we collect, use, store, and share information when you use
            Bizniz Optimizer. It applies to all users globally, with specific
            provisions for EU/EEA residents under GDPR and California residents under
            CCPA.
          </P>

          <Section id="controller" title="1. Data Controller">
            <P>
              {COMPANY} is the data controller for personal data processed in
              connection with account management, billing, and support. For data that
              Subscribers upload and manage within the Service, the Subscriber acts as
              data controller and {COMPANY} acts as data processor.
            </P>
            <P>
              Contact for privacy matters:{" "}
              <a href={`mailto:${PRIVACY_EMAIL}`} className="terms-link">{PRIVACY_EMAIL}</a>
            </P>
          </Section>

          <Section id="what-we-collect" title="2. What Data We Collect">
            <Sub title="2.1 Account and Billing Data">
              <Ul items={[
                "Name, email address, and password (hashed) when you register.",
                "Billing information processed through our payment provider (Stripe). We do not store full card numbers.",
                "Subscription and transaction records.",
              ]} />
            </Sub>
            <Sub title="2.2 Service Data (Subscriber-controlled)">
              <P>Data that you and your users enter into the Service may include:</P>
              <Ul items={[
                "Business operational data: orders, payments, customers, partners, products, suppliers.",
                "Employee personal data: names, time entries, attendance records.",
                "End-consumer personal data: names, contact details, transaction history.",
              ]} />
              <P>
                You are responsible for ensuring you have a lawful basis for processing
                any personal data you enter into the Service.
              </P>
            </Sub>
            <Sub title="2.3 Usage and Technical Data">
              <Ul items={[
                "Log data including IP addresses, browser type, pages visited, and timestamps.",
                "Device and connection information.",
              ]} />
            </Sub>
          </Section>

          <Section id="how-we-use" title="3. How We Use Your Data">
            <Ul items={[
              "To provide, maintain, and improve the Service.",
              "To process payments and manage subscriptions.",
              "To communicate with you regarding your account, updates, and support.",
              "To comply with legal obligations.",
              "To investigate security incidents or violations of these terms.",
            ]} />
            <P>We do not use your Data for advertising and do not sell your Data to third parties.</P>
          </Section>

          <Section id="storage" title="4. Data Storage and Transfers">
            <P>
              Your data is stored in a PostgreSQL database hosted on Neon (neon.tech),
              running on Amazon Web Services (AWS) in the us-east-1 (Northern Virginia,
              USA) region.
            </P>
            <P>
              If you are located in the European Union or European Economic Area, your
              data is transferred to and stored in the United States. This transfer is
              conducted in accordance with GDPR Chapter V, relying on Standard
              Contractual Clauses (SCCs) or other appropriate safeguards. By using the
              Service, EU/EEA users acknowledge and consent to this transfer.
            </P>
          </Section>

          <Section id="sharing" title="5. Data Sharing and Third Parties">
            <P>
              We share data only with the following sub-processors where necessary to
              provide the Service:
            </P>
            <Ul items={[
              "Neon Inc. — database hosting (AWS us-east-1).",
              "Netlify Inc. — application hosting and deployment.",
              "Stripe Inc. — payment processing.",
              "Resend Inc. — transactional email delivery.",
            ]} />
            <P>
              We do not share your data with any other third parties without your
              explicit consent, except where required by law.
            </P>
          </Section>

          <Section id="retention" title="6. Data Retention">
            <P>
              Account and billing data is retained for the duration of the subscription
              and for up to 7 years thereafter for legal and accounting purposes.
            </P>
            <P>
              Service data is retained for the duration of the subscription and for 30
              days following termination, after which it is permanently deleted. You may
              request deletion of your data at any time by contacting{" "}
              <a href={`mailto:${PRIVACY_EMAIL}`} className="terms-link">{PRIVACY_EMAIL}</a>.
            </P>
          </Section>

          <Section id="security" title="7. Security">
            <P>
              We implement reasonable technical and organizational measures to protect
              your data, including encrypted connections (TLS), hashed passwords,
              JWT-based authentication, and role-based access control. However, no
              system is completely secure, and we cannot guarantee absolute security.
            </P>
            <P>
              Our staff may access customer data only for the purposes of providing
              support and maintaining the Service. Such access is governed by internal
              access policies and logged.
            </P>
          </Section>

          <Section id="gdpr" title="8. Your Rights — EU/EEA Residents (GDPR)">
            <P>
              If you are located in the EU or EEA, you have the following rights under
              GDPR:
            </P>
            <Ul items={[
              "Right of access: request a copy of the personal data we hold about you.",
              "Right to rectification: request correction of inaccurate or incomplete data.",
              'Right to erasure ("right to be forgotten"): request deletion of your data under certain conditions.',
              "Right to restriction of processing: request that we limit how we use your data.",
              "Right to data portability: receive your data in a structured, machine-readable format.",
              "Right to object: object to processing based on legitimate interests.",
              "Right to withdraw consent: where processing is based on consent, withdraw it at any time.",
            ]} />
            <P>
              To exercise any of these rights, contact us at{" "}
              <a href={`mailto:${PRIVACY_EMAIL}`} className="terms-link">{PRIVACY_EMAIL}</a>.
              We will respond within 30 days. If you believe your rights have not been
              respected, you have the right to lodge a complaint with your local
              supervisory authority (e.g., Integritetsskyddsmyndigheten (IMY) in
              Sweden).
            </P>
          </Section>

          <Section id="ccpa" title="9. Your Rights — California Residents (CCPA/CPRA)">
            <P>
              If you are a California resident, you have the following rights under the
              CCPA and CPRA:
            </P>
            <Ul items={[
              "Right to know: request disclosure of the categories and specific pieces of personal information we have collected about you.",
              "Right to delete: request deletion of personal information we hold about you.",
              "Right to correct: request correction of inaccurate personal information.",
              "Right to opt-out of sale or sharing: we do not sell or share personal information for cross-context behavioral advertising.",
              "Right to non-discrimination: we will not discriminate against you for exercising your CCPA rights.",
            ]} />
            <P>
              To submit a request, contact{" "}
              <a href={`mailto:${PRIVACY_EMAIL}`} className="terms-link">{PRIVACY_EMAIL}</a>.
              We will respond within 45 days.
            </P>
          </Section>

          <Section id="cookies" title="10. Cookies">
            <P>
              The Service uses only session cookies and local browser storage essential
              for authentication and user preferences. We do not use advertising or
              tracking cookies.
            </P>
          </Section>

          <Section id="children" title="11. Children's Privacy">
            <P>
              The Service is not directed at individuals under the age of 16. We do not
              knowingly collect personal data from children. If you believe a child has
              submitted personal data to us, please contact us at{" "}
              <a href={`mailto:${PRIVACY_EMAIL}`} className="terms-link">{PRIVACY_EMAIL}</a>{" "}
              and we will delete it promptly.
            </P>
          </Section>

          <Section id="changes-privacy" title="12. Changes to This Privacy Policy">
            <P>
              We may update this Privacy Policy from time to time. We will notify you
              of material changes by email or by posting a notice within the Service.
              The updated policy will be effective from the date indicated at the top of
              the document.
            </P>
          </Section>

          <Section id="contact" title="13. Contact">
            <P>
              For any questions or concerns regarding this document, data privacy, or
              to exercise your rights, contact us at:
            </P>
            <div className="terms-contact-card">
              <strong>{COMPANY}</strong>
              <a href={`mailto:${PRIVACY_EMAIL}`} className="terms-link">{PRIVACY_EMAIL}</a>
              <a href="https://biznizoptimizer.com" className="terms-link">biznizoptimizer.com</a>
            </div>
          </Section>

          <div className="terms-footer">
            Last updated: {EFFECTIVE_DATE}
          </div>
        </main>
      </div>
    </div>
  );
}