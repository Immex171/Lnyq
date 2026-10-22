import { useEffect, useRef } from 'react'
import { surfaceHeight } from '../../wave'

/**
 * A field of small dots rolling in slow waves behind the whole landing page. The
 * dots sit on a grid seen in perspective: rows recede toward a horizon near
 * the top, so nearer dots are larger and brighter and farther ones smaller
 * and softer. The surface height is a sum of sines in position and time,
 * which never resets, so the motion is seamless. White on the page's black,
 * drawn faintly; the CSS overlay darkens it further behind the text.
 *
 * The canvas is sticky inside a wrapper the height of the page, so one
 * viewport-sized surface follows the visitor down the page. It runs
 * only while on screen and the tab is visible, draws fewer dots on small
 * screens, and under reduced motion draws one frame and stops.
 */
export default function ParticleWave() {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const element = canvas.current, holder = wrap.current
    if (!element || !holder) return
    const context = element.getContext('2d')
    if (!context) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

    // A single soft dot, drawn once and stamped at every position.
    const sprite = document.createElement('canvas')
    sprite.width = sprite.height = 32
    const sc = sprite.getContext('2d')!
    const glow = sc.createRadialGradient(16, 16, 0, 16, 16, 16)
    glow.addColorStop(0, 'rgba(255,255,255,1)')
    glow.addColorStop(0.45, 'rgba(255,255,255,.9)')
    glow.addColorStop(1, 'rgba(255,255,255,0)')
    sc.fillStyle = glow
    sc.fillRect(0, 0, 32, 32)

    let width = 0, height = 0, dpr = 1
    let cols = 72, rows = 30
    const resize = () => {
      const rect = element.getBoundingClientRect()
      dpr = Math.min(2, window.devicePixelRatio || 1)
      width = rect.width; height = rect.height
      element.width = Math.round(width * dpr); element.height = Math.round(height * dpr)
      const small = width < 760
      cols = small ? 34 : 72
      rows = small ? 18 : 30
    }

    const draw = (t: number) => {
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.clearRect(0, 0, width, height)
      const horizon = height * 0.18
      const amp = height * 0.055
      for (let r = rows - 1; r >= 0; r -= 1) {
        const z = r / (rows - 1)            // 0 nearest the viewer, 1 at the horizon
        const depth = 1 - z                  // 1 near, 0 far
        const spread = width * (0.55 + depth * 0.5)
        const baseline = horizon + Math.pow(depth, 1.25) * (height - horizon) * 0.92
        const size = (1.1 + depth * 3.2)
        for (let c = 0; c < cols; c += 1) {
          const x = (c / (cols - 1) - 0.5) * 2
          const y = surfaceHeight(x, z * 3, t)
          const sx = width / 2 + x * spread
          const sy = baseline - y * amp * (0.35 + depth * 0.65)
          const crest = (y + 1) / 2
          context.globalAlpha = (0.05 + depth * 0.45) * (0.55 + crest * 0.45)
          context.drawImage(sprite, sx - size, sy - size, size * 2, size * 2)
        }
      }
      context.globalAlpha = 1
    }

    let frame = 0, visible = false, started = performance.now()
    const loop = (now: number) => {
      frame = 0
      draw((now - started) / 1000)
      if (visible && !document.hidden && !reduce) frame = requestAnimationFrame(loop)
    }
    const start = () => { if (!frame) frame = requestAnimationFrame(loop) }
    const stop = () => { if (frame) { cancelAnimationFrame(frame); frame = 0 } }

    resize()
    draw(0)
    if (!reduce) {
      const observer = new IntersectionObserver(entries => {
        visible = entries[0]?.isIntersecting ?? false
        if (visible) start(); else stop()
      }, { threshold: 0 })
      observer.observe(holder)
      const onVisibility = () => { if (document.hidden) stop(); else if (visible) start() }
      const onResize = () => { resize(); if (!frame) draw((performance.now() - started) / 1000) }
      document.addEventListener('visibilitychange', onVisibility)
      window.addEventListener('resize', onResize)
      return () => { stop(); observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility); window.removeEventListener('resize', onResize) }
    }
    const onResize = () => { resize(); draw(0) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div ref={wrap} className="wave-wrap" aria-hidden="true">
      <div className="wave-stage">
        <canvas ref={canvas} className="wave-canvas" />
        <div className="wave-shade" />
      </div>
    </div>
  )
}
