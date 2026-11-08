// Capturas sem janela: Edge headless + CDP. Uso: node cap.mjs <saida> <largura>x<altura> <url> [rolagens separadas por vírgula, em fração da página]
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

const [out, size, url, stops = "0"] = process.argv.slice(2);
const [W, H] = size.split("x").map(Number);
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
import { createServer } from "node:net";
// Porta livre dada pelo sistema: sorteio aleatório colidia quando dois agentes capturavam ao mesmo tempo.
const port = await new Promise((r) => { const s = createServer(); s.listen(0, "127.0.0.1", () => { const p = s.address().port; s.close(() => r(p)); }); });
const prof = `C:/Users/yuzzi/AppData/Local/Temp/cap-edge-${port}`;
mkdirSync(prof, { recursive: true });
const edge = spawn(EDGE, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, "--no-first-run", "--hide-scrollbars", `--window-size=${W},${H}`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let target;
for (let i = 0; i < 80 && !target; i++) {
  await sleep(250);
  try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page" && t.url === "about:blank"); } catch {}
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = new Map(); const logs = [];
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pend.has(d.id)) { pend.get(d.id)(d.result ?? d.error); pend.delete(d.id); }
  if (d.method === "Runtime.consoleAPICalled") logs.push(`${d.params.type}: ${d.params.args.map((a) => a.value ?? a.description).join(" ")}`);
  if (d.method === "Runtime.exceptionThrown") logs.push(`EXCEPTION: ${d.params.exceptionDetails.exception?.description ?? d.params.exceptionDetails.text}`);
};
const cdp = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => (await cdp("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true })).result?.value;

await cdp("Runtime.enable");
await cdp("Page.enable");
await cdp("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: W < 768 });
await cdp("Page.navigate", { url });
await sleep(4000);
const info = await ev(`({sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, h: document.documentElement.scrollHeight})`);
const tag = url.replace(/^https?:\/\/[^/]+/, "").replace(/[^a-z0-9]+/gi, "_") || "home";
let n = 0;
for (const f of stops.split(",").map(Number)) {
  await ev(`window.scrollTo(0, ${f} * (document.documentElement.scrollHeight - innerHeight))`);
  await sleep(2600);
  const shot = await cdp("Page.captureScreenshot", { format: "jpeg", quality: 70 });
  writeFileSync(`${out}/${tag}-${W}-${n++}.jpg`, Buffer.from(shot.data, "base64"));
}
console.log(JSON.stringify({ url, W, ...info, overflow: info.sw > info.cw, logs }));

const routes=['/internet','/tv','/telefone-fixo','/movel','/entretenimento','/teste-de-velocidade'];
for(const route of routes){
 await ev(`document.querySelector('.inet-service-card[href="${route}"]').click()`);await sleep(1000);
 console.log(JSON.stringify({clicked:route,actual:await ev('location.pathname')}));
 await cdp('Page.navigate',{url});await sleep(1200);
}
await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
await ev(`document.querySelector('.inet-service-card').focus()`);
console.log(JSON.stringify(await ev(`({focusVisible:document.activeElement.matches(':focus-visible'),outline:getComputedStyle(document.activeElement).outline})`)));
await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await sleep(1000);
console.log(JSON.stringify(await ev(`({reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,cardTransforms:[...document.querySelectorAll('.inet-service-slot')].map(c=>getComputedStyle(c).transform),canvasDisplay:getComputedStyle(document.querySelector('.inet-connect-finale canvas')).display,overflow:document.documentElement.scrollWidth>innerWidth})`)));
console.log(JSON.stringify({finalLogs:logs}));
ws.close(); edge.kill();
