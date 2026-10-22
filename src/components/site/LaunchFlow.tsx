import { useEffect, useRef, useState } from 'react'
import { launch } from '../../content'

type Node = 'create' | 'presale' | 'straight' | 'market' | 'trade'

/**
 * The launch flow: Create splits into the two lanes, which join again at
 * Market opens, and Trade is the last node. The connectors are measured
 * from the cards themselves, so they always meet the cards exactly, in the
 * side-by-side layout and in the stacked one. A soft light travels along
 * each line; under reduced motion the lines simply stand.
 */
function curve(x1: number, y1: number, x2: number, y2: number) {
  const xm = (x1 + x2) / 2
  return `M${x1},${y1} C${xm},${y1} ${xm},${y2} ${x2},${y2}`
}
function drop(x1: number, y1: number, x2: number, y2: number) {
  const ym = (y1 + y2) / 2
  return `M${x1},${y1} C${x1},${ym} ${x2},${ym} ${x2},${y2}`
}

export default function LaunchFlow() {
  const root = useRef<HTMLDivElement>(null)
  const nodes = useRef<Partial<Record<Node, HTMLDivElement | null>>>({})
  const [paths, setPaths] = useState<string[]>([])
  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const element = root.current
    if (!element) return
    const measure = () => {
      const base = element.getBoundingClientRect()
      const rect = (key: Node) => {
        const r = nodes.current[key]?.getBoundingClientRect()
        return r ? { left: r.left - base.left, right: r.right - base.left, top: r.top - base.top, bottom: r.bottom - base.top, cx: r.left - base.left + r.width / 2, cy: r.top - base.top + r.height / 2 } : null
      }
      const c = rect('create'), p = rect('presale'), s = rect('straight'), m = rect('market'), t = rect('trade')
      if (!c || !p || !s || !m || !t) return
      const stacked = p.top >= c.bottom - 1
      setSize({ w: base.width, h: base.height })
      setPaths(stacked
        ? [drop(c.cx, c.bottom, p.cx, p.top), drop(p.cx, p.bottom, s.cx, s.top), drop(s.cx, s.bottom, m.cx, m.top), drop(m.cx, m.bottom, t.cx, t.top)]
        : [curve(c.right, c.cy, p.left, p.cy), curve(c.right, c.cy, s.left, s.cy), curve(p.right, p.cy, m.left, m.cy), curve(s.right, s.cy, m.left, m.cy), `M${m.right},${m.cy} L${t.left},${t.cy}`])
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    window.addEventListener('resize', measure)
    return () => { observer.disconnect(); window.removeEventListener('resize', measure) }
  }, [])

  const set = (key: Node) => (el: HTMLDivElement | null) => { nodes.current[key] = el }

  return (
    <div ref={root} className="launch-flow" aria-label="Launch flow">
      <svg className="launch-lines" viewBox={`0 0 ${size.w || 1} ${size.h || 1}`} width={size.w || 1} height={size.h || 1} aria-hidden="true">
        {paths.map((d, i) => <path key={`b${i}`} className="launch-line" d={d} />)}
        {paths.map((d, i) => <path key={`l${i}`} className="launch-light" d={d} style={{ animationDelay: `${i * 0.35}s` }} />)}
      </svg>
      <div ref={set('create')} className="launch-node"><strong>Create</strong><span>Define the collection and its supply.</span></div>
      <div className="launch-lanes">
        <div ref={set('presale')} className="launch-node lane"><strong>{launch.lanes[0]!.title}</strong><span>{launch.lanes[0]!.text}</span></div>
        <div ref={set('straight')} className="launch-node lane"><strong>{launch.lanes[1]!.title}</strong><span>{launch.lanes[1]!.text}</span></div>
      </div>
      <div ref={set('market')} className="launch-node"><strong>Market opens</strong><span>An order book, a price, and liquidity from day one.</span></div>
      <div ref={set('trade')} className="launch-node"><strong>Trade</strong><span>Spot and perps, whole NFTs, settled in USDC.</span></div>
    </div>
  )
}
