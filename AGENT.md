**Master Prompt: Beldex Seed Encoder**

Build a single-page React application using Bun. Client-side only — no backend, no API calls, no server, no analytics, no wallet connections, and no persistence of seed phrases.

**App name:** Beldex Seed Encoder

**UI style:** Hand-crafted and human-designed. Use custom spacing, typography, and layout. Avoid anything that looks like a default AI-generated template.

**Color scheme:** Match the official Beldex blockchain branding:
- Primary dark background: `#1C1C26` / `#22222F`
- Primary green: `#00db09` / `#03C00B` (use for buttons, accents, success states, and highlights)
- Primary blue: `#2979FB` / `#2468D8` (use for secondary accents, links, or secondary buttons)
- White / light text: `#FFFFFF` on dark backgrounds
- Keep the overall look dark, clean, and privacy-focused like the Beldex ecosystem.

**Layout:** Two stacked panels (Encode on top, Decode below).

### Encode Panel (top)
- User pastes or types a 25-word seed phrase.
- Before processing, count the space-separated tokens. If the count is not exactly 25, show a clear error (“Seed phrase must be exactly 25 words”) and do not generate output.
- Map each word to its zero-based index in the Monero English wordlist (0–1625).
- Join the 25 indexes with a pipe character (`|`).
- Base58-encode the resulting string.
- Display the encoded output in a read-only, copyable field with a Copy button.
- Include a Clear button.

### Decode Panel (bottom)
- User pastes the base58 string.
- Before processing, validate that the input is present.
- Base58-decode it, split on pipes, and map each index back to its corresponding word in the Monero English wordlist.
- Display the reconstructed 25-word seed phrase in a read-only, copyable field with a Copy button.
- Include a Clear button.
- If the decoded result does not produce exactly 25 valid words (or indexes are out of range), show a simple error. Do not perform any additional seed validity or checksum checks.

**Wordlist:** Embed the full Monero English wordlist (1,626 words) directly in the client code. Do not use the BIP-39 wordlist. Do not fetch the wordlist remotely.

**Validation rules (only these):**
- Encode: must be exactly 25 space-separated words.
- Decode: must successfully base58-decode and produce 25 indexes that map to words.
- No checksum validation, no seed phrase validity checks beyond the word count and successful mapping.

**Disclaimer (persistent, visible near both panels):**
This tool only obfuscates seed phrases using reversible encoding. It is not encryption. Anyone who obtains both the encoded string and this method can recover the original phrase. Losing the encoded string means the seed is permanently unrecoverable. Store backups offline and never enter a real seed phrase into any website you do not fully trust — including this one.

**About section:** Brief, plain-language explanation of the pipeline: word → index (Monero English wordlist) → pipe-delimited string → Base58.

Keep the app lightweight, fast, and fully functional offline once loaded.