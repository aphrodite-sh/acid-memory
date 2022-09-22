export function assertUnreachable(x: never): never {
  throw new Error("Didn't expect to get here");
}

export function invariant(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

const hexReg = /^[0-9A-Fa-f]+$/;
export function isHex(h: string) {
  return hexReg.exec(h) != null;
}