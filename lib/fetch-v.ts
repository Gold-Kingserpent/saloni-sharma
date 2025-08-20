// lib/fetch-v.ts

/**
 * Fetch a VedAstro endpoint THROUGH your Next api proxy
 * Pass a full VedAstro url, we handle encoding and return raw text
 *
 * Example
 *   const txt = await fetchVedastro("https://api.vedastro.org/AllPlanetData?year=2004&...")
 */
export async function fetchVedastro(fullUrl: string): Promise<string> {
  const url = `/api/vedastro-proxy?url=${encodeURIComponent(fullUrl)}`;
  const res = await fetch(url);

  if (!res.ok) {
    const errText = await safeText(res);
    throw new Error(`VedAstro error ${res.status} ${errText.slice(0, 160)}`);
  }

  return await res.text();
}

/**
 * Replace UPPERCASE tokens in a template url with values.
 * Numbers are inserted as-is. Strings are URL-encoded.
 *
 * Example
 *   fill("...year=YEAR&lat=LAT", { YEAR: 2004, LAT: 26.91 })
 */
export function fill(template: string, tokens: Record<string, string | number>): string {
  let out = template;
  for (const [key, value] of Object.entries(tokens)) {
    const re = new RegExp(`\\b${escapeReg(key)}\\b`, "g");
    const v =
      typeof value === "number"
        ? String(value)
        : encodeURIComponent(String(value));
    out = out.replace(re, v);
  }
  return squeeze(out);
}

/**
 * tryJson turns an incoming payload string into a JS object when possible.
 * 1. tries JSON.parse
 * 2. if it looks like XML, parses with DOMParser and returns a flat object
 *    containing common fields we care about like sign, longitude, percent, value
 *
 * It is synchronous on purpose so you can use it anywhere without await.
 */
export function tryJson(text: string): any | null {
  if (!text) return null;

  // JSON first
  const t = text.trim();
  if (t.startsWith("{") || t.startsWith("[")) {
    try {
      return JSON.parse(t);
    } catch {
      // fall through to xml
    }
  }

  // XML fallback in the browser
  if (typeof window !== "undefined" && t.startsWith("<")) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(t, "application/xml");
      const perr = doc.getElementsByTagName("parsererror");
      if (perr && perr.length > 0) return null;

      // common fields we often need
      const get = (tag: string) => {
        const el = doc.getElementsByTagName(tag)[0];
        return el ? el.textContent || "" : "";
      };

      const obj: Record<string, any> = {};
      // generic catch-alls
      const value = get("Value");
      if (value) obj.value = value;

      // signs
      obj.sign = get("Sign") || get("ZodiacSign") || get("Name") || get("sign") || get("zodiac");

      // longitudes
      const lonStr =
        get("Longitude") || get("EclipticLongitude") || get("Lon") || get("lon") || "";
      if (lonStr) obj.longitude = Number(lonStr);

      // kuta percent or score
      const pctStr = get("Percent") || get("Total") || get("Score");
      if (pctStr) obj.percent = Number(pctStr);

      // if nothing useful found, still return a minimal object so callers can inspect
      if (Object.keys(obj).length === 0) return { xml: true };

      return obj;
    } catch {
      return null;
    }
  }

  return null;
}

/* -------------- small internals -------------- */

function escapeReg(s: string) {
  // minimal escape for token keys used in a regex
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function squeeze(s: string) {
  // remove line breaks and extra spaces commonly present in template literals
  return s.replace(/\s+/g, " ").trim();
}

async function safeText(res: Response) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}
