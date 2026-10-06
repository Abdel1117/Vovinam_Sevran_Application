export type NavItem = { label: string; href: string; children?: NavItem[] };

export type BadgeVariant = "actualite" | "association" | "stage" | "competition" | "club";

export type Valeur = { titre: string; texte: string; icone: string };

export type Cours = {
  titre: string;
  niveau: string;
  badge: BadgeVariant;
  texte: string;
  horaires: string;
  lieu: string;
  photo: string;
};

export type Statistique = { valeur: number; suffixe: string; label: string };


export type PhotoGalerie = { id: string; titre: string; categorie: string; date: string; url: string; vignette: string };

export type ContactUrgence = { nom: string; telephone: string; lien: string };

export type Adherent = {
  id: string;
  nom: string;
  prenom: string;
  licence: string;
  grade: string;
  couleur: string;
  naissance: string;
  categorie: "Enfants" | "Adolescents" | "Adultes";
  statut: "À jour" | "En attente";
  email: string;
  telephone: string;
  adresse: string;
  code_postal: string;
  certificat: "Valide" | "Manquant";
  assurance: "Assuré" | "Pas assuré";
  contactsUrgence: ContactUrgence[];
};

export function initiales(m: Pick<Adherent, "nom" | "prenom">): string {
  return (m.prenom[0] + m.nom[0]).toUpperCase();
}

export const navigation: NavItem[] = [
  {
    label: "Accueil",
    href: "/",
    children: [
      { label: "Le Vovinam", href: "/#vovinam" },
      { label: "Les 10 principes", href: "/#principes" },
      { label: "L'association", href: "/#valeurs" },
      { label: "Cours", href: "/#cours" },
      { label: "Articles", href: "/#articles" },
      { label: "Agenda", href: "/#agenda" },
      { label: "Vie du club", href: "/#galerie" },
      { label: "Statistiques", href: "/#stats" },
      { label: "Les enseignants", href: "/#enseignants" },
      { label: "Envie d'essayer ?", href: "/#essai" },
    ],
  },
  { label: "Actualités", href: "/actualites" },
  { label: "Agenda", href: "/agenda" },
  { label: "Galerie", href: "/galerie" },
  { label: "Contact", href: "/contact" },
];

export const badgeStyles: Record<BadgeVariant, string> = {
  actualite: "bg-vovinam text-white",
  association: "bg-vovinam text-white",
  stage: "bg-jaune text-encre",
  competition: "bg-rouge text-white",
  club: "bg-vovinam-100 text-vovinam",
};

export const valeurs: Valeur[] = [
  { titre: "Respect", texte: "Respecter ses partenaires, ses enseignants et soi-même.", icone: "/icons/dojo.svg" },
  { titre: "Discipline", texte: "Progresser grâce au travail, à la régularité et à la persévérance.", icone: "/icons/discipline.svg" },
  { titre: "Maîtrise", texte: "Développer sa technique, son corps et son contrôle.", icone: "/icons/tree.svg" },
  { titre: "Dépassement", texte: "Apprendre à repousser progressivement ses propres limites.", icone: "/icons/infinity.svg" },
];

/** Thập Điều Tâm Niệm — à valider avec le texte officiel de la fédération. */
export const principes: string[] = [
  "Atteindre le plus haut niveau de l'art martial pour servir l'humanité.",
  "Être fidèle à l'esprit du Vovinam et former la jeune génération.",
  "Être uni, respecter ses aînés, aimer ses pairs.",
  "Respecter la discipline et préserver l'honneur des arts martiaux.",
  "Respecter les autres styles, n'utiliser l'art martial que pour se défendre et défendre la justice.",
  "Étudier assidûment, cultiver l'esprit et la morale.",
  "Mener une vie simple, honnête et noble.",
  "Forger une volonté d'acier pour vaincre la violence.",
  "Faire preuve de lucidité, de persévérance et d'habileté.",
  "Être maître de soi, modeste et tolérant, et savoir se remettre en question pour progresser.",
];

