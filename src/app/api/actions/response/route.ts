import { NextRequest, NextResponse } from "next/server";
import { getActionResponse } from "@/lib/db";

export async function GET(request: NextRequest) {
  const day = request.nextUrl.searchParams.get("day");
  const action = request.nextUrl.searchParams.get("action");
  if (!day || !action) {
    return NextResponse.json({ error: "day and action required" }, { status: 400 });
  }
  const response = await getActionResponse(Number(day), Number(action));
  return NextResponse.json({ response });
}
