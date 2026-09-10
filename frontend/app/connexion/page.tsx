import Link from "next/link";
import type { Metadata } from "next";
import LoginForm from "@/components/site/LoginForm";

export const metadata: Metadata = {
  title: "Connexion — Espace membre Vovinam",
};

const avantages: string[] = [
  "Vos documents et attestations",
  "Inscriptions aux stages et compétitions",
  "Convocations et informations du club",
];

export default function Page() {
  return (
    <div className="flex min-h-screen flex-wrap bg-vovinam-050">
      <div className="relative flex min-h-80 min-w-[320px] flex-[1_1_480px] flex-col justify-between overflow-hidden bg-hero-vovinam p-9 lg:p-14">
        <span className="absolute inset-x-0 top-0 flex h-1">
          <span className="flex-1 bg-vovinam" />
          <span className="w-27 bg-jaune" />
          <span className="w-14 bg-rouge" />
        </span>
        <span className="absolute -top-17 -right-17 size-75 rounded-full border-2 border-white/10" />
        <span className="absolute -bottom-25 -left-12 size-60 rounded-full border-2 border-white/10" />

        <Link href="/" className="relative flex items-center gap-3 self-start">
          <span className="flex size-11 items-center justify-center rounded-xl border border-white/25 bg-white/15 font-display text-lg font-extrabold text-jaune">
            VV
          </span>
          <span className="flex flex-col leading-tight text-white">
            <span className="font-display text-[15px] font-extrabold tracking-wide">
              VOVINAM
            </span>
            <span className="text-[10px] font-medium tracking-[0.18em] opacity-70">
              VIET VO DAO
            </span>
          </span>
        </Link>

        <div className="relative flex max-w-[460px] flex-col gap-5 py-10">
          <span className="inline-flex self-start items-center gap-2.5 rounded-full border border-white/30 bg-white/15 px-4 py-2.5 text-xs font-semibold tracking-[0.16em] text-white uppercase">
            <span className="size-1.5 rounded-full bg-jaune" />
            Espace membre
          </span>
          <h1 className="font-display text-4xl leading-[1.03] font-extrabold tracking-[-0.03em] text-balance text-white lg:text-5xl">
            VOTRE ESPACE
            <br />
            <span className="text-jaune">ADHÉRENT.</span>
          </h1>
          <p className="text-lg leading-relaxed text-pretty text-white/85">
            Documents d'inscription, convocations, inscriptions aux stages et
            suivi de vos passages de grades, réunis en un seul endroit.
          </p>
          <div className="mt-2 flex flex-col gap-2.5">
            {avantages.map((a) => (
              <span
                key={a}
                className="inline-flex items-center gap-3 text-[0.98rem] font-medium text-white/90"
              >
                <span className="size-1.5 flex-none rounded-sm bg-jaune" />
                {a}
              </span>
            ))}
          </div>
        </div>

        <span className="relative text-[0.85rem] text-white/55">
          Association Vovinam Viet Vo Dao — Vitry-sur-Seine
        </span>
      </div>

      <div className="flex min-w-[320px] flex-[1_1_460px] items-center justify-center px-2 md:px-6 py-12 lg:px-12 lg:py-18">
        <LoginForm />
      </div>
    </div>
  );
}
