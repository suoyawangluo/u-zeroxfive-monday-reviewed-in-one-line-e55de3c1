import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";

// One-line review of my own Monday: Monday as a rude coworker who reads
// the out-of-office reply, ignores it, and books a 9 a.m. standup anyway.
// Concrete details (out-of-office, 9 a.m. standup), twist lands on the
// last word, and it reads as a review — "One star" — of a real Monday.

// The review is assembled from named parts so each beat of the joke is
// visible: the rating, the offence, and the punchline.
const RATING = "One star.";
const OFFENCE =
  "Monday read my out-of-office reply, ignored it, and booked a 9 a.m. standup";
const PUNCHLINE = "to discuss my weekend.";

function buildLine(): string {
  return [RATING, OFFENCE, PUNCHLINE].join(" ");
}

const LINE = buildLine();

// Gate from the competition brief: /output/entry.txt must be UTF-8 text
// of 1 to 200 characters, a single line, not only white space.
interface GateReport {
  codePoints: number;
  singleLine: boolean;
}

function validateEntry(text: string): GateReport {
  const codePoints = [...text].length;
  const report: GateReport = {
    codePoints,
    singleLine: !text.includes("\n") && !text.includes("\r"),
  };
  if (codePoints < 1 || codePoints > 200) {
    throw new Error(`gate: ${codePoints} code points, need 1-200`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate: entry is only white space");
  }
  if (!report.singleLine) {
    throw new Error("gate: entry must be a single line");
  }
  return report;
}

// Read-back verification: the file on disk must be exactly the line.
function verifyWritten(path: string, expected: string): string {
  const back = readFileSync(path, "utf8");
  if (back.trim() !== expected) {
    throw new Error("verification: file content does not match the line");
  }
  return createHash("sha256").update(back).digest("hex");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const gate = validateEntry(LINE);
const entryPath = `${outDir}/entry.txt`;
writeFileSync(entryPath, LINE + "\n", "utf8");
const hash = verifyWritten(entryPath, LINE);
console.log(
  `wrote ${outDir}/entry.txt (${gate.codePoints} code points, sha256 ${hash}), verified: ${JSON.stringify(LINE)}`,
);
