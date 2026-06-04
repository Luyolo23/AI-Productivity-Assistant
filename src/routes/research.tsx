import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AIOutput, PageHeader } from "@/components/ai-output";
import { researchTopic } from "@/lib/ai.functions";
import { toast } from "sonner";
import { Loader2, Wand2 } from "lucide-react";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "Research Assistant — Lumen AI" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const fn = useServerFn(researchTopic);
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState<"brief" | "standard" | "deep">("standard");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOutput("");
    try {
      const res = await fn({ data: { topic, depth } });
      setOutput(res.text);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to research");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="AI Research Assistant" description="Get structured insights and summaries on any topic." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Topic or question</Label>
              <Input required value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="State of vertical AI agents in 2026" />
            </div>
            <div className="space-y-2">
              <Label>Depth</Label>
              <Select value={depth} onValueChange={(v) => setDepth(v as typeof depth)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="brief">Brief</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="deep">Deep</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Research
            </Button>
          </form>
        </Card>
        <AIOutput text={output} loading={loading} />
      </div>
    </div>
  );
}
