import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LernzeitSidebar } from "@/components/lernzeit/Sidebar";
import { StepHeader } from "@/components/lernzeit/StepHeader";
import { useUser } from "@/context/UserContext";
import { generateProgressPdf } from "@/lib/generatePdf";
import { FileDown, User, ChevronLeft, Check, ChevronDown, ChevronUp } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TOPIC DATA
// ─────────────────────────────────────────────────────────────────────────────

const TOPICS = [
  "Should social media be banned for children under 15?",
  "Should students use AI tools like ChatGPT for homework?",
  "Should schools start later?",
];

interface Argument { text: string; hint: string; correct: boolean; }
interface SentenceGuide {
  label: string;
  starter: string;
  placeholder: string;
  hint: string;
  example: string;
}
interface ParagraphGuide {
  title: string;
  goal: string;
  color: string;
  border: string;
  bg: string;
  sentences: SentenceGuide[];
}
interface TopicData {
  forArgs: Argument[];
  againstArgs: Argument[];
  paragraphs: ParagraphGuide[];
}

const TOPIC_DATA: TopicData[] = [
  // ── Topic 0: Social media banned under 15 ──────────────────────────────────
  {
    forArgs: [
      { text: "It protects children from cyberbullying and harmful content.", hint: "schützt vor Cybermobbing", correct: true },
      { text: "Children could use the extra time to learn the capitals of every country.", hint: "🚫 irrelevant — not a real reason to ban social media", correct: false },
      { text: "Children would spend more time on education and hobbies.", hint: "mehr Zeit für Schule und Hobbys", correct: true },
      { text: "Phone companies would have to design special phones for adults only.", hint: "🚫 not a benefit for children", correct: false },
      { text: "It could improve children's mental health and sleep.", hint: "bessere psychische Gesundheit", correct: true },
      { text: "Children would sleep exactly 12 hours every night without social media.", hint: "🚫 exaggerated and not realistic", correct: false },
    ],
    againstArgs: [
      { text: "It would be unfair, especially for 13- and 14-year-olds.", hint: "ungerecht für Ältere", correct: true },
      { text: "Without social media, children would forget how to read and write.", hint: "🚫 exaggerated and not true", correct: false },
      { text: "It would be very difficult to control or enforce.", hint: "schwer durchzusetzen", correct: true },
      { text: "A ban would make social media more exciting and desirable for adults.", hint: "🚫 irrelevant to children", correct: false },
      { text: "Children might lose contact with friends and miss important information.", hint: "Kontaktverlust zu Freunden", correct: true },
      { text: "Children use social media mainly to remind each other about homework.", hint: "🚫 not a real argument — too trivial", correct: false },
    ],
    paragraphs: [
      {
        title: "Paragraph 1 – Introduction",
        goal: "Introduce the topic and say there are two sides.",
        color: "text-blue-700", border: "border-blue-300", bg: "bg-blue-50",
        sentences: [
          { label: "Sentence 1 — Set the scene", starter: "Nowadays,", placeholder: "describe how social media is used by young people today…", hint: "Heutzutage…", example: "Nowadays, social media platforms are used by millions of children every day." },
          { label: "Sentence 2 — Present the FOR side", starter: "Some people think that", placeholder: "say why some support a ban…", hint: "Manche Menschen denken, dass…", example: "Some people think that banning social media could protect children from harmful content." },
          { label: "Sentence 3 — Present the AGAINST side", starter: "However, others argue that", placeholder: "say why others are against a ban…", hint: "Andere sind der Meinung, dass…", example: "However, others argue that a ban would be unfair and very difficult to enforce." },
          { label: "Sentence 4 — The question", starter: "So, should", placeholder: "write the topic as a question…", hint: "Also, sollte…?", example: "So, should social media be banned for children under 15?" },
        ],
      },
      {
        title: "Paragraph 2 – Arguments For",
        goal: "Give 2–3 reasons why a ban could be a good idea.",
        color: "text-green-700", border: "border-green-300", bg: "bg-green-50",
        sentences: [
          { label: "Sentence 1 — First argument", starter: "Firstly,", placeholder: "give your first reason FOR a ban…", hint: "Erstens,… (Erstens ist ein Vorteil, dass…)", example: "Firstly, a ban would protect children from cyberbullying and inappropriate content online." },
          { label: "Sentence 2 — Explain / example", starter: "This means that", placeholder: "explain why this is important…", hint: "Das bedeutet, dass…", example: "This means that children would be safer and less likely to be harmed by strangers." },
          { label: "Sentence 3 — Second argument", starter: "In addition,", placeholder: "give another reason FOR a ban…", hint: "Außerdem,…", example: "In addition, children would have more time for schoolwork, reading, and outdoor activities." },
        ],
      },
      {
        title: "Paragraph 3 – Arguments Against",
        goal: "Give 2–3 reasons why a ban might not be a good idea.",
        color: "text-red-700", border: "border-red-300", bg: "bg-red-50",
        sentences: [
          { label: "Sentence 1 — First counter-argument", starter: "However,", placeholder: "give your first reason AGAINST a ban…", hint: "Allerdings,… (Ein Nachteil ist, dass…)", example: "However, a complete ban would be very difficult to enforce, as children could use VPNs or other devices." },
          { label: "Sentence 2 — Explain / example", starter: "Furthermore,", placeholder: "add more detail or an example…", hint: "Außerdem / Darüber hinaus,…", example: "Furthermore, many teenagers use social media to stay in contact with friends and family." },
          { label: "Sentence 3 — Second counter-argument", starter: "On the other hand,", placeholder: "give another reason against…", hint: "Andererseits,…", example: "On the other hand, a ban could be seen as unfair to 13- and 14-year-olds who are almost adults." },
        ],
      },
      {
        title: "Paragraph 4 – Conclusion",
        goal: "Sum up both sides and give your own clear opinion.",
        color: "text-olive", border: "border-olive/40", bg: "bg-olive/5",
        sentences: [
          { label: "Sentence 1 — Sum up", starter: "To sum up,", placeholder: "briefly mention both sides…", hint: "Zusammenfassend,…", example: "To sum up, there are strong arguments both for and against banning social media for children." },
          { label: "Sentence 2 — Your opinion", starter: "In my opinion,", placeholder: "state what YOU think is best…", hint: "Meiner Meinung nach,…", example: "In my opinion, a complete ban is too extreme, but stricter rules and parental controls are needed." },
          { label: "Sentence 3 — Final statement", starter: "I believe that", placeholder: "end with a confident final thought…", hint: "Ich glaube, dass…", example: "I believe that educating children about online safety is more effective than a total ban." },
        ],
      },
    ],
  },

  // ── Topic 1: AI tools for homework ────────────────────────────────────────
  {
    forArgs: [
      { text: "AI can help students understand difficult topics more easily.", hint: "hilft beim Verstehen schwieriger Themen", correct: true },
      { text: "AI tools could also help students choose what to eat for breakfast.", hint: "🚫 irrelevant to homework or learning", correct: false },
      { text: "It saves time and allows students to focus on other tasks.", hint: "spart Zeit", correct: true },
      { text: "Students who use AI would automatically become software engineers.", hint: "🚫 exaggerated and not realistic", correct: false },
      { text: "Using AI teaches important digital skills for the future.", hint: "wichtige digitale Kompetenzen", correct: true },
      { text: "AI would help teachers mark homework faster so they can go home earlier.", hint: "🚫 off-topic — about teachers, not students", correct: false },
    ],
    againstArgs: [
      { text: "Students may copy AI answers without really learning.", hint: "könnten schummeln / abschreiben", correct: true },
      { text: "AI cannot answer questions about the weather in ancient Rome.", hint: "🚫 false and irrelevant", correct: false },
      { text: "AI is not always reliable and can give wrong information.", hint: "nicht immer zuverlässig", correct: true },
      { text: "Using AI for homework would make pencils completely unnecessary.", hint: "🚫 exaggerated and silly", correct: false },
      { text: "It is unfair to students who do not have access to AI.", hint: "ungerecht für benachteiligte Schüler", correct: true },
      { text: "AI tools only work in English, so German students cannot use them.", hint: "🚫 false — AI works in many languages", correct: false },
    ],
    paragraphs: [
      {
        title: "Paragraph 1 – Introduction",
        goal: "Introduce the topic and say there are two sides.",
        color: "text-blue-700", border: "border-blue-300", bg: "bg-blue-50",
        sentences: [
          { label: "Sentence 1 — Set the scene", starter: "Nowadays,", placeholder: "describe how AI tools are used by students today…", hint: "Heutzutage…", example: "Nowadays, AI tools like ChatGPT are used by millions of students around the world." },
          { label: "Sentence 2 — Present the FOR side", starter: "Some people think that", placeholder: "say why some support using AI for homework…", hint: "Manche Menschen denken, dass…", example: "Some people think that AI tools can help students learn more effectively and save time." },
          { label: "Sentence 3 — Present the AGAINST side", starter: "However, others argue that", placeholder: "say why others are against it…", hint: "Andere sind der Meinung, dass…", example: "However, others argue that using AI for homework is a form of cheating and prevents real learning." },
          { label: "Sentence 4 — The question", starter: "So, should", placeholder: "write the topic as a question…", hint: "Also, sollte…?", example: "So, should students be allowed to use AI tools like ChatGPT for their homework?" },
        ],
      },
      {
        title: "Paragraph 2 – Arguments For",
        goal: "Give 2–3 reasons why using AI for homework could be a good idea.",
        color: "text-green-700", border: "border-green-300", bg: "bg-green-50",
        sentences: [
          { label: "Sentence 1 — First argument", starter: "Firstly,", placeholder: "give your first reason FOR using AI…", hint: "Erstens,…", example: "Firstly, AI tools can explain difficult topics in a simple way, helping students understand their schoolwork better." },
          { label: "Sentence 2 — Explain / example", starter: "This means that", placeholder: "explain why this is a benefit…", hint: "Das bedeutet, dass…", example: "This means that students who struggle with certain subjects can get extra support at any time." },
          { label: "Sentence 3 — Second argument", starter: "In addition,", placeholder: "give another reason FOR using AI…", hint: "Außerdem,…", example: "In addition, learning to use AI tools is an important skill for future jobs and university studies." },
        ],
      },
      {
        title: "Paragraph 3 – Arguments Against",
        goal: "Give 2–3 reasons why using AI for homework might not be a good idea.",
        color: "text-red-700", border: "border-red-300", bg: "bg-red-50",
        sentences: [
          { label: "Sentence 1 — First counter-argument", starter: "However,", placeholder: "give your first reason AGAINST using AI…", hint: "Allerdings,…", example: "However, many students may simply copy the AI's answers without trying to understand the material themselves." },
          { label: "Sentence 2 — Explain / example", starter: "Furthermore,", placeholder: "add more detail or an example…", hint: "Außerdem / Darüber hinaus,…", example: "Furthermore, AI tools are not always accurate and can produce mistakes or misleading information." },
          { label: "Sentence 3 — Second counter-argument", starter: "On the other hand,", placeholder: "give another reason against…", hint: "Andererseits,…", example: "On the other hand, not all students have access to AI tools, which creates an unfair advantage." },
        ],
      },
      {
        title: "Paragraph 4 – Conclusion",
        goal: "Sum up both sides and give your own clear opinion.",
        color: "text-olive", border: "border-olive/40", bg: "bg-olive/5",
        sentences: [
          { label: "Sentence 1 — Sum up", starter: "To sum up,", placeholder: "briefly mention both sides…", hint: "Zusammenfassend,…", example: "To sum up, AI tools can be both helpful and harmful depending on how students use them." },
          { label: "Sentence 2 — Your opinion", starter: "In my opinion,", placeholder: "state what YOU think is the right approach…", hint: "Meiner Meinung nach,…", example: "In my opinion, students should be allowed to use AI as a learning aid, but not to replace their own thinking." },
          { label: "Sentence 3 — Final statement", starter: "I believe that", placeholder: "end with a confident final thought…", hint: "Ich glaube, dass…", example: "I believe that schools should teach students how to use AI responsibly rather than banning it completely." },
        ],
      },
    ],
  },

  // ── Topic 2: Schools start later ──────────────────────────────────────────
  {
    forArgs: [
      { text: "Teenagers would get more sleep and feel less tired during the day.", hint: "mehr Schlaf, weniger Müdigkeit", correct: true },
      { text: "Students would have more time to watch cartoons in the morning.", hint: "🚫 irrelevant — not a benefit of education", correct: false },
      { text: "Students would concentrate better in lessons and achieve better results.", hint: "bessere Konzentration und Leistungen", correct: true },
      { text: "Breakfast cereal companies would earn more money from bigger breakfasts.", hint: "🚫 irrelevant — not about school or students", correct: false },
      { text: "It could improve students' physical and mental health significantly.", hint: "bessere körperliche und geistige Gesundheit", correct: true },
      { text: "School buses could be used for shopping deliveries in the early morning.", hint: "🚫 ridiculous and unrelated", correct: false },
    ],
    againstArgs: [
      { text: "It would cause problems for parents who need to go to work early.", hint: "Probleme für berufstätige Eltern", correct: true },
      { text: "If school starts later, students would miss important morning news programmes.", hint: "🚫 not a serious argument", correct: false },
      { text: "After-school activities like sports would start very late.", hint: "Nachmittagsaktivitäten beginnen spät", correct: true },
      { text: "Mosquitoes would have more time to attack students at bus stops.", hint: "🚫 ridiculous — not relevant", correct: false },
      { text: "It may be difficult to reorganise school transport and timetables.", hint: "logistische Probleme mit Schulbussen", correct: true },
      { text: "Students would need to buy more expensive alarm clocks to wake up later.", hint: "🚫 trivial and not a real concern", correct: false },
    ],
    paragraphs: [
      {
        title: "Paragraph 1 – Introduction",
        goal: "Introduce the topic and say there are two sides.",
        color: "text-blue-700", border: "border-blue-300", bg: "bg-blue-50",
        sentences: [
          { label: "Sentence 1 — Set the scene", starter: "Nowadays,", placeholder: "describe the current situation with school start times…", hint: "Heutzutage…", example: "Nowadays, most schools start very early in the morning, often before 8 o'clock." },
          { label: "Sentence 2 — Present the FOR side", starter: "Some people think that", placeholder: "say why some support a later start…", hint: "Manche Menschen denken, dass…", example: "Some people think that starting school later would allow teenagers to get enough sleep and focus better." },
          { label: "Sentence 3 — Present the AGAINST side", starter: "However, others argue that", placeholder: "say why others are against a later start…", hint: "Andere sind der Meinung, dass…", example: "However, others argue that later school hours would cause problems for working parents and daily routines." },
          { label: "Sentence 4 — The question", starter: "So, should", placeholder: "write the topic as a question…", hint: "Also, sollte…?", example: "So, should schools start later to help teenagers sleep more and learn better?" },
        ],
      },
      {
        title: "Paragraph 2 – Arguments For",
        goal: "Give 2–3 reasons why starting school later could be a good idea.",
        color: "text-green-700", border: "border-green-300", bg: "bg-green-50",
        sentences: [
          { label: "Sentence 1 — First argument", starter: "Firstly,", placeholder: "give your first reason FOR a later start…", hint: "Erstens,…", example: "Firstly, research shows that teenagers need at least eight to nine hours of sleep to function well." },
          { label: "Sentence 2 — Explain / example", starter: "This means that", placeholder: "explain why this is important…", hint: "Das bedeutet, dass…", example: "This means that a later start would allow students to arrive at school more rested and ready to learn." },
          { label: "Sentence 3 — Second argument", starter: "In addition,", placeholder: "give another reason FOR starting later…", hint: "Außerdem,…", example: "In addition, studies have found that students who get enough sleep tend to get better grades and have better mental health." },
        ],
      },
      {
        title: "Paragraph 3 – Arguments Against",
        goal: "Give 2–3 reasons why a later start might not be a good idea.",
        color: "text-red-700", border: "border-red-300", bg: "bg-red-50",
        sentences: [
          { label: "Sentence 1 — First counter-argument", starter: "However,", placeholder: "give your first reason AGAINST a later start…", hint: "Allerdings,…", example: "However, a later school start would be very inconvenient for many parents who need to be at work early in the morning." },
          { label: "Sentence 2 — Explain / example", starter: "Furthermore,", placeholder: "add more detail or an example…", hint: "Außerdem / Darüber hinaus,…", example: "Furthermore, after-school sports clubs and other activities would have to start much later, affecting many students." },
          { label: "Sentence 3 — Second counter-argument", starter: "On the other hand,", placeholder: "give another reason against…", hint: "Andererseits,…", example: "On the other hand, changing school hours would require completely new timetables and school bus schedules." },
        ],
      },
      {
        title: "Paragraph 4 – Conclusion",
        goal: "Sum up both sides and give your own clear opinion.",
        color: "text-olive", border: "border-olive/40", bg: "bg-olive/5",
        sentences: [
          { label: "Sentence 1 — Sum up", starter: "To sum up,", placeholder: "briefly mention both sides…", hint: "Zusammenfassend,…", example: "To sum up, there are good reasons both for and against making school start times later." },
          { label: "Sentence 2 — Your opinion", starter: "In my opinion,", placeholder: "state what YOU think is best…", hint: "Meiner Meinung nach,…", example: "In my opinion, the benefits of later school hours outweigh the disadvantages, especially for teenagers' health." },
          { label: "Sentence 3 — Final statement", starter: "I believe that", placeholder: "end with a confident final thought…", hint: "Ich glaube, dass…", example: "I believe that schools should seriously consider moving their start times to at least 9 o'clock." },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE COMPONENTS (all defined outside main to prevent remount bugs)
// ─────────────────────────────────────────────────────────────────────────────

// ── NameGate ──────────────────────────────────────────────────────────────────
const NameGate = ({ onEnter }: { onEnter: (name: string) => void }) => {
  const [draft, setDraft] = useState("");
  const submit = () => { if (draft.trim()) onEnter(draft.trim()); };
  return (
    <div className="min-h-screen flex items-center justify-center bg-sage">
      <div className="focus-card w-full max-w-md mx-4 text-center">
        <div className="w-14 h-14 rounded-full bg-terracotta/15 flex items-center justify-center mx-auto mb-5">
          <User className="w-7 h-7 text-terracotta" />
        </div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-olive/50 mb-1">Week 4 · Vocab & Writing</p>
        <h2 className="font-serif text-3xl text-olive mb-2 leading-tight">Welcome to Lernzeit</h2>
        <p className="subtle-note text-sm mb-7">Enter your name so we can personalise your progress report.</p>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Your full name…"
          autoFocus
          className="w-full bg-sage/50 rounded-2xl px-5 py-3.5 font-sans text-sm text-chocolate placeholder:text-olive/40 outline-none focus:ring-2 focus:ring-terracotta/60 mb-4 text-center"
        />
        <button onClick={submit} disabled={!draft.trim()}
          className="w-full py-3.5 rounded-2xl bg-olive text-cream font-sans font-semibold text-sm tracking-wide hover:bg-olive/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          Start writing →
        </button>
      </div>
    </div>
  );
};

// ── VocabReferenceCard ────────────────────────────────────────────────────────
const VocabReferenceCard = () => {
  const sections = [
    { border: "border-blue-400", bg: "bg-blue-50", label: "Introduction", pairs: [["topic","Thema"],["opinion","Meinung"],["discussion","Erörterung"],['"Nowadays, …"',"Heutzutage…"],['"Many people think that…"',"Viele Menschen denken…"]] },
    { border: "border-green-400", bg: "bg-green-50", label: "Arguments FOR", pairs: [["advantage","Vorteil"],["useful","nützlich"],['"Firstly,…"',"Erstens…"],['"Another advantage is…"',"Ein weiterer Vorteil ist…"],['"In addition,…"',"Außerdem…"]] },
    { border: "border-red-400", bg: "bg-red-50", label: "Arguments AGAINST", pairs: [["disadvantage","Nachteil"],["problem","Problem"],['"However,…"',"Allerdings…"],['"On the other hand,…"',"Andererseits…"],['"Another disadvantage is…"',"Ein weiterer Nachteil ist…"]] },
    { border: "border-orange-400", bg: "bg-orange-50", label: "Your Opinion", pairs:[['"In my opinion,…"',"Meiner Meinung nach…"],['"I believe that…"',"Ich glaube, dass…"],['"I think that…"',"Ich denke, dass…"]] },
    { border: "border-gray-400", bg: "bg-gray-50", label: "Conclusion", pairs:[['"To sum up,…"',"Zusammenfassend…"],['"In conclusion,…"',"Abschließend…"],['"All in all,…"',"Alles in allem…"]] },
  ];
  return (
    <div className="space-y-2">
      {sections.map((sec) => (
        <div key={sec.label} className={`border-l-4 ${sec.border} ${sec.bg} rounded-r-2xl pl-4 pr-4 py-2.5`}>
          <p className="font-sans text-[11px] font-bold text-chocolate mb-1.5 uppercase tracking-wide">{sec.label}</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
            {sec.pairs.map(([en, de]) => (
              <div key={en} className="contents">
                <span className="font-sans text-xs text-chocolate/80 italic">{en}</span>
                <span className="font-sans text-xs text-olive font-semibold">{de}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// ── WordMatch4 ────────────────────────────────────────────────────────────────
const WORD_MATCH_ITEMS = [
  { id: "wm1", english: "distraction", answer: "Ablenkung" },
  { id: "wm2", english: "research",    answer: "recherchieren" },
  { id: "wm3", english: "opinion",     answer: "Meinung" },
  { id: "wm4", english: "rule",        answer: "Regel" },
];
const WORD_MATCH_OPTIONS = ["—", "Ablenkung", "recherchieren", "Meinung", "Regel"];

const WordMatch4 = ({ sel, onChange, checked, onCheck }: {
  sel: Record<string, string>;
  onChange: (id: string, val: string) => void;
  checked: boolean;
  onCheck: () => void;
}) => {
  const score = checked ? WORD_MATCH_ITEMS.filter((i) => sel[i.id] === i.answer).length : 0;
  const allFilled = WORD_MATCH_ITEMS.every((i) => sel[i.id] && sel[i.id] !== "—");
  return (
    <div className="space-y-4">
      <p className="subtle-note text-sm">Choose the correct German translation for each word.</p>
      <div className="space-y-2">
        {WORD_MATCH_ITEMS.map((item) => {
          const ok = checked ? sel[item.id] === item.answer : null;
          return (
            <div key={item.id} className={`flex items-center gap-4 rounded-2xl px-5 py-3 border transition-all ${ok === true ? "bg-olive/8 border-olive/30" : ok === false ? "bg-red-50 border-red-200" : "bg-cream border-transparent"}`}>
              <span className="font-sans text-sm font-semibold text-chocolate flex-1 italic">{item.english}</span>
              <select value={sel[item.id] || "—"} disabled={checked} onChange={(e) => onChange(item.id, e.target.value)}
                className={`border rounded-xl px-3 py-1.5 font-sans text-sm outline-none focus:ring-2 focus:ring-terracotta/60 transition-colors ${ok === true ? "border-olive/60 bg-olive/10 text-olive" : ok === false ? "border-red-300 bg-red-50 text-red-700" : "border-sage bg-white text-chocolate"}`}>
                {WORD_MATCH_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              {checked && (ok ? <span className="text-olive text-xs font-bold w-10">✓</span> : <span className="text-terracotta text-xs w-28">→ {item.answer}</span>)}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onCheck} disabled={!allFilled || checked}
          className="px-5 py-2.5 rounded-full bg-olive text-cream font-sans font-semibold text-sm hover:bg-olive/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          Check answers
        </button>
        {checked && <span className={`font-sans text-sm font-semibold ${score === 4 ? "text-olive" : "text-terracotta"}`}>{score} / 4{score === 4 ? " — Perfect!" : ""}</span>}
      </div>
    </div>
  );
};

// ── TopicPicker ───────────────────────────────────────────────────────────────
const TopicPicker = ({ selected, onChange }: { selected: number | null; onChange: (i: number) => void }) => (
  <div className="space-y-3">
    <p className="subtle-note text-sm">Choose one topic. All tasks in Steps 2, 3 and 4 will be based on your choice.</p>
    {TOPICS.map((topic, idx) => {
      const isSelected = selected === idx;
      return (
        <label key={idx} className={`flex items-start gap-3 rounded-2xl px-5 py-4 cursor-pointer border transition-all ${isSelected ? "bg-olive/10 border-olive/40" : "bg-cream border-transparent hover:bg-sage/50"}`}>
          <input type="radio" name="topic-picker" checked={isSelected} onChange={() => onChange(idx)} className="accent-olive mt-0.5 flex-shrink-0" />
          <span className="font-sans text-sm text-chocolate flex-1">{topic}</span>
          {isSelected && <span className="ml-auto font-sans text-xs font-semibold text-olive flex-shrink-0">Selected ✓</span>}
        </label>
      );
    })}
  </div>
);

// ── ArgumentCheckboxes ────────────────────────────────────────────────────────
const ArgumentCheckboxes = ({ args, checked, onChange, color, isChecked, onCheck }: {
  args: Argument[];
  checked: Record<number, boolean>;
  onChange: (idx: number, val: boolean) => void;
  color: "green" | "red";
  isChecked: boolean;
  onCheck: () => void;
}) => {
  const score = isChecked
    ? args.filter((a, i) => a.correct === !!checked[i]).length
    : 0;
  const perfect = score === args.length;

  return (
    <div className="space-y-2">
      <p className="font-sans text-[11px] text-olive/60 italic mb-1">
        Tick the <strong>3 suitable arguments</strong> — ignore the absurd ones.
      </p>
      {args.map((arg, idx) => {
        const ticked   = !!checked[idx];
        const wasRight = isChecked && arg.correct === ticked;
        const wasWrong = isChecked && arg.correct !== ticked;

        let rowClass = "bg-cream border-transparent hover:bg-sage/40";
        if (isChecked && arg.correct && ticked)  rowClass = "bg-green-50 border-green-300";
        if (isChecked && arg.correct && !ticked) rowClass = "bg-amber-50 border-amber-300";
        if (isChecked && !arg.correct && ticked) rowClass = "bg-red-50 border-red-300";
        if (isChecked && !arg.correct && !ticked) rowClass = "bg-cream border-transparent";

        return (
          <label key={idx} className={`flex items-start gap-3 rounded-xl px-4 py-2.5 cursor-pointer border transition-all ${isChecked ? "cursor-default" : "cursor-pointer"} ${rowClass}`}>
            <input type="checkbox" checked={ticked} disabled={isChecked}
              onChange={(e) => onChange(idx, e.target.checked)}
              className={`${color === "green" ? "accent-green-600" : "accent-red-600"} mt-0.5 flex-shrink-0`} />
            <div className="flex-1">
              <p className="font-sans text-sm text-chocolate">{arg.text}</p>
              {!isChecked && (
                <p className="font-sans text-[11px] text-olive/50 italic mt-0.5">{arg.correct ? arg.hint : "🤔 Is this really relevant?"}</p>
              )}
              {isChecked && (
                <p className={`font-sans text-[11px] font-semibold mt-0.5 ${arg.correct && ticked ? "text-green-700" : arg.correct && !ticked ? "text-amber-700" : !arg.correct && ticked ? "text-red-600" : "text-olive/50"}`}>
                  {arg.correct && ticked  ? "✓ Correct — this is a suitable argument." : ""}
                  {arg.correct && !ticked ? "⚠ You missed this one — it is a suitable argument." : ""}
                  {!arg.correct && ticked ? "✗ Absurd! This argument is not suitable." : ""}
                  {!arg.correct && !ticked ? "✓ Good — you correctly ignored this absurd argument." : ""}
                </p>
              )}
            </div>
          </label>
        );
      })}

      {!isChecked && (
        <button onClick={onCheck}
          className="mt-2 px-5 py-2.5 rounded-full bg-olive text-cream font-sans font-semibold text-sm hover:bg-olive/90 transition-colors">
          Check my choices
        </button>
      )}
      {isChecked && (
        <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border animate-fade-in ${perfect ? "bg-olive/10 border-olive/30" : "bg-amber-50 border-amber-200"}`}>
          <p className={`font-sans text-sm font-semibold ${perfect ? "text-olive" : "text-amber-700"}`}>
            {score} / {args.length} correct{perfect ? " — Perfect!" : " — review the highlighted ones."}
          </p>
        </div>
      )}
    </div>
  );
};

// ── StarterMatch ───────────────────────────────────────────────────────────────
const STARTER_ITEMS = [
  { id: "sm1", starter: '"Firstly, …"',          answer: "b" },
  { id: "sm2", starter: '"However, …"',           answer: "c" },
  { id: "sm3", starter: '"On the other hand, …"', answer: "d" },
  { id: "sm4", starter: '"To sum up, …"',          answer: "a" },
];
const STARTER_FUNCS: Record<string, string> = { a: "a) conclusion", b: "b) first argument", c: "c) opposite argument", d: "d) second side" };

const StarterMatch = ({ sel, onChange, checked, onCheck }: {
  sel: Record<string, string>; onChange: (id: string, v: string) => void; checked: boolean; onCheck: () => void;
}) => {
  const score = checked ? STARTER_ITEMS.filter((i) => sel[i.id] === i.answer).length : 0;
  const allFilled = STARTER_ITEMS.every((i) => sel[i.id] && sel[i.id] !== "—");
  return (
    <div className="space-y-4">
      <div className="bg-cream rounded-2xl px-5 py-3 grid grid-cols-2 gap-x-6 gap-y-1">
        {Object.entries(STARTER_FUNCS).map(([k, v]) => <span key={k} className="font-sans text-xs text-chocolate">{v}</span>)}
      </div>
      <div className="space-y-2">
        {STARTER_ITEMS.map((item) => {
          const ok = checked ? sel[item.id] === item.answer : null;
          return (
            <div key={item.id} className={`flex items-center gap-4 rounded-2xl px-5 py-3 border ${ok === true ? "bg-olive/8 border-olive/30" : ok === false ? "bg-red-50 border-red-200" : "bg-cream border-transparent"}`}>
              <span className="font-sans text-sm text-chocolate italic flex-1">{item.starter}</span>
              <select value={sel[item.id] || "—"} disabled={checked} onChange={(e) => onChange(item.id, e.target.value)}
                className={`border rounded-xl px-3 py-1.5 font-sans text-sm outline-none focus:ring-2 focus:ring-terracotta/60 ${ok === true ? "border-olive/60 bg-olive/10 text-olive" : ok === false ? "border-red-300 text-red-700" : "border-sage bg-white text-chocolate"}`}>
                <option value="—">—</option>
                {["a","b","c","d"].map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              {checked && (ok ? <span className="text-olive text-xs font-bold w-6">✓</span> : <span className="text-terracotta text-xs w-10">→ {item.answer}</span>)}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onCheck} disabled={!allFilled || checked}
          className="px-5 py-2.5 rounded-full bg-olive text-cream font-sans font-semibold text-sm hover:bg-olive/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          Check answers
        </button>
        {checked && <span className={`font-sans text-sm font-semibold ${score === 4 ? "text-olive" : "text-terracotta"}`}>{score} / 4{score === 4 ? " — Perfect!" : ""}</span>}
      </div>
    </div>
  );
};

// ── ParagraphBuilder — detailed sentence-by-sentence builder ──────────────────
const SentenceInput = ({ guide, value, onChange }: {
  guide: SentenceGuide;
  value: string;
  onChange: (v: string) => void;
}) => {
  const [showExample, setShowExample] = useState(false);
  return (
    <div className="rounded-2xl border border-sage bg-cream p-4 space-y-2">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="font-sans text-[11px] font-bold text-olive uppercase tracking-wide">{guide.label}</p>
        <button onClick={() => setShowExample(!showExample)}
          className="flex items-center gap-1 font-sans text-[11px] text-terracotta hover:text-terracotta/70 transition-colors">
          {showExample ? <><ChevronUp className="w-3 h-3" />Hide example</> : <><ChevronDown className="w-3 h-3" />Show example</>}
        </button>
      </div>
      {showExample && (
        <div className="bg-terracotta/8 border border-terracotta/20 rounded-xl px-3 py-2 animate-fade-in">
          <p className="font-sans text-xs text-chocolate italic">{guide.example}</p>
        </div>
      )}
      <div className="flex items-start gap-2">
        <span className="font-sans text-sm font-semibold text-terracotta flex-shrink-0 pt-2.5">{guide.starter}</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={guide.placeholder}
          className="flex-1 bg-sage/40 rounded-xl px-3 py-2.5 font-sans text-sm text-chocolate placeholder:text-olive/40 outline-none focus:ring-2 focus:ring-terracotta/60"
        />
      </div>
      <p className="font-sans text-[11px] text-olive/60 italic pl-1">🇩🇪 {guide.hint}</p>
    </div>
  );
};

const ParagraphSection = ({ para, values, onChange }: {
  para: ParagraphGuide;
  values: Record<string, string>;
  onChange: (key: string, v: string) => void;
}) => (
  <div className={`rounded-2xl border-2 ${para.border} ${para.bg} p-5 space-y-3`}>
    <div className="mb-1">
      <h5 className={`font-serif text-lg ${para.color} font-semibold`}>{para.title}</h5>
      <p className="font-sans text-xs text-chocolate/70 mt-0.5 italic">Goal: {para.goal}</p>
    </div>
    {para.sentences.map((s, i) => (
      <SentenceInput
        key={i}
        guide={s}
        value={values[`${para.title}-${i}`] || ""}
        onChange={(v) => onChange(`${para.title}-${i}`, v)}
      />
    ))}
  </div>
);

// ── EssayEditor ───────────────────────────────────────────────────────────────
const EssayEditor = ({ value, onChange, topic }: { value: string; onChange: (v: string) => void; topic?: string }) => {
  const wordCount = value.trim() === "" ? 0 : value.trim().split(/\s+/).filter(Boolean).length;
  const colorClass = wordCount < 80 ? "text-red-600" : wordCount < 120 ? "text-amber-600" : wordCount <= 150 ? "text-olive" : "text-orange-600";
  const barClass   = wordCount < 80 ? "bg-red-400"  : wordCount < 120 ? "bg-amber-400"  : wordCount <= 150 ? "bg-olive"  : "bg-orange-500";
  const message    = wordCount < 80 ? "Keep going…" : wordCount < 120 ? "Almost there!" : wordCount <= 150 ? "Target reached!" : "Over the limit — try to trim a little.";
  const barWidth   = Math.min((wordCount / 150) * 100, 100);
  return (
    <div className="space-y-3">
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={14}
        placeholder={topic ? `Write your written discussion about: "${topic}" (120–150 words)…` : "Write your written discussion here (120–150 words)…"}
        className="w-full bg-sage/40 rounded-xl px-4 py-3 font-sans text-sm text-chocolate placeholder:text-olive/40 outline-none focus:ring-2 focus:ring-terracotta/60 resize-none" />
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className={`font-sans text-sm font-semibold ${colorClass}`}>{wordCount} words</span>
          <span className={`font-sans text-xs ${colorClass}`}>{message}</span>
        </div>
        <div className="w-full h-2 bg-sage rounded-full overflow-hidden">
          <div className={`h-2 rounded-full transition-all duration-300 ${barClass}`} style={{ width: `${barWidth}%` }} />
        </div>
        <p className="font-sans text-[11px] text-olive/50">Target: 120–150 words</p>
      </div>
    </div>
  );
};

// ── SelfCheckList ─────────────────────────────────────────────────────────────
const SELF_CHECK = ["I wrote 4 paragraphs.", "I gave arguments for and against.", "I used linking words.", "I wrote my opinion.", "I checked spelling.", "My written discussion has about 120–150 words."];
const SelfCheckList = () => {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const total = Object.values(checked).filter(Boolean).length;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <p className="subtle-note text-sm">Tick each item once completed.</p>
        <span className={`font-sans text-sm font-semibold ${total === 6 ? "text-olive" : "text-terracotta"}`}>{total} / 6</span>
      </div>
      {SELF_CHECK.map((item, idx) => (
        <label key={idx} className={`flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer border transition-all ${checked[idx] ? "bg-olive/10 border-olive/40" : "bg-cream border-transparent hover:bg-sage/40"}`}>
          <span className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${checked[idx] ? "bg-olive border-olive" : "border-sage-2 bg-white"}`}>
            {checked[idx] && <Check className="w-3 h-3 text-cream" strokeWidth={3} />}
          </span>
          <input type="checkbox" checked={!!checked[idx]} onChange={(e) => setChecked((p) => ({ ...p, [idx]: e.target.checked }))} className="sr-only" />
          <span className={`font-sans text-sm ${checked[idx] ? "text-olive font-semibold" : "text-chocolate"}`}>{item}</span>
        </label>
      ))}
      {total === 6 && <div className="bg-olive/10 border border-olive/20 rounded-xl px-4 py-3 animate-fade-in"><p className="font-sans text-sm font-semibold text-olive">All items checked — great work!</p></div>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

const Week4Writing = () => {
  const { week4Name, setWeek4Name } = useUser();
  const navigate = useNavigate();

  // Step 1
  const [wordSel, setWordSel]         = useState<Record<string, string>>({});
  const [wordChecked, setWordChecked] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  // Step 2
  const [forTicked, setForTicked]               = useState<Record<number, boolean>>({});
  const [againstTicked, setAgainstTicked]       = useState<Record<number, boolean>>({});
  const [forArgChecked, setForArgChecked]       = useState(false);
  const [againstArgChecked, setAgainstArgChecked] = useState(false);
  const [starterSel, setStarterSel]         = useState<Record<string, string>>({});
  const [starterChecked, setStarterChecked] = useState(false);
  const [step2Sentences, setStep2Sentences] = useState<Record<string, string>>({});

  // Step 3
  const [paraValues, setParaValues] = useState<Record<string, string>>({});

  // Step 4
  const [essay, setEssay] = useState("");

  const topic = selectedTopic !== null ? TOPIC_DATA[selectedTopic] : null;
  const topicLabel = selectedTopic !== null ? TOPICS[selectedTopic] : null;

  const handleParaChange = (key: string, val: string) =>
    setParaValues((p) => ({ ...p, [key]: val }));

  const hasAnyProgress =
    Object.keys(wordSel).length > 0 ||
    selectedTopic !== null ||
    Object.values(forTicked).some(Boolean) ||
    Object.values(againstTicked).some(Boolean) ||
    Object.values(starterSel).length > 0 ||
    Object.values(step2Sentences).some((v) => v?.trim()) ||
    Object.values(paraValues).some((v) => v?.trim()) ||
    essay.trim().length > 0;

  const essayWordCount = essay.trim() ? essay.trim().split(/\s+/).filter(Boolean).length : 0;

  const handleDownloadPdf = () => {
    generateProgressPdf(
      week4Name,
      [],
      {
        weekLabel: "WEEK 4 VOCAB & WRITING",
        pageTitle: "Vocabulary & Writing",
        step1SectionTitle: "Steps 1–4 · Progress Summary",
        answersTitle: "Written Work",
        filenameWeek: "Week4",
        activities: [
          { badge: "Task 1 - Word Match", lines: [`Matched: ${Object.keys(wordSel).length} / 4${wordChecked ? " - Checked" : ""}`] },
          { badge: "Task 2 - Topic Choice", lines: [topicLabel ?? "No topic selected"] },
          { badge: "Step 2 - Ideas", lines: [`FOR: ${Object.values(forTicked).filter(Boolean).length} / 3  -  AGAINST: ${Object.values(againstTicked).filter(Boolean).length} / 3`] },
          { badge: "Step 3 - Paragraphs", lines: [`Sentences filled: ${Object.values(paraValues).filter((v) => v?.trim()).length}`] },
          { badge: "Step 4 - Written Discussion", lines: [`Word count: ${essayWordCount} / 150 target`, essay.trim() ? essay.trim().slice(0, 80) + "..." : "Not started yet."] },
        ],
      }
    );
  };

  if (!week4Name) return <NameGate onEnter={setWeek4Name} />;

  return (
    <div className="min-h-screen flex">
      <LernzeitSidebar />
      <main className="flex-1 ml-60 min-h-screen">
        <div className="p-8 lg:p-12 max-w-5xl mx-auto">

          <div className="mb-6">
            <button onClick={() => navigate("/")} className="text-xs text-olive/60 hover:text-olive flex items-center gap-1 transition-colors">
              <ChevronLeft className="w-3 h-3" /> Overview
            </button>
          </div>

          <header className="mb-10 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <span className="pill pill-tier">Week 4</span>
              <span className="pill pill-xp">Vocab &amp; Writing · 80 XP</span>
            </div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-serif text-5xl md:text-6xl text-olive leading-tight tracking-tight">Vocabulary &amp; Writing</h1>
                <p className="subtle-note text-lg mt-3 max-w-2xl">
                  Build your vocabulary, plan your arguments, and write a complete written discussion.
                </p>
              </div>
              <p className="text-[11px] tracking-[0.18em] uppercase text-olive/60 mt-1">
                Logged in as <span className="text-olive font-semibold">{week4Name}</span>
              </p>
            </div>
          </header>

          {/* ══ STEP 1 · SPARK ══ */}
          <section className="mb-14">
            <StepHeader step={1} tier="Spark" title="Understand the Topic" xp={20} />
            <div className="space-y-6">

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-4">Vocabulary Reference Card</h4>
                <VocabReferenceCard />
              </div>

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">Task 1 · Match the Words</h4>
                <p className="subtle-note text-sm mb-5">Match each English word to its German translation.</p>
                <WordMatch4 sel={wordSel} onChange={(id, v) => { setWordSel((p) => ({ ...p, [id]: v })); setWordChecked(false); }} checked={wordChecked} onCheck={() => setWordChecked(true)} />
              </div>

              <div className="focus-card">
                <h4 className="font-serif text-xl text-olive mb-1">Task 2 · Choose Your Topic</h4>
                <TopicPicker selected={selectedTopic} onChange={(i) => { setSelectedTopic(i); setForTicked({}); setAgainstTicked({}); setForArgChecked(false); setAgainstArgChecked(false); setParaValues({}); setEssay(""); }} />
                {selectedTopic !== null && (
                  <div className="mt-5 flex items-center gap-3 bg-olive/10 border border-olive/20 rounded-2xl px-5 py-3 animate-fade-in">
                    <Check className="w-4 h-4 text-olive flex-shrink-0" />
                    <p className="font-sans text-sm text-olive font-semibold">Topic chosen — Steps 2, 3 and 4 are now ready below.</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ══ STEPS 2–4: only show after topic is chosen ══ */}
          {topic && topicLabel && (
            <>
              {/* ══ STEP 2 · BUILD ══ */}
              <section className="mb-14">
                <StepHeader step={2} tier="Build" title="Plan Your Arguments" xp={20} />
                <div className="space-y-6">

                  {/* Topic banner */}
                  <div className="flex items-start gap-3 bg-terracotta/10 border border-terracotta/20 rounded-2xl px-5 py-3">
                    <p className="font-sans text-xs font-bold text-terracotta uppercase tracking-wide flex-shrink-0 mt-0.5">Your topic:</p>
                    <p className="font-sans text-sm text-chocolate">{topicLabel}</p>
                  </div>

                  {/* Task 1 · Tick arguments */}
                  <div className="focus-card">
                    <h4 className="font-serif text-xl text-olive mb-1">Task 1 · Collect Arguments</h4>
                    <p className="subtle-note text-sm mb-5">Tick the arguments you want to use. Each includes a German hint.</p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="font-sans text-xs font-bold text-green-700 uppercase tracking-wide mb-3">Arguments FOR</p>
                        <ArgumentCheckboxes args={topic.forArgs} checked={forTicked} onChange={(idx, v) => setForTicked((p) => ({ ...p, [idx]: v }))} color="green" isChecked={forArgChecked} onCheck={() => setForArgChecked(true)} />
                      </div>
                      <div>
                        <p className="font-sans text-xs font-bold text-red-700 uppercase tracking-wide mb-3">Arguments AGAINST</p>
                        <ArgumentCheckboxes args={topic.againstArgs} checked={againstTicked} onChange={(idx, v) => setAgainstTicked((p) => ({ ...p, [idx]: v }))} color="red" isChecked={againstArgChecked} onCheck={() => setAgainstArgChecked(true)} />
                      </div>
                    </div>
                  </div>

                  {/* Task 2 · Sentence starters */}
                  <div className="focus-card">
                    <h4 className="font-serif text-xl text-olive mb-1">Task 2 · Match Sentence Starters</h4>
                    <p className="subtle-note text-sm mb-5">Match each starter to its function.</p>
                    <StarterMatch sel={starterSel} onChange={(id, v) => { setStarterSel((p) => ({ ...p, [id]: v })); setStarterChecked(false); }} checked={starterChecked} onCheck={() => setStarterChecked(true)} />
                  </div>

                  {/* Task 3 · Write one sentence each side */}
                  <div className="focus-card">
                    <h4 className="font-serif text-xl text-olive mb-1">Task 3 · Write One Sentence for Each Side</h4>
                    <p className="subtle-note text-sm mb-5">Use the starters you matched in Task 2. Write about your chosen topic.</p>
                    <div className="space-y-4">
                      {[
                        { key: "for",     label: "FOR",     starter: "Firstly,",  color: "text-green-700", placeholder: "write your FOR sentence…" },
                        { key: "against", label: "AGAINST", starter: "However,",  color: "text-red-700",   placeholder: "write your AGAINST sentence…" },
                      ].map(({ key, label, starter, color, placeholder }) => (
                        <div key={key} className="space-y-1.5">
                          <p className={`font-sans text-xs font-bold ${color} uppercase tracking-wide`}>{label}</p>
                          <div className="flex items-center gap-2">
                            <span className="font-sans text-sm font-semibold text-terracotta flex-shrink-0">{starter}</span>
                            <input type="text" value={step2Sentences[key] || ""} onChange={(e) => setStep2Sentences((p) => ({ ...p, [key]: e.target.value }))}
                              placeholder={placeholder}
                              className="flex-1 bg-sage/40 rounded-xl px-4 py-2.5 font-sans text-sm text-chocolate placeholder:text-olive/40 outline-none focus:ring-2 focus:ring-terracotta/60" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* ══ STEP 3 · STRETCH — Detailed paragraph builder ══ */}
              <section className="mb-14">
                <StepHeader step={3} tier="Stretch" title="Build Your Paragraphs — Sentence by Sentence" xp={20} />
                <div className="space-y-4">

                  {/* Topic banner */}
                  <div className="flex items-start gap-3 bg-terracotta/10 border border-terracotta/20 rounded-2xl px-5 py-3">
                    <p className="font-sans text-xs font-bold text-terracotta uppercase tracking-wide flex-shrink-0 mt-0.5">Your topic:</p>
                    <p className="font-sans text-sm text-chocolate">{topicLabel}</p>
                  </div>

                  {/* How to use instruction card */}
                  <div className="bg-cream rounded-2xl px-5 py-4 border border-sage">
                    <p className="font-sans text-xs font-bold text-olive uppercase tracking-wide mb-2">How to use this section</p>
                    <ul className="space-y-1">
                      {["Each paragraph is broken into individual sentences.", "The coloured starter is already written for you — complete the sentence in the box.", 'Click "Show example" if you need inspiration.', "The German hint below each sentence helps you with vocabulary."].map((t, i) => (
                        <li key={i} className="flex items-start gap-2 font-sans text-xs text-chocolate"><span className="text-terracotta font-bold flex-shrink-0 mt-0.5">→</span>{t}</li>
                      ))}
                    </ul>
                  </div>

                  {topic.paragraphs.map((para, pi) => (
                    <ParagraphSection key={pi} para={para} values={paraValues} onChange={handleParaChange} />
                  ))}
                </div>
              </section>

              {/* ══ STEP 4 · REMIX ══ */}
              <section className="mb-20">
                <StepHeader step={4} tier="Remix" title="Write Your Complete Written Discussion" xp={20} />
                <div className="space-y-6">

                  {/* Topic banner */}
                  <div className="flex items-start gap-3 bg-terracotta/10 border border-terracotta/20 rounded-2xl px-5 py-3">
                    <p className="font-sans text-xs font-bold text-terracotta uppercase tracking-wide flex-shrink-0 mt-0.5">Your topic:</p>
                    <p className="font-sans text-sm text-chocolate">{topicLabel}</p>
                  </div>

                  {/* Quick phrase reference */}
                  <div className="bg-cream rounded-2xl p-5">
                    <p className="font-sans text-xs font-semibold text-olive/70 uppercase tracking-wide mb-3">Quick Phrase Reference</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: "Introduction", phrases: ["Nowadays,…", "Some people think…", "So, should…?"] },
                        { label: "Arguments For", phrases: ["Firstly,…", "One advantage is…", "In addition,…"] },
                        { label: "Arguments Against", phrases: ["However,…", "On the other hand,…", "Another disadvantage is…"] },
                        { label: "Conclusion", phrases: ["To sum up,…", "In my opinion,…", "I believe that…"] },
                      ].map(({ label, phrases }) => (
                        <div key={label}>
                          <p className="font-sans text-[10px] font-bold text-olive uppercase tracking-wide mb-1.5">{label}</p>
                          {phrases.map((p) => <p key={p} className="font-sans text-xs text-chocolate italic">{p}</p>)}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="focus-card">
                    <h4 className="font-serif text-xl text-olive mb-1">Write Your Written Discussion</h4>
                    <p className="subtle-note text-sm mb-5">
                      Now put it all together. Use your sentences from Step 3 as a guide. Aim for 120–150 words with 4 clear paragraphs.
                    </p>
                    <EssayEditor value={essay} onChange={setEssay} topic={topicLabel} />
                  </div>

                  <div className="focus-card">
                    <h4 className="font-serif text-xl text-olive mb-1">Self-Check</h4>
                    <p className="subtle-note text-sm mb-5">Before you finish, tick everything you have done.</p>
                    <SelfCheckList />
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Sticky PDF button */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <button onClick={handleDownloadPdf} disabled={!hasAnyProgress}
              title={!hasAnyProgress ? "Start any task to generate a PDF" : ""}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-olive text-cream font-sans font-semibold text-sm tracking-wide shadow-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-olive/90 hover:enabled:-translate-y-0.5">
              <FileDown className="w-4 h-4" />
              {hasAnyProgress ? `Generate PDF — ${week4Name}` : "Generate PDF"}
            </button>
          </div>

          <footer className="text-center pb-24">
            <p className="subtle-note">End of Week 4 · Vocab &amp; Writing. Every sentence you write builds your confidence.</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Week4Writing;
