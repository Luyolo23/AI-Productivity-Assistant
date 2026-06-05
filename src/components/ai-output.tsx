import ReactMarkdown from "react-markdown";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export function AIOutput({ text, loading }: { text?: string; loading?: boolean }) {
  if (!text && !loading) return null;
  return (
    <Card className="border-border/70 bg-card/80 p-5 shadow-[var(--shadow-card)] backdrop-blur">
      {loading && !text ? (
        <div className="space-y-3">
          <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-11/12 animate-pulse rounded bg-muted" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
        </div>
      ) : (
        <div className="prose-output text-sm text-foreground">
          <ReactMarkdown>{text || ""}</ReactMarkdown>
        </div>
      )}
      <div className="mt-5 flex items-start gap-2 rounded-md border border-border bg-muted/50 p-3 text-xs text-muted-foreground">
        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>AI-generated content may require human review.</span>
      </div>
    </Card>
  );
}

export function PageHeader({ title, description }: { title: string; description: string }) {
  const words = title.split(" ");
  const last = words.pop() ?? "";
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-normal tracking-tight md:text-4xl">
        {words.join(" ")} <span className="font-serif italic text-primary">{last}</span>
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
