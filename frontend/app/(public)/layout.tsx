import type { ReactNode } from "react";
import CookieNotice from "@/components/CookieNotice/CookieNotice";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <CookieNotice />
    </>
  );
}
