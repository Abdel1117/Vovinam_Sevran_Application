"use client";

import { use } from "react";
import DemandeForm from "@/components/DemandeForm/DemandeForm";
import Loader from "@/components/Loader/Loader";
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
    return <Loader className="min-h-[60vh] p-8" />;
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
