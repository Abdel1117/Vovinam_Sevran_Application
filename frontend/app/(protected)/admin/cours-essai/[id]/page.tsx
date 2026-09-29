"use client";

import { use } from "react";
import DemandeForm from "@/components/DemandeForm/DemandeForm";
import { useDemandeForm } from "@/hooks/useDemandeForm";

type Params = { id: string };

export default function Page({ params }: { params: Promise<Params> }) {
  const { id } = use(params);
  const {
    values,
    demande,
    setField,
    submit,
    isSubmitting,
    isLoadingInitial,
    error,
    fieldErrors,
  } = useDemandeForm(id);

  if (isLoadingInitial) {
    return <div className="p-8 text-encre-30">Chargement…</div>;
  }

  return (
    <DemandeForm
      mode="edit"
      demande={demande}
      values={values}
      setField={setField}
      onSubmit={submit}
      isSubmitting={isSubmitting}
      error={error}
      fieldErrors={fieldErrors}
    />
  );
}
