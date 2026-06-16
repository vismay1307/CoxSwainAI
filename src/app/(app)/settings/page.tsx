"use client";

import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";

export default function SettingsPage() {
  return (
    <PageContainer className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Integrations
          </CardTitle>

          <CardDescription>
            Connect your accounts
            to enable Gmail,
            GitHub and Calendar
            actions.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <Button
            onClick={() => {
              window.location.href =
                "/api/connect/gmail";
            }}
          >
            Connect Gmail
          </Button>

          <Button
            onClick={() => {
              window.location.href =
                "/api/connect/github";
            }}
          >
            Connect GitHub
          </Button>
        </CardContent>
      </Card>
    </PageContainer>
  );
}