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

const ZHUANGJIA_ZIMO_TABLE: { [key: string]: string } = {
  '20符2飜': '700',
  '20符3飜': '1300',
  '20符4飜': '2600',
  '25符3飜': '1600',
  '25符4飜': '3200',
  '30符1飜': '500',
  '30符2飜': '1000',
  '30符3飜': '2000',
  '30符4飜': '3900',
  '40符1飜': '700',
  '40符2飜': '1300',
  '40符3飜': '2600',
  '50符1飜': '800',
  '50符2飜': '1600',
  '50符3飜': '3200',
  '60符1飜': '1000',
  '60符2飜': '2000',
  '60符3飜': '3900',
  '70符1飜': '1200',
  '70符2飜': '2300',
  '80符1飜': '1300',
  '80符2飜': '2600',
  '90符1飜': '1500',
  '90符2飜': '2900',
  '100符1飜': '1600',
  '100符2飜': '3200',
  '110符2飜': '3600',
  満貫: '4000',
  跳満: '6000',
  倍満: '8000',
  三倍満: '12000',
  役満: '16000',
} as const;

const SANJIA_ZIMO_TABLE: { [key: string]: string } = {
  '20符2飜': '400-700',
  '20符3飜': '700-1300',
  '20符4飜': '1300-2600',
  '25符3飜': '800-1600',
  '25符4飜': '1600-3200',
  '30符1飜': '300-500',
  '30符2飜': '500-1000',
  '30符3飜': '1000-2000',
  '30符4飜': '2000-3900',
  '40符1飜': '400-700',
  '40符2飜': '700-1300',
  '40符3飜': '1300-2600',
  '50符1飜': '400-800',
  '50符2飜': '800-1600',
  '50符3飜': '1600-3200',
  '60符1飜': '500-1000',
  '60符2飜': '1000-2000',
  '60符3飜': '2000-3900',
  '70符1飜': '600-1200',
  '70符2飜': '1200-2300',
  '80符1飜': '700-1300',
  '80符2飜': '1300-2600',
  '90符1飜': '800-1500',
  '90符2飜': '1500-2900',
  '100符1飜': '800-1600',
  '100符2飜': '1600-3200',
  '110符2飜': '1800-3600',
  満貫: '2000-4000',
  跳満: '3000-6000',
  倍満: '4000-8000',
  三倍満: '6000-12000',
  役満: '8000-16000',
} as const;

const ZHUANGJIA_DAMANGUAN_ZIMO_TABLE: { [key: number]: string } = {
  1: '16000',
  2: '32000',
  3: '48000',
  4: '64000',
  5: '80000',
  6: '96000',
} as const;

const SANJIA_DAMANGUAN_ZIMO_TABLE: { [key: number]: string } = {
  1: '8000-16000',
  2: '16000-32000',
  3: '24000-48000',
  4: '32000-64000',
  5: '40000-80000',
  6: '48000-96000',
} as const;

const DAMANGUAN_BAOJIA_MAP: { [key: string]: number } = {
  '-': 3, // Shangjia
  '=': 2, // Duimian
  '+': 1, // Xiajia
} as const;

