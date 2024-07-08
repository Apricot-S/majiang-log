import { MajiangPingju } from './schema.js';

const PINGJU_MAP: { [key: string]: string } = {
  荒牌平局: '流局',
  流し満貫: '流し満貫',
  九種九牌: '九種九牌',
  四風連打: '四風連打',
  四家立直: '四家立直',
  三家和: '三家和了',
  四開槓: '四槓散了',
  // The following items are used to convert from Tenhou to Majiang.
  流局: '流局',
  三家和了: '三家和了',
  四槓散了: '四槓散了',
} as const;

export const convertPingju = (
  pingju: MajiangPingju,
): { name: string; fenpei?: number[] } => {
  const name = PINGJU_MAP[pingju.name];
  return name === '流局' || name === '流し満貫'
    ? { name: name, fenpei: pingju.fenpei }
    : { name: name };
};
