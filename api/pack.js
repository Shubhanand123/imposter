// Writes an AI word pack for the public site. Needs ANTHROPIC_API_KEY in the Vercel project's environment variables.
import Anthropic from "@anthropic-ai/sdk";

const schema = {
  type: "object",
  properties: { name: { type: "string" }, words: { type: "array", items: { type: "string" } } },
  required: ["name", "words"],
  additionalProperties: false,
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "post_only" });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: "not_configured" });
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  const topic = String(body?.topic ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, 60);
  if (!topic) return res.status(400).json({ error: "no_topic" });

  const client = new Anthropic();
  try {
    const msg = await client.messages.create({
      model: "claude-haiku-5-5",
      max_tokens: 2000,
      output_config: { effort: "low", format: { type: "json_schema", schema } },
      messages: [{
        role: "user",
        content: `You write word packs for "Imposter", a party game: everyone but the imposter sees one secret word from the pack, so words must be well-known, concrete, distinct from each other, guessable from one-word clues, and family-friendly. Theme: "${topic}". Give a short pack title (2-4 words) and exactly 20 words, each 1-3 words.`,
      }],
    });
    if (msg.stop_reason === "refusal") return res.status(422).json({ error: "refused" });
    const text = msg.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    const out = JSON.parse(text);
    const words = [...new Set((out.words ?? []).map((w) => String(w).trim()).filter(Boolean))].slice(0, 24);
    if (words.length < 6) return res.status(502).json({ error: "thin" });
    return res.status(200).json({ name: String(out.name || topic).slice(0, 40), words });
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) return res.status(429).json({ error: "rate_limited" });
    if (e instanceof Anthropic.APIError) return res.status(502).json({ error: "upstream", status: e.status });
    return res.status(500).json({ error: "failed" });
  }
}
