"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Command } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState,useEffect } from "react";
import { LandingHeaderActions } from "./LandingHeaderActions";
import {  useMotionValue, useMotionTemplate, useSpring, useTransform } from "framer-motion";
const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/chat",      label: "Chat"      },
  { href: "/inbox",     label: "Inbox"     },
  { href: "/github",    label: "GitHub"    },
];
function BrandText() {
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  // Smooth position with motion values — only for coords, NOT opacity
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x    = useSpring(rawX, { stiffness: 360, damping: 30, mass: 0.4 });
  const y    = useSpring(rawY, { stiffness: 360, damping: 30, mass: 0.4 });

  useEffect(() => {
    // Sync spring values to state for backgroundImage re-render
    const unsub = x.on("change", xv =>
      y.on("change", yv => setPos({ x: xv, y: yv }))()
    );
    return unsub;
  }, [x, y]);

  function handleMouseMove(e: React.MouseEvent<HTMLSpanElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set(e.clientX - rect.left);
    rawY.set(e.clientY - rect.top);
  }

  return (
    <span
      ref={ref}
      className="hidden sm:block relative leading-none cursor-default select-none"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Base layer — always visible, exactly as before */}
      <span
        className="text-[22px] tracking-[0.06em] text-slate-800 leading-none"
        style={{ fontFamily: BEBAS }}
      >
        Coxswain AI
      </span>

      {/*
        Reveal layer — stacked on top, gradient clipped to letter shapes.
        CRITICAL: opacity via CSS transition only (NOT Framer Motion style.opacity)
        because animated opacity creates a compositor layer that breaks
        WebkitBackgroundClip: text on Chrome/Safari.
      */}
      <span
        aria-hidden
        className="absolute inset-0 pointer-events-none whitespace-nowrap leading-none text-[22px] tracking-[0.06em]"
        style={{
          fontFamily: BEBAS,
          display: "inline-block",

          // Opacity via CSS — no compositor conflict
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.28s ease",

          // Specular glint offset above-left + broad colour bloom
          backgroundImage: `
            radial-gradient(
              circle 13px at ${pos.x - 12}px ${pos.y - 16}px,
              rgba(255,255,255,0.97) 0%,
              rgba(255,255,255,0.30) 55%,
              transparent 100%
            ),
            radial-gradient(
              ellipse 105px 62px at ${pos.x}px ${pos.y}px,
              #48C5F7 0%,
              #1591D4 48%,
              rgba(21,145,212,0.12) 72%,
              transparent 100%
            )
          `,

          // Clip gradient to letter shapes only
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
        }}
      >
        Coxswain AI
      </span>
    </span>
  );
}
// Active cyan color
const ACTIVE_COLOR  = "#0CC8F2";
const ACTIVE_BG     = "rgba(12,200,242,0.10)";
const ACTIVE_BORDER = "rgba(12,200,242,0.30)";
const HOVER_BG      = "rgba(161,230,240,0.18)";

// Bebas Neue font stack
const BEBAS = "var(--font-bebas, 'Bebas Neue', sans-serif)";

function GlareNavLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setGlareStyle({
      opacity: 1,
      background: `radial-gradient(circle 64px at ${x}px ${y}px, rgba(161,230,240,0.55) 0%, rgba(12,200,242,0.12) 50%, transparent 70%)`,
    });
  }

  function handleMouseLeave() {
    setGlareStyle({ opacity: 0 });
    setIsHovered(false);
  }

  function handleMouseEnter() {
    setIsHovered(true);
  }

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className="relative px-5 py-3 rounded-xl overflow-hidden select-none transition-colors duration-150"
      style={{
        fontFamily: BEBAS,
        // Bebas Neue reads well at 20–22px; letter-spacing gives it breathing room
        fontSize: "20px",
        letterSpacing: "0.08em",
        fontWeight: 400,           // Bebas only has one weight
        color: isActive ? ACTIVE_COLOR : isHovered ? "#1e3a5f" : "#64748b",
        background: isActive ? ACTIVE_BG : isHovered ? HOVER_BG : "transparent",
        border: isActive ? `1px solid ${ACTIVE_BORDER}` : "1px solid transparent",
      }}
    >
      {/* Glare overlay */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-150"
        style={glareStyle}
      />

      {/* Label */}
      <span className="relative z-10">{label}</span>

      {/* Active dot */}
      {isActive && (
        <motion.span
          layoutId="nav-active-dot"
          className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: 4,
            height: 4,
            background: ACTIVE_COLOR,
            boxShadow: `0 0 6px ${ACTIVE_COLOR}`,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();

  return (
    /* top-[40px] = original top-5 (20px) + 20px more                      */
    /* px-4 outer + max-w-[1200px] = ~40px more on each side vs max-w-5xl  */
    <div className="fixed top-[40px] left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto flex items-center justify-between w-full max-w-[1200px]"
        style={{
          padding: "18px 32px",
          borderRadius: "20px",
          border: "1px solid rgba(147,197,253,0.45)",
          background: "rgba(219,234,254,0.62)",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
          boxShadow:
            "0 2px 24px rgba(59,130,246,0.10), 0 1px 0 rgba(255,255,255,0.6) inset",
        }}
      >
        {/* ── Logo ── */}
        <Link
          href="/"
          className="flex items-center gap-3 group shrink-0"
        >
          {/* Icon — slightly bigger to match taller bar */}
          <span
            className="flex items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105"
            style={{ width: 46, height: 46 }}
          >
            <Command className="size-[20px]" />
          </span>

          {/* Brand name only — subtitle removed */}
          <BrandText />
        </Link>

        {/* ── Nav links ── */}
        <div className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href + "/"));
            return (
              <GlareNavLink
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={isActive}
              />
            );
          })}
        </div>

        {/* ── Auth ── */}
        <div className="shrink-0 flex items-center gap-4 [&_a]:!text-[13px] [&_a]:!font-medium">
          <LandingHeaderActions />
        </div>
      </motion.nav>
    </div>
  );
}