import { PAI_MAP } from './pai.js';

export const FULOU_TARGET_MAP: { [key: string]: number } = {
  '-': 0, // Shangjia
  '=': 1, // Duimian
  '+': 2, // Xiajia
} as const;

export const convertFulou = (mianzi: string): string => {
  const match = mianzi.match(/(\d)([-+=])/);
  if (match === null) {
    throw new Error('The tile obtained from another player cannot be found.');
  }

  const suit = mianzi.charAt(0);
  const obtainedTile = PAI_MAP[suit + match[1]].toString();
  const obtainedFrom = FULOU_TARGET_MAP[match[2]];
  const dazi = Array.from(mianzi.replace(match[0], ''))
    .slice(1)
    .map((item) => PAI_MAP[suit + item].toString());

  const uniqueChars = new Set(mianzi);
  const isChi = uniqueChars.size === 5;
  const isGang = dazi.length === 3;
  const isPeng = !isChi && !isGang;
  const fulouPrefix = isChi ? 'c' : isPeng ? 'p' : 'm';

  const insertPosition = isGang && obtainedFrom === 2 ? 3 : obtainedFrom;
  dazi.splice(insertPosition, 0, fulouPrefix + obtainedTile);
  return dazi.join('');
};
