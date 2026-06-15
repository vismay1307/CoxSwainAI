import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/Button";

type SuggestedPromptsProps = {
  prompts: string[];
  onSelect: (prompt: string) => void;
};

export default function SuggestedPrompts({
  prompts,
  onSelect,
}: SuggestedPromptsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {prompts.map((prompt) => (
        <Button
          key={prompt}
          type="button"
          variant="outline"
          className="h-auto rounded-full px-4 py-2 text-left text-sm text-muted-foreground"
          onClick={() => onSelect(prompt)}
        >
          <Sparkles className="size-4 text-primary" />
          {prompt}
        </Button>
      ))}
    </div>
  );
}
