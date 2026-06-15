import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

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

export const metadata: Metadata = {
  title: "CoxswainAI",
  description:
    "CoxswainAI unifies inbox, calendar, GitHub, and AI workflows in a premium productivity workspace.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable}`}
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
