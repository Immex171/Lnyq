import { readFile, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const videoUrl = new URL('../../public/media/lnyq-trade-demo.webm', import.meta.url)
const posterUrl = new URL('../../public/media/lnyq-trade-poster.png', import.meta.url)
const mp4Url = new URL('../../public/media/lnyq-trade-demo.mp4', import.meta.url)

describe('trade product film', () => {
  it('ships a real WebM video instead of a static mockup', async () => {
    const header = await readFile(fileURLToPath(videoUrl)).then(data => data.subarray(0, 4).toString('hex'))
    const size = await stat(fileURLToPath(videoUrl)).then(value => value.size)
    expect(header).toBe('1a45dfa3')
    // MediaRecorder output size varies across Chromium builds and hardware,
    // so validate a substantive video payload without assuming one encoder.
    expect(size).toBeGreaterThan(50_000)
  })

  it('ships an H.264 MP4 fallback for browsers without WebM', async () => {
    const data = await readFile(fileURLToPath(mp4Url))
    // ISO base media files carry the "ftyp" box type at byte 4.
    expect(data.subarray(4, 8).toString('ascii')).toBe('ftyp')
    expect(data.length).toBeGreaterThan(50_000)
  })

  it('ships a video poster for reduced-motion and loading states', async () => {
    const header = await readFile(fileURLToPath(posterUrl)).then(data => data.subarray(1, 4).toString('ascii'))
    expect(header).toBe('PNG')
  })
})
