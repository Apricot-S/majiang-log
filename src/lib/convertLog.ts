import { Ajv } from 'ajv';
import {
  MajiangHule,
  MajiangLog,
  MajiangPingju,
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

const convertDapai = (dapai: string): number | string => {
  const isLizhi = dapai.endsWith('*');
  const isMoqie = dapai.includes('_');

  const paiStr = isLizhi ? dapai.slice(0, -1) : dapai;
  const paiNumber = isMoqie ? 60 : PAI_MAP[paiStr];

  if (isLizhi) {
    return 'r' + paiNumber.toString();
  }

  return paiNumber;
};

const FULOU_TARGET_MAP: { [key: string]: number } = {
  '-': 0, // Shangjia
  '=': 1, // Duimian
  '+': 2, // Xiajia
} as const;

const convertFulou = (mianzi: string): string => {
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

const convertGang = (mianzi: string): string => {
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

const convertHule = (
  hule: MajiangHule,
): {
  name: string;
  fenpei: number[];
  libaopai?: number[];
  detail?: (number | string)[];
} => {
  return { name: '和了', fenpei: hule.fenpei };
};

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

const convertPingju = (
  pingju: MajiangPingju,
): { name: string; fenpei?: number[] } => {
  const name = PINGJU_MAP[pingju.name];
  if (name === '流局' || name === '流し満貫') {
    return { name: name, fenpei: pingju.fenpei };
  }
  return { name: name };
};

const rotateOrder = <T>(arg: T[], qijia: number, jushu: number): T[] => {
  const numItem = arg.length;
  const rotationOffset = (qijia - jushu + numItem) % numItem;
  return arg.map((_, i) => arg[(i + rotationOffset) % numItem]);
};

const convertRound = (
  round: MajiangRound,
  qijia: number,
): (number | string | number[])[][] => {
  if (round[0].qipai === undefined) {
    throw new Error('There is no qipai at the beginning of the log.');
  }

  const qipai = round[0].qipai;
  const numPlayer = qipai.defen.length;

  const ju = qipai.zhuangfeng * numPlayer + qipai.jushu;
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

  const tempMopai: (number | string)[][] = [...Array(numPlayer)].map(() => []);
  const tempDapai: (number | string)[][] = [...Array(numPlayer)].map(() => []);
  const end = [];
  for (const action of round) {
    if (action.zimo !== undefined) {
      tempMopai[action.zimo.l].push(PAI_MAP[action.zimo.p]);
    } else if (action.dapai !== undefined) {
      tempDapai[action.dapai.l].push(convertDapai(action.dapai.p));
    } else if (action.fulou !== undefined) {
      tempMopai[action.fulou.l].push(convertFulou(action.fulou.m));
    } else if (action.gang !== undefined) {
      tempDapai[action.gang.l].push(convertGang(action.gang.m));
    } else if (action.gangzimo !== undefined) {
      tempMopai[action.gangzimo.l].push(PAI_MAP[action.gangzimo.p]);
    } else if (action.kaigang !== undefined) {
      baopai.push(PAI_MAP[action.kaigang.baopai]);
    } else if (action.hule !== undefined) {
      const hule = convertHule(action.hule);
      end.push(hule.name, rotateOrder(hule.fenpei, qijia, qipai.jushu));
    } else if (action.pingju !== undefined) {
      const pingju = convertPingju(action.pingju);
      if (pingju.fenpei !== undefined) {
        end.push(pingju.name, rotateOrder(pingju.fenpei, qijia, qipai.jushu));
      } else {
        end.push(pingju.name);
      }
    }
  }
  const mopai = rotateOrder(tempMopai, qijia, qipai.jushu);
  const dapai = rotateOrder(tempDapai, qijia, qipai.jushu);

  const actions = shoupai.flatMap((_, i) => [shoupai[i], mopai[i], dapai[i]]);
  return [[ju, changbang, lizhibang], defen, baopai, libaopai, ...actions, end];
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
