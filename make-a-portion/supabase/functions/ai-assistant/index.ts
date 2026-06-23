// Make A Portion - AI cooking assistant (Supabase Edge Function).
// Calls Google Gemini server-side so the API key is never exposed to the browser.
// The key is read from the GEMINI_API_KEY secret (set in Supabase, never committed).
//
// Request  (POST):  { "messages": [{ "role": "user" | "assistant", "content": "..." }] }
// Response (200):   { "reply": "..." }

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/" +
  GEMINI_MODEL +
  ":generateContent";

// A short Hebrew persona so answers fit the app.
const SYSTEM_PROMPT = [
  'אתה "השף של Make A Portion", עוזר בישול ידידותי באפליקציית מתכונים.',
  "ענה תמיד בעברית, בקצרה ולעניין. עזור בשאלות בישול, החלפת מרכיבים, התאמות כמויות,",
  "טכניקות, וטיפים. כשמבקשים - הצע רעיונות למתכונים עם רשימת מרכיבים קצרה ושלבי הכנה.",
  "אם שואלים משהו שאינו קשור לאוכל ובישול, החזר בעדינות לנושא.",
].join("\n");

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) return json({ error: "Missing GEMINI_API_KEY secret." }, 500);

  let messages: Array<{ role: string; content: string }> = [];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }
  if (messages.length === 0) return json({ error: "No messages provided." }, 400);

  // Keep only the last ~12 turns to stay light on tokens.
  const trimmed = messages.slice(-12);

  // Map our roles to Gemini's ("assistant" -> "model").
  const contents = trimmed.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: String(m.content ?? "") }],
  }));

  const payload = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents,
    generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
  };

  let res: Response;
  try {
    res = await fetch(GEMINI_URL + "?key=" + apiKey, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    return json({ error: "Failed to reach Gemini.", detail: String(err) }, 502);
  }

  if (!res.ok) {
    const detail = await res.text();
    return json({ error: "Gemini API error.", status: res.status, detail }, 502);
  }

  const data = await res.json();
  const reply =
    data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text ?? "")
      .join("") ?? "";

  if (!reply) return json({ error: "Empty response from Gemini." }, 502);
  return json({ reply });
});
