"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type SidebarItemProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
};

export default function SidebarItem({
  href,
  label,
  icon: Icon,
  badge,
}: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all",
        isActive
          ? "bg-white text-foreground shadow-soft"
          : "text-muted-foreground hover:bg-white/70 hover:text-foreground"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="flex items-center gap-3">
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-xl transition-colors",
            isActive ? "bg-primary/12 text-primary" : "bg-secondary text-muted-foreground group-hover:text-foreground"
          )}
        >
          <Icon className="size-4" />
        </span>
        {label}
      </span>
      {badge ? <Badge variant={isActive ? "primary" : "outline"}>{badge}</Badge> : null}
    </Link>
  );
}
