import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";

const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function capture() {
  const port = await new Promise((r) => { 
    const s = createServer(); 
    s.listen(0, "127.0.0.1", () => { 
      const p = s.address().port; 
      s.close(() => r(p)); 
    }); 
  });

  const prof = `C:/Users/yuzzi/AppData/Local/Temp/cap-edge-${port}`;
  mkdirSync(prof, { recursive: true });
  mkdirSync("docs/relatorios/foton-t3/menu", { recursive: true });

  const edge = spawn(EDGE, [
    "--headless=new", 
    `--remote-debugging-port=${port}`, 
    `--user-data-dir=${prof}`, 
    "--no-first-run", 
    "--hide-scrollbars", 
    "--window-size=1440,900", 
    "about:blank"
  ], { stdio: "ignore" });

  let target;
  for (let i = 0; i < 80 && !target; i++) {
    await sleep(250);
    try { 
      target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(
        (t) => t.type === "page" && t.url === "about:blank"
      ); 
    } catch {}
  }

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; 
  const pend = new Map();
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pend.has(d.id)) { pend.get(d.id)(d.result ?? d.error); pend.delete(d.id); }
  };
  const cdp = (method, params = {}) => new Promise((r) => { 
    const i = ++id; 
    pend.set(i, r); 
    ws.send(JSON.stringify({ id: i, method, params })); 
  });
  const ev = async (expr) => (await cdp("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true })).result?.value;

  await cdp("Runtime.enable");
  await cdp("Page.enable");
  
  // 1. Desktop 1440
  await cdp("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await cdp("Page.navigate", { url: "http://localhost:8088/" });
  await sleep(3500);

  // Click menu button
  await ev(`document.querySelector("button[aria-controls='menu-fullscreen']")?.click()`);
  await sleep(1500);
  const shot1440 = await cdp("Page.captureScreenshot", { format: "jpeg", quality: 80 });
  writeFileSync("docs/relatorios/foton-t3/menu/menu-1440.jpg", Buffer.from(shot1440.data, "base64"));
  console.log("Desktop menu captured");

  // 2. Mobile 375
  await cdp("Emulation.setDeviceMetricsOverride", { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
  await sleep(500);
  const shot375 = await cdp("Page.captureScreenshot", { format: "jpeg", quality: 80 });
  writeFileSync("docs/relatorios/foton-t3/menu/menu-375.jpg", Buffer.from(shot375.data, "base64"));
  console.log("Mobile menu captured");

  ws.close();
  edge.kill();
}

capture().catch(console.error);
