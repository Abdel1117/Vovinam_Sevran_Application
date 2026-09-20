"use client";

import { useEffect, useRef } from "react";
import Topbar from "@/components/Topbar/Topbar";
import { useMenu } from "@/components/AdminShell/menu-context";
import type { BadgeVariant } from "@/lib/data";
import { fileToDataUrl } from "@/utils/File/File";
import type { ArticleFormValues } from "@/hooks/useArticleForm";

const carte = "rounded-card border border-trait bg-white shadow-card";
const champ =
  "h-12.5 rounded-field border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] px-4 text-[0.98rem] text-encre outline-none focus:border-vovinam focus:ring-4 focus:ring-vovinam/10";

function withError(base: string, enError: boolean): string {
  return enError ? `${base} border-rouge` : base;
}

function Error({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <span className="text-[0.82rem] font-semibold text-rouge">{message}</span>
  );
}

const categorieBadge: Record<string, BadgeVariant> = {
  Stage: "stage",
  Compétition: "competition",
  "Vie du club": "club",
  "Passage de grades": "club",
  Fédération: "association",
};

const categories = Object.keys(categorieBadge);

type Outil = {
  label: string;
  titre: string;
  avant: string;
  apres: string;
  defaut: string;
  classe: string;
};

const outils: Outil[] = [
  {
    label: "B",
    titre: "Gras",
    avant: "**",
    apres: "**",
    defaut: "texte en gras",
    classe: "font-display font-extrabold",
  },
  {
    label: "I",
    titre: "Italique",
    avant: "*",
    apres: "*",
    defaut: "texte en italique",
    classe: "italic",
  },
  {
    label: "H2",
    titre: "Titre de section",
    avant: "\n## ",
    apres: "\n",
    defaut: "Titre de section",
    classe: "font-bold",
  },
  {
    label: "❝",
    titre: "Citation",
    avant: "\n> ",
    apres: "\n",
    defaut: "Citation",
    classe: "",
  },
  {
    label: "↗",
    titre: "Lien",
    avant: "[",
    apres: "](https://)",
    defaut: "texte du lien",
    classe: "",
  },
];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

type ArticleFormProps = {
  mode: "create" | "edit";
  values: ArticleFormValues;
  setField: <K extends keyof ArticleFormValues>(
    field: K,
    value: ArticleFormValues[K],
  ) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  error: string | null;
  fieldErrors: Partial<Record<keyof ArticleFormValues, string>>;
};

