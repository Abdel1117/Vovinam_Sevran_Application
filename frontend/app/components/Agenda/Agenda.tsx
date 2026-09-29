import Link from "next/link";
import EvenementItem from "@/components/EvenementItem/EvenementItem";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { listEvenementsAVenir } from "@/lib/api/evenements";

const NOMBRE_EVENEMENTS = 4;

export default async function Agenda() {
  const evenements = await listEvenementsAVenir(NOMBRE_EVENEMENTS).catch(
    () => [],
  );

  return (
    <section id="agenda" className="bg-vovinam-050 py-20 lg:py-30">
      <div className="mx-auto max-w-[1360px] px-2 md:px-7">
        <SectionTitle
          label="Agenda"
          titre="Prochains événements"
          accent="bg-jaune"
        >
          <Link
            href="/agenda"
            className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#dce4f7] bg-white px-5 py-3.5 text-sm font-bold text-vovinam transition-colors hover:border-vovinam"
          >
            Tout l&apos;agenda →
          </Link>
        </SectionTitle>

        {evenements.length === 0 ? (
          <p className="rounded-3xl border border-[#e8edf8] bg-white px-6.5 py-8 text-center text-encre-50">
            Aucun événement prévu pour le moment. Revenez bientôt !
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {evenements.map((e, i) => (
              <EvenementItem key={e.id} evenement={e} delay={i * 60} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
