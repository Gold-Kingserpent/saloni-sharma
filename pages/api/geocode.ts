// pages/api/geocode.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function geocode(req: NextApiRequest, res: NextApiResponse) {
  try {
    const q = String(req.query.q || "").trim();
    if (!q) {
      res.status(400).json({ error: "missing query q" });
      return;
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&q=${encodeURIComponent(
      q
    )}`;

    const r = await fetch(url, {
      headers: {
        "User-Agent": "saloni-birthday-site geocoder",
        Accept: "application/json",
      },
    });

    if (!r.ok) {
      res.status(r.status).json({ error: "geocode upstream error" });
      return;
    }

    const data = await r.json();
    if (!Array.isArray(data) || data.length === 0) {
      res.status(404).json({ error: "place not found" });
      return;
    }

    const hit = data[0];
    res.status(200).json({
      lat: Number(hit.lat),
      lon: Number(hit.lon),
      name: hit.display_name,
    });
  } catch (e) {
    res.status(500).json({ error: "geocode error" });
  }
}
