import { describe, expect, it } from 'vitest';
import { interpret, splitClauses } from './interpreter';

describe('splitClauses', () => {
  it.each([
    'Research and Development project proposal',
    'Q and A prep',
    'Terms and Conditions review',
    'Review the pros and cons',
    'Buy salt and pepper',
  ])('keeps "%s" as one task', input => {
    expect(splitClauses(input)).toEqual([input]);
  });

  it.each([
    ['email the professor and update my CV', 2],
    ['call mom and buy groceries', 2],
    ['finish report, book flights; water plants', 3],
    ['Write essay. Clean room', 2],
  ])('splits "%s" into %i tasks', (input, count) => {
    expect(splitClauses(input)).toHaveLength(count);
  });
});

describe('interpret', () => {
  it('returns a single item for a title containing "and"', () => {
    const { items } = interpret('Research and Development project proposal');
    expect(items).toHaveLength(1);
    expect(items[0].text).toBe('Research and Development project proposal');
  });
});
