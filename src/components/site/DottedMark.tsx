import { useEffect, useState } from 'react'

type Dot = { x: number; y: number; r: number; delay: number; drift: number }

/**
 * The LNYQ symbol as a field of small dots. The mark is sampled from its
 * image on an offscreen canvas, so the dots follow its real shape; each dot
 * drifts a little on its own cycle, which keeps the symbol alive without
 * ever losing its outline. Coarser on small screens, still under reduced
 * motion, and nothing at all if the image cannot be read.
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
      dots.push({ x, y, r: step * 0.28 + seed * step * 0.1, delay: -seed * 6, drift: 0.6 + seed * 0.9 })
    }
  }
  return dots
}

export default function DottedMark({ src = '/Lnyq.png' }: { src?: string }) {
  const [dots, setDots] = useState<Dot[] | null>(null)
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
    <svg className={`vision-mark${still ? ' still' : ''}`} viewBox={`0 0 ${SIZE} ${SIZE}`} width={120} height={120} aria-hidden="true">
      {dots.map((dot, index) => (
        <circle key={index} cx={dot.x} cy={dot.y} r={dot.r} style={{ '--dot-delay': `${dot.delay}s`, '--dot-drift': `${dot.drift}px` } as React.CSSProperties} />
      ))}
    </svg>
  )
}
