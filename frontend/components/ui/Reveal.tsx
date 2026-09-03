"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Décalage de l'apparition, en millisecondes. */
  delay?: number;
  className?: string;
};

/**
 * Apparition au scroll. La visibilité est l'état par défaut en cas
 * d'échec de l'IntersectionObserver : un balayage de position + un
 * délai de sécurité révèlent toujours le contenu.
 */
export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const check = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.94 && r.bottom > -80) setShown(true);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    const secours = setTimeout(() => setShown(true), 1500);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      clearTimeout(secours);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: delay + "ms" }}
      className={[
        className,
        "transition-all duration-700 ease-doux motion-reduce:transition-none",
        shown ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
