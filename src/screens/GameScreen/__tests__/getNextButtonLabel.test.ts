import { getNextButtonLabel } from '../getNextButtonLabel';

describe('getNextButtonLabel', () => {
  it('returns the menu label in random mode regardless of stage progress', () => {
    expect(getNextButtonLabel(true, 0, 1)).toBe('חזרה לתפריט');
    expect(getNextButtonLabel(true, 5, 10)).toBe('חזרה לתפריט');
  });

  it('returns the next-stage label when more stages remain', () => {
    expect(getNextButtonLabel(false, 0, 5)).toBe('לשלב הבא');
  });

  it('returns the back-to-journey label on the last stage', () => {
    expect(getNextButtonLabel(false, 4, 5)).toBe('חזרה למסלול');
  });
});
