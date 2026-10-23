//done
import { WORDLIST } from "../wordlist";
import { decodeBase58, encodeBase58 } from "./base58";

export const SEED_WORD_COUNT = 25;

const encoder = new TextEncoder();

//done
export function seedToIndices(words: string[]): number[] {
  const indices: number[] = [];

  for (const word of words) {
    const normalized = word.toLowerCase().trim();
    const index = WORDLIST.indexOf(normalized);

    if (index === -1) {
      throw new Error(`Word not found in wordlist: ${word}`);
    }

    indices.push(index);
  }

  return indices;
}

//done
export function indicesToSeed(indices: number[]): string[] {
  const words: string[] = [];

  for (const index of indices) {
    if (!Number.isInteger(index) || index < 0 || index >= WORDLIST.length) {
      throw new Error(`Invalid word index: ${index}`);
    }

    words.push(WORDLIST[index]);
  }

  return words;
}

//done
export function encodeSeedPhrase(seedPhrase: string): string {
  const raw = seedPhrase.trim();
  const tokens = raw.split(/\s+/).filter((token) => token.length > 0);

  if (tokens.length !== SEED_WORD_COUNT) {
    throw new Error("Seed phrase must be exactly 25 words");
  }

  const indices = seedToIndices(tokens);
  const joined = indices.join("|");
  const bytes = encoder.encode(joined);

  return encodeBase58(bytes);
}

export function decodeSeedPhrase(encoded: string): string[] {
  const input = encoded.trim();

  if (input.length === 0) {
    throw new Error("Encoded seed is required");
  }

  const bytes = decodeBase58(input);

  const decoded = new TextDecoder().decode(bytes);
  const parts = decoded.split("|");

  if (parts.length !== SEED_WORD_COUNT) {
    throw new Error("Decoded value does not produce 25 words");
  }

  const indices: number[] = [];

  for (const part of parts) {
    if (part === "") {
      throw new Error("Invalid index format");
    }

    const index = Number(part);

    if (!Number.isInteger(index)) {
      throw new Error("Invalid index format");
    }

    indices.push(index);
  }

  return indicesToSeed(indices);
}
