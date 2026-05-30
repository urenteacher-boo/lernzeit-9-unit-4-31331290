import { useState } from "react";
import { Eye, ChevronDown } from "lucide-react";

const QUESTIONS = [
  {
    id: "overview",
    prompt: "1. General overview — who or what can you see?",
    hint: "Start with: 'This image shows…' or 'In this photograph, I can see…'",
    model:
      "This image shows a young teenager sitting at a desk, viewed from behind. They are surrounded by multiple screens showing social media platforms, including TikTok, Instagram, and YouTube.",
  },
  {
    id: "details",
    prompt: "2. Specific details — what do you notice when you look more carefully?",
    hint: "Look at the wall, the clock, the notebook. What do these details tell you?",
    model:
      "On the wall behind the person, there are printed photos with high like counts and sticky notes with phrases like 'KEEP GOING' and 'NEVER QUIT'. A digital clock at the top shows it is 2:47 in the morning. On the desk, an open notebook reads 'HOMEWORK DUE TOMORROW', and all the tasks are stamped 'UNTOUCHED'.",
  },
  {
    id: "location",
    prompt: "3. Location language — describe something using foreground, background, left, or right.",
    hint: "Use: 'In the foreground… / In the background… / On the left / right…'",
    model:
      "In the foreground, there is an open notebook with homework that has not been started. In the background, the wall is completely covered with social media content and motivational posters. On the right side of the image, there is a tablet showing a YouTube channel with high subscriber counts.",
  },
  {
    id: "speculation",
    prompt: "4. Speculation — what might this person be thinking or feeling?",
    hint: "Use: 'They might be… / The person seems to be… / It looks as if…'",
    model:
      "The person seems to be completely absorbed in their social media world. They might be monitoring their own accounts or comparing themselves to other content creators. It looks as if they are unable to stop scrolling, even at nearly three in the morning.",
  },
  {
    id: "mood",
    prompt: "5. Mood & atmosphere — how would you describe the atmosphere?",
    hint: "Use: 'The atmosphere is… / The image conveys… / There is a sense of…'",
    model:
      "The atmosphere is intense and slightly alarming. The image conveys a sense of obsession and exhaustion — the glow of multiple screens in a dark room creates a cold, artificial light. There is a sense of isolation despite all the digital connections surrounding the person.",
  },
  {
    id: "theme",
    prompt: "6. Connect to the theme — how does this image relate to 'Generation Like'?",
    hint: "Use: 'This reminds me of… / This image relates to… / It makes me think about…'",
    model:
      "This image powerfully represents the topic of Generation Like because it shows a young person who has sacrificed sleep and homework for the pursuit of online validation. The like counts visible on every screen suggest that this teenager measures their self-worth through social media numbers. It makes me think about how comparison culture can become an unhealthy obsession for young people today.",
  },
];

interface Props {
  imgSrc: string;
  imgAlt: string;
}

export const GuidedImageDesc = ({ imgSrc, imgAlt }: Props) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [modelOpen, setModelOpen] = useState(false);

  const allAnswered = QUESTIONS.every((q) => (answers[q.id] || "").trim().length > 0);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl overflow-hidden border border-olive/10">
        <img src={imgSrc} alt={imgAlt} className="w-full h-auto" />
      </div>

      <p className="subtle-note text-sm">
        Answer each question below. Use the vocabulary from Step 1 and the sentence starters from Step 2 to help you.
      </p>

      <div className="space-y-4">
        {QUESTIONS.map((q) => (
          <div key={q.id} className="bg-cream rounded-2xl p-4">
            <p className="font-sans text-sm font-semibold text-chocolate mb-1">{q.prompt}</p>
            <p className="font-sans text-[11px] text-olive/60 italic mb-2">{q.hint}</p>
            <textarea
              value={answers[q.id] || ""}
              onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
              rows={3}
              placeholder="Write your answer here…"
              className="w-full bg-sage/40 rounded-xl px-4 py-3 font-sans text-sm text-chocolate placeholder:text-olive/40 outline-none focus:ring-2 focus:ring-terracotta/60 resize-none"
            />
          </div>
        ))}
      </div>

      {allAnswered && (
        <div className="bg-olive/5 border border-olive/20 rounded-2xl p-5 animate-fade-in">
          <button
            onClick={() => setModelOpen(!modelOpen)}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-olive/60" />
              <p className="font-sans text-sm font-semibold text-olive">Compare with model answer</p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-olive/60 transition-transform ${modelOpen ? "rotate-180" : ""}`}
            />
          </button>

          {modelOpen && (
            <div className="mt-4 space-y-4 animate-fade-in">
              {QUESTIONS.map((q) => (
                <div key={q.id} className="border-l-2 border-olive/30 pl-4">
                  <p className="font-sans text-[11px] text-olive/50 uppercase tracking-wider mb-1">
                    {q.prompt.split("—")[0].trim()}
                  </p>
                  <p className="font-sans text-sm text-chocolate italic leading-relaxed">"{q.model}"</p>
                </div>
              ))}
              <div className="bg-cream rounded-xl px-4 py-4 mt-2">
                <p className="font-sans text-xs font-semibold text-olive mb-2">Full combined description:</p>
                <p className="font-sans text-sm text-chocolate leading-relaxed italic">
                  {QUESTIONS.map((q) => q.model).join(" ")}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
