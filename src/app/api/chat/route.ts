import Anthropic from "@anthropic-ai/sdk";
import { getSetting, getCheckIn, getChatMessages, saveChatMessage } from "@/lib/db";
import { getCoachSystemPrompt } from "@/lib/coach-prompt";
import { getWeekForDay } from "@/lib/plan-data";

const anthropic = new Anthropic();

export async function POST(request: Request) {
  const { message } = await request.json();

  // Save user message
  await saveChatMessage("user", message);

  // Get context
  const startDate = await getSetting("start_date");
  let currentDay = 1;
  if (startDate) {
    const diffMs = Date.now() - new Date(startDate).getTime();
    currentDay = Math.min(Math.max(Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1, 1), 30);
  }

  const week = getWeekForDay(currentDay);
  const today = new Date().toISOString().split("T")[0];
  const todayCheckIn = await getCheckIn(today);

  const systemPrompt = getCoachSystemPrompt(
    currentDay,
    week?.theme || "Awareness & Separation",
    todayCheckIn as unknown as Record<string, unknown>
  );

  // Get recent chat history for context
  const history = await getChatMessages();
  const recentMessages = history.slice(-20).map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 1024,
    system: systemPrompt,
    messages: recentMessages,
  });

  const encoder = new TextEncoder();
  let fullResponse = "";

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const text = event.delta.text;
            fullResponse += text;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          }
        }
        // Save complete assistant message
        await saveChatMessage("assistant", fullResponse);
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: errMsg })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
