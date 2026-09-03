// Живая связь с базой. База сама толкает изменения на экран.
// Если ниточка оборвётся — возвращаемся к переспросу, но молча замереть не можем.
import { createClient, type RealtimeChannel } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "./config";

const client = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
  realtime: { params: { eventsPerSecond: 20 } }
});

export type LiveState = "живая" | "переспрос";

export function listen(
  tables: string[],
  onChange: () => void,
  onState: (s: LiveState) => void
): () => void {
  let channel: RealtimeChannel | null = null;
  let poll: ReturnType<typeof setInterval> | null = null;

  const startPolling = () => {
    if (poll) return;
    onState("переспрос");
    poll = setInterval(onChange, 10_000);
  };
  const stopPolling = () => {
    if (poll) { clearInterval(poll); poll = null; }
  };

  channel = client.channel("урок");
  for (const table of tables) {
    channel = channel.on("postgres_changes",
      { event: "*", schema: "public", table }, () => onChange());
  }
  channel.subscribe(status => {
    if (status === "SUBSCRIBED") { stopPolling(); onState("живая"); }
    else startPolling();
  });

  // если за пятнадцать секунд связь не встала — не ждём молча
  const guard = setTimeout(() => {
    if (!poll) startPolling();
  }, 15_000);

  return () => {
    clearTimeout(guard);
    stopPolling();
    if (channel) void client.removeChannel(channel);
  };
}
