export const rotatePlayer = (player: number, jushu: number): number => {
  const numPlayer = 4;
  return (player + jushu) % numPlayer;
};

export const rotateOrder = <T>(arg: T[], jushu: number): T[] => {
  const numItem = arg.length;
  const rotationOffset = (numItem - jushu) % numItem;
  return arg.map((_, i) => arg[(i + rotationOffset) % numItem]);
};
