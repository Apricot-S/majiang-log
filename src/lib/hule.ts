import { PAI_MAP } from './pai.js';
import { rotatePlayer } from './rotate.js';
import type { MajiangHule } from './schema.js';

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

type Hule = {
  name: string;
  fenpei: number[];
  players: number[];
  detail: string[];
  libaopai: number[];
};

export const convertHule = (hule: MajiangHule): Hule => {
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
