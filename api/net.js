// Returns a short code for the caller's network. Phones on the same Wi-Fi or the same hotspot share
// one public address, so they get the same code and can find each other's rooms. The address itself
// is never returned or stored.
import { createHash } from "node:crypto";

export default function handler(req, res) {
  const raw = String(req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || "").split(",")[0].trim();
  // IPv6: phones on one network share the first 64 bits
  const base = raw.includes(":") ? raw.split(":").slice(0, 4).join(":") : raw;
  const key = base ? createHash("sha256").update("imposter-net|" + base).digest("hex").slice(0, 12) : "";
  res.setHeader("cache-control", "no-store");
  res.status(200).json({ key });
}
