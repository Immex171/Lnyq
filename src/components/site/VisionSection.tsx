import Reveal from '../../reveal'
import { vision } from '../../content'

/** Five paragraphs, each alone on screen, revealed as the visitor scrolls. No heading, no numbers, no labels. */
export default function VisionSection() {
  return (
    <section className="site-vision" id="about" aria-label="What LNYQ is for">
      {vision.map((paragraph, index) => (
        <Reveal as="p" key={index} className={index === 0 || index === vision.length - 1 ? 'vision-large' : 'vision-body'}>{paragraph}</Reveal>
      ))}
    </section>
  )
}
