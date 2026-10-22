import { useEffect, useRef, useState } from 'react'

type Dot = { x: number; y: number; r: number; delay: number; drift: number; sx: number; sy: number; lag: number }

/**
 * The LNYQ symbol as a field of small dots. The mark is sampled from its
 * image on an offscreen canvas, so the dots follow its real shape; each dot
 * drifts a little on its own cycle, which keeps the symbol alive without
 * ever losing its outline. Under the pointer the dots scatter outward,
 * each on its own line and delay, and settle back when it leaves; a tap
 * does the same for a moment on touch screens. Coarser on small screens,
 * still under reduced motion, and nothing at all if the image cannot be read.
 */
const SIZE = 160

function sample(image: HTMLImageElement, step: number): Dot[] {
  const canvas = document.createElement('canvas')
  canvas.width = SIZE; canvas.height = SIZE
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) return []
  context.drawImage(image, 0, 0, SIZE, SIZE)
  const { data } = context.getImageData(0, 0, SIZE, SIZE)
  const dots: Dot[] = []
  for (let y = step / 2; y < SIZE; y += step) {
    for (let x = step / 2; x < SIZE; x += step) {
      const alpha = data[(Math.floor(y) * SIZE + Math.floor(x)) * 4 + 3]!
      if (alpha < 110) continue
      const seed = (x * 73 + y * 151) % 97 / 97
      const seed2 = (x * 37 + y * 89) % 101 / 101
      // Scatter: away from the centre, with a sideways twist, 40 to 90 units out.
      const dx = x - SIZE / 2, dy = y - SIZE / 2
      const angle = Math.atan2(dy, dx) + (seed2 - 0.5) * 1.4
      const reach = 40 + seed * 50
      dots.push({ x, y, r: step * 0.28 + seed * step * 0.1, delay: -seed * 6, drift: 0.6 + seed * 0.9, sx: Math.cos(angle) * reach, sy: Math.sin(angle) * reach, lag: seed2 * 0.18 })
    }
  }
  return dots
}

export default function DottedMark({ src = '/Lnyq.png' }: { src?: string }) {
  const [dots, setDots] = useState<Dot[] | null>(null)
  const [scattered, setScattered] = useState(false)
  const settle = useRef<number | null>(null)
  const tap = () => {
    setScattered(true)
    if (settle.current) window.clearTimeout(settle.current)
    settle.current = window.setTimeout(() => setScattered(false), 1100)
  }
  const [still] = useState(() => typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false))

  useEffect(() => {
    const step = window.innerWidth < 760 ? 7 : 5
    const image = new Image()
    image.decoding = 'async'
    image.onload = () => { try { setDots(sample(image, step)) } catch { setDots([]) } }
    image.onerror = () => setDots([])
    image.src = src
  }, [src])

  if (dots === null || dots.length === 0) {
    // Before the sample is ready, or if it never is, the plain mark stands in.
    return <img className="vision-mark static" src={src} alt="" width={120} height={120} />
  }
  return (
    <svg className={`vision-mark${still ? ' still' : ''}${scattered ? ' scattered' : ''}`} viewBox={`0 0 ${SIZE} ${SIZE}`} width={120} height={120} aria-hidden="true"
      onPointerEnter={event => { if (event.pointerType === 'mouse') setScattered(true) }}
      onPointerLeave={event => { if (event.pointerType === 'mouse') setScattered(false) }}
      onPointerDown={event => { if (event.pointerType !== 'mouse') tap() }}>
      {/* The outer group carries the scatter, the circle keeps its idle drift; the two transforms never fight. */}
      {dots.map((dot, index) => (
        <g key={index} className="vision-dot" style={{ '--sx': `${dot.sx}px`, '--sy': `${dot.sy}px`, '--lag': `${dot.lag}s` } as React.CSSProperties}>
          <circle cx={dot.x} cy={dot.y} r={dot.r} style={{ '--dot-delay': `${dot.delay}s`, '--dot-drift': `${dot.drift}px` } as React.CSSProperties} />
        </g>
      ))}
    </svg>
  )
}
