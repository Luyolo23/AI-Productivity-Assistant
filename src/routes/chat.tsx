import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { AlertCircle, Send, Sparkles, Trash2, User } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chat — Lumen AI" }] }),
  component: ChatPage,
});

const STORAGE_KEY = "lumen.chat.messages.v1";

function loadMessages(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UIMessage[]) : [];
  } catch {
    return [];
  }
}

function ChatPage() {
  const [initial] = useState<UIMessage[]>(() => loadMessages());
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, setMessages, error } = useChat({
    id: "lumen-single",
    messages: initial,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (e) => toast.error(e.message || "Chat error"),
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore quota
    }
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [status]);

  const busy = status === "submitted" || status === "streaming";

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    await sendMessage({ text });
  }

  function clearChat() {
    setMessages([]);
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
    textareaRef.current?.focus();
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-7rem)] max-w-4xl flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">AI Chat</h1>
          <p className="mt-1 text-sm text-muted-foreground">Conversational assistant for anything.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={clearChat} disabled={messages.length === 0}>
          <Trash2 className="mr-2 h-4 w-4" /> New conversation
        </Button>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden p-0">
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-lg font-semibold">How can I help today?</h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Ask anything — brainstorm ideas, draft text, get explanations, or plan your day.
              </p>
            </div>
          )}
          {messages.map((m) => {
            const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
            if (m.role === "user") {
              return (
                <div key={m.id} className="flex justify-end gap-3">
                  <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                    {text}
                  </div>
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <User className="h-4 w-4" />
                  </div>
                </div>
              );
            }
            return (
              <div key={m.id} className="flex gap-3">
                <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="prose-output min-w-0 flex-1 text-sm text-foreground">
                  <ReactMarkdown>{text}</ReactMarkdown>
                </div>
              </div>
            );
          })}
          {status === "submitted" && (
            <div className="flex gap-3">
              <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
              </div>
            </div>
          )}
          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {error.message}
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form onSubmit={onSubmit} className="border-t border-border bg-muted/30 p-3">
          <div className="flex items-end gap-2 rounded-xl border border-border bg-background p-2 shadow-[var(--shadow-card)] focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/15">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit();
                }
              }}
              placeholder="Send a message..."
              rows={1}
              className="min-h-[40px] max-h-40 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
              autoFocus
            />
            <Button type="submit" size="icon" disabled={busy || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 flex items-center gap-1.5 px-1 text-xs text-muted-foreground">
            <AlertCircle className="h-3 w-3" />
            AI-generated content may require human review.
          </div>
        </form>
      </Card>
    </div>
  );
}
