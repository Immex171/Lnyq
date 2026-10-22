/** The wave surface: a sum of sines in position and time with no period reset, so the motion is seamless. Within [-1, 1]. */
export function surfaceHeight(x: number, z: number, t: number): number {
  return Math.sin(x * 2.2 + t * 0.55 + z * 1.6) * 0.5
    + Math.sin(z * 4.2 - t * 0.42) * 0.32
    + Math.sin((x + z) * 3.1 + t * 0.3) * 0.18
}