export const cours: Cours[] = [
  {
    titre: "Enfants",
    niveau: "7 – 11 ans",
    badge: "stage",
    texte: "Découverte ludique, motricité, discipline et confiance.",
    horaires: "Lundi/Vendredi 19:00 — 20:00",
    lieu: "Gymnase Gaston bussière - Salle Verte",
    photo: "cours enfants",
  },
  {
    titre: "Adolescents",
    niveau: "12 – 17 ans",
    badge: "actualite",
    texte: "Technique, condition physique et progression personnelle. Initiation Combat",
    horaires: "Lundi/Vendredi 19:00 — 20:00",
    lieu: "Gymnase Gaston bussière - Salle Verte",
    photo: "cours ados",
  },
  {
    titre: "Adultes",
    niveau: "18 ans et +",
    badge: "actualite",
    texte: "Art martial complet : défense, technique et condition physique.",
    horaires: "Lundi/Vendredi 20:00 — 22:15",
    lieu: "Gymnase Gaston bussière - Salle Verte",
    photo: "cours adultes",
  },
];

export const categorieBadge: Record<string, BadgeVariant> = {
  Stage: "stage",
  Compétition: "competition",
  "Vie du club": "club",
  "Passage de grades": "club",
  Fédération: "association",
};

export const categoriesArticle: string[] = Object.keys(categorieBadge);

export type TypeEvenement = "stage" | "competition" | "passage_de_grades" | "demonstration";

export const typesEvenement: Record<TypeEvenement, { label: string; badge: BadgeVariant }> = {
  stage: { label: "Stage", badge: "stage" },
  competition: { label: "Compétition", badge: "competition" },
  passage_de_grades: { label: "Passage de grades", badge: "club" },
  demonstration: { label: "Démonstration", badge: "club" },
};

export const statistiques: Statistique[] = [
  { valeur: 30, suffixe: "", label: "Années d'expérience" },
  { valeur: 3, suffixe: "", label: "Cours par semaine" },
  { valeur: 6, suffixe: "+", label: "Événements par an" },
];

export type CoursEssai = "enfants" | "adolescents" | "adultes";

export const coursEssai: Record<CoursEssai, string> = {
  enfants: "Enfants (7 – 11 ans)",
  adolescents: "Adolescents (12 – 17 ans)",
  adultes: "Adultes",
};

export type StatutDemande = "a_traiter" | "contacte" | "essai_planifie" | "inscrit" | "sans_suite";

export const statutsDemande: Record<StatutDemande, { label: string; classe: string }> = {
  a_traiter: { label: "À traiter", classe: "bg-jaune text-encre" },
  contacte: { label: "Contacté", classe: "bg-vovinam-100 text-vovinam" },
  essai_planifie: { label: "Essai planifié", classe: "bg-vovinam text-white" },
  inscrit: { label: "Inscrit", classe: "bg-[#e9f8ee] text-[#0e7a3c]" },
  sans_suite: { label: "Sans suite", classe: "bg-[#f1f3f8] text-encre-50" },
};
export const categoriesGalerie: string[] = ["Tous", "Entraînement", "Stage", "Compétition", "Démonstration", "Enfants"];

/** Informations des pages Mentions légales et Politique de confidentialité. */
export const infosLegales = {
  association: "[À COMPLÉTER — nom exact déclaré en préfecture]",
  rna: "[À COMPLÉTER — W93…]",
  siret: "[À COMPLÉTER ou supprimer]",
  siege: "[À COMPLÉTER — adresse du siège social]",
  directeurPublication: "[À COMPLÉTER — prénom nom, président·e]",
  email: "contact@vovinam-association.fr",
  hebergeur: {
    nom: "[À COMPLÉTER — nom de l'hébergeur]",
    adresse: "[À COMPLÉTER — adresse de l'hébergeur]",
    telephone: "[À COMPLÉTER — téléphone de l'hébergeur]",
  },
  conservation: {
    demandes: "[À COMPLÉTER — proposé : 1 an après le dernier échange]",
    adherents: "[À COMPLÉTER — proposé : durée de l'adhésion + 3 ans]",
  },
  dateMiseAJour: "6 octobre 2026",
};
