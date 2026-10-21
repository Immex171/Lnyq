import { useEffect, useRef, type ReactNode, type ElementType } from 'react'

/**
 * Restrained scroll-triggered entrance: a small rise and a fade over 600ms,
 * with an optional delay so related elements follow one another. Plays once
 * when the element enters the viewport. Under reduced motion the element is
 * simply there.
 */
export default function Reveal({ as: Tag = 'div', delay = 0, className, children, ...rest }: { as?: ElementType; delay?: number; className?: string; children: ReactNode } & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { element.classList.add('is-in'); return }
    const show = () => element.classList.add('is-in')
    // Anything already in view on mount shows on the next frame; the observer handles what scrolls in later.
    const rect = element.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) { const frame = requestAnimationFrame(show); return () => cancelAnimationFrame(frame) }
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) { show(); observer.disconnect() }
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return <Tag ref={ref} className={`reveal${className ? ` ${className}` : ''}`} style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties} {...rest}>{children}</Tag>
}
