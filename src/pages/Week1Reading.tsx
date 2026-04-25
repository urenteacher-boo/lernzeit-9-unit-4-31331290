import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LernzeitSidebar } from "@/components/lernzeit/Sidebar";
import { StepHeader } from "@/components/lernzeit/StepHeader";
import { WordSearch } from "@/components/lernzeit/WordSearch";
import { ImageMatch } from "@/components/lernzeit/ImageMatch";
import { SafeProfile } from "@/components/lernzeit/SafeProfile";
import { PairMatch } from "@/components/lernzeit/PairMatch";
import { QuestionList } from "@/components/lernzeit/QuestionList";
import { useUser } from "@/context/UserContext";
import { generateProgressPdf } from "@/lib/generatePdf";
import { FileDown, User, ChevronLeft } from "lucide-react";

const TIPS = [
  "Don't forget to log off when you leave a website, especially on a shared computer. Otherwise someone can easily pretend to be you.",
  "Don't tell anyone your passwords. Make them complex with letters, numbers and punctuation.",
  "Tell an adult if you find anything online that makes you upset, anxious or concerned. Web managers usually respond rapidly.",
  "Use the history button and bookmarks to find favourite sites — but clear your browser history regularly.",
  "Posting comments? Invent a nickname and use a picture instead of a real photo.",
  "Protect your identity. Think twice before sharing your email, address, school or phone number.",
];

const Q_STEP2 = [
  { q: "Why should you log off when using a computer at school or a library?" },
  { q: "What are two things you can add to a password to make it 'complex'?" },
  { q: "Instead of your real name, what should you use when posting comments?" },
  { q: "True or False: You should clear your browser history regularly." },
  { q: "List three pieces of personal information you should never share with strangers." },
];

const Q_STEP3 = [
  { q: "The Comparison: list three things a digital footprint reveals about a user." },
  { q: "The Professionals: why are universities and employers interested in what you do online?" },
  { q: "The Risk: what is the specific danger of leaving a website without logging off?" },
  { q: "The Reaction: how do web managers usually respond when you report inappropriate content?" },
  { q: "The Final Test: what is the 'Golden Question' you should ask before posting?" },
];

const Q_STEP4 = [
  { q: "Analysis: describe something a student might post today that could make a recruiter decide not to hire them in five years.", hint: "Be specific — a post, a photo, a comment." },
  { q: "Strategy: how could a positive digital footprint (blog, project) help you get into a university?" },
  { q: "Password Security: write a weak password and a complex one. Explain why the complex one is safer." },
  { q: "Debate: is it fair for employers to look at what you did at 14? Give two reasons." },
];

const NameGate = ({ onEnter }: { onEnter: (name: string) => void }) => {
  const [draft, setDraft] = useState("");
  const submit = () => { if (draft.trim()) onEnter(draft.trim()); };
  return (
    <div className="min-h-screen flex items-center justify-center bg-sage">
      <div className="focus-card w-full max-w-md mx-4 text-center">
        <div className="w-14 h-14 rounded-full bg-terracotta/15 flex items-center justify-center mx-auto mb-5">
          <User className="w-7 h-7 text-terracotta" />
        </div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-olive/50 mb-1">Week 1 · Reading</p>
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
          Start reading →
        </button>
      </div>
    </div>
  );
};

