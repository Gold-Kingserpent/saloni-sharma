// pages/personality.tsx
import { useMemo, useState } from "react";
import Head from "next/head";

/* ---------------- Fixed data for Saloni ---------------- */
const SALONI = {
  name: "Saloni",
  sun: "Leo",
};

const ZODIAC = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
] as const;
type Zodiac = (typeof ZODIAC)[number];

type Scores = { romantic: number; friendship: number; work: number };

function clamp01(x: number) { return Math.max(0, Math.min(1, x)); }
function clamp100(n: number) { return Math.max(0, Math.min(100, Math.round(n))); }
function wheelDist(aIdx: number, bIdx: number) {
  return Math.min((12 + aIdx - bIdx) % 12, (12 + bIdx - aIdx) % 12);
}

/* Western sun by month/day only */
function localSunSignFallback(y: number, m: number, d: number): Zodiac {
  const md = m * 100 + d;
  if (md >= 321 && md <= 419) return "Aries";
  if (md >= 420 && md <= 520) return "Taurus";
  if (md >= 521 && md <= 620) return "Gemini";
  if (md >= 621 && md <= 722) return "Cancer";
  if (md >= 723 && md <= 822) return "Leo";
  if (md >= 823 && md <= 922) return "Virgo";
  if (md >= 923 && md <= 1022) return "Libra";
  if (md >= 1023 && md <= 1121) return "Scorpio";
  if (md >= 1122 && md <= 1221) return "Sagittarius";
  if (md >= 1222 || md <= 119) return "Capricorn";
  if (md >= 120 && md <= 218) return "Aquarius";
  return "Pisces";
}

