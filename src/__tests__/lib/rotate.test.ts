import { test, expect } from 'vitest';
import { rotatePlayer } from '../../lib/rotate.js';

test('player: 0, jushu: 0 -> position at the start of the game: 0', () => {
  expect(rotatePlayer(0, 0)).toBe(0);
});

test('player: 3, jushu: 0 -> position at the start of the game: 3', () => {
  expect(rotatePlayer(3, 0)).toBe(3);
});

test('player: 0, jushu: 1 -> position at the start of the game: 1', () => {
  expect(rotatePlayer(0, 1)).toBe(1);
});
