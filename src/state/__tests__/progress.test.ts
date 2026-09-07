jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadProgress, saveProgress } from '../progress';
import { WORD_LENGTHS } from '../../data/riddles';

describe('progress storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('returns defaults when nothing has been saved', async () => {
    expect(await loadProgress()).toEqual({
      wordLength: WORD_LENGTHS[0],
      completedStages: {},
    });
  });

  it('round-trips saved progress', async () => {
    const progress = { wordLength: WORD_LENGTHS[1], completedStages: { 3: 2 } };
    await saveProgress(progress);
    expect(await loadProgress()).toEqual(progress);
  });

  it('falls back to defaults for malformed stored JSON', async () => {
    await AsyncStorage.setItem('bullseye-words:progress', 'not json');
    expect(await loadProgress()).toEqual({
      wordLength: WORD_LENGTHS[0],
      completedStages: {},
    });
  });

  it('falls back to defaults when the stored word length is not a valid length', async () => {
    await AsyncStorage.setItem(
      'bullseye-words:progress',
      JSON.stringify({ wordLength: 999, completedStages: { 0: 5 } })
    );
    expect(await loadProgress()).toEqual({
      wordLength: WORD_LENGTHS[0],
      completedStages: {},
    });
  });

  it('defaults completedStages to an empty object when missing or malformed', async () => {
    await AsyncStorage.setItem(
      'bullseye-words:progress',
      JSON.stringify({ wordLength: WORD_LENGTHS[0], completedStages: 'nope' })
    );
    expect(await loadProgress()).toEqual({
      wordLength: WORD_LENGTHS[0],
      completedStages: {},
    });
  });
});
