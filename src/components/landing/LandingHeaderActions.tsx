"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

import { Button } from "@/components/ui/Button";

export function LandingHeaderActions() {
  const { isSignedIn } = useUser();

  return (
    <div className="flex items-center gap-3">
      {!isSignedIn ? (
        <>
          <SignInButton mode="modal">
            <Button variant="ghost">
              Sign in
            </Button>
          </SignInButton>

          <Button asChild>
            <Link href="/dashboard">
              Enter workspace
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </>
      ) : (
        <>
          <Button asChild variant="ghost">
            <Link href="/dashboard">
              Dashboard
            </Link>
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