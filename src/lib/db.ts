import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _supabase;
}

export async function getSetting(key: string): Promise<string | undefined> {
  const { data } = await getSupabase()
    .from("settings")
    .select("value")
    .eq("key", key)
    .single();
  return data?.value;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await getSupabase().from("settings").upsert({ key, value });
}

export interface CheckIn {
  id?: number;
  date: string;
  phone_out_bedroom: number;
  morning_phone_free: number;
  boredom_minutes: number;
  meditation_minutes: number;
  phone_free_walk: number;
  evening_journal: number;
  hardest: string;
  noticed: string;
  proud: string;
  created_at?: string;
}

export async function getCheckIn(date: string): Promise<CheckIn | undefined> {
  const { data } = await getSupabase()
    .from("check_ins")
    .select("*")
    .eq("date", date)
    .single();
  return data ?? undefined;
}

export async function getAllCheckIns(): Promise<CheckIn[]> {
  const { data } = await getSupabase()
    .from("check_ins")
    .select("*")
    .order("date", { ascending: true });
  return data ?? [];
}

export async function saveCheckIn(
  data: Omit<CheckIn, "id" | "created_at">
): Promise<void> {
  await getSupabase().from("check_ins").upsert(data, { onConflict: "date" });
}

export interface ChatMessage {
  id?: number;
  role: string;
  content: string;
  created_at?: string;
}

export async function getChatMessages(): Promise<ChatMessage[]> {
  const { data } = await getSupabase()
    .from("chat_messages")
    .select("*")
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function saveChatMessage(
  role: string,
  content: string
): Promise<void> {
  await getSupabase().from("chat_messages").insert({ role, content });
}

export interface ActionCompletion {
  id?: number;
  date: string;
  day_number: number;
  action_index: number;
  completed: number;
  response_text?: string | null;
  created_at?: string;
}

export async function getActionCompletions(
  date: string,
  dayNumber: number
): Promise<ActionCompletion[]> {
  const { data } = await getSupabase()
    .from("action_completions")
    .select("*")
    .eq("date", date)
    .eq("day_number", dayNumber);
  return data ?? [];
}

export async function saveActionCompletion(
  date: string,
  dayNumber: number,
  actionIndex: number,
  completed: number,
  responseText?: string | null
): Promise<void> {
  const row: Record<string, unknown> = {
    date,
    day_number: dayNumber,
    action_index: actionIndex,
    completed,
  };
  if (responseText !== undefined) {
    row.response_text = responseText;
  }
  await getSupabase()
    .from("action_completions")
    .upsert(row, { onConflict: "date,day_number,action_index" });
}

export async function getActionResponse(
  dayNumber: number,
  actionIndex: number
): Promise<string | null> {
  const { data } = await getSupabase()
    .from("action_completions")
    .select("response_text")
    .eq("day_number", dayNumber)
    .eq("action_index", actionIndex)
    .single();
  return data?.response_text ?? null;
}

export async function getAllActionResponses(): Promise<
  { day_number: number; action_index: number; response_text: string; date: string }[]
> {
  const { data } = await getSupabase()
    .from("action_completions")
    .select("day_number, action_index, response_text, date")
    .not("response_text", "is", null)
    .order("date", { ascending: true });
  return (data ?? []) as { day_number: number; action_index: number; response_text: string; date: string }[];
}
