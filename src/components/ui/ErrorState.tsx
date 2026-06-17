import type { LucideIcon } from "lucide-react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/Button";

type ErrorStateProps = {
  title?: string;
  description: string;
  icon?: LucideIcon;
  onRetry?: () => void;
};

export default function ErrorState({
  title = "Something went wrong",
  description,
  icon: Icon = AlertTriangle,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[1.75rem] border border-amber-200 bg-amber-50/80 px-6 py-12 text-center shadow-soft">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-white text-amber-600">
        <Icon className="size-5" />
      </span>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      {onRetry ? (
        <Button variant="outline" className="mt-6" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