const HUPAI_NAME_MAP: { [key: string]: string } = {
  立直: '立直',
  ダブル立直: '両立直',
  一発: '一発',
  海底摸月: '海底摸月',
  河底撈魚: '河底撈魚',
  嶺上開花: '嶺上開花',
  槍槓: '槍槓',
  天和: '天和',
  地和: '地和',
  門前清自摸和: '門前清自摸和',
  '場風 東': '場風 東',
  '場風 南': '場風 南',
  '場風 西': '場風 西',
  '場風 北': '場風 北',
  '自風 東': '自風 東',
  '自風 南': '自風 南',
  '自風 西': '自風 西',
  '自風 北': '自風 北',
  '翻牌 白': '役牌 白',
  '翻牌 發': '役牌 發',
  '翻牌 中': '役牌 中',
  平和: '平和',
  断幺九: '断幺九',
  一盃口: '一盃口',
  三色同順: '三色同順',
  一気通貫: '一気通貫',
  混全帯幺九: '混全帯幺九',
  七対子: '七対子',
  対々和: '対々和',
  三暗刻: '三暗刻',
  三槓子: '三槓子',
  三色同刻: '三色同刻',
  混老頭: '混老頭',
  小三元: '小三元',
  混一色: '混一色',
  純全帯幺九: '純全帯幺九',
  二盃口: '二盃口',
  清一色: '清一色',
  国士無双十三面: '国士無双１３面',
  国士無双: '国士無双',
  四暗刻単騎: '四暗刻単騎',
  四暗刻: '四暗刻',
  大三元: '大三元',
  大四喜: '大四喜',
  小四喜: '小四喜',
  字一色: '字一色',
  緑一色: '緑一色',
  清老頭: '清老頭',
  四槓子: '四槓子',
  純正九蓮宝燈: '純正九蓮宝燈',
  九蓮宝燈: '九蓮宝燈',
  ドラ: 'ドラ',
  赤ドラ: '赤ドラ',
  裏ドラ: '裏ドラ',
  // The following items are used to convert from Tenhou to Majiang.
  '役牌 白': '役牌 白',
  '役牌 發': '役牌 發',
  '役牌 中': '役牌 中',
  両立直: '両立直',
  国士無双１３面: '国士無双１３面',
} as const;

const convertHule = (hule: MajiangHule): Hule => {
  const hujia = hule.l;
  const baojia = hule.baojia ?? hujia;
  const baoIndicator = hule.hupai.find((h) => h.baojia !== undefined)?.baojia;
  const damanguanBaojia =
    baoIndicator === undefined
      ? hujia
      : rotatePlayer(DAMANGUAN_BAOJIA_MAP[baoIndicator], hujia);
  const libaopai = hule.fubaopai?.map((p) => PAI_MAP[p]) ?? [];

  const damanguan = hule.damanguan;
  const isDamanguan = damanguan !== undefined;
  const hupai: string[] = isDamanguan
    ? hule.hupai.map((item) => `${HUPAI_NAME_MAP[item.name]}(役満)`)
    : hule.hupai.map(
        (item) => `${HUPAI_NAME_MAP[item.name]}(${item.fanshu}飜)`,
      );
  // Even in the case of "ダブル役満", it will be displayed as "役満".

  const fanshu = hule.fanshu ?? 0;
  const fu = hule.fu ?? 0;
  const prefix = isDamanguan
    ? '役満'
    : fanshu >= 13
      ? '役満'
      : fanshu >= 11
        ? '三倍満'
        : fanshu >= 8
          ? '倍満'
          : fanshu >= 6
            ? '跳満'
            : fanshu >= 5
              ? '満貫'
              : fanshu >= 4 && fu >= 40
                ? '満貫'
                : fanshu >= 3 && fu >= 70
                  ? '満貫'
                  : `${fu}符${fanshu}飜`;

  const defen =
    hule.baojia === null
      ? hujia === 0
        ? isDamanguan
          ? ZHUANGJIA_DAMANGUAN_ZIMO_TABLE[damanguan]
          : ZHUANGJIA_ZIMO_TABLE[prefix]
        : isDamanguan
          ? SANJIA_DAMANGUAN_ZIMO_TABLE[damanguan]
          : SANJIA_ZIMO_TABLE[prefix]
      : hule.defen;

  const suffix = hule.baojia === null && hujia === 0 ? '∀' : '';

  return {
    name: '和了',
    fenpei: hule.fenpei,
    players: [hujia, baojia, damanguanBaojia],
    detail: [`${prefix}${defen}点${suffix}`, ...hupai],
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
      const mianzi = convertFulou(action.fulou.m);
      tempMopai[action.fulou.l].push(mianzi);

      // When daminggang, put a placeholder in dapai.
      if (mianzi.includes('m')) {
        tempDapai[action.fulou.l].push(0);
      }
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
