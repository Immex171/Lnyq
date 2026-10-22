/**
 * How far a paragraph has been revealed, from where its top sits in the
 * viewport. 0 while the top is still in the lower part of the screen, 1 once
 * it has risen to the middle, and a straight line in between, so the reveal
 * follows the scroll and reverses with it.
 */
export const REVEAL_START = 0.82
export const REVEAL_END = 0.55
export const MIN_OPACITY = 0.25

export function revealProgress(top: number, viewportHeight: number): number {
  const start = viewportHeight * REVEAL_START
  const end = viewportHeight * REVEAL_END
  return Math.min(1, Math.max(0, (start - top) / (start - end)))
}

export function revealOpacity(progress: number): number {
  return MIN_OPACITY + (1 - MIN_OPACITY) * progress
}
