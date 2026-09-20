"use client";

import DatePicker, { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale";
import Topbar from "@/components/Topbar/Topbar";
import { useMenu } from "@/components/AdminShell/menu-context";
import type { AdherentInput } from "@/lib/api/adherents";
import type { ContactUrgence } from "@/lib/data";

registerLocale("fr", fr);

function toIsoDate(date: Date): string {
  const annee = date.getFullYear();
  const mois = String(date.getMonth() + 1).padStart(2, "0");
  const jour = String(date.getDate()).padStart(2, "0");
  return `${annee}-${mois}-${jour}`;
}

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

type GradeInfo = {
  nom: string;
  icone: string;
};

// Ajoutez / modifiez les grades ici : clé technique -> { nom affiché, icône }.
const grades: Record<string, GradeInfo> = {
  bleu1erCap: { nom: "Bleu 1er Cap", icone: "🔵" },
  bleu2emeCap: { nom: "Bleu 2eme Cap", icone: "🔵" },
  bleu3emeCap: { nom: "Bleu 3eme Cap", icone: "🔵" },
  jaune1erDang: { nom: "Ceinture Jaune 1er Dang", icone: "🟡" },
  deuxiemeDang: { nom: "Deuxieme Dang", icone: "🟡" },
  troisiemeDang: { nom: "Troisieme Dang", icone: "🟡" },
  quatriemeDang: { nom: "Quatrieme Dang", icone: "⚫" },
  cinquiemeDang: { nom: "Cinquieme Dang", icone: "⚫" },
};

function withError(base: string, enError: boolean): string {
  return enError ? `${base} border-rouge` : base;
}

function Error({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <span className="text-[0.82rem] font-semibold text-rouge">{message}</span>
  );
}

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
  fieldErrors: Partial<Record<keyof AdherentInput, string>>;
  contactErrors: Partial<Record<keyof ContactUrgence, string>>[];
  addContactUrgence: () => void;
  EditContactUrgence: (
    index: number,
    champ: keyof ContactUrgence,
    valeur: string,
  ) => void;
  deleteContactUrgence: (index: number) => void;
};

