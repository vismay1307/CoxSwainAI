// ── src/app/layout.tsx — FULL FILE ──
// Sirf yeh lines add/change karo:

import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Bebas_Neue } from "next/font/google";  // ← ADD Bebas_Neue

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { TRPCProvider } from "@/trpc/provider";
import { TooltipProvider } from "@/components/ui/Tooltip";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

// ── ADD THIS ──
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",              // Bebas Neue only has one weight
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  title: "CoxswainAI",
  description:
    "CoxswainAI unifies inbox, calendar, GitHub, and AI workflows in a premium productivity workspace.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        // ── ADD bebasNeue.variable here ──
        className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable}`}
        data-scroll-behavior="smooth"
      >
        <body className="font-sans">
          <TRPCProvider>
            <TooltipProvider delayDuration={100}>
              {children}
            </TooltipProvider>
          </TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}