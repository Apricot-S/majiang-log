import { describe, it, expect } from 'vitest';
import { assertNever } from '../../lib/utils.js';

describe('assertNever', () => {
  describe('throws an error with the provided argument', () => {
    const commonMessage = 'Expected code to be unreachable, but got: ';

    it('string', () => {
      expect(() => assertNever('some invalid arg' as never)).toThrowError(
        `${commonMessage}"some invalid arg"`,
      );
    });

    it('number', () => {
      expect(() => assertNever(0 as never)).toThrowError(`${commonMessage}0`);
    });

    it('boolean', () => {
      expect(() => assertNever(true as never)).toThrowError(
        `${commonMessage}true`,
      );
    });

    it('undefined', () => {
      expect(() => assertNever(undefined as never)).toThrowError(
        `${commonMessage}undefined`,
      );
    });

    it('null', () => {
      expect(() => assertNever(null as never)).toThrowError(
        `${commonMessage}null`,
      );
    });

    it('object', () => {
      expect(() => assertNever({ a: 1 } as never)).toThrowError(
        `${commonMessage}{"a":1}`,
      );
    });
  });
});
