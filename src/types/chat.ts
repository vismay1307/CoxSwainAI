import type {
  SuggestedAction,
  ToolResultCard,
  WorkspaceRoute,
} from "@/lib/command-center";

export type ChatMessageRecord = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  route?: WorkspaceRoute;
  toolResults?: ToolResultCard[];
  actions?: SuggestedAction[];
};