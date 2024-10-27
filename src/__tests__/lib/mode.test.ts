import { describe, it, expect } from 'vitest';
import { MODE, isMode } from '../../lib/mode.js';

describe('MODE', () => {
  it('should have "log"', () => {
    expect(MODE.Log).toBe('log');
  });

  it('should have "viewer"', () => {
    expect(MODE.Viewer).toBe('viewer');
  });
});

describe('isMode', () => {
  describe('valid modes', () => {
    it('should return true for "log"', () => {
      expect(isMode('log')).toBe(true);
    });

    it('should return true for "viewer"', () => {
      expect(isMode('viewer')).toBe(true);
    });
  });

  describe('invalid modes', () => {
    it('should return false for ""', () => {
      expect(isMode('')).toBe(false);
    });

    it('should return false for "log "', () => {
      expect(isMode('log ')).toBe(false);
    });

    it('should return false for " viewer"', () => {
      expect(isMode(' viewer')).toBe(false);
    });
  });
});
