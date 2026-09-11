import AsyncStorage from '@react-native-async-storage/async-storage';
import { WORD_LENGTHS } from '../data/riddles';

const STORAGE_KEY = 'bullseye-words:random-bag';

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// A freshly shuffled cycle of every word length. When `avoidFirst` is given
// and lands first by chance, it's swapped away so the new cycle doesn't
// immediately repeat the length that just finished the previous one.
function newBag(avoidFirst?: number): number[] {
  const bag = shuffle(WORD_LENGTHS);
  if (avoidFirst !== undefined && bag.length > 1 && bag[0] === avoidFirst) {
    [bag[0], bag[1]] = [bag[1], bag[0]];
  }
  return bag;
}

async function loadBag(): Promise<number[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return newBag();
    const parsed = JSON.parse(raw) as unknown;
    if (
      !Array.isArray(parsed) ||
      parsed.some((n) => typeof n !== 'number' || !WORD_LENGTHS.includes(n))
    ) {
      return newBag();
    }
    return parsed as number[];
  } catch {
    return newBag();
  }
}

async function saveBag(bag: number[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(bag));
}

/**
 * Draws the next word length for "random stage" mode from a shuffled bag
 * that holds every length exactly once, so no length repeats until all the
 * others have appeared. When the bag runs out, it's refilled with a newly
 * shuffled cycle (avoiding an immediate repeat of the length just drawn).
 */
export async function drawNextRandomLength(): Promise<number> {
  const bag = await loadBag();
  const [next, ...rest] = bag;
  const nextBag = rest.length > 0 ? rest : newBag(next);
  await saveBag(nextBag);
  return next;
}
