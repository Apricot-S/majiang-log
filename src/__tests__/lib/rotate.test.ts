import { describe, it, expect } from 'vitest';
import { rotatePlayer, rotateOrder } from '../../lib/rotate.js';

describe('rotatePlayer', () => {
  describe('If `jushu` is 0, does not rotate the player.', () => {
    it('player: 0, jushu: 0 -> 0', () => {
      expect(rotatePlayer(0, 0)).toBe(0);
    });

    it('player: 3, jushu: 0 -> 3', () => {
      expect(rotatePlayer(3, 0)).toBe(3);
    });
  });

  describe('If `jushu` is positive, rotates the player \
    from the position in the round to the position at the start of the game.\
    ', () => {
    it('player: 0, jushu: 1 -> 1', () => {
      expect(rotatePlayer(0, 1)).toBe(1);
    });

    it('player: 3, jushu: 1 -> 0', () => {
      expect(rotatePlayer(3, 1)).toBe(0);
    });

    it('player: 0, jushu: 2 -> 2', () => {
      expect(rotatePlayer(0, 2)).toBe(2);
    });

    it('player: 3, jushu: 2 -> 1', () => {
      expect(rotatePlayer(3, 2)).toBe(1);
    });

    it('player: 0, jushu: 3 -> 3', () => {
      expect(rotatePlayer(0, 3)).toBe(3);
    });

    it('player: 3, jushu: 3 -> 2', () => {
      expect(rotatePlayer(3, 3)).toBe(2);
    });
  });

  describe('If `jushu` is negative, rotates the player \
    from the position at the start of the game to the position in the round.\
    ', () => {
    it('player: 0, jushu: -1 -> 3', () => {
      expect(rotatePlayer(0, -1)).toBe(3);
    });

    it('player: 3, jushu: -1 -> 2', () => {
      expect(rotatePlayer(3, -1)).toBe(2);
    });

    it('player: 0, jushu: -2 -> 2', () => {
      expect(rotatePlayer(0, -2)).toBe(2);
    });

    it('player: 3, jushu: -2 -> 1', () => {
      expect(rotatePlayer(3, -2)).toBe(1);
    });

    it('player: 0, jushu: -3 -> 1', () => {
      expect(rotatePlayer(0, -3)).toBe(1);
    });

    it('player: 3, jushu: -3 -> 0', () => {
      expect(rotatePlayer(3, -3)).toBe(0);
    });
  });
});

describe('rotateOrder', () => {
  describe('If `jushu` is 0, does not rotate the order.', () => {
    it('[0, 1, 2, 3], jushu: 0 -> [0, 1, 2, 3]', () => {
      expect(rotateOrder([0, 1, 2, 3], 0)).toEqual([0, 1, 2, 3]);
    });
  });

  describe('If `jushu` is positive, rotates the order \
    from the order in the round to the order at the start of the game.', () => {
    it('[0, 1, 2, 3], jushu: 1 -> [3, 0, 1, 2]', () => {
      expect(rotateOrder([0, 1, 2, 3], 1)).toEqual([3, 0, 1, 2]);
    });

    it('[0, 1, 2, 3], jushu: 2 -> [2, 3, 0, 1]', () => {
      expect(rotateOrder([0, 1, 2, 3], 2)).toEqual([2, 3, 0, 1]);
    });

    it('[0, 1, 2, 3], jushu: 3 -> [1, 2, 3, 0]', () => {
      expect(rotateOrder([0, 1, 2, 3], 3)).toEqual([1, 2, 3, 0]);
    });
  });

  describe('If `jushu` is negative, rotates the order \
    from the order at the start of the game to the order in the round.', () => {
    it('[0, 1, 2, 3], jushu: -1 -> [1, 2, 3, 0]', () => {
      expect(rotateOrder([0, 1, 2, 3], -1)).toEqual([1, 2, 3, 0]);
    });

    it('[0, 1, 2, 3], jushu: -2 -> [2, 3, 0, 1]', () => {
      expect(rotateOrder([0, 1, 2, 3], -2)).toEqual([2, 3, 0, 1]);
    });

    it('[0, 1, 2, 3], jushu: -3 -> [3, 0, 1, 2]', () => {
      expect(rotateOrder([0, 1, 2, 3], -3)).toEqual([3, 0, 1, 2]);
    });
  });

  describe('Supports empty arrays.', () => {
    it('[], jushu: 0 -> []', () => {
      expect(rotateOrder([], 0)).toEqual([]);
    });

    it('[], jushu: 3 -> []', () => {
      expect(rotateOrder([], 3)).toEqual([]);
    });
  });
});
