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
      items: {
        type: 'array',
        items: {
          type: 'object',
        },
      },
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

export const TENHOU_LOG_SCHEMA = {
  type: 'object',
  required: ['lobby', 'log', 'name', 'ratingc', 'rule', 'title', 'ver'],
  properties: {
    lobby: {
      type: 'integer',
    },
    log: {
      type: 'array',
      items: {
        type: 'array',
      },
    },
    name: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    ratingc: {
      type: 'string',
    },
    rule: {
      type: 'object',
      properties: {
        aka: {
          type: 'integer',
        },
        disp: {
          type: 'string',
        },
      },
    },
    title: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    ver: {
      type: 'string',
    },
  },
} as const;
