import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LernzeitSidebar } from "@/components/lernzeit/Sidebar";
import { StepHeader } from "@/components/lernzeit/StepHeader";
import { QuestionList } from "@/components/lernzeit/QuestionList";
import { VocabToolkit } from "@/components/lernzeit/VocabToolkit";
import { StarterCards } from "@/components/lernzeit/StarterCards";
import { GuidedImageDesc } from "@/components/lernzeit/GuidedImageDesc";
import { TalkBuilder } from "@/components/lernzeit/TalkBuilder";
import { useUser } from "@/context/UserContext";
import { generateProgressPdf } from "@/lib/generatePdf";
import { FileDown, User, ChevronLeft } from "lucide-react";

// ── Questions ─────────────────────────────────────────────────────────────────

const Q_STEP1 = [
  {
    q: "Choose two location phrases and write your own sentences about any image.",
    hint: "e.g. 'In the foreground there is… / In the background I can see…'",
  },
  {
    q: "Use a speculating phrase to describe what someone in a photo might be thinking.",
    hint: "e.g. 'They might be… / It looks as if… / The person seems to be…'",
  },
];

const Q_STEP2 = [
  {
    q: "Use an 'Opening the description' starter to describe any photo you know.",
    hint: "e.g. 'This image shows… / In this photograph, I can see…'",
  },
  {
    q: "Write a sentence connecting any image to the topic of Generation Like.",
    hint: "e.g. 'This reminds me of Generation Like because… / This image relates to…'",
  },
];

