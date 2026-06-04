import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AIOutput, PageHeader } from "@/components/ai-output";
import { generateEmail } from "@/lib/ai.functions";
import { toast } from "sonner";
import { Loader2, Wand2 } from "lucide-react";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Email Generator — Lumen AI" }] }),
  component: EmailPage,
});

function EmailPage() {
  const fn = useServerFn(generateEmail);
  const [purpose, setPurpose] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("Professional");
  const [keyPoints, setKeyPoints] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOutput("");
    try {
      const res = await fn({ data: { purpose, audience, tone, keyPoints } });
      setOutput(res.text);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Smart Email Generator" description="Generate emails tuned to your tone and audience." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Purpose / context</Label>
              <Textarea required value={purpose} onChange={(e) => setPurpose(e.target.value)} rows={4} placeholder="e.g. Follow up after a sales demo and propose next steps." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Audience</Label>
                <Input required value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="VP of Marketing at a SaaS company" />
              </div>
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Professional", "Friendly", "Persuasive", "Concise", "Formal", "Casual", "Apologetic", "Enthusiastic"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Key points <span className="text-muted-foreground">(optional)</span></Label>
              <Textarea value={keyPoints} onChange={(e) => setKeyPoints(e.target.value)} rows={3} placeholder="- Discount expires Friday\n- Include calendar link" />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Generate Email
            </Button>
          </form>
        </Card>
        <AIOutput text={output} loading={loading} />
      </div>
    </div>
  );
}
