import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LernzeitSidebar } from "@/components/lernzeit/Sidebar";
import { StepHeader } from "@/components/lernzeit/StepHeader";
import { QuestionList } from "@/components/lernzeit/QuestionList";
import { useUser } from "@/context/UserContext";
import { generateProgressPdf } from "@/lib/generatePdf";
import { FileDown, User, ChevronLeft } from "lucide-react";

// ── Question arrays ────────────────────────────────────────────────────────────

const Q_STEP2_FOR: { q: string; hint?: string }[] = [
  { q: "Argument FOR 1:", hint: "e.g. Social media can be addictive for young people." },
  { q: "Argument FOR 2:", hint: "e.g. It can protect children from harmful content." },
  { q: "Argument FOR 3:", hint: "e.g. Children could spend more time on other activities." },
];

const Q_STEP2_AGAINST: { q: string; hint?: string }[] = [
  { q: "Argument AGAINST 1:", hint: "e.g. It would be unfair to ban it completely." },
  { q: "Argument AGAINST 2:", hint: "e.g. Students should learn to use it responsibly." },
  { q: "Argument AGAINST 3:", hint: "e.g. It may be difficult to control." },
];

const Q_STEP2_SENT: { q: string; hint?: string }[] = [
  { q: "Write one sentence FOR your topic:", hint: "Use: Firstly, … / One advantage is that …" },
  { q: "Write one sentence AGAINST your topic:", hint: "Use: However, … / On the other hand, …" },
];

const Q_STEP3: { q: string; hint?: string }[] = [
  {
    q: "Paragraph 1 – Introduction",
    hint: 'Complete: "Many people have different opinions about this topic. Some people are in favour of it, while others are against it. So, should ___?"',
  },
  {
    q: "Paragraph 2 – Arguments For (2–3 sentences)",
    hint: "Firstly, … / In addition, …",
  },
  {
    q: "Paragraph 3 – Arguments Against (2–3 sentences)",
    hint: "However, … / On the other hand, …",
  },
  {
    q: "Paragraph 4 – Conclusion (2–3 sentences)",
    hint: "In my opinion, … / To sum up, …",
  },
];

const Q_SIMPLE_OPINION: { q: string; hint?: string }[] = [
  { q: "My simple opinion: I think this topic is ___. I am for / against this idea.", hint: "Write a short personal sentence." },
];

// ── NameGate ──────────────────────────────────────────────────────────────────
const NameGate = ({ onEnter }: { onEnter: (name: string) => void }) => {
  const [draft, setDraft] = useState("");
  const submit = () => { if (draft.trim()) onEnter(draft.trim()); };
  return (
    <div className="min-h-screen flex items-center justify-center bg-sage">
      <div className="focus-card w-full max-w-md mx-4 text-center">
        <div className="w-14 h-14 rounded-full bg-terracotta/15 flex items-center justify-center mx-auto mb-5">
          <User className="w-7 h-7 text-terracotta" />
        </div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-olive/50 mb-1">Week 4 · Vocab &amp; Writing</p>
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
          Start writing →
        </button>
      </div>
    </div>
  );
};

