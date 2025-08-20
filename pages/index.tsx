'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

const isBirthday = () => {
  const d = new Date();
  return d.getDate() === 21 && d.getMonth() === 7;
};

type Testimonial = {
  id: string;
  name: string;
  role?: string;
  text: string;
};

const testimonialsData: Testimonial[] = [
  { id: "w1", name: "Jai Joshi", role: "Protector of Emotions", text: "I don't think there is anything more I need to say, just sorry that I was not able to visit you on your special day" },
  { id: "w2", name: "Vardan Bakshi", role: "Protector of Sanity", text: "Yo Salzburg thanks for being a friend who makes everything way more fun! Happy birthday!" },
  { id: "w3", name: "Aman Patidar", role: "Protector of Truth", text: "Kammini of my Monopoly Deal" },
  { id: "w4", name: "Projit Gosh", role: "Protector of Defense", text: "Happy Birthday! Wishing you joy, peace, and all the love you truly deserve this year." },
  { id: "w5", name: "Akash Mundeja", role: "Protector of Divorce", text: "Will you marry me? (Jai this side I am assuming he will say that)" },
  { id: "w6", name: "Samsara ", role: "Protector of Life", text: "Let's go skinny dipping in a pool with Henry Cavil and Chris Hemsworth! (Again Jai this side assuming she will say this)" },
];

export default function Home() {
  const birthday = useMemo(isBirthday, []);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!birthday) return;

    let dispose: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const { default: confetti } = await import("canvas-confetti");
      if (cancelled) return;

      confetti({ particleCount: 200, spread: 100 });
      const id = window.setInterval(() => {
        confetti({ particleCount: 80, spread: 120, origin: { y: 0.6 } });
      }, 3000);

      dispose = () => window.clearInterval(id);
    })();

    return () => {
      cancelled = true;
      if (dispose) dispose();
    };
  }, [birthday]);

  const imgRef = useRef<HTMLDivElement | null>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = imgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tx = (x - 0.5) * 16;
    const ty = (y - 0.5) * 16;
    el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(1.02)`;
  };
  const onLeave = () => {
    const el = imgRef.current;
    if (!el) return;
    el.style.transform = "translate3d(0,0,0) scale(1)";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-amber-50 to-orange-50">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/60 border-b border-orange-100">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-orange-700">It’s all about Saloni</h1>
          <nav className="flex items-center gap-3">
            <a href="/memories" className="px-4 py-2 rounded-xl bg-orange-500 text-white shadow hover:bg-orange-600 transition">Memories</a>
            <a href="/personality" className="px-4 py-2 rounded-xl bg-pink-500 text-white shadow hover:bg-pink-600 transition">Personality %</a>
          </nav>
        </div>
      </header>

      <section className="relative mx-auto max-w-7xl px-4 py-10 lg:py-16">
        {mounted && birthday && <BalloonsOverlay />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div
            className="relative w-full h-[760px] rounded-3xl overflow-hidden shadow-xl will-change-transform transition-transform duration-200 ease-out"
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            ref={imgRef}
          >
            <Image
              src="/saloni-hero.jpg"
              alt="Saloni portrait"
              fill
              priority
              className="object-cover object-top select-none pointer-events-none"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold text-orange-700 mb-6">It’s all about Saloni</h2>

            <div className="text-lg md:text-xl text-gray-700 leading-relaxed">
              <p>
                You carry an energy that is both magnetic and grounding — a presence that draws people in, yet steadies them at the same time. You have the rare ability to listen not just with your ears, but with your heart, catching what often goes unsaid. People feel safe around you because you remind them that their feelings matter, that strength is not found in silence but in honesty.
              </p>
              <br />
              <p>
                There is a timeless wisdom in you, one that cannot be measured by years. You see life with clarity, yet you hold space for its messiness, never rushing to fix, only guiding others to face what they once thought they couldn’t. Your maturity is not cold or distant; it is warm, kind, and fiercely human.
              </p>
              <br />
              <p>
                You inspire people simply by being yourself. In your presence, they learn that vulnerability is not weakness, but courage in its purest form. You encourage openness, you ignite ambition, and you light up every space you enter — not with noise, but with a glow that lingers long after you’ve left.
              </p>
              <br />
              <p>
                You are proof that true strength lies in compassion, and true brilliance lies in the way you help others shine alongside you.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm">Beautiful and Smart</span>
              <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-sm">Sexy and Hot</span>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm">Lazy and Annoying</span>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsCarousel title="What people say" items={testimonialsData} />

      <footer className="border-t border-orange-100 py-8">
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">Saloni, be the way you are always!</p>
          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/" aria-label="LinkedIn" className="hover:opacity-80">
              <LinkedInIcon className="w-6 h-6 text-gray-700" />
            </a>
            <a href="https://www.instagram.com/" aria-label="Instagram" className="hover:opacity-80">
              <InstagramIcon className="w-6 h-6 text-gray-700" />
            </a>
            <a href="https://x.com/" aria-label="X" className="hover:opacity-80">
              <XIcon className="w-6 h-6 text-gray-700" />
            </a>
            <a href="mailto:hello@example.com" aria-label="Email" className="hover:opacity-80">
              <MailIcon className="w-6 h-6 text-gray-700" />
            </a>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes floatUp {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.9; }
          100% { transform: translateY(-110vh) translateX(-30px) rotate(4deg); opacity: 0.1; }
        }
        .balloon { position: absolute; bottom: -10vh; width: 28px; height: 36px; border-radius: 14px 14px 10px 10px; box-shadow: inset -4px -6px 0 rgba(0,0,0,0.08); animation: floatUp linear infinite; }
        .string { position: absolute; left: 50%; top: 36px; width: 1px; height: 36px; background: rgba(0,0,0,0.15); }
      `}</style>
    </div>
  );
}

