import { useState } from "react";
import { ChevronRight } from "lucide-react";

const CATEGORIES = [
  {
    id: "location",
    label: "Location language",
    badge: "bg-olive/10 text-olive",
    tab: "bg-olive text-cream",
    words: [
      { phrase: "in the foreground", example: "In the foreground, there is a teenage boy staring at his phone." },
      { phrase: "in the background", example: "In the background, I can see a wall covered with social media screenshots." },
      { phrase: "on the left / right", example: "On the left, there is a ring light and a camera on a tripod." },
      { phrase: "in the centre", example: "In the centre of the image, a young person is sitting at a desk." },
      { phrase: "at the top / bottom", example: "At the top of the screen, a clock shows 2:47 in the morning." },
      { phrase: "next to / beside", example: "Next to the laptop, there is a notebook with homework due tomorrow." },
    ],
  },
  {
    id: "people",
    label: "Describing people",
    badge: "bg-terracotta/10 text-terracotta",
    tab: "bg-terracotta text-cream",
    words: [
      { phrase: "appears to be", example: "The person appears to be a teenager, probably around 15 or 16 years old." },
      { phrase: "is holding", example: "She is holding her phone and staring at the screen with a worried expression." },
      { phrase: "seems (to be)", example: "He seems completely absorbed in his social media feeds." },
      { phrase: "is looking at", example: "The mother is looking at her camera, directing the family for the perfect shot." },
      { phrase: "looks + adjective", example: "The girl looks anxious as she checks how many likes her post has received." },
      { phrase: "is wearing", example: "She is wearing a comfortable hoodie — very different from her polished profile photo." },
    ],
  },
  {
    id: "speculate",
    label: "Speculating",
    badge: "bg-sage text-olive",
    tab: "bg-chocolate text-cream",
    words: [
      { phrase: "might be", example: "This might be a typical evening for many young people today." },
      { phrase: "could be", example: "The teenager could be checking notifications instead of sleeping." },
      { phrase: "probably", example: "She has probably spent a long time setting up the perfect shot." },
      { phrase: "I think / I believe", example: "I think the person feels pressure to be constantly online." },
      { phrase: "it looks as if", example: "It looks as if the family is staging a perfect moment for social media." },
      { phrase: "must be", example: "The homework must be suffering — the page is completely untouched." },
    ],
  },
  {
    id: "mood",
    label: "Mood & atmosphere",
    badge: "bg-sand/60 text-chocolate",
    tab: "bg-sand text-chocolate",
    words: [
      { phrase: "the atmosphere is", example: "The atmosphere is tense — the clock shows nearly three in the morning." },
      { phrase: "the mood seems", example: "The mood seems ironic: the sign says 'Making Memories' but nobody is present." },
      { phrase: "the image conveys", example: "The image conveys a sense of isolation, even with all those screens glowing." },
      { phrase: "it makes me feel", example: "It makes me feel concerned about how much time young people spend online." },
      { phrase: "there is a sense of", example: "There is a sense of anxiety as she waits for likes to appear." },
      { phrase: "the overall tone", example: "The overall tone of the image is critical — it highlights a modern problem." },
    ],
  },
  {
    id: "theme",
    label: "Generation Like",
    badge: "bg-terracotta/10 text-terracotta",
    tab: "bg-terracotta text-cream",
    words: [
      { phrase: "validation", example: "Young people often seek validation from the number of likes they receive." },
      { phrase: "curated image", example: "The mother is creating a curated image of the perfect family for social media." },
      { phrase: "real vs. online life", example: "There is a clear gap between her online persona and her real emotional state." },
      { phrase: "screen time", example: "Excessive screen time is becoming a serious problem for Generation Like." },
      { phrase: "comparison culture", example: "Comparison culture pushes people to stage every moment for the camera." },
      { phrase: "digital footprint", example: "Every post they share adds to their digital footprint and online identity." },
    ],
  },
];

export const VocabToolkit = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [flipped, setFlipped] = useState<string | null>(null);

  const cat = CATEGORIES[activeTab];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c, i) => (
          <button
            key={c.id}
            onClick={() => { setActiveTab(i); setFlipped(null); }}
            className={`px-4 py-1.5 rounded-full font-sans text-xs font-semibold tracking-wide transition-all ${
              activeTab === i ? c.tab : "bg-sage-2 text-olive hover:bg-sage"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cat.words.map((w) => {
          const key = `${cat.id}-${w.phrase}`;
          const isFlipped = flipped === key;
          return (
            <button
              key={key}
              onClick={() => setFlipped(isFlipped ? null : key)}
              className={`text-left rounded-2xl border p-4 transition-all hover:shadow-sm ${
                isFlipped ? "bg-cream border-olive/20" : "bg-sage/30 border-sage"
              }`}
            >
              {isFlipped ? (
                <div className="animate-fade-in">
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-wider mb-2 text-olive/60">Example</p>
                  <p className="font-sans text-sm text-chocolate italic leading-relaxed">"{w.example}"</p>
                  <p className="font-sans text-[11px] text-olive/40 mt-2 flex items-center gap-1">
                    <ChevronRight className="w-3 h-3" />tap to close
                  </p>
                </div>
              ) : (
                <div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold mb-2 ${cat.badge}`}>
                    phrase
                  </span>
                  <p className="font-sans text-sm font-semibold text-chocolate">{w.phrase}</p>
                  <p className="font-sans text-[11px] text-olive/40 mt-1.5 flex items-center gap-1">
                    <ChevronRight className="w-3 h-3" />tap for example
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
