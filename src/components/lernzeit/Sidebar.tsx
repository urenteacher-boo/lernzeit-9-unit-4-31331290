import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/context/UserContext";

const WEEKS = [
  { n: 1, label: "Reading",    to: "/week/1", enabled: true },
  { n: 2, label: "Listening",  to: "#",       enabled: false },
  { n: 3, label: "Grammar",    to: "#",       enabled: false },
  { n: 4, label: "Vocabulary", to: "#",       enabled: false },
  { n: 5, label: "Speaking",   to: "#",       enabled: false },
  { n: 6, label: "Revision",   to: "#",       enabled: false },
];

export const LernzeitSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { week1Name, week2Name } = useUser();

  const studentName =
    location.pathname.startsWith("/week/2") ? week2Name :
    location.pathname.startsWith("/week/1") ? week1Name :
    week1Name || week2Name;

  const initials = studentName
    ? studentName.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()
    : "?";
  const displayName = studentName || "Student";

  const isVocabActive = location.pathname.startsWith("/vocabulary");

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 flex flex-col py-8 z-40 bg-sage-2 border-r border-olive/10">
      <button
        onClick={() => navigate("/")}
        className="px-8 mb-8 block text-left"
      >
        <h1 className="text-2xl font-serif italic text-olive tracking-tight">Lernzeit</h1>
        <p className="font-serif italic text-olive/60 text-xs mt-1">Unit 4 · Generation Like</p>
      </button>

      <div className="px-6 mb-1 text-[10px] uppercase tracking-[0.18em] text-olive/50 font-semibold">Weeks</div>
      <nav className="space-y-0.5">
        {WEEKS.map((w) => {
          const isActive = location.pathname.startsWith(`/week/${w.n}`);
          const isHome = location.pathname === "/" && w.n === 1;
          const active = isActive || isHome;

          return !w.enabled ? (
            <div
              key={w.n}
              className="sidebar-item flex items-center gap-3 py-2.5 px-6 rounded-l-full ml-2 opacity-50 cursor-not-allowed select-none"
            >
              <span className="w-6 h-6 rounded-full bg-white/60 text-olive/70 flex items-center justify-center text-[11px] font-semibold">
                {w.n}
              </span>
              <span className="sb-label text-sm text-stone-olive">{w.label}</span>
            </div>
          ) : (
            <Link
              key={w.n}
              to={w.to}
              className={`sidebar-item flex items-center gap-3 py-2.5 px-6 rounded-l-full ml-2 transition-all ${
                active ? "active bg-white/90" : "hover:bg-white/40"
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-white/60 text-olive/70 flex items-center justify-center text-[11px] font-semibold">
                {w.n}
              </span>
              <span className={`sb-label text-sm ${active ? "text-olive font-semibold" : "text-stone-olive"}`}>
                {w.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mx-4 my-4 h-px bg-olive/15" />

      <div className="px-6 mb-1 text-[10px] uppercase tracking-[0.18em] text-olive/50 font-semibold">Training</div>
      <Link
        to="/vocabulary"
        className={`sidebar-item flex items-center gap-3 py-2.5 px-6 rounded-l-full ml-2 transition-all ${
          isVocabActive ? "active bg-white/90" : "hover:bg-white/40"
        }`}
      >
        <svg className="w-5 h-5 text-olive/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="m16 6 4 14" /><path d="M12 6v14" /><path d="M8 8v12" /><path d="M4 4v16" />
        </svg>
        <span className={`sb-label text-sm ${isVocabActive ? "text-olive font-semibold" : "text-stone-olive"}`}>Vocabulary</span>
      </Link>

      <div className="mt-auto px-6 pb-1 flex items-center gap-3 text-xs text-stone-olive">
        <div className="w-8 h-8 rounded-full bg-terracotta/80 text-cream flex items-center justify-center font-serif italic flex-shrink-0">
          {initials}
        </div>
        <div>
          <div className="text-olive font-semibold">{displayName}</div>
          <div className="text-olive/60 text-[10px]">Level 8 · 7-day streak</div>
        </div>
      </div>
    </aside>
  );
};
