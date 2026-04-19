interface Props {
  step: number;
  tier: string;
  title: string;
  xp: number;
}
export const StepHeader = ({ step, tier, title, xp }: Props) => (
  <div className="flex items-end justify-between mb-5">
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="pill pill-tier">Step {step}</span>
        <span className="pill pill-xp">+{xp} XP</span>
        <span className="text-[11px] tracking-[0.18em] uppercase text-olive/60">{tier}</span>
      </div>
      <h2 className="font-serif text-3xl text-olive leading-tight">{title}</h2>
    </div>
  </div>
);
