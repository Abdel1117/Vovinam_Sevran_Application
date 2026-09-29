"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Topbar from "@/components/Topbar/Topbar";
import { useMenu } from "@/components/AdminShell/menu-context";
import {
  coursEssai,
  statutsDemande,
  type CoursEssai,
  type StatutDemande,
} from "@/lib/data";
import type { DemandeEssai } from "@/lib/api/demandesEssai";
import {
  MESSAGE_MAX,
  NOTE_MAX,
  type DemandeFormValues,
} from "@/hooks/useDemandeForm";

const carte = "rounded-card border border-trait bg-white shadow-card";
const champ =
  "h-12.5 rounded-field border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] px-4 text-[0.98rem] text-encre outline-none focus:border-vovinam focus:ring-4 focus:ring-vovinam/10";
const zoneTexte =
  "resize-y rounded-field border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] p-4 text-base leading-relaxed text-encre outline-none focus:border-vovinam focus:ring-4 focus:ring-vovinam/10";
const label = "text-[0.88rem] font-semibold text-encre-70";
const puce =
  "cursor-pointer rounded-full border-[1.5px] px-3.5 py-2.5 text-[0.84rem] font-semibold transition-all";

function withError(base: string, onError: boolean): string {
  return onError ? `${base} border-rouge` : base;
}

function Error({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <span className="text-[0.82rem] font-semibold text-rouge">{message}</span>
  );
}

type DemandeFormProps = {
  mode: "create" | "edit";
  demande: DemandeEssai | null;
  values: DemandeFormValues;
  setField: <K extends keyof DemandeFormValues>(
    field: K,
    value: DemandeFormValues[K],
  ) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  error: string | null;
  fieldErrors: Partial<Record<keyof DemandeFormValues, string>>;
};

