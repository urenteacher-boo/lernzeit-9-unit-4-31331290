import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LernzeitSidebar } from "@/components/lernzeit/Sidebar";
import { StepHeader } from "@/components/lernzeit/StepHeader";
import { QuestionList } from "@/components/lernzeit/QuestionList";
import { useUser } from "@/context/UserContext";
import { generateProgressPdf } from "@/lib/generatePdf";
import { FileDown, User, ChevronLeft } from "lucide-react";

// ── Open-ended challenge questions (Exercise 6) ───────────────────────────────
const Q_CHALLENGE = [
  { q: "Write your own Type 3 conditional sentence.", hint: "Use: If + had + 3rd form … would have + 3rd form" },
  { q: "Write a second Type 3 conditional sentence.", hint: "Think of a past regret or a different outcome." },
  { q: "Write a third Type 3 conditional sentence.", hint: "Try starting the sentence with the main clause first." },
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
        <p className="text-[10px] tracking-[0.2em] uppercase text-olive/50 mb-1">Week 3 · Grammar</p>
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
          Start grammar →
        </button>
      </div>
    </div>
  );
};

// ── Exercise 1: Sort sentences into Type 1/2/3 ────────────────────────────────
const EX1_SENTENCES = [
  { id: "A", text: "If I study tonight, I will do well in the test tomorrow." },
  { id: "B", text: "If I had more free time, I would play football every day." },
  { id: "C", text: "If we had left home earlier, we would have caught the train." },
  { id: "D", text: "If it rains this afternoon, we will stay inside." },
  { id: "E", text: "If I were taller, I would play basketball better." },
  { id: "F", text: "If Sara had charged her phone, it would not have died." },
];
const EX1_ANSWERS: Record<string, string> = { A: "1", B: "2", C: "3", D: "1", E: "2", F: "3" };

