import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Archivo, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-archivo",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vovinam Viet Vo Dao — Association sportive",
  description:
    "Découvrez le Vovinam Viet Vo Dao et rejoignez une association dynamique dédiée à la pratique, au respect et au dépassement de soi.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={archivo.variable + " " + sourceSans.variable}>
      <body>{children}</body>
    </html>
  );
}
