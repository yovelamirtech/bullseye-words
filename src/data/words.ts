import { normalizeSofit } from '../logic/hebrew';
import { WORDS_BY_LENGTH } from './wordBank';
import { getRiddlesForLength, type Riddle } from './riddles';

export { WORDS_BY_LENGTH };

export const LEVELS = Object.keys(WORDS_BY_LENGTH)
  .map(Number)
  .sort((a, b) => a - b);

export function getWordsForLevel(wordLength: number): string[] {
  return WORDS_BY_LENGTH[wordLength] ?? [];
}

// Number of stages in a word length's progression.
export const STAGES_PER_LENGTH = 20;

/**
 * The ordered list of stage words for a word length: curated riddle words
 * first (a clue is always available, making them the easier opening
 * stages), followed by plain dictionary words for later, clue-less and
 * therefore harder stages.
 */
function getStageWordPool(wordLength: number): string[] {
  const riddleWords = getRiddlesForLength(wordLength).map((r) => r.word);
  const riddleSet = new Set(riddleWords.map(normalizeSofit));
  const otherWords = getWordsForLevel(wordLength).filter(
    (w) => !riddleSet.has(normalizeSofit(w))
  );
  return [...riddleWords, ...otherWords].slice(0, STAGES_PER_LENGTH);
}

export function getStageCount(wordLength: number): number {
  return getStageWordPool(wordLength).length;
}

/** The target word (with clue, if one is curated) for a specific stage. */
export function getStageTarget(
  wordLength: number,
  stageIndex: number
): Riddle | undefined {
  const word = getStageWordPool(wordLength)[stageIndex];
  if (!word) return undefined;
  const riddle = getRiddlesForLength(wordLength).find(
    (r) => normalizeSofit(r.word) === normalizeSofit(word)
  );
  return riddle ?? { word, clue: '' };
}

// Sets of sofit-normalized dictionary words, keyed by word length, built
// once and reused for every validity check.
const NORMALIZED_WORDS_BY_LENGTH = new Map<number, Set<string>>(
  Object.entries(WORDS_BY_LENGTH).map(([length, words]) => [
    Number(length),
    new Set(words.map(normalizeSofit)),
  ])
);

/**
 * Whether `guess` is a real word from the dictionary for its length.
 * Sofit letters are normalized first, so a guess spelled with the
 * "wrong" final-letter form still validates.
 */
export function isValidWord(guess: string): boolean {
  const words = NORMALIZED_WORDS_BY_LENGTH.get(guess.length);
  if (!words) return false;
  return words.has(normalizeSofit(guess));
}
