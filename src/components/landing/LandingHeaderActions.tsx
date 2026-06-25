"use client";

import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";

const BEBAS = "var(--font-bebas, 'Bebas Neue', sans-serif)";

export function LandingHeaderActions() {
  const { isSignedIn } = useUser();

  return (
    <div className="flex items-center gap-3">
      {!isSignedIn ? (
        <SignInButton mode="modal">
          <Button
            variant="ghost"
            className="
              bg-white text-slate-700
              hover:bg-[#6ACBF7] hover:text-white
              border border-slate-200/80
              !h-auto !px-7 !py-2.5
              rounded-xl shadow-sm
              transition-all duration-150
            "
            style={{
              fontFamily: BEBAS,
              fontSize: "20px",
              letterSpacing: "0.08em",
            }}
          >
            Sign in
          </Button>
        </SignInButton>
      ) : (
        <>
          <Button
            asChild
            variant="ghost"
            style={{
              fontFamily: BEBAS,
              fontSize: "20px",
              letterSpacing: "0.08em",
              fontWeight: 400,
            }}
          >
            <Link href="/dashboard">Dashboard</Link>
          </Button>

          <UserButton
            appearance={{
              elements: {
                avatarBox:
                  "size-9 rounded-xl ring-2 ring-primary/20 hover:ring-primary/50 transition-all",
              },
            }}
          />
        </>
      )}
    </div>
  );
}