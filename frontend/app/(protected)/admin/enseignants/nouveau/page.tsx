"use client";

import EnseignantForm from "@/components/EnseignantForm/EnseignantForm";
import { useEnseignantForm } from "@/hooks/useEnseignantForm";

export default function Page() {
  const {
    values,
    setField,
    setPhoto,
    submit,
    isSubmitting,
    error,
    fieldErrors,
  } = useEnseignantForm();

  return (
    <EnseignantForm
      mode="create"
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
