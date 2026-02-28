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
    tag: { text: "- Required", color: "green" },
    features: [
      { label: "Dashboard" },
      { label: "Customers",     hasPreview: true, videoSrc: "/videos/register-customers.mp4", videoTitle: "Customers" },
      { label: "New Order",     hasPreview: true, videoSrc: "/videos/register-orders.mp4",    videoTitle: "New Order" },
      { label: "New Payment",   hasPreview: true, videoSrc: "/videos/register-payments.mp4",  videoTitle: "New Payment" },
      { label: "Partners" },
      { label: "Products",      hasPreview: true, videoSrc: "/videos/register-products.mp4",  videoTitle: "Products" },
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
    features: [
      { label: "All Reports" },
    ],
  },
  {
    id: "admin",
    name: "Admin",
    tag: { text: "- Free", color: "green" },
    features: [
      { label: "User Admin" },
      { label: "Settings" },
    ],
  },
];

const COL1_IDS = ["sales", "supply"];
const COL2_IDS = ["employee", "reports", "admin"];

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