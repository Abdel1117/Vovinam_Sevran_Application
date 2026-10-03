"use client";

import { use } from "react";
import EvenementForm from "@/components/EvenementForm/EvenementForm";
import Loader from "@/components/Loader/Loader";
import { useEvenementForm } from "@/hooks/useEvenementForm";

type Params = { id: string };

export default function Page({ params }: { params: Promise<Params> }) {
  const { id } = use(params);
  const {
    values,
    setField,
    setAdresseTexte,
    choisirAdresse,
    submit,
    isSubmitting,
    isLoadingInitial,
    error,
    fieldErrors,
  } = useEvenementForm(id);

  if (isLoadingInitial) {
    return <Loader className="min-h-[60vh] p-8" />;
  }

  return (
    <EvenementForm
      mode="edit"
      values={values}
      setField={setField}
      setAdresseTexte={setAdresseTexte}
      choisirAdresse={choisirAdresse}
      onSubmit={submit}
      isSubmitting={isSubmitting}
      error={error}
      fieldErrors={fieldErrors}
    />
  );
}
