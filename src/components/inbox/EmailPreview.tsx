import { Reply, Share2, Star } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import type { EmailRecord } from "@/lib/mock-data";

type EmailPreviewProps = {
  email: EmailRecord;
};

export default function EmailPreview({
  email,
}: EmailPreviewProps) {
  return (
    <Card className="h-full bg-white">
      <CardContent className="flex h-full flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Avatar className="size-12">
              <AvatarFallback>{email.sender.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{email.sender}</p>
              <p className="text-sm text-muted-foreground">{email.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" aria-label="Star email">
              <Star className="size-4" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Share email">
              <Share2 className="size-4" />
            </Button>
            <Button size="icon" aria-label="Reply to email">
              <Reply className="size-4" />
            </Button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {email.labels.map((label) => (
            <Badge key={label} variant="primary">
              {label}
            </Badge>
          ))}
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold tracking-tight">{email.subject}</h2>
          <p className="mt-2 text-sm text-muted-foreground">Received {email.time}</p>
        </div>

        <div className="mt-6 flex-1 rounded-[1.5rem] bg-secondary/70 p-5">
          <p className="whitespace-pre-wrap text-sm leading-8 text-foreground">{email.body}</p>
        </div>
      </CardContent>
    </Card>
  );
}
