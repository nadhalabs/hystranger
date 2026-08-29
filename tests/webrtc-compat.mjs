import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../src/hooks/useRelayCall.ts", import.meta.url), "utf8");
const chatSource = readFileSync(new URL("../src/components/chat/ChatPanel.tsx", import.meta.url), "utf8");

assert.doesNotMatch(
  source,
  /candidate\.toJSON\s*\(/,
  "The match path must not require RTCIceCandidate#toJSON; it is absent in some Safari/WebKit versions.",
);
assert.match(source, /serializeIceCandidate\(event\.candidate\)/);
assert.match(source, /fallbackStream\.addTrack\(event\.track\)/);
assert.doesNotMatch(
  chatSource,
  /useEffect\(\(\)\s*=>\s*endRef\.current\?\.scrollIntoView/,
  "The chat scroll effect must not return scrollIntoView's browser-dependent return value as a React cleanup.",
);

console.log("WebRTC browser-compatibility regression checks passed.");
