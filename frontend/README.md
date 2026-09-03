# Vovinam Viet Vo Dao — site de l'association

Export **Next.js 15 (App Router) + TypeScript strict + Tailwind CSS v4** du design réalisé dans le projet.

## Démarrer

\`\`\`bash
npm install
npm run dev
\`\`\`

Le site tourne sur http://localhost:3000.

## Stack

- **Next.js 15** — App Router, composants serveur par défaut, \`"use client"\` uniquement là où il y a de l'état.
- **TypeScript** en mode `strict` — types de données dans `lib/data.ts`, props typées sur chaque composant, `npm run typecheck` pour vérifier.
- **Tailwind CSS v4** — configuration **CSS-first** : pas de \`tailwind.config.js\`. Tous les tokens sont déclarés dans \`app/globals.css\` sous \`@theme\`, et PostCSS charge \`@tailwindcss/postcss\`.
- **next/font** — Archivo (titres) et Source Sans 3 (textes), exposées en variables CSS.

## Design system

Déclaré une seule fois dans \`app/globals.css\` :

| Token | Classes générées |
| --- | --- |
| \`--color-vovinam: #1851d9\` | \`bg-vovinam\`, \`text-vovinam\`, \`border-vovinam\` |
| \`--color-jaune: #ffff01\` | \`bg-jaune\`, \`text-jaune\` |
| \`--color-rouge: #fe0000\` | \`bg-rouge\`, \`text-rouge\` |
| \`--color-vovinam-050 / -100 / -900\` | fonds clairs et footer |
| \`--color-encre / -70 / -50 / -30\` | échelle de gris des textes |
| \`--font-display\`, \`--font-sans\` | \`font-display\`, \`font-sans\` |
| \`--radius-card\`, \`--radius-field\` | \`rounded-card\`, \`rounded-field\` |
| \`--shadow-card\`, \`--shadow-card-hover\` | \`shadow-card\`, \`shadow-card-hover\` |

L'utilitaire \`bg-hero-vovinam\` (déclaré avec \`@utility\`) porte le dégradé du hero et des bandeaux de page.

Pour changer une couleur de marque, modifiez la variable dans \`@theme\` : tout le site suit.

## Pages

| Route | Fichier | Contenu |
| --- | --- | --- |
| \`/\` | \`app/page.jsx\` | Accueil complète (hero, à la une, présentation, valeurs, cours, actualités, agenda, galerie, chiffres, enseignants, CTA) |
| \`/actualites\` | \`app/actualites/page.jsx\` | Liste des articles |
| \`/actualites/[slug]\` | \`app/actualites/[slug]/page.jsx\` | Article + barre de progression + articles liés |
| \`/galerie\` | \`app/galerie/page.jsx\` | Galerie avec recherche, filtres et apparition au scroll |
| \`/contact\` | \`app/contact/page.jsx\` | Coordonnées + formulaire |
| \`/connexion\` | \`app/connexion/page.jsx\` | Espace membre |
| \`/admin\` | \`app/admin/page.jsx\` | Dashboard (KPI, publications, agenda, répartition, demandes) |
| \`/admin/adherents\` | \`app/admin/adherents/page.jsx\` | Table des adhérents + fiche détaillée |
| \`/admin/articles/nouveau\` | \`app/admin/articles/nouveau/page.jsx\` | Création d'article (éditeur, galerie, publication, aperçu) |

Le layout \`app/admin/layout.jsx\` fournit la sidebar et le drawer mobile.

## Composants réutilisables

- \`components/ui/Reveal.jsx\` — apparition au scroll (visible par défaut si l'observation échoue, respecte \`prefers-reduced-motion\`).
- \`components/ui/Photo.jsx\` — emplacement photo. **À remplacer par \`next/image\`** dès que les photos du club sont disponibles.
- \`components/ui/Badge.jsx\`, \`Button.jsx\`, \`SectionTitle.jsx\`, \`Social.jsx\`.
- \`components/site/*\` — sections de la page d'accueil, header, footer, formulaires.
- \`components/admin/*\` — coquille d'administration.

## Données

Tout le contenu de démonstration est centralisé dans \`lib/data.js\` (actualités, événements, cours, valeurs, enseignants, statistiques, photos, adhérents). Remplacez ce module par vos appels API / CMS : la signature des objets est la seule chose à respecter.

## À brancher côté production

1. **Photos** — remplacer \`<Photo />\` par \`<Image />\` et autoriser vos domaines dans \`next.config.mjs\`.
2. **Formulaires** — \`ContactForm\` et \`LoginForm\` sont côté client : ajoutez une Server Action ou une route \`app/api/...\`.
3. **Authentification** — l'espace membre et \`/admin\` ne sont pas protégés : ajoutez NextAuth / Auth.js et un \`middleware.js\`.
4. **Upload d'images** — les champs \`type="file"\` de l'éditeur attendent un stockage (Vercel Blob, S3, Cloudinary).
5. **RGPD** — pages mentions légales et politique de confidentialité à rédiger.
