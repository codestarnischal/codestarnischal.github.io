import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";
import Navigation from "@/components/Navigation";
import { SensoryProvider } from "@/components/SensoryProvider";
import CanvasBackground from "@/components/CanvasBackground";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aanp 1938 — Nepali Heritage Atelier",
  description: "High-altitude textile craft from the Himalayan kingdom. Est. 1938, Kathmandu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} h-full`}>
      <body className="min-h-full relative overflow-x-hidden" style={{ background: "#0B0F19" }}>
        <SensoryProvider>
          <CanvasBackground />
          <Cursor />
          <Navigation />
          <div className="relative z-10">
            {children}
          </div>
        </SensoryProvider>
      </body>
    </html>
  );
}
