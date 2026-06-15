import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 shrink-0 focus-visible:ring-4 focus-visible:ring-ring/50 focus-visible:outline-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-soft hover:-translate-y-0.5 hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border border-border bg-white/80 text-foreground hover:bg-secondary",
        ghost: "text-muted-foreground hover:bg-secondary hover:text-foreground",
        danger:
          "bg-danger text-white shadow-soft hover:-translate-y-0.5 hover:bg-danger/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 px-6 text-sm",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
