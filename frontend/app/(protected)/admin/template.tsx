import type { ReactNode } from "react";

// Contrairement au layout, le template est remonté à chaque navigation : le fondu rejoue à chaque page.
export default function AdminTemplate({ children }: { children: ReactNode }) {
  return <div className="page-transition flex min-w-0 flex-1 flex-col">{children}</div>;
}
