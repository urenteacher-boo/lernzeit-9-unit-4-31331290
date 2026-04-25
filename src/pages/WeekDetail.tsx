import { useNavigate } from "react-router-dom";
import { LernzeitSidebar } from "@/components/lernzeit/Sidebar";
import { ChevronLeft } from "lucide-react";

const TIERS = [
  {
    n: "01",
    name: "Spark",
    desc: "Pictures + key words. Low-floor start.",
    dots: 3,
    filled: 0,
    tasks: 3,
    xp: 20,
    active: false,
  },
  {
    n: "02",
    name: "Build",
    desc: "Short texts, guided questions, gap-fills.",
    dots: 5,
    filled: 2,
    tasks: 5,
    xp: 40,
    active: true,
  },
  {
    n: "03",
    name: "Stretch",
    desc: "Longer piece, open responses, your opinion.",
    dots: 5,
    filled: 0,
    tasks: 5,
    xp: 60,
    active: false,
  },
  {
    n: "04",
    name: "Remix",
    desc: "Create & share. Make a post, a reply, a script.",
    dots: 3,
    filled: 0,
    tasks: 3,
    xp: 80,
    active: false,
  },
];

export default function WeekDetail() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      <LernzeitSidebar />

      <main className="flex-1 ml-60 min-h-screen">
        <div className="p-8 lg:p-12 max-w-7xl mx-auto">

          {/* Back */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/")}
              className="text-xs text-olive/60 hover:text-olive flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3 h-3" />
              Overview
            </button>
          </div>

          {/* Header */}
          <div className="flex items-end justify-between gap-6 mb-10 flex-wrap">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-olive/60 mb-1">Week 1 · Reading</div>
              <h2 className="font-serif italic text-5xl text-olive leading-tight">The Highlight Reel</h2>
              <p className="subtle-note text-lg mt-3 max-w-2xl">
                Pick your level. You can switch tiers anytime — no penalty.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="pill pill-tier">6 min/day</span>
              <span className="pill pill-xp">up to +200 XP</span>
            </div>
          </div>

          {/* Tier cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TIERS.map((tier) => (
              <button
                key={tier.n}
                onClick={() => navigate("/week/1/tasks")}
                className={`tier-card text-left focus-card p-7 relative focus-card-lift ${
                  tier.active ? "ring-2 ring-terracotta/60" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-olive/50">Tier {tier.n}</div>
                    <h3 className="font-serif italic text-3xl text-olive mt-1">{tier.name}</h3>
                  </div>
                  {tier.active && <span className="pill pill-xp">continue</span>}
                </div>
                <p className="text-sm text-stone-olive leading-relaxed mb-5">{tier.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {Array.from({ length: tier.dots }).map((_, i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full ${i < tier.filled ? "bg-olive" : "bg-olive/20"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-stone-olive">{tier.tasks} tasks · +{tier.xp} XP</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
