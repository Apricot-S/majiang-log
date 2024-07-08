export const MODE = {
  Log: 'log',
  Viewer: 'viewer',
} as const;

export type Mode = (typeof MODE)[keyof typeof MODE];

export const isMode = (mode: string): mode is Mode => {
  const modes: string[] = Object.values(MODE);
  return modes.includes(mode);
};