/* Stable hash for nudges + cache keys */
function hashString(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/* Friendlier baseline with easing so scores don’t feel harsh */
function scoreFromSun(aSun: Zodiac, bSun: Zodiac): Scores {
  const a = ZODIAC.indexOf(aSun);
  const b = ZODIAC.indexOf(bSun);
  const d = wheelDist(a, b);        // 0..6
  const fit = clamp01(1 - d / 6);   // 1 close, 0 far
  const eased = Math.pow(fit, 0.65);

  return {
    romantic:  clamp100(45 + eased * 55),
    friendship:clamp100(48 + eased * 52),
    work:      clamp100(50 + eased * 50),
  };
}

/* Name-based nudges so changing the name moves percentages */
function applyNameNudges(s: Scores, name: string): Scores {
  const n = (name || "").trim();
  const nRom = ((hashString(n + "|rom") % 13) - 6); // -6..+6
  const nFri = ((hashString(n + "|fri") % 13) - 6);
  const nWrk = ((hashString(n + "|wrk") % 13) - 6);
  return {
    romantic:  clamp100(s.romantic  + nRom),
    friendship:clamp100(s.friendship+ nFri),
    work:      clamp100(s.work      + nWrk),
  };
}

/* ---------------- Statement Banks (bands) ----------------
 * Bands: 0–45 Bad, 46–60 Okish, 61–85 Normal, 86–100 Good
 * {A} = Saloni, {B} = input name
 */
type Band = "bad" | "ok" | "normal" | "good";
type BandCat = "rom" | "fri" | "wrk";

const ROM_BAD = [
  "{A} wants to meet {B} in the same softness, but the moments keep missing each other.",
  "When {A} reaches, {B} hesitates, and when {B} opens, {A} is already guarding the door.",
  "The care is real, yet comfort slips; {A} and {B} keep loving from different angles.",
  "{A} and {B} circle the right feeling, but safety lands late and leaves early.",
  "They aim for tenderness together, but their maps don’t match; patience is the road they need.",
];
const ROM_OK = [
  "There’s a spark here; {A} and {B} can keep it warm with clearer words and gentler timing.",
  "{A} and {B} can land the hug they want if they name the hurt out loud and early.",
  "Care survives the bumps; little rituals could turn this into a softer place for both.",
  "Not effortless, but possible; repeat the kindness, skip the guessing.",
  "If {A} asks and {B} answers, intimacy finds their rhythm.",
];
const ROM_NORMAL = [
  "{A} steadies and {B} softens; the love between them learns a trustworthy pace.",
  "It’s sunrise, not fireworks; {A} and {B} glow in a way that lasts.",
  "{A} and {B} trade safety and spark in good measure—no one has to disappear.",
  "Honesty keeps the room warm, gentleness keeps it open; {A} and {B} are learning both.",
  "Trust grows in small steps; {A} and {B} say the real thing and stay.",
];
const ROM_GOOD = [
  "When {A} and {B} are together, the room calms; love feels like home that also holds a horizon.",
  "{A} makes love make sense for {B}, and {B} makes courage easy for {A}.",
  "They don’t chase sparks—they glow; {A} and {B} keep each other warm without burning out.",
  "Eyes that say I’m here—that’s the language {A} and {B} speak fluently.",
  "With {A} and {B}, love is clear, not loud; life fits better together.",
];

const FRI_BAD = [
  "Banter turns sharp; {A} and {B} need boundaries so the jokes land kinder.",
  "Plans wobble and trust arrives late; repair needs speed for {A} and {B}.",
  "{A} speaks straight, {B} shields up; truth lands jagged instead of clean.",
  "They escalate fast and cool slowly; fatigue builds between {A} and {B}.",
  "Inside jokes misfire; tone needs tuning before fun returns to {A} and {B}.",
];
const FRI_OK = [
  "It works in bursts; short resets help {A} and {B} keep the vibe steady.",
  "Align the expectation, then the laughs land better for {A} and {B}.",
  "With clearer check-ins, {A} and {B} stop stepping on toes.",
  "Less sarcasm, more signal; friendship breathes again for {A} and {B}.",
  "{A} and {B} are close to easy—trim the friction and it shows.",
];
const FRI_NORMAL = [
  "Low drama, real banter; {A} and {B} have room to grow without strain.",
  "{A} cools the heat, {B} breaks the ice; conflict passes quicker now.",
  "Different styles, same loyalty; honest asks keep it smooth for {A} and {B}.",
  "They disagree without disrespect; steady ground for {A} and {B}.",
  "Momentum and courage are traded fairly here; {A} and {B} notice it.",
];
const FRI_GOOD = [
  "Peak friendship energy: {A} can roast {B} with love and still bring snacks.",
  "{A} and {B} lift each other’s week with jokes and straight answers.",
  "Trust runs deep—less performance, more presence when {A} and {B} show up.",
  "One steadies, one energizes; pacing fits naturally for {A} and {B}.",
  "Effort goes to life, not decoding each other; {A} and {B} keep it light and loyal.",
];

const WRK_BAD = [
  "Roles blur and handoffs drop; {A} and {B} need one plan and a single owner.",
  "Debates linger, decisions lag, delivery slips; {A} and {B} must tighten the loop.",
  "Updates land late and expectations float; stress compounds for {A} and {B}.",
  "{A} needs clarity, {B} needs structure; pick the path and move.",
  "Meetings run long and value runs short; time to get crisp, {A} and {B}.",
];
const WRK_OK = [
  "Crisp notes and clear owners improve pace for {A} and {B}.",
  "Shorter standups, cleaner lanes—progress follows {A} and {B}.",
  "{A} brings focus, {B} brings motion; map the route and ship.",
  "Decide fast, adjust gently—{A} and {B} deliver sooner.",
  "One page, one owner, one date; lift-off for {A} and {B}.",
];
const WRK_NORMAL = [
  "Give {A} and {B} a messy brief and a map; they’ll find the route.",
  "Disagree, decide, deliver—works well when someone owns the timeline for {A} and {B}.",
  "Fewer meetings, clearer checkpoints; momentum sticks with {A} and {B}.",
  "Risks are caught early and outcomes stay on time for {A} and {B}.",
  "Purposeful over performative; results tell the story for {A} and {B}.",
];
const WRK_GOOD = [
  "Well-tuned kitchen mode: pressure turns into plates shipped by {A} and {B}.",
  "Meetings end lighter than they start—more progress, fewer words with {A} and {B}.",
  "{A} turns sparks into plans, {B} turns plans into momentum; teams feel it.",
  "{A} and {B} keep scope honest and schedules real.",
  "Reliable under load—people trust {A} and {B} with the hard things.",
];

function bandFor(score?: number): Band | null {
  if (typeof score !== "number") return null;
  if (score <= 45) return "bad";
  if (score <= 60) return "ok";
  if (score <= 85) return "normal";
  return "good";
}
function bandRange(b: Band): [number, number] {
  if (b === "bad") return [0, 45];
  if (b === "ok") return [46, 60];
  if (b === "normal") return [61, 85];
  return [86, 100];
}
function bankFor(cat: BandCat, b: Band): string[] {
  if (cat === "rom") return b === "bad" ? ROM_BAD : b === "ok" ? ROM_OK : b === "normal" ? ROM_NORMAL : ROM_GOOD;
  if (cat === "fri") return b === "bad" ? FRI_BAD : b === "ok" ? FRI_OK : b === "normal" ? FRI_NORMAL : FRI_GOOD;
  return b === "bad" ? WRK_BAD : b === "ok" ? WRK_OK : b === "normal" ? WRK_NORMAL : WRK_GOOD;
}

/* Pick a line by position within the band based on score; remember it */
function pickLineByScore(cat: BandCat, score: number, A: string, B: string, keyRoot: string): string {
  const b = bandFor(score);
  if (!b) return "";
  const bank = bankFor(cat, b);
  const [lo, hi] = bandRange(b);
  const t = bank.length <= 1 ? 0 : Math.min(0.999, Math.max(0, (score - lo) / (hi - lo)));
  const idx = Math.floor(t * bank.length);
  const storageKey = `stmt:${cat}:${b}:${keyRoot}`;
  try { localStorage.setItem(storageKey, JSON.stringify({ idx, score })); } catch {}
  return bank[idx].replaceAll("{A}", A).replaceAll("{B}", B);
}

/* Zodiac glyphs */
const GLYPHS: Record<Zodiac, string> = {
  Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋", Leo: "♌", Virgo: "♍",
  Libra: "♎", Scorpio: "♏", Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓",
};

/* Verdict helpers */
function verdictLabel(score: number): "Bad" | "Okish" | "Normal" | "Good" {
  const b = bandFor(score);
  if (b === "bad") return "Bad";
  if (b === "ok") return "Okish";
  if (b === "normal") return "Normal";
  return "Good";
}
function overallScore(s: Scores): number {
  // weight Romantic 50%, Friendship 30%, Work 20%
  return Math.round(s.romantic * 0.5 + s.friendship * 0.3 + s.work * 0.2);
}

/* ---------------------- React Page ---------------------- */
export default function PersonalityPage() {
  const [name, setName] = useState("");
  const [date, setDate] = useState(""); // yyyy-mm-dd

  const [otherSun, setOtherSun] = useState<Zodiac | undefined>(undefined);
  const [scores, setScores] = useState<Scores | undefined>(undefined);
  const [romText, setRomText] = useState("");
  const [friText, setFriText] = useState("");
  const [wrkText, setWrkText] = useState("");
  const [busy, setBusy] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalVerdict, setModalVerdict] = useState<{label: string; score: number} | null>(null);

  const rightTitle = useMemo(() => {
    if (!showResults) return "";
    return `${SALONI.name} and ${(name || "").trim() || "You"}`;
  }, [name, showResults]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (!date) { setShowResults(false); return; }

      const [yyyy, mm, dd] = date.split("-").map(Number);
      const userSun = localSunSignFallback(yyyy, mm, dd);
      setOtherSun(userSun);

      // Special case: Jai / Jai Joshi with 04/11/2000 (both dd/mm and mm/dd interpretations)
      const nm = (name || "").trim().toLowerCase();
      const isJai = nm === "jai" || nm === "jai joshi";
      const isTargetDate =
        (dd === 4 && mm === 11 && yyyy === 2000) || // 2000-11-04
        (dd === 11 && mm === 4 && yyyy === 2000);   // 2000-04-11

      let finalScores: Scores;

      if (isJai && isTargetDate) {
        finalScores = { romantic: 100, friendship: 100, work: 100 };
      } else {
        const base = scoreFromSun(SALONI.sun as Zodiac, userSun);
        finalScores = applyNameNudges(base, name);
      }
      setScores(finalScores);

      const A = SALONI.name;
      const B = (name || "You").trim() || "You";
      const keyRoot = `${B}|${date}`;

      setRomText(pickLineByScore("rom", finalScores.romantic, A, B, keyRoot));
      setFriText(pickLineByScore("fri", finalScores.friendship, A, B, keyRoot));
      setWrkText(pickLineByScore("wrk", finalScores.work, A, B, keyRoot));

      setShowResults(true);

      // Pop-up verdict (overall)
      const ov = overallScore(finalScores);
      setModalVerdict({ label: verdictLabel(ov), score: ov });
      setShowModal(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Head><title>Personality and Compatibility</title></Head>

      {/* twinkle and zodiac wheel styles */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.6; transform: translateY(0px); }
          50%      { opacity: 1;   transform: translateY(-0.5px); }
        }
        .twinkle::before, .twinkle::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,0.45), transparent 55%),
            radial-gradient(1.5px 1.5px at 70% 60%, rgba(255,255,255,0.35), transparent 55%),
            radial-gradient(1.5px 1.5px at 40% 80%, rgba(255,255,255,0.35), transparent 55%),
            radial-gradient(2px 2px at 85% 25%, rgba(255,255,255,0.45), transparent 55%);
          pointer-events: none;
          animation: twinkle 4s ease-in-out infinite;
        }
        .twinkle::after { animation-delay: 1.2s; opacity: .7; }
        .zodiac-wheel {
          background:
            radial-gradient(closest-side, rgba(255,255,255,0.15), transparent 60%),
            conic-gradient(from 0deg,
              rgba(255,255,255,0.18) 0deg 30deg,
              transparent 30deg 60deg,
              rgba(255,255,255,0.18) 60deg 90deg,
              transparent 90deg 120deg,
              rgba(255,255,255,0.18) 120deg 150deg,
              transparent 150deg 180deg,
              rgba(255,255,255,0.18) 180deg 210deg,
              transparent 210deg 240deg,
              rgba(255,255,255,0.18) 240deg 270deg,
              transparent 270deg 300deg,
              rgba(255,255,255,0.18) 300deg 330deg,
              transparent 330deg 360deg);
          filter: blur(6px);
          opacity: .35;
        }
      `}</style>

      <main className="relative min-h-screen overflow-hidden">
        <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/memories/Background Image.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-indigo-900/70 to-violet-900/70" />
        <div className="absolute inset-0 twinkle" />



        <header className="relative z-10 max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <a href="/" className="text-sm text-indigo-200 hover:text-white">Home</a>
         <nav className="flex items-center gap-3">
            <a href="/memories" className="px-4 py-2 rounded-xl bg-orange-500 text-white shadow hover:bg-orange-600 transition">Memories</a>
            <a href="/personality" className="px-4 py-2 rounded-xl bg-pink-500 text-white shadow hover:bg-pink-600 transition">Personality %</a>
            </nav>
        </header>

        <section className="relative z-10 max-w-6xl mx-auto px-4 pb-24">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow">
            Romantic, Friendshiip and Work Compatibility test
          </h1>
          <p className="text-indigo-200 mt-2">Enter a persons details to check the compatibility with you!!!</p>

          <div className="mt-8 grid lg:grid-cols-2 gap-8">
            {/* Left form */}
            <form
              onSubmit={onSubmit}
              className="bg-white/10 backdrop-blur-md rounded-2xl border border-indigo-400/30 shadow-lg p-6"
            >
              <label className="block text-sm font-medium text-indigo-100 mb-1">Name</label>
              <input
                className="w-full rounded-lg border border-indigo-300/40 px-3 py-2 bg-white/90 text-gray-900"
                placeholder="Your Name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
              />

              <div className="grid sm:grid-cols-1 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-indigo-100 mb-1">Date of birth</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-indigo-300/40 px-3 py-2 bg-white/90 text-gray-900"
                    value={date}
                    onChange={(e)=>setDate(e.target.value)}
                    placeholder="dd-mm-yyyy"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={busy || !date}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-rose-500 hover:from-fuchsia-600 hover:to-rose-600 text-white font-semibold py-3 shadow disabled:opacity-60"
              >
                {busy ? "Checking..." : "Check compatibility"}
              </button>
            </form>

            {/* Right results */}
            <div className="relative">
              <div className="absolute -inset-6 sm:-inset-10 -z-0">
                <div className="zodiac-wheel w-full h-full rounded-3xl" />
              </div>

              <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl border border-indigo-400/30 shadow-lg p-6">
                {showResults ? (
                  <>
                    <h2 className="text-2xl font-extrabold text-white text-center tracking-wide">
                      {rightTitle}
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-4 mt-6">
                      <SignCard label="Saloni" sign={SALONI.sun as Zodiac} />
                      <SignCard label={(name || "").trim() || "You"} sign={otherSun ?? "Aries"} />
                    </div>

                    {/* Bigger, bolder grid for scores + statements */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <ScoreCard title="Romantic"   score={scores?.romantic}   sub={romText} />
                      <ScoreCard title="Friendship" score={scores?.friendship} sub={friText} />
                      <ScoreCard title="Work"       score={scores?.work}       sub={wrkText} />
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* Verdict Modal */}
        {showModal && modalVerdict ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={()=>setShowModal(false)} />
            <div className="relative z-10 w-[92%] max-w-md rounded-2xl border border-indigo-300/40 bg-gradient-to-b from-indigo-900/90 to-violet-900/90 p-6 text-white shadow-2xl">
              <h3 className="text-xl font-bold text-center">Overall Match</h3>
              <div className="mt-3 text-center text-4xl font-extrabold">
                {modalVerdict.score}%
              </div>
              <div className="mt-2 text-center text-lg font-semibold">
                {modalVerdict.label}
              </div>
              <p className="mt-3 text-sm text-indigo-200 text-center">
                Verdict is a weighted blend of Romantic, Friendship, and Work.
              </p>
              <button
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 py-3 font-semibold"
                onClick={()=>setShowModal(false)}
              >
                Continue
              </button>
            </div>
          </div>
        ) : null}
      </main>
    </>
  );
}

/* Sign badge card with glyph */
function SignCard({ label, sign }: { label: string; sign: Zodiac }) {
  const glyph = GLYPHS[sign];
  return (
    <div className="rounded-xl border border-indigo-300/40 bg-white/10 p-6 text-center text-indigo-50">
      <div className="mx-auto inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-200/40 bg-indigo-900/30">
        <span className="text-2xl">{glyph}</span>
        <span className="text-sm">{sign}</span>
      </div>
      <div className="mt-3 text-base font-semibold">{label}</div>
    </div>
  );
}

function ScoreCard({ title, score, sub }: { title: string; score?: number; sub: string }) {
  const val = typeof score === "number" ? score : undefined;

  // color hint by band
  let barFrom = "from-rose-400", barTo = "to-fuchsia-500", halo = "shadow-[0_0_35px_rgba(244,114,182,0.35)]";
  if (typeof val === "number") {
    if (val <= 45) { barFrom = "from-rose-500"; barTo = "to-orange-500"; halo = "shadow-[0_0_35px_rgba(249,115,22,0.35)]"; }
    else if (val <= 60) { barFrom = "from-amber-400"; barTo = "to-rose-500"; halo = "shadow-[0_0_35px_rgba(251,191,36,0.35)]"; }
    else if (val <= 85) { barFrom = "from-indigo-400"; barTo = "to-violet-500"; halo = "shadow-[0_0_35px_rgba(139,92,246,0.35)]"; }
    else { barFrom = "from-emerald-400"; barTo = "to-teal-500"; halo = "shadow-[0_0_35px_rgba(16,185,129,0.35)]"; }
  }

  return (
    <div className={`rounded-2xl border border-indigo-300/40 bg-white/10 p-6 text-indigo-50 ${halo} overflow-hidden`}>
      {/* Title */}
      <h4 className="text-sm text-indigo-200 tracking-wide uppercase text-center">{title}</h4>

      {/* Centered score badge — keeps the number inside the card */}
      <div className="mt-3 w-full">
        <div className="mx-auto min-w-[5.5rem] rounded-2xl bg-white/12 border border-white/20 px-4 py-2 text-center">
          <span className="text-3xl md:text-4xl font-black text-white tabular-nums leading-none">
            {val ?? "—"}
          </span>
        </div>
      </div>

      {/* Statement */}
      {sub ? (
        <p className="text-sm md:text-base text-indigo-100/90 mt-4 leading-relaxed text-center">
          {sub}
        </p>
      ) : null}

      {/* Meter */}
      <div className="w-full h-2.5 bg-indigo-200/30 rounded mt-5 overflow-hidden">
        <div className={`h-2.5 bg-gradient-to-r ${barFrom} ${barTo}`} style={{ width: `${val ?? 0}%` }} />
      </div>
    </div>
  );
}
