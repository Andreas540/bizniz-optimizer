import { useState } from "react";
import "./PricingSection.css";

const PRICE = 9.99;

type Feature = { label: string; hasPreview?: boolean };
type Module = {
  id: string;
  name: string;
  tag?: { text: string; color: "green" };
  features: Feature[];
  required?: boolean;   // cannot uncheck
  noUserEdit?: boolean; // user count locked
};

const MODULES: Module[] = [
  {
    id: "sales",
    name: "Sales & Cash Flow",
    tag: { text: "- Required", color: "green" },
    required: true,
    features: [
      { label: "Dashboard" },
      { label: "Customers", hasPreview: true },
      { label: "New Order", hasPreview: true },
      { label: "New Payment", hasPreview: true },
      { label: "Partners" },
      { label: "Products", hasPreview: true },
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
    tag: { text: "- Free", color: "green" },
    required: true,
    noUserEdit: true,
    features: [{ label: "User Admin" }, { label: "Settings" }],
  },
];

type ModuleState = {
  checked: boolean;
  users: number;
};

function initState(): Record<string, ModuleState> {
  const s: Record<string, ModuleState> = {};
  MODULES.forEach((m) => {
    s[m.id] = {
      checked: m.id === "sales" || m.id === "admin",
      users: 1,
    };
  });
  return s;
}

export default function PricingSection() {
  const [state, setState] = useState<Record<string, ModuleState>>(initState);
  const [expanded, setExpanded] = useState<string | null>(null);

  const monthlyCost = MODULES.reduce((sum, m) => {
    const s = state[m.id];
    if (!s.checked) return sum;
    return sum + s.users * PRICE;
  }, 0);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  const toggleCheck = (id: string) => {
    const mod = MODULES.find((m) => m.id === id)!;
    if (mod.required) return;
    setState((prev) => {
      const nowChecked = !prev[id].checked;
      const updated = { ...prev, [id]: { ...prev[id], checked: nowChecked } };
      // If unchecking, reset users to 1
      if (!nowChecked) updated[id] = { ...updated[id], users: 1 };
      return updated;
    });
  };

  const setUsers = (id: string, val: number) => {
    setState((prev) => {
      const updated = { ...prev };

      if (id === "sales") {
        // Sales drives admin
        updated["sales"] = { ...updated["sales"], users: val };
        updated["admin"] = { ...updated["admin"], users: val };
        // Any other module that had MORE than new val stays as-is
        // (they can exceed sales, which then auto-raises sales — but here we're
        //  setting sales directly, so just apply)
      } else {
        updated[id] = { ...updated[id], users: val };
        // If this module's users exceed sales, raise sales (and admin)
        if (val > updated["sales"].users) {
          updated["sales"] = { ...updated["sales"], users: val };
          updated["admin"] = { ...updated["admin"], users: val };
        }
      }

      return updated;
    });
  };

  // Visible modules: all when nothing expanded, else only the expanded one
  const visibleModules =
    expanded ? MODULES.filter((m) => m.id === expanded) : MODULES;

  return (
    <div className="pricing">
      <h2 className="pricing__title">Previews, Pricing and Purchase</h2>

      {/* Info boxes */}
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

      {/* Modules */}
      <p className="pricing__modules-title">Modules:</p>

      <div className="pricing__modules">
        {visibleModules.map((mod) => {
          const s = state[mod.id];
          const isExpanded = expanded === mod.id;
          const isLocked = !!mod.required;
          const isUserLocked = !!mod.noUserEdit;

          return (
            <div key={mod.id} className="pricing__module">
              {/* Module header row */}
              <div className="pricing__module-header">
                <div
                  className="pricing__module-info"
                  onClick={() => toggleExpand(mod.id)}
                >
                  <span className="pricing__module-name">
                    {mod.name}
                    {mod.tag && (
                      <span className="pricing__tag pricing__tag--green">
                        {" "}{mod.tag.text}
                      </span>
                    )}
                  </span>
                  <span className="pricing__toggle-label">
                    {isExpanded ? "Click to hide all features" : "Click to see all features"}
                  </span>
                </div>

                <div className="pricing__controls">
                  {/* Checkbox */}
                  <button
                    className={`pricing__check ${s.checked ? "pricing__check--on" : ""} ${isLocked ? "pricing__check--locked" : ""}`}
                    onClick={() => toggleCheck(mod.id)}
                    aria-label={s.checked ? "Uncheck module" : "Check module"}
                  >
                    {s.checked && (
                      <svg viewBox="0 0 12 10" fill="none">
                        <polyline
                          points="1,5 4.5,8.5 11,1"
                          stroke="#0b4a63"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>

                  {/* User count */}
                  <select
                    className={`pricing__users ${!s.checked || isUserLocked ? "pricing__users--inactive" : ""}`}
                    value={s.users}
                    disabled={!s.checked || isUserLocked}
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

              {/* Expandable features */}
              {isExpanded && (
                <ul className="pricing__features">
                  {mod.features.map((f, i) => (
                    <li key={i} className="pricing__feature">
                      <span>- {f.label}</span>
                      {f.hasPreview && (
                        <span className="pricing__preview"> (preview)</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="pricing__cta">
        <button className="pricing__btn">Proceed to Check out</button>
      </div>
    </div>
  );
}