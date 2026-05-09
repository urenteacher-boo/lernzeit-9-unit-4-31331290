import { useNavigate } from "react-router-dom";
import { LernzeitSidebar } from "@/components/lernzeit/Sidebar";
import { Bell, Search } from "lucide-react";
import heroImg from "@/assets/hero-generation-like.png";

const WEEKS = [
  { n: 1, label: "Reading",    subtitle: "\"The Highlight Reel\"",  color: "bg-moss" },
  { n: 2, label: "Listening",  subtitle: "\"Do You Feel Seen?\"",   color: "bg-terracotta" },
  { n: 3, label: "Grammar",    subtitle: "\"Fix the Caption\"",      color: "bg-olive" },
  { n: 4, label: "Vocab & Writing", subtitle: "\"Say It, Write It\"", color: "bg-sand" },
  { n: 5, label: "Speaking",   subtitle: "\"Your 30-Sec Take\"",     color: "bg-stone-olive" },
  { n: 6, label: "Revision",   subtitle: "\"Remix & Share\"",        color: "bg-chocolate" },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      <LernzeitSidebar />

      <main className="flex-1 ml-60 min-h-screen">
        <div className="p-8 lg:p-12 max-w-7xl mx-auto">

          {/* Top nav */}
          <header className="flex justify-between items-center mb-8">
            <div className="flex gap-8 items-center">
              <button className="text-olive border-b-2 border-olive font-semibold text-sm">Course</button>
              <button className="text-stone-500 font-medium hover:text-olive transition text-sm">Resources</button>
              <button className="text-stone-500 font-medium hover:text-olive transition text-sm">Community</button>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-stone-500 hover:text-olive transition">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-olive">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Hero */}
          <section className="hero-section relative mb-16 h-[380px] rounded-[2rem] overflow-hidden shadow-2xl bg-gradient-to-br from-stone-olive via-olive to-chocolate group">
            <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_50%)]" />
            <img
              src={heroImg}
              alt="Generation Like"
              className="hero-img absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-olive/80 via-transparent to-transparent" />
            <div className="absolute bottom-10 left-10 right-10">
              <div className="font-serif italic text-cream/80 text-sm mb-2">"If you didn't post it, did it even happen?"</div>
              <h1 className="font-serif italic text-5xl md:text-6xl text-cream mb-3 leading-tight">Generation Like</h1>
              <p className="font-sans text-base text-cream/80 max-w-xl leading-relaxed">
                Six weeks exploring how social media shapes how teens see themselves — and each other.
              </p>
            </div>
          </section>

          {/* Curriculum grid */}
          <section className="mb-20">
            <div className="flex justify-between items-end mb-8">
              <h3 className="font-serif italic text-3xl text-olive">Weekly Curriculum</h3>
              <div className="text-sm text-stone-olive">Pick a week to start</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {WEEKS.map((w) => (
                <button
                  key={w.n}
                  onClick={() => w.n === 1 ? navigate("/week/1") : w.n === 2 ? navigate("/week/2") : w.n === 3 ? navigate("/week/3") : w.n === 4 ? navigate("/week/4") : undefined}
                  className={`curriculum-card group relative aspect-[4/3] ${w.color} rounded-[2rem] overflow-hidden shadow-lg text-left focus-card-lift`}
                >
                  {/* Leaf pattern overlay */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: "var(--pattern-leaf)" }} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
                    <div className="text-cream/70 text-[10px] uppercase tracking-[0.2em] mb-2">Week {w.n}</div>
                    <h4 className="font-serif italic text-4xl text-cream">{w.label}</h4>
                    <p className="font-serif italic text-cream/80 text-sm mt-3 text-center">{w.subtitle}</p>
                  </div>
                  <div className="absolute bottom-4 right-4 text-cream/50 group-hover:text-cream/90 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
