export type DeviceId = string;

import { invariant, assertUnreachable } from "@vlcn.io/util";

// 32 bit random var in decimal
let randomVariable = Math.floor(Number.MAX_SAFE_INTEGER * Math.random());

export function newId<T>(
  deviceId: DeviceId,
  base: "hex" | "decimal" = "hex"
): ID_of<T> {
  invariant(isHex(deviceId), "Device ID must be a hex string");
  invariant(deviceId.length >= 4, "Device ids must be at least 2 bytes");

  // 32 bits, hex
  const hi32 = Math.floor(Date.now() / 1000).toString(16);

  // low 16 bits of device, in hex
  const partialDevice = deviceId.substring(deviceId.length - 4);
  // low 16 bits of the random variable, in hex
  const random = (++randomVariable & 0xffff).toString(16);

  const low32 = partialDevice + random;
  const hex = (hi32 + low32) as ID_of<T>;

  if (base === "hex") {
    return hex;
  }

  if (base === "decimal") {
    return BigInt("0x" + hex).toString() as ID_of<T>;
  }

  assertUnreachable(base);
}

export function asId<T>(id: string): ID_of<T> {
  return id as ID_of<T>;
}

export function truncateForDisplay(id: string) {
  return id.substring(id.length - 6);
}

const hexReg = /^[0-9A-Fa-f]+$/;
function isHex(h: string) {
  return hexReg.exec(h) != null;
}

// https://github.com/seancroach/ts-opaque

export type Opaque<BaseType, BrandType = unknown> = BaseType & {
  readonly [Symbols.base]: BaseType;
  readonly [Symbols.brand]: BrandType;
};

namespace Symbols {
  export declare const base: unique symbol;
  export declare const brand: unique symbol;
}

export type ID_of<T> = Opaque<string, T>;
