import test from 'node:test';
import assert from 'node:assert/strict';
import { interpret } from './interpreter.ts';

function deadlineFor(input: string, referenceDate: string) {
  const result = interpret(input, new Date(referenceDate));
  assert.equal(result.items.length, 1);
  return result.items[0];
}

test('bare Friday resolves to Friday when reference date is Friday', () => {
  const item = deadlineFor('Finish report by Friday', '2026-10-23T10:00:00.000Z');
  assert.equal(item.deadlineLabel, 'Fri');
  assert.equal(item.isoDeadline, '2026-10-23T23:59:00.000Z');
});

test('this week resolves to the current Friday on Friday', () => {
  const item = deadlineFor('Finish report this week', '2026-10-23T10:00:00.000Z');
  assert.equal(item.deadlineLabel, 'this week');
  assert.equal(item.isoDeadline, '2026-10-23T23:59:00.000Z');
});

test('this week on Saturday resolves to the Friday just passed', () => {
  const item = deadlineFor('Finish report this week', '2026-10-24T10:00:00.000Z');
  assert.equal(item.isoDeadline, '2026-10-23T23:59:00.000Z');
});

test('this week on Sunday resolves to the Friday just passed', () => {
  const item = deadlineFor('Finish report this week', '2026-10-25T10:00:00.000Z');
  assert.equal(item.isoDeadline, '2026-10-23T23:59:00.000Z');
});

test('this week on Monday resolves to Friday later in the same week', () => {
  const item = deadlineFor('Finish report this week', '2026-10-19T10:00:00.000Z');
  assert.equal(item.isoDeadline, '2026-10-23T23:59:00.000Z');
});

test('bare Friday on Saturday resolves to next Friday', () => {
  const item = deadlineFor('Finish report by Friday', '2026-10-24T10:00:00.000Z');
  assert.equal(item.isoDeadline, '2026-10-30T23:59:00.000Z');
});

test('next Friday on Friday resolves to the following Friday', () => {
  const item = deadlineFor('Finish report next Friday', '2026-10-23T10:00:00.000Z');
  assert.equal(item.isoDeadline, '2026-10-30T23:59:00.000Z');
});
