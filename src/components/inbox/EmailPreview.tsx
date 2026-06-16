import { Reply, Star } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { api } from "@/trpc/client";
import {
  Card,
  CardContent,
} from "@/components/ui/Card";

type Email = {
  id: string;
  subject: string;
  from: string;
  snippet: string;
};

type EmailPreviewProps = {
  email: Email;
};

export default function EmailPreview({
  email,
}: EmailPreviewProps) {
  const utils =
  api.useUtils();

const markReadMutation =
  api.gmail.markRead.useMutation({
    onSuccess: () => {
      utils.gmail.readEmails.invalidate();
    },
  });

const starMutation =
  api.gmail.starEmail.useMutation({
    onSuccess: () => {
      utils.gmail.readEmails.invalidate();
    },
  });
  return (
    <Card className="h-full bg-white">
      <CardContent className="flex h-full flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Avatar className="size-12">
              <AvatarFallback>
                {email.from.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="text-sm font-semibold">
                {email.from}
              </p>

              <p className="text-sm text-muted-foreground">
                Gmail Message
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
  variant="outline"
  size="icon"
  onClick={() =>
    starMutation.mutate({
      emailId: email.id,
    })
  }
>
  <Star className="size-4" />
</Button>
            <Button
  variant="outline"
  size="icon"
  onClick={() =>
    markReadMutation.mutate({
      emailId: email.id,
    })
  }
>
  ✓
</Button>

            <Button size="icon">
              <Reply className="size-4" />
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <Badge variant="primary">
            Gmail
          </Badge>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            {email.subject}
          </h2>
        </div>

        <div className="mt-6 flex-1 rounded-[1.5rem] bg-secondary/70 p-5">
          <p className="whitespace-pre-wrap text-sm leading-8 text-foreground">
            {email.snippet}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}