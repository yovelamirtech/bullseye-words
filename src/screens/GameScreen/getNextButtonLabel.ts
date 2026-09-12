/** Label for the button shown after a win, depending on game mode/progress. */
export function getNextButtonLabel(
  isRandomMode: boolean,
  stageIndex: number,
  totalStages: number
): string {
  if (isRandomMode) return 'חזרה לתפריט';
  return stageIndex + 1 < totalStages ? 'לשלב הבא' : 'חזרה למסלול';
}
