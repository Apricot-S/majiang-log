import { PAI_MAP } from './pai.js';

export const convertDapai = (dapai: string): number | string => {
  const isLizhi = dapai.endsWith('*');
  const isMoqie = dapai.includes('_');

  const paiStr = isLizhi ? dapai.slice(0, -1) : dapai;
  const paiNumber = isMoqie ? 60 : PAI_MAP[paiStr];

  if (isLizhi) {
    return 'r' + paiNumber.toString();
  }

  return paiNumber;
};
