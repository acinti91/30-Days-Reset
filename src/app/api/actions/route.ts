import { NextRequest, NextResponse } from "next/server";
import { getActionCompletions, saveActionCompletion } from "@/lib/db";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  const day = request.nextUrl.searchParams.get("day");
  if (!date || !day) {
    return NextResponse.json({ error: "date and day required" }, { status: 400 });
  }
  const completions = await getActionCompletions(date, Number(day));
  return NextResponse.json(completions);
}

export async function POST(request: Request) {
  const { date, dayNumber, actionIndex, completed, responseText } = await request.json();
  await saveActionCompletion(date, dayNumber, actionIndex, completed, responseText);
  return NextResponse.json({ success: true });
}
