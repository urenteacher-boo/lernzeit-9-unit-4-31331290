import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

const PHRASES = [
  "Why don't you...",
  "You could always...",
  "It's really easy...",
  "I don't know where to start",
  "Would it be difficult?",
  "How does it work?",
];

const ANSWERS: Record<number, string> = {
  1: "I don't know where to start",
  2: "Why don't you...",
  3: "It's really easy...",
  4: "You could always...",
  5: "Would it be difficult?",
  6: "How does it work?",
};

type Part = string | { gap: number };

const DIALOGUE: { speaker: "GINNY" | "NIALL"; parts?: Part[]; text?: string }[] = [
  { speaker: "GINNY", text: "What's up, Niall?" },
  {
    speaker: "NIALL",
    parts: [
      "I've got to make a video for my technology project to advertise something and I don't have a clue what to do. ",
      { gap: 1 },
      "! Can you think of anything?",
    ],
  },
  {
    speaker: "GINNY",
    parts: [
      { gap: 2 },
      " use a video creation tool. ",
      { gap: 3 },
      " to make videos. I've used some great ones.",
    ],
  },
  { speaker: "NIALL", text: "That sounds like a plan. What do I need to know?" },
  {
    speaker: "GINNY",
    parts: [
      "Well, a video creation tool ",
      { gap: 4 },
      " because it would provide you with a ready-made template.",
    ],
  },
  { speaker: "NIALL", parts: [{ gap: 5 }, "?"] },
  { speaker: "GINNY", text: "Yeah, you can teach yourself to do it, no problem." },
  { speaker: "NIALL", text: "Excellent! So I add my own text and images, do I?" },
  {
    speaker: "GINNY",
    text: "Well, you need to write your own text, but most video creation tools have a ready-made image bank, which is handy.",
  },
  { speaker: "NIALL", text: "Great, I can use their images." },
  {
    speaker: "GINNY",
    parts: ["Yep and you can add music and a voiceover. ", { gap: 6 }, "!"],
  },
  {
    speaker: "NIALL",
    text: "Sounds like a no-brainer. I'll check out the options online. Thanks, Ginny!",
  },
];

// Defined outside DialogueFill so React doesn't remount it on every keystroke
const GapInput = ({
  n,
  value,
  checked,
  onChange,
}: {
  n: number;
  value: string;
  checked: boolean;
  onChange: (n: number, val: string) => void;
}) => {
  const correct = ANSWERS[n];
  const isRight = checked && value.trim().toLowerCase() === correct.toLowerCase();
  const isWrong = checked && value.trim() !== "" && !isRight;

  return (
    <span className="inline-flex items-center gap-1 align-middle">
      <input
        type="text"
        value={value}
        disabled={checked}
        placeholder={`${n}…`}
        onChange={(e) => onChange(n, e.target.value)}
        className={`rounded-lg px-2 py-0.5 font-sans text-[13px] outline-none border transition-all w-44 disabled:opacity-80 ${
          isRight
            ? "bg-olive/10 border-olive/40 text-olive"
            : isWrong
            ? "bg-red-50 border-red-300 text-red-700"
            : "bg-white border-terracotta/30 text-chocolate focus:ring-2 focus:ring-terracotta/50"
        }`}
      />
      {isRight && <CheckCircle2 className="w-3.5 h-3.5 text-olive flex-shrink-0" />}
      {isWrong && <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />}
    </span>
  );
};

export const DialogueFill = () => {
  const [sel, setSel]         = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  const handleChange = (n: number, val: string) =>
    setSel((p) => ({ ...p, [n]: val }));

  const allFilled =
    Object.keys(sel).length === 6 && Object.values(sel).every((v) => v.trim());

  const score = checked
    ? Object.entries(ANSWERS).filter(([k, v]) =>
        (sel[Number(k)] ?? "").trim().toLowerCase() === v.toLowerCase()
      ).length
    : 0;

  const renderParts = (parts: Part[]) =>
    parts.map((part, i) =>
      typeof part === "string" ? (
        <span key={i}>{part}</span>
      ) : (
        <GapInput
          key={part.gap}
          n={part.gap}
          value={sel[part.gap] ?? ""}
          checked={checked}
          onChange={handleChange}
        />
      )
    );

  return (
    <div className="space-y-5">
      {/* Useful Language box */}
      <div className="bg-cream rounded-2xl p-5">
        <p className="text-[10px] tracking-[0.18em] uppercase text-olive/60 mb-3">Useful Language</p>
        <div className="flex flex-wrap gap-2">
          {PHRASES.map((p) => (
            <span key={p} className="pill pill-tier text-xs">{p}</span>
          ))}
        </div>
      </div>

      {/* Dialogue table */}
      <div className="rounded-2xl overflow-hidden border border-sage">
        {DIALOGUE.map((line, i) => {
          const isGinny = line.speaker === "GINNY";
          return (
            <div
              key={i}
              className={`flex border-b last:border-b-0 border-sage ${
                isGinny ? "bg-terracotta/5" : "bg-cream"
              }`}
            >
              <div
                className={`w-16 flex-shrink-0 px-3 pt-3.5 font-sans text-xs font-bold tracking-wide ${
                  isGinny ? "text-terracotta" : "text-olive"
                }`}
              >
                {line.speaker}
              </div>
              <div className="flex-1 px-4 py-3 font-sans text-[13px] text-chocolate leading-relaxed">
                {line.text ?? renderParts(line.parts!)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        {!checked ? (
          <button
            onClick={() => setChecked(true)}
            disabled={!allFilled}
            className="px-6 py-2.5 rounded-full bg-olive text-cream font-sans font-semibold text-sm hover:bg-olive/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Check answers
          </button>
        ) : (
          <>
            <p className="font-sans text-sm font-semibold text-olive">{score} / 6 correct</p>
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
