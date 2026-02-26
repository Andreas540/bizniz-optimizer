import { useEffect, useMemo, useRef, useState } from "react";
import "./VideoHero.css";

type VideoItem = { title: string; src: string };

export default function VideoHero({ items }: { items: VideoItem[] }) {
  const safeItems = useMemo(() => items.filter(Boolean), [items]);
  const [idx, setIdx] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const prev = () => setIdx((i) => (i - 1 + safeItems.length) % safeItems.length);
  const next = () => setIdx((i) => (i + 1) % safeItems.length);

  useEffect(() => {
    // Ensure it restarts cleanly when switching sources
    const v = videoRef.current;
    if (!v) return;
    v.load();
    const play = async () => {
      try {
        await v.play();
      } catch {
        // Autoplay can be blocked if not muted/playsInline; we already set both.
      }
    };
    play();
  }, [idx]);

  const current = safeItems[idx];

  return (
    <div className="heroCard">
      <div className="heroTop">
        <div className="heroTitle">{current?.title ?? ""}</div>
        <div className="heroArrows">
          <button className="arrowBtn" aria-label="Previous video" onClick={prev}>
            &lt;
          </button>
          <button className="arrowBtn" aria-label="Next video" onClick={next}>
            &gt;
          </button>
        </div>
      </div>

      <div className="videoFrameOuter">
        <div className="videoFrameInner">
          <video
            ref={videoRef}
            className="video"
            src={current?.src}
            muted
            autoPlay
            loop
            playsInline
            controls={false}
          />
        </div>
      </div>
    </div>
  );
}