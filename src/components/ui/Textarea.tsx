import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-28 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground transition-all placeholder:text-muted-foreground focus-visible:ring-4 focus-visible:ring-ring/60",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
