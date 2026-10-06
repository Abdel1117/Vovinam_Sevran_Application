import Link from "next/link";
import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage/LegalPage";
import { infosLegales as l } from "@/lib/data";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Vovinam Viet Vo Dao",
};

export default function Page() {
  const email = <a href={`mailto:${l.email}`}>{l.email}</a>;

  return (
    <LegalPage label="Vos données" titre="Politique de confidentialité">
      <p>
        L&apos;association attache une grande importance à la protection de vos
        données personnelles. Cette page explique quelles données nous
        collectons, pourquoi, et quels sont vos droits, conformément au
        Règlement général sur la protection des données (RGPD) et à la loi
        Informatique et Libertés.
      </p>

      <h2>Responsable du traitement</h2>
      <p>
        <strong>{l.association}</strong>, {l.siege}. Contact : {email}.
      </p>

      <h2>Données collectées et finalités</h2>
      <p>
        <strong>Formulaire de contact et demande de cours d&apos;essai.</strong>{" "}
        Prénom, nom, adresse email, téléphone (facultatif), cours souhaité et
        message. Ces données servent uniquement à vous répondre et à organiser
        votre cours d&apos;essai. Base légale : votre consentement, donné en
        cochant la case prévue avant l&apos;envoi.
      </p>
      <p>
        <strong>Adhérents.</strong> Lors de l&apos;inscription, le bureau
        enregistre : nom, prénom, date de naissance, coordonnées (téléphone,
        email, adresse), numéro de licence, grade, suivi de la cotisation et de
        l&apos;assurance, statut du certificat médical (fourni ou non, sans son
        contenu) et un contact à prévenir en cas d&apos;urgence. Ces données
        servent à gérer l&apos;adhésion, la licence fédérale et la sécurité des
        pratiquants. Base légale : l&apos;exécution de l&apos;adhésion et les
        obligations envers la fédération.
      </p>

      <h2>Destinataires</h2>
      <p>
        Les données sont accessibles uniquement aux membres du bureau et aux
        enseignants habilités. Les informations nécessaires à la licence sont
        transmises à la fédération. Elles ne sont jamais vendues ni cédées à des
        fins commerciales.
      </p>

      <h2>Durées de conservation</h2>
      <ul>
        <li>Demandes de contact et de cours d&apos;essai : {l.conservation.demandes}.</li>
        <li>Données des adhérents : {l.conservation.adherents}.</li>
      </ul>

      <h2>Cookies</h2>
      <p>
        Le site n&apos;utilise ni outil de mesure d&apos;audience, ni cookie
        publicitaire. Le seul cookie déposé est un cookie technique de session,
        réservé aux membres du bureau qui se connectent à l&apos;espace
        d&apos;administration. Indispensable au fonctionnement de cet espace, il
        est exempté de consentement.
      </p>

      <h2>Services tiers</h2>
      <ul>
        <li>
          <strong>OpenStreetMap</strong> affiche les cartes (page Contact et
          agenda), sans cookie de traçage.
        </li>
        <li>
          <strong>Géoplateforme de l&apos;IGN</strong> propose
          l&apos;autocomplétion des adresses dans l&apos;espace
          d&apos;administration.
        </li>
        <li>
          Les liens vers <strong>Facebook, Instagram, YouTube</strong> et{" "}
          <strong>Google Maps</strong> (itinéraires) vous emmènent sur ces
          services, qui appliquent leur propre politique de confidentialité.
        </li>
      </ul>

      <h2>Sécurité</h2>
      <p>
        Le site est servi en HTTPS et l&apos;espace d&apos;administration est
        protégé par une authentification. Seules les personnes habilitées
        peuvent consulter les données.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous disposez d&apos;un droit d&apos;accès, de rectification,
        d&apos;effacement, d&apos;opposition, de limitation et de portabilité de
        vos données, ainsi que du droit de retirer votre consentement à tout
        moment. Pour les exercer, écrivez-nous à {email}. Nous répondons dans un
        délai d&apos;un mois.
      </p>
      <p>
        Si vous estimez que vos droits ne sont pas respectés, vous pouvez
        adresser une réclamation à la{" "}
        <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noreferrer">
          CNIL
        </a>
        .
      </p>
      <p>
        Voir aussi les <Link href="/mentions-legales">mentions légales</Link>.
      </p>
    </LegalPage>
  );
}
