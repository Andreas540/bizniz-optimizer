import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./VideoModal.css";

type Props = {
  title: string;
  src: string;
  onClose: () => void;
};

export default function VideoModal({ title, src, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.load();
    v.play().catch(() => {});
  }, [src]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div className="vmodal-backdrop" onClick={onClose}>
      <div className="vmodal" onClick={(e) => e.stopPropagation()}>
        <div className="vmodal__header">
          <span className="vmodal__title">{title}</span>
          <button className="vmodal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="vmodal__video-wrap">
          <video
            ref={videoRef}
            className="vmodal__video"
            src={src}
            muted
            autoPlay
            loop
            playsInline
            controls={false}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}