export default function ArticleForm({
  mode,
  values,
  setField,
  onSubmit,
  isSubmitting,
  error,
  fieldErrors,
}: ArticleFormProps) {
  const { ouvrir } = useMenu();
  const editeur = useRef<HTMLTextAreaElement | null>(null);

  const mots = values.corpsText.trim()
    ? values.corpsText.trim().split(/\s+/).length
    : 0;

  useEffect(() => {
    setField("lecture", `${Math.max(1, Math.round(mots / 200))} min`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mots]);

  function entoure(o: Outil) {
    const ta = editeur.current;
    if (!ta) return;
    const debut = ta.selectionStart ?? 0;
    const fin = ta.selectionEnd ?? 0;
    const selection = values.corpsText.slice(debut, fin) || o.defaut;
    const suivant =
      values.corpsText.slice(0, debut) +
      o.avant +
      selection +
      o.apres +
      values.corpsText.slice(fin);
    setField("corpsText", suivant);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = debut + o.avant.length + selection.length;
      ta.setSelectionRange(pos, pos);
    });
  }

  async function surCouverture(e: React.ChangeEvent<HTMLInputElement>) {
    const fichier = e.target.files?.[0];
    if (!fichier) return;
    setField("photo", await fileToDataUrl(fichier));
  }

  return (
    <>
      <Topbar
        surtitre="Actualités"
        titre={mode === "create" ? "Créer un article" : "Modifier l'article"}
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
                  ? "Publier"
                  : "Enregistrer les modifications"}
            </button>
          </>
        }
      />

      <div className="flex flex-wrap items-start gap-5.5 p-2 lg:p-8">
        <div className="flex min-w-[320px] flex-[2.2_1_620px] flex-col gap-5.5">
          <section
            className={["flex flex-col gap-4.5 p-3 lg:p-8", carte].join(" ")}
          >
            <label className="flex flex-col gap-2">
              <span className="text-[0.88rem] font-semibold text-encre-70">
                Titre de l'article
              </span>
              <input
                type="text"
                value={values.titre}
                onChange={(e) => setField("titre", e.target.value)}
                placeholder="Retour sur notre dernier stage régional"
                className={withError(
                  "h-15 rounded-2xl border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] px-4.5 font-display text-xl font-bold text-encre outline-none focus:border-vovinam focus:ring-4 focus:ring-vovinam/10",
                  Boolean(fieldErrors.titre),
                )}
              />
              <Error message={fieldErrors.titre} />
            </label>

            <div className="flex flex-wrap gap-4">
              <label className="flex min-w-[260px] flex-1 flex-col gap-2">
                <span className="text-[0.88rem] font-semibold text-encre-70">
                  Lien (slug)
                </span>
                <span className="flex h-12.5 items-center gap-0.5 overflow-hidden rounded-field border-[1.5px] border-[#e1e7f5] bg-[#f6f8fe] px-3.5">
                  <span className="flex-none font-mono text-[0.88rem] text-encre-30">
                    /actualites/
                  </span>
                  <span className="truncate font-mono text-[0.88rem] text-encre-70">
                    {slugify(values.titre) || "nouvel-article"}
                  </span>
                </span>
              </label>
              <label className="flex min-w-[160px] flex-1 flex-col gap-2">
                <span className="text-[0.88rem] font-semibold text-encre-70">
                  Date de publication
                </span>
                <input
                  type="date"
                  value={values.date}
                  onChange={(e) => setField("date", e.target.value)}
                  className={withError(champ, Boolean(fieldErrors.date))}
                />
                <Error message={fieldErrors.date} />
              </label>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-[0.88rem] font-semibold text-encre-70">
                Auteur
              </span>
              <input
                type="text"
                value={values.auteur}
                onChange={(e) => setField("auteur", e.target.value)}
                placeholder="Claire Nguyen"
                className={withError(champ, Boolean(fieldErrors.auteur))}
              />
              <Error message={fieldErrors.auteur} />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[0.88rem] font-semibold text-encre-70">
                Chapô — résumé affiché sur les cards
              </span>
              <textarea
                rows={3}
                value={values.chapo}
                onChange={(e) => setField("chapo", e.target.value)}
                placeholder="Deux ou trois phrases qui résument l'article…"
                className={withError(
                  "resize-y rounded-field border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] p-4 text-base leading-relaxed text-encre outline-none focus:border-vovinam focus:ring-4 focus:ring-vovinam/10",
                  Boolean(fieldErrors.chapo),
                )}
              />
              <span className="text-[0.82rem] text-encre-30">
                {values.chapo.length} / 220 caractères
              </span>
              <Error message={fieldErrors.chapo} />
            </label>
          </section>

          <section
            className={["flex flex-col gap-4 p-3 lg:p-8", carte].join(" ")}
          >
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="mr-auto font-display text-lg font-extrabold text-encre">
                Image de couverture
              </h2>
              <span className="text-[0.84rem] text-encre-30">
                Format conseillé : 1600 × 900 px
              </span>
            </div>
            <label className="relative flex h-60 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-[1.5px] border-dashed border-[#c9d6f5] bg-[#fbfcff] text-center transition-colors hover:border-vovinam hover:bg-vovinam-050 lg:h-80">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={surCouverture}
              />
              {values.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={values.photo}
                  alt="Couverture"
                  className="absolute inset-0 size-full object-cover"
                />
              ) : (
                <>
                  <span className="flex size-12 items-center justify-center rounded-xl bg-vovinam-100 text-xl font-bold text-vovinam">
                    +
                  </span>
                  <span className="font-semibold text-encre">
                    Glissez la photo de couverture ici
                  </span>
                  <span className="text-[0.86rem] text-encre-30">
                    ou cliquez pour parcourir vos fichiers
                  </span>
                </>
              )}
            </label>
          </section>

          <section
            className={["flex flex-col gap-3.5 p-3 lg:p-8", carte].join(" ")}
          >
            <h2 className="font-display text-lg font-extrabold text-encre">
              Contenu
            </h2>
            <div className="flex flex-wrap gap-2 rounded-field border border-[#e7ecf7] bg-[#f6f8fe] p-2.5">
              {outils.map((o) => (
                <button
                  key={o.label}
                  type="button"
                  title={o.titre}
                  onClick={() => entoure(o)}
                  className={[
                    "h-9.5 min-w-[42px] cursor-pointer rounded-lg border border-[#e1e7f5] bg-white text-[0.95rem] text-encre-70 transition-all hover:border-vovinam hover:text-vovinam",
                    o.classe,
                  ].join(" ")}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <textarea
              ref={editeur}
              rows={16}
              value={values.corpsText}
              onChange={(e) => setField("corpsText", e.target.value)}
              placeholder="Rédigez l'article… Les boutons ci-dessus insèrent la mise en forme (**gras**, ## titre, > citation)."
              className={withError(
                "resize-y rounded-2xl border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] p-4.5 text-[1.02rem] leading-[1.75] text-[#28324d] outline-none focus:border-vovinam focus:ring-4 focus:ring-vovinam/10",
                Boolean(fieldErrors.corpsText),
              )}
            />
            <span className="text-[0.84rem] text-encre-30">
              {mots} mots · temps de lecture estimé{" "}
              {Math.max(1, Math.round(mots / 200))} min
            </span>
            <Error message={fieldErrors.corpsText} />
          </section>
        </div>

        <div className="flex min-w-[300px] flex-1 flex-col gap-5">
          <section
            className={["flex flex-col gap-4 p-3 lg:p-8", carte].join(" ")}
          >
            <h2 className="font-display text-lg font-extrabold text-encre">
              Publication
            </h2>

            <div className="flex flex-col gap-2.5">
              <span className="text-[0.88rem] font-semibold text-encre-70">
                Catégorie
              </span>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setField("categorie", c);
                      setField("badge", categorieBadge[c]);
                    }}
                    className={[
                      "cursor-pointer rounded-full border-[1.5px] px-3.5 py-2.5 text-[0.84rem] font-semibold transition-all",
                      values.categorie === c
                        ? "border-vovinam bg-vovinam text-white"
                        : "border-[#e1e7f5] bg-white text-encre-70",
                    ].join(" ")}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-[0.88rem] font-semibold text-encre-70">
                Étiquettes (séparées par des virgules)
              </span>
              <input
                type="text"
                value={values.tags}
                onChange={(e) => setField("tags", e.target.value)}
                placeholder="stage, technique, grades"
                className="h-11.5 rounded-xl border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] px-3.5 text-[0.94rem] text-encre outline-none focus:border-vovinam"
              />
            </label>
          </section>

          <section className={["overflow-hidden", carte].join(" ")}>
            <div className="border-b border-[#f1f4fb] px-5.5 pt-5 pb-4">
              <h2 className="font-display text-lg font-extrabold text-encre">
                Aperçu de la card
              </h2>
            </div>
            <div className="px-2 md:px-5.5 pt-2 md:pt-5 pb-2 md:pb-6">
              <div className="overflow-hidden rounded-2xl border border-trait shadow-card">
                <div className="relative flex h-35 items-center justify-center bg-[repeating-linear-gradient(135deg,#e9eeff_0_12px,#dce5ff_12px_24px)]">
                  {values.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={values.photo}
                      alt=""
                      className="absolute inset-0 size-full object-cover"
                    />
                  ) : (
                    <span className="font-mono text-[10px] tracking-[0.12em] text-[#4a5fa6] uppercase">
                      couverture
                    </span>
                  )}
                  <span className="absolute top-3 left-3 rounded-md bg-jaune px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] text-encre uppercase">
                    {values.categorie}
                  </span>
                </div>
                <div className="flex flex-col gap-2 px-4.5 pt-4 pb-5">
                  <span className="text-[11px] font-semibold tracking-[0.12em] text-encre-30 uppercase">
                    {values.date}
                  </span>
                  <span className="font-display text-base leading-snug font-extrabold text-encre">
                    {values.titre || "Titre de votre article"}
                  </span>
                  <span className="text-[0.9rem] leading-relaxed text-encre-50">
                    {values.chapo ||
                      "Le chapô apparaîtra ici, sous le titre, sur toutes les cards du site."}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
