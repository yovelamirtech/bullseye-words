import AsyncStorage from '@react-native-async-storage/async-storage';
import { WORD_LENGTHS } from '../data/riddles';

const STORAGE_KEY = 'bullseye-words:progress';

export interface Progress {
  wordLength: number;
  // Number of completed stages per word length. The next playable stage
  // for a length is the one at this index (0-based).
  completedStages: Record<number, number>;
}

const DEFAULT_PROGRESS: Progress = {
  wordLength: WORD_LENGTHS[0],
  completedStages: {},
};

export async function loadProgress(): Promise<Progress> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    if (
      typeof parsed.wordLength !== 'number' ||
      !WORD_LENGTHS.includes(parsed.wordLength)
    ) {
      return DEFAULT_PROGRESS;
    }
    return {
      wordLength: parsed.wordLength,
      completedStages:
        parsed.completedStages && typeof parsed.completedStages === 'object'
          ? parsed.completedStages
          : {},
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export async function saveProgress(progress: Progress): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
