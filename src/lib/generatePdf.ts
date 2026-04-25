import { jsPDF } from "jspdf";

interface AnswerBlock {
  stepTitle: string;
  questions: { q: string; hint?: string }[];
  answers: Record<string, string>;
  submitted: Record<string, boolean>;
  idPrefix: string;
}

export interface PdfConfig {
  weekLabel: string;
  pageTitle: string;
  step1SectionTitle: string;
  answersTitle: string;
  filenameWeek: string;
  activities: { badge: string; lines: string[] }[];
}

// Brand colours (RGB)
const OLIVE      = [74,  93,  35]  as const;
const TERRACOTTA = [139, 94,  60]  as const;
const CREAM      = [251, 248, 238] as const;
const CHOCOLATE  = [67,  41,  31]  as const;
const MUTED      = [137, 156, 112] as const;
const RULE       = [217, 218, 190] as const;

function setFill(doc: jsPDF, rgb: readonly [number,number,number]) {
  doc.setFillColor(rgb[0], rgb[1], rgb[2]);
}
function setDraw(doc: jsPDF, rgb: readonly [number,number,number]) {
  doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
}
function setTextColor(doc: jsPDF, rgb: readonly [number,number,number]) {
  doc.setTextColor(rgb[0], rgb[1], rgb[2]);
}

const PAGE_W   = 210;  // A4 mm
const MARGIN   = 18;
const CONTENT  = PAGE_W - MARGIN * 2;

function addPageIfNeeded(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > 277) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

export function generateProgressPdf(
  studentName: string,
  blocks: AnswerBlock[],
  config: PdfConfig
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  // ── Header ────────────────────────────────────────────────────────
  setFill(doc, OLIVE);
  doc.rect(0, 0, PAGE_W, 36, "F");

  setTextColor(doc, CREAM);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text(`LERNZEIT · UNIT 4 · GENERATION LIKE · ${config.weekLabel}`, MARGIN, 11);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(config.pageTitle, MARGIN, 24);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Student: ${studentName}   ·   Date: ${date}`, MARGIN, 32);

  let y = 46;

  // ── Section label helper ──────────────────────────────────────────
  const sectionLabel = (label: string) => {
    setTextColor(doc, OLIVE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text(label.toUpperCase(), MARGIN, y);
    y += 2;
    setDraw(doc, RULE);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, y, MARGIN + CONTENT, y);
    y += 5;
  };

  // ── Step 1 summary ────────────────────────────────────────────────
  sectionLabel(config.step1SectionTitle);

  for (const act of config.activities) {
    y = addPageIfNeeded(doc, y, 20);

    setFill(doc, CREAM);
    setDraw(doc, RULE);
    doc.setLineWidth(0.2);
    doc.roundedRect(MARGIN, y, CONTENT, 18, 2, 2, "FD");

    // badge pill
    setFill(doc, [255, 255, 255] as const);
    setDraw(doc, TERRACOTTA);
    doc.setLineWidth(0.3);
    const badgeW = doc.getStringUnitWidth(act.badge) * 7 / doc.internal.scaleFactor + 6;
    doc.roundedRect(MARGIN + 4, y + 3.5, badgeW, 5, 1, 1, "FD");
    setTextColor(doc, TERRACOTTA);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text(act.badge, MARGIN + 7, y + 7.2);

    setTextColor(doc, CHOCOLATE);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(act.lines[0], MARGIN + 6, y + 13);
    if (act.lines[1]) {
      doc.setFontSize(8);
      setTextColor(doc, MUTED);
      doc.text(act.lines[1], MARGIN + 6, y + 16.5);
    }

    y += 22;
  }

  // ── Written answers ───────────────────────────────────────────────
  const sections: { step: string; q: string; a: string }[] = [];
  for (const block of blocks) {
    block.questions.forEach((item, i) => {
      const id = `${block.idPrefix}-${i}`;
      if (block.submitted[id] && block.answers[id]?.trim()) {
        sections.push({ step: block.stepTitle, q: item.q, a: block.answers[id].trim() });
      }
    });
  }

  y += 4;
  y = addPageIfNeeded(doc, y, 16);
  sectionLabel(config.answersTitle);

  if (sections.length === 0) {
    setTextColor(doc, MUTED);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("No written answers were saved in this session.", MARGIN, y);
    y += 10;
  } else {
    sections.forEach((s, idx) => {
      const qLines = doc.splitTextToSize(`Q${idx + 1}: ${s.q}`, CONTENT - 12);
      const aLines = doc.splitTextToSize(s.a, CONTENT - 16);
      const blockH = 10 + qLines.length * 5 + aLines.length * 5 + 6;

      y = addPageIfNeeded(doc, y, blockH + 4);

      setFill(doc, CREAM);
      setDraw(doc, RULE);
      doc.setLineWidth(0.2);
      doc.roundedRect(MARGIN, y, CONTENT, blockH, 2, 2, "FD");

      const badgeW2 = doc.getStringUnitWidth(s.step) * 7 / doc.internal.scaleFactor + 6;
      setFill(doc, [255, 255, 255] as const);
      setDraw(doc, TERRACOTTA);
      doc.setLineWidth(0.3);
      doc.roundedRect(MARGIN + 4, y + 3.5, badgeW2, 5, 1, 1, "FD");
      setTextColor(doc, TERRACOTTA);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.text(s.step, MARGIN + 7, y + 7.2);

      setTextColor(doc, OLIVE);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(qLines, MARGIN + 6, y + 13);

      const aStartY = y + 13 + qLines.length * 5 + 1;
      setDraw(doc, OLIVE);
      doc.setLineWidth(0.5);
      doc.line(MARGIN + 6, aStartY - 1, MARGIN + 6, aStartY + aLines.length * 5);

      setTextColor(doc, CHOCOLATE);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(aLines, MARGIN + 10, aStartY + 3);

      y += blockH + 4;
    });
  }

  // ── Footer on each page ───────────────────────────────────────────
  const totalPages = (doc.internal as unknown as { getNumberOfPages(): number }).getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    setTextColor(doc, MUTED);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(
      `Lernzeit · Unit 4 · ${config.weekLabel} · ${date}   |   Page ${p} of ${totalPages}`,
      PAGE_W / 2,
      291,
      { align: "center" }
    );
  }

  const safeName = studentName.replace(/[^a-zA-Z0-9_\- ]/g, "").trim().replace(/\s+/g, "_");
  doc.save(`Lernzeit_${config.filenameWeek}_${safeName}_${date.replace(/ /g, "_")}.pdf`);
}
