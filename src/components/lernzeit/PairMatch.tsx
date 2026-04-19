import { useState } from "react";
import { Check } from "lucide-react";

const PAIRS = [
  { left: "Log off", right: "Shared computer" },
  { left: "Adult", right: "Tell them if you are upset" },
  { left: "History button", right: "Favourite websites" },
];

export const PairMatch = ({ onProgress }: { onProgress?: (matched: number) => void }) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const rights = [...PAIRS].sort(() => -1).map((p) => p.right);

  const handleRight = (right: string) => {
    if (!selectedLeft) return;
    const correct = PAIRS.find((p) => p.left === selectedLeft)?.right === right;
    if (correct) setMatched((m) => {
      const next = { ...m, [selectedLeft]: right };
      onProgress?.(Object.keys(next).length);
      return next;
    });
    setSelectedLeft(null);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        {PAIRS.map((p) => {
          const done = !!matched[p.left];
          const sel = selectedLeft === p.left;
          return (
            <button
              key={p.left}
              disabled={done}
              onClick={() => setSelectedLeft(p.left)}
              className={`w-full text-left px-4 py-3 rounded-xl font-sans text-sm transition-all ${
                done ? "bg-olive text-cream" : sel ? "bg-terracotta text-cream" : "bg-cream text-chocolate hover:bg-sage-2"
              }`}
            >
              <span className="flex items-center justify-between">
                {p.left}
                {done && <Check className="w-4 h-4" />}
              </span>
            </button>
          );
        })}
      </div>
      <div className="space-y-2">
        {rights.map((r) => {
          const done = Object.values(matched).includes(r);
          return (
            <button
              key={r}
              disabled={done}
              onClick={() => handleRight(r)}
              className={`w-full text-left px-4 py-3 rounded-xl font-sans text-sm transition-all ${
                done ? "bg-olive text-cream" : "bg-cream text-chocolate hover:bg-sage-2"
              }`}
            >
              {r}
            </button>
          );
        })}
      </div>
    </div>
  );
};
