import Link from "next/link";
import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage/LegalPage";
import { infosLegales as l } from "@/lib/data";

export const metadata: Metadata = {
  title: "Mentions légales — Vovinam Viet Vo Dao",
};

export default function Page() {
  return (
    <LegalPage label="Informations légales" titre="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>
        Ce site est édité par <strong>{l.association}</strong>, association
        régie par la loi du 1er juillet 1901.
      </p>
      <ul>
        <li>Numéro RNA : {l.rna}</li>
        <li>SIRET : {l.siret}</li>
        <li>Siège social : {l.siege}</li>
        <li>
          Email : <a href={`mailto:${l.email}`}>{l.email}</a>
        </li>
      </ul>

      <h2>Directeur·rice de la publication</h2>
      <p>{l.directeurPublication}, en qualité de président·e de l&apos;association.</p>

      <h2>Hébergement</h2>
      <ul>
        <li>{l.hebergeur.nom}</li>
        <li>{l.hebergeur.adresse}</li>
        <li>{l.hebergeur.telephone}</li>
      </ul>

      <h2>Propriété intellectuelle</h2>
      <p>
        Les textes, photographies et logos présents sur ce site sont la
        propriété de l&apos;association ou de leurs auteurs. Toute
        reproduction, totale ou partielle, sans autorisation écrite préalable
        est interdite.
      </p>
      <p>
        Les personnes apparaissant sur les photographies du club peuvent
        demander leur retrait à tout moment en écrivant à{" "}
        <a href={`mailto:${l.email}`}>{l.email}</a>.
      </p>

      <h2>Crédits</h2>
      <ul>
        <li>Icônes : SVG Repo (svgrepo.com).</li>
        <li>
          Fonds de carte : © les contributeurs d&apos;
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
            OpenStreetMap
          </a>
          .
        </li>
        <li>Géocodage des adresses : Géoplateforme de l&apos;IGN.</li>
      </ul>

      <h2>Liens externes</h2>
      <p>
        Le site renvoie vers des services tiers (Facebook, Instagram, YouTube,
        OpenStreetMap, Google Maps pour les itinéraires). L&apos;association
        n&apos;est pas responsable de leur contenu ni de leurs pratiques en
        matière de données personnelles.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Le traitement de vos données est décrit dans notre{" "}
        <Link href="/politique-de-confidentialite">
          politique de confidentialité
        </Link>
        .
      </p>
    </LegalPage>
  );
}
