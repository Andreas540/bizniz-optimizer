import { useState } from "react";
import "./PreviewSection.css";
import VideoModal from "./VideoModal";

type Feature = {
  label: string;
  hasPreview?: boolean;
  videoSrc?: string;
  videoTitle?: string;
};

type Module = {
  id: string;
  name: string;
  tag?: { text: string; color?: "green" };
  features: Feature[];
};

const MODULES: Module[] = [
  {
    id: "sales",
    name: "Sales & Cash Flow",
    features: [
      { label: "Dashboard" },
      { label: "Customers",     hasPreview: true, videoSrc: "/videos/register-customers.mp4", videoTitle: "Customers" },
      { label: "New Order",     hasPreview: true, videoSrc: "/videos/register-orders.mp4",    videoTitle: "New Order" },
      { label: "New Payment",   hasPreview: true, videoSrc: "/videos/customer-payments.mp4",  videoTitle: "New Payment" },
      { label: "Partners" },
      { label: "Products & Services", hasPreview: true, videoSrc: "/videos/register-products.mp4", videoTitle: "Products" },
      { label: "Price Checker", hasPreview: true, videoSrc: "/videos/price-checker.mp4",  videoTitle: "Price Checker" },
      { label: "Create Invoice" },
      { label: "Costs" },
      { label: "Customer order form (link)" },
      { label: "Stripe payment links for orders" },
    ],
  },
  {
    id: "booking",
    name: "Bookings",
    tag: { text: "New", color: "green" },
    features: [
      { label: "Booking dashboard" },
      { label: "New booking" },
      { label: "All bookings" },
      { label: "Clients" },
      { label: "Booking payments" },
      { label: "SMS reminders" },
      { label: "SMS usage tracking" },
      { label: "Public online booking page" },
      { label: "Stripe payment at booking" },
      { label: "SimplyBook.me integration" },
    ],
  },
  {
    id: "supply",
    name: "Supply Chain",
    features: [
      { label: "Supply & Demand overview" },
      { label: "Production", hasPreview: true, videoSrc: "/videos/production.mp4", videoTitle: "Production" },
      { label: "Warehouse / Inventory" },
      { label: "Supplier orders" },
      { label: "Suppliers" },
    ],
  },
  {
    id: "employee",
    name: "Employee Management",
    features: [
      { label: "Employee profiles" },
      { label: "Time approval" },
      { label: "Time entry" },
    ],
  },
  {
    id: "reports",
    name: "Reports & Analytics",
    features: [
      { label: "Sales & profit reports" },
      { label: "Customer analysis" },
      { label: "Ask BizWiz AI — AI-powered business insights" },
    ],
  },
  {
    id: "admin",
    name: "Admin",
    features: [
      { label: "Team & user management" },
      { label: "Role-based access control" },
      { label: "Invoicing & subscription" },
      { label: "Data export" },
      { label: "Booking configuration" },
      { label: "Payment providers (Stripe)" },
      { label: "Settings (language, currency, timezone)" },
      { label: "Contact" },
    ],
  },
];

const COL1_IDS = ["sales", "booking"];
const COL2_IDS = ["supply", "employee", "reports", "admin"];

type ModalVideo = { src: string; title: string };

export default function PreviewSection() {
  const [modal, setModal] = useState<ModalVideo | null>(null);

  const renderModule = (mod: Module) => (
    <div key={mod.id} className="preview__module">
      <div className="preview__module-name">
        {mod.name}
        {mod.tag && (
          <span className="preview__tag--green"> {mod.tag.text}</span>
        )}
      </div>
      <ul className="preview__features">
        {mod.features.map((f, i) => (
          <li key={i} className="preview__feature">
            <span>- {f.label}</span>
            {f.hasPreview && f.videoSrc && (
              <button
                className="preview__preview-btn"
                onClick={() => setModal({ src: f.videoSrc!, title: f.videoTitle ?? f.label })}
              >
                (preview)
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <div className="preview-scroll">
        <div className="preview">
          <h2 className="preview__title">Previews</h2>

          <div className="preview__columns">
            <div className="preview__col">
              {MODULES.filter(m => COL1_IDS.includes(m.id)).map(renderModule)}
            </div>
            <div className="preview__col">
              {MODULES.filter(m => COL2_IDS.includes(m.id)).map(renderModule)}
            </div>
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