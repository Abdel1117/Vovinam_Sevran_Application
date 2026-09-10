"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navigation } from "@/lib/data";

export default function Header({ solide = false }: { solide?: boolean }) {
  const [scrolled, setScrolled] = useState(solide);
  const [open, setOpen] = useState(false);
  const [mobileGroupOpen, setMobileGroupOpen] = useState<string | null>(null);

  useEffect(() => {
    if (solide) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [solide]);

  const clair = !scrolled;

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-60 border-b transition-colors duration-300",
        scrolled
          ? "border-[#e7ecf7] bg-white shadow-[0_6px_24px_rgb(16_24_40/0.07)]"
          : "border-transparent bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-[1360px] items-center gap-7 px-7 py-4">
        <Link href="/" className="flex flex-none items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-vovinam font-display text-[17px] font-extrabold text-jaune">
            VV
          </span>
          <span
            className={[
              "flex flex-col leading-none",
              clair ? "text-white" : "text-encre",
            ].join(" ")}
          >
            <span className="font-display text-[15px] font-extrabold tracking-wide">
              VOVINAM
            </span>
            <span className="text-[10px] font-medium tracking-[0.18em] opacity-70">
              VIET VO DAO
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-6 lg:flex">
          {navigation.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className={[
                    "flex items-center gap-1 text-sm font-semibold transition-opacity hover:opacity-65",
                    clair ? "text-white" : "text-encre-70",
                  ].join(" ")}
                >
                  {item.label}
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="size-3.5 transition-transform duration-200 group-hover:rotate-180"
                  >
                    <path
                      d="M5 7.5 10 12.5 15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
                <div className="invisible absolute left-0 top-full pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="flex min-w-[190px] flex-col overflow-hidden rounded-2xl border border-[#e7ecf7] bg-white py-2 shadow-[0_18px_40px_rgb(16_24_40/0.14)]">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="px-4 py-2.5 text-sm font-semibold text-encre-70 transition-colors hover:bg-[#f6f8fe] hover:text-encre"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={[
                  "text-sm font-semibold transition-opacity hover:opacity-65",
                  clair ? "text-white" : "text-encre-70",
                ].join(" ")}
              >
                {item.label}
              </Link>
            ),
          )}
          <Link
            href="/connexion"
            className={[
              "text-sm font-semibold transition-opacity hover:opacity-65",
              clair ? "text-white" : "text-encre-70",
            ].join(" ")}
          >
            Connexion
          </Link>
          <Link
            href="/contact"
            className="rounded-full bg-jaune px-5 py-3.5 text-sm font-bold text-encre shadow-[0_6px_18px_rgb(16_24_40/0.14)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            Faire un cours d'essai
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={open}
          className={[
            "ml-auto flex size-12 flex-col items-center justify-center gap-1.5 rounded-xl border lg:hidden",
            clair
              ? "border-white/35 bg-white/15 text-white"
              : "border-[#e1e7f5] bg-[#f6f8fe] text-encre",
          ].join(" ")}
        >
          <span className="block h-0.5 w-5 bg-current" />
          <span className="block h-0.5 w-5 bg-current" />
          <span className="block h-0.5 w-5 bg-current" />
        </button>
      </div>

      {open ? (
        <div className="flex flex-col border-t border-[#e7ecf7] bg-white px-5 pt-3.5 pb-6 shadow-[0_18px_40px_rgb(16_24_40/0.12)] lg:hidden">
          {navigation.map((item) =>
            item.children ? (
              <div key={item.label} className="border-b border-[#f1f4fb]">
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex-1 px-2 py-4 text-[17px] font-semibold text-encre"
                  >
                    {item.label}
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      setMobileGroupOpen((v) =>
                        v === item.label ? null : item.label,
                      )
                    }
                    aria-label={`Afficher les liens de ${item.label}`}
                    aria-expanded={mobileGroupOpen === item.label}
                    className="flex size-11 flex-none items-center justify-center text-encre-70"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      className={[
                        "size-4 transition-transform duration-200",
                        mobileGroupOpen === item.label ? "rotate-180" : "",
                      ].join(" ")}
                    >
                      <path
                        d="M5 7.5 10 12.5 15 7.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                {mobileGroupOpen === item.label ? (
                  <div className="flex flex-col pb-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="px-2 py-3 pl-6 text-[15px] font-semibold text-encre-70"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-[#f1f4fb] px-2 py-4 text-[17px] font-semibold text-encre"
              >
                {item.label}
              </Link>
            ),
          )}
          <Link
            href="/connexion"
            onClick={() => setOpen(false)}
            className="px-2 py-4 text-[17px] font-semibold text-encre"
          >
            Connexion
          </Link>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-3 rounded-full bg-jaune px-5 py-4.5 text-center text-base font-bold text-encre"
          >
            Faire un cours d'essai
          </Link>
        </div>
      ) : null}
    </header>
  );
}
