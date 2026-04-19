import { useState } from "react";
import { LernzeitSidebar } from "@/components/lernzeit/Sidebar";
import { Flashcard } from "@/components/lernzeit/Flashcard";
import { VOCABULARY, type Course } from "@/data/vocabulary";
import { BookOpen, Lock } from "lucide-react";

type Screen = "course" | "test" | "deck" | "done";

const Vocabulary = () => {
  const [screen, setScreen] = useState<Screen>("course");
  const [course, setCourse] = useState<Course>("EKurs");
  const [test, setTest] = useState<number>(1);

  const cards = VOCABULARY[course][test];

  const startTest = (n: number) => {
    if (!VOCABULARY[course][n]) return;
    setTest(n);
    setScreen("deck");
  };

  return (
    <div className="min-h-screen bg-sage">
      <LernzeitSidebar />
      <main className="ml-60 px-10 py-12 min-h-screen flex flex-col">
        <header className="mb-10">
          <p className="text-[11px] tracking-[0.22em] uppercase text-olive/60 mb-2">Resources</p>
          <h1 className="font-serif text-4xl text-olive">Vocabulary</h1>
          <p className="font-serif italic text-olive/70 mt-2">
            Flip-card drill · 5s English → 3s Deutsch · auto-advance
          </p>
        </header>

        <section className="flex-1 flex items-start justify-center">
          {screen === "course" && (
            <div className="focus-card w-full max-w-md">
              <p className="text-[10px] tracking-[0.2em] uppercase text-olive/50 mb-1">
                Choose the vocabulary list
              </p>
              <h2 className="font-serif text-2xl text-olive mb-6">Select your course</h2>
              <div className="flex flex-col gap-3">
                {(["EKurs", "GKurs"] as Course[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCourse(c);
                      setScreen("test");
                    }}
                    className="group flex items-center gap-4 px-5 py-4 rounded-2xl border border-olive/15 bg-white/40 hover:bg-white/70 hover:border-terracotta hover:translate-x-1 transition-all text-left"
                  >
                    <BookOpen className="w-5 h-5 text-terracotta" />
                    <span className="flex-1 font-serif text-lg text-olive">{c}</span>
                    <span className="text-olive/40 group-hover:text-terracotta transition-colors">›</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {screen === "test" && (
            <div className="focus-card w-full max-w-md">
              <p className="text-[10px] tracking-[0.2em] uppercase text-olive/50 mb-1">{course}</p>
              <h2 className="font-serif text-2xl text-olive mb-6">Select a test</h2>
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((n) => {
                  const enabled = !!VOCABULARY[course][n];
                  return (
                    <button
                      key={n}
                      onClick={() => startTest(n)}
                      disabled={!enabled}
                      className={`group flex items-center gap-4 px-5 py-4 rounded-2xl border text-left transition-all ${
                        enabled
                          ? "border-olive/15 bg-white/40 hover:bg-white/70 hover:border-terracotta hover:translate-x-1 cursor-pointer"
                          : "border-olive/10 bg-sage-2/40 opacity-60 cursor-not-allowed"
                      }`}
                    >
                      <span className="font-serif text-xl text-terracotta w-6">{n}</span>
                      <span className="flex-1 font-serif text-lg text-olive">
                        Vocabulary Test {n}
                      </span>
                      {enabled ? (
                        <span className="pill pill-xp">Week 1</span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase text-olive/40">
                          <Lock className="w-3 h-3" />
                          Soon
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setScreen("course")}
                className="mt-6 text-[11px] tracking-[0.18em] uppercase text-olive/60 hover:text-olive transition-colors"
              >
                ← Back
              </button>
            </div>
          )}

          {screen === "deck" && cards && (
            <Flashcard
              cards={cards}
              deckLabel={`${course} · Test ${test} · Week 1`}
              onExit={() => setScreen("test")}
              onComplete={() => setScreen("done")}
            />
          )}

          {screen === "done" && (
            <div className="focus-card w-full max-w-md text-center">
              <span className="pill pill-xp mx-auto">+50 XP</span>
              <h2 className="font-serif text-3xl text-olive mt-4">All done! 🎉</h2>
              <p className="text-[11px] tracking-[0.18em] uppercase text-olive/60 mt-2">
                {course} · Test {test}
              </p>
              <p className="font-serif italic text-olive/70 mt-4">
                You reviewed all the words in this deck.
              </p>
              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={() => setScreen("deck")}
                  className="px-6 py-3 rounded-full bg-terracotta text-cream font-semibold tracking-wide text-sm hover:bg-terracotta/90 transition-colors"
                >
                  Restart Deck
                </button>
                <button
                  onClick={() => setScreen("course")}
                  className="px-6 py-3 rounded-full border border-olive text-olive font-semibold tracking-wide text-sm hover:bg-olive hover:text-cream transition-colors"
                >
                  Choose Another Test
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Vocabulary;
