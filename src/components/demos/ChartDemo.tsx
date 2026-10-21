import { useRef } from 'react'
import { useDemoPlayback } from './useDemoPlayback'

/** Example session, authored: 22 candles; the demo reveals one more every step. */
const CANDLES = [
  [37.6, 37.9, 37.4, 37.8], [37.8, 38.1, 37.7, 38.0], [38.0, 38.2, 37.8, 37.9], [37.9, 38.0, 37.5, 37.6], [37.6, 37.7, 37.2, 37.3],
  [37.3, 37.6, 37.2, 37.5], [37.5, 37.9, 37.4, 37.8], [37.8, 38.3, 37.8, 38.2], [38.2, 38.5, 38.1, 38.4], [38.4, 38.6, 38.2, 38.3],
  [38.3, 38.4, 37.9, 38.0], [38.0, 38.3, 37.9, 38.2], [38.2, 38.7, 38.2, 38.6], [38.6, 38.9, 38.5, 38.8], [38.8, 39.0, 38.6, 38.7],
  [38.7, 38.8, 38.3, 38.4], [38.4, 38.6, 38.2, 38.5], [38.5, 38.9, 38.4, 38.8], [38.8, 39.1, 38.7, 39.0], [39.0, 39.1, 38.8, 38.9],
  [38.9, 39.0, 38.6, 38.7], [38.7, 38.8, 38.5, 38.6],
] as const
const BASE = 10
const W = 320, PAD = { top: 10, right: 44, bottom: 18, left: 6 }

/** `height` is the drawing's own height in the 320-wide viewBox; the dashboard asks for a taller one. */
export default function ChartDemo({ height = 150 }: { height?: number } = {}) {
  const H = height
  const ref = useRef<HTMLDivElement>(null)
  const { frame, reduceMotion } = useDemoPlayback(ref, CANDLES.length - BASE, 520)
  const shown = CANDLES.slice(0, BASE + frame)
  const min = Math.min(...CANDLES.map(c => c[2])) - 0.1, max = Math.max(...CANDLES.map(c => c[1])) + 0.1
  const y = (p: number) => PAD.top + (H - PAD.top - PAD.bottom) * (1 - (p - min) / (max - min))
  const slot = (W - PAD.left - PAD.right) / CANDLES.length
  const last = shown[shown.length - 1]!
  const first = shown[0]!
  const change = ((last[3] - first[0]) / first[0]) * 100
  return (
    <div ref={ref} className="demo-card" aria-label="Chart demo with example data">
      <div className="demo-card-head"><strong>Price chart</strong><span className="demo-tag">Example data</span></div>
      <p className="demo-card-copy">Every fill becomes a candle. The chart is the book's history, one price per collection.</p>
      <div className="demo-chart-readout"><span>Last <strong>{last[3].toFixed(2)}</strong></span><span className={change >= 0 ? 'up' : 'down'}>{change >= 0 ? '+' : ''}{change.toFixed(1)}%</span><span>{shown.length} candles</span></div>
      <svg className="demo-chart" viewBox={`0 0 ${W} ${H}`} style={{ aspectRatio: `${W} / ${H}` }} role="img" aria-label="Candles appearing one at a time">
        {[0, 0.5, 1].map(k => { const p = min + (max - min) * k; return <g key={k} className="demo-chart-rule"><line x1={PAD.left} x2={W - PAD.right} y1={y(p)} y2={y(p)} /><text x={W - PAD.right + 6} y={y(p) + 3}>{p.toFixed(2)}</text></g> })}
        {shown.map((c, i) => {
          const x = PAD.left + slot * i + slot / 2
          const rising = c[3] >= c[0]
          const top = y(Math.max(c[0], c[3])), bottom = y(Math.min(c[0], c[3]))
          return <g key={i} className={`demo-candle${rising ? ' rising' : ' falling'}${i === shown.length - 1 && frame > 0 ? ' new' : ''}`}><line x1={x} x2={x} y1={y(c[1])} y2={y(c[2])} /><rect x={x - slot * 0.3} y={top} width={slot * 0.6} height={Math.max(1.5, bottom - top)} /></g>
        })}
        <line className="demo-chart-lastline" x1={PAD.left} x2={W - PAD.right} y1={y(last[3])} y2={y(last[3])} />
      </svg>
      {reduceMotion && <p className="demo-static-note">Final state shown.</p>}
    </div>
  )
}
