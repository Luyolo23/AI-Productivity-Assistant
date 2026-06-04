import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

function getModel() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key)(MODEL);
}

const EmailInput = z.object({
  purpose: z.string().min(1).max(2000),
  audience: z.string().min(1).max(500),
  tone: z.string().min(1).max(100),
  keyPoints: z.string().max(2000).optional().default(""),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EmailInput.parse(d))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You are an expert business writer. Generate polished, ready-to-send emails. Always return: a Subject line, then the email body. Use the requested tone and audience. Keep it concise, scannable, and professional. Use markdown.",
      prompt: `Write an email.

Purpose / context:
${data.purpose}

Audience: ${data.audience}
Tone: ${data.tone}
Key points to include:
${data.keyPoints || "(none provided)"}

Output format:
**Subject:** <subject line>

<email body with greeting, body paragraphs, sign-off>`,
    });
    return { text };
  });

const NotesInput = z.object({ notes: z.string().min(10).max(20000) });

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => NotesInput.parse(d))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You summarize meeting notes for busy professionals. Be precise. Use markdown sections.",
      prompt: `Summarize the following meeting notes.

Return markdown with these exact sections:
## Summary
2-4 sentence overview.
## Key Points
- Bulleted decisions and discussion highlights.
## Action Items
- [Owner] Task — Deadline (if mentioned)
## Deadlines
- Date — What's due
## Open Questions
- ...

Notes:
"""
${data.notes}
"""`,
    });
    return { text };
  });

const PlannerInput = z.object({
  tasks: z.string().min(1).max(5000),
  horizon: z.string().min(1).max(100),
  hoursPerDay: z.number().min(1).max(16).optional().default(6),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => PlannerInput.parse(d))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You are a productivity coach. Prioritize tasks using Eisenhower (urgent/important) and create a realistic schedule.",
      prompt: `Plan these tasks over: ${data.horizon}. Available focus time: ~${data.hoursPerDay}h/day.

Tasks:
"""
${data.tasks}
"""

Return markdown:
## Prioritized List
Table with columns: Task | Priority (P1-P4) | Estimate | Rationale
## Schedule
Day-by-day plan with time blocks.
## Risks & Tips
Short bullets.`,
    });
    return { text };
  });

const ResearchInput = z.object({
  topic: z.string().min(2).max(1000),
  depth: z.enum(["brief", "standard", "deep"]).default("standard"),
});

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ResearchInput.parse(d))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You are a rigorous research assistant. Provide structured, neutral, well-organized insights. Note when something may need verification.",
      prompt: `Research topic: ${data.topic}
Depth: ${data.depth}

Return markdown:
## Overview
## Key Insights
- Bullets with concrete facts.
## Trends & Context
## Notable Perspectives
## Suggested Next Questions
## Caveats
Any uncertainty or items requiring verification.`,
    });
    return { text };
  });
