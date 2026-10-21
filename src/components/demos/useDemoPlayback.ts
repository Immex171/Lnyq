import { useEffect, useRef, useState } from 'react'

/**
 * Drives a demo card: plays its sequence when the card is on screen, holds
 * at the end long enough to read the result, then repeats gently; pauses
 * when the card leaves the screen. Under reduced motion it reports the final
 * frame once and never advances.
 */
export function useDemoPlayback(ref: React.RefObject<HTMLElement | null>, steps: number, stepMs: number, holdMs = 2400) {
  const reduceMotion = typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)
  const [frame, setFrame] = useState(reduceMotion ? steps : 0)
  const [cycle, setCycle] = useState(0)
  const visible = useRef(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || reduceMotion) return
    let current = 0
    const clear = () => { if (timer.current) { window.clearTimeout(timer.current); timer.current = null } }
    const advance = () => {
      if (!visible.current) return
      if (current >= steps) { current = 0; setFrame(0); setCycle(value => value + 1); timer.current = window.setTimeout(advance, 600); return }
      current += 1; setFrame(current)
      timer.current = window.setTimeout(advance, current >= steps ? holdMs : stepMs)
    }
    const observer = new IntersectionObserver(entries => {
      const on = entries[0]?.isIntersecting ?? false
      visible.current = on
      clear()
      if (on) timer.current = window.setTimeout(advance, 500)
    }, { threshold: 0.4 })
    observer.observe(element)
    const onVisibility = () => { if (document.hidden) clear(); else if (visible.current) timer.current = window.setTimeout(advance, 300) }
    document.addEventListener('visibilitychange', onVisibility)
    return () => { clear(); observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility) }
  }, [ref, steps, stepMs, holdMs, reduceMotion])

  return { frame, cycle, reduceMotion }
}
