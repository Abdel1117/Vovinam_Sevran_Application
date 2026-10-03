"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Loader from "@/components/Loader/Loader";
import {
  getIsNavigating,
  getIsNavigatingServer,
  navigationDone,
  subscribeNavigation,
} from "@/lib/navigation";

// Sous ce délai, la navigation est jugée instantanée : pas d'overlay (évite un flash).
const DELAI_AFFICHAGE_MS = 150;

export default function NavigationOverlay() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isNavigating = useSyncExternalStore(subscribeNavigation, getIsNavigating, getIsNavigatingServer);
  const [visible, setVisible] = useState(false);

  // La nouvelle URL est affichée : la navigation est terminée.
  useEffect(() => {
    navigationDone();
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!isNavigating) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => setVisible(true), DELAI_AFFICHAGE_MS);
    return () => clearTimeout(timer);
  }, [isNavigating]);

  return (
    <div
      aria-hidden={!visible}
      className={[
        "fixed inset-0 z-[100] flex items-center justify-center bg-white/75 backdrop-blur-sm",
        "transition-[opacity,visibility] duration-200 ease-out motion-reduce:transition-none",
        visible ? "visible opacity-100" : "pointer-events-none invisible opacity-0",
      ].join(" ")}
    >
      {visible ? <Loader /> : null}
    </div>
  );
}
