"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ACCEPTED_IMAGE_TYPES,
  ImageApiError,
  MAX_IMAGES_PAR_ENVOI,
  createImage,
  formatMonthYear,
} from "@/lib/api/images";

export type FichierEnAttente = {
  id: string;
  fichier: File;
  titre: string;
  categorie: string;
  date: string;
  previewUrl: string;
};

function nameWithoutExtention(fichier: File): string {
  return fichier.name.replace(/\.[^./\\]+$/, "");
}

export function useImageBatchForm() {
  const router = useRouter();
  const { authorizedFetch } = useAuth();
  const [files, setFiles] = useState<FichierEnAttente[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progression, setProgression] = useState({ envoyees: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [errorByFile, setErrorsByFile] = useState<Record<string, string>>({});
  const idSuivant = useRef(0);

  useEffect(() => {
    return () => {
  files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = useCallback((nouveaux: FileList | File[]) => {
    const valides = Array.from(nouveaux).filter((f) =>
      ACCEPTED_IMAGE_TYPES.includes(f.type as (typeof ACCEPTED_IMAGE_TYPES)[number]),
    );
setError(null);
setFiles((prev) => {
      const place = MAX_IMAGES_PAR_ENVOI - prev.length;
      if (place <= 0) {
    setError(`Maximum ${MAX_IMAGES_PAR_ENVOI} photos par envoi.`);
        return prev;
      }
      if (valides.length > place) {
    setError(`Maximum ${MAX_IMAGES_PAR_ENVOI} photos par envoi — ${place} de plus accepté(s) ici.`);
      }
      const ajoutes: FichierEnAttente[] = valides.slice(0, place).map((fichier) => ({
        id: `f${idSuivant.current++}`,
        fichier,
        titre: nameWithoutExtention(fichier),
        categorie: "Entraînement",
        date: formatMonthYear(new Date()),
        previewUrl: URL.createObjectURL(fichier),
      }));
      return [...prev, ...ajoutes];
    });
  }, []);

  const deleteFile = useCallback((id: string) => {
setFiles((prev) => {
      const cible = prev.find((f) => f.id === id);
      if (cible) URL.revokeObjectURL(cible.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
    setErrorsByFile((prev) => {
      if (!(id in prev)) return prev;
      const copie = { ...prev };
      delete copie[id];
      return copie;
    });
  }, []);

  const editFile = useCallback(
    <K extends "titre" | "categorie" | "date">(id: string, champ: K, valeur: string) => {
  setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, [champ]: valeur } : f)));
    },
    [],
  );

  const submit = useCallback(async () => {
    if (files.length === 0) {
  setError("Sélectionnez au moins une photo.");
      return;
    }

    setIsSubmitting(true);
setError(null);
    setProgression({ envoyees: 0, total: files.length });

    const restants: FichierEnAttente[] = [];
    const nouvellesErreurs: Record<string, string> = {};

    for (const item of files) {
      if (!item.date.trim()) {
        nouvellesErreurs[item.id] = "Date requise.";
        restants.push(item);
        setProgression((prev) => ({ ...prev, envoyees: prev.envoyees + 1 }));
        continue;
      }
      try {
        await createImage(authorizedFetch, {
          titre: item.titre.trim() || "Sans titre",
          categorie: item.categorie,
          date: item.date,
          fichier: item.fichier,
        });
      } catch (err) {
        nouvellesErreurs[item.id] = err instanceof ImageApiError ? err.message : "Échec de l'envoi.";
        restants.push(item);
      }
      setProgression((prev) => ({ ...prev, envoyees: prev.envoyees + 1 }));
    }

setFiles(restants);
    setErrorsByFile(nouvellesErreurs);
    setIsSubmitting(false);

    if (restants.length === 0) {
      router.push("/admin/galerie");
    } else {
  setError(`${restants.length} photo(s) sur ${files.length} n'ont pas pu être envoyées.`);
    }
  }, [files, authorizedFetch, router]);

  return {
files,
    addFiles,
    deleteFile,
    editFile,
    submit,
    isSubmitting,
    progression,
error,
    errorByFile,
  };
}
