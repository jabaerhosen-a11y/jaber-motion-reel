import { useState, type MouseEvent, type ReactNode } from "react";

/** Water-drop ripples wherever the hero is clicked. */
export function RippleLayer({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  const [drops, setDrops] = useState<{ id: number; x: number; y: number }[]>([]);
  const onClick = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const drop = { id: Date.now() + Math.random(), x: e.clientX - r.left, y: e.clientY - r.top };
    setDrops((d) => [...d.slice(-5), drop]);
    window.setTimeout(() => setDrops((d) => d.filter((x) => x.id !== drop.id)), 1600);
  };
  return <section id={id} className={className} onClick={onClick}>
    {children}
    <span aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {drops.map((d) => <span key={d.id} className="water-drop" style={{ left: d.x, top: d.y }}><i /><i /><i /></span>)}
    </span>
  </section>;
}

/** 3D typed title: letters type in, tilt toward the cursor, wave like water on hover. */
export function WaterTitle({ lines }: { lines: { text: string; accent?: boolean }[] }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  let n = 0;
  return <h1
    aria-label={lines.map((l) => l.text).join(" ")}
    className="water-title text-mega mt-6 text-5xl sm:text-7xl lg:text-8xl"
    style={{ transform: `perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)` }}
    onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setTilt({ x: ((e.clientX - r.left) / r.width - 0.5) * 16, y: -((e.clientY - r.top) / r.height - 0.5) * 16 }); }}
    onMouseLeave={() => setTilt({ x: 0, y: 0 })}
  >
    {lines.map((l, li) => <span key={li} aria-hidden className={`block ${l.accent ? "text-primary" : ""}`}>
      {[...l.text].map((c, ci) => { const i = n++; return <span key={ci} className="type-char" style={{ animationDelay: `${i * 0.08}s`, ["--i" as string]: i }}>{c}</span>; })}
    </span>)}
  </h1>;
}
