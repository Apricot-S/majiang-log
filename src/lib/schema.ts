import { FromSchema } from 'json-schema-to-ts';

const MAJIANG_QIPAI_SCHEMA = {
  type: 'object',
  required: [
    'zhuangfeng',
    'jushu',
    'changbang',
    'lizhibang',
    'defen',
    'baopai',
    'shoupai',
  ],
  properties: {
    zhuangfeng: {
      type: 'integer',
      minimum: 0,
      maximum: 3,
    },
    jushu: {
      type: 'integer',
      minimum: 0,
      maximum: 3,
    },
    changbang: {
      type: 'integer',
      minimum: 0,
    },
    lizhibang: {
      type: 'integer',
      minimum: 0,
    },
    defen: {
      type: 'array',
      items: {
        type: 'integer',
      },
    },
    baopai: {
      type: 'string',
    },
    shoupai: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
} as const;

const MAJIANG_ZIMO_SCHEMA = {
  type: 'object',
  required: ['l', 'p'],
  properties: {
    l: {
      type: 'integer',
      minimum: 0,
      maximum: 3,
    },
    p: {
      type: 'string',
    },
  },
} as const;

const MAJIANG_DAPAI_SCHEMA = {
  type: 'object',
  required: ['l', 'p'],
  properties: {
    l: {
      type: 'integer',
      minimum: 0,
      maximum: 3,
    },
    p: {
      type: 'string',
    },
  },
} as const;

const MAJIANG_FULOU_SCHEMA = {
  type: 'object',
  required: ['l', 'm'],
  properties: {
    l: {
      type: 'integer',
      minimum: 0,
      maximum: 3,
    },
    m: {
      type: 'string',
    },
  },
} as const;

const MAJIANG_GANG_SCHEMA = {
  type: 'object',
  required: ['l', 'm'],
  properties: {
    l: {
      type: 'integer',
      minimum: 0,
      maximum: 3,
    },
    m: {
      type: 'string',
    },
  },
} as const;

const MAJIANG_GANGZIMO_SCHEMA = {
  type: 'object',
  required: ['l', 'p'],
  properties: {
    l: {
      type: 'integer',
      minimum: 0,
      maximum: 3,
    },
    p: {
      type: 'string',
    },
  },
} as const;

const MAJIANG_KAIGANG_SCHEMA = {
  type: 'object',
  required: ['baopai'],
  properties: {
    baopai: {
      type: 'string',
    },
  },
} as const;

const MAJIANG_HULE_SCHEMA = {
  type: 'object',
  required: ['l', 'shoupai', 'baojia', 'fubaopai', 'defen', 'hupai', 'fenpei'],
  properties: {
    l: {
      type: 'integer',
      minimum: 0,
      maximum: 3,
    },
    shoupai: {
      type: 'string',
    },
    baojia: {
      type: ['integer', 'null'],
      minimum: 0,
      maximum: 3,
    },
    fubaopai: {
      type: ['array', 'null'],
      items: {
        type: 'string',
      },
    },
    fu: {
      type: 'integer',
      minimum: 0,
    },
    fanshu: {
      type: 'integer',
      minimum: 0,
    },
    damanguan: {
      type: 'integer',
      minimum: 1,
    },
    defen: {
      type: 'integer',
      minimum: 0,
    },
    hupai: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'fanshu'],
        properties: {
          name: {
            type: 'string',
          },
          fanshu: {
            type: 'integer',
            minimum: 0,
          },
        },
      },
    },
    fenpei: {
      type: 'array',
      items: {
        type: 'integer',
      },
    },
  },
} as const;

const MAJIANG_PINGJU_SCHEMA = {
  type: 'object',
  required: ['name', 'shoupai', 'fenpei'],
  properties: {
    name: {
      type: 'string',
    },
    shoupai: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    fenpei: {
      type: 'array',
      items: {
        type: 'integer',
      },
    },
  },
} as const;

const MAJIANG_ACTION_SCHEMA = {
  type: 'object',
  properties: {
    qipai: MAJIANG_QIPAI_SCHEMA,
    zimo: MAJIANG_ZIMO_SCHEMA,
    dapai: MAJIANG_DAPAI_SCHEMA,
    fulou: MAJIANG_FULOU_SCHEMA,
    gang: MAJIANG_GANG_SCHEMA,
    gangzimo: MAJIANG_GANGZIMO_SCHEMA,
    kaigang: MAJIANG_KAIGANG_SCHEMA,
    hule: MAJIANG_HULE_SCHEMA,
    pingju: MAJIANG_PINGJU_SCHEMA,
  },
  additionalProperties: false,
} as const;

const MAJIANG_ROUND_SCHEMA = {
  type: 'array',
  items: MAJIANG_ACTION_SCHEMA,
} as const;

export const MAJIANG_LOG_SCHEMA = {
  type: 'object',
  required: ['title', 'player', 'qijia', 'log', 'defen', 'point', 'rank'],
  properties: {
    title: {
      type: 'string',
    },
    player: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    qijia: {
      type: 'integer',
      minimum: 0,
      maximum: 3,
    },
    log: {
      type: 'array',
      items: MAJIANG_ROUND_SCHEMA,
    },
    defen: {
      type: 'array',
      items: {
        type: 'integer',
      },
    },
    point: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    rank: {
      type: 'array',
      items: {
        type: 'integer',
      },
    },
  },
} as const;

export type MajiangQipai = FromSchema<typeof MAJIANG_QIPAI_SCHEMA>;
export type MajiangZimo = FromSchema<typeof MAJIANG_ZIMO_SCHEMA>;
export type MajiangDapai = FromSchema<typeof MAJIANG_DAPAI_SCHEMA>;
export type MajiangFulou = FromSchema<typeof MAJIANG_FULOU_SCHEMA>;
export type MajiangGang = FromSchema<typeof MAJIANG_GANG_SCHEMA>;
export type MajiangGangzimo = FromSchema<typeof MAJIANG_GANGZIMO_SCHEMA>;
export type MajiangKaigang = FromSchema<typeof MAJIANG_KAIGANG_SCHEMA>;
export type MajiangHule = FromSchema<typeof MAJIANG_HULE_SCHEMA>;
export type MajiangPingju = FromSchema<typeof MAJIANG_PINGJU_SCHEMA>;
export type MajiangAction = FromSchema<typeof MAJIANG_ACTION_SCHEMA>;
export type MajiangRound = FromSchema<typeof MAJIANG_ROUND_SCHEMA>;
export type MajiangLog = FromSchema<typeof MAJIANG_LOG_SCHEMA>;

export const TENHOU_LOG_SCHEMA = {
  type: 'object',
  required: ['title', 'name', 'rule', 'log'],
  properties: {
    title: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    name: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    rule: {
      type: 'object',
      required: ['disp', 'aka'],
      properties: {
        disp: {
          type: 'string',
        },
        aka: {
          type: 'integer',
        },
      },
    },
    log: {
      type: 'array',
      items: {
        type: 'array',
      },
    },
  },
} as const;

export type TenhouLog = FromSchema<typeof TENHOU_LOG_SCHEMA>;
