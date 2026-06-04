import { useState } from "react";
import { Check, X } from "lucide-react";

const SENTENCES = [
  {
    before: "If you",
    after: ", you will fail the test.",
    options: ["don't study", "didn't study", "hadn't studied"],
    answer: "don't study",
    type: 1,
  },
  {
    before: "If I",
    after: " you, I would talk to your parents.",
    options: ["am", "were", "had been"],
    answer: "were",
    type: 2,
  },
  {
    before: "If she",
    after: " her phone, it would not have died.",
    options: ["charges", "charged", "had charged"],
    answer: "had charged",
    type: 3,
  },
  {
    before: "If we leave now, we",
    after: " the bus.",
    options: ["catch", "will catch", "would catch"],
    answer: "will catch",
    type: 1,
  },
  {
    before: "If I",
    after: " more free time, I would learn to play the guitar.",
    options: ["have", "had", "had had"],
    answer: "had",
    type: 2,
  },
  {
    before: "If he",
    after: " that photo online, nobody would have seen it.",
    options: ["doesn't post", "didn't post", "hadn't posted"],
    answer: "hadn't posted",
    type: 3,
  },
  {
    before: "If you",
    after: " the app, you will sleep better at night.",
    options: ["deleted", "delete", "had deleted"],
    answer: "delete",
    type: 1,
  },
  {
    before: "She",
    after: " so tired if she had switched off her phone earlier.",
    options: ["will not feel", "would not feel", "would not have felt"],
    answer: "would not have felt",
    type: 3,
  },
];

const TYPE_COLORS: Record<number, string> = {
  1: "bg-olive/10 text-olive border-olive/20",
  2: "bg-terracotta/10 text-terracotta border-terracotta/20",
  3: "bg-chocolate/10 text-chocolate border-chocolate/20",
};

export const GrammarCheckpoint = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  const allAnswered = SENTENCES.every((_, i) => answers[i]);
  const score = checked
    ? SENTENCES.filter((s, i) => answers[i] === s.answer).length
    : 0;

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-2">
        {[1, 2, 3].map((t) => (
          <span key={t} className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${TYPE_COLORS[t]}`}>
            Type {t}
          </span>
        ))}
        <span className="font-sans text-[11px] text-olive/50 self-center ml-1">— colour shows conditional type</span>
      </div>

      <div className="space-y-3">
        {SENTENCES.map((s, i) => {
          const correct = checked ? answers[i] === s.answer : null;
          return (
            <div
              key={i}
              className={`bg-cream rounded-2xl p-4 border transition-colors ${
                correct === true
                  ? "border-olive/40"
                  : correct === false
                  ? "border-terracotta/40"
                  : "border-transparent"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-sans text-[10px] font-bold text-olive/40">{i + 1}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${TYPE_COLORS[s.type]}`}>
                  Type {s.type}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 font-sans text-sm text-chocolate">
                <span className="italic">{s.before}</span>
                <select
                  value={answers[i] || ""}
                  onChange={(e) => { if (!checked) setAnswers({ ...answers, [i]: e.target.value }); }}
                  className={`bg-sage/40 rounded-xl px-3 py-1.5 font-sans text-sm text-chocolate outline-none focus:ring-2 focus:ring-terracotta/60 transition-colors ${
                    correct === true ? "bg-olive/10" : correct === false ? "bg-terracotta/10" : ""
                  }`}
                >
                  <option value="">choose…</option>
                  {s.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                <span className="italic">{s.after}</span>
              </div>
              {checked && (
                <p className={`font-sans text-xs mt-2 flex items-center gap-1 ${
                  correct ? "text-olive" : "text-terracotta"
                }`}>
                  {correct
                    ? <><Check className="w-3 h-3" />Correct!</>
                    : <><X className="w-3 h-3" />Answer: <span className="font-semibold">{s.answer}</span></>
                  }
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          onClick={() => setChecked(true)}
          disabled={!allAnswered}
          className="px-6 py-2.5 rounded-full bg-olive text-cream font-sans text-sm font-semibold hover:bg-olive/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Check answers
        </button>
        {checked && (
          <>
            <button
              onClick={() => { setAnswers({}); setChecked(false); }}
              className="px-6 py-2.5 rounded-full bg-sage-2 text-olive font-sans text-sm font-semibold hover:bg-sage transition-colors"
            >
              Try again
            </button>
            <p className="font-sans text-sm text-olive">{score}/{SENTENCES.length} correct</p>
          </>
        )}
      </div>
    </div>
  );
};
