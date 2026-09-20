"use client";

import AdherentForm from "@/components/AdherentForm/AdherentForm";
import { useAdherentForm } from "@/hooks/useAdherentForm";

export default function Page() {
  const { values, setField, submit, isSubmitting, error } = useAdherentForm();

  return (
    <AdherentForm
      mode="create"
      values={values}
      setField={setField}
      onSubmit={submit}
      isSubmitting={isSubmitting}
      error={error}
    />
  );
}
