export const assertNever = (arg: never): never => {
  const value = JSON.stringify(arg);
  throw new Error(`Expected code to be unreachable, but got: ${value}`);
};
