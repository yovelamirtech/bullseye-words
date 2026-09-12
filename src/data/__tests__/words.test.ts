import {
  isValidWord,
  getWordsForLength,
  LEVELS,
  getStageCount,
  getStageTarget,
  STAGES_PER_LENGTH,
  findRiddleOrEmpty,
} from '../words';
import { getRiddlesForLength, WORD_LENGTHS } from '../riddles';
import { normalizeSofit } from '../../logic/hebrew';

describe('isValidWord', () => {
  it('accepts a real dictionary word', () => {
    expect(isValidWord('בית')).toBe(true);
  });

  it('rejects a string that is not a real word', () => {
    expect(isValidWord('קךצע')).toBe(false);
  });

  it('rejects a length with no dictionary entries', () => {
    expect(isValidWord('א'.repeat(50))).toBe(false);
  });

  it('accepts a word spelled with the "wrong" sofit form', () => {
    // 'אבא' is a real word; swapping the trailing regular letter for a
    // final-form letter should still validate against the dictionary.
    const words = getWordsForLength(4);
    const withFinalLetter = words.find((w) => w.endsWith('ם'));
    expect(withFinalLetter).toBeDefined();
    const regularForm = withFinalLetter!.slice(0, -1) + 'מ';
    expect(isValidWord(regularForm)).toBe(true);
  });
});

describe('word bank coverage', () => {
  it('has a non-trivial pool of words for every level', () => {
    for (const length of LEVELS) {
      expect(getWordsForLength(length).length).toBeGreaterThan(0);
    }
  });
});

describe('stage functions', () => {
  it('caps the stage count at STAGES_PER_LENGTH', () => {
    for (const length of WORD_LENGTHS) {
      expect(getStageCount(length)).toBeLessThanOrEqual(STAGES_PER_LENGTH);
    }
  });

  it('returns undefined for a stage index beyond the stage count', () => {
    const length = WORD_LENGTHS[0];
    expect(getStageTarget(length, getStageCount(length))).toBeUndefined();
  });

  it('puts curated riddle words first, each paired with its clue', () => {
    const length = WORD_LENGTHS[0];
    const riddles = getRiddlesForLength(length);
    for (let i = 0; i < riddles.length; i++) {
      const target = getStageTarget(length, i);
      expect(target).toBeDefined();
      expect(normalizeSofit(target!.word)).toBe(normalizeSofit(riddles[i].word));
      expect(target!.clue.length).toBeGreaterThan(0);
    }
  });

  it('falls back to a clue-less target for stages beyond the curated riddles', () => {
    const length = WORD_LENGTHS[0];
    const riddleCount = getRiddlesForLength(length).length;
    const stageCount = getStageCount(length);
    if (stageCount > riddleCount) {
      const target = getStageTarget(length, riddleCount);
      expect(target).toBeDefined();
      expect(target!.clue).toBe('');
      expect(isValidWord(target!.word)).toBe(true);
    }
  });

  it('never repeats a word across stages for a given length', () => {
    for (const length of WORD_LENGTHS) {
      const count = getStageCount(length);
      const words = Array.from({ length: count }, (_, i) =>
        normalizeSofit(getStageTarget(length, i)!.word)
      );
      expect(new Set(words).size).toBe(words.length);
    }
  });
});

describe('findRiddleOrEmpty', () => {
  it('returns the curated riddle (with clue) for a word that has one', () => {
    const length = WORD_LENGTHS[0];
    const riddle = getRiddlesForLength(length)[0];
    const result = findRiddleOrEmpty(length, riddle.word);
    expect(normalizeSofit(result.word)).toBe(normalizeSofit(riddle.word));
    expect(result.clue).toBe(riddle.clue);
  });

  it('matches sofit-insensitively', () => {
    const length = WORD_LENGTHS[0];
    const riddle = getRiddlesForLength(length)[0];
    const alteredWord = normalizeSofit(riddle.word);
    const result = findRiddleOrEmpty(length, alteredWord);
    expect(result.clue).toBe(riddle.clue);
  });

  it('falls back to a clue-less riddle for a word with no curated match', () => {
    const length = WORD_LENGTHS[0];
    const word = getWordsForLength(length).find(
      (w) => !getRiddlesForLength(length).some((r) => normalizeSofit(r.word) === normalizeSofit(w))
    );
    if (word) {
      expect(findRiddleOrEmpty(length, word)).toEqual({ word, clue: '' });
    }
  });
});
