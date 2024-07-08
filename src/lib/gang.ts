import { FULOU_TARGET_MAP } from './fulou.js';
import { PAI_MAP } from './pai.js';

export const convertGang = (mianzi: string): string => {
  const match = mianzi.match(/(\d)([-+=])/);
  const isAngang = match === null;

  const suit = mianzi.charAt(0);
  const gangzi = isAngang
    ? Array.from(mianzi)
        .slice(1)
        .map((item) => PAI_MAP[suit + item].toString())
    : Array.from(mianzi.replace(match[2], ''))
        .slice(1)
        .map((item) => PAI_MAP[suit + item].toString());

  const fulouPrefix = isAngang ? 'a' : 'k';
  const insertPosition = isAngang ? 3 : FULOU_TARGET_MAP[match[2]];
  gangzi.splice(insertPosition, 0, fulouPrefix);
  return gangzi.join('');
};
