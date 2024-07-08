import { PAI_MAP } from './pai.js';

export const convertShoupai = (shoupai: string): number[] => {
  const decomposed = shoupai.match(/([mpsz]\d+)/g);
  if (!decomposed) {
    return [];
  }

  const transformed = decomposed.flatMap((element) => {
    const suit = element.charAt(0);
    const numbers = element.slice(1).split('');
    return numbers.map((number) => suit + number);
  });

  return transformed.map((value) => PAI_MAP[value]);
};