interface Ex1Props {
  selections: Record<string, string>;
  onChange: (id: string, val: string) => void;
  checked: boolean;
  onCheck: () => void;
}
const Exercise1 = ({ selections, onChange, checked, onCheck }: Ex1Props) => {
  const score = checked
    ? EX1_SENTENCES.filter((s) => selections[s.id] === EX1_ANSWERS[s.id]).length
    : 0;

  return (
    <div className="space-y-4">
      <p className="subtle-note text-sm">Read sentences A–F and sort each one into Type 1, 2, or 3 using the dropdown.</p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-sage">
              <th className="text-left font-sans text-xs font-semibold text-olive/60 uppercase tracking-wide pb-2 pr-4 w-8">No.</th>
              <th className="text-left font-sans text-xs font-semibold text-olive/60 uppercase tracking-wide pb-2 pr-4">Sentence</th>
              <th className="text-left font-sans text-xs font-semibold text-olive/60 uppercase tracking-wide pb-2 w-28">Type</th>
              {checked && <th className="text-left font-sans text-xs font-semibold text-olive/60 uppercase tracking-wide pb-2 w-12"></th>}
            </tr>
          </thead>
          <tbody>
            {EX1_SENTENCES.map((s) => {
              const isCorrect = checked ? selections[s.id] === EX1_ANSWERS[s.id] : null;
              return (
                <tr key={s.id} className="border-b border-sage/40">
                  <td className="py-3 pr-4">
                    <span className="font-sans text-sm font-semibold text-terracotta">{s.id}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="font-sans text-sm text-chocolate italic">"{s.text}"</span>
                  </td>
                  <td className="py-3">
                    <select
                      value={selections[s.id] || ""}
                      onChange={(e) => onChange(s.id, e.target.value)}
                      className={`bg-cream border rounded-xl px-3 py-1.5 font-sans text-sm text-chocolate outline-none focus:ring-2 focus:ring-terracotta/60 transition-colors ${
                        isCorrect === true
                          ? "border-olive/60 bg-olive/10"
                          : isCorrect === false
                          ? "border-terracotta/60 bg-terracotta/10"
                          : "border-sage"
                      }`}
                    >
                      <option value="">—</option>
                      <option value="1">Type 1</option>
                      <option value="2">Type 2</option>
                      <option value="3">Type 3</option>
                    </select>
                  </td>
                  {checked && (
                    <td className="py-3 pl-2">
                      {isCorrect ? (
                        <span className="font-sans text-xs font-semibold text-olive">✓</span>
                      ) : (
                        <span className="font-sans text-xs text-terracotta">→ {EX1_ANSWERS[s.id]}</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-4 pt-1">
        <button
          onClick={onCheck}
          disabled={Object.keys(selections).length < EX1_SENTENCES.length || Object.values(selections).some((v) => !v)}
          className="px-5 py-2.5 rounded-full bg-olive text-cream font-sans font-semibold text-sm tracking-wide hover:bg-olive/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Check answers
        </button>
        {checked && (
          <span className={`font-sans text-sm font-semibold animate-fade-in ${score === 6 ? "text-olive" : "text-terracotta"}`}>
            Score: {score} / 6{score === 6 ? " — Perfect!" : ""}
          </span>
        )}
      </div>
    </div>
  );
};

// ── Exercise 2A: Match meaning to type ───────────────────────────────────────
const EX2A_ITEMS = [
  { id: "m1", meaning: "A real possibility", answer: "1" },
  { id: "m2", meaning: "An imaginary situation now", answer: "2" },
  { id: "m3", meaning: "A regret about the past", answer: "3" },
];

interface Ex2AProps {
  selections: Record<string, string>;
  onChange: (id: string, val: string) => void;
  checked: boolean;
  onCheck: () => void;
}
const Exercise2A = ({ selections, onChange, checked, onCheck }: Ex2AProps) => {
  const score = checked
    ? EX2A_ITEMS.filter((item) => selections[item.id] === item.answer).length
    : 0;

  return (
    <div className="space-y-4">
      <p className="subtle-note text-sm">Match each meaning to the correct type using the dropdown.</p>
      <div className="space-y-3">
        {EX2A_ITEMS.map((item) => {
          const isCorrect = checked ? selections[item.id] === item.answer : null;
          return (
            <div key={item.id} className="flex items-center gap-4 bg-cream rounded-2xl px-5 py-3">
              <span className="font-sans text-sm text-chocolate flex-1">"{item.meaning}"</span>
              <select
                value={selections[item.id] || ""}
                onChange={(e) => onChange(item.id, e.target.value)}
                className={`bg-white border rounded-xl px-3 py-1.5 font-sans text-sm text-chocolate outline-none focus:ring-2 focus:ring-terracotta/60 transition-colors ${
                  isCorrect === true
                    ? "border-olive/60 bg-olive/10"
                    : isCorrect === false
                    ? "border-terracotta/60 bg-terracotta/10"
                    : "border-sage"
                }`}
              >
                <option value="">—</option>
                <option value="1">Type 1</option>
                <option value="2">Type 2</option>
                <option value="3">Type 3</option>
              </select>
              {checked && (
                isCorrect
                  ? <span className="font-sans text-xs font-semibold text-olive w-12">✓</span>
                  : <span className="font-sans text-xs text-terracotta w-12">→ {item.answer}</span>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 pt-1">
        <button
          onClick={onCheck}
          disabled={EX2A_ITEMS.some((item) => !selections[item.id])}
          className="px-5 py-2.5 rounded-full bg-olive text-cream font-sans font-semibold text-sm tracking-wide hover:bg-olive/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Check answers
        </button>
        {checked && (
          <span className={`font-sans text-sm font-semibold animate-fade-in ${score === 3 ? "text-olive" : "text-terracotta"}`}>
            Score: {score} / 3{score === 3 ? " — Perfect!" : ""}
          </span>
        )}
      </div>
    </div>
  );
};

// ── Exercise 2B: Multiple choice ─────────────────────────────────────────────
const EX2B_QUESTIONS = [
  {
    id: "q1",
    question: "Which sentence talks about a real possibility?",
    options: [
      { id: "a", text: "If I study, I will pass." },
      { id: "b", text: "If I lived near school, I would walk there every day." },
      { id: "c", text: "If she had called me, I would have helped her." },
    ],
    answer: "a",
  },
  {
    id: "q2",
    question: "Which sentence talks about an imaginary situation?",
    options: [
      { id: "a", text: "If I study, I will pass." },
      { id: "b", text: "If I lived near school, I would walk there every day." },
      { id: "c", text: "If she had called me, I would have helped her." },
    ],
    answer: "b",
  },
  {
    id: "q3",
    question: "Which sentence talks about a past regret?",
    options: [
      { id: "a", text: "If I study, I will pass." },
      { id: "b", text: "If I lived near school, I would walk there every day." },
      { id: "c", text: "If she had called me, I would have helped her." },
    ],
    answer: "c",
  },
];

interface Ex2BProps {
  selections: Record<string, string>;
  onChange: (id: string, val: string) => void;
  checked: boolean;
  onCheck: () => void;
}
const Exercise2B = ({ selections, onChange, checked, onCheck }: Ex2BProps) => {
  const score = checked
    ? EX2B_QUESTIONS.filter((q) => selections[q.id] === q.answer).length
    : 0;

  return (
    <div className="space-y-5">
      <p className="subtle-note text-sm">Choose the correct sentence for each question.</p>
      {EX2B_QUESTIONS.map((q) => {
        const isCorrect = checked ? selections[q.id] === q.answer : null;
        return (
          <div key={q.id} className={`bg-cream rounded-2xl p-5 border transition-colors ${isCorrect === true ? "border-olive/40" : isCorrect === false ? "border-terracotta/40" : "border-transparent"}`}>
            <p className="font-sans text-sm font-semibold text-chocolate mb-3">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt) => {
                const selected = selections[q.id] === opt.id;
                const isThisCorrect = checked && opt.id === q.answer;
                const isThisWrong = checked && selected && opt.id !== q.answer;
                return (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 rounded-xl px-4 py-2.5 cursor-pointer transition-colors ${
                      isThisCorrect
                        ? "bg-olive/15 border border-olive/40"
                        : isThisWrong
                        ? "bg-terracotta/10 border border-terracotta/40"
                        : selected
                        ? "bg-sage border border-olive/30"
                        : "bg-white border border-sage hover:bg-sage/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={opt.id}
                      checked={selected}
                      onChange={() => onChange(q.id, opt.id)}
                      className="accent-olive"
                    />
                    <span className="font-sans text-sm text-chocolate">{opt.text}</span>
                    {isThisCorrect && <span className="ml-auto font-sans text-xs font-semibold text-olive">✓ Correct</span>}
                    {isThisWrong && <span className="ml-auto font-sans text-xs text-terracotta">✗</span>}
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
      <div className="flex items-center gap-4 pt-1">
        <button
          onClick={onCheck}
          disabled={EX2B_QUESTIONS.some((q) => !selections[q.id])}
          className="px-5 py-2.5 rounded-full bg-olive text-cream font-sans font-semibold text-sm tracking-wide hover:bg-olive/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Check answers
        </button>
        {checked && (
          <span className={`font-sans text-sm font-semibold animate-fade-in ${score === 3 ? "text-olive" : "text-terracotta"}`}>
            Score: {score} / 3{score === 3 ? " — Perfect!" : ""}
          </span>
        )}
      </div>
    </div>
  );
};

// ── Exercise 2C: Spot the mistake ─────────────────────────────────────────────
const EX2C_PAIRS = [
  {
    id: "p1",
    options: [
      { id: "a", text: "If I would see him, I would tell him." },
      { id: "b", text: "If I saw him, I would tell him." },
    ],
    answer: "b",
    explanation: "Never use 'would' inside the 'if' clause.",
  },
  {
    id: "p2",
    options: [
      { id: "a", text: "If I had studied, I would have passed." },
      { id: "b", text: "If I would have studied, I would have passed." },
    ],
    answer: "a",
    explanation: "Use 'had + past participle' in the 'if' clause for Type 3.",
  },
];

interface Ex2CProps {
  selections: Record<string, string>;
  onChange: (id: string, val: string) => void;
  checked: boolean;
  onCheck: () => void;
}
const Exercise2C = ({ selections, onChange, checked, onCheck }: Ex2CProps) => {
  const score = checked
    ? EX2C_PAIRS.filter((p) => selections[p.id] === p.answer).length
    : 0;

  return (
    <div className="space-y-5">
      <p className="subtle-note text-sm">One sentence in each pair has a mistake. Pick the correct one.</p>
      {EX2C_PAIRS.map((pair, idx) => {
        const isCorrect = checked ? selections[pair.id] === pair.answer : null;
        return (
          <div key={pair.id} className={`bg-cream rounded-2xl p-5 border transition-colors ${isCorrect === true ? "border-olive/40" : isCorrect === false ? "border-terracotta/40" : "border-transparent"}`}>
            <p className="font-sans text-xs font-semibold text-olive/60 uppercase tracking-wide mb-3">Pair {idx + 1}</p>
            <div className="space-y-2">
              {pair.options.map((opt) => {
                const selected = selections[pair.id] === opt.id;
                const isThisAnswer = opt.id === pair.answer;
                const isThisCorrect = checked && isThisAnswer;
                const isThisWrong = checked && selected && !isThisAnswer;
                return (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-3 rounded-xl px-4 py-2.5 cursor-pointer transition-colors ${
                      isThisCorrect
                        ? "bg-olive/15 border border-olive/40"
                        : isThisWrong
                        ? "bg-terracotta/10 border border-terracotta/40"
                        : selected
                        ? "bg-sage border border-olive/30"
                        : "bg-white border border-sage hover:bg-sage/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={pair.id}
                      value={opt.id}
                      checked={selected}
                      onChange={() => onChange(pair.id, opt.id)}
                      className="accent-olive mt-0.5"
                    />
                    <span className="font-sans text-sm text-chocolate">{opt.text}</span>
                    {isThisCorrect && <span className="ml-auto font-sans text-xs font-semibold text-olive whitespace-nowrap">✓ Correct</span>}
                    {isThisWrong && <span className="ml-auto font-sans text-xs text-terracotta whitespace-nowrap">✗ Mistake here</span>}
                  </label>
                );
              })}
            </div>
            {checked && (
              <p className="font-sans text-xs text-olive/70 mt-3 italic animate-fade-in">{pair.explanation}</p>
            )}
          </div>
        );
      })}
      <div className="flex items-center gap-4 pt-1">
        <button
          onClick={onCheck}
          disabled={EX2C_PAIRS.some((p) => !selections[p.id])}
          className="px-5 py-2.5 rounded-full bg-olive text-cream font-sans font-semibold text-sm tracking-wide hover:bg-olive/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Check answers
        </button>
        {checked && (
          <span className={`font-sans text-sm font-semibold animate-fade-in ${score === 2 ? "text-olive" : "text-terracotta"}`}>
            Score: {score} / 2{score === 2 ? " — Perfect!" : ""}
          </span>
        )}
      </div>
    </div>
  );
};

// ── Exercise 2D: Complete the rule ───────────────────────────────────────────
interface Ex2DProps {
  val1: string;
  val2: string;
  onVal1: (v: string) => void;
  onVal2: (v: string) => void;
  checked: boolean;
  onCheck: () => void;
}
const Exercise2D = ({ val1, val2, onVal1, onVal2, checked, onCheck }: Ex2DProps) => {
  const ans1 = "past perfect";
  const ans2 = "past participle";
  const ok1 = val1.trim().toLowerCase() === ans1;
  const ok2 = val2.trim().toLowerCase() === ans2;
  const score = checked ? (ok1 ? 1 : 0) + (ok2 ? 1 : 0) : 0;

  const inputClass = (ok: boolean) =>
    `inline-block bg-cream border rounded-xl px-3 py-1 font-sans text-sm text-chocolate outline-none focus:ring-2 focus:ring-terracotta/60 w-36 text-center transition-colors ${
      checked ? (ok ? "border-olive/60 bg-olive/10" : "border-terracotta/60 bg-terracotta/10") : "border-sage"
    }`;

  return (
    <div className="space-y-4">
      <p className="subtle-note text-sm">Complete the rule by typing in the missing grammar terms.</p>
      <div className="bg-cream rounded-2xl p-6">
        <p className="font-sans text-sm text-chocolate leading-loose">
          Type 3: <span className="font-semibold text-olive">if</span> + [
          <input
            value={val1}
            onChange={(e) => onVal1(e.target.value)}
            placeholder="???"
            className={inputClass(ok1)}
          />
          ] → <span className="font-semibold text-olive">would have</span> + [
          <input
            value={val2}
            onChange={(e) => onVal2(e.target.value)}
            placeholder="???"
            className={inputClass(ok2)}
          />
          ]
        </p>
        {checked && (
          <div className="mt-3 animate-fade-in">
            {!ok1 && <p className="font-sans text-xs text-terracotta">First blank: <span className="font-semibold">{ans1}</span></p>}
            {!ok2 && <p className="font-sans text-xs text-terracotta">Second blank: <span className="font-semibold">{ans2}</span></p>}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onCheck}
          disabled={!val1.trim() || !val2.trim()}
          className="px-5 py-2.5 rounded-full bg-olive text-cream font-sans font-semibold text-sm tracking-wide hover:bg-olive/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Check answers
        </button>
        {checked && (
          <span className={`font-sans text-sm font-semibold animate-fade-in ${score === 2 ? "text-olive" : "text-terracotta"}`}>
            Score: {score} / 2{score === 2 ? " — Perfect!" : ""}
          </span>
        )}
      </div>
    </div>
  );
};

// ── Exercise 3A: Classify 5 sentences ────────────────────────────────────────
const EX3A_SENTENCES = [
  { id: "s1", text: "If I had more free time, I would go to the gym more often.", answer: "T2" },
  { id: "s2", text: "If Tom studies this weekend, he will do well in the test.", answer: "T1" },
  { id: "s3", text: "If they had left earlier, they would have caught the train.", answer: "T3" },
  { id: "s4", text: "If it rains, we will stay inside.", answer: "T1" },
  { id: "s5", text: "If I were you, I would apologise.", answer: "T2" },
];

interface Ex3AProps {
  selections: Record<string, string>;
  onChange: (id: string, val: string) => void;
  checked: boolean;
  onCheck: () => void;
}
const Exercise3A = ({ selections, onChange, checked, onCheck }: Ex3AProps) => {
  const score = checked
    ? EX3A_SENTENCES.filter((s) => selections[s.id] === s.answer).length
    : 0;

  return (
    <div className="space-y-4">
      <p className="subtle-note text-sm">Classify each sentence as T1, T2, or T3.</p>
      <div className="space-y-3">
        {EX3A_SENTENCES.map((s, idx) => {
          const isCorrect = checked ? selections[s.id] === s.answer : null;
          return (
            <div key={s.id} className="flex items-center gap-4 bg-cream rounded-2xl px-5 py-3">
              <span className="font-sans text-xs font-semibold text-terracotta w-5 flex-shrink-0">{idx + 1}</span>
              <span className="font-sans text-sm text-chocolate flex-1 italic">"{s.text}"</span>
              <select
                value={selections[s.id] || ""}
                onChange={(e) => onChange(s.id, e.target.value)}
                className={`bg-white border rounded-xl px-3 py-1.5 font-sans text-sm text-chocolate outline-none focus:ring-2 focus:ring-terracotta/60 transition-colors flex-shrink-0 ${
                  isCorrect === true
                    ? "border-olive/60 bg-olive/10"
                    : isCorrect === false
                    ? "border-terracotta/60 bg-terracotta/10"
                    : "border-sage"
                }`}
              >
                <option value="">—</option>
                <option value="T1">T1</option>
                <option value="T2">T2</option>
                <option value="T3">T3</option>
              </select>
              {checked && (
                isCorrect
                  ? <span className="font-sans text-xs font-semibold text-olive w-10 flex-shrink-0">✓</span>
                  : <span className="font-sans text-xs text-terracotta w-10 flex-shrink-0">→ {s.answer}</span>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 pt-1">
        <button
          onClick={onCheck}
          disabled={EX3A_SENTENCES.some((s) => !selections[s.id])}
          className="px-5 py-2.5 rounded-full bg-olive text-cream font-sans font-semibold text-sm tracking-wide hover:bg-olive/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Check answers
        </button>
        {checked && (
          <span className={`font-sans text-sm font-semibold animate-fade-in ${score === 5 ? "text-olive" : "text-terracotta"}`}>
            Score: {score} / 5{score === 5 ? " — Perfect!" : ""}
          </span>
        )}
      </div>
    </div>
  );
};

// ── Exercise 3B: Complete sentences ──────────────────────────────────────────
const EX3B_ITEMS = [
  {
    id: "b1",
    before: "If Amy had cleaned her room, her mother",
    after: "(be) happy.",
    hint: "would have been",
    answer: "would have been",
  },
  {
    id: "b2",
    before: "I will get some advice if I",
    after: "(write) a letter to an agony aunt.",
    hint: "write",
    answer: "write",
  },
  {
    id: "b3",
    before: "If you",
    after: "(read) books all night long, you would not be able to get up early.",
    hint: "read",
    answer: "read",
  },
  {
    id: "b4",
    before: "If you throw a party while your parents are gone, you",
    after: "(be) in big trouble.",
    hint: "will be",
    answer: "will be",
  },
];

interface Ex3BProps {
  values: Record<string, string>;
  onChange: (id: string, val: string) => void;
  checked: boolean;
  onCheck: () => void;
}
const Exercise3B = ({ values, onChange, checked, onCheck }: Ex3BProps) => {
  const score = checked
    ? EX3B_ITEMS.filter((item) => values[item.id]?.trim().toLowerCase() === item.answer.toLowerCase()).length
    : 0;

  return (
    <div className="space-y-4">
      <p className="subtle-note text-sm">Type the correct verb form in each blank.</p>
      <div className="space-y-4">
        {EX3B_ITEMS.map((item, idx) => {
          const isCorrect = checked ? values[item.id]?.trim().toLowerCase() === item.answer.toLowerCase() : null;
          return (
            <div key={item.id} className="bg-cream rounded-2xl p-5">
              <div className="flex items-center gap-1 flex-wrap">
                <span className="font-sans text-xs font-semibold text-terracotta mr-1">{idx + 1}.</span>
                <span className="font-sans text-sm text-chocolate italic">{item.before}</span>
                <input
                  value={values[item.id] || ""}
                  onChange={(e) => onChange(item.id, e.target.value)}
                  placeholder="…"
                  className={`border rounded-xl px-3 py-1 font-sans text-sm text-chocolate outline-none focus:ring-2 focus:ring-terracotta/60 mx-1 transition-colors ${
                    isCorrect === true
                      ? "border-olive/60 bg-olive/10 w-40"
                      : isCorrect === false
                      ? "border-terracotta/60 bg-terracotta/10 w-40"
                      : "border-sage bg-white w-36"
                  }`}
                />
                <span className="font-sans text-sm text-chocolate italic">{item.after}</span>
              </div>
              {checked && !isCorrect && (
                <p className="font-sans text-xs text-terracotta mt-2 animate-fade-in">
                  Correct: <span className="font-semibold">{item.answer}</span>
                </p>
              )}
              {checked && isCorrect && (
                <p className="font-sans text-xs text-olive mt-2 animate-fade-in font-semibold">✓ Correct!</p>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 pt-1">
        <button
          onClick={onCheck}
          disabled={EX3B_ITEMS.some((item) => !values[item.id]?.trim())}
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

// ── Exercise 4: Build the sentence ───────────────────────────────────────────
const EX4_ITEMS = [
  {
    id: "e4_1",
    parts: "if / Max / keep / the music down / the neighbours / not call / the police",
    answer: "If Max keeps the music down, the neighbours will not call the police.",
  },
  {
    id: "e4_2",
    parts: "if / I / see / Sarah tomorrow / I / tell / her",
    answer: "If I see Sarah tomorrow, I will tell her.",
  },
  {
    id: "e4_3",
    parts: "if / Peter / talk / to his parents / they / not be / angry",
    answer: "If Peter talks to his parents, they will not be angry.",
  },
];

interface Ex4Props {
  values: Record<string, string>;
  onChange: (id: string, val: string) => void;
  checked: boolean;
  onCheck: () => void;
}
const Exercise4 = ({ values, onChange, checked, onCheck }: Ex4Props) => {
  const normalize = (s: string) =>
    s.trim().toLowerCase().replace(/['']/g, "'").replace(/\s+/g, " ");
  const score = checked
    ? EX4_ITEMS.filter((item) => normalize(values[item.id] || "") === normalize(item.answer)).length
    : 0;

  return (
    <div className="space-y-5">
      <p className="subtle-note text-sm">
        Use the word prompts to build a complete Type 1 conditional sentence. Pay attention to verb forms and punctuation.
      </p>
      {EX4_ITEMS.map((item, idx) => {
        const isCorrect = checked ? normalize(values[item.id] || "") === normalize(item.answer) : null;
        return (
          <div key={item.id} className={`bg-cream rounded-2xl p-5 border transition-colors ${isCorrect === true ? "border-olive/40" : isCorrect === false ? "border-terracotta/40" : "border-transparent"}`}>
            <div className="flex items-start gap-3 mb-3">
              <span className="font-sans text-xs font-semibold text-terracotta mt-0.5 flex-shrink-0">{idx + 1}.</span>
              <p className="font-sans text-xs text-olive/70 bg-sage/40 rounded-xl px-3 py-1.5 flex-1">
                <span className="font-semibold text-olive/80">Parts: </span>{item.parts}
              </p>
            </div>
            <input
              value={values[item.id] || ""}
              onChange={(e) => onChange(item.id, e.target.value)}
              placeholder="Write the full sentence here…"
              className={`w-full border rounded-xl px-4 py-2.5 font-sans text-sm text-chocolate placeholder:text-olive/40 outline-none focus:ring-2 focus:ring-terracotta/60 transition-colors ${
                isCorrect === true
                  ? "border-olive/60 bg-olive/10"
                  : isCorrect === false
                  ? "border-terracotta/60 bg-terracotta/10"
                  : "border-sage bg-white"
              }`}
            />
            {checked && !isCorrect && (
              <p className="font-sans text-xs text-terracotta mt-2 animate-fade-in">
                Model answer: <span className="font-semibold italic">{item.answer}</span>
              </p>
            )}
            {checked && isCorrect && (
              <p className="font-sans text-xs font-semibold text-olive mt-2 animate-fade-in">✓ Correct!</p>
            )}
          </div>
        );
      })}
      <div className="flex items-center gap-4 pt-1">
        <button
          onClick={onCheck}
          disabled={EX4_ITEMS.some((item) => !values[item.id]?.trim())}
          className="px-5 py-2.5 rounded-full bg-olive text-cream font-sans font-semibold text-sm tracking-wide hover:bg-olive/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Check answers
        </button>
        {checked && (
          <span className={`font-sans text-sm font-semibold animate-fade-in ${score === 3 ? "text-olive" : "text-terracotta"}`}>
            Score: {score} / 3{score === 3 ? " — Perfect!" : ""}
          </span>
        )}
      </div>
    </div>
  );
};

// ── Exercise 5: The Party Story fill-in ──────────────────────────────────────
const EX5_ITEMS = [
  {
    id: "ex5_1",
    before: "If I",
    mid1: "(be) you, I",
    mid2: "(talk) to your parents.",
    after: "",
    ans1: "were",
    ans2: "would talk",
  },
  {
    id: "ex5_2",
    before: "If you",
    mid1: "(talk) to your parents before the party, you",
    mid2: "(not get) into so much trouble.",
    after: "",
    ans1: "had talked",
    ans2: "would not have gotten",
  },
  {
    id: "ex5_3",
    before: "If you",
    mid1: "(offer) to help pay for the rug, your parents",
    mid2: "(be) happier.",
    after: "",
    ans1: "offered",
    ans2: "would be",
  },
  {
    id: "ex5_4",
    before: "If you",
    mid1: "(not put) candles everywhere, the rug",
    mid2: "(still be) fine.",
    after: "",
    ans1: "had not put",
    ans2: "would still be fine",
  },
];

interface Ex5Props {
  values: Record<string, string>;
  onChange: (id: string, val: string) => void;
  checked: boolean;
  onCheck: () => void;
}
const Exercise5 = ({ values, onChange, checked, onCheck }: Ex5Props) => {
  const normalize = (s: string) => s.trim().toLowerCase();
  const pairs = EX5_ITEMS.map((item) => {
    const ok1 = normalize(values[`${item.id}_1`] || "") === normalize(item.ans1);
    const ok2 = normalize(values[`${item.id}_2`] || "") === normalize(item.ans2);
    return { ok1, ok2 };
  });
  const score = checked
    ? pairs.reduce((acc, p) => acc + (p.ok1 ? 1 : 0) + (p.ok2 ? 1 : 0), 0)
    : 0;

  const blankClass = (ok: boolean | null, wide?: boolean) =>
    `border rounded-xl px-3 py-1 font-sans text-sm text-chocolate outline-none focus:ring-2 focus:ring-terracotta/60 mx-1 transition-colors ${wide ? "w-44" : "w-28"} ${
      ok === true
        ? "border-olive/60 bg-olive/10"
        : ok === false
        ? "border-terracotta/60 bg-terracotta/10"
        : "border-sage bg-white"
    }`;

  return (
    <div className="space-y-5">
      {/* Story context */}
      <div className="bg-terracotta/10 border border-terracotta/20 rounded-2xl p-5">
        <p className="font-sans text-xs font-semibold text-terracotta uppercase tracking-wide mb-2">The Party Story</p>
        <p className="font-sans text-sm text-chocolate leading-relaxed">
          Peter threw a party while his parents were away. He put candles everywhere — one fell over and burned the living room rug. The neighbours heard the noise and called the police. His parents came home early and were furious. Now Peter's friend is giving him some advice…
        </p>
      </div>

      <p className="subtle-note text-sm">Complete the friend's advice. Write the correct verb form in each blank.</p>

      <div className="space-y-5">
        {EX5_ITEMS.map((item, idx) => {
          const ok1 = checked ? pairs[idx].ok1 : null;
          const ok2 = checked ? pairs[idx].ok2 : null;
          return (
            <div key={item.id} className="bg-cream rounded-2xl p-5">
              <div className="flex items-center gap-1 flex-wrap leading-loose">
                <span className="font-sans text-xs font-semibold text-terracotta mr-1 flex-shrink-0">{idx + 1}.</span>
                <span className="font-sans text-sm text-chocolate italic">{item.before}</span>
                <input
                  value={values[`${item.id}_1`] || ""}
                  onChange={(e) => onChange(`${item.id}_1`, e.target.value)}
                  placeholder="…"
                  className={blankClass(ok1)}
                />
                <span className="font-sans text-sm text-chocolate italic">{item.mid1}</span>
                <input
                  value={values[`${item.id}_2`] || ""}
                  onChange={(e) => onChange(`${item.id}_2`, e.target.value)}
                  placeholder="…"
                  className={blankClass(ok2, true)}
                />
                {item.mid2 && <span className="font-sans text-sm text-chocolate italic">{item.mid2}</span>}
              </div>
              {checked && (
                <div className="mt-2 animate-fade-in space-y-1">
                  {!ok1 && <p className="font-sans text-xs text-terracotta">Blank 1: <span className="font-semibold">{item.ans1}</span></p>}
                  {!ok2 && <p className="font-sans text-xs text-terracotta">Blank 2: <span className="font-semibold">{item.ans2}</span></p>}
                  {ok1 && ok2 && <p className="font-sans text-xs font-semibold text-olive">✓ Both correct!</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 pt-1">
        <button
          onClick={onCheck}
          disabled={EX5_ITEMS.some((item) => !values[`${item.id}_1`]?.trim() || !values[`${item.id}_2`]?.trim())}
          className="px-5 py-2.5 rounded-full bg-olive text-cream font-sans font-semibold text-sm tracking-wide hover:bg-olive/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Check answers
        </button>
        {checked && (
          <span className={`font-sans text-sm font-semibold animate-fade-in ${score === 8 ? "text-olive" : "text-terracotta"}`}>
            Score: {score} / 8{score === 8 ? " — Perfect!" : ""}
          </span>
        )}
      </div>
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const Week3Grammar = () => {
  const { week3Name, setWeek3Name } = useUser();
  const navigate = useNavigate();

  // ── Exercise 1 state
  const [ex1Sel, setEx1Sel] = useState<Record<string, string>>({});
  const [ex1Checked, setEx1Checked] = useState(false);

  // ── Exercise 2A state
  const [ex2aSel, setEx2aSel] = useState<Record<string, string>>({});
  const [ex2aChecked, setEx2aChecked] = useState(false);

  // ── Exercise 2B state
  const [ex2bSel, setEx2bSel] = useState<Record<string, string>>({});
  const [ex2bChecked, setEx2bChecked] = useState(false);

  // ── Exercise 2C state
  const [ex2cSel, setEx2cSel] = useState<Record<string, string>>({});
  const [ex2cChecked, setEx2cChecked] = useState(false);

  // ── Exercise 2D state
  const [ex2dVal1, setEx2dVal1] = useState("");
  const [ex2dVal2, setEx2dVal2] = useState("");
  const [ex2dChecked, setEx2dChecked] = useState(false);

  // ── Exercise 3A state
  const [ex3aSel, setEx3aSel] = useState<Record<string, string>>({});
  const [ex3aChecked, setEx3aChecked] = useState(false);

  // ── Exercise 3B state
  const [ex3bVals, setEx3bVals] = useState<Record<string, string>>({});
  const [ex3bChecked, setEx3bChecked] = useState(false);

  // ── Exercise 4 state
  const [ex4Vals, setEx4Vals] = useState<Record<string, string>>({});
  const [ex4Checked, setEx4Checked] = useState(false);

  // ── Exercise 5 state
  const [ex5Vals, setEx5Vals] = useState<Record<string, string>>({});
  const [ex5Checked, setEx5Checked] = useState(false);

  // ── Exercise 6 (Challenge Zone) open text
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const handleAnswerChange = (id: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));
  const handleSubmit = (id: string) =>
    setSubmitted((prev) => ({ ...prev, [id]: !!answers[id]?.trim() }));

  // ── Generic dropdown onChange helpers (reset checked on change)
  const makeDropdownChange = (
    setter: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    checkedSetter: React.Dispatch<React.SetStateAction<boolean>>
  ) => (id: string, val: string) => {
    setter((prev) => ({ ...prev, [id]: val }));
    checkedSetter(false);
  };

  const makeInputChange = (
    setter: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    checkedSetter: React.Dispatch<React.SetStateAction<boolean>>
  ) => (id: string, val: string) => {
    setter((prev) => ({ ...prev, [id]: val }));
    checkedSetter(false);
  };

  // ── Progress detection
  const hasAnyProgress =
    Object.keys(ex1Sel).length > 0 ||
    Object.keys(ex2aSel).length > 0 ||
    Object.keys(ex2bSel).length > 0 ||
    Object.keys(ex2cSel).length > 0 ||
    ex2dVal1.trim().length > 0 ||
    ex2dVal2.trim().length > 0 ||
    Object.keys(ex3aSel).length > 0 ||
    Object.values(ex3bVals).some((v) => v?.trim()) ||
    Object.values(ex4Vals).some((v) => v?.trim()) ||
    Object.values(ex5Vals).some((v) => v?.trim()) ||
    Object.values(answers).some((v) => v?.trim());

  const handleDownloadPdf = () => {
    generateProgressPdf(
      week3Name,
      [
        {
          stepTitle: "Step 5 · Challenge Zone",
          questions: Q_CHALLENGE,
          answers,
          submitted,
          idPrefix: "ex6",
        },
      ],
      {
        weekLabel: "WEEK 3 GRAMMAR",
        pageTitle: "If-Clauses",
        step1SectionTitle: "Steps 1–4 · Grammar Exercises",
        answersTitle: "Step 5 · Challenge Zone — Written Answers",
        filenameWeek: "Week3",
        activities: [
          {
            badge: "Ex 1 · Sort Types",
            lines: [
              `Answered: ${Object.keys(ex1Sel).length} / 6${ex1Checked ? ` · Checked` : ""}`,
            ],
          },
          {
            badge: "Ex 2A · Match Meanings",
            lines: [
              `Answered: ${Object.keys(ex2aSel).length} / 3${ex2aChecked ? ` · Checked` : ""}`,
            ],
          },
          {
            badge: "Ex 2B · Multiple Choice",
            lines: [
              `Answered: ${Object.keys(ex2bSel).length} / 3${ex2bChecked ? ` · Checked` : ""}`,
            ],
          },
          {
            badge: "Ex 3A · Classify Practice",
            lines: [
              `Answered: ${Object.keys(ex3aSel).length} / 5${ex3aChecked ? ` · Checked` : ""}`,
            ],
          },
          {
            badge: "Ex 3B · Verb Forms",
            lines: [
              `Answered: ${Object.values(ex3bVals).filter((v) => v?.trim()).length} / 4${ex3bChecked ? ` · Checked` : ""}`,
            ],
          },
          {
            badge: "Ex 4 · Build Sentences",
            lines: [
              `Answered: ${Object.values(ex4Vals).filter((v) => v?.trim()).length} / 3${ex4Checked ? ` · Checked` : ""}`,
            ],
          },
          {
            badge: "Ex 5 · Party Story",
            lines: [
              `Filled: ${Object.values(ex5Vals).filter((v) => v?.trim()).length} / 8${ex5Checked ? ` · Checked` : ""}`,
            ],
          },
        ],
      }
    );
  };

  if (!week3Name) return <NameGate onEnter={setWeek3Name} />;

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
              <span className="pill pill-tier">Week 3</span>
              <span className="pill pill-xp">Grammar · 80 XP</span>
            </div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-serif text-5xl md:text-6xl text-olive leading-tight tracking-tight">If-Clauses</h1>
                <p className="subtle-note text-lg mt-3 max-w-2xl">
                  Discover the three types of conditional sentences, learn the rules, and practise building your own.
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 mt-1">
                <p className="text-[11px] tracking-[0.18em] uppercase text-olive/60">
                  Logged in as <span className="text-olive font-semibold">{week3Name}</span>
                </p>
              </div>
            </div>
          </header>

          {/* ══ STEP 1 · DISCOVER ══════════════════════════════════════════════ */}
          <section className="mb-14">
            <StepHeader step={1} tier="Discover" title="If-Clauses: Types & Rules" xp={20} />
            <div className="space-y-6">

              {/* Video */}
              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">Watch — If-Clauses Explained</h4>
                <p className="subtle-note text-sm mb-5">Watch the video introduction, then explore the infographic and quick guide below.</p>
                <div className="rounded-2xl overflow-hidden bg-chocolate/10 aspect-video flex items-center justify-center">
                  <video
                    src="/video/if-clauses.mp4"
                    controls
                    className="w-full h-full rounded-2xl object-contain"
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              {/* Infographic card — Typ 3 */}
              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">Infographic — If-Clauses Typ 3</h4>
                <p className="subtle-note text-sm mb-5">The "Too Late" sentence: for past events that can no longer be changed.</p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Box 1 — Red */}
                  <div className="rounded-2xl bg-red-50 border border-red-200 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🔴</span>
                      <p className="font-sans text-sm font-bold text-red-700">It's 100% Impossible</p>
                    </div>
                    <p className="font-sans text-xs text-red-600 leading-relaxed">
                      Use for past events that cannot be changed. The situation is over — you can only imagine what might have been different.
                    </p>
                  </div>

                  {/* Box 2 — Green */}
                  <div className="rounded-2xl bg-olive/10 border border-olive/30 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🟢</span>
                      <p className="font-sans text-sm font-bold text-olive">The Winning Formula</p>
                    </div>
                    <p className="font-sans text-xs text-olive/80 leading-relaxed">
                      <span className="font-semibold">If + Had + 3rd Form</span>
                      <br />
                      + <span className="font-semibold">Would / Could / Might Have + 3rd Form</span>
                    </p>
                    <p className="font-sans text-[11px] text-olive/60 mt-2 italic">
                      "If she had studied, she would have passed."
                    </p>
                  </div>

                  {/* Box 3 — Golden Rule */}
                  <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">⭐</span>
                      <p className="font-sans text-sm font-bold text-amber-700">The Golden Rule: No "Would" in "If"</p>
                    </div>
                    <p className="font-sans text-xs text-amber-700 leading-relaxed">
                      Never put <span className="font-semibold">"would"</span> inside the <span className="font-semibold">"if"</span> part of the sentence.
                    </p>
                    <div className="mt-3 space-y-1">
                      <p className="font-sans text-[11px] text-red-500">✗ If I <span className="font-semibold">would have studied</span>…</p>
                      <p className="font-sans text-[11px] text-olive">✓ If I <span className="font-semibold">had studied</span>…</p>
                    </div>
                  </div>

                  {/* Box 4 — Comma Flip */}
                  <div className="rounded-2xl bg-terracotta/10 border border-terracotta/20 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🔄</span>
                      <p className="font-sans text-sm font-bold text-terracotta">The Comma Flip</p>
                    </div>
                    <p className="font-sans text-xs text-terracotta/80 leading-relaxed">
                      Use a <span className="font-semibold">comma</span> if <span className="font-semibold">"If"</span> starts the sentence.
                      Remove the comma if the "If" part comes second.
                    </p>
                    <div className="mt-3 space-y-1">
                      <p className="font-sans text-[11px] text-chocolate/70 italic">If she had called<span className="font-bold text-terracotta">,</span> I would have helped.</p>
                      <p className="font-sans text-[11px] text-chocolate/70 italic">I would have helped if she had called.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Guide — all 3 types */}
              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">Quick Guide — The 3 Types</h4>
                <p className="subtle-note text-sm mb-5">Use this reference card throughout the worksheet.</p>

                <div className="space-y-3">
                  {/* Type 1 */}
                  <div className="flex gap-4 bg-cream rounded-2xl p-4 items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-sans text-sm font-bold text-chocolate">Type 1 — Real Possibility</p>
                        <span className="font-sans text-[10px] bg-green-100 text-green-700 rounded-full px-2 py-0.5 font-semibold">Possible</span>
                      </div>
                      <p className="font-sans text-xs text-olive/70 mb-1">If + present simple → will + infinitive</p>
                      <p className="font-sans text-xs text-chocolate/70 italic">"If it rains, we will stay inside."</p>
                    </div>
                  </div>

                  {/* Type 2 */}
                  <div className="flex gap-4 bg-cream rounded-2xl p-4 items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <span className="inline-block w-3 h-3 rounded-full bg-yellow-400"></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-sans text-sm font-bold text-chocolate">Type 2 — Imaginary Situation</p>
                        <span className="font-sans text-[10px] bg-yellow-100 text-yellow-700 rounded-full px-2 py-0.5 font-semibold">Imaginary</span>
                      </div>
                      <p className="font-sans text-xs text-olive/70 mb-1">If + past simple → would + infinitive</p>
                      <p className="font-sans text-xs text-chocolate/70 italic">"If I were taller, I would play basketball better."</p>
                    </div>
                  </div>

                  {/* Type 3 */}
                  <div className="flex gap-4 bg-cream rounded-2xl p-4 items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-sans text-sm font-bold text-chocolate">Type 3 — Past Regret</p>
                        <span className="font-sans text-[10px] bg-red-100 text-red-700 rounded-full px-2 py-0.5 font-semibold">Too Late</span>
                      </div>
                      <p className="font-sans text-xs text-olive/70 mb-1">If + past perfect → would have + past participle</p>
                      <p className="font-sans text-xs text-chocolate/70 italic">"If Sara had charged her phone, it would not have died."</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══ STEP 2 · CLASSIFY ══════════════════════════════════════════════ */}
          <section className="mb-14">
            <StepHeader step={2} tier="Classify" title="Sort & Match" xp={20} />
            <div className="space-y-6">

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">Exercise 1 · Sort the sentences</h4>
                <Exercise1
                  selections={ex1Sel}
                  onChange={makeDropdownChange(setEx1Sel, setEx1Checked)}
                  checked={ex1Checked}
                  onCheck={() => setEx1Checked(true)}
                />
              </div>

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">Exercise 2A · Match meaning to type</h4>
                <Exercise2A
                  selections={ex2aSel}
                  onChange={makeDropdownChange(setEx2aSel, setEx2aChecked)}
                  checked={ex2aChecked}
                  onCheck={() => setEx2aChecked(true)}
                />
              </div>
            </div>
          </section>

          {/* ══ STEP 3 · IDENTIFY ═════════════════════════════════════════════ */}
          <section className="mb-14">
            <StepHeader step={3} tier="Identify" title="Spot & Complete" xp={20} />
            <div className="space-y-6">

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">Exercise 2B · Pick the correct sentence</h4>
                <Exercise2B
                  selections={ex2bSel}
                  onChange={(id, val) => { setEx2bSel((p) => ({ ...p, [id]: val })); setEx2bChecked(false); }}
                  checked={ex2bChecked}
                  onCheck={() => setEx2bChecked(true)}
                />
              </div>

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">Exercise 2C · Spot the mistake</h4>
                <Exercise2C
                  selections={ex2cSel}
                  onChange={(id, val) => { setEx2cSel((p) => ({ ...p, [id]: val })); setEx2cChecked(false); }}
                  checked={ex2cChecked}
                  onCheck={() => setEx2cChecked(true)}
                />
              </div>

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">Exercise 2D · Complete the rule</h4>
                <Exercise2D
                  val1={ex2dVal1}
                  val2={ex2dVal2}
                  onVal1={(v) => { setEx2dVal1(v); setEx2dChecked(false); }}
                  onVal2={(v) => { setEx2dVal2(v); setEx2dChecked(false); }}
                  checked={ex2dChecked}
                  onCheck={() => setEx2dChecked(true)}
                />
              </div>
            </div>
          </section>

          {/* ══ STEP 4 · PRACTICE ═════════════════════════════════════════════ */}
          <section className="mb-14">
            <StepHeader step={4} tier="Practice" title="Classify & Complete" xp={10} />
            <div className="space-y-6">

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">Exercise 3A · Classify sentences</h4>
                <Exercise3A
                  selections={ex3aSel}
                  onChange={makeDropdownChange(setEx3aSel, setEx3aChecked)}
                  checked={ex3aChecked}
                  onCheck={() => setEx3aChecked(true)}
                />
              </div>

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">Exercise 3B · Complete the sentences</h4>
                <Exercise3B
                  values={ex3bVals}
                  onChange={makeInputChange(setEx3bVals, setEx3bChecked)}
                  checked={ex3bChecked}
                  onCheck={() => setEx3bChecked(true)}
                />
              </div>
            </div>
          </section>

          {/* ══ STEP 5 · APPLY ════════════════════════════════════════════════ */}
          <section className="mb-20">
            <StepHeader step={5} tier="Apply · Challenge" title="Build & Create" xp={10} />
            <div className="space-y-6">

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">Exercise 4 · Build the sentence</h4>
                <p className="subtle-note text-sm mb-5">
                  Use the word prompts to construct complete Type 1 conditional sentences. Remember: correct verb forms, correct punctuation.
                </p>
                <Exercise4
                  values={ex4Vals}
                  onChange={makeInputChange(setEx4Vals, setEx4Checked)}
                  checked={ex4Checked}
                  onCheck={() => setEx4Checked(true)}
                />
              </div>

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">Exercise 5 · The Party Story</h4>
                <p className="subtle-note text-sm mb-5">
                  Complete Peter's friend's advice using the correct conditional verb forms.
                </p>
                <Exercise5
                  values={ex5Vals}
                  onChange={makeInputChange(setEx5Vals, setEx5Checked)}
                  checked={ex5Checked}
                  onCheck={() => setEx5Checked(true)}
                />
              </div>

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">Exercise 6 · Challenge Zone</h4>
                <p className="subtle-note text-sm mb-5">
                  Write three of your own Type 3 conditional sentences. Think about past regrets or different outcomes — real or imaginary.
                </p>
                <QuestionList
                  questions={Q_CHALLENGE}
                  idPrefix="ex6"
                  stepTitle="Step 5 · Challenge Zone"
                  answers={answers}
                  submitted={submitted}
                  onAnswerChange={handleAnswerChange}
                  onSubmit={handleSubmit}
                />
              </div>
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
              {hasAnyProgress ? `Generate PDF — ${week3Name}` : "Generate PDF"}
            </button>
          </div>

          <footer className="text-center pb-24">
            <p className="subtle-note">End of Week 3 · Grammar. If you practise, you will succeed.</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Week3Grammar;
