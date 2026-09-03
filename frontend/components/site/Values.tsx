import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import { valeurs } from "@/lib/data";

const formes: string[] = [
  "size-4.5 rounded-full border-[2.5px] border-vovinam",
  "size-4.5 rounded bg-vovinam",
  "size-4.5 rotate-45 bg-vovinam",
  "size-0 border-x-[9px] border-x-transparent border-b-[16px] border-b-vovinam",
];

export default function Values() {
  return (
    <section id="valeurs" className="bg-white py-20 lg:py-30">
      <div className="mx-auto max-w-[1360px] px-7">
        <SectionTitle
          label="Nos valeurs"
          titre="Bien plus qu'un sport"
          texte="Des valeurs que nous transmettons sur le tatami comme dans la vie quotidienne."
          accent="bg-jaune"
        />
        <div className="flex flex-wrap gap-5">
          {valeurs.map((v, i) => (
            <Reveal
              key={v.titre}
              delay={i * 70}
              className="flex min-w-[240px] flex-1 flex-col gap-3.5 rounded-3xl border border-trait bg-white px-7 pt-8 pb-9 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
            >
              <span className="flex size-11.5 items-center justify-center rounded-2xl bg-vovinam-100">
                <span className={formes[i]} />
              </span>
              <h3 className="font-display text-xl font-extrabold text-encre">{v.titre}</h3>
              <p className="leading-relaxed text-encre-50">{v.texte}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
