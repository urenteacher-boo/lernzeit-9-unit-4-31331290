import { useState } from "react";
import { Check } from "lucide-react";

const CRITERIA = [
  "Catchy opening line",
  "Indefinite pronoun used correctly",
  "Reflexive / reciprocal pronoun used correctly",
  "FOMO (fear of missing out) language",
  "Hashtags",
];

const VERDICT = ["Definitely!", "Maybe...", "Not a chance!"] as const;
type Verdict = typeof VERDICT[number];

const VERDICT_COLORS: Record<Verdict, string> = {
  "Definitely!":   "bg-olive text-cream border-olive",
  "Maybe...":      "bg-sand text-chocolate border-sand",
  "Not a chance!": "bg-terracotta text-cream border-terracotta",
};

export const PeerReview = () => {
  const [ticked,  setTicked]  = useState<Record<number, boolean>>({});
  const [verdict, setVerdict] = useState<Verdict | null>(null);

  const toggle = (i: number) =>
    setTicked((t) => ({ ...t, [i]: !t[i] }));

  const count = Object.values(ticked).filter(Boolean).length;

  return (
    <div className="space-y-5">
      <p className="font-sans text-sm text-chocolate">
        Swap with a partner. Would <em>you</em> buy their product? Tick everything they included:
      </p>

      {/* Checklist */}
      <div className="space-y-2">
        {CRITERIA.map((label, i) => {
          const checked = !!ticked[i];
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`w-full flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all ${
                checked
                  ? "border-olive bg-olive/8"
                  : "border-sage bg-cream hover:border-olive/40"
              }`}
            >
              <span
                className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                  checked ? "bg-olive border-olive" : "border-sage-2 bg-white"
                }`}
              >
                {checked && <Check className="w-3 h-3 text-cream" strokeWidth={3} />}
              </span>
              <span className={`font-sans text-sm ${checked ? "text-olive font-semibold" : "text-chocolate"}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Score pill */}
      <p className="font-sans text-xs text-olive/60">
        {count} / {CRITERIA.length} criteria ticked
      </p>

      {/* Would you buy it? */}
      <div className="border-t border-sage pt-5">
        <p className="font-sans text-sm font-semibold text-chocolate mb-3">Would you buy it?</p>
        <div className="flex flex-wrap gap-3">
          {VERDICT.map((v) => (
            <button
              key={v}
              onClick={() => setVerdict(v)}
              className={`px-5 py-2.5 rounded-full border-2 font-sans text-sm font-semibold transition-all ${
                verdict === v
                  ? VERDICT_COLORS[v]
                  : "border-sage bg-cream text-chocolate hover:border-olive/40"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        {verdict && (
          <p className="font-sans text-xs text-olive/60 mt-3 animate-fade-in">
            You voted: <strong>{verdict}</strong>
          </p>
        )}
      </div>
    </div>
  );
};
