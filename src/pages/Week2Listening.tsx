import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LernzeitSidebar } from "@/components/lernzeit/Sidebar";
import { StepHeader } from "@/components/lernzeit/StepHeader";
import { QuestionList } from "@/components/lernzeit/QuestionList";
import { AudioPlayer } from "@/components/lernzeit/AudioPlayer";
import { VocabMatch } from "@/components/lernzeit/VocabMatch";
import { VocabImageMatch } from "@/components/lernzeit/VocabImageMatch";
import { EventOrder } from "@/components/lernzeit/EventOrder";
import { PronounSelect } from "@/components/lernzeit/PronounSelect";
import { DialogueFill } from "@/components/lernzeit/DialogueFill";
import { PeerReview } from "@/components/lernzeit/PeerReview";
import { useUser } from "@/context/UserContext";
import { generateProgressPdf } from "@/lib/generatePdf";
import { FileDown, User, ChevronLeft, Hash, AtSign } from "lucide-react";

// ── Audio tracks ─────────────────────────────────────────────────────────────
const AUDIO_2 = [{ label: "Audio 2", src: "/audio/8_07.mp3" }];
const AUDIO_3 = [{ label: "Audio 3", src: "/audio/8_08.mp3" }];
const AUDIO_4 = [{ label: "Audio 4", src: "/audio/8_09.mp3" }];

// ── Questions ─────────────────────────────────────────────────────────────────
const Q_STEP2 = [
  { q: "Why did Jerome start a YouTube channel?" },
  { q: "Why did he delete his videos at first?" },
  { q: "What did his followers like about his vlogs?" },
  { q: "Why did he nearly shut down his account?" },
  { q: "How did he solve the problem?" },
  { q: "When did companies send him new games?" },
  { q: "What advice does he give to new influencers?" },
];

const Q_STEP3_USE_IT = [
  { q: "I have taught myself to …", hint: "Complete this sentence truthfully." },
  { q: "I never go anywhere without …", hint: "Complete this sentence truthfully." },
  { q: "I compare myself to others when …", hint: "Complete this sentence truthfully." },
];


const Q_STEP4 = [
  {
    q: "Write your persuasive Instagram caption below.",
    hint: "Include: a catchy opening line · one indefinite pronoun (everyone, nothing, something…) · one reflexive or reciprocal pronoun (yourself, themselves, each other…) · FOMO language · 3–5 hashtags",
  },
  { q: "Peer review: swap captions with a partner. Did they use an indefinite pronoun? Quote it here." },
  { q: "Peer review: did their caption make you feel you were missing out? Give one example phrase they used." },
];

// ── Instagram checklist ───────────────────────────────────────────────────────
const INDEFINITE = /\b(everyone|everybody|someone|somebody|anyone|anybody|no one|nobody|everything|something|anything|nothing)\b/i;
const REFLEXIVE  = /\b(myself|yourself|himself|herself|itself|ourselves|yourselves|themselves|each other|one another)\b/i;
const HASHTAG    = /#\w+/g;

