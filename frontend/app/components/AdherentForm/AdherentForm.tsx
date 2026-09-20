"use client";

import Topbar from "@/components/Topbar/Topbar";
import { useMenu } from "@/components/AdminShell/menu-context";
import type { AdherentInput } from "@/lib/api/adherents";

const carte = "rounded-card border border-trait bg-white shadow-card";
const champ =
  "h-12.5 rounded-field border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] px-4 text-[0.98rem] text-encre outline-none focus:border-vovinam focus:ring-4 focus:ring-vovinam/10";
const label = "text-[0.88rem] font-semibold text-encre-70";

const categories: AdherentInput["categorie"][] = [
  "Enfants",
  "Adolescents",
  "Adultes",
];
const statuts: AdherentInput["statut"][] = ["À jour", "En attente"];
const certificats: AdherentInput["certificat"][] = ["Valide", "Manquant"];

type AdherentFormProps = {
  mode: "create" | "edit";
  values: AdherentInput;
  setField: <K extends keyof AdherentInput>(
    field: K,
    value: AdherentInput[K],
  ) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  error: string | null;
};

function Choix<T extends string>({
  options,
  valeur,
  onChange,
}: {
  options: T[];
  valeur: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={[
            "cursor-pointer rounded-full border-[1.5px] px-3.5 py-2.5 text-[0.84rem] font-semibold transition-all",
            valeur === o
              ? "border-vovinam bg-vovinam text-white"
              : "border-[#e1e7f5] bg-white text-encre-70",
          ].join(" ")}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export default function AdherentForm({
  mode,
  values,
  setField,
  onSubmit,
  isSubmitting,
  error,
}: AdherentFormProps) {
  const { ouvrir } = useMenu();

  return (
    <>
      <Topbar
        surtitre="Adhérents"
        titre={mode === "create" ? "Nouvel adhérent" : "Modifier l'adhérent"}
        onMenu={ouvrir}
        actions={
          <>
            {error ? (
              <span className="hidden text-[0.84rem] font-semibold text-rouge sm:inline">
                {error}
              </span>
            ) : null}
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="inline-flex h-11.5 cursor-pointer items-center rounded-xl bg-vovinam px-5.5 text-[0.92rem] font-bold text-white transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Enregistrement…"
                : mode === "create"
                  ? "Créer l'adhérent"
                  : "Enregistrer les modifications"}
            </button>
          </>
        }
      />

      <div className="flex flex-wrap items-start gap-5.5 p-2 lg:p-8">
        <div className="flex min-w-[320px] flex-[2_1_520px] flex-col gap-5.5">
          <section
            className={["flex flex-col gap-4.5 p-3 lg:p-8", carte].join(" ")}
          >
            <h2 className="font-display text-lg font-extrabold text-encre">
              Identité
            </h2>
            <div className="flex flex-wrap gap-4">
              <label className="flex min-w-[220px] flex-1 flex-col gap-2">
                <span className={label}>Nom</span>
                <input
                  type="text"
                  value={values.nom}
                  onChange={(e) => setField("nom", e.target.value)}
                  className={champ}
                />
              </label>
              <label className="flex min-w-[220px] flex-1 flex-col gap-2">
                <span className={label}>Prénom</span>
                <input
                  type="text"
                  value={values.prenom}
                  onChange={(e) => setField("prenom", e.target.value)}
                  className={champ}
                />
              </label>
            </div>
            <label className="flex min-w-[220px] flex-col gap-2">
              <span className={label}>Date de naissance</span>
              <input
                type="text"
                value={values.naissance}
                onChange={(e) => setField("naissance", e.target.value)}
                placeholder="12/04/1998"
                className={champ}
              />
            </label>
            <div className="flex flex-col gap-2.5">
              <span className={label}>Catégorie</span>
              <Choix
                options={categories}
                valeur={values.categorie}
                onChange={(v) => setField("categorie", v)}
              />
            </div>
          </section>

          <section
            className={["flex flex-col gap-4.5 p-3 lg:p-8", carte].join(" ")}
          >
            <h2 className="font-display text-lg font-extrabold text-encre">
              Licence &amp; grade
            </h2>
            <div className="flex flex-wrap gap-4">
              <label className="flex min-w-[220px] flex-1 flex-col gap-2">
                <span className={label}>N° de licence</span>
                <input
                  type="text"
                  value={values.licence}
                  onChange={(e) => setField("licence", e.target.value)}
                  placeholder="VVD-2026-0001"
                  className={champ}
                />
              </label>
              <label className="flex min-w-[220px] flex-1 flex-col gap-2">
                <span className={label}>Grade</span>
                <input
                  type="text"
                  value={values.grade}
                  onChange={(e) => setField("grade", e.target.value)}
                  placeholder="Bleu 1er cấp"
                  className={champ}
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex min-w-[160px] flex-1 flex-col gap-2">
                <span className={label}>Couleur de ceinture</span>
                <input
                  type="color"
                  value={values.couleur}
                  onChange={(e) => setField("couleur", e.target.value)}
                  className="h-12.5 w-full cursor-pointer rounded-field border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] px-2"
                />
              </label>
              <label className="flex min-w-[220px] flex-1 flex-col gap-2">
                <span className={label}>Date d'obtention du grade</span>
                <input
                  type="text"
                  value={values.dateGrade}
                  onChange={(e) => setField("dateGrade", e.target.value)}
                  placeholder="15/06/2025"
                  className={champ}
                />
              </label>
            </div>
          </section>

          <section
            className={["flex flex-col gap-4.5 p-3 lg:p-8", carte].join(" ")}
          >
            <h2 className="font-display text-lg font-extrabold text-encre">
              Contact
            </h2>
            <div className="flex flex-wrap gap-4">
              <label className="flex min-w-[220px] flex-1 flex-col gap-2">
                <span className={label}>Email</span>
                <input
                  type="email"
                  value={values.email}
                  onChange={(e) => setField("email", e.target.value)}
                  className={champ}
                />
              </label>
              <label className="flex min-w-[220px] flex-1 flex-col gap-2">
                <span className={label}>Téléphone</span>
                <input
                  type="tel"
                  value={values.telephone}
                  onChange={(e) => setField("telephone", e.target.value)}
                  className={champ}
                />
              </label>
            </div>
            <label className="flex flex-col gap-2">
              <span className={label}>Adresse</span>
              <input
                type="text"
                value={values.adresse}
                onChange={(e) => setField("adresse", e.target.value)}
                className={champ}
              />
            </label>
          </section>
          {values.categorie == "Adultes" && (
            <section
              className={["flex flex-col gap-4.5 p-3 lg:p-8", carte].join(" ")}
            >
              <h2 className="font-display text-lg font-extrabold text-encre">
                Contact d'urgence
              </h2>
              <div className="flex flex-wrap gap-4">
                <label className="flex min-w-[220px] flex-1 flex-col gap-2">
                  <span className={label}>Email</span>
                  <input
                    type="email"
                    value={values.email}
                    onChange={(e) => setField("email", e.target.value)}
                    className={champ}
                  />
                </label>
                <label className="flex min-w-[220px] flex-1 flex-col gap-2">
                  <span className={label}>Téléphone</span>
                  <input
                    type="tel"
                    value={values.telephone}
                    onChange={(e) => setField("telephone", e.target.value)}
                    className={champ}
                  />
                </label>
              </div>
            </section>
          )}
        </div>

        <div className="flex min-w-[280px] flex-1 flex-col gap-5">
          <section
            className={["flex flex-col gap-4 p-3 lg:p-8", carte].join(" ")}
          >
            <h2 className="font-display text-lg font-extrabold text-encre">
              Administratif
            </h2>
            <div className="flex flex-col gap-2.5">
              <span className={label}>Cotisation</span>
              <Choix
                options={statuts}
                valeur={values.statut}
                onChange={(v) => setField("statut", v)}
              />
            </div>
            <div className="flex flex-col gap-2.5">
              <span className={label}>Certificat médical</span>
              <Choix
                options={certificats}
                valeur={values.certificat}
                onChange={(v) => setField("certificat", v)}
              />
            </div>
            <label className="flex flex-col gap-2">
              <span className={label}>Assurance</span>
              <input
                type="text"
                value={values.assurance}
                onChange={(e) => setField("assurance", e.target.value)}
                placeholder="Incluse"
                className={champ}
              />
            </label>
          </section>
        </div>
      </div>
    </>
  );
}
