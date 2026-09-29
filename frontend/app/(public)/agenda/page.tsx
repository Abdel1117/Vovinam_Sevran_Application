import type { Metadata } from "next";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import EvenementItem from "@/components/EvenementItem/EvenementItem";
import {
  listEvenementsAVenir,
  parseDateIso,
  type EvenementPublic,
} from "@/lib/api/evenements";

export const metadata: Metadata = { title: "Agenda — Vovinam Viet Vo Dao" };

/** Regroupe les événements (déjà triés par date) par mois de début. */
function parMois(
  evenements: EvenementPublic[],
): { mois: string; evenements: EvenementPublic[] }[] {
  const groupes: { mois: string; evenements: EvenementPublic[] }[] = [];
  for (const e of evenements) {
    const mois = format(parseDateIso(e.date_debut), "MMMM yyyy", {
      locale: fr,
    });
    const dernier = groupes.at(-1);
    if (dernier?.mois === mois) dernier.evenements.push(e);
    else groupes.push({ mois, evenements: [e] });
  }
  return groupes;
}

export default async function Page() {
  let evenements: EvenementPublic[] = [];
  let erreur = false;
  try {
    evenements = await listEvenementsAVenir();
  } catch {
    erreur = true;
  }

  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden bg-hero-vovinam px-7 pt-40 pb-16">
          <div className="mx-auto flex max-w-[1360px] flex-col gap-4">
            <span className="inline-flex items-center gap-2.5 self-start rounded-full border border-white/30 bg-white/15 px-4 py-2.5 text-xs font-semibold tracking-[0.16em] text-white uppercase">
              <span className="size-1.5 rounded-full bg-jaune" />
              Agenda
            </span>
            <h1 className="font-display text-4xl leading-[1.02] font-extrabold tracking-[-0.03em] text-balance text-white lg:text-6xl">
              LES PROCHAINS
              <br />
              <span className="text-jaune">RENDEZ-VOUS.</span>
            </h1>
            <p className="max-w-[560px] text-lg leading-relaxed text-pretty text-white/85">
              Stages, compétitions, passages de grades et démonstrations :
              ajoutez-les à votre calendrier en un clic.
            </p>
          </div>
        </section>

        <section className="bg-vovinam-050 py-16 lg:py-24">
          <div className="mx-auto flex max-w-[1360px] flex-col gap-12 px-2 md:px-7">
            {parMois(evenements).map((groupe) => (
              <div key={groupe.mois} className="flex flex-col gap-4">
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-encre capitalize">
                  {groupe.mois}
                </h2>
                {groupe.evenements.map((e, i) => (
                  <EvenementItem key={e.id} evenement={e} delay={i * 60} />
                ))}
              </div>
            ))}

            {evenements.length === 0 ? (
              <div className="flex flex-col items-center gap-2.5 px-6 py-10 text-center">
                <span className="font-display text-xl font-extrabold text-encre">
                  {erreur
                    ? "L'agenda est indisponible"
                    : "Aucun événement prévu pour le moment"}
                </span>
                <span className="text-encre-50">
                  {erreur
                    ? "Réessayez dans quelques instants."
                    : "Revenez bientôt pour découvrir les prochains rendez-vous du club."}
                </span>
              </div>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
