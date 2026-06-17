"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Command, Menu, Search } from "lucide-react";
import {
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import MobileSidebar from "@/components/layout/MobileSidebar";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Command Dashboard",
    subtitle: "Your live brief across inbox, schedule, and engineering signals.",
  },
  "/chat": {
    title: "AI Chat",
    subtitle: "Move from questions to action with context-aware assistance.",
  },
  "/inbox": {
    title: "Inbox",
    subtitle: "A calmer, faster surface for priority communication.",
  },
  "/calendar": {
    title: "Calendar",
    subtitle: "Protect focus time and steer the day with better visibility.",
  },
  "/github": {
    title: "GitHub",
    subtitle: "Track repos, reviews, and delivery momentum in one place.",
  },
};

// Notification data — swap with real data source when ready
const notifications = [
  { id: 1, text: "4 priority emails need attention" },
  { id: 2, text: "2 pull requests are ready to merge" },
  { id: 3, text: "Schedule conflict detected at 1 PM" },
];

export default function Header() {
  const pathname = usePathname();
const { user, isSignedIn } =
  useUser();

  const copy = titles[pathname] ?? titles["/dashboard"];

  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-background/80 backdrop-blur-xl">
      <div className="flex flex-col gap-0 px-4 py-0 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">

          {/* ── LEFT: mobile menu + logo + page title ── */}
          <div className="flex items-center gap-3 min-w-0">
            <MobileSidebar
              trigger={
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden shrink-0"
                  aria-label="Open navigation"
                >
                  <Menu className="size-4" />
                </Button>
              }
            />

            {/* Logo — mobile only */}
            <div className="lg:hidden">
              <Link href="/" className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
                  <Command className="size-4" />
                </span>
              </Link>
            </div>

            {/* Page title */}
            <div className="min-w-0">
              <p className="text-[15px] font-semibold tracking-tight truncate">
                {copy.title}
              </p>
              <p className="hidden text-xs text-muted-foreground sm:block truncate">
                {copy.subtitle}
              </p>
            </div>
          </div>

          {/* ── CENTER: search bar ── */}
         <button
  onClick={() => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        ctrlKey: true,
      })
    );
  }}
  className="hidden w-full max-w-sm items-center justify-between rounded-xl border border-white/70 bg-white/80 px-4 py-2 shadow-soft md:flex"
>
  <div className="flex items-center gap-2">
    <Search className="size-4 text-muted-foreground" />
    <span className="text-sm text-muted-foreground">
      Ask CoxswainAI...
    </span>
  </div>

  <div className="flex items-center gap-1 rounded-lg border bg-secondary px-2 py-1 text-xs">
    <Command className="size-3" />
    K
  </div>
</button>

          {/* ── RIGHT: notifications + auth ── */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Notifications bell */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative"
                  aria-label="Notifications"
                >
                  <Bell className="size-4" />
                  {/* Unread dot */}
                  <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel className="flex items-center justify-between">
                  Notifications
                  <span className="text-xs font-normal text-muted-foreground">
                    {notifications.length} new
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((n) => (
                  <DropdownMenuItem key={n.id} className="text-sm py-2.5">
                    <span className="size-1.5 rounded-full bg-primary shrink-0 mr-2" />
                    {n.text}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-xs text-muted-foreground justify-center">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* ✅ FIX: Proper Clerk auth UI
                SignedOut → Sign In button (modal, no redirect)
                SignedIn  → UserButton (avatar + sign out built-in) */}
            {!isSignedIn ? (
  <SignInButton mode="modal">
    <Button
      size="sm"
      className="font-medium"
    >
      Sign in
    </Button>
  </SignInButton>
) : (
  <>
    {user?.firstName && (
      <span className="hidden lg:block text-sm text-muted-foreground pr-1">
        {user.firstName}
      </span>
    )}

    <UserButton
      appearance={{
        elements: {
          avatarBox:
            "size-9 rounded-xl ring-2 ring-transparent hover:ring-primary/30 transition-all duration-200",
        },
      }}
    />
  </>
)}
          </div>
        </div>
      </div>
    </header>
  );
}