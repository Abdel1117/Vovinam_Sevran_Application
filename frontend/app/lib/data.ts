export type NavItem = { label: string; href: string; children?: NavItem[] };

export type BadgeVariant = "actualite" | "association" | "stage" | "competition" | "club";

export type Valeur = { titre: string; texte: string };

export type Cours = {
  titre: string;
  niveau: string;
  badge: BadgeVariant;
  texte: string;
  horaires: string;
  lieu: string;
  photo: string;
};

export type Bloc = { type: "p" | "h2" | "quote"; texte: string; auteur?: string };

export type Article = {
  slug: string;
  titre: string;
  categorie: string;
  badge: BadgeVariant;
  date: string;
  auteur: string;
  lecture: string;
  chapo: string;
  photo: string;
  corps: Bloc[];
  tags: string[];
};

export type Evenement = {
  jour: string;
  mois: string;
  type: string;
  badge: BadgeVariant;
  titre: string;
  lieu: string;
  horaire: string;
};

export type Statistique = { valeur: number; suffixe: string; label: string };

export type Enseignant = { nom: string; grade: string; role: string; texte: string };

export type PhotoGalerie = { id: string; titre: string; categorie: string; date: string; url: string };

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
      { label: "Actualitées", href: "/#actu" },
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
  { titre: "Respect", texte: "Respecter ses partenaires, ses enseignants et soi-même." },
  { titre: "Discipline", texte: "Progresser grâce au travail, à la régularité et à la persévérance." },
  { titre: "Maîtrise", texte: "Développer sa technique, son corps et son contrôle." },
  { titre: "Dépassement", texte: "Apprendre à repousser progressivement ses propres limites." },
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

export const actualites: Article[] = [
  {
    slug: "retour-stage-regional",
    titre: "Retour sur notre dernier stage régional",
    categorie: "Stage",
    badge: "stage",
    date: "21 août 2026",
    auteur: "Claire Nguyen",
    lecture: "4 min",
    chapo:
      "Trois jours de pratique intensive à Sevran : quyen, travail aux armes, applications et un examen blanc pour les candidats au passage de grades.",
    photo: "stage régional",
    corps: [
      { type: "p", texte: "Le stage régional a réuni cette année soixante-douze pratiquants venus de six clubs. Trois jours structurés autour d'un fil conducteur simple : revenir aux fondamentaux avant d'aborder les enchaînements les plus techniques du programme." },
      { type: "h2", texte: "Une première journée consacrée aux bases" },
      { type: "p", texte: "Déplacements, gardes, frappes directes : la matinée a été menée par les enseignants du club sur un rythme volontairement lent, afin de corriger les postures individuellement." },
      { type: "quote", texte: "Un stage n'est pas là pour ajouter des techniques, mais pour rendre celles que l'on connaît déjà plus justes.", auteur: "Minh Trân, directeur technique" },
      { type: "h2", texte: "Armes traditionnelles et quyen" },
      { type: "p", texte: "La deuxième journée a été consacrée au bâton long et au sabre, avec deux ateliers tournants. Les ceintures les plus avancées ont travaillé les quyen du programme de passage." },
      { type: "h2", texte: "Examen blanc et bilan" },
      { type: "p", texte: "La dernière matinée a pris la forme d'un examen blanc pour les dix-huit candidats inscrits à la session d'octobre, avec un retour individuel détaillé." },
    ],
    tags: ["stage", "technique", "passage de grades", "vie du club"],
  },
  {
    slug: "resultats-open-de-paris",
    titre: "Résultats de l'Open de Paris",
    categorie: "Compétition",
    badge: "competition",
    date: "12 juillet 2026",
    auteur: "Karim Belhadj",
    lecture: "3 min",
    chapo: "Six médailles pour nos compétiteurs sur les tableaux technique et combat.",
    photo: "podium",
    corps: [{ type: "p", texte: "Neuf compétiteurs engagés, six médailles rapportées. Le détail des résultats par catégorie." }],
    tags: ["compétition", "résultats"],
  },
  {
    slug: "passage-de-grades",
    titre: "Passage de grades de fin de saison",
    categorie: "Vie du club",
    badge: "actualite",
    date: "28 juin 2026",
    auteur: "Minh Trân",
    lecture: "2 min",
    chapo: "Dix-huit pratiquants ont validé leur nouveau grade en fin de saison.",
    photo: "passage de grades",
    corps: [{ type: "p", texte: "Retour sur la session d'examens organisée au dojo 1." }],
    tags: ["grades", "vie du club"],
  },
  {
    slug: "nouvelle-saison",
    titre: "Nouvelle saison, nouvelles inscriptions",
    categorie: "Association",
    badge: "association",
    date: "02 septembre 2026",
    auteur: "Claire Nguyen",
    lecture: "2 min",
    chapo: "Les inscriptions sont ouvertes pour tous les groupes, dans la limite des places disponibles.",
    photo: "groupe rentrée",
    corps: [{ type: "p", texte: "Créneaux, tarifs et documents à fournir pour la saison 2026 / 2027." }],
    tags: ["inscriptions", "association"],
  },
];

