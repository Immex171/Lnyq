import { useEffect, useRef } from 'react'
import DottedMark from './DottedMark'
import { vision } from '../../content'
import { revealOpacity, revealProgress } from '../../vision'

/**
 * The vision paragraphs, stacked with generous spacing. Each one starts
 * muted and brightens as it rises from the lower part of the viewport to
 * the middle; the numbered marker beside it brightens with it. The reveal
 * follows the scroll position, so it reverses on the way back up, and a
 * paragraph that has been read stays bright. Nothing is pinned, and the
 * section scrolls with the page. Under reduced motion, or before the script
 * runs, every paragraph is fully readable.
 */
export default function VisionSection() {
  const list = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const element = list.current
    if (!element) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const items = Array.from(element.querySelectorAll<HTMLLIElement>('.vision-item'))
    let frame = 0
    const paint = () => {
      frame = 0
      const vh = window.innerHeight
      for (const item of items) {
        const progress = revealProgress(item.getBoundingClientRect().top, vh)
        item.style.setProperty('--reveal', progress.toFixed(3))
        item.style.setProperty('--reveal-opacity', revealOpacity(progress).toFixed(3))
      }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint) }
    element.classList.add('is-live')
    paint()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); if (frame) cancelAnimationFrame(frame) }
  }, [])

  return (
    <section className="site-vision" id="about" aria-label="What LNYQ is for">
      <div className="vision-mark-wrap"><DottedMark /></div>
      <ol ref={list} className="vision-list">
        {vision.map((paragraph, index) => (
          <li key={index} className={`vision-item${index === 0 || index === vision.length - 1 ? ' large' : ''}`}>
            <span className="vision-marker" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <p>{paragraph}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
