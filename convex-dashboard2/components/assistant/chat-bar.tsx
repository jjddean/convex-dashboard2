"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Link from "next/link";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string | JSX.Element;
  ts: number;
};

export default function ChatBar({
  welcome = "Hi! I'm your AI assistant. Ask me about quotes, bookings, shipments, documents, or payments.",
}: {
  welcome?: string;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: welcome,
      ts: Date.now(),
    },
  ]);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  function addMessage(msg: Omit<ChatMessage, "id" | "ts">) {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), ts: Date.now(), ...msg },
    ]);
  }

  function basicAssistantReply(text: string): JSX.Element | string {
    // very light logic to make the placeholder useful until real integrations are wired up
    const lower = text.toLowerCase().trim();

    // Track intent
    const trackMatch = lower.match(/track\s+([\w-]+)/);
    if (trackMatch) {
      const trackingNumber = trackMatch[1];
      return (
        <span>
          I can help you track that. Open your shipments page prefilled with this tracking number: {" "}
          <Link className="underline" href={`/user/shipments?track=${encodeURIComponent(trackingNumber)}`}>
            View tracking {trackingNumber}
          </Link>
          .
        </span>
      );
    }

    // Quote intent
    if (lower.includes("quote")) {
      return "To get an instant quote, use the Get Instant Quote action on the home page. Once we connect external pricing APIs, I'll generate options right here in chat.";
    }

    // Booking intent
    if (lower.includes("book") || lower.includes("booking")) {
      return "You can convert a saved quote into a booking from the Quotes page. Soon, I’ll handle booking directly in this chat.";
    }

    // Document intent
    if (lower.includes("document") || lower.includes("invoice") || lower.includes("waybill") || lower.includes("bol")) {
      return "Head to Documents to create templates. I’ll assist with auto-filling and validations once integrations are added.";
    }

    // Fallback
    return "Got it! I’m set up and ready. I’ll become fully autonomous once we wire external APIs. What would you like to do next?";
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || pending) return;

    addMessage({ role: "user", content: text });
    setInput("");
    setPending(true);

    // Simulate thinking and respond with local placeholder logic
    await new Promise((r) => setTimeout(r, 500));
    const reply = basicAssistantReply(text);
    addMessage({ role: "assistant", content: reply });
    setPending(false);
  }

  function clearChat() {
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: welcome,
        ts: Date.now(),
      },
    ]);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        size="lg"
        className="shadow-lg"
        onClick={() => setOpen(true)}
      >
        <Sparkles className="mr-2 h-4 w-4" /> Ask AI
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex w-full sm:max-w-lg flex-col p-0">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <div>
                <SheetTitle>AI Assistant</SheetTitle>
                <SheetDescription className="text-xs">Lightweight local assistant. API integrations coming soon.</SheetDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close chat">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  )}
                >
                  {typeof m.content === "string" ? m.content : m.content}
                </div>
              </div>
            ))}
            {pending && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground rounded-2xl rounded-bl-sm px-3 py-2 text-sm opacity-80">
                  Thinking…
                </div>
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="border-t p-3">
            <div className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about quotes, bookings, or shipments…"
                autoFocus
              />
              <Button type="submit" disabled={pending || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 flex justify-between">
              <button type="button" onClick={clearChat} className="text-xs text-muted-foreground hover:underline">
                Clear chat
              </button>
              <div className="text-[10px] text-muted-foreground">
                Prototype — no external API calls yet
              </div>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}