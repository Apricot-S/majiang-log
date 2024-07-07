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

type Hule = {
  name: string;
  fenpei: number[];
  players: number[];
  detail: string[];
  libaopai: number[];
};

const convertHule = (hule: MajiangHule): Hule => {
  const hujia = hule.l;
  const baojia = hule.baojia ?? hujia;
  const damanguanBaojia = hujia;
  const libaopai = hule.fubaopai?.map((p) => PAI_MAP[p]) ?? [];

  const isDamanguan = hule.damanguan !== undefined;
  const hupai: string[] = isDamanguan
    ? hule.hupai.map((item) => `${item.name}(役満)`)
    : hule.hupai.map((item) => `${item.name}(${item.fanshu}飜)`);

  return {
    name: '和了',
    fenpei: hule.fenpei,
    players: [hujia, baojia, damanguanBaojia],
    detail: [`${hule.defen}点`, ...hupai],
    libaopai: libaopai,
  };
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

const rotatePlayer = (player: number, jushu: number): number => {
  const numPlayer = 4;
  return (player + jushu) % numPlayer;
};

const rotateOrder = <T>(arg: T[], jushu: number): T[] => {
  const numItem = arg.length;
  const rotationOffset = (numItem - jushu) % numItem;
  return arg.map((_, i) => arg[(i + rotationOffset) % numItem]);
};

const convertRound = (
  round: MajiangRound,
): (number | string | (number | string)[])[][] => {
  if (round[0].qipai === undefined) {
    throw new Error('There is no qipai at the beginning of the log.');
  }

  const qipai = round[0].qipai;
  const numPlayer = qipai.defen.length;

  const ju = qipai.zhuangfeng * numPlayer + qipai.jushu;
  const changbang = qipai.changbang;
  const lizhibang = qipai.lizhibang;
  const defen = rotateOrder(qipai.defen, qipai.jushu);

  const baopai = [PAI_MAP[qipai.baopai]];
  let libaopai: number[] | undefined = undefined;

  const shoupai = rotateOrder(
    qipai.shoupai.map((s) => convertShoupai(s)),
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

      if (libaopai === undefined) {
        libaopai = hule.libaopai;
      }

      const fenpei = rotateOrder(hule.fenpei, qipai.jushu);
      const players = hule.players.map((p) => rotatePlayer(p, qipai.jushu));
      end.push(hule.name, fenpei, [...players, ...hule.detail]);
    } else if (action.pingju !== undefined) {
      const pingju = convertPingju(action.pingju);
      if (pingju.fenpei !== undefined) {
        end.push(pingju.name, rotateOrder(pingju.fenpei, qipai.jushu));
      } else {
        end.push(pingju.name);
      }
    }
  }
  const mopai = rotateOrder(tempMopai, qipai.jushu);
  const dapai = rotateOrder(tempDapai, qipai.jushu);

  const actions = shoupai.flatMap((_, i) => [shoupai[i], mopai[i], dapai[i]]);

  if (libaopai === undefined) {
    libaopai = [];
  }

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
    name: rotateOrder(input.player, -input.qijia),
    // Since the conversion direction is opposite, make qijia negative
    rule: { disp: '電脳南喰赤', aka: 1 },
    log: input.log.map((round) => convertRound(round)),
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
