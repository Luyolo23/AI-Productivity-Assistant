import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AIOutput, PageHeader } from "@/components/ai-output";
import { summarizeNotes } from "@/lib/ai.functions";
import { toast } from "sonner";
import { Loader2, Wand2 } from "lucide-react";

export const Route = createFileRoute("/notes")({
  head: () => ({ meta: [{ title: "Meeting Notes Summarizer — Lumen AI" }] }),
  component: NotesPage,
});

function NotesPage() {
  const fn = useServerFn(summarizeNotes);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOutput("");
    try {
      const res = await fn({ data: { notes } });
      setOutput(res.text);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to summarize");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Meeting Notes Summarizer" description="Get key points, action items, and deadlines from raw notes." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Paste your meeting notes</Label>
              <Textarea required value={notes} onChange={(e) => setNotes(e.target.value)} rows={16} placeholder="Paste raw meeting notes or a transcript here..." />
            </div>
            <Button type="submit" disabled={loading || notes.trim().length < 10} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Summarize
            </Button>
          </form>
        </Card>
        <AIOutput text={output} loading={loading} />
      </div>
    </div>
  );
}
