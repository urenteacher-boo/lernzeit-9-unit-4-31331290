import { useState } from "react";
import { Check } from "lucide-react";

const EVENTS = [
  { id: "a", text: "Jerome started his YouTube channel about gaming." },
  { id: "b", text: "He deleted his early videos because he wasn't happy with them." },
  { id: "c", text: "His followers loved his vlogs and the channel grew." },
  { id: "d", text: "He nearly shut down his account due to negative comments." },
  { id: "e", text: "Companies started sending him new games to review." },
];

const CORRECT_ORDER = ["a", "b", "c", "d", "e"];

export const EventOrder = () => {
  const [order, setOrder] = useState<Record<string, number | null>>(
    Object.fromEntries(EVENTS.map((e) => [e.id, null]))
  );
  const [checked, setChecked] = useState(false);

  const setNumber = (id: string, value: string) => {
    const n = value === "" ? null : Math.max(1, Math.min(5, parseInt(value, 10)));
    setOrder((o) => ({ ...o, [id]: Number.isNaN(n as number) ? null : (n as number | null) }));
    setChecked(false);
  };

  const isCorrect = (id: string) => {
    const n = order[id];
    if (!n) return false;
    return CORRECT_ORDER[n - 1] === id;
  };

  return (
    <div className="space-y-3">
      {EVENTS.map((e) => {
        const correct = checked && isCorrect(e.id);
        const wrong = checked && order[e.id] && !isCorrect(e.id);
        return (
          <div
            key={e.id}
            className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
              correct
                ? "bg-olive/10 border-olive"
                : wrong
                ? "bg-destructive/10 border-destructive"
                : "bg-cream border-terracotta/20"
            }`}
          >
            <input
              type="number"
              min={1}
              max={5}
              value={order[e.id] ?? ""}
              onChange={(ev) => setNumber(e.id, ev.target.value)}
              className="w-14 h-10 rounded-lg border border-terracotta/30 bg-cream text-center font-sans text-terracotta"
            />
            <span className="font-sans text-sm text-olive flex-1">{e.text}</span>
            {correct && <Check className="w-5 h-5 text-olive" />}
          </div>
        );
      })}
      <button
        onClick={() => setChecked(true)}
        className="pill bg-terracotta text-cream hover:bg-terracotta/90"
      >
        Check order
      </button>
    </div>
  );
};
