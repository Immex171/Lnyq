import { useEffect, useRef, useState } from 'react'

/**
 * A slow heartbeat for the previews: counts up while the element is on
 * screen and the tab is visible, pauses otherwise, and never runs under
 * reduced motion. The previews derive their gentle movement from the count,
 * so a paused preview simply holds its last frame.
 */
export function useTicker(ref: React.RefObject<HTMLElement | null>, intervalMs: number) {
  const reduceMotion = typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)
  const [tick, setTick] = useState(0)
  const visible = useRef(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || reduceMotion) return
    const stop = () => { if (timer.current) { window.clearInterval(timer.current); timer.current = null } }
    const start = () => { stop(); timer.current = window.setInterval(() => setTick(value => value + 1), intervalMs) }
    const observer = new IntersectionObserver(entries => {
      visible.current = entries[0]?.isIntersecting ?? false
      if (visible.current && !document.hidden) start(); else stop()
    }, { threshold: 0.2 })
    observer.observe(element)
    const onVisibility = () => { if (document.hidden) stop(); else if (visible.current) start() }
    document.addEventListener('visibilitychange', onVisibility)
    return () => { stop(); observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility) }
  }, [ref, intervalMs, reduceMotion])

  return { tick, reduceMotion }
}

/** Deterministic noise in [0, 1) from a seed and a step, so every visitor sees the same quiet movement. */
export function noise(seed: number, step: number) {
  let value = (seed * 374761393 + step * 668265263) | 0
  value = Math.imul(value ^ (value >>> 13), 1274126177)
  return ((value ^ (value >>> 16)) >>> 0) / 4294967296
}
