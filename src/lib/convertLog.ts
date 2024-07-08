import { Ajv } from 'ajv';
import { convertDapai } from './dapai.js';
import { convertFulou } from './fulou.js';
import { convertGang } from './gang.js';
import { convertHule } from './hule.js';
import { MODE, isMode } from './mode.js';
import { PAI_MAP } from './pai.js';
import { convertPingju } from './pingju.js';
import { rotateOrder, rotatePlayer } from './rotate.js';
import {
  MajiangAction,
  MajiangLog,
  MajiangRound,
  MAJIANG_LOG_SCHEMA,
  TenhouLog,
} from './schema.js';
import { convertShoupai } from './shoupai.js';
import { assertNever } from './utils.js';

const ajv = new Ajv();
const validateMajiangLog = ajv.compile(MAJIANG_LOG_SCHEMA);
const isMajiangLog = (obj: unknown): obj is MajiangLog => {
  const valid = validateMajiangLog(obj);
  return valid;
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
  const end: (string | (string | number)[])[] = [];

  const handlers = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    qipai: (action: MajiangAction) => {},
    zimo: (action: MajiangAction) => {
      tempMopai[action.zimo!.l].push(PAI_MAP[action.zimo!.p]);
    },
    dapai: (action: MajiangAction) => {
      tempDapai[action.dapai!.l].push(convertDapai(action.dapai!.p));
    },
    fulou: (action: MajiangAction) => {
      const mianzi = convertFulou(action.fulou!.m);
      tempMopai[action.fulou!.l].push(mianzi);

      // When daminggang, put a placeholder in dapai.
      if (mianzi.includes('m')) {
        tempDapai[action.fulou!.l].push(0);
      }
    },
    gang: (action: MajiangAction) => {
      tempDapai[action.gang!.l].push(convertGang(action.gang!.m));
    },
    gangzimo: (action: MajiangAction) => {
      tempMopai[action.gangzimo!.l].push(PAI_MAP[action.gangzimo!.p]);
    },
    kaigang: (action: MajiangAction) => {
      baopai.push(PAI_MAP[action.kaigang!.baopai]);
    },
    hule: (action: MajiangAction) => {
      const hule = convertHule(action.hule!);

      if (libaopai === undefined) {
        libaopai = hule.libaopai;
      }

      const fenpei = rotateOrder(hule.fenpei, qipai.jushu);
      const players = hule.players.map((p) => rotatePlayer(p, qipai.jushu));
      end.push(hule.name, fenpei, [...players, ...hule.detail]);
    },
    pingju: (action: MajiangAction) => {
      const pingju = convertPingju(action.pingju!);
      if (pingju.fenpei !== undefined) {
        end.push(pingju.name, rotateOrder(pingju.fenpei, qipai.jushu));
      } else {
        end.push(pingju.name);
      }
    },
  };

  for (const action of round) {
    const keys = Object.keys(action);
    const key = keys[0] as keyof MajiangAction;
    const handler = handlers[key];
    if (handler) {
      handler(action);
    } else {
      throw new Error(`Unknown action: ${key}`);
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
