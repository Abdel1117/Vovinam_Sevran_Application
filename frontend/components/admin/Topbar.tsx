import Link from "next/link";
import type { ReactNode } from "react";

type TopbarProps = {
  surtitre: string;
  titre: string;
  onMenu: () => void;
  actions?: ReactNode;
};

export default function Topbar({ surtitre, titre, onMenu, actions }: TopbarProps) {
  return (
    <div className="sticky top-0 z-30 flex flex-wrap items-center gap-3.5 border-b border-[#e5ebf8] bg-vovinam-050/95 px-5 py-4 backdrop-blur-md lg:px-8">
      <button
        type="button"
        onClick={onMenu}
        aria-label="Menu"
        className="flex size-11 flex-none flex-col items-center justify-center gap-1 rounded-xl border border-[#e1e7f5] bg-white lg:hidden"
      >
        <span className="block h-0.5 w-4.5 bg-encre" />
        <span className="block h-0.5 w-4.5 bg-encre" />
        <span className="block h-0.5 w-4.5 bg-encre" />
      </button>

      <div className="mr-auto flex flex-col gap-1">
        <span className="text-[11px] font-semibold tracking-[0.16em] text-encre-30 uppercase">{surtitre}</span>
        <h1 className="font-display text-xl leading-tight font-extrabold tracking-tight text-encre lg:text-2xl">{titre}</h1>
      </div>

      {actions}

      <div className="flex items-center gap-3 pl-1.5">
        <span className="flex size-10.5 items-center justify-center rounded-xl bg-[#e9eeff] font-display text-[0.9rem] font-extrabold text-vovinam">
          MT
        </span>
        <span className="hidden flex-col leading-tight sm:flex">
          <span className="text-[0.92rem] font-bold text-encre">Minh Trân</span>
          <Link href="/connexion" className="text-[0.8rem] text-encre-30 hover:text-vovinam">
            Administrateur
          </Link>
        </span>
      </div>
    </div>
  );
}
