'use client'

import { useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react"
import Image from "next/image"

type Memory = {
  id: string
  type: "image" | "video"
  src: string
  title: string
  date: string
  note: string
}


const memories: Memory[] = [
  { id: "m1",  type: "image", src: "/memories/DP-whatsapp-2.jpeg", title: "Indian DP",    date: "Aug 19, 2025", note: "That effortless smile that makes chats feel warmer." },
  { id: "m2",  type: "image", src: "/memories/DP-whatsapp.jpeg",   title: "Foreign DP",   date: "Aug 19, 2025", note: "The smile that makes you wait for replies" },
  { id: "m3",  type: "image", src: "/memories/Link-DP.jpeg",       title: "Proffesional DP", date: "Aug 19, 2025", note: "The one which brings money home" },
  { id: "m4",  type: "image", src: "/memories/Pout.jpg",           title: "Pout Queen",   date: "May 17, 2025", note: "Playful mood, perfect timing, endless sunshine" },
  { id: "m5",  type: "image", src: "/memories/Quesera-pout.jpg",   title: "Hungry AF",    date: "May 10, 2025", note: "Midnight hunger but still posing." },
  { id: "m6",  type: "image", src: "/memories/Quesera.jpg",        title: "Quesera Pout", date: "May 10, 2025", note: "Hungry evenings, warm company, sexy lips" },
  { id: "m7",  type: "image", src: "/memories/Quties.jpg",         title: "Cuties Pout",  date: "Aug 07, 2025", note: "One photo, a thousand memories made." },
  { id: "m8",  type: "image", src: "/memories/Sketch.jpg",         title: "Beauty",       date: "Jul 31, 2025", note: "A photo which got captured by a pencil." },
  { id: "m9",  type: "image", src: "/memories/Us-all.jpg",         title: "Us all",       date: "May 23, 2025", note: "The squad, the chaos, the Park, the Radhe Radhe, the Get it?, the Finance illiteracy, the stranger." },
  { id: "m10", type: "image", src: "/memories/US.jpg",             title: "So that's it", date: "Aug 07, 2025", note: "Just us — easy and real, it was the end." },
  { id: "m11", type: "video", src: "/memories/11400-bill.mp4",     title: "11400 bill",   date: "Aug 19, 2025", note: "That dinner we’ll never forget — thanks to the bill." },
  { id: "m12", type: "video", src: "/memories/Bowling.mp4",        title: "Bowling",      date: "Aug 19, 2025", note: "Strikes, misses, and laughter in between." },
  { id: "m13", type: "video", src: "/memories/Juta-chori.mp4",     title: "Juta chori",   date: "Aug 19, 2025", note: "Projit needs to visit a therapisit" },
  { id: "m14", type: "video", src: "/memories/More-shots.mp4",     title: "Shots",        date: "Aug 19, 2025", note: "One more? Always one more." },
  { id: "m15", type: "video", src: "/memories/Shots.mp4",          title: "More Shots",   date: "Aug 19, 2025", note: "Hum sab bevede hai!" },
]





export default function MemoriesPage() {
  const [opened, setOpened] = useState(false)
  const [index, setIndex] = useState(0)

  const firstRandom = useMemo(() => Math.floor(Math.random() * memories.length), [])
  useEffect(() => {
    if (opened) setIndex(firstRandom)
  }, [opened, firstRandom])

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/60 border-b border-orange-100">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <a href="/" className="text-sm text-orange-700 hover:underline">Home</a>
          <nav className="flex items-center gap-3">
            <a href="/memories" className="px-4 py-2 rounded-xl bg-orange-500 text-white shadow hover:bg-orange-600 transition">Memories</a>
            <a href="/personality" className="px-4 py-2 rounded-xl bg-pink-500 text-white shadow hover:bg-pink-600 transition">Personality %</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        {!opened ? (
          <ClosedScrap onOpen={() => setOpened(true)} />
        ) : (
          <ScrapBook memories={memories} index={index} setIndex={setIndex} />
        )}
      </main>

      <style jsx global>{`
        .scene { position: relative; isolation: isolate; }
        .book-stage { perspective: 1200px; }
        .scrapbook {
          transform: rotateX(2.5deg) rotateZ(-0.4deg);
          border-radius: 26px;
          box-shadow:
            0 40px 80px rgba(0,0,0,0.12),
            0 4px 18px rgba(0,0,0,0.08);
          position: relative;
          overflow: visible;
        }
        .desk {
          position: absolute;
          inset: -32px;
          z-index: -1;
          background:
            radial-gradient(1200px 600px at 60% 0%, rgba(255,255,255,0.6), transparent 60%),
            linear-gradient(135deg, #f5e6d3 0%, #f0dac2 50%, #efd3b6 100%);
          filter: saturate(1.02);
          border-radius: 32px;
        }
        .spiral {
          position: absolute;
          top: 18px;
          bottom: 18px;
          left: 50%;
          width: 64px;
          transform: translateX(-50%);
          background:
            radial-gradient(circle at 50% 20px, #d1d5db 8px, transparent 9px) 0 0 / 64px 48px repeat-y,
            linear-gradient(90deg, #9ca3af 30px, transparent 30px) 0 0 / 64px 100% no-repeat;
          mix-blend-mode: multiply;
          z-index: 5;
          pointer-events: none;
        }
        .paper {
          background:
            url("/textures/paper-fiber.png"),
            linear-gradient(#fffdf9, #fffaf2);
          background-size: 600px 600px, 100% 100%;
          background-repeat: repeat, no-repeat;
        }
        .polaroid {
          background: #ffffff;
          border-radius: 14px;
          box-shadow:
            0 10px 24px rgba(0,0,0,0.12),
            inset 0 0 1px rgba(0,0,0,0.25);
          padding: 14px 14px 38px 14px;
          transform: rotate(-1.3deg);
          position: relative;
        }
        .tape {
          position: absolute;
          width: 120px;
          height: 26px;
          top: -10px;
          left: 24px;
          background:
            linear-gradient(90deg, rgba(255,255,255,0.5) 0 10%, transparent 10% 90%, rgba(255,255,255,0.5) 90% 100%),
            repeating-linear-gradient(90deg, rgba(236, 72, 153, .8), rgba(236, 72, 153, .8) 10px, rgba(249, 115, 22, .8) 10px, rgba(249, 115, 22, .8) 20px);
          border-radius: 6px;
          filter: blur(.2px);
          transform: rotate(-6deg);
          opacity: .9;
        }
        .tape.br {
          top: auto;
          bottom: -10px;
          left: auto;
          right: 24px;
          transform: rotate(6deg);
        }
        .note-card {
          background:
            url("/textures/kraft.png"),
            linear-gradient(#fffaf1, #fff6e8);
          background-size: 600px 600px, 100% 100%;
          border-radius: 16px;
          box-shadow:
            inset 0 0 0 1px rgba(0,0,0,0.06),
            0 8px 22px rgba(0,0,0,0.10);
          position: relative;
        }
        .pin { position: absolute; width: 14px; height: 14px; border-radius: 999px; background: radial-gradient(circle at 35% 35%, #fca5a5, #ef4444 70%); top: 14px; left: 18px; box-shadow: 0 2px 0 rgba(0,0,0,0.25); }
        .pin.r { left: auto; right: 18px; }
        .ruled { background: repeating-linear-gradient(#0000, #0000 30px, rgba(0,0,0,0.06) 31px, rgba(0,0,0,0.06) 32px); }
        .margin-line::before { content: ""; position: absolute; left: 26px; top: 0; bottom: 0; width: 2px; background: rgba(239,68,68,0.35); }
        .page { border-radius: 22px; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.04), 0 12px 28px rgba(0,0,0,0.08); overflow: hidden; }
        .fade { transition: opacity 220ms ease; }
      `}</style>
    </div>
  )
}

