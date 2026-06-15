import { Search } from "lucide-react";

import { Input } from "@/components/ui/Input";

type EmailSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function EmailSearch({
  value,
  onChange,
}: EmailSearchProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white px-4 py-3 shadow-soft">
      <Search className="size-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search conversations"
        className="h-auto border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
      />
    </div>
  );
}
