"use client";

import DemandeForm from "@/components/DemandeForm/DemandeForm";
import { useDemandeForm } from "@/hooks/useDemandeForm";

export default function Page() {
  const { values, setField, submit, isSubmitting, error, fieldErrors } =
    useDemandeForm();

  return (
    <DemandeForm
      mode="create"
      demande={null}
      values={values}
      setField={setField}
      onSubmit={submit}
      isSubmitting={isSubmitting}
      error={error}
      fieldErrors={fieldErrors}
    />
  );
}
