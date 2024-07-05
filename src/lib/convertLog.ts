import { MajiangLog, TenhouLog } from './schema.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isMajiangLog = (obj: any): obj is MajiangLog => {
  return (
    typeof obj.title === 'string' &&
    Array.isArray(obj.player) &&
    obj.player.every((item: unknown) => typeof item === 'string') &&
    typeof obj.qijia === 'number' &&
    Array.isArray(obj.log) &&
    obj.log.every((item: unknown) => Array.isArray(item)) &&
    Array.isArray(obj.defen) &&
    obj.defen.every((item: unknown) => typeof item === 'number') &&
    Array.isArray(obj.point) &&
    obj.point.every((item: unknown) => typeof item === 'string') &&
    Array.isArray(obj.rank) &&
    obj.rank.every((item: unknown) => typeof item === 'number')
  );
};

export type TenhouViewerUrls = string[];

const HUPAI_NAME = [
  '門前清自摸和',
  '立直',
  '一発',
  '槍槓',
  '嶺上開花',
  '海底摸月',
  '河底撈魚',
  '平和',
  '断幺九',
  '一盃口',
  '自風 東',
  '自風 南',
  '自風 西',
  '自風 北',
  '場風 東',
  '場風 南',
  '場風 西',
  '場風 北',
  '役牌 白',
  '役牌 發',
  '役牌 中',
  '両立直',
  '七対子',
  '混全帯幺九',
  '一気通貫',
  '三色同順',
  '三色同刻',
  '三槓子',
  '対々和',
  '三暗刻',
  '小三元',
  '混老頭',
  '二盃口',
  '純全帯幺九',
  '混一色',
  '清一色',
  '',
  '天和',
  '地和',
  '大三元',
  '四暗刻',
  '四暗刻単騎',
  '字一色',
  '緑一色',
  '清老頭',
  '九蓮宝燈',
  '純正九蓮宝燈',
  '国士無双',
  '国士無双１３面',
  '大四喜',
  '小四喜',
  '四槓子',
  'ドラ',
  '裏ドラ',
  '赤ドラ',
] as const;

const PINGJU_NAME = {
  nm: '流し満貫',
  yao9: '九種九牌',
  kaze4: '四風連打',
  reach4: '四家立直',
  ron3: '三家和了',
  kan4: '四槓散了',
} as const;

const VIEWER_URL_HEAD = 'https://tenhou.net/5/#json=';

export const MODE = {
  Log: 'log',
  Viewer: 'viewer',
} as const;

export type Mode = (typeof MODE)[keyof typeof MODE];

const isMode = (mode: string): mode is Mode => {
  const modes: string[] = Object.values(MODE);
  return modes.includes(mode);
};

export const convertLog = (
  input: object,
  mode: string,
): TenhouLog | TenhouViewerUrls => {
  if (!isMode(mode)) {
    throw new Error(`Invalid mode: ${mode}`);
  }

  if (!isMajiangLog(input)) {
    throw new Error(`Invalid input: ${input}`);
  }

  const log: TenhouLog = {
    lobby: 0,
    log: [],
    name: input.player,
    ratingc: 'PF4',
    rule: { aka: 1, disp: '電脳南喰赤' },
    title: ['電脳麻将', ''],
    ver: '2.3',
  };

  if (mode === MODE.Viewer) {
    return [VIEWER_URL_HEAD + JSON.stringify(log)];
  }
  return log;
};
