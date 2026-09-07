import {
  WORD_LENGTHS,
  RIDDLES_BY_LENGTH,
  getRiddlesForLength,
  pickRandomRiddle,
} from '../riddles';
import { isValidWord } from '../words';

describe('riddle bank', () => {
  it('covers word lengths 2 through 6', () => {
    expect(WORD_LENGTHS).toEqual([2, 3, 4, 5, 6]);
  });

  it('has at least 3 riddles for every word length', () => {
    for (const length of WORD_LENGTHS) {
      expect(RIDDLES_BY_LENGTH[length].length).toBeGreaterThanOrEqual(3);
    }
  });

  it('every riddle word matches its bucket length and is a real dictionary word', () => {
    for (const length of WORD_LENGTHS) {
      for (const { word, clue } of RIDDLES_BY_LENGTH[length]) {
        expect(word.length).toBe(length);
        expect(isValidWord(word)).toBe(true);
        expect(clue.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('getRiddlesForLength', () => {
  it('returns the riddles for a known length', () => {
    expect(getRiddlesForLength(3)).toBe(RIDDLES_BY_LENGTH[3]);
  });

  it('returns an empty array for a length with no riddles', () => {
    expect(getRiddlesForLength(999)).toEqual([]);
  });
});

describe('pickRandomRiddle', () => {
  it('returns undefined for a length with no riddles', () => {
    expect(pickRandomRiddle(999)).toBeUndefined();
  });

  it('returns one of the curated riddles for a known length', () => {
    const riddle = pickRandomRiddle(3);
    expect(riddle).toBeDefined();
    expect(RIDDLES_BY_LENGTH[3]).toContainEqual(riddle);
  });
});
