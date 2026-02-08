import { NextRequest, NextResponse } from "next/server";
import { getCheckIn, getAllCheckIns, saveCheckIn } from "@/lib/db";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  if (date) {
    const checkIn = await getCheckIn(date);
    return NextResponse.json(checkIn || null);
  }
  const checkIns = await getAllCheckIns();
  return NextResponse.json(checkIns);
}

export async function POST(request: Request) {
  const data = await request.json();
  await saveCheckIn(data);
  return NextResponse.json({ success: true });
}
