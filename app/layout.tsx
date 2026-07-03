import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";

/* Fallback for ABC Diatype until licensed files are added to /public/fonts.
   A clean, consumer grotesque — no monospace, no tech affect. */
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://atelo.studio"),
  title: {
    default: "ATELO — Choose the finishes, skip the guesswork",
    template: "%s — ATELO",
  },
  description:
    "Atelo turns finish selection into a swipe. Send one link; your client picks colours, countertops, lighting and fixtures on their phone — and you get a client-ready finish report.",
  keywords: [
    "architecture",
    "interior design",
    "finish selection",
    "material selection",
    "client onboarding",
    "countertops",
    "lighting",
  ],
  authors: [{ name: "Atelo" }],
  openGraph: {
    title: "ATELO — Choose the finishes, skip the guesswork",
    description: "Finish selection as a swipe. One link, a client-ready report.",
    type: "website",
    siteName: "Atelo",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATELO — Choose the finishes, skip the guesswork",
    description: "Finish selection as a swipe. One link, a client-ready report.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={hanken.variable}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
