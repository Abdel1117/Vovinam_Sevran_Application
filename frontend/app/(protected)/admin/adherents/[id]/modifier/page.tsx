"use client";

import { use } from "react";
import AdherentForm from "@/components/AdherentForm/AdherentForm";
import { useAdherentForm } from "@/hooks/useAdherentForm";

type Params = { id: string };

export default function Page({ params }: { params: Promise<Params> }) {
  const { id } = use(params);
  const {
    values,
    setField,
    submit,
    isSubmitting,
    isLoadingInitial,
    error,
    fieldErrors,
    contactErrors,
    ajouterContactUrgence,
    modifierContactUrgence,
    supprimerContactUrgence,
  } = useAdherentForm(id);

  if (isLoadingInitial) {
    return <div className="p-8 text-encre-30">Chargement…</div>;
  }

  return (
    <AdherentForm
      mode="edit"
      values={values}
      setField={setField}
      onSubmit={submit}
      isSubmitting={isSubmitting}
      error={error}
      fieldErrors={fieldErrors}
      contactErrors={contactErrors}
      ajouterContactUrgence={ajouterContactUrgence}
      modifierContactUrgence={modifierContactUrgence}
      supprimerContactUrgence={supprimerContactUrgence}
    />
  );
}