// ── VocabReferenceCard ────────────────────────────────────────────────────────
const VocabReferenceCard = () => {
  const sections = [
    {
      dot: "bg-blue-500",
      border: "border-blue-400",
      bg: "bg-blue-50",
      label: "🔵 Giving an Introduction",
      pairs: [
        ["topic", "Thema"],
        ["opinion", "Meinung"],
        ["discussion", "Erörterung"],
        ['"Nowadays, …"', "Heutzutage…"],
        ['"Many people think that…"', "Viele Menschen denken…"],
        ['"The question is…"', "Die Frage ist…"],
      ],
    },
    {
      dot: "bg-green-500",
      border: "border-green-400",
      bg: "bg-green-50",
      label: "🟢 Arguments FOR",
      pairs: [
        ["advantage", "Vorteil"],
        ["useful", "nützlich"],
        ['"Firstly,…"', "Erstens…"],
        ['"Another advantage is…"', "Ein weiterer Vorteil ist…"],
        ['"In addition,…"', "Außerdem…"],
      ],
    },
    {
      dot: "bg-red-500",
      border: "border-red-400",
      bg: "bg-red-50",
      label: "🔴 Arguments AGAINST",
      pairs: [
        ["disadvantage", "Nachteil"],
        ["problem", "Problem"],
        ['"However,…"', "Allerdings…"],
        ['"On the other hand,…"', "Andererseits…"],
        ['"Another disadvantage is…"', "Ein weiterer Nachteil ist…"],
      ],
    },
    {
      dot: "bg-orange-400",
      border: "border-orange-400",
      bg: "bg-orange-50",
      label: "🟠 Your Opinion",
      pairs: [
        ['"In my opinion,…"', "Meiner Meinung nach…"],
        ['"I believe that…"', "Ich glaube, dass…"],
        ['"I think that…"', "Ich denke, dass…"],
      ],
    },
    {
      dot: "bg-gray-700",
      border: "border-gray-500",
      bg: "bg-gray-50",
      label: "⚫ Ending",
      pairs: [
        ['"To sum up,…"', "Zusammenfassend…"],
        ['"In conclusion,…"', "Abschließend…"],
        ['"All in all,…"', "Alles in allem…"],
      ],
    },
  ];

  return (
    <div className="space-y-3">
      {sections.map((sec) => (
        <div key={sec.label} className={`border-l-4 ${sec.border} ${sec.bg} rounded-r-2xl pl-4 pr-4 py-3`}>
          <p className="font-sans text-xs font-bold text-chocolate mb-2">{sec.label}</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
            {sec.pairs.map(([en, de]) => (
              <div key={en} className="contents">
                <span className="font-sans text-xs text-chocolate/80 italic">{en}</span>
                <span className="font-sans text-xs text-olive font-semibold">{de}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// ── WordMatch4 ────────────────────────────────────────────────────────────────
const WORD_MATCH_ITEMS = [
  { id: "wm1", english: "distraction", answer: "Ablenkung" },
  { id: "wm2", english: "research",    answer: "recherchieren" },
  { id: "wm3", english: "opinion",     answer: "Meinung" },
  { id: "wm4", english: "rule",        answer: "Regel" },
];
const WORD_MATCH_OPTIONS = ["—", "Ablenkung", "recherchieren", "Meinung", "Regel"];

interface WordMatch4Props {
  sel: Record<string, string>;
  onChange: (id: string, val: string) => void;
  checked: boolean;
  onCheck: () => void;
}
const WordMatch4 = ({ sel, onChange, checked, onCheck }: WordMatch4Props) => {
  const score = checked
    ? WORD_MATCH_ITEMS.filter((item) => sel[item.id] === item.answer).length
    : 0;
  const allFilled = WORD_MATCH_ITEMS.every((item) => sel[item.id] && sel[item.id] !== "—");

  return (
    <div className="space-y-4">
      <p className="subtle-note text-sm">Choose the correct German translation for each English word.</p>
      <div className="space-y-3">
        {WORD_MATCH_ITEMS.map((item) => {
          const isCorrect = checked ? sel[item.id] === item.answer : null;
          return (
            <div key={item.id} className="flex items-center gap-4 bg-cream rounded-2xl px-5 py-3">
              <span className="font-sans text-sm font-semibold text-chocolate flex-1 italic">{item.english}</span>
              <select
                value={sel[item.id] || "—"}
                onChange={(e) => onChange(item.id, e.target.value)}
                className={`border rounded-xl px-3 py-1.5 font-sans text-sm text-chocolate outline-none focus:ring-2 focus:ring-terracotta/60 transition-colors ${
                  isCorrect === true
                    ? "border-olive/60 bg-olive/10"
                    : isCorrect === false
                    ? "border-terracotta/60 bg-terracotta/10"
                    : "border-sage bg-white"
                }`}
              >
                {WORD_MATCH_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {checked && (
                isCorrect
                  ? <span className="font-sans text-xs font-semibold text-olive w-10">✓</span>
                  : <span className="font-sans text-xs text-terracotta w-24">→ {item.answer}</span>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 pt-1">
        <button
          onClick={onCheck}
          disabled={!allFilled}
          className="px-5 py-2.5 rounded-full bg-olive text-cream font-sans font-semibold text-sm tracking-wide hover:bg-olive/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Check answers
        </button>
        {checked && (
          <span className={`font-sans text-sm font-semibold animate-fade-in ${score === 4 ? "text-olive" : "text-terracotta"}`}>
            Score: {score} / 4{score === 4 ? " — Perfect!" : ""}
          </span>
        )}
      </div>
    </div>
  );
};

// ── TopicPicker ───────────────────────────────────────────────────────────────
const TOPICS = [
  "Should social media be banned for children under 15?",
  "Should students use AI tools like ChatGPT for homework?",
  "Should schools start later?",
];

interface TopicPickerProps {
  selected: number | null;
  onChange: (idx: number) => void;
}
const TopicPicker = ({ selected, onChange }: TopicPickerProps) => (
  <div className="space-y-3">
    <p className="subtle-note text-sm">Choose one topic for your discussion essay. You will use this topic throughout the worksheet.</p>
    {TOPICS.map((topic, idx) => {
      const isSelected = selected === idx;
      return (
        <label
          key={idx}
          className={`flex items-start gap-3 rounded-2xl px-5 py-4 cursor-pointer transition-colors border ${
            isSelected
              ? "bg-olive/10 border-olive/40"
              : "bg-cream border-transparent hover:bg-sage/50"
          }`}
        >
          <input
            type="radio"
            name="topic-picker"
            checked={isSelected}
            onChange={() => onChange(idx)}
            className="accent-olive mt-0.5 flex-shrink-0"
          />
          <span className="font-sans text-sm text-chocolate">{topic}</span>
          {isSelected && (
            <span className="ml-auto font-sans text-xs font-semibold text-olive flex-shrink-0">Selected ✓</span>
          )}
        </label>
      );
    })}
  </div>
);

// ── IdeaCheckboxes ─────────────────────────────────────────────────────────────
const FOR_IDEAS = [
  "It can protect children.",
  "Students can learn more easily.",
  "Teenagers get more sleep.",
  "AI can help with homework.",
];
const AGAINST_IDEAS = [
  "It is unfair.",
  "Students should decide for themselves.",
  "Some students may misuse it.",
  "It may be difficult to control.",
];

interface IdeaCheckboxesProps {
  forChecked: Record<number, boolean>;
  againstChecked: Record<number, boolean>;
  onForChange: (idx: number, val: boolean) => void;
  onAgainstChange: (idx: number, val: boolean) => void;
}
const IdeaCheckboxes = ({ forChecked, againstChecked, onForChange, onAgainstChange }: IdeaCheckboxesProps) => (
  <div className="grid md:grid-cols-2 gap-6">
    {/* FOR */}
    <div>
      <p className="font-sans text-xs font-bold text-green-700 uppercase tracking-wide mb-3">FOR</p>
      <div className="space-y-2">
        {FOR_IDEAS.map((idea, idx) => (
          <label
            key={idx}
            className={`flex items-start gap-3 rounded-xl px-4 py-2.5 cursor-pointer transition-colors border ${
              forChecked[idx]
                ? "bg-green-50 border-green-300"
                : "bg-cream border-transparent hover:bg-sage/40"
            }`}
          >
            <input
              type="checkbox"
              checked={!!forChecked[idx]}
              onChange={(e) => onForChange(idx, e.target.checked)}
              className="accent-green-600 mt-0.5 flex-shrink-0"
            />
            <span className="font-sans text-sm text-chocolate">{idea}</span>
          </label>
        ))}
      </div>
    </div>
    {/* AGAINST */}
    <div>
      <p className="font-sans text-xs font-bold text-red-700 uppercase tracking-wide mb-3">AGAINST</p>
      <div className="space-y-2">
        {AGAINST_IDEAS.map((idea, idx) => (
          <label
            key={idx}
            className={`flex items-start gap-3 rounded-xl px-4 py-2.5 cursor-pointer transition-colors border ${
              againstChecked[idx]
                ? "bg-red-50 border-red-300"
                : "bg-cream border-transparent hover:bg-sage/40"
            }`}
          >
            <input
              type="checkbox"
              checked={!!againstChecked[idx]}
              onChange={(e) => onAgainstChange(idx, e.target.checked)}
              className="accent-red-600 mt-0.5 flex-shrink-0"
            />
            <span className="font-sans text-sm text-chocolate">{idea}</span>
          </label>
        ))}
      </div>
    </div>
  </div>
);

// ── StarterMatch ───────────────────────────────────────────────────────────────
const STARTER_ITEMS = [
  { id: "sm1", starter: '"Firstly, …"',          answer: "b" },
  { id: "sm2", starter: '"However, …"',           answer: "c" },
  { id: "sm3", starter: '"On the other hand, …"', answer: "d" },
  { id: "sm4", starter: '"To sum up, …"',          answer: "a" },
];
const STARTER_FUNCTIONS: Record<string, string> = {
  a: "a) conclusion",
  b: "b) first argument",
  c: "c) opposite argument",
  d: "d) second side",
};

interface StarterMatchProps {
  sel: Record<string, string>;
  onChange: (id: string, val: string) => void;
  checked: boolean;
  onCheck: () => void;
}
const StarterMatch = ({ sel, onChange, checked, onCheck }: StarterMatchProps) => {
  const score = checked
    ? STARTER_ITEMS.filter((item) => sel[item.id] === item.answer).length
    : 0;
  const allFilled = STARTER_ITEMS.every((item) => sel[item.id] && sel[item.id] !== "—");

  return (
    <div className="space-y-4">
      <p className="subtle-note text-sm">Match each sentence starter to its function.</p>

      {/* Function legend */}
      <div className="bg-cream rounded-2xl px-5 py-3 grid grid-cols-2 gap-x-6 gap-y-1">
        {Object.entries(STARTER_FUNCTIONS).map(([k, v]) => (
          <span key={k} className="font-sans text-xs text-chocolate">{v}</span>
        ))}
      </div>

      <div className="space-y-3">
        {STARTER_ITEMS.map((item) => {
          const isCorrect = checked ? sel[item.id] === item.answer : null;
          return (
            <div key={item.id} className="flex items-center gap-4 bg-cream rounded-2xl px-5 py-3">
              <span className="font-sans text-sm text-chocolate italic flex-1">{item.starter}</span>
              <select
                value={sel[item.id] || "—"}
                onChange={(e) => onChange(item.id, e.target.value)}
                className={`border rounded-xl px-3 py-1.5 font-sans text-sm text-chocolate outline-none focus:ring-2 focus:ring-terracotta/60 transition-colors ${
                  isCorrect === true
                    ? "border-olive/60 bg-olive/10"
                    : isCorrect === false
                    ? "border-terracotta/60 bg-terracotta/10"
                    : "border-sage bg-white"
                }`}
              >
                <option value="—">—</option>
                <option value="a">a</option>
                <option value="b">b</option>
                <option value="c">c</option>
                <option value="d">d</option>
              </select>
              {checked && (
                isCorrect
                  ? <span className="font-sans text-xs font-semibold text-olive w-16">✓</span>
                  : <span className="font-sans text-xs text-terracotta w-16">→ {item.answer}</span>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 pt-1">
        <button
          onClick={onCheck}
          disabled={!allFilled}
          className="px-5 py-2.5 rounded-full bg-olive text-cream font-sans font-semibold text-sm tracking-wide hover:bg-olive/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Check answers
        </button>
        {checked && (
          <span className={`font-sans text-sm font-semibold animate-fade-in ${score === 4 ? "text-olive" : "text-terracotta"}`}>
            Score: {score} / 4{score === 4 ? " — Perfect!" : ""}
          </span>
        )}
      </div>
    </div>
  );
};

// ── EssayEditor ───────────────────────────────────────────────────────────────
interface EssayEditorProps {
  value: string;
  onChange: (val: string) => void;
}
const EssayEditor = ({ value, onChange }: EssayEditorProps) => {
  const wordCount = value.trim() === "" ? 0 : value.trim().split(/\s+/).filter(Boolean).length;

  const colorClass =
    wordCount < 80
      ? "text-red-600"
      : wordCount < 120
      ? "text-amber-600"
      : wordCount <= 150
      ? "text-olive"
      : "text-orange-600";

  const barColorClass =
    wordCount < 80
      ? "bg-red-400"
      : wordCount < 120
      ? "bg-amber-400"
      : wordCount <= 150
      ? "bg-olive"
      : "bg-orange-500";

  const message =
    wordCount < 80
      ? "Keep going…"
      : wordCount < 120
      ? "Almost there!"
      : wordCount <= 150
      ? "Target reached!"
      : "Over the limit — try to trim a little.";

  const barWidth = Math.min((wordCount / 150) * 100, 100);

  return (
    <div className="space-y-3">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={12}
        placeholder="Write your discussion here (120–150 words)…"
        className="w-full bg-sage/40 rounded-xl px-4 py-3 font-sans text-sm text-chocolate placeholder:text-olive/40 outline-none focus:ring-2 focus:ring-terracotta/60 resize-none"
      />
      {/* Word count display */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className={`font-sans text-sm font-semibold ${colorClass}`}>{wordCount} words</span>
          <span className={`font-sans text-xs ${colorClass}`}>{message}</span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-2 bg-sage rounded-full overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${barColorClass}`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
        <p className="font-sans text-[11px] text-olive/50">Target: 120–150 words (bar shows progress to 150)</p>
      </div>
    </div>
  );
};

// ── SelfCheckList ─────────────────────────────────────────────────────────────
const SELF_CHECK_ITEMS = [
  "I wrote 4 paragraphs.",
  "I gave arguments for and against.",
  "I used linking words.",
  "I wrote my opinion.",
  "I checked spelling.",
  "My text has about 120–150 words.",
];

const SelfCheckList = () => {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const total = Object.values(checked).filter(Boolean).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <p className="subtle-note text-sm">Tick each item once you have completed it.</p>
        <span className={`font-sans text-sm font-semibold ${total === 6 ? "text-olive" : "text-terracotta"}`}>
          {total} / 6 checked
        </span>
      </div>
      {SELF_CHECK_ITEMS.map((item, idx) => (
        <label
          key={idx}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-colors border ${
            checked[idx]
              ? "bg-olive/10 border-olive/40"
              : "bg-cream border-transparent hover:bg-sage/40"
          }`}
        >
          <input
            type="checkbox"
            checked={!!checked[idx]}
            onChange={(e) => setChecked((prev) => ({ ...prev, [idx]: e.target.checked }))}
            className="accent-olive flex-shrink-0"
          />
          <span className={`font-sans text-sm transition-colors ${checked[idx] ? "text-olive font-semibold" : "text-chocolate"}`}>
            {item}
          </span>
          {checked[idx] && <span className="ml-auto font-sans text-xs font-semibold text-olive">✓</span>}
        </label>
      ))}
      {total === 6 && (
        <div className="bg-olive/10 border border-olive/20 rounded-xl px-4 py-3 mt-2 animate-fade-in">
          <p className="font-sans text-sm font-semibold text-olive">All items checked — great work!</p>
        </div>
      )}
    </div>
  );
};

// ── UsefulPhrasesCard (Step 4 reference) ──────────────────────────────────────
const UsefulPhrasesCard = () => (
  <div className="bg-cream rounded-2xl p-5">
    <p className="font-sans text-xs font-semibold text-olive/70 uppercase tracking-wide mb-3">Useful Phrases Reference</p>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <p className="font-sans text-[11px] font-bold text-blue-600 uppercase tracking-wide mb-1.5">Introduction</p>
        <ul className="space-y-0.5">
          {["Nowadays, …", "Many people think that…", "The question is…"].map((p) => (
            <li key={p} className="font-sans text-xs text-chocolate italic">{p}</li>
          ))}
        </ul>
      </div>
      <div>
        <p className="font-sans text-[11px] font-bold text-green-700 uppercase tracking-wide mb-1.5">Arguments For</p>
        <ul className="space-y-0.5">
          {["Firstly, …", "Another advantage is…", "In addition, …"].map((p) => (
            <li key={p} className="font-sans text-xs text-chocolate italic">{p}</li>
          ))}
        </ul>
        <p className="font-sans text-[11px] font-bold text-red-700 uppercase tracking-wide mb-1.5 mt-3">Arguments Against</p>
        <ul className="space-y-0.5">
          {["However, …", "On the other hand, …", "Another disadvantage is…"].map((p) => (
            <li key={p} className="font-sans text-xs text-chocolate italic">{p}</li>
          ))}
        </ul>
      </div>
      <div>
        <p className="font-sans text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1.5">Conclusion</p>
        <ul className="space-y-0.5">
          {["In my opinion, …", "To sum up, …", "All in all, …"].map((p) => (
            <li key={p} className="font-sans text-xs text-chocolate italic">{p}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

// ── Main page ─────────────────────────────────────────────────────────────────
const Week4Writing = () => {
  const { week4Name, setWeek4Name } = useUser();
  const navigate = useNavigate();

  // ── Step 1 state ──────────────────────────────────────────────────────────
  const [wordSel, setWordSel] = useState<Record<string, string>>({});
  const [wordChecked, setWordChecked] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [forChecked, setForChecked] = useState<Record<number, boolean>>({});
  const [againstChecked, setAgainstChecked] = useState<Record<number, boolean>>({});

  // ── Step 2 state ──────────────────────────────────────────────────────────
  const [starterSel, setStarterSel] = useState<Record<string, string>>({});
  const [starterChecked, setStarterChecked] = useState(false);

  // ── Essay state ───────────────────────────────────────────────────────────
  const [essay, setEssay] = useState("");

  // ── Shared QuestionList state (steps 1 opinion + 2 + 3) ──────────────────
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const handleAnswerChange = (id: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));
  const handleSubmit = (id: string) =>
    setSubmitted((prev) => ({ ...prev, [id]: !!answers[id]?.trim() }));

  // ── WordMatch onChange (resets checked) ───────────────────────────────────
  const handleWordSelChange = (id: string, val: string) => {
    setWordSel((prev) => ({ ...prev, [id]: val }));
    setWordChecked(false);
  };

  // ── StarterMatch onChange (resets checked) ────────────────────────────────
  const handleStarterSelChange = (id: string, val: string) => {
    setStarterSel((prev) => ({ ...prev, [id]: val }));
    setStarterChecked(false);
  };

  // ── Progress detection ────────────────────────────────────────────────────
  const hasAnyProgress =
    Object.keys(wordSel).length > 0 ||
    selectedTopic !== null ||
    Object.values(forChecked).some(Boolean) ||
    Object.values(againstChecked).some(Boolean) ||
    Object.keys(starterSel).length > 0 ||
    Object.values(answers).some((v) => v?.trim()) ||
    essay.trim().length > 0;

  // ── PDF word count helper ─────────────────────────────────────────────────
  const essayWordCount = essay.trim() === "" ? 0 : essay.trim().split(/\s+/).filter(Boolean).length;

  // ── PDF download ──────────────────────────────────────────────────────────
  const handleDownloadPdf = () => {
    generateProgressPdf(
      week4Name,
      [
        { stepTitle: "Step 1 · Simple Opinion",      questions: Q_SIMPLE_OPINION, answers, submitted, idPrefix: "s1op" },
        { stepTitle: "Step 2 · Arguments FOR",        questions: Q_STEP2_FOR,      answers, submitted, idPrefix: "s2for" },
        { stepTitle: "Step 2 · Arguments AGAINST",    questions: Q_STEP2_AGAINST,  answers, submitted, idPrefix: "s2ag" },
        { stepTitle: "Step 2 · Sentences",            questions: Q_STEP2_SENT,     answers, submitted, idPrefix: "s2sent" },
        { stepTitle: "Step 3 · Paragraphs",           questions: Q_STEP3,          answers, submitted, idPrefix: "s3" },
      ],
      {
        weekLabel:         "WEEK 4 VOCAB & WRITING",
        pageTitle:         "Vocabulary & Writing",
        step1SectionTitle: "Step 1 · Spark — Interactive Activities",
        answersTitle:      "Steps 2–3 · Written Answers",
        filenameWeek:      "Week4",
        activities: [
          {
            badge: "Task 1 · Word Match",
            lines: [
              `Matched: ${Object.keys(wordSel).length} / 4${wordChecked ? " · Checked" : ""}`,
            ],
          },
          {
            badge: "Task 2 · Topic Choice",
            lines: [
              selectedTopic !== null
                ? `Topic ${selectedTopic + 1}: ${TOPICS[selectedTopic].slice(0, 55)}…`
                : "No topic selected yet.",
            ],
          },
          {
            badge: "Task 3 · Ideas",
            lines: [
              `FOR: ${Object.values(forChecked).filter(Boolean).length} / 4 ticked  ·  AGAINST: ${Object.values(againstChecked).filter(Boolean).length} / 4 ticked`,
            ],
          },
          {
            badge: "Step 2 · Starter Match",
            lines: [
              `Matched: ${Object.keys(starterSel).length} / 4${starterChecked ? " · Checked" : ""}`,
            ],
          },
          {
            badge: "Step 4 · Essay",
            lines: [
              `Word count: ${essayWordCount} / 150 target`,
              essay.trim()
                ? essay.trim().slice(0, 80) + (essay.trim().length > 80 ? "…" : "")
                : "No essay written yet.",
            ],
          },
        ],
      }
    );
  };

  if (!week4Name) return <NameGate onEnter={setWeek4Name} />;

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
              <span className="pill pill-tier">Week 4</span>
              <span className="pill pill-xp">Vocab &amp; Writing · 80 XP</span>
            </div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-serif text-5xl md:text-6xl text-olive leading-tight tracking-tight">
                  Vocabulary &amp; Writing
                </h1>
                <p className="subtle-note text-lg mt-3 max-w-2xl">
                  Build your discussion vocabulary, plan your arguments, and write a structured essay in German and English.
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 mt-1">
                <p className="text-[11px] tracking-[0.18em] uppercase text-olive/60">
                  Logged in as <span className="text-olive font-semibold">{week4Name}</span>
                </p>
              </div>
            </div>
          </header>

          {/* ══ STEP 1 · SPARK ══════════════════════════════════════════════════ */}
          <section className="mb-14">
            <StepHeader step={1} tier="Spark" title="Understand the Topic (Inclusive Level)" xp={20} />
            <div className="space-y-6">

              {/* Vocab Reference Card */}
              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">Vocabulary Reference Card</h4>
                <p className="subtle-note text-sm mb-5">
                  Use this bilingual card throughout the worksheet. It contains all the key words and sentence starters you need.
                </p>
                <VocabReferenceCard />
              </div>

              {/* Task 1 · Word Match */}
              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">Task 1 · Match the Words</h4>
                <p className="subtle-note text-sm mb-5">Match each English word to its German translation.</p>
                <WordMatch4
                  sel={wordSel}
                  onChange={handleWordSelChange}
                  checked={wordChecked}
                  onCheck={() => setWordChecked(true)}
                />
              </div>

              {/* Task 2 · Choose Topic */}
              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">Task 2 · Choose Your Topic</h4>
                <TopicPicker selected={selectedTopic} onChange={setSelectedTopic} />
              </div>

              {/* Task 3 · Collect Simple Ideas */}
              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">Task 3 · Collect Simple Ideas</h4>
                <p className="subtle-note text-sm mb-5">
                  Tick the ideas you want to use. Then write your own simple opinion below.
                </p>
                <IdeaCheckboxes
                  forChecked={forChecked}
                  againstChecked={againstChecked}
                  onForChange={(idx, val) => setForChecked((prev) => ({ ...prev, [idx]: val }))}
                  onAgainstChange={(idx, val) => setAgainstChecked((prev) => ({ ...prev, [idx]: val }))}
                />
                <div className="mt-6">
                  <QuestionList
                    questions={Q_SIMPLE_OPINION}
                    idPrefix="s1op"
                    stepTitle="Step 1 · Simple Opinion"
                    answers={answers}
                    submitted={submitted}
                    onAnswerChange={handleAnswerChange}
                    onSubmit={handleSubmit}
                  />
                </div>
              </div>

            </div>
          </section>

          {/* ══ STEP 2 · BUILD ══════════════════════════════════════════════════ */}
          <section className="mb-14">
            <StepHeader step={2} tier="Build" title="Plan Your Arguments" xp={20} />
            <div className="space-y-6">

              {/* Task 1 · Arguments Table */}
              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">Task 1 · Complete the Arguments Table</h4>
                <p className="subtle-note text-sm mb-5">
                  Write three arguments FOR and three arguments AGAINST your chosen topic.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="font-sans text-xs font-bold text-green-700 uppercase tracking-wide mb-3">Arguments FOR</p>
                    <QuestionList
                      questions={Q_STEP2_FOR}
                      idPrefix="s2for"
                      stepTitle="Step 2 · Arguments FOR"
                      answers={answers}
                      submitted={submitted}
                      onAnswerChange={handleAnswerChange}
                      onSubmit={handleSubmit}
                    />
                  </div>
                  <div>
                    <p className="font-sans text-xs font-bold text-red-700 uppercase tracking-wide mb-3">Arguments AGAINST</p>
                    <QuestionList
                      questions={Q_STEP2_AGAINST}
                      idPrefix="s2ag"
                      stepTitle="Step 2 · Arguments AGAINST"
                      answers={answers}
                      submitted={submitted}
                      onAnswerChange={handleAnswerChange}
                      onSubmit={handleSubmit}
                    />
                  </div>
                </div>
              </div>

              {/* Task 2 · Sentence Starters Match */}
              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">Task 2 · Match Sentence Starters</h4>
                <StarterMatch
                  sel={starterSel}
                  onChange={handleStarterSelChange}
                  checked={starterChecked}
                  onCheck={() => setStarterChecked(true)}
                />
              </div>

              {/* Task 3 · One Sentence Each Side */}
              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">Task 3 · Write One Sentence for Each Side</h4>
                <p className="subtle-note text-sm mb-5">Use the sentence starters from Task 2.</p>
                <QuestionList
                  questions={Q_STEP2_SENT}
                  idPrefix="s2sent"
                  stepTitle="Step 2 · Sentences"
                  answers={answers}
                  submitted={submitted}
                  onAnswerChange={handleAnswerChange}
                  onSubmit={handleSubmit}
                />
              </div>

            </div>
          </section>

          {/* ══ STEP 3 · STRETCH ════════════════════════════════════════════════ */}
          <section className="mb-14">
            <StepHeader step={3} tier="Stretch" title="Build Your Paragraphs" xp={20} />
            <div className="space-y-6">

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">Write Your Four Paragraphs</h4>
                <p className="subtle-note text-sm mb-5">
                  Use the hints below each question to structure your paragraphs. Save each one as you go.
                </p>
                <QuestionList
                  questions={Q_STEP3}
                  idPrefix="s3"
                  stepTitle="Step 3 · Paragraphs"
                  answers={answers}
                  submitted={submitted}
                  onAnswerChange={handleAnswerChange}
                  onSubmit={handleSubmit}
                />
              </div>

            </div>
          </section>

          {/* ══ STEP 4 · REMIX ══════════════════════════════════════════════════ */}
          <section className="mb-20">
            <StepHeader step={4} tier="Remix" title="Creative Writing Challenge" xp={20} />
            <div className="space-y-6">

              {/* Useful Phrases Reference */}
              <UsefulPhrasesCard />

              {/* Essay Editor */}
              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">Write Your Discussion Essay</h4>
                <p className="subtle-note text-sm mb-5">
                  Write a complete discussion essay of 120–150 words. Use your paragraph notes from Step 3 as a guide.
                  The word counter below tracks your progress in real time.
                </p>
                <EssayEditor value={essay} onChange={setEssay} />
              </div>

              {/* Self-Check */}
              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">Self-Check</h4>
                <p className="subtle-note text-sm mb-5">
                  Review your essay using this checklist before you submit.
                </p>
                <SelfCheckList />
              </div>

            </div>
          </section>

          {/* Sticky PDF download bar */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <button
              onClick={handleDownloadPdf}
              disabled={!hasAnyProgress}
              title={!hasAnyProgress ? "Start any task to generate a PDF" : ""}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-olive text-cream font-sans font-semibold text-sm tracking-wide shadow-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-olive/90 hover:enabled:-translate-y-0.5"
            >
              <FileDown className="w-4 h-4" />
              {hasAnyProgress ? `Generate PDF — ${week4Name}` : "Generate PDF"}
            </button>
          </div>

          <footer className="text-center pb-24">
            <p className="subtle-note">End of Week 4 · Vocab &amp; Writing. Every word you write builds your confidence.</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Week4Writing;
