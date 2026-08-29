import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

let contextIconImports = "";
try {
  contextIconImports = execFileSync("rg", ["-l", "from \\\"@phosphor-icons/react\\\"", "src"], { encoding: "utf8" }).trim();
} catch (error) {
  if (error.status !== 1) throw error;
}
if (contextIconImports) {
  throw new Error(`Context-dependent Phosphor imports remain:\n${contextIconImports}`);
}

const manifest = JSON.parse(readFileSync(".next/app-build-manifest.json", "utf8"));
const landingChunk = manifest.pages["/page"].find((path) => path.includes("static/chunks/app/page-"));

if (!landingChunk) throw new Error("Landing-page client chunk was not emitted.");

const source = readFileSync(`.next/${landingChunk}`, "utf8");
if (source.includes("useContext")) {
  throw new Error("Landing bundle unexpectedly contains a React Context-dependent icon runtime.");
}

console.log(`Landing bundle regression check passed: ${landingChunk}`);
