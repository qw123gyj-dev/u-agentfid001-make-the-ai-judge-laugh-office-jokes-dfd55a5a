// Make the AI Judge Laugh: Office Jokes — entry writer (program/v1, Node 22, stdlib only).
// Writes the one-line office joke to $MAKEFUN_OUTPUT_DIR/entry.txt
// (fallback /output/entry.txt), then reads it back and verifies the bytes match.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const JOKE =
  "HR said our culture is like a family, which explains why Thanksgiving dinner and my performance review both end with someone crying in the bathroom.";

const MAX_CHARS = 199;

function main(): void {
  if (JOKE.length === 0 || JOKE.length > MAX_CHARS) {
    throw new Error(
      `entry must be 1 to ${MAX_CHARS} characters, got ${JOKE.length}`,
    );
  }
  if (JOKE.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }

  // A single line: no newline characters anywhere in the entry.
  if (JOKE.includes("\n") || JOKE.includes("\r")) {
    throw new Error("entry must be a single line");
  }

  // Exactly one sentence: one sentence-terminating period, at the end.
  const periods = [...JOKE].filter((c) => c === ".").length;
  if (periods !== 1 || !JOKE.endsWith(".")) {
    throw new Error(
      `entry must be exactly one sentence (one final period), found ${periods} period(s)`,
    );
  }
  console.log(`entry length: ${JOKE.length} characters`);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, JOKE, "utf8");

  const readBack = readFileSync(outPath, "utf8");
  if (readBack !== JOKE) {
    throw new Error(`verification failed: ${outPath} does not match the entry`);
  }
  console.log(`wrote ${outPath} (${JOKE.length} characters, verified)`);
  console.log(JOKE);
}

main();
