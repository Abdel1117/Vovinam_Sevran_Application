"use client";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Supprimer",
  cancelLabel = "Annuler",
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-encre/40 p-4">
      <div className="w-full max-w-[420px] rounded-card border border-trait bg-white p-6.5 shadow-card-hover">
        <h2 className="font-display text-lg font-extrabold text-encre">{title}</h2>
        {description ? (
          <p className="mt-2.5 text-[0.94rem] leading-relaxed text-encre-70">{description}</p>
        ) : null}
        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isConfirming}
            className="inline-flex h-11.5 cursor-pointer items-center rounded-xl border-[1.5px] border-[#e1e7f5] bg-white px-4.5 text-[0.92rem] font-bold text-encre-70 hover:border-vovinam disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="inline-flex h-11.5 cursor-pointer items-center rounded-xl bg-rouge px-5 text-[0.92rem] font-bold text-white transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isConfirming ? "Suppression…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
