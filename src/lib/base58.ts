const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

const BASE = 58;

const INDEX = new Map<string, number>(
  Array.from(ALPHABET, (character, index) => [character, index]),
);

export function encodeBase58(bytes: Uint8Array): string {
  let zeros = 0;

  while (zeros < bytes.length && bytes[zeros] === 0) {
    zeros += 1;
  }

  const digits: number[] = [];

  for (let i = zeros; i < bytes.length; i += 1) {
    let carry = bytes[i];

    for (let j = 0; j < digits.length; j += 1) {
      carry += digits[j] << 8;
      digits[j] = carry % BASE;
      carry = Math.floor(carry / BASE);
    }

    while (carry > 0) {
      digits.push(carry % BASE);
      carry = Math.floor(carry / BASE);
    }
  }

  let output = "1".repeat(zeros);

  for (let i = digits.length - 1; i >= 0; i -= 1) {
    output += ALPHABET[digits[i]];
  }

  return output;
}

export function decodeBase58(input: string): Uint8Array {
  if (input.length === 0) {
    return new Uint8Array();
  }

  const bytes: number[] = [];

  for (const character of input) {
    const value = INDEX.get(character);

    if (value === undefined) {
      throw new Error(`Invalid Base58 character: ${character}`);
    }

    let carry = value;

    for (let i = 0; i < bytes.length; i += 1) {
      carry += bytes[i] * BASE;
      bytes[i] = carry & 0xff;
      carry >>= 8;
    }

    while (carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }

  for (let i = 0; i < input.length && input[i] === "1"; i += 1) {
    bytes.push(0);
  }

  return new Uint8Array(bytes.reverse());
}
