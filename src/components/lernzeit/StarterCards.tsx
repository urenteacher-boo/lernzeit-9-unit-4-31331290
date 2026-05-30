import { useState } from "react";
import { Check, X } from "lucide-react";

const REFERENCE = [
  {
    label: "Opening the description",
    color: "terracotta",
    starters: [
      "This image shows …",
      "In this photograph, I can see …",
      "The image depicts …",
    ],
  },
  {
    label: "Describing what you see",
    color: "olive",
    starters: [
      "There is / There are …",
      "I can see … in the image.",
      "One of the main things I notice is …",
    ],
  },
  {
    label: "Location language",
    color: "chocolate",
    starters: [
      "In the foreground, there is / are …",
      "In the background, I can see …",
      "On the left / right, there is …",
      "In the centre of the image, …",
    ],
  },
  {
    label: "Speculating about people",
    color: "terracotta",
    starters: [
      "The person seems to be …",
      "They might be …",
      "It looks as if they are …",
      "I think this could be …",
    ],
  },
  {
    label: "Mood & atmosphere",
    color: "olive",
    starters: [
      "The atmosphere in this image is …",
      "The overall mood seems …",
      "This image conveys a sense of …",
      "The tone of the image is …",
    ],
  },
  {
    label: "Connecting to the theme",
    color: "chocolate",
    starters: [
      "This reminds me of our topic, Generation Like, because …",
      "This image relates to the issue of … because …",
      "It makes me think about the pressures of social media …",
    ],
  },
  {
    label: "Opinion & conclusion",
    color: "terracotta",
    starters: [
      "What I find most striking is …",
      "In my opinion, this image is powerful because …",
      "Overall, this image suggests that …",
      "To sum up, this photograph shows …",
    ],
  },
];

const MATCH_PAIRS = [
  { starter: "In the foreground, there are …",          answer: "Location language" },
  { starter: "The atmosphere in this image is …",        answer: "Mood & atmosphere" },
  { starter: "The image depicts …",                      answer: "Opening the description" },
  { starter: "They might be …",                          answer: "Speculating about people" },
  { starter: "This reminds me of Generation Like …",     answer: "Connecting to the theme" },
  { starter: "Overall, this image suggests that …",      answer: "Opinion & conclusion" },
];

const OPTIONS = [
  "Opening the description",
  "Describing what you see",
  "Location language",
  "Speculating about people",
  "Mood & atmosphere",
  "Connecting to the theme",
  "Opinion & conclusion",
];

const REF_STYLES: Record<string, { header: string; border: string }> = {
  terracotta: { header: "text-terracotta", border: "border-terracotta/20 bg-terracotta/5" },
  olive:      { header: "text-olive",      border: "border-olive/20 bg-olive/5"           },
  chocolate:  { header: "text-chocolate",  border: "border-chocolate/20 bg-chocolate/5"   },
};

export const StarterCards = () => {
  const [tab, setTab] = useState<"reference" | "practice">("reference");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  const score = MATCH_PAIRS.filter((p, i) => answers[i] === p.answer).length;
  const allAnswered = MATCH_PAIRS.every((_, i) => answers[i]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["reference", "practice"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full font-sans text-xs font-semibold tracking-wide transition-all capitalize ${
              tab === t ? "bg-olive text-cream" : "bg-sage-2 text-olive hover:bg-sage"
            }`}
          >
            {t === "reference" ? "Reference cards" : "Matching practice"}
          </button>
        ))}
      </div>

      {tab === "reference" && (
        <div className="grid sm:grid-cols-2 gap-4">
          {REFERENCE.map((cat) => {
            const s = REF_STYLES[cat.color] || REF_STYLES.olive;
            return (
              <div key={cat.label} className={`rounded-2xl border p-4 ${s.border}`}>
                <p className={`font-sans text-[11px] font-semibold uppercase tracking-wider mb-3 ${s.header}`}>
                  {cat.label}
                </p>
                <ul className="space-y-1.5">
                  {cat.starters.map((st) => (
                    <li key={st} className="font-sans text-sm text-chocolate leading-snug">
                      <span className="text-olive/50 mr-1.5">→</span>{st}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {tab === "practice" && (
        <div className="space-y-4">
          <p className="subtle-note text-sm">Match each sentence starter to its function. Select from the dropdown.</p>
          <div className="space-y-3">
            {MATCH_PAIRS.map((pair, i) => {
              const correct = checked && answers[i] === pair.answer;
              const wrong = checked && !!answers[i] && answers[i] !== pair.answer;
              return (
                <div
                  key={i}
                  className={`bg-cream rounded-2xl p-4 border transition-colors ${
                    correct ? "border-olive/40" : wrong ? "border-terracotta/40" : "border-transparent"
                  }`}
                >
                  <p className="font-sans text-sm text-chocolate italic mb-2">"{pair.starter}"</p>
                  <select
                    value={answers[i] || ""}
                    onChange={(e) => {
                      if (!checked) setAnswers({ ...answers, [i]: e.target.value });
                    }}
                    className="w-full bg-sage/40 rounded-xl px-3 py-2 font-sans text-sm text-chocolate outline-none focus:ring-2 focus:ring-terracotta/60"
                  >
                    <option value="">Choose the function…</option>
                    {OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  {correct && (
                    <p className="font-sans text-xs text-olive mt-1.5 flex items-center gap-1">
                      <Check className="w-3 h-3" />Correct!
                    </p>
                  )}
                  {wrong && (
                    <p className="font-sans text-xs text-terracotta mt-1.5 flex items-center gap-1">
                      <X className="w-3 h-3" />Answer: {pair.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-4">
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
                <p className="font-sans text-sm text-olive">{score}/{MATCH_PAIRS.length} correct</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
