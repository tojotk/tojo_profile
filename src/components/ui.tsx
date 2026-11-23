import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type PointerEvent } from "react";

/* ---------------- Reveal on scroll ---------------- */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ "--d": `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}

/* ---------------- 3D tilt card ---------------- */
export function Tilt({
  children,
  className = "",
  max = 7,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const px = (clientX - r.left) / r.width;
      const py = (clientY - r.top) / r.height;
      el.classList.add("is-active");
      el.style.setProperty("--rx", `${((0.5 - py) * max * 2).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${((px - 0.5) * max * 2).toFixed(2)}deg`);
      el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    });
  };
  const onLeave = () => {
    cancelAnimationFrame(frame.current);
    const el = ref.current;
    if (!el) return;
    el.classList.remove("is-active");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`tilt ${className}`}>
      {children}
      {glare && <div className="tilt-glare" />}
    </div>
  );
}


/* ---------------- Split text (letter-by-letter 3D rise) ---------------- */
export function SplitText({ text, base = 0, className = "", gradient = false }: { text: string; base?: number; className?: string; gradient?: boolean }) {
  let n = 0;
  const len = Array.from(text.replace(/ /g, "")).length;
  return (
    <span className={`split-line ${gradient ? "split-grad" : ""} ${className}`} aria-label={text} style={{ "--base": `${base}ms`, "--len": len } as CSSProperties}>
      {text.split(" ").map((word, w, arr) => (
        <span key={w} aria-hidden="true" className="whitespace-nowrap inline-block">
          {Array.from(word).map((ch) => (
            <span key={n} className="split-char" style={{ "--i": n++ } as CSSProperties}>
              {ch}
            </span>
          ))}
          {w < arr.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}

/* ---------------- Scroll progress bar ---------------- */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
      ref.current?.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return <div ref={ref} className="scroll-progress" aria-hidden="true" />;
}

/* ---------------- Cursor aura + ring ---------------- */
export function CursorFX() {
  const aura = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    const t = { x: -999, y: -999 };
    const a = { x: -999, y: -999 };
    const d = { x: -999, y: -999 };
    let raf = 0;
    const onMove = (e: globalThis.PointerEvent) => {
      t.x = e.clientX;
      t.y = e.clientY;
      const el = e.target as HTMLElement | null;
      dot.current?.classList.toggle("is-link", !!el?.closest("a,button,[role=button]"));
    };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      a.x += (t.x - a.x) * 0.08;
      a.y += (t.y - a.y) * 0.08;
      d.x += (t.x - d.x) * 0.3;
      d.y += (t.y - d.y) * 0.3;
      aura.current?.style.setProperty("--cx", `${a.x.toFixed(1)}px`);
      aura.current?.style.setProperty("--cy", `${a.y.toFixed(1)}px`);
      dot.current?.style.setProperty("--dx", `${d.x.toFixed(1)}px`);
      dot.current?.style.setProperty("--dy", `${d.y.toFixed(1)}px`);
    };
    const onDown = (e: globalThis.PointerEvent) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const burst = document.createElement("div");
      burst.className = "click-burst";
      burst.style.left = `${e.clientX}px`;
      burst.style.top = `${e.clientY}px`;
      burst.innerHTML = '<b class="ring"></b>' + Array.from({ length: 10 }, (_, i) => `<i style="--a:${i * 36}deg;--d:${28 + Math.random() * 34}px"></i>`).join("");
      document.body.appendChild(burst);
      setTimeout(() => burst.remove(), 800);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);
  return (
    <>
      <div ref={aura} className="cursor-aura" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}

/* ---------------- Intro loader ---------------- */
export function Loader({ onDone }: { onDone?: () => void }) {
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const ready = new Promise<void>((res) => {
      if (document.readyState === "complete") res();
      else window.addEventListener("load", () => res(), { once: true });
    });
    const min = new Promise<void>((res) => setTimeout(res, 1300));
    const cap = new Promise<void>((res) => setTimeout(res, 4000));
    Promise.race([Promise.all([ready, min]), cap]).then(() => {
      setDone(true);
      onDone?.();
      setTimeout(() => setGone(true), 1100);
    });
  }, [onDone]);
  if (gone) return null;
  return (
    <div className={`loader ${done ? "done" : ""}`} role="status" aria-label="Loading portfolio">
      <div className="text-center" style={{ perspective: "600px" }}>
        <div className="loader-mark mx-auto" />
        <div className="loader-bar" />
        <p className="font-display mt-5 text-[11px] uppercase tracking-[0.5em] text-azure-300/80">Tojo Tom</p>
      </div>
    </div>
  );
}

/* ---------------- Magnetic wrapper (pulls toward the cursor) ---------------- */
export function Magnetic({ children, strength = 0.28, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const onMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate3d(0,0,0)";
  };
  return (
    <span ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`magnetic inline-block ${className}`}>
      {children}
    </span>
  );
}

/* ---------------- Scroll-parallax ghost numeral ---------------- */
export function GhostNum({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.parentElement?.getBoundingClientRect();
      if (!r) return;
      const mid = r.top + r.height / 2 - window.innerHeight / 2;
      el.style.setProperty("--py", `${(mid * -0.18).toFixed(1)}px`);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return (
    <div ref={ref} className={`ghost-num ${className}`} aria-hidden="true">
      {children}
    </div>
  );
}

/* ---------------- Text decode / scramble on reveal ---------------- */
const SCR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789<>/{}[]*#";
export function Scramble({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const DUR = 900;
        const finish = window.setTimeout(() => {
          clearInterval(timer);
          setOut(text);
        }, DUR + 150);
        timer = window.setInterval(() => {
          const reveal = ((performance.now() - t0) / DUR) * text.length;
          if (reveal >= text.length) {
            clearInterval(timer);
            clearTimeout(finish);
            setOut(text);
            return;
          }
          setOut(
            Array.from(text)
              .map((c, i) => (c === " " || i < reveal ? c : SCR[Math.floor(Math.random() * SCR.length)]))
              .join("")
          );
        }, 40);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearInterval(timer);
    };
  }, [text]);
  return (
    <span ref={ref} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </span>
  );
}

/* ---------------- Section header ---------------- */
export function SectionHeader({ eyebrow, title, intro, num }: { eyebrow: string; title: string; intro?: string; num?: string }) {
  return (
    <Reveal className="max-w-2xl">
      <p className="eyebrow flex items-center gap-3">
        {num && <span className="font-mono text-[11px] text-frost-300/80">{num}</span>}
        {num && <span className="h-px w-8 bg-white/20" />}
        {eyebrow}
      </p>
      <h2 className="font-display mt-3 text-4xl font-bold tracking-tight text-white md:text-5xl">
        <Scramble text={title} />
      </h2>
      <div className="bar-grow mt-5 h-[3px] w-14 rounded-full bg-gradient-to-r from-azure-500 to-frost-400" />
      {intro && <p className="mt-6 text-base leading-relaxed text-gray-400 md:text-lg">{intro}</p>}
    </Reveal>
  );
}

/* ---------------- Icons (inline, stroke-based) ---------------- */
type IconProps = { className?: string };
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const Icon = {
  ArrowUpRight: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  ),
  ArrowDown: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  ),
  Mail: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  Phone: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Pin: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Cap: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  Briefcase: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  Globe: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Target: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  User: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Camera: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  ),
  Cpu: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
    </svg>
  ),
  Code: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="m16 18 6-6-6-6" />
      <path d="m8 6-6 6 6 6" />
    </svg>
  ),
  Tool: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  Users: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Github: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  ),
  Linkedin: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  Instagram: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <path d="M17.5 6.5h.01" />
    </svg>
  ),
  Message: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  ),
  Star: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  Menu: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Close: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  Layers: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="m12 2 10 5-10 5L2 7l10-5z" />
      <path d="m2 17 10 5 10-5" />
      <path d="m2 12 10 5 10-5" />
    </svg>
  ),
  Database: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14a9 3 0 0 0 18 0V5" />
      <path d="M3 12a9 3 0 0 0 18 0" />
    </svg>
  ),
};
