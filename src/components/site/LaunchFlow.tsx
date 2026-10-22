import { useEffect, useRef, useState } from 'react'
import { launch } from '../../content'

type Node = 'create' | 'presale' | 'straight' | 'market' | 'trade'

/** The width the flow is laid out at. Below the desktop breakpoint the whole diagram is scaled to fit, so it keeps this composition everywhere. */
const BASE_WIDTH = 1040
const DESKTOP = 1100

/**
 * The launch flow: Create splits into the two lanes, which join again at
 * Market opens, and Trade is the last node. The connectors are measured
 * from the cards themselves, so they always meet the cards exactly. On
 * smaller screens the diagram is laid out at its desktop width and scaled
 * down to the available width, so it looks the same everywhere. A soft
 * light travels along each line; under reduced motion the lines simply stand.
 */
function curve(x1: number, y1: number, x2: number, y2: number) {
  const xm = (x1 + x2) / 2
  return `M${x1},${y1} C${xm},${y1} ${xm},${y2} ${x2},${y2}`
}

export default function LaunchFlow() {
  const stage = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLDivElement>(null)
  const nodes = useRef<Partial<Record<Node, HTMLDivElement | null>>>({})
  const [paths, setPaths] = useState<string[]>([])
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [fit, setFit] = useState<{ scale: number; height: number } | null>(null)

  useEffect(() => {
    const element = root.current, holder = stage.current
    if (!element || !holder) return
    const measure = () => {
      // Layout coordinates, independent of any scale applied to the diagram.
      const base = element.getBoundingClientRect()
      const k = element.offsetWidth ? base.width / element.offsetWidth : 1
      const rect = (key: Node) => {
        const r = nodes.current[key]?.getBoundingClientRect()
        return r ? { left: (r.left - base.left) / k, right: (r.right - base.left) / k, top: (r.top - base.top) / k, bottom: (r.bottom - base.top) / k, cx: (r.left - base.left + r.width / 2) / k, cy: (r.top - base.top + r.height / 2) / k } : null
      }
      const c = rect('create'), p = rect('presale'), s = rect('straight'), m = rect('market'), t = rect('trade')
      if (!c || !p || !s || !m || !t) return
      setSize({ w: element.offsetWidth, h: element.offsetHeight })
      setPaths([curve(c.right, c.cy, p.left, p.cy), curve(c.right, c.cy, s.left, s.cy), curve(p.right, p.cy, m.left, m.cy), curve(s.right, s.cy, m.left, m.cy), `M${m.right},${m.cy} L${t.left},${t.cy}`])
      if (window.innerWidth >= DESKTOP) { setFit(null); return }
      const scale = holder.getBoundingClientRect().width / BASE_WIDTH
      setFit({ scale, height: element.offsetHeight * scale })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element); observer.observe(holder)
    window.addEventListener('resize', measure)
    return () => { observer.disconnect(); window.removeEventListener('resize', measure) }
  }, [])

  const set = (key: Node) => (el: HTMLDivElement | null) => { nodes.current[key] = el }

  return (
    <div ref={stage} className="launch-stage" style={fit ? { height: fit.height } : undefined}>
    <div ref={root} className={`launch-flow${fit ? ' scaled' : ''}`} style={fit ? { width: BASE_WIDTH, transform: `scale(${fit.scale})` } : undefined} aria-label="Launch flow">
      <svg className="launch-lines" viewBox={`0 0 ${size.w || 1} ${size.h || 1}`} width={size.w || 1} height={size.h || 1} aria-hidden="true">
        {paths.map((d, i) => <path key={`b${i}`} className="launch-line" d={d} />)}
        {paths.map((d, i) => <path key={`l${i}`} className="launch-light" d={d} style={{ animationDelay: `${i * 0.35}s` }} />)}
      </svg>
      <div ref={set('create')} className="launch-node"><div><strong>Create</strong><span>Define the collection and its supply.</span></div></div>
      <div className="launch-lanes">
        <div ref={set('presale')} className="launch-node lane"><div><strong>{launch.lanes[0]!.title}</strong><span>{launch.lanes[0]!.text}</span></div></div>
        <div ref={set('straight')} className="launch-node lane"><div><strong>{launch.lanes[1]!.title}</strong><span>{launch.lanes[1]!.text}</span></div></div>
      </div>
      <div ref={set('market')} className="launch-node"><div><strong>Market opens</strong><span>An order book, a price, and liquidity from day one.</span></div></div>
      <div ref={set('trade')} className="launch-node"><div><strong>Trade</strong><span>Spot and perps, whole NFTs, settled in USDC.</span></div></div>
    </div>
    </div>
  )
}
