import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

const WORDS = [
  "subscribe to", "post", "switch off", "switch on", "build up",
  "shut down", "follow", "vlog", "comment on", "delete",
];

const DEFINITIONS: [string, string][] = [
  ["a", "choose to see the things someone uploads on social media"],
  ["b", "close or stop something"],
  ["c", "increase the number of something"],
  ["d", "make and share videos online"],
  ["e", "put a message or image on social media"],
  ["f", "remove something"],
  ["g", "start something working"],
  ["h", "stop something working"],
  ["i", "write your opinion online"],
  ["j", "agree to regularly receive an online service or information about it"],
];

// correct letter for each word (1-indexed)
const ANSWERS: Record<number, string> = {
  1: "j", 2: "e", 3: "h", 4: "g", 5: "c",
  6: "b", 7: "a", 8: "d", 9: "i", 10: "f",
};

export const VocabMatch = ({ onScore }: { onScore?: (score: number) => void }) => {
  const [sel, setSel]       = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  const allSelected = WORDS.every((_, i) => sel[i + 1]);
  const score = checked
    ? Object.entries(ANSWERS).filter(([k, v]) => sel[Number(k)] === v).length
    : 0;

  return (
    <div className="space-y-5">
      {/* Definition reference card */}
      <div className="bg-cream rounded-2xl p-5 grid sm:grid-cols-2 gap-x-8 gap-y-2">
        <p className="col-span-full text-[10px] tracking-[0.18em] uppercase text-olive/60 mb-1">Definitions</p>
        {DEFINITIONS.map(([letter, def]) => (
          <p key={letter} className="font-sans text-[13px] text-chocolate leading-snug">
            <span className="font-bold text-terracotta mr-1.5 inline-block w-4">{letter}.</span>{def}
          </p>
        ))}
      </div>

      {/* Matching rows */}
      <div className="space-y-2">
        {WORDS.map((word, i) => {
          const num      = i + 1;
          const picked   = sel[num];
          const correct  = ANSWERS[num];
          const isRight  = checked && picked === correct;
          const isWrong  = checked && picked && picked !== correct;

          return (
            <div
              key={word}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 border transition-all ${
                isRight ? "bg-olive/8 border-olive/30"
                : isWrong ? "bg-red-50 border-red-200"
                : "bg-cream border-sage"
              }`}
            >
              <span className="w-5 text-right font-sans text-xs font-bold text-olive/40 flex-shrink-0">{num}.</span>
              <span className="flex-1 font-sans text-sm font-semibold text-chocolate">{word}</span>

              <select
                value={picked ?? ""}
                disabled={checked}
                onChange={(e) => setSel((p) => ({ ...p, [num]: e.target.value }))}
                className="w-16 bg-sage/50 border border-sage rounded-lg px-2 py-1.5 font-sans text-sm text-chocolate outline-none focus:ring-2 focus:ring-terracotta/60 disabled:opacity-70"
              >
                <option value="">—</option>
                {"abcdefghij".split("").map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>

              {checked && isRight && <CheckCircle2 className="w-4 h-4 text-olive flex-shrink-0" />}
              {checked && isWrong && (
                <>
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span className="font-sans text-xs text-olive font-semibold flex-shrink-0">→ {correct}</span>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        {!checked ? (
          <button
            onClick={() => { setChecked(true); onScore?.(Object.entries(ANSWERS).filter(([k, v]) => sel[Number(k)] === v).length); }}
            disabled={!allSelected}
            className="px-6 py-2.5 rounded-full bg-olive text-cream font-sans font-semibold text-sm hover:bg-olive/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Check answers
          </button>
        ) : (
          <>
            <p className="font-sans text-sm font-semibold text-olive">{score} / {WORDS.length} correct</p>
            <button
              onClick={() => { setSel({}); setChecked(false); }}
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
