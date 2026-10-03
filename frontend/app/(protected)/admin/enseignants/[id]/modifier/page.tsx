"use client";

import { use } from "react";
import EnseignantForm from "@/components/EnseignantForm/EnseignantForm";
import Loader from "@/components/Loader/Loader";
import { useEnseignantForm } from "@/hooks/useEnseignantForm";

type Params = { id: string };

export default function Page({ params }: { params: Promise<Params> }) {
  const { id } = use(params);
  const {
    values,
    setField,
    setPhoto,
    submit,
    isSubmitting,
    isLoadingInitial,
    error,
    fieldErrors,
  } = useEnseignantForm(id);

  if (isLoadingInitial) {
    return <Loader className="min-h-[60vh] p-8" />;
  }

  return (
    <EnseignantForm
      mode="edit"
      values={values}
      setField={setField}
      setPhoto={setPhoto}
      onSubmit={submit}
      isSubmitting={isSubmitting}
      error={error}
      fieldErrors={fieldErrors}
    />
  );
}