const InstagramTask = () => {
  const [product, setProduct] = useState("");
  const [caption, setCaption] = useState("");

  const tags   = (caption.match(HASHTAG) || []).length;
  const checks = [
    { label: "Catchy opening line (first sentence present)",   ok: caption.trim().split(/[.!?]/)[0].trim().length > 5 },
    { label: "Indefinite pronoun used",                        ok: INDEFINITE.test(caption) },
    { label: "Reflexive or reciprocal pronoun used",           ok: REFLEXIVE.test(caption) },
    { label: "FOMO language (missing out / don't miss / limited…)", ok: /missing out|don't miss|limited|only|now|today|last chance|hurry/i.test(caption) },
    { label: `Hashtags (${tags} found — need 3–5)`,           ok: tags >= 3 && tags <= 5 },
  ];
  const done = checks.filter((c) => c.ok).length;

  return (
    <div className="space-y-5">
      {/* Mission banner */}
      <div className="flex items-start gap-3 bg-terracotta/10 border border-terracotta/20 rounded-2xl px-5 py-4">
        <AtSign className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-sans text-sm font-semibold text-chocolate">Mission: become an influencer</p>
          <p className="font-sans text-xs text-olive/70 mt-0.5 leading-relaxed">
            Choose any product you like. Write a persuasive Instagram caption to convince your followers to buy it. Tick off all five requirements.
          </p>
        </div>
      </div>

      {/* Useful language reference */}
      <div className="bg-cream rounded-2xl p-5 space-y-3">
        <p className="text-[10px] tracking-[0.18em] uppercase text-olive/60">Useful language</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <p className="font-sans text-xs font-semibold text-terracotta mb-1.5">Indefinite pronouns</p>
            <p className="font-sans text-xs text-chocolate leading-relaxed">everyone · someone · anyone · nobody · nothing · something · everything · anything</p>
          </div>
          <div>
            <p className="font-sans text-xs font-semibold text-terracotta mb-1.5">Reflexive / reciprocal pronouns</p>
            <p className="font-sans text-xs text-chocolate leading-relaxed">yourself · themselves · myself · himself · herself · each other · one another</p>
          </div>
          <div>
            <p className="font-sans text-xs font-semibold text-terracotta mb-1.5">FOMO language</p>
            <p className="font-sans text-xs text-chocolate leading-relaxed">Don't miss out · Limited time only · Everyone is talking about · You're missing out if…</p>
          </div>
          <div>
            <p className="font-sans text-xs font-semibold text-terracotta mb-1.5">Caption tips</p>
            <p className="font-sans text-xs text-chocolate leading-relaxed">Start with a hook · Use exclamation marks · End with 3–5 hashtags</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start">
        {/* Left: inputs */}
        <div className="space-y-4">
          <div>
            <label className="font-sans text-xs font-semibold text-olive/70 uppercase tracking-wide mb-1.5 block">
              Your product
            </label>
            <input
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="e.g. wireless headphones, skincare cream, energy drink…"
              className="w-full bg-sage/40 rounded-xl px-4 py-3 font-sans text-sm text-chocolate placeholder:text-olive/40 outline-none focus:ring-2 focus:ring-terracotta/60"
            />
          </div>

          <div>
            <label className="font-sans text-xs font-semibold text-olive/70 uppercase tracking-wide mb-1.5 block">
              Your Instagram caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={7}
              placeholder={"✨ Stop what you're doing — everyone needs to try this!\n\nRemember to include pronouns and FOMO language…\n\n#YourHashtags #Here"}
              className="w-full bg-sage/40 rounded-xl px-4 py-3 font-sans text-sm text-chocolate placeholder:text-olive/40 outline-none focus:ring-2 focus:ring-terracotta/60 resize-none"
            />
          </div>
        </div>

        {/* Right: live checklist */}
        <div className="min-w-[200px] bg-cream rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Hash className="w-4 h-4 text-olive/60" />
            <p className="font-sans text-xs font-semibold text-olive/70 uppercase tracking-wide">Requirements</p>
          </div>
          <p className="font-sans text-[11px] text-olive/50">{done}/5 complete</p>
          <div className="space-y-2.5">
            {checks.map((c) => (
              <div key={c.label} className="flex items-start gap-2">
                <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 transition-all ${c.ok ? "bg-olive" : "bg-sage"}`} />
                <p className={`font-sans text-[12px] leading-snug transition-all ${c.ok ? "text-olive" : "text-olive/50"}`}>{c.label}</p>
              </div>
            ))}
          </div>
          {done === 5 && (
            <div className="bg-olive/10 border border-olive/20 rounded-xl px-3 py-2 mt-2 animate-fade-in">
              <p className="font-sans text-xs font-semibold text-olive">All requirements met!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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
        <p className="text-[10px] tracking-[0.2em] uppercase text-olive/50 mb-1">Week 2 · Listening</p>
        <h2 className="font-serif text-3xl text-olive mb-2 leading-tight">Welcome to Lernzeit</h2>
        <p className="subtle-note text-sm mb-7">Enter your name so we can personalise your progress report.</p>
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
          Start listening →
        </button>
      </div>
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const Week2Listening = () => {
  const { week2Name, setWeek2Name } = useUser();
  const navigate = useNavigate();

  const [imageMatched, setImageMatched] = useState(0);
  const [vocabScore,   setVocabScore]   = useState(0);

  const [answers, setAnswers]     = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const handleAnswerChange = (id: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));

  const handleSubmit = (id: string) =>
    setSubmitted((prev) => ({ ...prev, [id]: !!answers[id]?.trim() }));

  const hasAnyProgress =
    imageMatched > 0 ||
    vocabScore   > 0 ||
    Object.values(answers).some((v) => v?.trim()) ||
    Object.values(submitted).some(Boolean);

  const handleDownloadPdf = () => {
    generateProgressPdf(
      week2Name,
      [
        { stepTitle: "Step 2 · Listening Comprehension", questions: Q_STEP2,        answers, submitted, idPrefix: "s2" },
        { stepTitle: "Step 3 · Grammar Use It!",         questions: Q_STEP3_USE_IT, answers, submitted, idPrefix: "s3u" },
        { stepTitle: "Step 4 · Sell It!",                questions: Q_STEP4,        answers, submitted, idPrefix: "s4" },
      ],
      {
        weekLabel:         "WEEK 2 LISTENING",
        pageTitle:         "Jerome the Influencer",
        step1SectionTitle: "Step 1 · Discover — Vocabulary Activities",
        answersTitle:      "Steps 2–4 · Written Answers",
        filenameWeek:      "Week2",
        activities: [
          { badge: "1.1 · Image Match",  lines: [`Images matched: ${imageMatched} / 10`] },
          { badge: "1.2 · Vocab Match",  lines: [`Score: ${vocabScore} / 10`] },
        ],
      }
    );
  };

  if (!week2Name) return <NameGate onEnter={setWeek2Name} />;

  return (
    <div className="min-h-screen flex">
      <LernzeitSidebar />

      <main className="flex-1 ml-60 min-h-screen">
        <div className="p-8 lg:p-12 max-w-5xl mx-auto">

          {/* Back breadcrumb */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/")}
              className="text-xs text-olive/60 hover:text-olive flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3 h-3" />
              Overview
            </button>
          </div>

          {/* Hero header */}
          <header className="mb-10 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <span className="pill pill-tier">Week 2</span>
              <span className="pill pill-xp">Listening · 80 XP</span>
            </div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-serif text-5xl md:text-6xl text-olive leading-tight tracking-tight">Jerome the Influencer</h1>
                <p className="subtle-note text-lg mt-3 max-w-2xl">
                  Learn the vocabulary of social media, listen to Jerome's story, then write your own persuasive caption.
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 mt-1">
                <p className="text-[11px] tracking-[0.18em] uppercase text-olive/60">
                  Logged in as <span className="text-olive font-semibold">{week2Name}</span>
                </p>
              </div>
            </div>
          </header>

          {/* ── STEP 1 ── */}
          <section className="mb-14">
            <StepHeader step={1} tier="Discover" title="Vocabulary" xp={20} />
            <div className="space-y-6">

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">1.1 · Match images to words</h4>
                <p className="subtle-note text-sm mb-5">
                  Listen to track 8.6, then tap an image and tap its matching word.
                </p>
                <VocabImageMatch onProgress={setImageMatched} />
              </div>

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">1.2 · Match the words to the definitions</h4>
                <p className="subtle-note text-sm mb-5">
                  Match words 1–10 with definitions a–j. Select the correct letter from each dropdown.
                </p>
                <VocabMatch onScore={setVocabScore} />
              </div>

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">1.3 · Use It!</h4>
                <p className="subtle-note text-sm mb-5">Complete these sentences about yourself.</p>
                <QuestionList
                  questions={[
                    { q: "Something I have subscribed to:" },
                    { q: "Something I have deleted online:" },
                    { q: "Someone I follow on social media:" },
                  ]}
                  idPrefix="s1"
                  stepTitle="Step 1 · Vocabulary Use It!"
                  answers={answers}
                  submitted={submitted}
                  onAnswerChange={handleAnswerChange}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          </section>

          {/* ── STEP 2 ── */}
          <section className="mb-14">
            <StepHeader step={2} tier="Recall" title="Listening — Jerome the Influencer" xp={20} />
            <div className="space-y-6">

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">2.1 · Before you listen — predict the order</h4>
                <p className="subtle-note text-sm mb-5">
                  Number the events 1–5 in the order you think Jerome did them (1 = first). Then listen to check.
                </p>
                <AudioPlayer tracks={AUDIO_2} />
                <div className="mt-5">
                  <EventOrder />
                </div>
              </div>

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">2.2 · Listen again and answer in full sentences</h4>
                <p className="subtle-note text-sm mb-5">Write your answers in complete sentences.</p>
                <QuestionList
                  questions={Q_STEP2}
                  idPrefix="s2"
                  stepTitle="Step 2 · Listening Comprehension"
                  answers={answers}
                  submitted={submitted}
                  onAnswerChange={handleAnswerChange}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          </section>

          {/* ── STEP 3 ── */}
          <section className="mb-14">
            <StepHeader step={3} tier="Understand" title="Grammar — Pronouns" xp={20} />
            <div className="space-y-6">

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">3.1 · Circle the correct pronoun</h4>
                <p className="subtle-note text-sm mb-5">
                  Tap the correct word (indefinite or reflexive/reciprocal pronoun) to complete each sentence.
                </p>
                <AudioPlayer tracks={AUDIO_3} />
                <div className="mt-5">
                  <PronounSelect />
                </div>
              </div>

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">3.1 · Use It!</h4>
                <p className="subtle-note text-sm mb-5">Complete these sentences so they are true for you.</p>
                <QuestionList
                  questions={Q_STEP3_USE_IT}
                  idPrefix="s3u"
                  stepTitle="Step 3 · Grammar Use It!"
                  answers={answers}
                  submitted={submitted}
                  onAnswerChange={handleAnswerChange}
                  onSubmit={handleSubmit}
                />
              </div>

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">3.2 · Recommending an Online Tool</h4>
                <p className="subtle-note text-sm mb-2">Complete the conversation using phrases from the Useful Language box.</p>
                <AudioPlayer tracks={AUDIO_4} />
                <div className="mt-5">
                  <DialogueFill />
                </div>
              </div>
            </div>
          </section>

          {/* ── STEP 4 ── */}
          <section className="mb-20">
            <StepHeader step={4} tier="Apply · Challenge" title="Sell It! — Instagram Caption" xp={20} />
            <div className="focus-card">
              <h4 className="font-serif text-xl text-olive mb-1">4.1 · Write your caption</h4>
              <p className="subtle-note text-sm mb-5">
                You are a social media influencer. Choose any product and write a persuasive Instagram caption.
                The live checklist on the right tracks your requirements automatically.
              </p>
              <InstagramTask />
            </div>

            <div className="focus-card mt-6">
              <h4 className="font-serif text-xl text-olive mb-1">4.2 · Peer review</h4>
              <PeerReview />
            </div>
          </section>

          {/* Sticky download bar */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <button
              onClick={handleDownloadPdf}
              disabled={!hasAnyProgress}
              title={!hasAnyProgress ? "Start any task to generate a PDF" : ""}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-olive text-cream font-sans font-semibold text-sm tracking-wide shadow-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-olive/90 hover:enabled:-translate-y-0.5"
            >
              <FileDown className="w-4 h-4" />
              {hasAnyProgress ? `Generate PDF — ${week2Name}` : "Generate PDF"}
            </button>
          </div>

          <footer className="text-center pb-24">
            <p className="subtle-note">End of Week 2 · Listening. You are becoming a digital expert.</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Week2Listening;