export default function DemandeForm({
  mode,
  demande,
  values,
  setField,
  onSubmit,
  isSubmitting,
  error,
  fieldErrors,
}: DemandeFormProps) {
  const { open } = useMenu();
  const hasFieldErrors = Object.keys(fieldErrors).length > 0;
  const telephoneLien = values.telephone.replace(/[\s.-]/g, "");

  return (
    <>
      <Topbar
        surtitre="Cours d'essai"
        titre={
          mode === "create"
            ? "Nouvelle demande"
            : `${values.prenom} ${values.nom}`.trim() || "Demande"
        }
        onMenu={open}
        actions={
          <>
            {error || hasFieldErrors ? (
              <span className="hidden text-[0.84rem] font-semibold text-rouge sm:inline">
                {error ?? "Certains champs sont à corriger."}
              </span>
            ) : null}
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="inline-flex h-11.5 cursor-pointer items-center rounded-xl bg-vovinam px-5.5 text-[0.92rem] font-bold text-white transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Enregistrement…" : "Enregistrer"}
            </button>
          </>
        }
      />

      <div className="flex flex-wrap items-start gap-5.5 p-2 lg:p-8">
        <div className="flex min-w-[320px] flex-[2_1_560px] flex-col gap-5.5">
          <section
            className={["flex flex-col gap-4.5 p-3 lg:p-8", carte].join(" ")}
          >
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="mr-auto font-display text-lg font-extrabold text-encre">
                Suivi
              </h2>
              {demande ? (
                <span className="text-[0.84rem] text-encre-30">
                  Reçue le{" "}
                  {format(
                    new Date(demande.created_at),
                    "d MMMM yyyy 'à' HH:mm",
                    {
                      locale: fr,
                    },
                  )}
                </span>
              ) : null}
            </div>

            <div className="flex flex-col gap-2.5">
              <span className={label}>Statut</span>
              <div className="flex flex-wrap gap-2">
                {(
                  Object.entries(statutsDemande) as [
                    StatutDemande,
                    (typeof statutsDemande)[StatutDemande],
                  ][]
                ).map(([valeur, s]) => (
                  <button
                    key={valeur}
                    type="button"
                    onClick={() => setField("statut", valeur)}
                    aria-pressed={values.statut === valeur}
                    className={[
                      puce,
                      values.statut === valeur
                        ? "border-vovinam bg-vovinam text-white"
                        : "border-[#e1e7f5] bg-white text-encre-70",
                    ].join(" ")}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex max-w-[260px] flex-col gap-2">
              <span className={label}>
                Date du cours d&apos;essai
                {values.statut === "essai_planifie" ? "" : " (optionnelle)"}
              </span>
              <input
                type="date"
                value={values.date_essai}
                onChange={(e) => setField("date_essai", e.target.value)}
                className={withError(champ, Boolean(fieldErrors.date_essai))}
              />
              <Error message={fieldErrors.date_essai} />
            </label>

            <label className="flex flex-col gap-2">
              <span className={label}>
                Note interne{" "}
                <span className="font-normal text-encre-30">
                  (jamais visible par la personne)
                </span>
              </span>
              <textarea
                rows={4}
                value={values.note_interne}
                maxLength={NOTE_MAX}
                onChange={(e) => setField("note_interne", e.target.value)}
                placeholder="Rappelé le 30/09, vient lundi avec sa fille…"
                className={withError(
                  zoneTexte,
                  Boolean(fieldErrors.note_interne),
                )}
              />
              <Error message={fieldErrors.note_interne} />
            </label>
          </section>

          <section
            className={["flex flex-col gap-4.5 p-3 lg:p-8", carte].join(" ")}
          >
            <h2 className="font-display text-lg font-extrabold text-encre">
              Demande
            </h2>
            <div className="flex flex-wrap gap-4">
              <label className="flex min-w-[200px] flex-1 flex-col gap-2">
                <span className={label}>Prénom</span>
                <input
                  type="text"
                  value={values.prenom}
                  onChange={(e) => setField("prenom", e.target.value)}
                  className={withError(champ, Boolean(fieldErrors.prenom))}
                />
                <Error message={fieldErrors.prenom} />
              </label>
              <label className="flex min-w-[200px] flex-1 flex-col gap-2">
                <span className={label}>Nom</span>
                <input
                  type="text"
                  value={values.nom}
                  onChange={(e) => setField("nom", e.target.value)}
                  className={withError(champ, Boolean(fieldErrors.nom))}
                />
                <Error message={fieldErrors.nom} />
              </label>
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex min-w-[200px] flex-1 flex-col gap-2">
                <span className={label}>Email</span>
                <input
                  type="email"
                  value={values.email}
                  onChange={(e) => setField("email", e.target.value)}
                  className={withError(champ, Boolean(fieldErrors.email))}
                />
                <Error message={fieldErrors.email} />
              </label>
              <label className="flex min-w-[200px] flex-1 flex-col gap-2">
                <span className={label}>Téléphone</span>
                <input
                  type="tel"
                  value={values.telephone}
                  onChange={(e) => setField("telephone", e.target.value)}
                  placeholder="06 00 00 00 00"
                  className={withError(champ, Boolean(fieldErrors.telephone))}
                />
                <Error message={fieldErrors.telephone} />
              </label>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className={label}>Cours</span>
              <div className="flex flex-wrap gap-2">
                {(Object.entries(coursEssai) as [CoursEssai, string][]).map(
                  ([valeur, libelle]) => (
                    <button
                      key={valeur}
                      type="button"
                      onClick={() => setField("cours", valeur)}
                      aria-pressed={values.cours === valeur}
                      className={[
                        puce,
                        values.cours === valeur
                          ? "border-vovinam bg-vovinam text-white"
                          : "border-[#e1e7f5] bg-white text-encre-70",
                      ].join(" ")}
                    >
                      {libelle}
                    </button>
                  ),
                )}
              </div>
            </div>
            <label className="flex flex-col gap-2">
              <span className={label}>Message</span>
              <textarea
                rows={4}
                value={values.message}
                maxLength={MESSAGE_MAX}
                onChange={(e) => setField("message", e.target.value)}
                className={withError(zoneTexte, Boolean(fieldErrors.message))}
              />
              <Error message={fieldErrors.message} />
            </label>
          </section>
        </div>

        <section
          className={[
            "flex min-w-[280px] flex-1 flex-col gap-3 p-3 lg:p-8",
            carte,
          ].join(" ")}
        >
          <h2 className="font-display text-lg font-extrabold text-encre">
            Contacter
          </h2>
          {values.telephone ? (
            <a
              href={`tel:${telephoneLien}`}
              className="inline-flex h-11.5 items-center justify-center rounded-xl bg-vovinam px-5 text-[0.92rem] font-bold text-white transition-all hover:-translate-y-0.5"
            >
              Appeler le {values.telephone}
            </a>
          ) : (
            <span className="text-[0.88rem] text-encre-30">
              Pas de téléphone renseigné.
            </span>
          )}
          {values.email ? (
            <a
              href={`mailto:${values.email}?subject=${encodeURIComponent("Votre cours d'essai au Vovinam Sevran")}`}
              className="inline-flex h-11.5 items-center justify-center rounded-xl border-[1.5px] border-[#dce4f7] bg-white px-5 text-[0.92rem] font-bold text-vovinam transition-colors hover:border-vovinam"
            >
              Écrire un email
            </a>
          ) : null}
          <p className="mt-1 text-[0.84rem] leading-relaxed text-encre-30">
            Pensez à passer le statut à « Contacté » après l&apos;appel : la
            demande sortira du compteur « à traiter » du tableau de bord.
          </p>
        </section>
      </div>
    </>
  );
}
