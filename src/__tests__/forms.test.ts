import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('form delivery', () => {
  beforeEach(() => {
    vi.resetModules()
    const store = new Map<string, string>()
    vi.stubGlobal('localStorage', { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => { store.set(k, v) }, removeItem: (k: string) => { store.delete(k) } })
  })

  it('rejects an invalid email before any request is made', async () => {
    vi.stubEnv('VITE_LNYQ_FORMS_URL', 'https://forms.example/submit')
    const { submitForm } = await import('../forms')
    const fetcher = vi.fn()
    expect(await submitForm('access-request', { email: 'nope' }, fetcher as unknown as typeof fetch)).toMatchObject({ ok: false, reason: 'invalid' })
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('says so when no endpoint is configured instead of pretending to send', async () => {
    vi.stubEnv('VITE_LNYQ_FORMS_URL', '')
    const { submitForm } = await import('../forms')
    expect(await submitForm('access-request', { email: 'a@b.co' })).toMatchObject({ ok: false, reason: 'not-connected' })
  })

  it('delivers, remembers the email, and reports a repeat and a 409 as duplicates', async () => {
    vi.stubEnv('VITE_LNYQ_FORMS_URL', 'https://forms.example/submit')
    const { submitForm } = await import('../forms')
    const calls: Array<{ url: string; body: Record<string, unknown> }> = []
    const fetcher = vi.fn(async (url: string, init: RequestInit) => { calls.push({ url, body: JSON.parse(String(init.body)) }); return new Response('{}', { status: 200 }) })
    expect(await submitForm('access-request', { email: 'Trader@LNYQ.xyz' }, fetcher as unknown as typeof fetch)).toEqual({ ok: true })
    expect(calls[0]!.url).toBe('https://forms.example/submit')
    expect(calls[0]!.body).toMatchObject({ kind: 'access-request', email: 'trader@lnyq.xyz' })
    expect(await submitForm('access-request', { email: 'trader@lnyq.xyz' }, fetcher as unknown as typeof fetch)).toMatchObject({ ok: false, reason: 'duplicate' })
    expect(fetcher).toHaveBeenCalledTimes(1)
    const conflict = vi.fn(async () => new Response('', { status: 409 }))
    expect(await submitForm('project-submission', { email: 'new@lnyq.xyz', name: 'Bot' }, conflict as unknown as typeof fetch)).toMatchObject({ ok: false, reason: 'duplicate' })
  })

  it('reports network failures and server rejections distinctly', async () => {
    vi.stubEnv('VITE_LNYQ_FORMS_URL', 'https://forms.example/submit')
    const { submitForm } = await import('../forms')
    const down = vi.fn(async () => { throw new TypeError('Failed to fetch') })
    expect(await submitForm('access-request', { email: 'x@y.io' }, down as unknown as typeof fetch)).toMatchObject({ ok: false, reason: 'network' })
    const broken = vi.fn(async () => new Response('', { status: 500 }))
    expect(await submitForm('access-request', { email: 'x2@y.io' }, broken as unknown as typeof fetch)).toMatchObject({ ok: false, reason: 'rejected' })
  })
})
