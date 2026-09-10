"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Groupe = { titre: string; liens: { label: string; href: string }[] };

const groupes: Groupe[] = [
  {
    titre: "Pilotage",
    liens: [
      { label: "Tableau de bord", href: "/admin" },
      { label: "Actualités", href: "/admin/articles/nouveau" },
      { label: "Agenda", href: "/admin" },
    ],
  },
  {
    titre: "Communauté",
    liens: [
      { label: "Adhérents", href: "/admin/adherents" },
      { label: "Enseignants", href: "/admin" },
      { label: "Galerie", href: "/galerie" },
    ],
  },
];

export default function Sidebar({ ouvert, onClose }: { ouvert: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <aside
      className={[
        "z-50 flex w-67 flex-none flex-col overflow-y-auto bg-vovinam-900 text-white",
        "fixed inset-y-0 left-0 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
        ouvert ? "translate-x-0" : "-translate-x-full",
      ].join(" ")}
    >
      <div className="flex items-center gap-3 border-b border-white/10 px-5.5 py-6">
        <span className="flex size-10 items-center justify-center rounded-xl bg-vovinam font-display text-base font-extrabold text-jaune">
          VV
        </span>
        <span className="flex flex-col leading-tight">
          <span className="font-display text-sm font-extrabold tracking-wide">VOVINAM</span>
          <span className="text-[10px] font-medium tracking-[0.16em] text-white/55">ADMINISTRATION</span>
        </span>
      </div>

      <nav className="flex flex-col gap-1 px-3.5 py-4.5">
        {groupes.map((g) => (
          <div key={g.titre} className="flex flex-col gap-1">
            <span className="px-2.5 pt-4 pb-2 text-[10px] font-bold tracking-[0.18em] text-white/40 uppercase">{g.titre}</span>
            {g.liens.map((l) => {
              const actif = pathname === l.href;
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={onClose}
                  className={[
                    "rounded-xl px-3 py-3.5 text-sm transition-colors",
                    actif ? "bg-vovinam font-bold text-white" : "font-semibold text-white/70 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-3 px-3.5 pt-4.5 pb-5.5">
        <div className="rounded-2xl border border-white/15 bg-white/8 p-4.5">
          <span className="mb-2.5 block text-[11px] font-bold tracking-[0.14em] text-jaune uppercase">Saison 2026 / 2027</span>
          <span className="block text-[0.88rem] leading-relaxed text-white/70">Clôture des inscriptions le 30 septembre.</span>
        </div>
        <Link href="/" className="px-3 py-2.5 text-[0.9rem] font-semibold text-white/60 hover:text-white">
          ← Voir le site public
        </Link>
      </div>
    </aside>
  );
}
