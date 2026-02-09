"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: string;
  content: string;
}

const REVEAL_INTERVAL_MS = 20;
const CHARS_PER_TICK = 2;

export default function ChatView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Gradual reveal state kept in refs to avoid re-render conflicts
  const streamBuffer = useRef("");
  const revealedCount = useRef(0);
  const revealTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch("/api/messages")
      .then((r) => r.json())
      .then((data: Message[]) => setMessages(data));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const stopRevealTimer = useCallback(() => {
    if (revealTimer.current) {
      clearInterval(revealTimer.current);
      revealTimer.current = null;
    }
  }, []);

  const startRevealTimer = useCallback(() => {
    if (revealTimer.current) return;
    revealTimer.current = setInterval(() => {
      const target = streamBuffer.current.length;
      if (revealedCount.current >= target) return;

      revealedCount.current = Math.min(
        revealedCount.current + CHARS_PER_TICK,
        target
      );
      const revealed = streamBuffer.current.slice(0, revealedCount.current);

      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.role === "assistant") {
          updated[updated.length - 1] = { ...last, content: revealed };
        }
        return updated;
      });
    }, REVEAL_INTERVAL_MS);
  }, []);

  // Flush any remaining buffered text when streaming ends
  const flushBuffer = useCallback(() => {
    stopRevealTimer();
    const final = streamBuffer.current;
    if (final) {
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.role === "assistant") {
          updated[updated.length - 1] = { ...last, content: final };
        }
        return updated;
      });
    }
    streamBuffer.current = "";
    revealedCount.current = 0;
  }, [stopRevealTimer]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || streaming) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setStreaming(true);

    // Reset buffer
    streamBuffer.current = "";
    revealedCount.current = 0;

    // Add placeholder for assistant
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return;

      startRevealTimer();

      let parseBuffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        parseBuffer += decoder.decode(value, { stream: true });
        const lines = parseBuffer.split("\n");
        parseBuffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                streamBuffer.current += parsed.text;
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      stopRevealTimer();
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.role === "assistant" && !last.content) {
          updated[updated.length - 1] = {
            ...last,
            content: "I'm having trouble connecting right now. Please try again.",
          };
        }
        return updated;
      });
    }

    flushBuffer();
    setStreaming(false);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => stopRevealTimer();
  }, [stopRevealTimer]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-60px)] max-w-lg mx-auto font-[family-name:var(--font-inter)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-surface-light flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
              </svg>
            </div>
            <div>
              <p className="font-serif text-xl font-light">Your Coach</p>
              <p className="text-text-secondary text-sm mt-1">
                Ask anything about your reset journey.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-accent text-background rounded-br-md"
                  : "bg-surface-light text-foreground rounded-bl-md"
              }`}
            >
              {msg.content ? (
                msg.role === "assistant" ? (
                  <div className="prose-chat">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )
              ) : (
                <span className="flex gap-1">
                  <span className="typing-dot w-1.5 h-1.5 rounded-full bg-text-secondary" />
                  <span className="typing-dot w-1.5 h-1.5 rounded-full bg-text-secondary" />
                  <span className="typing-dot w-1.5 h-1.5 rounded-full bg-text-secondary" />
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-5 pb-20 pt-2 border-t border-surface-light bg-background">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share what's on your mind..."
            rows={1}
            className="flex-1 bg-surface-light rounded-2xl px-4 py-3 text-sm text-foreground placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-accent resize-none max-h-32"
            style={{ minHeight: "44px" }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || streaming}
            className="bg-accent hover:bg-accent-muted disabled:opacity-30 text-background p-3 rounded-full transition-colors shrink-0"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
