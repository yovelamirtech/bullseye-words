jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

import AsyncStorage from '@react-native-async-storage/async-storage';
import { drawNextRandomLength } from '../randomBag';
import { WORD_LENGTHS } from '../../data/riddles';

describe('drawNextRandomLength', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('draws every word length exactly once before any length repeats', async () => {
    const drawn: number[] = [];
    for (let i = 0; i < WORD_LENGTHS.length; i++) {
      drawn.push(await drawNextRandomLength());
    }

    expect(new Set(drawn)).toEqual(new Set(WORD_LENGTHS));
    expect(drawn).toHaveLength(WORD_LENGTHS.length);
  });

  it('does not repeat the last length of a cycle as the first of the next one', async () => {
    let lastOfCycle = -1;
    for (let i = 0; i < WORD_LENGTHS.length; i++) {
      lastOfCycle = await drawNextRandomLength();
    }
    const firstOfNextCycle = await drawNextRandomLength();
    expect(firstOfNextCycle).not.toBe(lastOfCycle);
  });

  it('always returns a valid word length', async () => {
    for (let i = 0; i < WORD_LENGTHS.length * 3; i++) {
      const length = await drawNextRandomLength();
      expect(WORD_LENGTHS).toContain(length);
    }
  });

  it('recovers from malformed stored data', async () => {
    await AsyncStorage.setItem('bullseye-words:random-bag', 'not json');
    const length = await drawNextRandomLength();
    expect(WORD_LENGTHS).toContain(length);
  });
});
