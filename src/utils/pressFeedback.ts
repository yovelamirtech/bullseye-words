import { errorHaptic, selectionHaptic, successHaptic, tapHaptic } from './haptics';
import {
  playClickSound,
  playCorrectSound,
  playIncorrectSound,
  playLetterClickSound,
} from './sound';

// שילובי הפטי+צליל שחוזרים בכל האפליקציה עבור אינטראקציות משתמש נפוצות,
// כדי שלא נצטרך לחזור על שני הקריאות בכל מקום שבו יש כפתור/בחירה.

/** נגיעה רגילה על כפתור: הפטי light + צליל קליק. */
export function tapFeedback(): void {
  tapHaptic();
  playClickSound();
}

/** בחירה מתוך רשימה/אפשרויות: הפטי selection + צליל קליק. */
export function selectionFeedback(): void {
  selectionHaptic();
  playClickSound();
}

/** הקלדת אות בתיבת הקלט: הפטי selection + צליל נקישת אות. */
export function letterFeedback(): void {
  selectionHaptic();
  playLetterClickSound();
}

/** הצלחה (ניחוש מנצח, שליחת דיווח): הפטי success + צליל הצלחה. */
export function successFeedback(): void {
  successHaptic();
  playCorrectSound();
}

/** שגיאה (מילה לא תקנית): הפטי error + צליל כישלון. */
export function errorFeedback(): void {
  errorHaptic();
  playIncorrectSound();
}
