import { test, expect } from 'vitest';
import { assertNever } from '../../lib/utils.js';

test('throws an error with the provided argument: string', () => {
  expect(() => assertNever('some invalid arg' as never)).toThrowError(
    'Expected code to be unreachable, but got: "some invalid arg"',
  );
});

test('throws an error with the provided argument: number', () => {
  expect(() => assertNever(1 as never)).toThrowError(
    'Expected code to be unreachable, but got: 1',
  );
});

test('throws an error with the provided argument: boolean', () => {
  expect(() => assertNever(true as never)).toThrowError(
    'Expected code to be unreachable, but got: true',
  );
});

test('throws an error with the provided argument: undefined', () => {
  expect(() => assertNever(undefined as never)).toThrowError(
    'Expected code to be unreachable, but got: undefined',
  );
});

test('throws an error with the provided argument: null', () => {
  expect(() => assertNever(null as never)).toThrowError(
    'Expected code to be unreachable, but got: null',
  );
});

test('throws an error with the provided argument: object', () => {
  expect(() => assertNever({ a: 1 } as never)).toThrowError(
    'Expected code to be unreachable, but got: {"a":1}',
  );
});
