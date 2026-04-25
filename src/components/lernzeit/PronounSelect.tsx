import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

// Each gap: [optionA, optionB], correct answer
const GAPS: [string, string, string][] = [
  ["everywhere", "anywhere",   "everywhere"],
  ["ourself",    "yourself",   "yourself"],
  ["Everything", "Nothing",    "Nothing"],
  ["something",  "anything",   "something"],
  ["everyone",   "no one",     "everyone"],
  ["ourselves",  "themselves", "ourselves"],
  ["myself",     "ourselves",  "ourselves"],
  ["themselves", "each other", "each other"],
  ["one another","themselves", "one another"],
];

// Paragraph split into alternating text / gap segments
// "gap" entries are replaced by interactive buttons
type Seg = { type: "text"; value: string } | { type: "gap"; index: number };

const PARAGRAPH: Seg[] = [
  { type: "text",  value: "Ads are " },
  { type: "gap",   index: 0 },
  { type: "text",  value: ", but have you ever asked " },
  { type: "gap",   index: 1 },
  { type: "text",  value: " how advertising works? Marketing companies use techniques to make us buy things we don't even want. " },
  { type: "gap",   index: 2 },
  { type: "text",  value: " is more effective than making us think that we are missing out on " },
  { type: "gap",   index: 3 },
  { type: "text",  value: " that " },
  { type: "gap",   index: 4 },
  { type: "text",  value: " else has and that we will be happier if we buy " },
  { type: "gap",   index: 5 },
  { type: "text",  value: " something new. They also make us compare " },
  { type: "gap",   index: 6 },
  { type: "text",  value: " to others. For example, in a typical shampoo ad, two women look at " },
  { type: "gap",   index: 7 },
  { type: "text",  value: ". One of them asks herself, 'Why is her hair so beautiful?' When they talk to " },
  { type: "gap",   index: 8 },
  { type: "text",  value: " she discovers the secret: The incredible shampoo!" },
];

export const PronounSelect = () => {
  const [picks, setPicks]     = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  const allPicked = GAPS.every((_, i) => picks[i] !== undefined);
  const score     = checked ? GAPS.filter(([,, ans], i) => picks[i] === ans).length : 0;

  const pick = (index: number, opt: string) => {
    if (checked) return;
    setPicks((p) => ({ ...p, [index]: opt }));
  };

  return (
    <div className="space-y-5">
      {/* Paragraph box */}
      <div className="bg-cream rounded-2xl p-5 font-sans text-[14px] text-chocolate leading-relaxed">
        {PARAGRAPH.map((seg, si) => {
          if (seg.type === "text") return <span key={si}>{seg.value}</span>;

          const i          = seg.index;
          const [a, b, ans] = GAPS[i];
          const picked     = picks[i];

          const btnClass = (opt: string) => {
            const isSelected = picked === opt;
            if (checked) {
              if (opt === ans)       return "bg-olive text-cream border-olive";
              if (isSelected)        return "bg-red-100 text-red-600 border-red-300";
              return "bg-sage/40 text-chocolate/50 border-sage";
            }
            return isSelected
              ? "bg-terracotta text-cream border-terracotta"
              : "bg-sage/60 text-chocolate border-sage hover:bg-terracotta/15";
          };

          return (
            <span key={si} className="inline-flex items-center gap-1 mx-0.5 align-baseline">
              <sup className="text-[10px] text-terracotta font-bold mr-0.5">{i + 1}</sup>
              {[a, b].map((opt) => (
                <button
                  key={opt}
                  disabled={checked}
                  onClick={() => pick(i, opt)}
                  className={`px-2 py-0.5 rounded-lg font-semibold text-[13px] border transition-all ${btnClass(opt)}`}
                >
                  {opt}
                </button>
              ))}
              {checked && (
                picked === ans
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-olive flex-shrink-0" />
                  : <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              )}
            </span>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        {!checked ? (
          <button
            onClick={() => setChecked(true)}
            disabled={!allPicked}
            className="px-6 py-2.5 rounded-full bg-olive text-cream font-sans font-semibold text-sm hover:bg-olive/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Check answers
          </button>
        ) : (
          <>
            <p className="font-sans text-sm font-semibold text-olive">{score} / {GAPS.length} correct</p>
            <button
              onClick={() => { setPicks({}); setChecked(false); }}
              className="px-5 py-2 rounded-full bg-sage text-olive font-sans text-sm font-semibold hover:bg-sage-2 transition-colors"
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
};
