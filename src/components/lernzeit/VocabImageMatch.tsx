import { useState } from "react";
import { Check } from "lucide-react";
import { AudioPlayer } from "@/components/lernzeit/AudioPlayer";

import subscribeImg  from "@/assets/vocab2-subscribe.jpg";
import postImg       from "@/assets/vocab2-post.jpg";
import switchOffImg  from "@/assets/vocab2-switch-off.jpg";
import switchOnImg   from "@/assets/vocab2-switch-on.jpg";
import buildUpImg    from "@/assets/vocab2-build-up.jpg";
import shutDownImg   from "@/assets/vocab2-shut-down.jpg";
import followImg     from "@/assets/vocab2-follow.jpg";
import vlogImg       from "@/assets/vocab2-vlog.jpg";
import commentOnImg  from "@/assets/vocab2-comment-on.jpg";
import deleteImg     from "@/assets/vocab2-delete.jpg";

const TRACK_86 = [{ label: "Audio 1", src: "/audio/8_06.mp3" }];

const ITEMS = [
  { id: "subscribe to", src: subscribeImg },
  { id: "post",         src: postImg },
  { id: "switch off",   src: switchOffImg },
  { id: "switch on",    src: switchOnImg },
  { id: "build up",     src: buildUpImg },
  { id: "shut down",    src: shutDownImg },
  { id: "follow",       src: followImg },
  { id: "vlog",         src: vlogImg },
  { id: "comment on",   src: commentOnImg },
  { id: "delete",       src: deleteImg },
];

const WORDS = [
  "subscribe to", "post", "switch off", "switch on", "build up",
  "shut down", "follow", "vlog", "comment on", "delete",
];

export const VocabImageMatch = ({ onProgress }: { onProgress?: (matched: number) => void }) => {
  const [matches, setMatches]       = useState<Record<string, string>>({});
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const handleWord = (word: string) => {
    if (!selectedImg) return;
    if (selectedImg === word) {
      setMatches((m) => {
        const next = { ...m, [selectedImg]: word };
        onProgress?.(Object.values(next).filter((v) => v !== "__wrong__").length);
        return next;
      });
    } else {
      setMatches((m) => ({ ...m, [selectedImg]: "__wrong__" }));
      setTimeout(
        () => setMatches((m) => { const c = { ...m }; delete c[selectedImg!]; return c; }),
        600,
      );
    }
    setSelectedImg(null);
  };

  const used = Object.entries(matches)
    .filter(([, v]) => v !== "__wrong__")
    .map(([, v]) => v);

  return (
    <div className="space-y-6">
      <AudioPlayer tracks={TRACK_86} />

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {ITEMS.map((it) => {
          const m       = matches[it.id];
          const correct = m && m !== "__wrong__";
          const wrong   = m === "__wrong__";
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
                  <div className="text-center text-cream px-1">
                    <Check className="w-5 h-5 mx-auto mb-1" />
                    <span className="font-sans text-[11px] tracking-wide font-semibold leading-tight">{it.id}</span>
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
              className={`pill ${
                isUsed
                  ? "bg-olive/20 text-olive/40 line-through"
                  : "bg-cream text-terracotta border border-terracotta/30 hover:bg-terracotta hover:text-cream"
              } transition-colors`}
            >
              {w}
            </button>
          );
        })}
      </div>

      <p className="subtle-note text-sm">
        {selectedImg
          ? `Pick the word for the highlighted image.`
          : `Listen to track 8.6, then tap an image and tap its matching word.`}
      </p>
    </div>
  );
};
