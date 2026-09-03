"use client";

import { useRef, useState } from "react";
import Topbar from "@/components/admin/Topbar";
import { useMenu } from "@/components/admin/menu-context";

const carte = "rounded-card border border-trait bg-white shadow-card";
const champ =
  "h-12.5 rounded-field border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] px-4 text-[0.98rem] text-encre outline-none focus:border-vovinam focus:ring-4 focus:ring-vovinam/10";

const categories = ["Stage", "Compétition", "Vie du club", "Passage de grades", "Fédération"];

type Outil = {
  label: string;
  titre: string;
  avant: string;
  apres: string;
  defaut: string;
  classe: string;
};

const outils: Outil[] = [
  { label: "B", titre: "Gras", avant: "**", apres: "**", defaut: "texte en gras", classe: "font-display font-extrabold" },
  { label: "I", titre: "Italique", avant: "*", apres: "*", defaut: "texte en italique", classe: "italic" },
  { label: "H2", titre: "Titre de section", avant: "\n## ", apres: "\n", defaut: "Titre de section", classe: "font-bold" },
  { label: "❝", titre: "Citation", avant: "\n> ", apres: "\n", defaut: "Citation", classe: "" },
  { label: "☰", titre: "Liste", avant: "\n- ", apres: "\n", defaut: "Premier élément", classe: "" },
  { label: "↗", titre: "Lien", avant: "[", apres: "](https://)", defaut: "texte du lien", classe: "" },
];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export default function Page() {
  const { ouvrir } = useMenu();
  const editeur = useRef<HTMLTextAreaElement | null>(null);
  const [titre, setTitre] = useState("");
  const [chapo, setChapo] = useState("");
  const [corps, setCorps] = useState("");
  const [categorie, setCategorie] = useState("Stage");
  const [statut, setStatut] = useState("Brouillon");
  const [etat, setEtat] = useState("Aucune modification enregistrée");
  const [images, setImages] = useState(3);

  const mots = corps.trim() ? corps.trim().split(/\s+/).length : 0;

  function entoure(o: Outil) {
    const ta = editeur.current;
    if (!ta) return;
    const debut = ta.selectionStart ?? 0;
    const fin = ta.selectionEnd ?? 0;
    const selection = corps.slice(debut, fin) || o.defaut;
    const suivant = corps.slice(0, debut) + o.avant + selection + o.apres + corps.slice(fin);
    setCorps(suivant);
    setEtat("Modifications non enregistrées");
    requestAnimationFrame(() => {
      ta.focus();
      const pos = debut + o.avant.length + selection.length;
      ta.setSelectionRange(pos, pos);
    });
  }

  return (
    <>
      <Topbar
        surtitre="Actualités"
        titre="Créer un article"
        onMenu={ouvrir}
        actions={
          <>
            <span className="hidden text-[0.84rem] font-semibold text-encre-30 sm:inline">{etat}</span>
            <button
              type="button"
              onClick={() => {
                setStatut("Brouillon");
                setEtat("Brouillon enregistré");
              }}
              className="inline-flex h-11.5 cursor-pointer items-center rounded-xl border-[1.5px] border-[#e1e7f5] bg-white px-4.5 text-[0.92rem] font-bold text-encre-70 hover:border-vovinam"
            >
              Enregistrer le brouillon
            </button>
            <button
              type="button"
              onClick={() => {
                setStatut("Publié");
                setEtat("Article publié");
              }}
              className="inline-flex h-11.5 cursor-pointer items-center rounded-xl bg-vovinam px-5.5 text-[0.92rem] font-bold text-white transition-all hover:-translate-y-0.5"
            >
              Publier
            </button>
          </>
        }
      />

      <div className="flex flex-wrap items-start gap-5.5 p-5 lg:p-8">
        <div className="flex min-w-[320px] flex-[2.2_1_620px] flex-col gap-5.5">
          <section className={["flex flex-col gap-4.5 p-6 lg:p-8", carte].join(" ")}>
            <label className="flex flex-col gap-2">
              <span className="text-[0.88rem] font-semibold text-encre-70">Titre de l'article</span>
              <input
                type="text"
                value={titre}
                onChange={(e) => {
                  setTitre(e.target.value);
                  setEtat("Modifications non enregistrées");
                }}
                placeholder="Retour sur notre dernier stage régional"
                className="h-15 rounded-2xl border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] px-4.5 font-display text-xl font-bold text-encre outline-none focus:border-vovinam focus:ring-4 focus:ring-vovinam/10"
              />
            </label>

            <div className="flex flex-wrap gap-4">
              <label className="flex min-w-[260px] flex-1 flex-col gap-2">
                <span className="text-[0.88rem] font-semibold text-encre-70">Lien (slug)</span>
                <span className="flex h-12.5 items-center gap-0.5 overflow-hidden rounded-field border-[1.5px] border-[#e1e7f5] bg-[#f6f8fe] px-3.5">
                  <span className="flex-none font-mono text-[0.88rem] text-encre-30">/actualites/</span>
                  <span className="truncate font-mono text-[0.88rem] text-encre-70">{slugify(titre) || "nouvel-article"}</span>
                </span>
              </label>
              <label className="flex min-w-[160px] flex-1 flex-col gap-2">
                <span className="text-[0.88rem] font-semibold text-encre-70">Date de publication</span>
                <input type="date" defaultValue="2026-09-05" className={champ} />
              </label>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-[0.88rem] font-semibold text-encre-70">Chapô — résumé affiché sur les cards</span>
              <textarea
                rows={3}
                value={chapo}
                onChange={(e) => {
                  setChapo(e.target.value);
                  setEtat("Modifications non enregistrées");
                }}
                placeholder="Deux ou trois phrases qui résument l'article…"
                className="resize-y rounded-field border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] p-4 text-base leading-relaxed text-encre outline-none focus:border-vovinam focus:ring-4 focus:ring-vovinam/10"
              />
              <span className="text-[0.82rem] text-encre-30">{chapo.length} / 220 caractères</span>
            </label>
          </section>

          <section className={["flex flex-col gap-4 p-6 lg:p-8", carte].join(" ")}>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="mr-auto font-display text-lg font-extrabold text-encre">Image de couverture</h2>
              <span className="text-[0.84rem] text-encre-30">Format conseillé : 1600 × 900 px</span>
            </div>
            <label className="flex h-60 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed border-[#c9d6f5] bg-[#fbfcff] text-center transition-colors hover:border-vovinam hover:bg-vovinam-050 lg:h-80">
              <input type="file" accept="image/*" className="hidden" />
              <span className="flex size-12 items-center justify-center rounded-xl bg-vovinam-100 text-xl font-bold text-vovinam">
                +
              </span>
              <span className="font-semibold text-encre">Glissez la photo de couverture ici</span>
              <span className="text-[0.86rem] text-encre-30">ou cliquez pour parcourir vos fichiers</span>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-[0.88rem] font-semibold text-encre-70">Légende de la couverture</span>
              <input type="text" placeholder="Les participants réunis à la fin de la deuxième journée." className={champ} />
            </label>
          </section>

          <section className={["flex flex-col gap-3.5 p-6 lg:p-8", carte].join(" ")}>
            <h2 className="font-display text-lg font-extrabold text-encre">Contenu</h2>
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
              <span className="h-9.5 w-px bg-[#e1e7f5]" />
              <button
                type="button"
                onClick={() => setImages((n) => n + 1)}
                className="inline-flex h-9.5 cursor-pointer items-center gap-2 rounded-lg border border-[#d8e2fb] bg-vovinam-100 px-3.5 text-[0.85rem] font-bold text-vovinam"
              >
                + Insérer une image
              </button>
            </div>
            <textarea
              ref={editeur}
              rows={16}
              value={corps}
              onChange={(e) => {
                setCorps(e.target.value);
                setEtat("Modifications non enregistrées");
              }}
              placeholder="Rédigez l'article… Les boutons ci-dessus insèrent la mise en forme (**gras**, ## titre, > citation)."
              className="resize-y rounded-2xl border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] p-4.5 text-[1.02rem] leading-[1.75] text-[#28324d] outline-none focus:border-vovinam focus:ring-4 focus:ring-vovinam/10"
            />
            <span className="text-[0.84rem] text-encre-30">
              {mots} mots · temps de lecture estimé {Math.max(1, Math.round(mots / 200))} min
            </span>
          </section>

          <section className={["flex flex-col gap-4 p-6 lg:p-8", carte].join(" ")}>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="mr-auto font-display text-lg font-extrabold text-encre">Galerie de l'article</h2>
              <button
                type="button"
                onClick={() => setImages((n) => n + 1)}
                className="inline-flex h-10.5 cursor-pointer items-center gap-2 rounded-xl bg-vovinam px-4 text-[0.88rem] font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                + Ajouter une image
              </button>
            </div>
            <div className="flex flex-wrap gap-4">
              {Array.from({ length: images }).map((_, i) => (
                <div key={i} className="flex min-w-[220px] flex-1 flex-col gap-2.5">
                  <label className="flex h-42 cursor-pointer items-center justify-center rounded-2xl border-[1.5px] border-dashed border-[#c9d6f5] bg-[#fbfcff] text-center font-mono text-[10px] tracking-[0.12em] text-[#4a5fa6] uppercase transition-colors hover:border-vovinam hover:bg-vovinam-050">
                    <input type="file" accept="image/*" className="hidden" />
                    Image {i + 1}
                  </label>
                  <input type="text" placeholder="Légende…" className="h-11 rounded-xl border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] px-3.5 text-[0.92rem] text-encre outline-none focus:border-vovinam" />
                </div>
              ))}
            </div>
            <span className="text-[0.84rem] leading-relaxed text-encre-30">
              Branchez ces champs sur votre stockage (S3, Cloudinary, Vercel Blob) via une route API.
            </span>
          </section>
        </div>

        <div className="flex min-w-[300px] flex-1 flex-col gap-5">
          <section className={["flex flex-col gap-4 p-6", carte].join(" ")}>
            <h2 className="font-display text-lg font-extrabold text-encre">Publication</h2>
            <div className="flex items-center justify-between gap-3 border-b border-[#f1f4fb] pb-3">
              <span className="text-[0.9rem] font-semibold text-encre-50">Statut</span>
              <span
                className={[
                  "rounded-md px-3 py-2 text-[0.78rem] font-bold tracking-wider uppercase",
                  statut === "Publié" ? "bg-[#e9f8ee] text-[#0e7a3c]" : "bg-[#fff6da] text-[#8a6a00]",
                ].join(" ")}
              >
                {statut}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-[#f1f4fb] pb-3">
              <span className="text-[0.9rem] font-semibold text-encre-50">Auteur</span>
              <span className="text-[0.9rem] font-semibold text-encre">Claire Nguyen</span>
            </div>

            <div className="flex flex-col gap-2.5">
              <span className="text-[0.88rem] font-semibold text-encre-70">Catégorie</span>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategorie(c)}
                    className={[
                      "cursor-pointer rounded-full border-[1.5px] px-3.5 py-2.5 text-[0.84rem] font-semibold transition-all",
                      categorie === c ? "border-vovinam bg-vovinam text-white" : "border-[#e1e7f5] bg-white text-encre-70",
                    ].join(" ")}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-[0.88rem] font-semibold text-encre-70">Étiquettes</span>
              <input type="text" placeholder="stage, technique, grades" className="h-11.5 rounded-xl border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] px-3.5 text-[0.94rem] text-encre outline-none focus:border-vovinam" />
            </label>

            {["Mettre en avant dans « À la une »", "Notifier les adhérents par email"].map((l) => (
              <label key={l} className="flex cursor-pointer items-center gap-3">
                <input type="checkbox" className="size-4.5 flex-none accent-vovinam" />
                <span className="text-[0.92rem] font-medium text-encre-50">{l}</span>
              </label>
            ))}
          </section>

          <section className={["overflow-hidden", carte].join(" ")}>
            <div className="border-b border-[#f1f4fb] px-5.5 pt-5 pb-4">
              <h2 className="font-display text-lg font-extrabold text-encre">Aperçu de la card</h2>
            </div>
            <div className="px-5.5 pt-5 pb-6">
              <div className="overflow-hidden rounded-2xl border border-trait shadow-card">
                <div className="relative flex h-35 items-center justify-center bg-[repeating-linear-gradient(135deg,#e9eeff_0_12px,#dce5ff_12px_24px)]">
                  <span className="font-mono text-[10px] tracking-[0.12em] text-[#4a5fa6] uppercase">couverture</span>
                  <span className="absolute top-3 left-3 rounded-md bg-jaune px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] text-encre uppercase">
                    {categorie}
                  </span>
                </div>
                <div className="flex flex-col gap-2 px-4.5 pt-4 pb-5">
                  <span className="text-[11px] font-semibold tracking-[0.12em] text-encre-30 uppercase">05 septembre 2026</span>
                  <span className="font-display text-base leading-snug font-extrabold text-encre">
                    {titre || "Titre de votre article"}
                  </span>
                  <span className="text-[0.9rem] leading-relaxed text-encre-50">
                    {chapo || "Le chapô apparaîtra ici, sous le titre, sur toutes les cards du site."}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-2.5 rounded-card border border-[#dce4f7] bg-vovinam-100 p-5.5">
            <h2 className="font-display text-base font-extrabold text-encre">Avant de publier</h2>
            {[
              "Vérifiez l'autorisation de droit à l'image des personnes photographiées.",
              "Renseignez une légende pour chaque image.",
              "Un chapô de 160 à 220 caractères s'affiche mieux sur les cards.",
            ].map((t) => (
              <span key={t} className="flex items-start gap-2.5 text-[0.9rem] leading-relaxed text-encre-70">
                <span className="mt-1.5 size-1.5 flex-none rounded-full bg-vovinam" />
                {t}
              </span>
            ))}
          </section>
        </div>
      </div>
    </>
  );
}