const Week1Reading = () => {
  const { week1Name, setWeek1Name } = useUser();
  const navigate = useNavigate();

  const [wordsFound, setWordsFound] = useState<string[]>([]);
  const [imageMatched, setImageMatched] = useState(0);
  const [pairMatched, setPairMatched] = useState(0);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const handleAnswerChange = (id: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));

  const handleSubmit = (id: string) =>
    setSubmitted((prev) => ({ ...prev, [id]: !!answers[id]?.trim() }));

  const hasAnyProgress =
    wordsFound.length > 0 ||
    imageMatched > 0 ||
    pairMatched > 0 ||
    Object.values(answers).some((v) => v?.trim()) ||
    Object.values(submitted).some(Boolean);

  const handleDownloadPdf = () => {
    generateProgressPdf(
      week1Name,
      [
        { stepTitle: "Step 2 · Recall", questions: Q_STEP2, answers, submitted, idPrefix: "s2" },
        { stepTitle: "Step 3 · Understand", questions: Q_STEP3, answers, submitted, idPrefix: "s3" },
        { stepTitle: "Step 4 · Apply & Challenge", questions: Q_STEP4, answers, submitted, idPrefix: "s4" },
      ],
      {
        weekLabel: "WEEK 1 READING",
        pageTitle: "Your Digital Footprint",
        step1SectionTitle: "Step 1 · Discover — Vocabulary Activities",
        answersTitle: "Steps 2–4 · Written Answers",
        filenameWeek: "Week1",
        activities: [
          { badge: "1.1 · Word Search",       lines: [`Words found: ${wordsFound.length} / 6`, wordsFound.length > 0 ? wordsFound.join("  ·  ") : "None found"] },
          { badge: "1.2 · Image Match",        lines: [`Images matched: ${imageMatched} / 6`] },
          { badge: "1.3 · Safe Profile",       lines: ["Interactive profile-building exercise completed."] },
          { badge: "1.4 · Connect the Pairs",  lines: [`Pairs matched: ${pairMatched} / 3`] },
        ],
      }
    );
  };

  if (!week1Name) return <NameGate onEnter={setWeek1Name} />;

  return (
    <div className="min-h-screen flex">
      <LernzeitSidebar />

      <main className="flex-1 ml-60 min-h-screen">
        <div className="p-8 lg:p-12 max-w-5xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => navigate("/")}
              className="text-xs text-olive/60 hover:text-olive flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3 h-3" />
              Overview
            </button>
          </div>

          <header className="mb-10 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <span className="pill pill-tier">Week 1</span>
              <span className="pill pill-xp">Reading · 80 XP</span>
            </div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-serif text-5xl md:text-6xl text-olive leading-tight tracking-tight">Your digital footprint</h1>
                <p className="subtle-note text-lg mt-3 max-w-2xl">
                  Every time you go online, you leave a trail. Read, reflect, then make your own profile safer.
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 mt-1">
                <p className="text-[11px] tracking-[0.18em] uppercase text-olive/60">
                  Logged in as <span className="text-olive font-semibold">{week1Name}</span>
                </p>
              </div>
            </div>
          </header>

          <article className="focus-card mb-12 lg:p-10">
            <p className="text-[10px] tracking-[0.18em] uppercase text-olive/60 mb-4">The text</p>
            <p className="font-serif text-[17px] leading-relaxed text-chocolate">
              <span className="float-left font-serif text-6xl text-terracotta leading-none mr-2 mt-1">E</span>
              very time you go online you leave a trail. This is just like a real footprint. It reveals where you've been,
              how long you stayed and what you've been doing there. Every time you register for an online service, send
              an email, download a video or upload a photo, the information can be accessed and your digital footprint can
              be revealed. This shouldn't necessarily be worrying — but it is advisable to be aware of your digital footprint
              and to be cautious and sensible when you are online.
            </p>

            <h3 className="font-serif text-2xl text-olive mt-8 mb-4">Six top tips for taking care of your digital footprint</h3>
            <ol className="space-y-3">
              {TIPS.map((t, i) => (
                <li key={i} className="flex gap-4 font-sans text-[15px] text-chocolate leading-relaxed">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-terracotta/15 text-terracotta font-semibold flex items-center justify-center text-sm">{i + 1}</span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>

            <h3 className="font-serif text-2xl text-olive mt-8 mb-3">Think about the future</h3>
            <p className="font-serif text-[17px] leading-relaxed text-chocolate">
              All kinds of people are interested in your digital footprint. Colleges, universities and employers often
              check the online profiles of candidates. There are cases of people who missed jobs and college places because
              their footprint didn't impress recruiters. So: keep safe, share little, and always ask yourself —
              <em className="text-terracotta"> "Would I be happy for absolutely everyone to see this?"</em>
            </p>
          </article>

          <section className="mb-14">
            <StepHeader step={1} tier="Discover" title="Spot the vocabulary" xp={20} />
            <div className="space-y-6">
              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">1.1 · Word search</h4>
                <p className="subtle-note text-sm mb-5">Drag across letters to find the six words.</p>
                <WordSearch onProgress={setWordsFound} />
              </div>
              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">1.2 · Match images to words</h4>
                <p className="subtle-note text-sm mb-5">Tap an image, then tap its word.</p>
                <ImageMatch onProgress={setImageMatched} />
              </div>
              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">1.3 · The safe profile</h4>
                <p className="subtle-note text-sm mb-5">Build a profile that protects your identity.</p>
                <SafeProfile />
              </div>
              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">1.4 · Connect the pairs</h4>
                <p className="subtle-note text-sm mb-5">Match each word with its idea.</p>
                <PairMatch onProgress={setPairMatched} />
              </div>
            </div>
          </section>

          <section className="mb-14">
            <StepHeader step={2} tier="Recall" title="Six top tips — comprehension" xp={15} />
            <QuestionList
              questions={Q_STEP2}
              idPrefix="s2"
              stepTitle="Step 2 · Recall"
              answers={answers}
              submitted={submitted}
              onAnswerChange={handleAnswerChange}
              onSubmit={handleSubmit}
            />
          </section>

          <section className="mb-14">
            <StepHeader step={3} tier="Understand" title="The 'why' behind the text" xp={20} />
            <QuestionList
              questions={Q_STEP3}
              idPrefix="s3"
              stepTitle="Step 3 · Understand"
              answers={answers}
              submitted={submitted}
              onAnswerChange={handleAnswerChange}
              onSubmit={handleSubmit}
            />
          </section>

          <section className="mb-20">
            <StepHeader step={4} tier="Apply · Challenge" title="Analyse, strategise, debate" xp={25} />
            <QuestionList
              questions={Q_STEP4}
              idPrefix="s4"
              stepTitle="Step 4 · Apply & Challenge"
              answers={answers}
              submitted={submitted}
              onAnswerChange={handleAnswerChange}
              onSubmit={handleSubmit}
            />
          </section>

          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <button
              onClick={handleDownloadPdf}
              disabled={!hasAnyProgress}
              title={!hasAnyProgress ? "Start a task to generate a PDF" : ""}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-olive text-cream font-sans font-semibold text-sm tracking-wide shadow-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-olive/90 hover:enabled:-translate-y-0.5"
            >
              <FileDown className="w-4 h-4" />
              {hasAnyProgress ? `Generate PDF — ${week1Name}` : "Generate PDF"}
            </button>
          </div>

          <footer className="text-center pb-24">
            <p className="subtle-note">End of Week 1 · Reading. Your footprint is now a little wiser.</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Week1Reading;
