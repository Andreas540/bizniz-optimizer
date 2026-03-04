import { useState } from "react";
import "./QASection.css";

const QA_ITEMS = [
  {
    question: "What kind of businesses is the app for?",
    answer: "The current version is built for manufacturers and distributors. Service providers will be included shortly. Watch videos on the preview page to see all features, or contact us for more information.",
  },
  {
    question: "How do I get access to the app?",
    answer: "After check out, you will be asked to provide company name and user email(s). After sending this information you will be emailed a link and password within a few hours.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. It is a monthly subscription that can be cancelled at any time. Cancellation is made on the Settings page in the app.",
  },
  {
    question: "What languages, timezones and currencies are supported",
    answer: "As of now the app supports English, dollars($) and the EST timezone. Spanish, Swedish, Euro(€), SEK and all timezones will be added shortly.",
  },
];

export default function QASection() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggle = (i: number) => setExpanded(prev => prev === i ? null : i);

  return (
    <div className="qa-scroll">
      <div className="qa-section">
        <h2 className="qa-section__title">Q&amp;A</h2>

        <div className="qa-section__list">
          {QA_ITEMS.map((item, i) => {
            const isOpen = expanded === i;
            return (
              <div key={i} className={`qa-section__item${isOpen ? " qa-section__item--open" : ""}`}>
                <button
                  className="qa-section__question"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <span className="qa-section__icon" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="qa-section__answer">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}