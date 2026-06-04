import { useState } from "react";
import { Check, X, ChevronRight, RotateCcw } from "lucide-react";

const QUESTIONS = [
  {
    q: 'What is a "digital footprint"?',
    options: [
      "A photo you post online",
      "All the information about you that exists online",
      "A type of browser extension",
    ],
    answer: 1,
    week: "Week 1",
  },
  {
    q: 'What does "to subscribe to" a channel mean?',
    options: [
      "To send a private message to the creator",
      "To delete your account",
      "To sign up to receive updates from a channel",
    ],
    answer: 2,
    week: "Week 2",
  },
  {
    q: 'What is a "vlog"?',
    options: [
      "A video diary or blog posted online",
      "A type of password",
      "A social media notification",
    ],
    answer: 0,
    week: "Week 2",
  },
  {
    q: "What does \"curated\" mean in the context of social media?",
    options: [
      "Randomly posted without thinking",
      "Carefully chosen and edited to look perfect",
      "Deleted permanently from the internet",
    ],
    answer: 1,
    week: "Week 5",
  },
  {
    q: '"In the foreground" of an image means…',
    options: [
      "The part of the image furthest from the camera",
      "The blurry out-of-focus area",
      "The part of the image closest to the camera",
    ],
    answer: 2,
    week: "Week 5",
  },
  {
    q: '"Validation" on social media means…',
    options: [
      "A type of password reset",
      "Approval or recognition received from others",
      "A legal agreement to use a platform",
    ],
    answer: 1,
    week: "Week 5",
  },
  {
    q: '"In addition" is used in essay writing to…',
    options: [
      "Contradict a previous point",
      "Conclude the essay",
      "Add another point or argument",
    ],
    answer: 2,
    week: "Week 4",
  },
  {
    q: "What does FOMO mean?",
    options: [
      "Fear of Missing Out — anxiety that others are having more fun",
      "A type of social media algorithm",
      "A popular hashtag used by influencers",
    ],
    answer: 0,
    week: "Week 2",
  },
  {
    q: "In a Type 3 conditional, which structure is correct?",
    options: [
      "If + present simple → will + infinitive",
      "If + past simple → would + infinitive",
      "If + past perfect → would have + past participle",
    ],
    answer: 2,
    week: "Week 3",
  },
  {
    q: "When posting online, what should you use instead of your real name?",
    options: [
      "Your full name and school",
      "A nickname",
      "Your email address",
    ],
    answer: 1,
    week: "Week 1",
  },
];

const LABELS = ["A", "B", "C"];

export const VocabQuiz = () => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  const q = QUESTIONS[current];
  const isLast = current === QUESTIONS.length - 1;

  const confirm = () => {
    if (selected === null) return;
    const correct = selected === q.answer;
    setConfirmed(true);
    setResults((prev) => [...prev, correct]);
  };

  const next = () => {
    if (isLast) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setConfirmed(false);
    }
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setConfirmed(false);
    setResults([]);
    setFinished(false);
  };

  const score = results.filter(Boolean).length;

  if (finished) {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    return (
      <div className="text-center py-6 space-y-4 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-olive/10 flex items-center justify-center mx-auto">
          <span className="font-serif text-2xl text-olive">{score}/{QUESTIONS.length}</span>
        </div>
        <h4 className="font-serif text-2xl text-olive">
          {pct >= 80 ? "Excellent!" : pct >= 60 ? "Good work!" : "Keep practising!"}
        </h4>
        <p className="font-sans text-sm text-olive/70">You scored {score} out of {QUESTIONS.length}.</p>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                results[i] ? "bg-olive text-cream" : "bg-terracotta/20 text-terracotta"
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <button
          onClick={restart}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-sage-2 text-olive font-sans text-sm font-semibold hover:bg-sage transition-colors mt-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-sage rounded-full overflow-hidden">
          <div
            className="h-full bg-olive rounded-full transition-all duration-300"
            style={{ width: `${(current / QUESTIONS.length) * 100}%` }}
          />
        </div>
        <p className="font-sans text-xs text-olive/60 flex-shrink-0">{current + 1}/{QUESTIONS.length}</p>
      </div>

      {/* Week badge */}
      <span className="pill pill-tier text-[10px]">{q.week}</span>

      {/* Question */}
      <p className="font-sans text-base font-semibold text-chocolate">{q.q}</p>

      {/* Options */}
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          const isCorrect = confirmed && i === q.answer;
          const isWrong = confirmed && selected === i && i !== q.answer;
          return (
            <button
              key={i}
              onClick={() => { if (!confirmed) setSelected(i); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border text-left transition-all ${
                isCorrect
                  ? "border-olive bg-olive/10"
                  : isWrong
                  ? "border-terracotta bg-terracotta/10"
                  : selected === i
                  ? "border-olive/60 bg-sage/40"
                  : "border-sage bg-cream hover:border-olive/30"
              } ${confirmed ? "cursor-default" : "cursor-pointer"}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                isCorrect
                  ? "bg-olive text-cream"
                  : isWrong
                  ? "bg-terracotta text-cream"
                  : selected === i
                  ? "bg-olive/20 text-olive"
                  : "bg-sage text-olive/60"
              }`}>
                {confirmed && isCorrect ? <Check className="w-3 h-3" /> :
                 confirmed && isWrong ? <X className="w-3 h-3" /> :
                 LABELS[i]}
              </span>
              <span className="font-sans text-sm text-chocolate">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Action */}
      {!confirmed ? (
        <button
          onClick={confirm}
          disabled={selected === null}
          className="px-6 py-2.5 rounded-full bg-olive text-cream font-sans text-sm font-semibold hover:bg-olive/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Confirm answer
        </button>
      ) : (
        <div className="flex items-center gap-4 animate-fade-in">
          <p className={`font-sans text-sm font-semibold ${selected === q.answer ? "text-olive" : "text-terracotta"}`}>
            {selected === q.answer ? "Correct!" : `The answer was: ${q.options[q.answer]}`}
          </p>
          <button
            onClick={next}
            className="ml-auto flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-olive text-cream font-sans text-sm font-semibold hover:bg-olive/90 transition-colors"
          >
            {isLast ? "See results" : "Next"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
