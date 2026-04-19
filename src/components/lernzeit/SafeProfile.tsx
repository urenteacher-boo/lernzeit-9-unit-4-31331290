import { useState } from "react";
import { User, Lock, Hash, Plus, X, CheckCircle2, ArrowRight, Shield } from "lucide-react";
import nicknameImg from "@/assets/safe-nickname.jpg";
import passwordImg from "@/assets/safe-password.jpg";
import tagsImg from "@/assets/safe-tags.jpg";
import safeProfileImg from "@/assets/safe-profile.jpg";

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s; // 0–4
}

const strengthLabels = ["Too weak", "Weak", "Okay", "Strong", "Very strong"];
const strengthColors = [
  "bg-destructive",
  "bg-destructive",
  "bg-sand",
  "bg-moss",
  "bg-olive",
];
const strengthTextColors = [
  "text-red-600",
  "text-red-500",
  "text-sand",
  "text-moss",
  "text-olive",
];

export const SafeProfile = () => {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [activeField, setActiveField] = useState<"nickname" | "password" | "tags" | null>(null);

  const s = strength(password);
  const nicknameOk = nickname.trim().length >= 2;
  const passwordOk = s >= 3;
  const tagsOk = tags.length >= 1;
  const allDone = nicknameOk && passwordOk && tagsOk;

  const addTag = () => {
    const t = tag.trim().replace(/^#/, "");
    if (t && !tags.includes(t) && tags.length < 6) setTags([...tags, t]);
    setTag("");
  };

  const steps = [
    {
      id: "nickname" as const,
      num: 1,
      icon: <User className="w-4 h-4" />,
      img: nicknameImg,
      label: "Choose a nickname",
      hint: "Use a made-up name — never your real name.",
      done: nicknameOk,
    },
    {
      id: "password" as const,
      num: 2,
      icon: <Lock className="w-4 h-4" />,
      img: passwordImg,
      label: "Create a strong password",
      hint: "Mix uppercase, lowercase, numbers and symbols.",
      done: passwordOk,
    },
    {
      id: "tags" as const,
      num: 3,
      icon: <Hash className="w-4 h-4" />,
      img: tagsImg,
      label: "Add interest hashtags",
      hint: "Share interests, not personal details.",
      done: tagsOk,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Task banner */}
      <div className="flex items-start gap-3 bg-terracotta/10 border border-terracotta/20 rounded-2xl px-5 py-4">
        <Shield className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-sans text-sm font-semibold text-chocolate leading-snug">
            Your task: build a safe online profile
          </p>
          <p className="font-sans text-xs text-olive/70 mt-0.5 leading-relaxed">
            Fill in each field below using only safe information. Watch the preview update as you type.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* ── Left: step-by-step form ── */}
        <div className="space-y-3">
          {steps.map((step) => {
            const isActive = activeField === step.id;
            return (
              <div
                key={step.id}
                className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
                  step.done
                    ? "border-olive/30 bg-olive/5"
                    : isActive
                    ? "border-terracotta/50 bg-cream shadow-md"
                    : "border-sage-2 bg-cream/60"
                }`}
              >
                {/* Step header */}
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-left"
                  onClick={() => setActiveField(isActive ? null : step.id)}
                >
                  <span
                    className={`w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 ring-2 transition-all ${
                      step.done
                        ? "ring-olive/40"
                        : isActive
                        ? "ring-terracotta/60"
                        : "ring-sage-2"
                    }`}
                  >
                    <img
                      src={step.img}
                      alt={step.label}
                      width={512}
                      height={512}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </span>
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      step.done
                        ? "bg-olive text-cream"
                        : isActive
                        ? "bg-terracotta text-cream"
                        : "bg-sage-2 text-olive/60"
                    }`}
                  >
                    {step.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="text-[10px] font-bold">{step.num}</span>}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-sans text-sm font-semibold leading-tight ${step.done ? "text-olive" : "text-chocolate"}`}>
                      {step.label}
                    </p>
                    <p className="font-sans text-[11px] text-olive/60 mt-0.5 leading-tight">{step.hint}</p>
                  </div>
                  {!step.done && (
                    <ArrowRight className={`w-4 h-4 flex-shrink-0 transition-transform ${isActive ? "rotate-90 text-terracotta" : "text-olive/30"}`} />
                  )}
                </button>

                {/* Step body — expands when active */}
                {isActive && (
                  <div className="px-4 pb-4 border-t border-terracotta/10 pt-3 space-y-2 animate-fade-in">
                    {step.id === "nickname" && (
                      <input
                        autoFocus
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="e.g. CloudWalker99"
                        className="w-full bg-sage/30 rounded-xl px-4 py-2.5 font-sans text-sm text-chocolate placeholder:text-olive/40 outline-none focus:ring-2 focus:ring-terracotta/60"
                      />
                    )}

                    {step.id === "password" && (
                      <>
                        <input
                          autoFocus
                          type="text"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="e.g. Sun#River42!"
                          className="w-full bg-sage/30 rounded-xl px-4 py-2.5 font-sans text-sm text-chocolate placeholder:text-olive/40 outline-none focus:ring-2 focus:ring-terracotta/60"
                        />
                        {/* Strength bar */}
                        <div className="flex gap-1 mt-2">
                          {[0, 1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < s ? strengthColors[s] : "bg-sage"}`}
                            />
                          ))}
                        </div>
                        <p className={`text-[11px] font-sans font-semibold mt-1 ${password ? strengthTextColors[s] : "text-olive/50"}`}>
                          {password ? strengthLabels[s] : "Start typing to check strength"}
                        </p>
                        <ul className="text-[11px] text-olive/60 space-y-0.5 mt-1 font-sans">
                          <li className={password.length >= 8 ? "text-olive line-through" : ""}>✦ At least 8 characters</li>
                          <li className={(/[A-Z]/.test(password) && /[a-z]/.test(password)) ? "text-olive line-through" : ""}>✦ Upper & lowercase letters</li>
                          <li className={/\d/.test(password) ? "text-olive line-through" : ""}>✦ At least one number</li>
                          <li className={/[^A-Za-z0-9]/.test(password) ? "text-olive line-through" : ""}>✦ At least one symbol (!@#…)</li>
                        </ul>
                      </>
                    )}

                    {step.id === "tags" && (
                      <>
                        <div className="flex gap-2">
                          <input
                            autoFocus
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                            placeholder="music, gaming, art…"
                            className="flex-1 bg-sage/30 rounded-xl px-4 py-2.5 font-sans text-sm text-chocolate placeholder:text-olive/40 outline-none focus:ring-2 focus:ring-terracotta/60"
                          />
                          <button
                            onClick={addTag}
                            disabled={!tag.trim()}
                            className="px-3.5 rounded-xl bg-olive text-cream hover:bg-olive/90 transition-colors disabled:opacity-40"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2 min-h-[28px]">
                          {tags.length === 0 && (
                            <span className="text-[11px] text-olive/40 font-sans italic">Add up to 6 interests…</span>
                          )}
                          {tags.map((t) => (
                            <span key={t} className="pill pill-tier inline-flex items-center gap-1">
                              #{t}
                              <button onClick={() => setTags(tags.filter((x) => x !== t))} className="hover:text-terracotta ml-0.5">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Completion badge */}
          {allDone && (
            <div className="flex items-center gap-3 bg-olive/10 border border-olive/30 rounded-2xl px-5 py-3.5 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-olive flex-shrink-0" />
              <p className="font-sans text-sm font-semibold text-olive">Profile complete — well done!</p>
            </div>
          )}
        </div>

        {/* ── Right: live preview card ── */}
        <div className="bg-gradient-hero rounded-[28px] p-6 text-cream relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-cream/10 rounded-full blur-2xl" />

          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] tracking-[0.2em] uppercase text-cream/50">Live preview</p>
            <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-cream/20 flex-shrink-0">
              <img
                src={safeProfileImg}
                alt="Safe profile illustration"
                width={768}
                height={768}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Avatar + name */}
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${nicknameOk ? "bg-terracotta/40 ring-2 ring-cream/30" : "bg-cream/10"}`}>
              <User className="w-7 h-7 text-cream" />
            </div>
            <div>
              <p className={`font-serif text-xl leading-tight transition-all ${nicknameOk ? "text-cream" : "text-cream/30 italic"}`}>
                {nicknameOk ? nickname : "your_nickname"}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <Lock className="w-3 h-3 text-cream/50" />
                <p className={`text-xs font-sans transition-all ${passwordOk ? "text-cream/80" : "text-cream/30 italic"}`}>
                  {passwordOk ? "•".repeat(Math.min(password.length, 14)) : "no password set"}
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-cream/10 mb-4" />

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 min-h-[24px]">
            {tags.length > 0 ? tags.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 bg-cream/10 rounded-full px-2.5 py-0.5 text-cream/90 text-xs font-sans">
                <Hash className="w-2.5 h-2.5" />{t}
              </span>
            )) : (
              <span className="text-cream/25 text-xs font-sans italic">your interests will appear here</span>
            )}
          </div>

          {/* Safety score */}
          <div className="mt-5 pt-4 border-t border-cream/10">
            <p className="text-[10px] tracking-[0.15em] uppercase text-cream/40 mb-2">Safety checklist</p>
            <div className="space-y-1">
              {[
                { label: "Safe nickname used", ok: nicknameOk },
                { label: "Strong password set", ok: passwordOk },
                { label: "Interests added", ok: tagsOk },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-all ${item.ok ? "bg-cream" : "bg-cream/20"}`} />
                  <p className={`text-xs font-sans transition-all ${item.ok ? "text-cream/80" : "text-cream/30"}`}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
