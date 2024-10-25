import { describe, it, expect } from 'vitest';
import { convertDapai } from '../../lib/dapai.js';

describe('convertDapai', () => {
  describe('discard from hand', () => {
    for (let i = 1; i <= 9; i++) {
      it(`m${i} -> 1${i}`, () => {
        expect(convertDapai(`m${i}`)).toBe(10 + i);
      });
    }

    for (let i = 1; i <= 9; i++) {
      it(`p${i} -> 2${i}`, () => {
        expect(convertDapai(`p${i}`)).toBe(20 + i);
      });
    }

    for (let i = 1; i <= 9; i++) {
      it(`s${i} -> 3${i}`, () => {
        expect(convertDapai(`s${i}`)).toBe(30 + i);
      });
    }

    for (let i = 1; i <= 7; i++) {
      it(`z${i} -> 4${i}`, () => {
        expect(convertDapai(`z${i}`)).toBe(40 + i);
      });
    }

    it('m0 -> 51', () => {
      expect(convertDapai('m0')).toBe(51);
    });

    it('p0 -> 52', () => {
      expect(convertDapai('p0')).toBe(52);
    });

    it('s0 -> 53', () => {
      expect(convertDapai('s0')).toBe(53);
    });
  });

  describe('discard the just drawn tile', () => {
    for (let i = 1; i <= 9; i++) {
      it(`m${i}_ -> 60`, () => {
        expect(convertDapai(`m${i}_`)).toBe(60);
      });
    }

    for (let i = 1; i <= 9; i++) {
      it(`p${i}_ -> 60`, () => {
        expect(convertDapai(`p${i}_`)).toBe(60);
      });
    }

    for (let i = 1; i <= 9; i++) {
      it(`s${i}_ -> 60`, () => {
        expect(convertDapai(`s${i}_`)).toBe(60);
      });
    }

    for (let i = 1; i <= 7; i++) {
      it(`z${i}_ -> 60`, () => {
        expect(convertDapai(`z${i}_`)).toBe(60);
      });
    }

    it('m0_ -> 60', () => {
      expect(convertDapai('m0_')).toBe(60);
    });

    it('p0_ -> 60', () => {
      expect(convertDapai('p0_')).toBe(60);
    });

    it('s0_ -> 60', () => {
      expect(convertDapai('s0_')).toBe(60);
    });
  });

  describe('riichi with discard from hand', () => {
    for (let i = 1; i <= 9; i++) {
      it(`m${i}* -> "r1${i}"`, () => {
        expect(convertDapai(`m${i}*`)).toBe(`r${10 + i}`);
      });
    }

    for (let i = 1; i <= 9; i++) {
      it(`p${i}* -> "r2${i}"`, () => {
        expect(convertDapai(`p${i}*`)).toBe(`r${20 + i}`);
      });
    }

    for (let i = 1; i <= 9; i++) {
      it(`s${i}* -> "r3${i}"`, () => {
        expect(convertDapai(`s${i}*`)).toBe(`r${30 + i}`);
      });
    }

    for (let i = 1; i <= 7; i++) {
      it(`z${i}* -> "r4${i}"`, () => {
        expect(convertDapai(`z${i}*`)).toBe(`r${40 + i}`);
      });
    }

    it('m0* -> "r51"', () => {
      expect(convertDapai('m0*')).toBe('r51');
    });

    it('p0* -> "r52"', () => {
      expect(convertDapai('p0*')).toBe('r52');
    });

    it('s0* -> "r53"', () => {
      expect(convertDapai('s0*')).toBe('r53');
    });
  });

  describe('riichi with discard the just drawn tile', () => {
    for (let i = 1; i <= 9; i++) {
      it(`m${i}_* -> "r60"`, () => {
        expect(convertDapai(`m${i}_*`)).toBe('r60');
      });
    }

    for (let i = 1; i <= 9; i++) {
      it(`p${i}_* -> "r60"`, () => {
        expect(convertDapai(`p${i}_*`)).toBe('r60');
      });
    }

    for (let i = 1; i <= 9; i++) {
      it(`s${i}_* -> "r60"`, () => {
        expect(convertDapai(`s${i}_*`)).toBe('r60');
      });
    }

    for (let i = 1; i <= 7; i++) {
      it(`z${i}_* -> "r60"`, () => {
        expect(convertDapai(`z${i}_*`)).toBe('r60');
      });
    }

    it('m0_* -> "r60"', () => {
      expect(convertDapai('m0_*')).toBe('r60');
    });

    it('p0_* -> "r60"', () => {
      expect(convertDapai('p0_*')).toBe('r60');
    });

    it('s0_* -> "r60"', () => {
      expect(convertDapai('s0_*')).toBe('r60');
    });
  });
});
