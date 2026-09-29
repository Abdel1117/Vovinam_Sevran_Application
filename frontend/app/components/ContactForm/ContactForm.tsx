"use client";

import { useState } from "react";
import { coursEssai, type CoursEssai } from "@/lib/data";
import { DemandeApiError, envoyerDemandeEssai } from "@/lib/api/demandesEssai";
import {
  estEmailValide,
  estTelephoneValide,
  longueurMax,
  requis,
} from "@/lib/validation";

export const MOTIF_ESSAI = "Cours d'essai";
const motifs = [MOTIF_ESSAI, "Inscription", "Horaires", "Autre"];
const MESSAGE_MAX = 1000;
const REGEX_NOM = /^\p{L}+(?:[ '’-]\p{L}+)*$/u;

const champ =
  "h-13 rounded-field border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] px-4 text-base text-encre outline-none transition-colors focus:border-vovinam focus:ring-4 focus:ring-vovinam/10";

type Valeurs = {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  message: string;
  cours: CoursEssai | "";
  consentement: boolean;
  siteWeb: string;
};

const valeursVides: Valeurs = {
  prenom: "",
  nom: "",
  email: "",
  telephone: "",
  message: "",
  cours: "",
  consentement: false,
  siteWeb: "",
};

type Erreurs = Partial<Record<keyof Valeurs, string>>;

function validerNom(valeur: string, champ: string): string | undefined {
  const nom = valeur.trim().replace(/\s+/g, " ");
  return (
    requis(nom, `Le ${champ} est requis.`) ??
    (nom.length > 60 || !REGEX_NOM.test(nom)
      ? `Le ${champ} n'est pas valide.`
      : undefined)
  );
}

function valider(v: Valeurs, estEssai: boolean): Erreurs {
  const erreurs: Erreurs = {
    prenom: validerNom(v.prenom, "prénom"),
    nom: validerNom(v.nom, "nom"),
    email: requis(v.email, "L'email est requis.") ?? estEmailValide(v.email),
    telephone: v.telephone.trim() ? estTelephoneValide(v.telephone) : undefined,
    cours:
      estEssai && !v.cours
        ? "Choisissez le cours qui vous intéresse."
        : undefined,
    message: estEssai
      ? longueurMax(v.message.trim(), MESSAGE_MAX)
      : (requis(v.message, "Le message est requis.") ??
        longueurMax(v.message.trim(), MESSAGE_MAX)),
    consentement: v.consentement
      ? undefined
      : "Votre accord est nécessaire pour traiter la demande.",
  };
  Object.keys(erreurs).forEach((k) => {
    if (erreurs[k as keyof Erreurs] === undefined)
      delete erreurs[k as keyof Erreurs];
  });
  return erreurs;
}

function Erreur({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <span className="text-[0.82rem] font-semibold text-rouge">{message}</span>
  );
}

function avecErreur(base: string, enErreur: boolean): string {
  return enErreur ? `${base} border-rouge` : base;
}

export default function ContactForm({
  motifInitial = motifs[0],
}: {
  motifInitial?: string;
}) {
  const [motif, setMotif] = useState(
    motifs.includes(motifInitial) ? motifInitial : motifs[0],
  );
  const [valeurs, setValeurs] = useState<Valeurs>(valeursVides);
  const [erreurs, setErreurs] = useState<Erreurs>({});
  const [envoi, setEnvoi] = useState(false);
  const [erreurEnvoi, setErreurEnvoi] = useState<string | null>(null);
  const [envoye, setEnvoye] = useState(false);
  const estEssai = motif === MOTIF_ESSAI;

  function set<K extends keyof Valeurs>(champ: K, valeur: Valeurs[K]) {
    setValeurs((v) => ({ ...v, [champ]: valeur }));
    setErreurs((e) => (e[champ] ? { ...e, [champ]: undefined } : e));
    setEnvoye(false);
  }

  async function surEnvoi(e: React.FormEvent) {
    e.preventDefault();
    const nouvellesErreurs = valider(valeurs, estEssai);
    setErreurs(nouvellesErreurs);
    if (Object.keys(nouvellesErreurs).length > 0) return;

    setErreurEnvoi(null);
    if (!estEssai) {
      // Seules les demandes de cours d'essai sont transmises au club pour l'instant.
      setEnvoye(true);
      return;
    }
    setEnvoi(true);
    try {
      await envoyerDemandeEssai({
        prenom: valeurs.prenom.trim().replace(/\s+/g, " "),
        nom: valeurs.nom.trim().replace(/\s+/g, " "),
        email: valeurs.email.trim(),
        telephone: valeurs.telephone,
        cours: valeurs.cours as CoursEssai,
        message: valeurs.message,
        consentement: valeurs.consentement,
        site_web: valeurs.siteWeb,
      });
      setValeurs(valeursVides);
      setEnvoye(true);
    } catch (err) {
      setErreurEnvoi(
        err instanceof DemandeApiError
          ? err.message
          : "L'envoi a échoué, réessayez dans un instant.",
      );
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <form
      noValidate
      onSubmit={surEnvoi}
      className="min-w-[320px] flex-[1.3_1_460px] rounded-3xl border border-[#e8edf8] bg-white p-8 shadow-[0_14px_40px_rgb(16_24_40/0.08)] lg:p-11"
    >
      <span className="mb-4 inline-flex items-center gap-2.5 text-[11px] font-bold tracking-[0.2em] text-vovinam uppercase">
        <span className="h-0.5 w-6 bg-rouge" />
        Formulaire
      </span>
      <h2 className="mb-2.5 font-display text-2xl leading-tight font-extrabold tracking-tight text-encre lg:text-4xl">
        {estEssai ? "Réserver un cours d'essai" : "Envoyer un message"}
      </h2>
      <p className="mb-7 text-[1.02rem] leading-relaxed text-encre-50">
        Tous les champs marqués d&apos;un astérisque sont obligatoires.
      </p>

      <div className="flex flex-col gap-4.5">
        <div className="flex flex-col gap-2.5">
          <span className="text-[0.88rem] font-semibold text-encre-70">
            Votre demande *
          </span>
          <div className="flex flex-wrap gap-2.5">
            {motifs.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMotif(m);
                  setEnvoye(false);
                }}
                aria-pressed={motif === m}
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

        {estEssai ? (
          <div className="flex flex-col gap-2.5">
            <span className="text-[0.88rem] font-semibold text-encre-70">
              Cours souhaité *
            </span>
            <div className="flex flex-wrap gap-2.5">
              {(Object.entries(coursEssai) as [CoursEssai, string][]).map(
                ([valeur, label]) => (
                  <button
                    key={valeur}
                    type="button"
                    onClick={() => set("cours", valeur)}
                    aria-pressed={valeurs.cours === valeur}
                    className={[
                      "cursor-pointer rounded-full border-[1.5px] px-4.5 py-3.5 text-[0.92rem] font-semibold transition-all duration-200",
                      valeurs.cours === valeur
                        ? "border-vovinam bg-vovinam text-white"
                        : erreurs.cours
                          ? "border-rouge bg-white text-encre-70"
                          : "border-[#e1e7f5] bg-white text-encre-70",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                ),
              )}
            </div>
            <Erreur message={erreurs.cours} />
          </div>
        ) : null}

        <div className="flex flex-wrap gap-4.5">
          <label className="flex min-w-[200px] flex-1 flex-col gap-2">
            <span className="text-[0.88rem] font-semibold text-encre-70">
              Prénom *
            </span>
            <input
              type="text"
              autoComplete="given-name"
              value={valeurs.prenom}
              onChange={(e) => set("prenom", e.target.value)}
              placeholder="Votre prénom"
              className={avecErreur(champ, Boolean(erreurs.prenom))}
            />
            <Erreur message={erreurs.prenom} />
          </label>
          <label className="flex min-w-[200px] flex-1 flex-col gap-2">
            <span className="text-[0.88rem] font-semibold text-encre-70">
              Nom *
            </span>
            <input
              type="text"
              autoComplete="family-name"
              value={valeurs.nom}
              onChange={(e) => set("nom", e.target.value)}
              placeholder="Votre nom"
              className={avecErreur(champ, Boolean(erreurs.nom))}
            />
            <Erreur message={erreurs.nom} />
          </label>
        </div>
        <div className="flex flex-wrap gap-4.5">
          <label className="flex min-w-[200px] flex-1 flex-col gap-2">
            <span className="text-[0.88rem] font-semibold text-encre-70">
              Email *
            </span>
            <input
              type="email"
              autoComplete="email"
              value={valeurs.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="vous@email.fr"
              className={avecErreur(champ, Boolean(erreurs.email))}
            />
            <Erreur message={erreurs.email} />
          </label>
          <label className="flex min-w-[200px] flex-1 flex-col gap-2">
            <span className="text-[0.88rem] font-semibold text-encre-70">
              Téléphone{estEssai ? " (conseillé pour vous rappeler)" : ""}
            </span>
            <input
              type="tel"
              autoComplete="tel"
              value={valeurs.telephone}
              onChange={(e) => set("telephone", e.target.value)}
              placeholder="06 00 00 00 00"
              className={avecErreur(champ, Boolean(erreurs.telephone))}
            />
            <Erreur message={erreurs.telephone} />
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-[0.88rem] font-semibold text-encre-70">
            Message
            {estEssai ? " (âge de l'enfant, disponibilités, questions…)" : " *"}
          </span>
          <textarea
            rows={6}
            maxLength={MESSAGE_MAX}
            value={valeurs.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder={
              estEssai
                ? "Par exemple : ma fille a 9 ans, elle n'a jamais pratiqué d'art martial."
                : "Décrivez votre demande en quelques lignes…"
            }
            className={avecErreur(
              "resize-y rounded-field border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] p-4 text-base leading-relaxed text-encre outline-none focus:border-vovinam focus:ring-4 focus:ring-vovinam/10",
              Boolean(erreurs.message),
            )}
          />
          <Erreur message={erreurs.message} />
        </label>

        {/* Piège à robots : invisible et ignoré par les humains. */}
        <input
          type="text"
          name="site_web"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={valeurs.siteWeb}
          onChange={(e) => set("siteWeb", e.target.value)}
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />

        <div className="flex flex-col gap-1.5">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={valeurs.consentement}
              onChange={(e) => set("consentement", e.target.checked)}
              className="mt-0.5 size-5 flex-none accent-vovinam"
            />
            <span className="text-[0.92rem] leading-relaxed text-[#6a7392]">
              J&apos;accepte que mes données soient utilisées pour traiter ma
              demande, conformément à la politique de confidentialité.
            </span>
          </label>
          <Erreur message={erreurs.consentement} />
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={envoi}
            className="cursor-pointer rounded-full bg-vovinam px-8 py-4.5 text-base font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgb(24_81_217/0.3)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {envoi
              ? "Envoi…"
              : estEssai
                ? "Demander mon cours d'essai"
                : "Envoyer le message"}
          </button>
          {envoye ? (
            <span
              role="status"
              className="inline-flex items-center gap-2.5 rounded-field border border-[#c6ebd3] bg-[#e9f8ee] px-4 py-3.5 text-[0.95rem] font-semibold text-[#0e7a3c]"
            >
              <span className="size-1.5 rounded-full bg-[#0e7a3c]" />
              {estEssai
                ? "Demande envoyée — nous vous recontactons pour fixer la date."
                : "Message envoyé — nous revenons vers vous rapidement."}
            </span>
          ) : null}
          {erreurEnvoi ? (
            <span
              role="alert"
              className="text-[0.92rem] font-semibold text-rouge"
            >
              {erreurEnvoi}
            </span>
          ) : null}
        </div>
      </div>
    </form>
  );
}
