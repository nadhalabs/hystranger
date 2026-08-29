import { readFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync(".next/app-build-manifest.json", "utf8"));
const landingChunk = manifest.pages["/page"].find((path) => path.includes("static/chunks/app/page-"));

if (!landingChunk) throw new Error("Landing-page client chunk was not emitted.");

const source = readFileSync(`.next/${landingChunk}`, "utf8");
if (source.includes("useContext")) {
  throw new Error("Landing bundle unexpectedly contains a React Context-dependent icon runtime.");
}

console.log(`Landing bundle regression check passed: ${landingChunk}`);
