import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-xl border border-border bg-white px-4 py-2 text-sm text-foreground shadow-none transition-all placeholder:text-muted-foreground focus-visible:ring-4 focus-visible:ring-ring/60",
        className
      )}
      {...props}
    />
  );
}

export { Input };