function ClosedScrap({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="scene flex flex-col items-center justify-center py-16">
      <div className="book-stage w-full max-w-4xl" onClick={onOpen} role="button">
        <div className="relative scrapbook paper h-[420px] md:h-[520px]">
          <div className="desk" />
          <div className="absolute inset-0 rounded-[26px] border border-orange-200/60" />
          <div className="spiral" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold text-orange-700 drop-shadow-sm">Memories</div>
              <div className="mt-3 text-base md:text-lg text-gray-600">Click to open then use arrow keys</div>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-10 text-gray-600 text-sm">Left for previous — Right for next</p>
    </div>
  )
}

function ScrapBook({
  memories,
  index,
  setIndex,
}: {
  memories: Memory[]
  index: number
  setIndex: Dispatch<SetStateAction<number>>
}) {
  const memory = memories[index]

  // flip sound
  const audioRef = useRef<HTMLAudioElement | null>(null)
  useEffect(() => {
    audioRef.current = new Audio("/sounds/page-flip.mp3")
    audioRef.current.preload = "auto"
  }, [])
  const playFlip = () => {
    const a = audioRef.current
    if (!a) return
    try { a.currentTime = 0; a.play() } catch {}
  }

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { playFlip(); setIndex(i => (i + 1) % memories.length) }
      if (e.key === "ArrowLeft")  { playFlip(); setIndex(i => (i - 1 + memories.length) % memories.length) }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [memories.length, setIndex])

  // crossfade on change
  const [show, setShow] = useState(true)
  useEffect(() => {
    setShow(false)
    const t: number = window.setTimeout(() => setShow(true), 10)
    return () => window.clearTimeout(t)
  }, [index])

  return (
    <div className="scene">
      <div className="book-stage">
        <div className="relative scrapbook paper p-5 md:p-6">
          <div className="desk" />
          <div className="spiral" />

          {/* two pages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* left page with polaroid */}
            <div className="page paper p-6 md:p-7">
              <div className={`polaroid fade ${show ? "opacity-100" : "opacity-0"}`}>
                <span className="tape" />
                <span className="tape br" />
                <div className="relative w-full max-h-[56vh] flex items-center justify-center bg-neutral-100 rounded-[8px] overflow-hidden">
                  {memory.type === "image" ? (
                    <Image
                      src={memory.src}
                      alt={memory.title}
                      width={600}
                      height={400}
                      className="w-auto h-auto max-h-[56vh] object-contain"
                      priority
                    />
                  ) : (
                    <video
                      key={memory.src}
                      src={memory.src}
                      className="w-auto h-auto max-h-[56vh] object-contain rounded-md"
                      autoPlay
                      loop
                      controls
                      playsInline
                    />
                  )}
                </div>
              </div>
            </div>

            {/* right page with kraft note card */}
            <div className="page paper p-6 md:p-7">
              <div className={`note-card ruled margin-line p-6 md:p-7 fade ${show ? "opacity-100" : "opacity-0"}`}>
                <span className="pin" />
                <span className="pin r" />
                <h2 className="text-2xl md:text-3xl font-bold text-orange-700">{memory.title}</h2>
                <div className="text-sm text-gray-500 mt-1">{memory.date}</div>
                <p className="mt-4 text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {memory.note}
                </p>
                <div className="mt-6 flex flex-wrap gap-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-10 text-center text-gray-600 text-sm">Use Left and Right arrow keys to turn pages</p>
    </div>
  )
}
