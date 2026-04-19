import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Q { q: string; hint?: string; }
interface Props {
  questions: Q[];
  idPrefix: string;
  stepTitle: string;
  answers: Record<string, string>;
  submitted: Record<string, boolean>;
  onAnswerChange: (id: string, value: string) => void;
  onSubmit: (id: string) => void;
}

export const QuestionList = ({
  questions,
  idPrefix,
  answers,
  submitted,
  onAnswerChange,
  onSubmit,
}: Props) => {
  const [open, setOpen] = useState<string | null>(`${idPrefix}-0`);

  return (
    <ul className="space-y-2">
      {questions.map((item, i) => {
        const id = `${idPrefix}-${i}`;
        const isOpen = open === id;
        const done = submitted[id];
        return (
          <li key={id} className="bg-cream rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? null : id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <span className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${done ? "bg-olive text-cream" : "bg-sage-2 text-olive"}`}>
                  {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </span>
                <span className="font-sans text-sm text-chocolate">{item.q}</span>
              </span>
              <ChevronDown className={`w-4 h-4 text-olive/60 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 animate-fade-in">
                {item.hint && <p className="subtle-note text-xs mb-2">{item.hint}</p>}
                <textarea
                  value={answers[id] || ""}
                  onChange={(e) => onAnswerChange(id, e.target.value)}
                  rows={3}
                  placeholder="Your answer…"
                  className="w-full bg-sage/40 rounded-xl px-4 py-3 font-sans text-sm text-chocolate placeholder:text-olive/40 outline-none focus:ring-2 focus:ring-terracotta/60 resize-none"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => onSubmit(id)}
                    className="px-4 py-2 rounded-full bg-olive text-cream text-xs font-sans font-semibold tracking-wide hover:bg-olive/90 transition-colors"
                  >
                    {done ? "Saved ✓" : "Save answer"}
                  </button>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};
