import { NextResponse } from "next/server";
import { getSetting, setSetting } from "@/lib/db";

export async function GET() {
  const startDate = await getSetting("start_date");
  if (!startDate) {
    return NextResponse.json({ startDate: null, currentDay: null });
  }
  const start = new Date(startDate);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const currentDay = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  return NextResponse.json({
    startDate,
    currentDay: Math.min(Math.max(currentDay, 1), 30),
  });
}

export async function POST(request: Request) {
  const { startDate } = await request.json();
  await setSetting("start_date", startDate);
  return NextResponse.json({ success: true });
}
