import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LernzeitSidebar } from "@/components/lernzeit/Sidebar";
import { StepHeader } from "@/components/lernzeit/StepHeader";
import { QuestionList } from "@/components/lernzeit/QuestionList";
import { VocabQuiz } from "@/components/lernzeit/VocabQuiz";
import { GrammarCheckpoint } from "@/components/lernzeit/GrammarCheckpoint";
import { useUser } from "@/context/UserContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { generateProgressPdf } from "@/lib/generatePdf";
import { FileDown, User, ChevronLeft, Hash } from "lucide-react";

// ── Reading text ──────────────────────────────────────────────────────────────

const READING_TEXT = [
  {
    label: null,
    text: "Mia is fourteen years old and started posting videos about her life on TikTok six months ago. At first, she only had twenty followers — mostly friends and family. Then one video went viral: she was singing while doing the dishes, and suddenly she had fifty thousand followers overnight.",
  },
  {
    label: null,
    text: '"It was amazing," she says. "But then the pressure started." Every video had to be perfect. If she did not post for two days, she would lose followers. She started cancelling plans with friends to film content instead. Her grades dropped.',
  },
  {
    label: null,
    text: '"I deleted the app for a month," she explains. "I thought I would feel empty without it. But actually, I felt free. I slept better. I talked to my friends again."',
  },
  {
    label: null,
    text: 'Today, Mia still uses TikTok — but on her own terms. She posts twice a week and turns her phone off at nine in the evening. "Social media is a tool," she says. "You decide how to use it — or it uses you."',
  },
];

// ── Questions ─────────────────────────────────────────────────────────────────

const Q_READING = [
  { q: "When did Mia start posting videos, and how many followers did she have at first?" },
  { q: "How did her first viral video happen?" },
  { q: "Name two negative effects that fame had on her life." },
  { q: "Name two positive things that happened when she deleted the app." },
  { q: "What two rules does Mia follow today to keep social media under control?" },
  { q: 'What does Mia mean by: "Social media is a tool. You decide how to use it — or it uses you."', hint: "Give your own interpretation in 2–3 sentences." },
];

const Q_GRAMMAR_OWN = [
  { q: "Write your own Type 1 conditional sentence about social media.", hint: "If + present simple … will + infinitive. e.g. If you post every day, you will gain more followers." },
  { q: "Write your own Type 2 conditional sentence about social media.", hint: "If + past simple … would + infinitive. e.g. If I had fewer followers, I would feel less pressure." },
  { q: "Write your own Type 3 conditional sentence about social media.", hint: "If + past perfect … would have + past participle. e.g. If she had deleted the app earlier, she would have slept better." },
];

