import Anthropic from "@anthropic-ai/sdk";
import { getSetting, getAllCheckIns, getAllActionResponses, getChatMessages, saveChatMessage } from "@/lib/db";
import { getCoachSystemPrompt } from "@/lib/coach-prompt";
import { getWeekForDay } from "@/lib/plan-data";

const anthropic = new Anthropic();

export async function POST(request: Request) {
  const { message, autoGreet } = await request.json();

  // For auto-greet, don't save a user message — the coach speaks first
  if (!autoGreet) {
    await saveChatMessage("user", message);
  }

  // Get context
  const startDate = await getSetting("start_date");
  let currentDay = 1;
  if (startDate) {
    const diffMs = Date.now() - new Date(startDate).getTime();
    currentDay = Math.min(Math.max(Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1, 1), 30);
  }

  const week = getWeekForDay(currentDay);
  const [allCheckIns, actionResponses] = await Promise.all([
    getAllCheckIns(),
    getAllActionResponses(),
  ]);

  const systemPrompt = getCoachSystemPrompt(
    currentDay,
    week?.theme || "Awareness & Separation",
    allCheckIns as unknown as Record<string, unknown>[],
    actionResponses
  );

  // Get recent chat history for context
  const history = await getChatMessages();
  const recentMessages = history.slice(-20).map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  // For auto-greet, add a hidden prompt so the coach opens the conversation
  if (autoGreet) {
    recentMessages.push({
      role: "user",
      content: "I just opened the chat. Greet me warmly in one short sentence, then ask whether I'd like to: (1) talk about what I've done so far today, or (2) get context on today's actions and daily habits. Keep it to 2-3 sentences max — casual, like a friend checking in. Don't dive into details yet, just offer the choice.",
    });
  }

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
