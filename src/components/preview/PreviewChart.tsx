import { useMemo } from 'react'
import { session, type Candle } from './candles'

const W = 640
const PAD = { top: 12, right: 52, bottom: 20, left: 8 }

/**
 * The price chart inside a preview. `tick` lets the last candle breathe:
 * its close drifts a few cents around the authored close and settles back,
 * which reads as a live session without ever changing the stated price.
 */
export default function PreviewChart({ height = 300, tick = 0, candles, low, high, close, mode = 'candles', label }: {
  height?: number
  tick?: number
  candles: number
  low: number
  high: number
  close: number
  mode?: 'candles' | 'line'
  label: string
}) {
  const H = height
  const base = useMemo(() => session(candles, low, high, close), [candles, low, high, close])
  const drift = Math.sin(tick / 2.1) * 0.05 + Math.sin(tick / 5.3) * 0.03
  const shown: Candle[] = base.map((c, i) => {
    if (i !== base.length - 1) return c
    const liveClose = Math.round((c.close + drift) * 100) / 100
    return { ...c, close: liveClose, high: Math.max(c.high, liveClose), low: Math.min(c.low, liveClose) }
  })
  const min = low - 0.15, max = high + 0.15
  const y = (p: number) => PAD.top + (H - PAD.top - PAD.bottom) * (1 - (p - min) / (max - min))
  const slot = (W - PAD.left - PAD.right) / shown.length
  const last = shown[shown.length - 1]!
  const rules = [low, (low + high) / 2, high]

  return (
    <svg className="pv-chart" viewBox={`0 0 ${W} ${H}`} style={{ aspectRatio: `${W} / ${H}` }} role="img" aria-label={label}>
      {rules.map(p => <g key={p} className="pv-chart-rule"><line x1={PAD.left} x2={W - PAD.right} y1={y(p)} y2={y(p)} /><text x={W - PAD.right + 8} y={y(p) + 4}>{p.toFixed(2)}</text></g>)}
      {mode === 'line' ? (
        <>
          <path className="pv-chart-area" d={`M${PAD.left},${y(shown[0]!.close)} ${shown.map((c, i) => `L${PAD.left + slot * i + slot / 2},${y(c.close)}`).join(' ')} L${PAD.left + slot * (shown.length - 1) + slot / 2},${H - PAD.bottom} L${PAD.left},${H - PAD.bottom} Z`} />
          <path className="pv-chart-line" d={`M${PAD.left},${y(shown[0]!.close)} ${shown.map((c, i) => `L${PAD.left + slot * i + slot / 2},${y(c.close)}`).join(' ')}`} />
        </>
      ) : shown.map((c, i) => {
        const x = PAD.left + slot * i + slot / 2
        const rising = c.close >= c.open
        const top = y(Math.max(c.open, c.close)), bottom = y(Math.min(c.open, c.close))
        return <g key={i} className={`pv-candle${rising ? ' up' : ' down'}`}><line x1={x} x2={x} y1={y(c.high)} y2={y(c.low)} /><rect x={x - slot * 0.32} y={top} width={slot * 0.64} height={Math.max(1.5, bottom - top)} /></g>
      })}
      <line className="pv-chart-last" x1={PAD.left} x2={W - PAD.right} y1={y(last.close)} y2={y(last.close)} />
      <g className="pv-chart-tag" transform={`translate(${W - PAD.right + 2}, ${y(last.close) - 9})`}><rect width={48} height={18} rx={4} /><text x={24} y={13} textAnchor="middle">{last.close.toFixed(2)}</text></g>
    </svg>
  )
}
