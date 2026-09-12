/**
 * Computes the next value for the letter-box input given a raw change from
 * the underlying TextInput.
 *
 * Normally the new input is simply `text` capped to `wordLength` (handles
 * both typing and deleting). The one special case: if there's an active
 * error message and the user is typing more letters (growing the text),
 * the box discards whatever was there before and starts fresh from the
 * newly typed suffix — so continuing to type after an invalid guess begins
 * a new word instead of appending onto the rejected one.
 */
export function computeNextInput(
  text: string,
  input: string,
  wordLength: number,
  hasError: boolean
): string {
  const isGrowing = text.length > input.length;
  if (hasError && isGrowing) {
    const typed = text.slice(input.length);
    return typed.slice(0, wordLength);
  }
  return text.slice(0, wordLength);
}
