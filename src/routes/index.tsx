import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Mail, FileText, ListChecks, Search, MessageSquare, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumen AI — Your AI Workspace" },
      { name: "description", content: "Smart AI tools for emails, meeting notes, planning, research, and chat." },
    ],
  }),
  component: Index,
});

const tools = [
  { to: "/email", title: "Smart Email Generator", desc: "Draft emails tuned to your tone and audience.", icon: Mail },
  { to: "/notes", title: "Meeting Notes Summarizer", desc: "Pull out key points, actions, and deadlines.", icon: FileText },
  { to: "/planner", title: "AI Task Planner", desc: "Prioritize and schedule your week.", icon: ListChecks },
  { to: "/research", title: "AI Research Assistant", desc: "Get structured insights on any topic.", icon: Search },
  { to: "/chat", title: "AI Chat", desc: "Free-form conversation with your assistant.", icon: MessageSquare },
] as const;

function Index() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-muted-foreground">Pick a tool to get started.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link key={t.to} to={t.to} className="group">
            <Card className="h-full p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-elevated)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">

                <t.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{t.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Open <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
