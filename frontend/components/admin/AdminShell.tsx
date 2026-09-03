"use client";

import { useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import { MenuContext } from "./menu-context";

export default function AdminShell({ children }: { children: ReactNode }) {
  const [ouvert, setOuvert] = useState(false);
  return (
    <div className="flex min-h-screen bg-vovinam-050">
      <Sidebar ouvert={ouvert} onClose={() => setOuvert(false)} />
      {ouvert ? (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={() => setOuvert(false)}
          className="fixed inset-0 z-40 bg-encre/40 lg:hidden"
        />
      ) : null}
      <MenuContext.Provider value={{ ouvrir: () => setOuvert(true) }}>
        <main className="flex min-w-0 flex-1 flex-col">{children}</main>
      </MenuContext.Provider>
    </div>
  );
}
