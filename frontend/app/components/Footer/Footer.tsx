import Link from "next/link";
import SocialLinks from "@/components/Social/Social";
import type { NavItem } from "@/lib/data";
import { getCurrentYear } from "../../utils/Date/Date";

const liens: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Actualités", href: "/actualites" },
  { label: "Galerie", href: "/galerie" },
  { label: "Contact", href: "/contact" },
  { label: "Connexion", href: "/connexion" },
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
                <span className="font-display text-[15px] font-extrabold tracking-wide">
                  VOVINAM VIET VO DAO
                </span>
                <span className="text-xs text-white/60">
                  Association sportive — Sevran
                </span>
              </span>
            </div>
            <p className="max-w-[340px] text-[0.96rem] leading-relaxed text-white/65">
              Association affiliée à la fédération, ouverte aux enfants,
              adolescents et adultes de tous niveaux.
            </p>
            <SocialLinks />
          </div>

          <div className="flex min-w-[160px] flex-1 flex-col gap-3.5">
            <span className="text-[11px] font-bold tracking-[0.18em] text-jaune uppercase">
              Navigation
            </span>
            {liens.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[0.96rem] text-white/75 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex min-w-[210px] flex-1 flex-col gap-3.5">
            <span className="text-[11px] font-bold tracking-[0.18em] text-jaune uppercase">
              Contact
            </span>
            <span className="text-[0.96rem] leading-relaxed text-white/75">
              Gymnase Gaston bussière
              <br />
              34 Rue Gabriel Péri
              <br />
              93270 Sevran
            </span>
            <a
              href="mailto:contact@vovinam-association.fr"
              className="text-[0.96rem] text-white/75 hover:text-white"
            >
              contact@vovinam-sevran.fr
            </a>
            <a
              href="tel:+33100000000"
              className="text-[0.96rem] text-white/75 hover:text-white"
            >
              01 00 00 00 00
            </a>
          </div>

          <div className="flex min-w-[210px] flex-1 flex-col gap-3.5">
            <span className="text-[11px] font-bold tracking-[0.18em] text-jaune uppercase">
              Horaires
            </span>
            <span className="text-[0.96rem] leading-[1.7] text-white/75">
              Lundi 19:00 — 22:25
              <br />
              Vendredi 19:00 — 22:25
              <br />
              Samedi 14:30 — 16:00
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t border-white/10 py-6">
          <span className="text-[11px] font-semibold tracking-[0.16em] text-white/50 uppercase">
            Partenaires &amp; fédération
          </span>
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
          <span className="text-sm text-white/50">
            © {getCurrentYear()} Association Vovinam Viet Vo Dao. Tous droits
            réservés.
          </span>
          <div className="flex flex-wrap gap-6">
            <Link
              href="/mentions-legales"
              className="text-sm text-white/50 hover:text-white"
            >
              Mentions légales
            </Link>
            <Link
              href="/politique-de-confidentialité"
              className="text-sm text-white/50 hover:text-white"
            >
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
