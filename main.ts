// Office Jokes entry writer — program/v1, Node 22, standard library only.
// Drops one office joke into $MAKEFUN_OUTPUT_DIR/entry.txt
// (or /output/entry.txt when the variable is unset), then proves the
// file on disk is byte-for-byte the joke it meant to write.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The joke itself: an IT ticket that keeps climbing the ladder while
// the person who filed it stays put. Setup is a familiar office chore,
// the punchline flips who is actually getting promoted.
const JOKE =
  "I opened an IT ticket for a second monitor and it's been escalated so often it now has a better career path than I do.";

const LIMIT = 199;

function fail(message: string): never {
  throw new Error(`entry rejected: ${message}`);
}

function checkShape(text: string): void {
  // One line only — a stray newline would make it two entries, not one joke.
  if (/[\r\n]/.test(text)) fail("must be a single line");

  // The gate wants real text, not a blank or whitespace-only file.
  if (text.trim().length === 0) fail("must not be only white space");

  // Gate window: 1 to 199 characters, counted as code units.
  if (text.length < 1 || text.length > LIMIT) {
    fail(`must be 1 to ${LIMIT} characters, got ${text.length}`);
  }

  // One sentence, ending in a single full stop — no extra periods
  // hiding a second thought in the middle of the line.
  const stops = (text.match(/\./g) ?? []).length;
  if (stops !== 1 || !text.endsWith(".")) {
    fail(`must be exactly one sentence, found ${stops} period(s)`);
  }
}

function main(): void {
  checkShape(JOKE);
  console.log(`entry is ${JOKE.length} characters, inside the limit`);

  const folder = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(folder, { recursive: true });
  const target = join(folder, "entry.txt");
  writeFileSync(target, JOKE, "utf8");

  // Read it straight back: what the judge sees must be what we wrote.
  if (readFileSync(target, "utf8") !== JOKE) {
    fail(`${target} does not match the entry`);
  }
  console.log(`wrote ${target} (${JOKE.length} characters, verified)`);
  console.log(JOKE);
}

main();
