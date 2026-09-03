import Link from "next/link";
import SocialLinks from "@/components/ui/Social";
import type { NavItem } from "@/lib/data";

const liens: NavItem[] = [
  { label: "Le Vovinam", href: "/#vovinam" },
  { label: "L'association", href: "/#valeurs" },
  { label: "Cours", href: "/#cours" },
  { label: "Actualités", href: "/actualites" },
  { label: "Agenda", href: "/#agenda" },
  { label: "Galerie", href: "/galerie" },
  { label: "Contact", href: "/contact" },
  { label: "Espace membre", href: "/connexion" },
];

export default function Footer() {
  return (
    <footer id="footer" className="bg-vovinam-900 pt-14 text-white sm:pt-20">
      <div className="mx-auto max-w-[1360px] px-7">
        <div className="flex flex-wrap gap-8 pb-12 lg:gap-14">
          <div className="flex min-w-[280px] flex-1 flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-[42px] items-center justify-center rounded-xl bg-vovinam font-display text-[17px] font-extrabold text-jaune">
                VV
              </span>
              <span className="flex flex-col leading-tight">
                <span className="font-display text-[15px] font-extrabold tracking-wide">VOVINAM VIET VO DAO</span>
                <span className="text-xs text-white/60">Association sportive — Vitry-sur-Seine</span>
              </span>
            </div>
            <p className="max-w-[340px] text-[0.96rem] leading-relaxed text-white/65">
              Association affiliée à la fédération, ouverte aux enfants, adolescents et adultes de tous niveaux.
            </p>
            <SocialLinks />
          </div>

          <div className="flex min-w-[160px] flex-1 flex-col gap-3.5">
            <span className="text-[11px] font-bold tracking-[0.18em] text-jaune uppercase">Navigation</span>
            {liens.map((l) => (
              <Link key={l.label} href={l.href} className="text-[0.96rem] text-white/75 hover:text-white">
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex min-w-[210px] flex-1 flex-col gap-3.5">
            <span className="text-[11px] font-bold tracking-[0.18em] text-jaune uppercase">Contact</span>
            <span className="text-[0.96rem] leading-relaxed text-white/75">
              Gymnase Jean-Moulin
              <br />
              12 rue des Sports
              <br />
              94400 Vitry-sur-Seine
            </span>
            <a href="mailto:contact@vovinam-association.fr" className="text-[0.96rem] text-white/75 hover:text-white">
              contact@vovinam-association.fr
            </a>
            <a href="tel:+33100000000" className="text-[0.96rem] text-white/75 hover:text-white">
              01 00 00 00 00
            </a>
          </div>

          <div className="flex min-w-[210px] flex-1 flex-col gap-3.5">
            <span className="text-[11px] font-bold tracking-[0.18em] text-jaune uppercase">Horaires</span>
            <span className="text-[0.96rem] leading-[1.7] text-white/75">
              Lundi 20:00 — 21:45
              <br />
              Mardi 18:00 — 19:30
              <br />
              Mercredi 14:00 — 15:00
              <br />
              Jeudi 20:00 — 21:45
              <br />
              Vendredi 18:00 — 19:30
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t border-white/10 py-6">
          <span className="text-[11px] font-semibold tracking-[0.16em] text-white/50 uppercase">Partenaires &amp; fédération</span>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="flex h-10 max-w-[150px] flex-1 items-center justify-center rounded-lg border border-dashed border-white/20 font-mono text-[9px] tracking-[0.1em] text-white/45 uppercase"
            >
              logo
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-6">
          <span className="text-sm text-white/50">© 2026 Association Vovinam Viet Vo Dao. Tous droits réservés.</span>
          <div className="flex flex-wrap gap-6">
            <a href="#" className="text-sm text-white/50 hover:text-white">
              Mentions légales
            </a>
            <a href="#" className="text-sm text-white/50 hover:text-white">
              Politique de confidentialité
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