const Q_STEP4 = [
  {
    q: "Peer review: listen to your partner's talk. Which image did they choose?",
    hint: "Note down the main things they mentioned.",
  },
  {
    q: "Peer review: did your partner use any location language (foreground / background)? Write the phrase they used.",
    hint: "If they didn't use it, write a suggestion for them.",
  },
  {
    q: "Peer review: how well did they connect to the Generation Like theme? Give one specific example from their talk.",
  },
];

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
        <p className="text-[10px] tracking-[0.2em] uppercase text-olive/50 mb-1">Week 5 · Speaking</p>
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
          Start speaking →
        </button>
      </div>
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const Week5Speaking = () => {
  const { week5Name, setWeek5Name } = useUser();
  const navigate = useNavigate();

  const [answers, setAnswers]     = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const handleAnswerChange = (id: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));
  const handleSubmit = (id: string) =>
    setSubmitted((prev) => ({ ...prev, [id]: !!answers[id]?.trim() }));

  const hasAnyProgress = Object.values(answers).some((v) => v?.trim());

  const handleDownloadPdf = () => {
    generateProgressPdf(
      week5Name,
      [
        { stepTitle: "Step 1 · Vocabulary Use It!", questions: Q_STEP1, answers, submitted, idPrefix: "s1" },
        { stepTitle: "Step 2 · Sentence Starters Use It!", questions: Q_STEP2, answers, submitted, idPrefix: "s2" },
        { stepTitle: "Step 4 · Peer Review", questions: Q_STEP4, answers, submitted, idPrefix: "s4" },
      ],
      {
        weekLabel:         "WEEK 5 SPEAKING",
        pageTitle:         "Picture Description",
        step1SectionTitle: "Steps 1–2 · Written Practice",
        answersTitle:      "Steps 1, 2 & 4 · Written Answers",
        filenameWeek:      "Week5",
        activities: [
          { badge: "1 · Vocabulary Toolkit",   lines: ["Interactive vocab practice complete"] },
          { badge: "2 · Sentence Starters",    lines: ["Matching exercise complete"]         },
          { badge: "3 · Guided Description",   lines: ["Guided image description complete"]  },
        ],
      }
    );
  };

  if (!week5Name) return <NameGate onEnter={setWeek5Name} />;

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
              <span className="pill pill-tier">Week 5</span>
              <span className="pill pill-xp">Speaking · 80 XP</span>
            </div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-serif text-5xl md:text-6xl text-olive leading-tight tracking-tight">
                  Picture Description
                </h1>
                <p className="subtle-note text-lg mt-3 max-w-2xl">
                  Build your vocabulary, practise sentence starters, describe a guided image — then deliver your own 1-minute talk about Generation Like.
                </p>
              </div>
              <div className="mt-1">
                <p className="text-[11px] tracking-[0.18em] uppercase text-olive/60">
                  Logged in as <span className="text-olive font-semibold">{week5Name}</span>
                </p>
              </div>
            </div>
          </header>

          {/* ── STEP 1 · Discover ─────────────────────────────────────────── */}
          <section className="mb-14">
            <StepHeader step={1} tier="Discover" title="Vocabulary Toolkit" xp={20} />
            <div className="space-y-6">

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">1.1 · Explore the vocabulary</h4>
                <p className="subtle-note text-sm mb-5">
                  Tap any card to see an example sentence. Work through all five categories before moving on.
                </p>
                <VocabToolkit />
              </div>

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">1.2 · Use it!</h4>
                <p className="subtle-note text-sm mb-4">
                  Practise using the vocabulary in your own sentences.
                </p>
                <QuestionList
                  questions={Q_STEP1}
                  idPrefix="s1"
                  stepTitle="Step 1 Vocab Use It"
                  answers={answers}
                  submitted={submitted}
                  onAnswerChange={handleAnswerChange}
                  onSubmit={handleSubmit}
                />
              </div>

            </div>
          </section>

          {/* ── STEP 2 · Recall ───────────────────────────────────────────── */}
          <section className="mb-14">
            <StepHeader step={2} tier="Recall" title="Sentence Starters" xp={20} />
            <div className="space-y-6">

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">2.1 · Reference cards &amp; matching</h4>
                <p className="subtle-note text-sm mb-5">
                  Browse the sentence starters by function, then switch to <em>Matching practice</em> to test yourself.
                </p>
                <StarterCards />
              </div>

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">2.2 · Use it!</h4>
                <p className="subtle-note text-sm mb-4">
                  Write your own sentences using the starters you have just learnt.
                </p>
                <QuestionList
                  questions={Q_STEP2}
                  idPrefix="s2"
                  stepTitle="Step 2 Starters Use It"
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
            <StepHeader step={3} tier="Understand" title="Guided Description" xp={20} />
            <div className="space-y-6">

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">3.1 · Answer by answer</h4>
                <p className="subtle-note text-sm mb-5">
                  Study the image carefully, then answer all six questions. When you finish, reveal the model answer and compare.
                </p>
                <GuidedImageDesc
                  imgSrc="/images/speaking-a.jpg"
                  imgAlt="Teenager at desk at 2:47 am surrounded by social media screens, homework untouched"
                />
              </div>

              {/* Useful language reminder */}
              <div className="bg-cream rounded-2xl p-5">
                <p className="text-[10px] tracking-[0.18em] uppercase text-olive/60 mb-3">Quick reference</p>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <p className="font-sans text-xs font-semibold text-terracotta mb-1.5">Location</p>
                    <p className="font-sans text-xs text-chocolate leading-relaxed">
                      foreground · background · on the left / right · in the centre · at the top / bottom
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-xs font-semibold text-terracotta mb-1.5">Speculating</p>
                    <p className="font-sans text-xs text-chocolate leading-relaxed">
                      might be · could be · seems to be · appears to be · it looks as if · probably
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-xs font-semibold text-terracotta mb-1.5">Mood</p>
                    <p className="font-sans text-xs text-chocolate leading-relaxed">
                      the atmosphere is · the image conveys · there is a sense of · the overall tone
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* ── STEP 4 · Apply ────────────────────────────────────────────── */}
          <section className="mb-14">
            <StepHeader step={4} tier="Apply" title="Your 1-Minute Talk" xp={20} />
            <div className="space-y-6">

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">4.1 · Talk builder</h4>
                <p className="subtle-note text-sm mb-5">
                  Choose one of the three images, then write your 1-minute talk section by section. The live checklist tracks the language requirements — aim for all five green before you present.
                </p>
                <TalkBuilder />
              </div>

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">4.2 · Peer review</h4>
                <p className="subtle-note text-sm mb-4">
                  Listen to your partner's talk, then answer the questions below.
                </p>
                <QuestionList
                  questions={Q_STEP4}
                  idPrefix="s4"
                  stepTitle="Step 4 Peer Review"
                  answers={answers}
                  submitted={submitted}
                  onAnswerChange={handleAnswerChange}
                  onSubmit={handleSubmit}
                />
              </div>

            </div>
          </section>

          <div className="h-24" />
        </div>
      </main>

      {/* Sticky PDF button */}
      {hasAnyProgress && (
        <button
          onClick={handleDownloadPdf}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-7 py-3.5 rounded-full bg-olive text-cream font-sans font-semibold text-sm shadow-lg hover:bg-olive/90 transition-all z-50 animate-fade-in"
        >
          <FileDown className="w-4 h-4" />
          Generate progress PDF
        </button>
      )}
    </div>
  );
};

export default Week5Speaking;
