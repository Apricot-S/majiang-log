export const MAJIANG_LOG_SCHEMA = {
  type: 'object',
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
      type: 'number',
      minimum: 0,
      maximum: 3,
    },
    log: {
      type: 'array',
      items: {
        type: 'object',
      },
    },
    defen: {
      type: 'array',
      items: {
        type: 'number',
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
        type: 'number',
      },
    },
  },
} as const;

export const TENHOU_LOG_SCHEMA = {
  type: 'object',
  properties: {
    lobby: {
      type: 'number',
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
      ratingc: {
        type: 'string',
      },
      rule: {
        type: 'object',
        properties: {
          aka: {
            type: 'number',
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
  },
} as const;
