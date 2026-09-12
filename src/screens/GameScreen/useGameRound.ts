import { useMemo, useState } from 'react';
import { scoreGuess, isWinningGuess, type GuessResult } from '../../logic/game';
import { getStageTarget } from '../../data/words';

export interface GuessEntry {
  guess: string;
  result: GuessResult;
}

interface UseGameRoundParams {
  wordLength: number;
  stageIndex: number;
  isRandomMode: boolean;
  randomTarget?: { word: string; clue: string } | null;
}

interface UseGameRoundResult {
  target: string;
  clue: string;
  history: GuessEntry[];
  sortedHistory: GuessEntry[];
  sortByScore: boolean;
  setSortByScore: (value: boolean | ((prev: boolean) => boolean)) => void;
  won: boolean;
  /** מנקד ניחוש (תקין) כלפי המטרה, מוסיף להיסטוריה ומעדכן won. */
  submitGuess: (guess: string) => { result: GuessResult; won: boolean };
}

/**
 * מקור האמת ל"סיבוב" משחק בודד: המטרה/הרמז (נגזרים ישירות מה-props, בלי
 * state ביניים — המסך הקורא מתרנדר מחדש עם key חדש בכל סיבוב חדש, כך
 * שאין צורך "לנעול" את הערך הראשוני ב-state), היסטוריית הניחושים, מיון
 * ההיסטוריה, וניקוד/שליחה של ניחוש.
 */
export function useGameRound({
  wordLength,
  stageIndex,
  isRandomMode,
  randomTarget = null,
}: UseGameRoundParams): UseGameRoundResult {
  const round = isRandomMode ? randomTarget : getStageTarget(wordLength, stageIndex);
  const target = round?.word ?? '';
  const clue = round?.clue ?? '';

  const [history, setHistory] = useState<GuessEntry[]>([]);
  const [won, setWon] = useState(false);
  const [sortByScore, setSortByScore] = useState(false);

  const sortedHistory = useMemo(() => {
    if (!sortByScore) return history;
    return [...history].sort(
      (a, b) => b.result.bulls - a.result.bulls || b.result.hits - a.result.hits
    );
  }, [history, sortByScore]);

  function submitGuess(guess: string): { result: GuessResult; won: boolean } {
    const result = scoreGuess(guess, target);
    setHistory((prev) => [{ guess, result }, ...prev]);
    const didWin = isWinningGuess(guess, target);
    if (didWin) setWon(true);
    return { result, won: didWin };
  }

  return {
    target,
    clue,
    history,
    sortedHistory,
    sortByScore,
    setSortByScore,
    won,
    submitGuess,
  };
}
