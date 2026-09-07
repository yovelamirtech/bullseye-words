import { normalizeSofit } from '../hebrew';

describe('normalizeSofit', () => {
  it.each([
    ['ך', 'כ'],
    ['ם', 'מ'],
    ['ן', 'נ'],
    ['ף', 'פ'],
    ['ץ', 'צ'],
  ])('maps final letter %s to its regular form %s', (sofit, regular) => {
    expect(normalizeSofit(sofit)).toBe(regular);
  });

  it('leaves regular letters unchanged', () => {
    expect(normalizeSofit('אבג')).toBe('אבג');
  });

  it('normalizes final letters anywhere in a word', () => {
    expect(normalizeSofit('שלום')).toBe('שלומ');
    expect(normalizeSofit('מלך')).toBe('מלכ');
  });

  it('leaves non-Hebrew characters untouched', () => {
    expect(normalizeSofit('abc123')).toBe('abc123');
  });

  it('returns an empty string for an empty input', () => {
    expect(normalizeSofit('')).toBe('');
  });
});