/* card */
function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="rounded-xl bg-white border border-orange-100 shadow-sm p-6 flex items-start gap-6 w-full">
      <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-orange-300 to-pink-300 flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-md">
        {t.name.charAt(0)}
      </div>
      <div className="flex flex-col">
        <p className="text-gray-700 text-base md:text-lg leading-relaxed">{t.text}</p>
        <div className="mt-3">
          <div className="font-semibold text-gray-900">{t.name}</div>
          {t.role && <div className="text-sm text-gray-500">{t.role}</div>}
        </div>
      </div>
    </div>
  );
}

/* full width carousel with stable interval and hover pause */
function TestimonialsCarousel({ title, items }: { title: string; items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setIndex(i => (i + 1) % count);
    }, 4000);
    return () => window.clearInterval(id);
  }, [paused, count]);

  const go = (n: number) => setIndex(((n % count) + count) % count);
  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  const pauseHandlers = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
  };

  return (
    <section className="mx-auto max-w-7xl px-0 sm:px-4 pb-16">
      <div className="mx-auto max-w-7xl px-4 mb-6 md:mb-8 flex items-end justify-between">
        <h3 className="text-2xl md:text-3xl font-semibold text-orange-700">{title}</h3>
        <div className="hidden sm:flex gap-2">
          <button
            onClick={prev}
            {...pauseHandlers}
            className="px-3 py-2 rounded-lg bg-white border border-orange-200 text-orange-700 hover:bg-orange-50"
          >
            Prev
          </button>
          <button
            onClick={next}
            {...pauseHandlers}
            className="px-3 py-2 rounded-lg bg-white border border-orange-200 text-orange-700 hover:bg-orange-50"
          >
            Next
          </button>
        </div>
      </div>

      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex transition-transform duration-500 ease-out w-full"
          style={{ transform: `translateX(-${index * 100}%)`, width: `${items.length * 100}%` }}
        >
          {items.map((t) => (
            <div key={t.id} className="w-full flex-shrink-0 px-4">
              <TestimonialCard t={t} />
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => go(i)}
              className={`h-2.5 w-2.5 rounded-full ${i === index ? "bg-orange-600" : "bg-orange-200"}`}
              {...pauseHandlers}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function BalloonsOverlay() {
  const balloons = Array.from({ length: 14 }).map((_, i) => ({
    id: i,
    left: Math.random() * 96 + 2,
    duration: 10 + Math.random() * 10,
    delay: Math.random() * 6,
    bg: i % 3 === 0 ? "#fed7aa" : i % 3 === 1 ? "#fbcfe8" : "#fde68a",
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {balloons.map((b) => (
        <div
          key={b.id}
          className="balloon"
          style={{
            left: `${b.left}%`,
            background: b.bg,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        >
          <div className="string" />
        </div>
      ))}
    </div>
  );
}

function LinkedInIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" role="img">
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0zM8 8h4.8v2.2h.07c.67-1.2 2.3-2.46 4.73-2.46C21.6 7.74 24 9.9 24 14.06V24h-5v-8.7c0-2.07-.74-3.48-2.6-3.48-1.42 0-2.27.96-2.64 1.88-.14.34-.17.82-.17 1.3V24H8z" />
    </svg>
  );
}
function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" role="img">
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6zM18 6.3a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" />
    </svg>
  );
}
function XIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" role="img">
      <path d="M18.2 2H21l-7.3 8.3L22 22h-6.8l-5.3-6.6L3.8 22H1l7.8-8.9L2 2h6.8l4.8 6.1L18.2 2zM8.6 3.9H5.6l9.8 12.3h3L8.6 3.9z" />
    </svg>
  );
}
function MailIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" role="img">
      <path d="M2 4h20v16H2z" opacity=".2" />
      <path d="M22 6.5V20H2V6.5l10 6.25L22 6.5zM20.5 4H3.5L12 9.75 20.5 4z" />
    </svg>
  );
}