// ── Live checklist regex ──────────────────────────────────────────────────────
const TYPE1_RE = /\bif\b.+(present|'ll|will)\b|\bif\b.+,\s*(i|you|he|she|they|we)\s+will\b/i;
const TYPE2_RE = /\bif\b.+\b(were|had|did|could|knew|went)\b.+\bwould\b(?!\s+have)/i;
const TYPE3_RE = /\bif\b.+\bhad\b.+\bwould have\b/i;
const CONNECTOR_RE = /\b(firstly|in addition|however|furthermore|on the other hand|to sum up|in my opinion|therefore|in conclusion)\b/i;
const OPINION_RE = /\b(in my opinion|I think|I believe|personally|I feel)\b/i;

// ── Name gate ─────────────────────────────────────────────────────────────────
const NameGate = ({ onEnter }: { onEnter: (name: string) => void }) => {
  const [draft, setDraft] = useState("");
  const submit = () => { if (draft.trim()) onEnter(draft.trim()); };
  return (
    <div className="min-h-screen flex items-center justify-center bg-sage">
      <div className="focus-card w-full max-w-md mx-4 text-center">
        <div className="w-14 h-14 rounded-full bg-terracotta/15 flex items-center justify-center mx-auto mb-5">
          <User className="w-7 h-7 text-terracotta" />
        </div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-olive/50 mb-1">Week 6 · Revision</p>
        <h2 className="font-serif text-3xl text-olive mb-2 leading-tight">Welcome to Lernzeit</h2>
        <p className="subtle-note text-sm mb-7">
          Enter your name so we can personalise your progress report.
        </p>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Your full name…"
          autoFocus
          className="w-full bg-sage/50 rounded-2xl px-5 py-3.5 font-sans text-sm text-chocolate placeholder:text-olive/40 outline-none focus:ring-2 focus:ring-terracotta/60 mb-4 text-center"
        />
        <button
          onClick={submit}
          disabled={!draft.trim()}
          className="w-full py-3.5 rounded-2xl bg-olive text-cream font-sans font-semibold text-sm tracking-wide hover:bg-olive/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Start revision →
        </button>
      </div>
    </div>
  );
};

// ── Writing Challenge (inline) ────────────────────────────────────────────────
const WritingChallenge = () => {
  const [tab, setTab] = useState<"A" | "B">("A");
  const [textA, setTextA] = useLocalStorage("w6-challenge-a", "");
  const [textB, setTextB] = useLocalStorage("w6-challenge-b", "");

  const wordCountA = textA.trim() ? textA.trim().split(/\s+/).length : 0;
  const wordCountB = textB.trim() ? textB.trim().split(/\s+/).length : 0;

  const checksA = [
    { label: "Contains a Type 1 conditional (If + present … will…)", ok: TYPE1_RE.test(textA) },
    { label: "Contains a Type 2 conditional (If + past simple … would…)", ok: TYPE2_RE.test(textA) },
    { label: "Contains a Type 3 conditional (If + past perfect … would have…)", ok: TYPE3_RE.test(textA) },
    { label: "All sentences relate to social media", ok: /\b(social media|instagram|tiktok|youtube|post|follower|online|screen|like|vlog)\b/i.test(textA) },
  ];

  const checksB = [
    { label: "Used an essay connector (Firstly, In addition, However…)", ok: CONNECTOR_RE.test(textB) },
    { label: "Gave a personal opinion (In my opinion, I think…)", ok: OPINION_RE.test(textB) },
    { label: "Wrote at least 50 words", ok: wordCountB >= 50 },
    { label: "Includes both a FOR and an AGAINST point", ok: /\b(however|on the other hand|but|although|yet|despite)\b/i.test(textB) },
  ];

  const doneA = checksA.filter((c) => c.ok).length;
  const doneB = checksB.filter((c) => c.ok).length;

  return (
    <div className="space-y-4">
      {/* Tab choice */}
      <div className="flex gap-2">
        {(["A", "B"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full font-sans text-xs font-semibold tracking-wide transition-all ${
              tab === t ? "bg-olive text-cream" : "bg-sage-2 text-olive hover:bg-sage"
            }`}
          >
            Challenge {t}
          </button>
        ))}
      </div>

      {tab === "A" && (
        <div className="grid md:grid-cols-[1fr_200px] gap-5 items-start animate-fade-in">
          <div className="space-y-3">
            <div className="bg-terracotta/10 border border-terracotta/20 rounded-2xl px-5 py-3">
              <p className="font-sans text-sm font-semibold text-chocolate">Challenge A — Three Conditionals</p>
              <p className="font-sans text-xs text-olive/70 mt-0.5 leading-relaxed">
                Write one sentence of each type (Type 1, 2 and 3). Every sentence must be about social media.
              </p>
            </div>
            <div className="bg-cream rounded-2xl p-4 space-y-2 text-xs font-sans text-olive/70">
              <p><span className="font-semibold text-olive">Type 1:</span> If + present simple … will + infinitive</p>
              <p><span className="font-semibold text-terracotta">Type 2:</span> If + past simple … would + infinitive</p>
              <p><span className="font-semibold text-chocolate">Type 3:</span> If + past perfect … would have + past participle</p>
            </div>
            <textarea
              value={textA}
              onChange={(e) => setTextA(e.target.value)}
              rows={6}
              placeholder={"Type 1: If you post every day, you will...\nType 2: If I had fewer followers, I would...\nType 3: If she had deleted the app, she would have..."}
              className="w-full bg-sage/40 rounded-xl px-4 py-3 font-sans text-sm text-chocolate placeholder:text-olive/30 outline-none focus:ring-2 focus:ring-terracotta/60 resize-none"
            />
          </div>
          <div className="bg-cream rounded-2xl p-5 space-y-3 sticky top-6">
            <div className="flex items-center gap-2 mb-1">
              <Hash className="w-4 h-4 text-olive/60" />
              <p className="font-sans text-xs font-semibold text-olive/70 uppercase tracking-wide">Checklist</p>
            </div>
            <p className="font-sans text-[11px] text-olive/50">{doneA}/4 complete</p>
            {checksA.map((c) => (
              <div key={c.label} className="flex items-start gap-2">
                <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 transition-all ${c.ok ? "bg-olive" : "bg-sage"}`} />
                <p className={`font-sans text-[11px] leading-snug transition-all ${c.ok ? "text-olive" : "text-olive/50"}`}>{c.label}</p>
              </div>
            ))}
            {doneA === 4 && (
              <div className="bg-olive/10 border border-olive/20 rounded-xl px-3 py-2 animate-fade-in">
                <p className="font-sans text-xs font-semibold text-olive">All three types done!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "B" && (
        <div className="grid md:grid-cols-[1fr_200px] gap-5 items-start animate-fade-in">
          <div className="space-y-3">
            <div className="bg-terracotta/10 border border-terracotta/20 rounded-2xl px-5 py-3">
              <p className="font-sans text-sm font-semibold text-chocolate">Challenge B — Mini For/Against Paragraph</p>
              <p className="font-sans text-xs text-olive/70 mt-0.5 leading-relaxed">
                Topic: <em>"Should teenagers limit their screen time to 2 hours a day?"</em><br />
                Write 4–6 sentences covering both sides. Use essay connectors and give your own opinion.
              </p>
            </div>
            <div className="bg-cream rounded-2xl p-4 space-y-1 text-xs font-sans">
              <p className="font-semibold text-olive/60 uppercase tracking-wide mb-1.5">Useful connectors</p>
              <div className="flex flex-wrap gap-1.5">
                {["Firstly,", "In addition,", "However,", "Furthermore,", "On the other hand,", "To sum up,", "In my opinion,", "I believe that"].map((c) => (
                  <span key={c} className="px-2 py-0.5 bg-sage/60 rounded-full text-olive text-[11px]">{c}</span>
                ))}
              </div>
            </div>
            <textarea
              value={textB}
              onChange={(e) => setTextB(e.target.value)}
              rows={7}
              placeholder={"Firstly, limiting screen time would...\nHowever, on the other hand...\nIn my opinion..."}
              className="w-full bg-sage/40 rounded-xl px-4 py-3 font-sans text-sm text-chocolate placeholder:text-olive/30 outline-none focus:ring-2 focus:ring-terracotta/60 resize-none"
            />
            <p className="font-sans text-xs text-olive/50 text-right">{wordCountB} words</p>
          </div>
          <div className="bg-cream rounded-2xl p-5 space-y-3 sticky top-6">
            <div className="flex items-center gap-2 mb-1">
              <Hash className="w-4 h-4 text-olive/60" />
              <p className="font-sans text-xs font-semibold text-olive/70 uppercase tracking-wide">Checklist</p>
            </div>
            <p className="font-sans text-[11px] text-olive/50">{doneB}/4 complete</p>
            {checksB.map((c) => (
              <div key={c.label} className="flex items-start gap-2">
                <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 transition-all ${c.ok ? "bg-olive" : "bg-sage"}`} />
                <p className={`font-sans text-[11px] leading-snug transition-all ${c.ok ? "text-olive" : "text-olive/50"}`}>{c.label}</p>
              </div>
            ))}
            {doneB === 4 && (
              <div className="bg-olive/10 border border-olive/20 rounded-xl px-3 py-2 animate-fade-in">
                <p className="font-sans text-xs font-semibold text-olive">Paragraph complete!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const Week6Revision = () => {
  const { week6Name, setWeek6Name } = useUser();
  const navigate = useNavigate();

  const [answers, setAnswers]     = useLocalStorage<Record<string, string>>("w6-answers", {});
  const [submitted, setSubmitted] = useLocalStorage<Record<string, boolean>>("w6-submitted", {});

  const handleAnswerChange = (id: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));
  const handleSubmit = (id: string) =>
    setSubmitted((prev) => ({ ...prev, [id]: !!answers[id]?.trim() }));

  const handleDownloadPdf = () => {
    generateProgressPdf(
      week6Name,
      [
        { stepTitle: "Step 2 · Write Your Own Conditionals", questions: Q_GRAMMAR_OWN, answers, submitted, idPrefix: "s2" },
        { stepTitle: "Step 3 · Reading Comprehension",       questions: Q_READING,     answers, submitted, idPrefix: "s3" },
      ],
      {
        weekLabel:         "WEEK 6 REVISION",
        pageTitle:         "Remix & Share",
        step1SectionTitle: "Steps 1–2 · Vocabulary & Grammar",
        answersTitle:      "Steps 2–3 · Written Answers",
        filenameWeek:      "Week6",
        activities: [
          { badge: "1 · Vocab Sprint",        lines: ["10-question multiple choice quiz"] },
          { badge: "2 · Grammar Checkpoint",  lines: ["8 conditional fill-in-the-blank"] },
          { badge: "4 · Writing Challenge",   lines: ["Conditionals or for/against paragraph"] },
        ],
      }
    );
  };

  if (!week6Name) return <NameGate onEnter={setWeek6Name} />;

  return (
    <div className="min-h-screen flex">
      <LernzeitSidebar />

      <main className="flex-1 ml-60 min-h-screen">
        <div className="p-8 lg:p-12 max-w-5xl mx-auto">

          {/* Breadcrumb */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/")}
              className="text-xs text-olive/60 hover:text-olive flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3 h-3" />
              Overview
            </button>
          </div>

          {/* Hero */}
          <header className="mb-10 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <span className="pill pill-tier">Week 6</span>
              <span className="pill pill-xp">Revision · 80 XP</span>
            </div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-serif text-5xl md:text-6xl text-olive leading-tight tracking-tight">
                  Remix &amp; Share
                </h1>
                <p className="subtle-note text-lg mt-3 max-w-2xl">
                  Vocabulary sprint, grammar checkpoint, a short reading — then one final writing challenge to show everything you have learned about Generation Like.
                </p>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-[11px] tracking-[0.18em] uppercase text-olive/60">
                  Logged in as <span className="text-olive font-semibold">{week6Name}</span>
                </p>
                <button
                  onClick={() => setWeek6Name("")}
                  className="text-[11px] text-olive/40 hover:text-terracotta underline underline-offset-2 transition-colors"
                >
                  Change
                </button>
              </div>
            </div>
          </header>

          {/* ── STEP 1 · Discover ─────────────────────────────────────────── */}
          <section className="mb-14">
            <StepHeader step={1} tier="Discover" title="Vocabulary Sprint" xp={20} />
            <div className="focus-card">
              <h4 className="font-serif text-xl text-olive mb-1">1.1 · Quick-fire round</h4>
              <p className="subtle-note text-sm mb-5">
                Ten questions from across all five weeks. Read the question, choose an answer, and get instant feedback.
              </p>
              <VocabQuiz />
            </div>
          </section>

          {/* ── STEP 2 · Recall ───────────────────────────────────────────── */}
          <section className="mb-14">
            <StepHeader step={2} tier="Recall" title="Grammar Checkpoint" xp={20} />
            <div className="space-y-6">

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">2.1 · Fill in the gaps</h4>
                <p className="subtle-note text-sm mb-5">
                  Choose the correct verb form to complete each conditional sentence. Each sentence is labelled with its type.
                </p>
                <GrammarCheckpoint />
              </div>

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">2.2 · Write your own</h4>
                <p className="subtle-note text-sm mb-4">
                  Write one original conditional sentence of each type. All sentences must be about social media.
                </p>
                <QuestionList
                  questions={Q_GRAMMAR_OWN}
                  idPrefix="s2"
                  stepTitle="Step 2 · Write Your Own Conditionals"
                  answers={answers}
                  submitted={submitted}
                  onAnswerChange={handleAnswerChange}
                  onSubmit={handleSubmit}
                />
              </div>

            </div>
          </section>

          {/* ── STEP 3 · Understand ───────────────────────────────────────── */}
          <section className="mb-14">
            <StepHeader step={3} tier="Understand" title="Reading Sprint" xp={20} />
            <div className="space-y-6">

              {/* Reading text */}
              <div className="focus-card">
                <div className="flex items-center gap-3 mb-5">
                  <div>
                    <h4 className="font-serif text-xl text-olive">3.1 · Read the text</h4>
                    <p className="subtle-note text-sm">Read carefully — then answer the questions below.</p>
                  </div>
                </div>

                <div className="bg-cream rounded-2xl px-6 py-5 space-y-4 border-l-4 border-terracotta/30">
                  <p className="font-sans text-sm font-semibold text-terracotta tracking-wide uppercase text-[11px]">
                    Mia and the Followers
                  </p>
                  {READING_TEXT.map((para, i) => (
                    <p key={i} className="font-sans text-sm text-chocolate leading-relaxed">
                      {para.text}
                    </p>
                  ))}
                </div>
              </div>

              {/* Comprehension questions */}
              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">3.2 · Comprehension</h4>
                <p className="subtle-note text-sm mb-4">
                  Answer in complete sentences where possible.
                </p>
                <QuestionList
                  questions={Q_READING}
                  idPrefix="s3"
                  stepTitle="Step 3 · Reading Comprehension"
                  answers={answers}
                  submitted={submitted}
                  onAnswerChange={handleAnswerChange}
                  onSubmit={handleSubmit}
                />
              </div>

            </div>
          </section>

          {/* ── STEP 4 · Apply ────────────────────────────────────────────── */}
          <section className="mb-14">
            <StepHeader step={4} tier="Apply" title="Writing Challenge" xp={20} />
            <div className="focus-card">
              <h4 className="font-serif text-xl text-olive mb-1">4.1 · Choose your challenge</h4>
              <p className="subtle-note text-sm mb-5">
                <strong>Challenge A</strong> — write one conditional sentence of each type about social media.<br />
                <strong>Challenge B</strong> — write a mini for/against paragraph about screen time limits.
              </p>
              <WritingChallenge />
            </div>
          </section>

          <div className="h-24" />
        </div>
      </main>

      {/* Sticky PDF button */}
      <button
        onClick={handleDownloadPdf}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-7 py-3.5 rounded-full bg-olive text-cream font-sans font-semibold text-sm shadow-lg hover:bg-olive/90 transition-all z-50"
      >
        <FileDown className="w-4 h-4" />
        Generate progress PDF
      </button>
    </div>
  );
};

export default Week6Revision;
