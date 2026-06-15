"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Command, Menu, Search } from "lucide-react";

import MobileSidebar from "@/components/layout/MobileSidebar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
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

export default function Header() {
  const pathname = usePathname();
  const copy = titles[pathname] ?? titles["/dashboard"];

  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-background/70 backdrop-blur-xl">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <MobileSidebar
              trigger={
                <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open navigation">
                  <Menu className="size-4" />
                </Button>
              }
            />
            <div className="lg:hidden">
              <Link href="/" className="flex items-center gap-2">
                <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
                  <Command className="size-4" />
                </span>
              </Link>
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight">{copy.title}</p>
              <p className="hidden text-sm text-muted-foreground sm:block">{copy.subtitle}</p>
            </div>
          </div>

          <div className="hidden w-full max-w-md items-center gap-2 rounded-2xl border border-white/70 bg-white/80 px-3 py-2 shadow-soft md:flex">
            <Search className="size-4 text-muted-foreground" />
            <Input
              className="h-auto border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
              placeholder="Search inbox, calendar, PRs..."
              aria-label="Search workspace"
            />
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Notifications">
                  <Bell className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>4 priority emails need attention</DropdownMenuItem>
                <DropdownMenuItem>2 pull requests are ready to merge</DropdownMenuItem>
                <DropdownMenuItem>One schedule conflict detected at 1 PM</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
