import { describe, expect, test } from "bun:test";
import { decodeSeedPhrase, encodeSeedPhrase } from "../src/lib/seed";
import { WORDLIST } from "../src/wordlist";

function makeSeed() {
  const words: string[] = [];

  for (let i = 0; i < 25; i += 1) {
    words.push(WORDLIST[i]);
  }

  return words.join(" ");
}

describe("Beldex Seed Encoder", () => {
  test("roundtrip with Monero wordlist", () => {
    const seed = makeSeed();
    const encoded = encodeSeedPhrase(seed);
    const decoded = decodeSeedPhrase(encoded);
    expect(decoded).toEqual(seed.split(" "));
  });

  test("encode rejects non-25 word count", () => {
    const seed = WORDLIST.slice(0, 24).join(" ");
    expect(() => encodeSeedPhrase(seed)).toThrow(/exactly 25/);
  });

  test("decode rejects invalid base58 or bad mapping", () => {
    expect(() => decodeSeedPhrase("!!!")).toThrow();
  });

  test("uses Monero wordlist only", () => {
    expect(WORDLIST.length).toBe(1626);
    expect(WORDLIST[0]).toBe("abbey");
  });
});
