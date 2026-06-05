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
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          AI Workspace
        </div>
        <h1 className="mt-4 text-4xl font-normal tracking-tight md:text-5xl">
          Welcome <span className="font-serif italic text-primary">back</span>
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          A calm, focused space for writing, planning and research. Pick a tool to begin.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link key={t.to} to={t.to} className="group">
            <Card className="relative h-full overflow-hidden border-border/70 bg-card/80 p-5 backdrop-blur transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-elevated)]">
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-secondary text-accent-foreground ring-1 ring-border/60 transition-transform duration-300 group-hover:scale-105">
                <t.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-base font-semibold">{t.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
              <div className="mt-5 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Open <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
