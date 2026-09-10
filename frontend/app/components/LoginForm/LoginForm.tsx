"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginForm() {
  const [visible, setVisible] = useState(false);
  const [connecte, setConnecte] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setConnecte(true);
      }}
      className="w-full max-w-[440px] rounded-3xl border border-[#e8edf8] bg-white p-8 shadow-[0_18px_50px_rgb(16_24_40/0.09)] lg:p-11"
    >
      <span className="mb-4 inline-flex items-center gap-2.5 text-[11px] font-bold tracking-[0.2em] text-vovinam uppercase">
        <span className="h-0.5 w-6 bg-rouge" />
        Connexion
      </span>
      <h2 className="mb-2 font-display text-2xl leading-tight font-extrabold tracking-[-0.025em] text-encre lg:text-3xl">
        Bon retour au dojo
      </h2>
      <p className="mb-7 leading-relaxed text-encre-50">Connectez-vous avec l'email transmis lors de votre inscription.</p>

      <div className="flex flex-col gap-4.5">
        <label className="flex flex-col gap-2">
          <span className="text-[0.88rem] font-semibold text-encre-70">Email</span>
          <input
            required
            type="email"
            placeholder="vous@email.fr"
            className="h-13.5 rounded-field border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] px-4 text-base text-encre outline-none focus:border-vovinam focus:ring-4 focus:ring-vovinam/10"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="flex items-baseline justify-between gap-3">
            <span className="text-[0.88rem] font-semibold text-encre-70">Mot de passe</span>
            <Link href="#" className="text-[0.84rem] font-semibold text-vovinam">
              Mot de passe oublié ?
            </Link>
          </span>
          <span className="relative flex items-center">
            <input
              required
              type={visible ? "text" : "password"}
              placeholder="••••••••"
              className="h-13.5 w-full rounded-field border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] pr-24 pl-4 text-base text-encre outline-none focus:border-vovinam focus:ring-4 focus:ring-vovinam/10"
            />
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="absolute right-2 cursor-pointer rounded-lg bg-vovinam-100 px-3.5 py-2.5 text-[0.82rem] font-semibold text-vovinam"
            >
              {visible ? "Masquer" : "Afficher"}
            </button>
          </span>
        </label>

        <label className="flex cursor-pointer items-center gap-3">
          <input type="checkbox" className="size-4.5 flex-none accent-vovinam" />
          <span className="text-[0.94rem] text-encre-50">Se souvenir de moi sur cet appareil</span>
        </label>

        <button
          type="submit"
          className="w-full cursor-pointer rounded-full bg-vovinam px-6 py-4.5 text-base font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgb(24_81_217/0.3)]"
        >
          Se connecter
        </button>

        {connecte ? (
          <span className="flex items-center gap-2.5 rounded-field border border-[#c6ebd3] bg-[#e9f8ee] px-4 py-3.5 text-[0.93rem] font-semibold text-[#0e7a3c]">
            <span className="size-1.5 flex-none rounded-full bg-[#0e7a3c]" />
            Connexion réussie — redirection vers votre espace.
          </span>
        ) : null}

        <span className="my-0.5 flex items-center gap-3.5">
          <span className="h-px flex-1 bg-trait" />
          <span className="text-[0.78rem] font-semibold tracking-[0.14em] text-encre-30 uppercase">ou</span>
          <span className="h-px flex-1 bg-trait" />
        </span>

        <Link
          href="/contact"
          className="w-full rounded-full border-[1.5px] border-[#dce4f7] px-6 py-4 text-center text-[15px] font-bold text-vovinam transition-colors hover:border-vovinam hover:bg-vovinam-050"
        >
          Demander un accès
        </Link>

        <p className="mt-2 text-center text-[0.93rem] leading-relaxed text-[#6a7392]">
          Pas encore adhérent ?{" "}
          <Link href="/contact" className="font-semibold">
            Faites un cours d'essai
          </Link>
        </p>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[#eff3fb] pt-5.5">
        <Link href="/" className="inline-flex items-center gap-2 text-[0.88rem] font-semibold text-[#6a7392] hover:text-vovinam">
          ← Retour au site
        </Link>
        <Link href="#" className="text-[0.84rem] text-encre-30 hover:text-vovinam">
          Politique de confidentialité
        </Link>
      </div>
    </form>
  );
}
