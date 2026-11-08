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
await cdp('Page.addScriptToEvaluateOnNewDocument',{source:`window.fiberFrames=0; const originalRAF=window.requestAnimationFrame; window.requestAnimationFrame=function(cb){ const fiber=new Error().stack.includes('FiberTube.tsx');return originalRAF.call(window,t=>{if(fiber)window.fiberFrames++;cb(t)})};`});
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

console.log(JSON.stringify(await ev(`(() => {
 const root=document.documentElement, footer=document.querySelector('footer'), tube=document.querySelector('.inet-fiber-tube'), finale=document.querySelector('.inet-connect-finale');
 const h=root.scrollHeight;
 tube.style.display='none'; const withoutTube=root.scrollHeight; tube.style.display='';
 const cards=[...document.querySelectorAll('.inet-service-card')];
 return {height:h,withoutTube,innerWidth,scrollWidth:root.scrollWidth,footerBottom:footer.getBoundingClientRect().bottom+scrollY,finaleHeight:finale.getBoundingClientRect().height,finaleToFooterGap:footer.getBoundingClientRect().top-finale.getBoundingClientRect().bottom,cards:cards.map(c=>({href:c.getAttribute('href'),text:c.innerText})),tubeCount:document.querySelectorAll('.inet-fiber-tube').length};
})()`)));
await ev(`document.querySelector('#servicos').scrollIntoView()`); await sleep(2600);
const cardShot=await cdp("Page.captureScreenshot",{format:"jpeg",quality:85}); writeFileSync(`${out}/services-${W}.jpg`,Buffer.from(cardShot.data,"base64"));
await ev(`document.querySelector(".inet-service-fan").scrollIntoView({block:"center"})`); await sleep(2600);
const cardShot2=await cdp("Page.captureScreenshot",{format:"jpeg",quality:85}); writeFileSync(`${out}/cards-${W}.jpg`,Buffer.from(cardShot2.data,"base64"));
await ev(`document.querySelector('.inet-connect-finale').scrollIntoView()`); await sleep(2600);
const finaleShot=await cdp("Page.captureScreenshot",{format:"jpeg",quality:85}); writeFileSync(`${out}/finale-${W}.jpg`,Buffer.from(finaleShot.data,"base64"));

await ev(`window.scrollTo(0,0)`);await sleep(5000);
await ev(`window.fiberFrames=0`);await sleep(1100);
console.log(JSON.stringify(await ev(`({idleFiberFrames:window.fiberFrames,railHeight:document.querySelector('.inet-service-fan').getBoundingClientRect().height,railScrollWidth:document.querySelector('.inet-service-fan').scrollWidth,railClientWidth:document.querySelector('.inet-service-fan').clientWidth,svgHeight:document.querySelector('.inet-fiber-tube').getBoundingClientRect().height,footerTop:document.querySelector('footer').getBoundingClientRect().top+scrollY,tubeWidth:getComputedStyle(document.querySelector('.inet-fiber-tube')).getPropertyValue('--tube'),mask:getComputedStyle(document.querySelector('.inet-fiber-tube')).maskImage})`)));
if(W<768){
 await ev(`document.querySelector('.inet-service-fan').scrollIntoView({block:'center'})`);await sleep(1000);
 const pos=await ev(`(()=>{const r=document.querySelector('.inet-service-fan').getBoundingClientRect();return {x:r.x+r.width*.8,y:r.y+r.height*.5}})()`);
 await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:pos.x,y:pos.y}]});
 for(let i=1;i<=8;i++){await cdp('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:pos.x-i*28,y:pos.y}]});await sleep(40)}
 await cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await sleep(1000);
 console.log(JSON.stringify(await ev(`({afterDrag:document.querySelector('.inet-service-fan').scrollLeft,overflow:document.documentElement.scrollWidth>innerWidth})`)));
}
console.log(JSON.stringify({finalLogs:logs}));
ws.close(); edge.kill();
