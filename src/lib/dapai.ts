import { PAI_MAP } from './pai.js';

export const convertDapai = (dapai: string): number | string => {
  const isLizhi = dapai.endsWith('*');
  const paiStr1 = isLizhi ? dapai.slice(0, -1) : dapai;

  const isMoqie = paiStr1.endsWith('_');
  const paiStr2 = isMoqie ? paiStr1.slice(0, -1) : paiStr1;

  const paiNumber1 = PAI_MAP[paiStr2];

  if (paiNumber1 === undefined) {
    return dapai;
  }

  const paiNumber2 = isMoqie ? 60 : paiNumber1;

  return isLizhi ? 'r' + paiNumber2.toString() : paiNumber2;
};
