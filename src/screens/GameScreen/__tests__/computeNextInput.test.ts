import { computeNextInput } from '../computeNextInput';

describe('computeNextInput', () => {
  it('grows the input normally when there is no error', () => {
    expect(computeNextInput('אב', 'א', 4, false)).toBe('אב');
  });

  it('caps the input at wordLength', () => {
    expect(computeNextInput('אבגדה', 'אבגד', 4, false)).toBe('אבגד');
  });

  it('shrinks the input on deletion', () => {
    expect(computeNextInput('א', 'אב', 4, false)).toBe('א');
  });

  it('discards the previous (rejected) input and starts fresh when typing after an error', () => {
    // המשתמש הקליד "אב" (נדחה, error=true), וממשיך להקליד "ג" -> הקלט
    // החדש הוא רק "ג", לא "אבג".
    expect(computeNextInput('אבג', 'אב', 4, true)).toBe('ג');
  });

  it('caps the fresh-start suffix at wordLength when typing multiple letters after an error', () => {
    expect(computeNextInput('אבגדה', 'אב', 3, true)).toBe('גדה');
  });

  it('does not apply the fresh-start behavior when the text is shrinking, even with an error', () => {
    expect(computeNextInput('א', 'אב', 4, true)).toBe('א');
  });

  it('does not apply the fresh-start behavior when there is no error, even if growing', () => {
    expect(computeNextInput('אבג', 'אב', 4, false)).toBe('אבג');
  });
});
