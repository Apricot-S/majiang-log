import { Ajv } from 'ajv';
import {
  MajiangLog,
  MajiangRound,
  MAJIANG_LOG_SCHEMA,
  TenhouLog,
} from './schema.js';

const ajv = new Ajv();
const validateMajiangLog = ajv.compile(MAJIANG_LOG_SCHEMA);
const isMajiangLog = (obj: unknown): obj is MajiangLog => {
  const valid = validateMajiangLog(obj);
  return valid;
};

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

const PAI_MAP: { [key: string]: number } = {
  m0: 51, // 赤五萬
  m1: 11,
  m2: 12,
  m3: 13,
  m4: 14,
  m5: 15,
  m6: 16,
  m7: 17,
  m8: 18,
  m9: 19,
  p0: 52, // 赤五筒
  p1: 21,
  p2: 22,
  p3: 23,
  p4: 24,
  p5: 25,
  p6: 26,
  p7: 27,
  p8: 28,
  p9: 29,
  s0: 53, // 赤五索
  s1: 31,
  s2: 32,
  s3: 33,
  s4: 34,
  s5: 35,
  s6: 36,
  s7: 37,
  s8: 38,
  s9: 39,
  z1: 41, // 東
  z2: 42, // 南
  z3: 43, // 西
  z4: 44, // 北
  z5: 45, // 白
  z6: 46, // 發
  z7: 47, // 中
} as const;

const convertShoupai = (shoupai: string): number[] => {
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

const rotateOrder = <T>(arg: T[], qijia: number, jushu: number): T[] => {
  const numPlayer = arg.length;
  const rotationOffset = (qijia + jushu) % numPlayer;
  return arg.map((_, i) => arg[(i + rotationOffset) % numPlayer]);
};

const convertRound = (
  round: MajiangRound,
  qijia: number,
): (number | string)[][] => {
  if (round[0].qipai === undefined) {
    throw new Error('There is no qipai at the beginning of the log.');
  }

  const qipai = round[0].qipai;
  const ju = qipai.zhuangfeng * qipai.defen.length + qipai.jushu;
  const changbang = qipai.changbang;
  const lizhibang = qipai.lizhibang;
  const defen = rotateOrder(qipai.defen, qijia, qipai.jushu);
  const baopai = [PAI_MAP[qipai.baopai]];
  const libaopai: number[] = [];
  const shoupai = rotateOrder(
    qipai.shoupai.map((s) => convertShoupai(s)),
    qijia,
    qipai.jushu,
  );
  const gotPai = rotateOrder([[0], [1], [2], [3]], qijia, qipai.jushu);
  const dapai = rotateOrder([[0], [1], [2], [3]], qijia, qipai.jushu);
  const actions = shoupai.flatMap((_, i) => [shoupai[i], gotPai[i], dapai[i]]);
  return [[ju, changbang, lizhibang], defen, baopai, libaopai, ...actions];
};

type TenhouViewerUrls = string[];

const VIEWER_URL_HEAD = 'https://tenhou.net/5/#json=';

const logToUrls = (log: TenhouLog): TenhouViewerUrls => {
  return log.log.map((logElement) => {
    const newLog: TenhouLog = { ...log, log: [logElement] };
    return VIEWER_URL_HEAD + JSON.stringify(newLog);
  });
};

export const MODE = {
  Log: 'log',
  Viewer: 'viewer',
} as const;

export type Mode = (typeof MODE)[keyof typeof MODE];

const isMode = (mode: string): mode is Mode => {
  const modes: string[] = Object.values(MODE);
  return modes.includes(mode);
};

const assertNever = (arg: never): never => {
  const value = JSON.stringify(arg);
  throw new Error(`Expected code to be unreachable, but got: ${value}`);
};

export const convertLog = (
  input: object,
  mode: string,
): TenhouLog | TenhouViewerUrls => {
  if (!isMode(mode)) {
    throw new Error(`Invalid mode: ${mode}`);
  }

  if (!isMajiangLog(input)) {
    throw new Error(
      `Invalid input:\n${JSON.stringify(validateMajiangLog.errors, null, 2)}`,
    );
  }

  const log: TenhouLog = {
    title: ['', ''],
    name: rotateOrder(input.player, input.qijia, 0),
    rule: { disp: '電脳南喰赤', aka: 1 },
    log: input.log.map((round) => convertRound(round, input.qijia)),
  };

  switch (mode) {
    case MODE.Log:
      return log;
    case MODE.Viewer:
      return logToUrls(log);
    default:
      return assertNever(mode);
  }
};
