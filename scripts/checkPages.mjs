// Milestone 1 test record: opens every route in headless Chrome, collects
// console errors and failed requests, and inventories every link and button
// so dead links are caught. Usage: node scripts/checkPages.mjs [baseUrl]
import { spawn } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import WebSocket from 'ws'

const base = process.argv[2] || 'http://localhost:4173'
const routes = ['/', '/about', '/ecosystem', '/docs', '/terms', '/privacy', '/nowhere']
const chrome = process.env.CHROME_BIN || 'google-chrome'
const port = 9333
const temp = await mkdtemp(path.join(tmpdir(), 'lnyq-check-'))
const browser = spawn(chrome, ['--headless=new', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, `--user-data-dir=${path.join(temp, 'chrome')}`, 'about:blank'], { stdio: 'ignore' })
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
let tab
for (let attempt = 0; attempt < 50 && !tab; attempt += 1) { try { tab = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(t => t.type === 'page') } catch {} if (!tab) await wait(200) }
const ws = new WebSocket(tab.webSocketDebuggerUrl)
await new Promise((resolve, reject) => { ws.once('open', resolve); ws.once('error', reject) })
let id = 0
const pending = new Map()
const events = []
ws.on('message', raw => { const m = JSON.parse(String(raw)); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } else if (m.method) events.push(m) })
const send = (method, params = {}) => new Promise(resolve => { const n = ++id; pending.set(n, resolve); ws.send(JSON.stringify({ id: n, method, params })) })
await send('Runtime.enable'); await send('Log.enable'); await send('Network.enable'); await send('Page.enable')

const report = []
for (const route of routes) {
  events.length = 0
  await send('Page.navigate', { url: base + route })
  await wait(2500)
  const errors = events.filter(e => (e.method === 'Runtime.exceptionThrown') || (e.method === 'Runtime.consoleAPICalled' && e.params.type === 'error') || (e.method === 'Log.entryAdded' && e.params.entry.level === 'error')).map(e => e.method === 'Runtime.exceptionThrown' ? e.params.exceptionDetails.text + ' ' + (e.params.exceptionDetails.exception?.description || '') : e.method === 'Log.entryAdded' ? e.params.entry.text : e.params.args.map(a => a.value || a.description).join(' '))
  const failed = events.filter(e => e.method === 'Network.loadingFailed').map(e => e.params.errorText)
  const bad = events.filter(e => e.method === 'Network.responseReceived' && e.params.response.status >= 400).map(e => `${e.params.response.status} ${e.params.response.url}`)
  const inventory = await send('Runtime.evaluate', { returnByValue: true, expression: `(() => {
    const links = [...document.querySelectorAll('a')].map(a => ({ text: (a.textContent||'').trim().replace(/\\s+/g,' ').slice(0,40), href: a.getAttribute('href') || '' }))
    const buttons = [...document.querySelectorAll('button')].map(b => ({ text: (b.textContent||'').trim().slice(0,40), label: b.getAttribute('aria-label')||'', type: b.type }))
    const dead = links.filter(l => !l.href || l.href === '#' || l.href.startsWith('javascript'))
    const anchors = links.filter(l => l.href.startsWith('#')).map(l => ({ ...l, found: !!document.getElementById(l.href.slice(1)) }))
    return { title: document.title, h1: document.querySelector('h1')?.textContent, links: links.length, buttons: buttons.length, dead, missingAnchors: anchors.filter(a => !a.found), external: [...new Set(links.filter(l => /^https?:/.test(l.href)).map(l => l.href))], mailto: [...new Set(links.filter(l => l.href.startsWith('mailto:')).map(l => l.href.split('?')[0]))], buttonsList: buttons }
  })()` })
  report.push({ route, consoleErrors: errors, failedRequests: failed, badResponses: bad, ...(inventory.result?.result?.value ?? { evaluateFailed: JSON.stringify(inventory).slice(0, 300) }) })
}
ws.close(); browser.kill('SIGTERM'); await wait(500); await rm(temp, { recursive: true, force: true })
console.log(JSON.stringify(report, null, 2))
