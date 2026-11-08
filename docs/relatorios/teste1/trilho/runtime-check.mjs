// Diagnóstico sem capturas: somente Edge headless isolado + CDP no site local.
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, existsSync, writeFileSync } from 'node:fs';
const root = new URL('.', import.meta.url).pathname.replace(/^\/(C:)/,'$1');
const profile = `C:/Users/yuzzi/AppData/Local/Temp/trilho-hover-runtime-${process.pid}-${Date.now()}`;
mkdirSync(profile, { recursive: true });
const edge = spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', ['--headless=new','--remote-debugging-port=0',`--user-data-dir=${profile}`,'--no-first-run','--hide-scrollbars','--use-angle=d3d11','--enable-gpu','--ignore-gpu-blocklist','about:blank'],{stdio:'ignore'});
const sleep = ms => new Promise(resolve => setTimeout(resolve,ms));
let ws;
try {
  let port;
  for(let i=0;i<80&&!port;i++) { await sleep(250); if(existsSync(`${profile}/DevToolsActivePort`)) port=readFileSync(`${profile}/DevToolsActivePort`,'utf8').split('\n')[0].trim(); }
  const tab=(await(await fetch(`http://127.0.0.1:${port}/json`)).json()).find(t=>t.type==='page');
  ws=new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(resolve=>ws.onopen=resolve);
  let id=0; const pending=new Map(); const logs=[];
  ws.onmessage=message=>{const data=JSON.parse(message.data);if(data.method==='Runtime.consoleAPICalled')logs.push(data.params.args.map(a=>a.value??a.description).join(' '));if(data.method==='Runtime.exceptionThrown')logs.push(data.params.exceptionDetails.exception?.description??data.params.exceptionDetails.text);if(pending.has(data.id)){pending.get(data.id)(data.result??data.error);pending.delete(data.id);}};
  const cdp=(method,params={})=>new Promise(resolve=>{const key=++id;pending.set(key,resolve);ws.send(JSON.stringify({id:key,method,params}));});
  const ev=async expression=>(await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result?.value;
  await cdp('Page.enable'); await cdp('Runtime.enable');
  await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  const reduced=async value=>{await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value}]});await sleep(180);};
  // Carrega sem Lenis para posicionar o card sem disputa com rolagem virtual.
  await reduced('reduce'); await cdp('Page.navigate',{url:`http://127.0.0.1:8086/?hover-check=${Date.now()}`});await sleep(4000);
  for(let i=0;i<100;i++) { if(await ev("!!document.querySelector('[data-hover-jitter]')")) break; await sleep(500); }
  const position=await ev(`(()=>{const host=document.querySelector('[data-hover-jitter]'); if(!host)return null;host.scrollIntoView({block:'center'});const r=host.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};})()`);
  if(!position) {console.log(JSON.stringify({logs,body:await ev("document.body.innerText.slice(0,1600)"),html:await ev("document.querySelector('#root')?.innerHTML.slice(0,700)"),ready:await ev('document.readyState')}));throw new Error('Card HoverJitter ausente');}
  await sleep(300);
  const point=await ev(`(()=>{const r=document.querySelector('[data-hover-jitter]').getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}})()`);
  const mouse=(x,y)=>cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x,y});
  const read=()=>ev(`(()=>{const host=document.querySelector('[data-hover-jitter]'),e=host.querySelector('[data-hover-jitter-media]'),s=getComputedStyle(e);return{animations:e.getAnimations().filter(a=>a.playState==='running').length,transform:s.transform,filter:s.filter,willChange:s.willChange,fine:matchMedia('(hover:hover) and (pointer:fine)').matches,reduced:matchMedia('(prefers-reduced-motion:reduce)').matches,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth}})()`);
  const results={point};
  await reduced('no-preference');await mouse(2,898);await sleep(160);results.before=await read();
  await mouse(point.x,point.y);await sleep(150);results.during=await read();await sleep(320);results.finished=await read();
  await mouse(2,898);await sleep(150);await mouse(point.x,point.y);await sleep(35);await mouse(2,898);await sleep(200);results.quickExit=await read();
  await reduced('reduce');await mouse(point.x,point.y);await sleep(150);results.reduced=await read();
  await mouse(2,898);await reduced('no-preference');
  await cdp('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
  await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:point.x,y:point.y}]});await sleep(120);results.touch=await read();
  await cdp('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});
  results.profile=profile;
  writeFileSync(new URL('./runtime-result.json',import.meta.url),JSON.stringify(results,null,2));
  console.log(JSON.stringify(results));
  if(results.before.animations!==0||results.during.animations!==1||results.finished.animations!==0||results.quickExit.animations!==0||results.reduced.animations!==0||results.reduced.transform!=='none'||results.touch.animations!==0) process.exitCode=1;
} catch(error) {console.error(error);process.exitCode=1;} finally {ws?.close();edge.kill();}
