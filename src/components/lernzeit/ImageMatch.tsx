import { useState } from "react";
import footprint from "@/assets/vocab-footprint.jpg";
import email from "@/assets/vocab-email.jpg";
import password from "@/assets/vocab-password.jpg";
import adult from "@/assets/vocab-adult.jpg";
import nickname from "@/assets/vocab-nickname.jpg";
import identity from "@/assets/vocab-identity.jpg";
import { Check } from "lucide-react";

const ITEMS = [
  { id: "FOOTPRINT", src: footprint },
  { id: "EMAIL", src: email },
  { id: "PASSWORD", src: password },
  { id: "ADULT", src: adult },
  { id: "NICKNAME", src: nickname },
  { id: "IDENTITY", src: identity },
];

const WORDS = ["IDENTITY", "EMAIL", "ADULT", "FOOTPRINT", "NICKNAME", "PASSWORD"];

export const ImageMatch = ({ onProgress }: { onProgress?: (matched: number) => void }) => {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const handleWord = (word: string) => {
    if (!selectedImg) return;
    if (selectedImg === word) {
      setMatches((m) => {
        const next = { ...m, [selectedImg]: word };
        onProgress?.(Object.values(next).filter(v => v !== "__wrong__").length);
        return next;
      });
    } else {
      // wrong: brief shake via clearing
      setMatches((m) => ({ ...m, [selectedImg]: "__wrong__" }));
      setTimeout(() => setMatches((m) => { const c = { ...m }; delete c[selectedImg]; return c; }), 600);
    }
    setSelectedImg(null);
  };

  const used = Object.entries(matches).filter(([, v]) => v !== "__wrong__").map(([, v]) => v);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ITEMS.map((it) => {
          const m = matches[it.id];
          const correct = m && m !== "__wrong__";
          const wrong = m === "__wrong__";
          return (
            <button
              key={it.id}
              onClick={() => !correct && setSelectedImg(it.id)}
              className={`relative aspect-square rounded-2xl overflow-hidden bg-sand/30 transition-all ${
                selectedImg === it.id ? "ring-4 ring-terracotta" : ""
              } ${correct ? "ring-4 ring-olive" : ""} ${wrong ? "animate-pulse ring-4 ring-destructive" : ""}`}
            >
              <img src={it.src} alt={it.id} className="w-full h-full object-cover" />
              {correct && (
                <div className="absolute inset-0 bg-olive/70 flex items-center justify-center">
                  <div className="text-center text-cream">
                    <Check className="w-7 h-7 mx-auto mb-1" />
                    <span className="font-sans text-xs tracking-wide font-semibold">{it.id}</span>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {WORDS.map((w) => {
          const isUsed = used.includes(w);
          return (
            <button
              key={w}
              disabled={isUsed}
              onClick={() => handleWord(w)}
              className={`pill ${isUsed ? "bg-olive/20 text-olive/40 line-through" : "bg-cream text-terracotta border border-terracotta/30 hover:bg-terracotta hover:text-cream"} transition-colors`}
            >
              {w}
            </button>
          );
        })}
      </div>
      <p className="subtle-note text-sm">
        {selectedImg ? `Pick the word for the highlighted image.` : `Tap an image, then tap its matching word.`}
      </p>
    </div>
  );
};
