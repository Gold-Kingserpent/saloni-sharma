import type { NextApiRequest, NextApiResponse } from "next";

const ALLOWED = [
  "https://api.vedastro.org",
  "https://vedastro.org/api",
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const raw = String(req.query.url || "");
    const debug = String(req.query.debug || "") === "1";

    if (!raw) return res.status(400).json({ error: "missing url" });
    if (!ALLOWED.some(p => raw.startsWith(p))) {
      return res.status(400).json({ error: "url must start with https://api.vedastro.org" });
    }

    const upstream = await fetch(raw, {
      headers: { "User-Agent": "saloni-birthday-site/1.0" },
      redirect: "follow",
    });

    const text = await upstream.text();
    const first = text.slice(0, 400);

    // Log to your dev terminal
    console.log("[vedastro-proxy]");
    console.log("status:", upstream.status);
    console.log("url:", raw);
    console.log("first 400 chars:", first.replace(/\n/g, " "));

    if (debug) {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      return res.status(200).json({
        proxiedUrl: raw,
        status: upstream.status,
        preview: first,
      });
    }

    // Pass through as text so you can see it in the browser tab
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(upstream.status).send(text);
  } catch (e: any) {
    console.error("[vedastro-proxy error]", e?.message || e);
    return res.status(500).json({ error: "proxy failed", detail: e?.message || String(e) });
  }
}
