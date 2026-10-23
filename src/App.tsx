
import { useState } from "react";
import { decodeSeedPhrase, encodeSeedPhrase } from "./lib/seed";

//done
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (!text) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    // neat functionality if there is no text they cant copy
    <button className="copy-button" onClick={onCopy} type="button" disabled={!text}>
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function App() {
  //state var for the encoding
  const [encodeInput, setEncodeInput] = useState("");
  const [encodeOutput, setEncodeOutput] = useState("");
  const [encodeError, setEncodeError] = useState("");
  //start vars for the decoding
  const [decodeInput, setDecodeInput] = useState("");
  const [decodeOutput, setDecodeOutput] = useState("");
  const [decodeError, setDecodeError] = useState("");

  const handleEncode = () => {
    setEncodeError("");
    setEncodeOutput("");

    try {
      const encoded = encodeSeedPhrase(encodeInput);
      setEncodeOutput(encoded);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Encoding failed";
      setEncodeError(message);
    }
  };

  const handleDecode = () => {
    setDecodeError("");
    setDecodeOutput("");

    try {
      const words = decodeSeedPhrase(decodeInput);
      setDecodeOutput(words.join(" "));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Decoding failed";
      setDecodeError(message);
    }
  };

  const clearEncode = () => {
    setEncodeInput("");
    setEncodeOutput("");
    setEncodeError("");
  };

  const clearDecode = () => {
    setDecodeInput("");
    setDecodeOutput("");
    setDecodeError("");
  };

  return (
    <div className="page">
      <header className="header">
        <h1>Beldex Encoder</h1>
        <p className="subtitle">Client-side, reversible obfuscation</p>
      </header>

      <section className="panel">
        <div className="panel-header">
          <h2>Encode</h2>
        </div>
        <label className="field-label" htmlFor="encode-input">
          25-word seed phrase
        </label>
        {/* we get the seed pharse */}
        <textarea
          id="encode-input"
          className="textarea"
          placeholder="Enter 25 space-separated words"
          value={encodeInput}
          onChange={(event) => setEncodeInput(event.target.value)}
          spellCheck={false}
        />

        <div className="panel-actions">
          <button className="primary-button" onClick={handleEncode} type="button">
            Encode
          </button>
          <button className="ghost-button" onClick={clearEncode} type="button">
            Clear
          </button>
        </div>

        <div className="output-group">
          <label className="field-label" htmlFor="encode-output">
            Base58 encoded output
          </label>
          <div className="output-row">
            <input
              id="encode-output"
              className="output-input"
              value={encodeOutput}
              readOnly
              spellCheck={false}
            />
            <CopyButton text={encodeOutput} />
          </div>
        </div>
        {encodeError ? <p className="error-text">{encodeError}</p> : null}
      </section>

      {/* for the decoding part */}
      <section className="panel">
        <div className="panel-header">
          <h2>Decode</h2>
        </div>
        <label className="field-label" htmlFor="decode-input">
          Base58 encoded string
        </label>
        <textarea
          id="decode-input"
          className="textarea"
          placeholder="Paste base58 string"
          value={decodeInput}
          onChange={(event) => setDecodeInput(event.target.value)}
          spellCheck={false}
        />
        <div className="panel-actions">
          <button className="primary-button primary-button--blue" onClick={handleDecode} type="button">
            Decode
          </button>
          <button className="ghost-button" onClick={clearDecode} type="button">
            Clear
          </button>
        </div>
        <div className="output-group">
          <label className="field-label" htmlFor="decode-output">
            Reconstructed seed phrase
          </label>
          <div className="output-row">
            <input
              id="decode-output"
              className="output-input"
              value={decodeOutput}
              readOnly
              spellCheck={false}
            />
            <CopyButton text={decodeOutput} />
          </div>
        </div>
        {decodeError ? <p className="error-text">{decodeError}</p> : null}
      </section>

      <section className="disclaimer">
        <h3>Disclaimer</h3>
        <p>
          This tool only obfuscates seed phrases using reversible encoding. It is not encryption. Anyone who obtains both the
          encoded string and this method can recover the original phrase. Losing the encoded string means the seed is
          permanently unrecoverable. Store backups offline and never enter a real seed phrase into any website you do not
          fully trust.
        </p>
      </section>

      <section className="about">
        <h3>About</h3>
        <p>
          Pipeline: word → index (Monero English wordlist) → pipe-delimited string → Base58. All processing happens in
          your browser with no backend, no API calls, and no persistence.
        </p>
      </section>
    </div>
  );
}
