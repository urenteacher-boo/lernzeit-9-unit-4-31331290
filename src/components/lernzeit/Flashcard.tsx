import { useEffect, useRef, useState } from "react";
import type { Card } from "@/data/vocabulary";

const EN_DURATION = 5;
const DE_DURATION = 3;
const RADIUS = 24;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type Props = {
  cards: Card[];
  deckLabel: string;
  onExit: () => void;
  onComplete: () => void;
};

export const Flashcard = ({ cards, deckLabel, onExit, onComplete }: Props) => {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"en" | "de">("en");
  const [remaining, setRemaining] = useState(EN_DURATION);
  const [paused, setPaused] = useState(false);
  const tickRef = useRef<number | null>(null);

  const total = cards.length;
  const card = cards[index];
  const flipped = phase === "de";

  // Reset on card change
  useEffect(() => {
    setPhase("en");
    setRemaining(EN_DURATION);
  }, [index]);

  // Countdown
  useEffect(() => {
    if (paused) return;
    tickRef.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 0.1) {
          if (phase === "en") {
            setPhase("de");
            return DE_DURATION;
          }
          // advance
          if (index + 1 >= total) {
            window.setTimeout(onComplete, 0);
            return 0;
          }
          setIndex((i) => i + 1);
          return EN_DURATION;
        }
        return +(r - 0.1).toFixed(1);
      });
    }, 100);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, [phase, paused, index, total, onComplete]);

  const duration = phase === "en" ? EN_DURATION : DE_DURATION;
  const offset = CIRCUMFERENCE * (1 - remaining / duration);

  const skip = () => {
    if (phase === "en") {
      setPhase("de");
      setRemaining(DE_DURATION);
    } else if (index + 1 >= total) {
      onComplete();
    } else {
      setIndex((i) => i + 1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-[480px] mx-auto">
      <div className="flex items-center justify-between w-full">
        <button
          onClick={onExit}
          className="text-[11px] tracking-[0.18em] uppercase text-olive/60 hover:text-olive transition-colors"
        >
          ← Exit
        </button>
        <div className="text-[11px] tracking-[0.18em] uppercase text-olive/60">
          Card <span className="text-olive font-semibold">{index + 1}</span> of {total}
        </div>
      </div>

      <div className="text-[10px] tracking-[0.2em] uppercase text-olive/50">{deckLabel}</div>

      <div className="w-full h-[260px]" style={{ perspective: "1000px" }}>
        <div
          className="w-full h-full relative transition-transform duration-700 ease-out"
          style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "none" }}
        >
          {/* Front: English */}
          <div
            className="absolute inset-0 rounded-[28px] bg-cream border border-olive/15 flex flex-col items-center justify-center p-9 gap-3"
            style={{ backfaceVisibility: "hidden", boxShadow: "var(--shadow-lift)" }}
          >
            <span className="text-[11px] tracking-[0.22em] uppercase text-terracotta/70 font-semibold">
              English
            </span>
            <span className="font-serif text-[clamp(1.6rem,5vw,2.4rem)] font-bold text-olive text-center leading-tight">
              {card.en}
            </span>
          </div>
          {/* Back: German */}
          <div
            className="absolute inset-0 rounded-[28px] bg-olive border border-olive flex flex-col items-center justify-center p-9 gap-3"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              boxShadow: "var(--shadow-lift)",
            }}
          >
            <span className="text-[11px] tracking-[0.22em] uppercase text-tan font-semibold">
              Deutsch
            </span>
            <span className="font-serif text-[clamp(1.6rem,5vw,2.4rem)] font-bold text-cream text-center leading-tight">
              {card.de}
            </span>
          </div>
        </div>
      </div>

      <div className="relative w-14 h-14">
        <svg viewBox="0 0 56 56" width="56" height="56" className="absolute inset-0 -rotate-90">
          <circle cx="28" cy="28" r={RADIUS} fill="none" stroke="hsl(var(--olive) / 0.12)" strokeWidth="3" />
          <circle
            cx="28"
            cy="28"
            r={RADIUS}
            fill="none"
            stroke={phase === "en" ? "hsl(var(--terracotta))" : "hsl(var(--olive))"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.1s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-sans font-semibold text-olive tabular-nums">
          {Math.ceil(remaining)}
        </div>
      </div>

      <div className="text-[11px] tracking-[0.18em] uppercase text-olive/60 h-4">
        {phase === "en" ? "Remember the German word…" : "Translation"}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setPaused((p) => !p)}
          className="px-6 py-2.5 rounded-full border border-olive/20 text-[11px] tracking-[0.12em] uppercase text-olive/70 hover:border-olive hover:text-olive transition-colors font-semibold"
        >
          {paused ? "Resume" : "Pause"}
        </button>
        <button
          onClick={skip}
          className="px-6 py-2.5 rounded-full border border-olive/20 text-[11px] tracking-[0.12em] uppercase text-olive/70 hover:border-olive hover:text-olive transition-colors font-semibold"
        >
          Skip →
        </button>
      </div>
    </div>
  );
};
