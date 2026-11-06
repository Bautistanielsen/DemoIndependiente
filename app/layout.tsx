import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Alfa_Slab_One, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { DemoProvider } from "@/lib/store";
import { RegisterSW } from "@/components/RegisterSW";

const display = Alfa_Slab_One({ weight: "400", subsets: ["latin"], variable: "--font-display", display: "swap" });
const texto = Source_Sans_3({ subsets: ["latin"], variable: "--font-text", display: "swap" });

export const metadata: Metadata = {
  title: "Club Atlético Independiente de Lobería",
  description: "Tu carnet, tus cuotas y tus reservas del club.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/escudo.webp", apple: "/escudo.webp" },
};

export const viewport: Viewport = {
  themeColor: "#E31E24",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-AR" className={`${display.variable} ${texto.variable}`}>
      <body>
        <DemoProvider>{children}</DemoProvider>
        <RegisterSW />
      </body>
    </html>
  );
}
