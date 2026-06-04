import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AIOutput, PageHeader } from "@/components/ai-output";
import { planTasks } from "@/lib/ai.functions";
import { toast } from "sonner";
import { Loader2, Wand2 } from "lucide-react";

export const Route = createFileRoute("/planner")({
  head: () => ({ meta: [{ title: "Task Planner — Lumen AI" }] }),
  component: PlannerPage,
});

function PlannerPage() {
  const fn = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState("This week");
  const [hoursPerDay, setHoursPerDay] = useState(6);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOutput("");
    try {
      const res = await fn({ data: { tasks, horizon, hoursPerDay } });
      setOutput(res.text);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to plan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="AI Task Planner" description="Prioritize tasks and build a realistic schedule." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Tasks (one per line)</Label>
              <Textarea required value={tasks} onChange={(e) => setTasks(e.target.value)} rows={10} placeholder="Write quarterly report (due Fri)\nReview PRs\nPrep board deck..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Time horizon</Label>
                <Input value={horizon} onChange={(e) => setHorizon(e.target.value)} placeholder="This week" />
              </div>
              <div className="space-y-2">
                <Label>Focus hrs / day</Label>
                <Input type="number" min={1} max={16} value={hoursPerDay} onChange={(e) => setHoursPerDay(Number(e.target.value))} />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Build Plan
            </Button>
          </form>
        </Card>
        <AIOutput text={output} loading={loading} />
      </div>
    </div>
  );
}
