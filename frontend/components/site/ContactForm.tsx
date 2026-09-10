"use client";

import { useState } from "react";

const motifs = ["Cours d'essai", "Inscription", "Horaires", "Autre"];
const champ =
  "h-13 rounded-field border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] px-4 text-base text-encre outline-none transition-colors focus:border-vovinam focus:ring-4 focus:ring-vovinam/10";

export default function ContactForm() {
  const [motif, setMotif] = useState(motifs[0]);
  const [envoye, setEnvoye] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setEnvoye(true);
      }}
      className="min-w-[320px] flex-[1.3_1_460px] rounded-3xl border border-[#e8edf8] bg-white p-8 shadow-[0_14px_40px_rgb(16_24_40/0.08)] lg:p-11"
    >
      <span className="mb-4 inline-flex items-center gap-2.5 text-[11px] font-bold tracking-[0.2em] text-vovinam uppercase">
        <span className="h-0.5 w-6 bg-rouge" />
        Formulaire
      </span>
      <h2 className="mb-2.5 font-display text-2xl leading-tight font-extrabold tracking-tight text-encre lg:text-4xl">
        Envoyer un message
      </h2>
      <p className="mb-7 text-[1.02rem] leading-relaxed text-encre-50">
        Tous les champs marqués d'un astérisque sont obligatoires.
      </p>

      <div className="flex flex-col gap-4.5">
        <div className="flex flex-wrap gap-4.5">
          <label className="flex min-w-[200px] flex-1 flex-col gap-2">
            <span className="text-[0.88rem] font-semibold text-encre-70">
              Prénom *
            </span>
            <input
              required
              type="text"
              placeholder="Votre prénom"
              className={champ}
            />
          </label>
          <label className="flex min-w-[200px] flex-1 flex-col gap-2">
            <span className="text-[0.88rem] font-semibold text-encre-70">
              Nom *
            </span>
            <input
              required
              type="text"
              placeholder="Votre nom"
              className={champ}
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-4.5">
          <label className="flex min-w-[200px] flex-1 flex-col gap-2">
            <span className="text-[0.88rem] font-semibold text-encre-70">
              Email *
            </span>
            <input
              required
              type="email"
              placeholder="vous@email.fr"
              className={champ}
            />
          </label>
          <label className="flex min-w-[200px] flex-1 flex-col gap-2">
            <span className="text-[0.88rem] font-semibold text-encre-70">
              Téléphone
            </span>
            <input type="tel" placeholder="06 00 00 00 00" className={champ} />
          </label>
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="text-[0.88rem] font-semibold text-encre-70">
            Votre demande *
          </span>
          <div className="flex flex-wrap gap-2.5">
            {motifs.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMotif(m)}
                className={[
                  "cursor-pointer rounded-full border-[1.5px] px-4.5 py-3.5 text-[0.92rem] font-semibold transition-all duration-200",
                  motif === m
                    ? "border-vovinam bg-vovinam text-white"
                    : "border-[#e1e7f5] bg-white text-encre-70",
                ].join(" ")}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-[0.88rem] font-semibold text-encre-70">
            Message *
          </span>
          <textarea
            required
            rows={6}
            placeholder="Décrivez votre demande en quelques lignes…"
            className="resize-y rounded-field border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] p-4 text-base leading-relaxed text-encre outline-none focus:border-vovinam focus:ring-4 focus:ring-vovinam/10"
          />
        </label>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            required
            type="checkbox"
            className="mt-0.5 size-5 flex-none accent-vovinam"
          />
          <span className="text-[0.92rem] leading-relaxed text-[#6a7392]">
            J'accepte que mes données soient utilisées pour traiter ma demande,
            conformément à la politique de confidentialité.
          </span>
        </label>

        <div className="mt-1.5 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            className="cursor-pointer rounded-full bg-vovinam px-8 py-4.5 text-base font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgb(24_81_217/0.3)]"
          >
            Envoyer le message
          </button>
          {envoye ? (
            <span className="inline-flex items-center gap-2.5 rounded-field border border-[#c6ebd3] bg-[#e9f8ee] px-4 py-3.5 text-[0.95rem] font-semibold text-[#0e7a3c]">
              <span className="size-1.5 rounded-full bg-[#0e7a3c]" />
              Message envoyé — nous revenons vers vous rapidement.
            </span>
          ) : null}
        </div>
      </div>
    </form>
  );
}
