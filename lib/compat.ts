// lib\compat.ts
export type Signs = { sun: string; sunLon: number; moon: string; moonLon: number };

const ELEMENT: Record<string,string> = {
  Aries:"Fire", Taurus:"Earth", Gemini:"Air", Cancer:"Water",
  Leo:"Fire", Virgo:"Earth", Libra:"Air", Scorpio:"Water",
  Sagittarius:"Fire", Capricorn:"Earth", Aquarius:"Air", Pisces:"Water"
};
const MODALITY: Record<string,string> = {
  Aries:"Cardinal", Cancer:"Cardinal", Libra:"Cardinal", Capricorn:"Cardinal",
  Taurus:"Fixed", Leo:"Fixed", Scorpio:"Fixed", Aquarius:"Fixed",
  Gemini:"Mutable", Virgo:"Mutable", Sagittarius:"Mutable", Pisces:"Mutable"
};

function elemHarmony(a: string, b: string): number {
  const e1 = ELEMENT[a], e2 = ELEMENT[b];
  if (!e1 || !e2) return 0.6;
  if (e1 === e2) return 1.0;
  const pair = new Set([e1, e2]);
  if (pair.has("Fire") && pair.has("Air")) return 0.85;
  if (pair.has("Earth") && pair.has("Water")) return 0.85;
  if (pair.has("Fire") && pair.has("Water")) return 0.45;
  if (pair.has("Earth") && pair.has("Air")) return 0.55;
  return 0.70;
}
function modalityAdj(a: string, b: string): number {
  const m1 = MODALITY[a], m2 = MODALITY[b];
  if (!m1 || !m2) return 0;
  if (m1 === m2) {
    if (m1 === "Fixed") return -8;
    if (m1 === "Cardinal") return -4;
    return 4; // Mutable
  }
  return 2;
}
function ang(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}
function aspectScore(a: number, b: number): number {
  const d = ang(a, b);
  const aspects = [
    { deg: 0,   val: 24 },
    { deg: 60,  val: 16 },
    { deg: 90,  val: -14 },
    { deg: 120, val: 22 },
    { deg: 180, val: -18 },
  ];
  const orb = 6;
  let best = 0;
  for (const asp of aspects) {
    const diff = Math.abs(d - asp.deg);
    if (diff <= orb) {
      const falloff = 1 - diff / orb;
      best = Math.max(best, asp.val * falloff);
    }
  }
  return best; // approx -18..+24
}
function clamp01(x: number) { return Math.max(0, Math.min(1, x)); }

export function friendship(a: Signs, b: Signs): number {
  const sunElem = elemHarmony(a.sun, b.sun);
  const moonElem = elemHarmony(a.moon, b.moon);
  const elemAvg = (sunElem + moonElem) / 2;

  const mm = aspectScore(a.moonLon, b.moonLon);
  const moda = modalityAdj(a.sun, b.sun) + modalityAdj(a.moon, b.moon);
  const variety = a.sun !== b.sun && a.moon !== b.moon ? 1 : 0;

  const mmN = clamp01((mm + 18) / 42);
  const modaN = clamp01((moda + 16) / 32);

  const score = 0.40*elemAvg + 0.30*mmN + 0.20*modaN + 0.10*variety;
  return Math.round(score * 100);
}

export function work(a: Signs, b: Signs): number {
  const eA = ELEMENT[a.sun], eB = ELEMENT[b.sun];
  const hostile =
    (eA === "Fire" && eB === "Water") || (eA === "Water" && eB === "Fire") ||
    (eA === "Earth" && eB === "Air")   || (eA === "Air" && eB === "Earth");
  const elemBalance = hostile ? 0.4 : a.sun !== b.sun ? 1 : 0.6;

  const modaPair = modalityAdj(a.sun, b.sun) + modalityAdj(a.moon, b.moon);
  const modaN = clamp01((modaPair + 16) / 32);

  const sunAsp = aspectScore(a.sunLon, b.sunLon);
  const moonAsp = aspectScore(a.moonLon, b.moonLon);
  const sunN = clamp01((sunAsp + 18) / 42);
  const moonN = clamp01((moonAsp + 18) / 42);

  const score = 0.35*modaN + 0.35*elemBalance + 0.20*sunN + 0.10*moonN;
  return Math.round(score * 100);
}
