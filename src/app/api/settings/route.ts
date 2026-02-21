import { NextResponse } from "next/server";
import { getSetting, setSetting } from "@/lib/db";

export async function GET() {
  const [startDate, userName] = await Promise.all([
    getSetting("start_date"),
    getSetting("user_name"),
  ]);
  if (!startDate) {
    return NextResponse.json({ startDate: null, currentDay: null, userName: userName ?? null });
  }
  const start = new Date(startDate);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const currentDay = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  return NextResponse.json({
    startDate,
    currentDay: Math.min(Math.max(currentDay, 1), 30),
    userName: userName ?? null,
  });
}

export async function POST(request: Request) {
  const { startDate, userName } = await request.json();
  if (startDate !== undefined) {
    await setSetting("start_date", startDate);
  }
  if (userName !== undefined) {
    await setSetting("user_name", userName);
  }
  return NextResponse.json({ success: true });
}
