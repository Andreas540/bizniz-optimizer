import { useState } from "react";
import "./PricingSection.css";
import VideoModal from "./VideoModal";

const PRICE = 9.99;

type Feature = {
  label: string;
  hasPreview?: boolean;
  videoSrc?: string;
  videoTitle?: string;
};

type Module = {
  id: string;
  name: string;
  tag?: { text: string };
  features: Feature[];
  required?: boolean;
  noUserEdit?: boolean;
  freeModule?: boolean;
};

const MODULES: Module[] = [
  {
    id: "sales",
    name: "Sales & Cash Flow",
    tag: { text: "- Required" },
    required: true,
    features: [
      { label: "Dashboard" },
      { label: "Customers",    hasPreview: true, videoSrc: "/videos/register-customers.mp4", videoTitle: "Customers" },
      { label: "New Order",    hasPreview: true, videoSrc: "/videos/register-orders.mp4",    videoTitle: "New Order" },
      { label: "New Payment",  hasPreview: true, videoSrc: "/videos/register-payments.mp4",  videoTitle: "New Payment" },
      { label: "Partners" },
      { label: "Products",     hasPreview: true, videoSrc: "/videos/register-products.mp4",  videoTitle: "Products" },
      { label: "Price Checker" },
      { label: "Create Invoice" },
      { label: "Costs" },
    ],
  },
  {
    id: "supply",
    name: "Supply and Demand",
    features: [
      { label: "Supply & Demand" },
      { label: "Production" },
      { label: "Warehouse" },
      { label: "New Order, Supplier" },
      { label: "Suppliers" },
    ],
  },
  {
    id: "employee",
    name: "Employee Management",
    features: [
      { label: "Employees" },
      { label: "Time Approval" },
      { label: "Time Entry" },
    ],
  },
  {
    id: "reports",
    name: "Reports",
    features: [{ label: "All Reports" }],
  },
  {
    id: "admin",
    name: "Admin",
    tag: { text: "- Free" },
    required: true,
    noUserEdit: true,
    freeModule: true,
    features: [{ label: "User Admin" }, { label: "Settings" }],
  },
];

type ModuleState = { checked: boolean; users: number };

function initState(): Record<string, ModuleState> {
  const s: Record<string, ModuleState> = {};
  MODULES.forEach((m) => {
    s[m.id] = { checked: m.id === "sales" || m.id === "admin", users: 1 };
  });
  return s;
}

type ModalVideo = { src: string; title: string };

export default function PricingSection() {
  const [state, setState] = useState<Record<string, ModuleState>>(initState);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalVideo | null>(null);

  const monthlyCost = MODULES.reduce((sum, m) => {
    if (m.freeModule) return sum;
    const s = state[m.id];
    if (!s.checked) return sum;
    return sum + s.users * PRICE;
  }, 0);

  const toggleExpand = (id: string) =>
    setExpanded((prev) => (prev === id ? null : id));

  const toggleCheck = (id: string) => {
    const mod = MODULES.find((m) => m.id === id)!;
    if (mod.required) return;
    setState((prev) => {
      const nowChecked = !prev[id].checked;
      const updated = { ...prev, [id]: { ...prev[id], checked: nowChecked } };
      if (!nowChecked) updated[id] = { ...updated[id], users: 1 };
      return updated;
    });
  };

  const setUsers = (id: string, val: number) => {
    setState((prev) => {
      const updated = { ...prev };
      if (id === "sales") {
        updated["sales"] = { ...updated["sales"], users: val };
        updated["admin"] = { ...updated["admin"], users: val };
      } else {
        updated[id] = { ...updated[id], users: val };
        if (val > updated["sales"].users) {
          updated["sales"] = { ...updated["sales"], users: val };
          updated["admin"] = { ...updated["admin"], users: val };
        }
      }
      return updated;
    });
  };

  const visibleModules = expanded
    ? MODULES.filter((m) => m.id === expanded)
    : MODULES;

  return (
    <>
      <div className="pricing-scroll">
        <div className="pricing">
          <h2 className="pricing__title">Previews, Pricing and Purchase</h2>

          <div className="pricing__boxes">
            <div className="pricing__box">
              <span className="pricing__box-price">Only ${PRICE.toFixed(2)}/month</span>
              <span>- Per user</span>
              <span>- Per module</span>
            </div>
            <div className="pricing__box pricing__box--calc">
              <span className="pricing__box-label">Your monthly cost (ex. taxes):</span>
              <span className="pricing__box-total">${monthlyCost.toFixed(2)}</span>
            </div>
          </div>

          <p className="pricing__modules-title">Modules:</p>

          <div className="pricing__modules">
            {visibleModules.map((mod) => {
              const s = state[mod.id];
              const isExpanded = expanded === mod.id;

              return (
                <div key={mod.id} className="pricing__module">
                  <div className="pricing__module-header">
                    <div className="pricing__module-info" onClick={() => toggleExpand(mod.id)}>
                      <span className="pricing__module-name">
                        {mod.name}
                        {mod.tag && (
                          <span className="pricing__tag--green"> {mod.tag.text}</span>
                        )}
                      </span>
                      <span className="pricing__toggle-label">
                        {isExpanded ? "Click to hide all features" : "Click to see all features"}
                      </span>
                    </div>

                    <div className="pricing__controls">
                      <button
                        className={`pricing__check ${s.checked ? "pricing__check--on" : ""} ${mod.required ? "pricing__check--locked" : ""}`}
                        onClick={() => toggleCheck(mod.id)}
                        aria-label={s.checked ? "Uncheck module" : "Check module"}
                      >
                        {s.checked && (
                          <svg viewBox="0 0 12 10" fill="none">
                            <polyline points="1,5 4.5,8.5 11,1" stroke="#0b4a63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>

                      <select
                        className={`pricing__users ${!s.checked || mod.noUserEdit ? "pricing__users--inactive" : ""}`}
                        value={s.users}
                        disabled={!s.checked || !!mod.noUserEdit}
                        onChange={(e) => setUsers(mod.id, Number(e.target.value))}
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                      <span className={`pricing__users-label ${!s.checked ? "pricing__users-label--inactive" : ""}`}>
                        User(s)
                      </span>
                    </div>
                  </div>

                  {isExpanded && (
                    <ul className="pricing__features">
                      {mod.features.map((f, i) => (
                        <li key={i} className="pricing__feature">
                          <span>- {f.label}</span>
                          {f.hasPreview && f.videoSrc && (
                            <button
                              className="pricing__preview-btn"
                              onClick={() => setModal({ src: f.videoSrc!, title: f.videoTitle ?? f.label })}
                            >
                              (preview)
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pricing__cta">
            <button className="pricing__btn">Proceed to Check out</button>
          </div>
        </div>
      </div>

      {modal && (
        <VideoModal
          src={modal.src}
          title={modal.title}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}