"use client";

import Link from "next/link";
import { ArrowUpRight, Command, Sparkles } from "lucide-react";

import SidebarItem from "@/components/layout/SidebarItem";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { appNavItems } from "@/lib/mock-data";

export default function Sidebar() {
  return (
    <aside className="hidden w-80 shrink-0 flex-col border-r border-white/60 bg-white/50 p-5 backdrop-blur-xl lg:flex">
      <Link href="/" className="flex items-center gap-3 px-2 py-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
          <Command className="size-5" />
        </span>
        <span>
          <span className="block text-sm font-semibold tracking-wide">CoxswainAI</span>
          <span className="block text-xs text-muted-foreground">AI command workspace</span>
        </span>
      </Link>

      <nav className="mt-6 flex flex-1 flex-col gap-2">
        {appNavItems.map((item) => (
          <SidebarItem key={item.href} {...item} />
        ))}
      </nav>

      <Card className="mt-6 overflow-hidden bg-linear-to-br from-white to-blue-50">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-primary/10 p-2 text-primary">
              <Sparkles className="size-4" />
            </span>
            <span className="text-xs font-medium text-primary">Workflow brief</span>
          </div>
          <div>
            <p className="text-sm font-semibold">Keep the next hour focused</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              CoxswainAI found one urgent customer reply, a clean review window, and two GitHub actions worth clearing now.
            </p>
          </div>
          <Button variant="outline" className="w-full justify-between">
            Open morning brief
            <ArrowUpRight className="size-4" />
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}