function Chosed<T extends string>({
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
  fieldErrors,
  contactErrors,
  addContactUrgence,
  EditContactUrgence,
  deleteContactUrgence,
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
                  className={withError(champ, Boolean(fieldErrors.nom))}
                />
                <Error message={fieldErrors.nom} />
              </label>
              <label className="flex min-w-[220px] flex-1 flex-col gap-2">
                <span className={label}>Prénom</span>
                <input
                  type="text"
                  value={values.prenom}
                  onChange={(e) => setField("prenom", e.target.value)}
                  className={withError(champ, Boolean(fieldErrors.prenom))}
                />
                <Error message={fieldErrors.prenom} />
              </label>
            </div>
            <label className="flex min-w-[220px] flex-col gap-2">
              <span className={label}>Date de naissance</span>
              <DatePicker
                selected={
                  values.naissance
                    ? new Date(`${values.naissance}T00:00:00`)
                    : null
                }
                onChange={(date: Date | null) =>
                  setField("naissance", date ? toIsoDate(date) : "")
                }
                locale="fr"
                dateFormat="dd/MM/yyyy"
                placeholderText="JJ/MM/AAAA"
                showYearDropdown
                yearDropdownItemNumber={80}
                scrollableYearDropdown
                maxDate={new Date()}
                wrapperClassName="w-full"
                className={withError(
                  champ + " w-full",
                  Boolean(fieldErrors.naissance),
                )}
              />
              <Error message={fieldErrors.naissance} />
            </label>
            <div className="flex flex-col gap-2.5">
              <span className={label}>Catégorie</span>
              <Chosed
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
                  className={withError(champ, Boolean(fieldErrors.licence))}
                />
                <Error message={fieldErrors.licence} />
              </label>
              <label className="flex min-w-[220px] flex-1 flex-col gap-2">
                <span className={label}>Grade</span>

                <select
                  value={values.grade}
                  onChange={(e) => setField("grade", e.target.value)}
                  className={withError(champ, Boolean(fieldErrors.grade))}
                >
                  <option value="">Sélectionner un grade</option>
                  {Object.entries(grades).map(([cle, { nom, icone }]) => (
                    <option
                      className="hover:cursor-pointer"
                      key={cle}
                      value={nom}
                    >
                      {icone} {nom}
                    </option>
                  ))}
                </select>
                <Error message={fieldErrors.grade} />
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
                  className={withError(champ, Boolean(fieldErrors.email))}
                />
                <Error message={fieldErrors.email} />
              </label>
              <label className="flex min-w-[220px] flex-1 flex-col gap-2">
                <span className={label}>Téléphone</span>
                <input
                  type="tel"
                  value={values.telephone}
                  onChange={(e) => setField("telephone", e.target.value)}
                  className={withError(champ, Boolean(fieldErrors.telephone))}
                />
                <Error message={fieldErrors.telephone} />
              </label>
            </div>
            <label className="flex flex-col gap-2">
              <span className={label}>Adresse</span>
              <input
                type="text"
                value={values.adresse}
                onChange={(e) => setField("adresse", e.target.value)}
                className={withError(champ, Boolean(fieldErrors.adresse))}
              />
              <Error message={fieldErrors.adresse} />
            </label>
          </section>
          {values.categorie === "Adultes" && (
            <section
              className={["flex flex-col gap-4.5 p-3 lg:p-8", carte].join(" ")}
            >
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="mr-auto font-display text-lg font-extrabold text-encre">
                  Contact{values.contactsUrgence.length > 1 ? "s" : ""}{" "}
                  d'urgence
                </h2>
                <button
                  type="button"
                  onClick={addContactUrgence}
                  className="inline-flex h-10.5 cursor-pointer items-center gap-2 rounded-xl border-[1.5px] border-[#e1e7f5] bg-white px-4 text-[0.86rem] font-bold text-vovinam hover:border-vovinam"
                >
                  + Ajouter un contact
                </button>
              </div>

              {values.contactsUrgence.length === 0 ? (
                <span className="text-[0.9rem] text-encre-30">
                  Aucun contact d'urgence ajouté.
                </span>
              ) : (
                values.contactsUrgence.map((contact, index) => (
                  <div
                    key={index}
                    className="flex flex-wrap items-start gap-4 rounded-field border border-[#eff3fb] bg-[#fafbff] p-4"
                  >
                    <label className="flex min-w-[180px] flex-1 flex-col gap-2">
                      <span className={label}>Nom complet</span>
                      <input
                        type="text"
                        value={contact.nom}
                        onChange={(e) =>
                          EditContactUrgence(index, "nom", e.target.value)
                        }
                        placeholder="Jeanne Mercier"
                        className={withError(
                          champ,
                          Boolean(contactErrors[index]?.nom),
                        )}
                      />
                      <Error message={contactErrors[index]?.nom} />
                    </label>
                    <label className="flex min-w-[160px] flex-1 flex-col gap-2">
                      <span className={label}>Téléphone</span>
                      <input
                        type="tel"
                        value={contact.telephone}
                        onChange={(e) =>
                          EditContactUrgence(index, "telephone", e.target.value)
                        }
                        className={withError(
                          champ,
                          Boolean(contactErrors[index]?.telephone),
                        )}
                      />
                      <Error message={contactErrors[index]?.telephone} />
                    </label>
                    <label className="flex min-w-[140px] flex-1 flex-col gap-2">
                      <span className={label}>Lien de parenté</span>
                      <input
                        type="text"
                        value={contact.lien}
                        onChange={(e) =>
                          EditContactUrgence(index, "lien", e.target.value)
                        }
                        placeholder="Conjoint, parent…"
                        className={champ}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => deleteContactUrgence(index)}
                      className="mt-7.5 h-12.5 flex-none cursor-pointer rounded-xl border-[1.5px] border-[#f3d9d9] bg-white px-4 text-[0.86rem] font-bold text-rouge hover:border-rouge"
                    >
                      Retirer
                    </button>
                  </div>
                ))
              )}
              <Error message={fieldErrors.contactsUrgence} />
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
              <Chosed
                options={statuts}
                valeur={values.statut}
                onChange={(v) => setField("statut", v)}
              />
            </div>
            <div className="flex flex-col gap-2.5">
              <span className={label}>Certificat médical</span>
              <Chosed
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
                className={withError(champ, Boolean(fieldErrors.assurance))}
              />
              <Error message={fieldErrors.assurance} />
            </label>
          </section>
        </div>
      </div>
    </>
  );
}
