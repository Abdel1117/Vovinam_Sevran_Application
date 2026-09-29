"use client";

import EvenementForm from "@/components/EvenementForm/EvenementForm";
import { useEvenementForm } from "@/hooks/useEvenementForm";

export default function Page() {
  const {
    values,
    setField,
    setAdresseTexte,
    choisirAdresse,
    submit,
    isSubmitting,
    error,
    fieldErrors,
  } = useEvenementForm();

  return (
    <EvenementForm
      mode="create"
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
