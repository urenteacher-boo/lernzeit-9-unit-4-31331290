import { useState, useMemo } from "react";
import { Mic, Hash } from "lucide-react";

const IMAGES = [
  {
    id: "a",
    src: "/images/speaking-a.jpg",
    alt: "Teenager at desk at 2:47 am surrounded by social media screens, homework untouched",
    title: "Image A",
    theme: "Screen time & FOMO",
  },
  {
    id: "b",
    src: "/images/speaking-b.jpg",
    alt: "Family staging a perfect picnic photo while teenager is on phone and toddler cries",
    title: "Image B",
    theme: "Staged perfection vs. reality",
  },
  {
    id: "c",
    src: "/images/speaking-c.jpg",
    alt: "Content creator looking anxious at phone showing 3 likes, camera and ring light behind her",
    title: "Image C",
    theme: "Online persona vs. real life",
  },
];

const SECTIONS = [
  {
    id: "overview",
    time: "0–15 sec",
    label: "General overview",
    instruction: "What is the image? Who or what can you see at first glance?",
    placeholder: "This image shows… / In this photograph, I can see…",
  },
  {
    id: "details",
    time: "15–30 sec",
    label: "Specific details",
    instruction: "Describe what you notice. Use foreground, background, left, right.",
    placeholder: "In the foreground… / In the background… / On the left / right…",
  },
  {
    id: "atmosphere",
    time: "30–45 sec",
    label: "Atmosphere & speculation",
    instruction: "What is the mood? What might the person be thinking or feeling?",
    placeholder: "The atmosphere is… / The person seems to be… / They might be…",
  },
  {
    id: "theme",
    time: "45–60 sec",
    label: "Theme & opinion",
    instruction: "Connect to Generation Like. Give your personal opinion.",
    placeholder: "This reminds me of Generation Like because… / In my opinion…",
  },
];

const LOCATION_RE =
  /\b(foreground|background|left|right|centre|center|top|bottom|behind|in front of|next to|beside)\b/i;
const SPECULATE_RE =
  /\b(might be|could be|seems to be|appears to be|seems|probably|I think|I believe|looks as if|it looks like)\b/i;
const THEME_RE =
  /\b(generation like|social media|likes|followers|online|screen|instagram|tiktok|youtube|validation|comparison|digital|influencer)\b/i;
const OPINION_RE =
  /\b(I think|in my opinion|I believe|what strikes me|what I find|personally|I feel|to me|for me)\b/i;

export const TalkBuilder = () => {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [sections, setSections] = useState<Record<string, string>>({});

  const fullText = Object.values(sections).join(" ");
  const wordCount = fullText.trim() ? fullText.trim().split(/\s+/).length : 0;

  const checks = useMemo(
    () => [
      {
        label: "Used location language (foreground, background, left, right…)",
        ok: LOCATION_RE.test(fullText),
      },
      {
        label: "Used speculation (might be, seems to be, could be, appears to be…)",
        ok: SPECULATE_RE.test(fullText),
      },
      {
        label: "Connected to Generation Like / social media theme",
        ok: THEME_RE.test(fullText),
      },
      {
        label: "Gave a personal opinion (I think, in my opinion…)",
        ok: OPINION_RE.test(fullText),
      },
      {
        label: `Approx. 1 minute when spoken (${wordCount} / 100+ words)`,
        ok: wordCount >= 100,
      },
    ],
    [fullText, wordCount]
  );

  const done = checks.filter((c) => c.ok).length;
  const img = IMAGES.find((i) => i.id === selectedImg);

  return (
    <div className="space-y-6">
      {/* Image choice */}
      <div>
        <p className="font-sans text-xs font-semibold text-olive/70 uppercase tracking-wide mb-3">
          Step A — Choose your image
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {IMAGES.map((im) => (
            <button
              key={im.id}
              onClick={() => setSelectedImg(im.id)}
              className={`text-left rounded-2xl overflow-hidden border-2 transition-all ${
                selectedImg === im.id
                  ? "border-olive shadow-md"
                  : "border-transparent hover:border-olive/30"
              }`}
            >
              <img
                src={im.src}
                alt={im.alt}
                className="w-full h-36 object-cover object-top"
              />
              <div className="p-3 bg-cream">
                <p className="font-sans text-xs font-semibold text-olive">{im.title}</p>
                <p className="font-sans text-[11px] text-olive/60 mt-0.5">{im.theme}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedImg && img && (
        <>
          {/* Selected image large */}
          <div className="rounded-2xl overflow-hidden border border-olive/10">
            <img
              src={img.src}
              alt={img.alt}
              className="w-full object-cover max-h-56 object-top"
            />
          </div>

          {/* Talk sections */}
          <div>
            <p className="font-sans text-xs font-semibold text-olive/70 uppercase tracking-wide mb-3">
              Step B — Write your 1-minute talk
            </p>

            <div className="grid md:grid-cols-[1fr_220px] gap-5 items-start">
              <div className="space-y-4">
                {SECTIONS.map((sec, i) => (
                  <div key={sec.id} className="bg-cream rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-5 h-5 rounded-full bg-terracotta/15 text-terracotta text-[11px] font-semibold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <p className="font-sans text-sm font-semibold text-chocolate">
                        {sec.label}
                      </p>
                      <span className="pill pill-tier ml-auto">{sec.time}</span>
                    </div>
                    <p className="font-sans text-[11px] text-olive/60 italic mb-2">
                      {sec.instruction}
                    </p>
                    <textarea
                      value={sections[sec.id] || ""}
                      onChange={(e) =>
                        setSections({ ...sections, [sec.id]: e.target.value })
                      }
                      rows={3}
                      placeholder={sec.placeholder}
                      className="w-full bg-sage/40 rounded-xl px-4 py-3 font-sans text-sm text-chocolate placeholder:text-olive/40 outline-none focus:ring-2 focus:ring-terracotta/60 resize-none"
                    />
                  </div>
                ))}

                {/* Word count bar */}
                <div className="flex items-center gap-3 px-1">
                  <Mic className="w-4 h-4 text-olive/60 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-1.5 bg-sage rounded-full overflow-hidden">
                      <div
                        className="h-full bg-olive rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (wordCount / 120) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <p className="font-sans text-xs text-olive/70 flex-shrink-0">
                    {wordCount} words
                  </p>
                </div>
              </div>

              {/* Live checklist — sticky */}
              <div className="bg-cream rounded-2xl p-5 space-y-3 sticky top-6">
                <div className="flex items-center gap-2 mb-1">
                  <Hash className="w-4 h-4 text-olive/60" />
                  <p className="font-sans text-xs font-semibold text-olive/70 uppercase tracking-wide">
                    Checklist
                  </p>
                </div>
                <p className="font-sans text-[11px] text-olive/50">{done}/5 complete</p>
                <div className="space-y-2.5">
                  {checks.map((c) => (
                    <div key={c.label} className="flex items-start gap-2">
                      <div
                        className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 transition-all ${
                          c.ok ? "bg-olive" : "bg-sage"
                        }`}
                      />
                      <p
                        className={`font-sans text-[11px] leading-snug transition-all ${
                          c.ok ? "text-olive" : "text-olive/50"
                        }`}
                      >
                        {c.label}
                      </p>
                    </div>
                  ))}
                </div>
                {done === 5 && (
                  <div className="bg-olive/10 border border-olive/20 rounded-xl px-3 py-2 mt-2 animate-fade-in">
                    <p className="font-sans text-xs font-semibold text-olive">
                      Ready to present!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
