"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = ({
  className,
  inset,
  children,
  ...props
}: DropdownMenuPrimitive.DropdownMenuSubTriggerProps & {
  inset?: boolean;
}) => (
  <DropdownMenuPrimitive.SubTrigger
    className={cn(
      "flex cursor-default items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none select-none focus:bg-secondary data-[state=open]:bg-secondary",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto size-4" />
  </DropdownMenuPrimitive.SubTrigger>
);

const DropdownMenuSubContent = ({
  className,
  ...props
}: DropdownMenuPrimitive.DropdownMenuSubContentProps) => (
  <DropdownMenuPrimitive.SubContent
    className={cn(
      "z-50 min-w-48 rounded-2xl border border-white/80 bg-white p-1.5 shadow-panel",
      className
    )}
    {...props}
  />
);

const DropdownMenuContent = ({
  className,
  sideOffset = 8,
  ...props
}: DropdownMenuPrimitive.DropdownMenuContentProps) => (
  <DropdownMenuPortal>
    <DropdownMenuPrimitive.Content
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-48 rounded-2xl border border-white/80 bg-white p-1.5 shadow-panel",
        className
      )}
      {...props}
    />
  </DropdownMenuPortal>
);

const DropdownMenuItem = ({
  className,
  inset,
  ...props
}: DropdownMenuPrimitive.DropdownMenuItemProps & {
  inset?: boolean;
}) => (
  <DropdownMenuPrimitive.Item
    className={cn(
      "relative flex cursor-default items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none select-none focus:bg-secondary data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
);

const DropdownMenuCheckboxItem = ({
  className,
  children,
  checked,
  ...props
}: DropdownMenuPrimitive.DropdownMenuCheckboxItemProps) => (
  <DropdownMenuPrimitive.CheckboxItem
    className={cn(
      "relative flex cursor-default items-center rounded-lg py-2 pr-3 pl-8 text-sm outline-none select-none focus:bg-secondary data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-3 flex size-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="size-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
);

const DropdownMenuRadioItem = ({
  className,
  children,
  ...props
}: DropdownMenuPrimitive.DropdownMenuRadioItemProps) => (
  <DropdownMenuPrimitive.RadioItem
    className={cn(
      "relative flex cursor-default items-center rounded-lg py-2 pr-3 pl-8 text-sm outline-none select-none focus:bg-secondary data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-3 flex size-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="size-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
);

const DropdownMenuLabel = ({
  className,
  inset,
  ...props
}: DropdownMenuPrimitive.DropdownMenuLabelProps & {
  inset?: boolean;
}) => (
  <DropdownMenuPrimitive.Label
    className={cn("px-3 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase", inset && "pl-8", className)}
    {...props}
  />
);

const DropdownMenuSeparator = ({
  className,
  ...props
}: DropdownMenuPrimitive.DropdownMenuSeparatorProps) => (
  <DropdownMenuPrimitive.Separator className={cn("my-1 h-px bg-border", className)} {...props} />
);

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.ComponentProps<"span">) => {
  return <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />;
};

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
