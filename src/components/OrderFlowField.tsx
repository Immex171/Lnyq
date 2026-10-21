import { useEffect, useRef } from 'react'

/**
 * The order-flow field: a canvas behind the opening where every particle is an
 * order. Bids rise in mint from below, asks fall in coral from above, and they
 * meet on the spread line, which tracks the book's own spread row. A fill in
 * the book bursts on the line; the pointer pushes the flow. Canvas 2D, paused
 * offscreen and when the tab is hidden, a still frame under reduced motion.
 */
interface Particle { x: number; y: number; vx: number; vy: number; r: number; side: 1 | -1; life: number; rest: number }

const MINT = [99, 230, 207] as const
const CORAL = [247, 131, 154] as const
const PURPLE = [160, 81, 252] as const
const rgba = (c: readonly [number, number, number], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`

export default function OrderFlowField({ spreadSelector = '.ledger-book-spread' }: { spreadSelector?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    if (!canvas || !host) return
    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

    let width = 0, height = 0, dpr = 1, lineY = 0.5, lineX0 = 0, lineX1 = 1
    let particles: Particle[] = []
    const bursts: Array<{ x: number; y: number; t: number; side: 1 | -1 }> = []
    const pointer = { x: -1e4, y: -1e4, active: false }
    let frame = 0, running = false, last = 0

    const count = () => (width < 700 ? 140 : width < 1100 ? 260 : 420)
    const spawn = (fresh = false): Particle => {
      const side: 1 | -1 = Math.random() < 0.5 ? 1 : -1 // 1 = bid rising from below, -1 = ask falling from above
      const y = fresh ? (side === 1 ? height + Math.random() * 40 : -Math.random() * 40) : Math.random() * height
      return { x: Math.random() * width, y, vx: (Math.random() - 0.5) * 0.15, vy: -side * (0.25 + Math.random() * 0.55), r: 0.8 + Math.random() * 1.6, side, life: 1, rest: 0 }
    }
    const measure = () => {
      const rect = host.getBoundingClientRect()
      width = rect.width; height = rect.height
      dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.floor(width * dpr); canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      const spread = host.querySelector<HTMLElement>(spreadSelector)
      if (spread) {
        const s = spread.getBoundingClientRect()
        lineY = s.top + s.height / 2 - rect.top
        lineX0 = s.left - rect.left; lineX1 = s.right - rect.left
      } else { lineY = height * 0.52; lineX0 = 0; lineX1 = width }
      const target = count()
      while (particles.length < target) particles.push(spawn())
      particles.length = Math.min(particles.length, target)
    }

    const draw = (dt: number) => {
      context.clearRect(0, 0, width, height)
      // The spread line across the whole sheet: faint, brighter where the book is.
      const grad = context.createLinearGradient(0, 0, width, 0)
      grad.addColorStop(0, rgba(PURPLE, 0.08)); grad.addColorStop(Math.max(0.01, lineX0 / width), rgba(PURPLE, 0.18)); grad.addColorStop(Math.min(0.99, lineX1 / width), rgba(PURPLE, 0.18)); grad.addColorStop(1, rgba(PURPLE, 0.08))
      context.strokeStyle = grad; context.lineWidth = 1
      context.beginPath(); context.moveTo(0, lineY + 0.5); context.lineTo(width, lineY + 0.5); context.stroke()

      for (const p of particles) {
        // Drift toward the spread; slow and jitter as it nears, like an order resting near the top of book.
        const gap = (lineY - p.y) * p.side // positive while still approaching the line from its own side
        const near = gap < 60
        if (near && gap > 0) { p.vy *= 0.94; p.rest += dt; p.x += Math.sin((p.rest + p.x) * 0.004) * 0.15 }
        // The pointer pushes orders out of its way.
        if (pointer.active) {
          const dx = p.x - pointer.x, dy = p.y - pointer.y, d2 = dx * dx + dy * dy
          if (d2 < 140 * 140 && d2 > 1) { const d = Math.sqrt(d2), f = (1 - d / 140) * 0.9; p.vx += (dx / d) * f; p.vy += (dy / d) * f }
        }
        p.vx *= 0.985; p.vy *= 0.995
        p.x += p.vx * dt * 0.06; p.y += p.vy * dt * 0.06
        // Crossing the line is a fill: flash and respawn on its own side.
        if (gap <= 0 && Math.abs(p.y - lineY) < 3 && Math.random() < 0.08) {
          bursts.push({ x: p.x, y: lineY, t: 0, side: p.side })
          Object.assign(p, spawn(true))
          continue
        }
        if (gap < -40) { Object.assign(p, spawn(true)); continue }
        if (p.x < -10) p.x = width + 10; else if (p.x > width + 10) p.x = -10
        const c = p.side === 1 ? MINT : CORAL
        const alpha = near ? 0.9 : 0.45
        context.fillStyle = rgba(c, alpha)
        context.beginPath(); context.arc(p.x, p.y, p.r, 0, Math.PI * 2); context.fill()
      }
      for (let i = bursts.length - 1; i >= 0; i -= 1) {
        const b = bursts[i]!; b.t += dt
        const k = b.t / 700
        if (k >= 1) { bursts.splice(i, 1); continue }
        const c = b.side === 1 ? MINT : CORAL
        context.strokeStyle = rgba(c, (1 - k) * 0.8); context.lineWidth = 1.2
        context.beginPath(); context.arc(b.x, b.y, 4 + k * 42, 0, Math.PI * 2); context.stroke()
        context.fillStyle = rgba(PURPLE, (1 - k) * 0.9)
        context.beginPath(); context.arc(b.x, b.y, 2.5 * (1 - k) + 1, 0, Math.PI * 2); context.fill()
      }
    }

    const tick = (now: number) => {
      if (!running) return
      const dt = Math.min(48, now - (last || now)); last = now
      draw(dt)
      frame = requestAnimationFrame(tick)
    }
    const start = () => { if (running || reduceMotion) return; running = true; last = 0; frame = requestAnimationFrame(tick) }
    const stop = () => { running = false; cancelAnimationFrame(frame) }

    measure()
    if (reduceMotion) { draw(0) } else { start() }

    const onFill = (event: Event) => {
      const side = (event as CustomEvent<{ side: 'buy' | 'sell' }>).detail?.side === 'buy' ? -1 : 1
      const x = lineX0 + Math.random() * Math.max(40, lineX1 - lineX0)
      bursts.push({ x, y: lineY, t: 0, side })
      // A fill pulls nearby resting orders into the line.
      for (const p of particles) if (Math.abs(p.x - x) < 80 && Math.abs(p.y - lineY) < 70) { p.vy += (lineY - p.y) * 0.02; p.vx += (x - p.x) * 0.01 }
    }
    const onPointer = (event: PointerEvent) => { const rect = host.getBoundingClientRect(); pointer.x = event.clientX - rect.left; pointer.y = event.clientY - rect.top; pointer.active = true }
    const onLeave = () => { pointer.active = false }
    const onVisibility = () => { if (document.hidden) stop(); else if (visible) start() }
    let visible = true
    const observer = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? true; if (visible) start(); else stop() }, { threshold: 0.05 })
    observer.observe(host)
    const resize = new ResizeObserver(() => measure())
    resize.observe(host)
    window.addEventListener('lnyq:fill', onFill)
    host.addEventListener('pointermove', onPointer)
    host.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      stop(); observer.disconnect(); resize.disconnect()
      window.removeEventListener('lnyq:fill', onFill)
      host.removeEventListener('pointermove', onPointer)
      host.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [spreadSelector])

  return <canvas ref={canvasRef} className="ledger-flow" aria-hidden="true" />
}
