"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Command } from "lucide-react";

import SidebarItem from "@/components/layout/SidebarItem";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { appNavItems } from "@/lib/mock-data";

type MobileSidebarProps = {
  trigger: ReactNode;
};

export default function MobileSidebar({
  trigger,
}: MobileSidebarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="left" className="bg-background/96">
        <SheetHeader>
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
              <Command className="size-5" />
            </span>
            <span className="text-left">
              <SheetTitle className="text-sm">CoxswainAI</SheetTitle>
              <SheetDescription>AI command workspace</SheetDescription>
            </span>
          </Link>
        </SheetHeader>

        <nav className="mt-6 flex flex-col gap-2">
          {appNavItems.map((item) => (
            <SidebarItem key={item.href} {...item} />
          ))}
        </nav>

        <Button className="mt-auto w-full">Start AI brief</Button>
      </SheetContent>
    </Sheet>
  );
}
