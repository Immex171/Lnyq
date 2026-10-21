import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import WebSocket from 'ws'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputDir = path.join(root, 'public', 'media')
const temp = await mkdtemp(path.join(tmpdir(), 'lnyq-trade-video-'))
const htmlPath = path.join(temp, 'studio.html')
const debugPort = 9337
const logoData = await readFile(path.join(root, 'public', 'Lnyq.png'))
const logoUrl = `data:image/png;base64,${logoData.toString('base64')}`

const html = String.raw`<!doctype html><meta charset="utf-8"><title>LNYQ trade video studio</title>
<style>html,body{margin:0;background:#050507;overflow:hidden}canvas{display:block}</style>
<canvas id="stage" width="1280" height="720"></canvas>
<img id="lnyq-logo" src="${logoUrl}" hidden alt="">
<script>
const canvas=document.getElementById('stage'); const c=canvas.getContext('2d');
const logoImage=document.getElementById('lnyq-logo');
const W=1280,H=720,DURATION=7.2; let started=performance.now();
const mint='#63e6cf', violet='#aa68ff', red='#ef6c87', text='#f4f1f7', muted='#77717f';
const rr=(x,y,w,h,r,fill,stroke)=>{c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=1;c.stroke()}};
const label=(value,x,y,size=14,color=text,weight=600,align='left')=>{c.font=weight+' '+size+'px Inter,Arial,sans-serif';c.fillStyle=color;c.textAlign=align;c.textBaseline='middle';c.fillText(value,x,y)};
const line=(x1,y1,x2,y2,color='#1d1b25')=>{c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.strokeStyle=color;c.lineWidth=1;c.stroke()};
function logo(x,y){c.save();c.filter='grayscale(1) brightness(4)';c.drawImage(logoImage,x-27,y-27,54,54);c.restore()}
const candles=Array.from({length:38},(_,i)=>{const trend=12.08+i*.019;const open=trend+Math.sin(i*.83)*.055;const close=trend+Math.sin(i*.83+.9)*.055;return{open,close,high:Math.max(open,close)+.035+(i%3)*.009,low:Math.min(open,close)-.03-(i%4)*.006,volume:22+((i*17)%54)}});
function candleChart(t, progress=1){
 const visible=Math.max(1,Math.floor(candles.length*progress));const x0=66,x1=842,y0=222,y1=486;const low=12.0,high=12.92;const py=value=>y1-(value-low)/(high-low)*(y1-y0);const step=(x1-x0)/candles.length;
 // Price scale and the live-price guide are standard chart elements.
 [12.2,12.4,12.6,12.8].forEach(value=>{const y=py(value);c.setLineDash([4,6]);line(x0,y,x1,y,'rgba(255,255,255,.045)');c.setLineDash([]);label(value.toFixed(2),850,y,7,'#514b57',550,'right')});
 for(let i=0;i<visible;i++){const item={...candles[i]};if(i===candles.length-1)item.close+=Math.sin(t*2.1)*.018;const x=x0+i*step+step*.5;const up=item.close>=item.open;const color=up?mint:red;const bodyTop=py(Math.max(item.open,item.close));const bodyBottom=py(Math.min(item.open,item.close));c.strokeStyle=color;c.lineWidth=1;c.beginPath();c.moveTo(x,py(item.high));c.lineTo(x,py(item.low));c.stroke();c.fillStyle=color;c.globalAlpha=.9;c.fillRect(x-step*.28,bodyTop,step*.56,Math.max(2,bodyBottom-bodyTop));c.globalAlpha=.18;c.fillRect(x-step*.28,512-item.volume*.36,step*.56,item.volume*.36);c.globalAlpha=1}
 const current=candles[Math.min(visible-1,candles.length-1)].close;const currentY=py(current);c.setLineDash([5,5]);line(x0,currentY,x1,currentY,'rgba(99,230,207,.42)');c.setLineDash([]);rr(800,currentY-10,51,20,4,'#142a27');label(current.toFixed(2),825,currentY,8,mint,800,'center');
}
function frame(ms){const t=((ms-started)/1000)%DURATION; const price=12.84+Math.sin(t*.8)*.035;
 c.fillStyle='#06060a';c.fillRect(0,0,W,H);
 const glow=c.createRadialGradient(770,260,10,770,260,650);glow.addColorStop(0,'rgba(111,54,190,.14)');glow.addColorStop(1,'rgba(6,6,10,0)');c.fillStyle=glow;c.fillRect(0,0,W,H);
 // App chrome
 c.fillStyle='#09090e';c.fillRect(0,0,W,58);line(0,58,W,58,'#282532');logo(34,29);label('LNYQ',60,29,16,'#fff',800);label('TRADE',151,29,10,'#9b94a2',800);label('PORTFOLIO',212,29,10,'#66616d',700);label('LAUNCHPAD',298,29,10,'#66616d',700);
 rr(912,14,190,31,8,'#0f0f15','#292633');label('Search markets',934,30,10,'#67616e',500);rr(1118,14,142,31,8,'#121018','#342746');label('DEVNET',1137,30,9,'#c49bea',800);c.beginPath();c.arc(1237,30,4,0,7);c.fillStyle=mint;c.fill();
 // Market header
 c.fillStyle='#0a0a0f';c.fillRect(0,59,W,75);line(0,134,W,134,'#24212d');rr(22,78,38,38,10,'#a461ef');label('LQ',41,98,11,'#170d20',900,'center');label('LNYQ / USDC',76,88,14,'#f2eef6',800);label('Spot market',76,108,9,'#6f6977',500);
 label(price.toFixed(2),790,89,23,'#f6f3f9',800,'right');label('+8.42%',805,108,10,mint,800,'right');label('24H VOLUME',925,84,8,'#5f5965',800);label('$1.84M',925,105,13,'#d8d2dc',700);label('MARKET STATUS',1078,84,8,'#5f5965',800);c.beginPath();c.arc(1085,106,4,0,7);c.fillStyle=mint;c.fill();label('TRADING',1098,106,11,'#d8d2dc',800);
 // Chart
 c.fillStyle='#09090e';c.fillRect(0,135,884,455);line(884,135,884,590,'#24212d');label('PRICE DISCOVERY',28,160,8,'#665f6c',800);label('Live order flow',28,184,13,'#ded9e3',700);
 for(let i=0;i<5;i++) line(28,230+i*71,855,230+i*71,'rgba(255,255,255,.045)');for(let i=0;i<7;i++) line(110+i*124,210,110+i*124,513,'rgba(255,255,255,.035)');
 candleChart(t,Math.min(1,t/1.45));['09:00','10:00','11:00','12:00','13:00','NOW'].forEach((x,i)=>label(x,112+i*145,544,8,'#4e4953',500));
 // order book
 c.fillStyle='#0a0a0f';c.fillRect(885,135,395,455);label('ORDER BOOK',912,162,10,'#d4ced8',800);label('PRICE',912,190,8,'#58525e',700);label('AMOUNT',1244,190,8,'#58525e',700,'right');
 for(let i=0;i<5;i++){const y=217+i*29,w=90+Math.sin(t*1.3+i)*45+i*22;c.fillStyle='rgba(239,108,135,.13)';c.fillRect(1260-w,y-10,w,21);label((12.91-i*.01).toFixed(2),912,y,9,red,650);label((18.2+i*7.13).toFixed(2),1244,y,9,'#837c88',550,'right')}
 line(902,364,1260,364,'#2b2732');label('↗ '+price.toFixed(2),912,382,12,mint,800);
 for(let i=0;i<5;i++){const y=411+i*29,w=100+Math.sin(t*1.1+i*.8)*42+i*25;c.fillStyle='rgba(99,230,207,.11)';c.fillRect(1260-w,y-10,w,21);label((12.83-i*.01).toFixed(2),912,y,9,mint,650);label((14.4+i*9.27).toFixed(2),1244,y,9,'#837c88',550,'right')}
 // ticket
 c.fillStyle='#0b0b11';c.fillRect(0,591,W,129);line(0,591,W,591,'#292532');label('ORDER TICKET',28,617,8,'#6e6875',800);rr(28,636,215,51,8,'#111118','#2b2833');label('0.00 LQ',45,661,13,'#dcd7e1',700);rr(257,636,215,51,8,'#111118','#2b2833');label('$0.00 USDC',274,661,13,'#dcd7e1',700);rr(937,636,145,51,8,'#17121d','#4d315f');label('SELL',1009,661,11,'#d6b5fa',900,'center');rr(1095,636,145,51,8,mint);label('BUY LNYQ',1167,661,11,'#07110e',900,'center');
 // cursor and click
 const clickT=Math.max(0,Math.min(1,(t-2.5)/2));const cx=680+(1167-680)*clickT,cy=330+(661-330)*clickT;c.save();c.translate(cx,cy);c.rotate(-.12);c.fillStyle='#fff';c.beginPath();c.moveTo(0,0);c.lineTo(0,24);c.lineTo(7,18);c.lineTo(12,29);c.lineTo(18,26);c.lineTo(12,15);c.lineTo(22,14);c.closePath();c.fill();c.restore();
 if(t>4.35&&t<6.7){const p=Math.min(1,(t-4.35)/.38);const y=92+(1-p)*-70;rr(945,y,292,68,12,'rgba(17,25,23,.97)','rgba(99,230,207,.38)');c.beginPath();c.arc(974,y+34,14,0,7);c.fillStyle=mint;c.fill();label('✓',974,y+35,12,'#07110e',900,'center');label('Market order submitted',997,y+27,12,'#f3f8f6',800);label('Waiting for the next matching fill',997,y+45,9,'#8c9c98',500)}
 requestAnimationFrame(frame)
}
async function boot(){
 await logoImage.decode();started=performance.now();requestAnimationFrame(frame);
 const stream=canvas.captureStream(30);const chunks=[];const wantMp4=__FORMAT__==='mp4';const mime=wantMp4?(MediaRecorder.isTypeSupported('video/mp4;codecs=avc1.42E01E')?'video/mp4;codecs=avc1.42E01E':'video/mp4'):(MediaRecorder.isTypeSupported('video/webm;codecs=vp9')?'video/webm;codecs=vp9':'video/webm');
 const recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:3000000});recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
 recorder.onstop=async()=>{const blob=new Blob(chunks,{type:mime});const bytes=new Uint8Array(await blob.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=32768)binary+=String.fromCharCode(...bytes.subarray(i,i+32768));window.__videoBase64=btoa(binary);window.__posterBase64 ||= canvas.toDataURL('image/png').split(',')[1];document.title='DONE'};
 recorder.start(250);setTimeout(()=>{window.__posterBase64=canvas.toDataURL('image/png').split(',')[1]},3200);setTimeout(()=>recorder.stop(),DURATION*1000);
}
boot();
</script>`

