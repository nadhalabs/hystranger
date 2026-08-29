import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../src/hooks/useRelayCall.ts", import.meta.url), "utf8");

assert.doesNotMatch(
  source,
  /candidate\.toJSON\s*\(/,
  "The match path must not require RTCIceCandidate#toJSON; it is absent in some Safari/WebKit versions.",
);
assert.match(source, /serializeIceCandidate\(event\.candidate\)/);
assert.match(source, /fallbackStream\.addTrack\(event\.track\)/);

console.log("WebRTC browser-compatibility regression checks passed.");
