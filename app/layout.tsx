import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://atelo.studio"),
  title: {
    default: "ATELO — Signal over noise",
    template: "%s — ATELO",
  },
  description:
    "AI-synthesized design briefs from client swipes. Atelo replaces the Pinterest-board phase of client onboarding with a swiping experience that resolves taste into a structured architectural brief.",
  keywords: [
    "architecture",
    "design brief",
    "client onboarding",
    "mass timber",
    "interior design",
    "precedent study",
  ],
  authors: [{ name: "Atelo" }],
  openGraph: {
    title: "ATELO — Signal over noise",
    description: "AI-synthesized design briefs from client swipes.",
    type: "website",
    siteName: "Atelo",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATELO — Signal over noise",
    description: "AI-synthesized design briefs from client swipes.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${archivo.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
