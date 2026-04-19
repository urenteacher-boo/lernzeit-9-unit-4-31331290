import { useMemo, useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";

const WORDS = ["FOOTPRINT", "EMAIL", "PASSWORD", "ADULT", "IDENTITY", "NICKNAME"];
const COLS = 13;
const ROWS = 10;

type Dir = { dr: number; dc: number };
const DIRS: Dir[] = [
  { dr: 0,  dc: 1  }, // →
  { dr: 0,  dc: -1 }, // ←
  { dr: 1,  dc: 0  }, // ↓
  { dr: -1, dc: 0  }, // ↑
  { dr: 1,  dc: 1  }, // ↘
  { dr: 1,  dc: -1 }, // ↙
  { dr: -1, dc: 1  }, // ↗
  { dr: -1, dc: -1 }, // ↖
];

interface Placement { row: number; col: number; dir: Dir }

function buildGrid(): { grid: string[][]; placements: Record<string, Placement> } {
  const g: string[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
  );

  // Track which cells are occupied by a placed word letter
  const occupied = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  const placements: Record<string, Placement> = {};

  const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

  for (const word of shuffle(WORDS)) {
    let placed = false;
    for (let attempt = 0; attempt < 300 && !placed; attempt++) {
      const dir = DIRS[Math.floor(Math.random() * DIRS.length)];
      const row = Math.floor(Math.random() * ROWS);
      const col = Math.floor(Math.random() * COLS);

      const endRow = row + dir.dr * (word.length - 1);
      const endCol = col + dir.dc * (word.length - 1);
      if (endRow < 0 || endRow >= ROWS || endCol < 0 || endCol >= COLS) continue;

      // Check: each cell must either be unoccupied OR already have the exact same letter
      let ok = true;
      for (let i = 0; i < word.length; i++) {
        const r = row + dir.dr * i;
        const c = col + dir.dc * i;
        if (occupied[r][c] && g[r][c] !== word[i]) { ok = false; break; }
      }
      if (!ok) continue;

      // Place word
      for (let i = 0; i < word.length; i++) {
        const r = row + dir.dr * i;
        const c = col + dir.dc * i;
        g[r][c] = word[i];
        occupied[r][c] = true;
      }
      placements[word] = { row, col, dir };
      placed = true;
    }

    // Hard fallback: place horizontally on a dedicated row, no conflict possible
    if (!placed) {
      const row = WORDS.indexOf(word) % ROWS;
      for (let i = 0; i < word.length && i < COLS; i++) {
        g[row][i] = word[i];
        occupied[row][i] = true;
      }
      placements[word] = { row, col: 0, dir: DIRS[0] };
    }
  }

  return { grid: g, placements };
}

const cellKey = (r: number, c: number) => `${r}:${c}`;

function cellsForWord(word: string, placements: Record<string, Placement>): string[] {
  const p = placements[word];
  if (!p) return [];
  return Array.from({ length: word.length }, (_, i) =>
    cellKey(p.row + p.dir.dr * i, p.col + p.dir.dc * i)
  );
}

function getLineCells(startR: number, startC: number, curR: number, curC: number): string[] {
  const dr = curR - startR;
  const dc = curC - startC;
  if (dr === 0 && dc === 0) return [cellKey(startR, startC)];

  const aDr = Math.abs(dr);
  const aDc = Math.abs(dc);
  let stepR: number, stepC: number, steps: number;

  if (aDr === 0) {
    stepR = 0; stepC = dc > 0 ? 1 : -1; steps = aDc;
  } else if (aDc === 0) {
    stepR = dr > 0 ? 1 : -1; stepC = 0; steps = aDr;
  } else if (aDr === aDc) {
    stepR = dr > 0 ? 1 : -1; stepC = dc > 0 ? 1 : -1; steps = aDr;
  } else {
    // snap to dominant axis
    if (aDr >= aDc) { stepR = dr > 0 ? 1 : -1; stepC = 0; steps = aDr; }
    else            { stepR = 0; stepC = dc > 0 ? 1 : -1; steps = aDc; }
  }

  return Array.from({ length: steps + 1 }, (_, i) =>
    cellKey(startR + stepR * i, startC + stepC * i)
  );
}

const WORD_COLORS = [
  "bg-olive text-cream",
  "bg-terracotta text-cream",
  "bg-moss text-cream",
  "bg-stone-olive text-cream",
  "bg-chocolate text-cream",
  "bg-sand text-chocolate",
];

interface WordSearchProps { onProgress?: (found: string[]) => void; }

export const WordSearch = ({ onProgress }: WordSearchProps) => {
  const { grid, placements } = useMemo(buildGrid, []);

  const [found, setFound]           = useState<string[]>([]);
  const [foundCells, setFoundCells] = useState<Record<string, string>>({});
  const [selCells, setSelCells]     = useState<Set<string>>(new Set());

  // Use refs for drag state so they're always current inside DOM event listeners
  const isDragging = useRef(false);
  const selStart   = useRef<{ r: number; c: number } | null>(null);
  const foundRef   = useRef<string[]>([]);
  foundRef.current = found;

  const containerRef = useRef<HTMLDivElement>(null);

  // Convert pixel position to grid cell
  const cellFromPoint = (x: number, y: number): { r: number; c: number } | null => {
    const container = containerRef.current;
    if (!container) return null;
    const el = document.elementFromPoint(x, y) as HTMLElement | null;
    if (!el) return null;
    const key = el.dataset.cellkey ?? el.closest("[data-cellkey]")?.getAttribute("data-cellkey");
    if (!key) return null;
    const [r, c] = key.split(":").map(Number);
    return { r, c };
  };

  const commit = (cells: string[]) => {
    if (cells.length < 2) { setSelCells(new Set()); isDragging.current = false; selStart.current = null; return; }
    const letters = cells.map((k) => { const [r, c] = k.split(":").map(Number); return grid[r][c]; }).join("");
    const rev = letters.split("").reverse().join("");
    const match = WORDS.find((w) => (w === letters || w === rev) && !foundRef.current.includes(w));
    if (match) {
      const colorIdx = foundRef.current.length;
      const color = WORD_COLORS[colorIdx % WORD_COLORS.length];
      setFound(f => {
        const next = [...f, match];
        foundRef.current = next;
        onProgress?.(next);
        return next;
      });
      setFoundCells(fc => {
        const next = { ...fc };
        cellsForWord(match, placements).forEach(k => { next[k] = color; });
        return next;
      });
    }
    setSelCells(new Set());
    isDragging.current = false;
    selStart.current = null;
  };

  // Attach native pointer events to the container so we capture moves that leave individual cells
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      const cell = cellFromPoint(e.clientX, e.clientY);
      if (!cell) return;
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      isDragging.current = true;
      selStart.current = cell;
      setSelCells(new Set([cellKey(cell.r, cell.c)]));
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current || !selStart.current) return;
      e.preventDefault();
      const cell = cellFromPoint(e.clientX, e.clientY);
      if (!cell) return;
      const line = getLineCells(selStart.current.r, selStart.current.c, cell.r, cell.c);
      setSelCells(new Set(line));
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const cell = cellFromPoint(e.clientX, e.clientY);
      const start = selStart.current;
      if (start && cell) {
        const line = getLineCells(start.r, start.c, cell.r, cell.c);
        commit(line);
      } else {
        setSelCells(new Set());
        isDragging.current = false;
        selStart.current = null;
      }
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
    };
  }, [grid, placements]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start">
      {/* Grid */}
      <div
        ref={containerRef}
        className="select-none touch-none inline-block bg-cream rounded-2xl p-3 cursor-crosshair"
        style={{ userSelect: "none" }}
      >
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, 2rem)` }}>
          {grid.map((row, r) =>
            row.map((ch, c) => {
              const k = cellKey(r, c);
              const isSel = selCells.has(k);
              const foundColor = foundCells[k];
              return (
                <div
                  key={k}
                  data-cellkey={k}
                  className={[
                    "w-8 h-8 rounded-md text-sm font-semibold font-sans flex items-center justify-center transition-all duration-75",
                    foundColor
                      ? foundColor
                      : isSel
                      ? "bg-terracotta text-cream scale-110 shadow-md"
                      : "bg-sage text-chocolate",
                  ].join(" ")}
                >
                  {ch}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Word list */}
      <div className="min-w-[160px]">
        <p className="text-[10px] tracking-[0.18em] uppercase text-olive/60 mb-3">Find these words</p>
        <ul className="space-y-2">
          {WORDS.map((w) => {
            const done = found.includes(w);
            const colorIdx = found.indexOf(w);
            const color = colorIdx >= 0 ? WORD_COLORS[colorIdx % WORD_COLORS.length] : "";
            return (
              <li key={w} className="flex items-center gap-2 font-sans text-sm">
                {done ? (
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Check className="w-3 h-3" />
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full border border-olive/30 flex-shrink-0" />
                )}
                <span className={done ? "line-through text-olive/50" : "text-chocolate"}>{w}</span>
              </li>
            );
          })}
        </ul>
        {found.length === WORDS.length && (
          <p className="subtle-note mt-5 text-sm text-olive">🎉 All found!</p>
        )}
      </div>
    </div>
  );
};