const videoFormat = process.env.LNYQ_VIDEO_FORMAT === 'mp4' ? 'mp4' : 'webm'
await writeFile(htmlPath, html.replace('__FORMAT__', JSON.stringify(videoFormat)))
const chrome = process.env.CHROME_BIN || 'google-chrome'
const browser = spawn(chrome, [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--autoplay-policy=no-user-gesture-required',
  `--remote-debugging-port=${debugPort}`, `--user-data-dir=${path.join(temp, 'chrome')}`,
  pathToFileURL(htmlPath).href,
], { stdio: 'ignore' })

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
let tab
for (let attempt = 0; attempt < 50; attempt += 1) {
  try {
    const response = await fetch(`http://127.0.0.1:${debugPort}/json/list`)
    const tabs = await response.json()
    tab = tabs.find(item => item.type === 'page')
    if (tab) break
  } catch {}
  await wait(200)
}
if (!tab) throw new Error('Chrome DevTools target was not available.')
const socket = new WebSocket(tab.webSocketDebuggerUrl)
await new Promise((resolve, reject) => { socket.once('open', resolve); socket.once('error', reject) })
let requestId = 0
const evaluate = expression => new Promise((resolve, reject) => {
  const id = ++requestId
  const listener = raw => {
    const message = JSON.parse(String(raw))
    if (message.id !== id) return
    socket.off('message', listener)
    if (message.error) reject(new Error(message.error.message))
    else resolve(message.result?.result?.value)
  }
  socket.on('message', listener)
  socket.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression, returnByValue: true } }))
})
let videoBase64
for (let attempt = 0; attempt < 45; attempt += 1) {
  videoBase64 = await evaluate('window.__videoBase64 || null')
  if (videoBase64) break
  await wait(250)
}
if (!videoBase64) throw new Error('Canvas recording did not complete.')
const posterBase64 = await evaluate('window.__posterBase64 || null')
await mkdir(outputDir, { recursive: true })
await writeFile(path.join(outputDir, `lnyq-trade-demo.${videoFormat}`), Buffer.from(videoBase64, 'base64'))
// The poster is shared by both encodings; the WebM run owns it.
if (posterBase64 && videoFormat === 'webm') await writeFile(path.join(outputDir, 'lnyq-trade-poster.png'), Buffer.from(posterBase64, 'base64'))
socket.close()
browser.kill('SIGTERM')
await Promise.race([
  new Promise(resolve => browser.once('exit', resolve)),
  wait(2_000),
])
await rm(temp, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 })
console.log(`Created ${path.join(outputDir, `lnyq-trade-demo.${videoFormat}`)}`)