export const evenements: Evenement[] = [
  { jour: "14", mois: "SEP", type: "Stage", badge: "stage", titre: "Stage régional", lieu: "Salle omnisports — Sevran", horaire: "09:00 — 17:00" },
  { jour: "28", mois: "SEP", type: "Compétition", badge: "competition", titre: "Open de Paris", lieu: "Halle Georges-Carpentier — Paris 13e", horaire: "08:30 — 18:00" },
  { jour: "12", mois: "OCT", type: "Passage de grades", badge: "club", titre: "Examens de ceintures", lieu: "Gymnase Jean-Moulin — Dojo 1", horaire: "14:00 — 18:00" },
  { jour: "09", mois: "NOV", type: "Démonstration", badge: "club", titre: "Fête des associations", lieu: "Place de la Mairie", horaire: "11:00 — 12:00" },
];

export const statistiques: Statistique[] = [
  { valeur: 30, suffixe: "", label: "Années d'expérience" },
  { valeur: 3, suffixe: "", label: "Cours par semaine" },
  { valeur: 6, suffixe: "+", label: "Événements par an" },
];

export const enseignants: Enseignant[] = [
  { nom: "Julien Saffou", grade: "Ceinture Noir 2e dan", role: "Enseignant Principal", texte: "Pratique depuis 20 ans." },
  { nom: "Claire Nguyen", grade: "Ceinture Noir 1e dan", role: "Enseignant", texte: "Elle construit une pédagogie ludique autour de la motricité et du respect." },
  { nom: "Karim Belhadj", grade: "Ceinture Noir 1e dan", role: "Enseignant", texte: "Il prépare les compétiteurs sur les épreuves techniques et de combat." },
  { nom: "Léa Fontaine",  grade: "Ceinture Noir 1e dan", role: "Enseignant", texte: "Elle accompagne les adolescents dans la technique et la confiance en soi." },
];

export const photos: PhotoGalerie[] = [
  { id: "gal-01", titre: "Travail technique à deux", categorie: "Entraînement", date: "Juin 2026", url: "" },
  { id: "gal-02", titre: "Stage régional de printemps", categorie: "Stage", date: "Avril 2026", url: "" },
  { id: "gal-03", titre: "Open de Paris — finales", categorie: "Compétition", date: "Mars 2026", url: "" },
  { id: "gal-04", titre: "Démonstration fête des associations", categorie: "Démonstration", date: "Septembre 2025", url: "" },
  { id: "gal-05", titre: "Groupe enfants du mercredi", categorie: "Enfants", date: "Mai 2026", url: "" },
  { id: "gal-06", titre: "Quyen — passage de grades", categorie: "Entraînement", date: "Décembre 2025", url: "" },
  { id: "gal-07", titre: "Stage d'été à la mer", categorie: "Stage", date: "Août 2025", url: "" },
  { id: "gal-08", titre: "Podium par équipes", categorie: "Compétition", date: "Février 2026", url: "" },
  { id: "gal-09", titre: "Photo de groupe de fin de saison", categorie: "Démonstration", date: "Juin 2026", url: "" },
  { id: "gal-10", titre: "Atelier armes traditionnelles", categorie: "Entraînement", date: "Janvier 2026", url: "" },
  { id: "gal-11", titre: "Baby Vovinam — motricité", categorie: "Enfants", date: "Mars 2026", url: "" },
  { id: "gal-12", titre: "Stage national à Lyon", categorie: "Stage", date: "Novembre 2025", url: "" },
];

export const categoriesGalerie: string[] = ["Tous", "Entraînement", "Stage", "Compétition", "Démonstration", "Enfants"];

export function getArticle(slug: string): Article | undefined {
  return actualites.find((a) => a.slug === slug);
}
