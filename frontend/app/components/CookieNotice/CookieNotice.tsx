"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CLE = "vovinam-cookies-vu";

/**
 * Bandeau d'information : le site n'utilise que des cookies techniques,
 * il n'y a donc pas de consentement à recueillir, seulement à informer.
 */
export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(localStorage.getItem(CLE) === null);
    } catch {
      setVisible(true);
    }
  }, []);

  function fermer() {
    setVisible(false);
    try {
      localStorage.setItem(CLE, "1");
    } catch {
      // Stockage indisponible (navigation privée…) : le bandeau reviendra.
    }
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Information sur les cookies"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-[760px] flex-wrap items-center gap-4 rounded-3xl border border-trait bg-white px-6 py-5 shadow-card-hover sm:inset-x-6 sm:bottom-6"
    >
      <p className="min-w-[240px] flex-1 text-[0.95rem] leading-relaxed text-encre-50">
        <span className="font-bold text-encre">Pas de pistage ici.</span> Ce
        site n&apos;utilise ni mesure d&apos;audience ni cookie publicitaire,
        seulement des cookies techniques nécessaires à son fonctionnement.{" "}
        <Link
          href="/politique-de-confidentialite"
          className="font-semibold text-vovinam underline-offset-4 hover:underline"
        >
          En savoir plus
        </Link>
      </p>
      <button
        type="button"
        onClick={fermer}
        className="rounded-full bg-vovinam px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgb(24_81_217/0.3)]"
      >
        J&apos;ai compris
      </button>
    </div>
  );
}
