import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type Email = {
  id: string;
  subject: string;
  from: string;
  snippet: string;
};

type EmailListItemProps = {
  email: Email;
  isActive: boolean;
  onSelect: () => void;
};

export default function EmailListItem({
  email,
  isActive,
  onSelect,
}: EmailListItemProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-[1.5rem] border p-4 text-left transition-all",
        isActive
          ? "border-primary/20 bg-blue-50 shadow-soft"
          : "border-transparent bg-white/70 hover:border-white/80 hover:bg-white hover:shadow-soft"
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="size-11">
          <AvatarFallback>
            {email.from.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {email.from}
          </p>

          <p className="mt-1 truncate text-sm text-foreground">
            {email.subject}
          </p>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {email.snippet}
          </p>

          <div className="mt-3">
            <Badge variant="outline">
              Gmail
            </Badge>
          </div>
        </div>
      </div>
    </button>
  );
}