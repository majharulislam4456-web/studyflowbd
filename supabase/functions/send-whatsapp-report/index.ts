import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/twilio";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const TWILIO_API_KEY = Deno.env.get("TWILIO_API_KEY");
    if (!TWILIO_API_KEY) throw new Error("TWILIO_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all active share codes with whatsapp numbers
    const { data: shares, error: sharesErr } = await supabase
      .from("parent_share_codes")
      .select("*")
      .eq("is_active", true)
      .not("whatsapp_number", "is", null);

    if (sharesErr) throw sharesErr;
    if (!shares || shares.length === 0) {
      return new Response(JSON.stringify({ message: "No active shares" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = new Date();
    const currentHour = now.getUTCHours() + 6; // Bangladesh is UTC+6
    const currentTime = `${(currentHour % 24).toString().padStart(2, "0")}:00`;

    const dueShares = shares.filter((s: any) => s.send_time === currentTime);

    const results = [];
    for (const share of dueShares) {
      const whatsappNumber = (share as any).whatsapp_number;
      if (!whatsappNumber) continue;

      // Get today's study data
      const today = new Date().toISOString().split("T")[0];
      const { data: sessions } = await supabase
        .from("study_sessions")
        .select("duration, subject_id")
        .eq("user_id", share.user_id)
        .gte("session_date", `${today}T00:00:00`)
        .lte("session_date", `${today}T23:59:59`);

      const totalMinutes = (sessions || []).reduce((a: number, s: any) => a + s.duration, 0);
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      const timeStr = hours > 0 ? `${hours} ঘণ্টা ${mins} মিনিট` : `${mins} মিনিট`;

      // Get completed todos today
      const { count: todosCompleted } = await supabase
        .from("todos")
        .select("*", { count: "exact", head: true })
        .eq("user_id", share.user_id)
        .eq("is_completed", true);

      const parentLink = `${supabaseUrl.replace('.supabase.co', '.lovable.app')}/parent/${share.share_code}`;
      // Use the published URL pattern
      const appLink = `https://studytracker10.lovable.app/parent/${share.share_code}`;

      const message =
        `📚 *আজকের পড়াশোনার রিপোর্ট*\n\n` +
        `⏱️ মোট পড়ার সময়: ${timeStr}\n` +
        `✅ সম্পন্ন কাজ: ${todosCompleted || 0}টি\n\n` +
        `🔗 বিস্তারিত দেখুন:\n${appLink}\n\n` +
        `— StudyTracker অ্যাপ থেকে স্বয়ংক্রিয়ভাবে পাঠানো`;

      // Send WhatsApp via Twilio Gateway
      const toNumber = whatsappNumber.startsWith("+") ? whatsappNumber : `+${whatsappNumber}`;
      
      const response = await fetch(`${GATEWAY_URL}/Messages.json`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": TWILIO_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: `whatsapp:${toNumber}`,
          From: "whatsapp:+14155238886", // Twilio WhatsApp sandbox
          Body: message,
        }),
      });

      const data = await response.json();
      results.push({ to: toNumber, status: response.ok ? "sent" : "failed", sid: data.sid });
    }

    return new Response(JSON.stringify({ sent: results.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("WhatsApp send error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});