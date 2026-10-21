import { FORMS_URL } from './content'

/**
 * Delivery for the two forms on the site. Submissions are POSTed as JSON to
 * the configured endpoint. The endpoint owns the real duplicate check; this
 * module adds a local memory so a visitor who resubmits the same email from
 * the same browser is told so before the request is sent.
 */
export type FormKind = 'access-request' | 'project-submission'

export type FormOutcome =
  | { ok: true; duplicate?: false }
  | { ok: false; reason: 'not-connected' | 'invalid' | 'duplicate' | 'network' | 'rejected'; message: string }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const MEMORY_KEY = 'lnyq-landing-submissions'

export function isValidEmail(value: string): boolean { return EMAIL.test(value.trim()) }

function remembered(): string[] {
  try { return JSON.parse(localStorage.getItem(MEMORY_KEY) || '[]') as string[] } catch { return [] }
}
function remember(key: string) {
  try { localStorage.setItem(MEMORY_KEY, JSON.stringify([...new Set([...remembered(), key])])) } catch { /* storage unavailable; the endpoint still checks */ }
}
export function alreadySubmitted(kind: FormKind, email: string): boolean {
  return remembered().includes(`${kind}:${email.trim().toLowerCase()}`)
}

export async function submitForm(kind: FormKind, fields: Record<string, string>, fetcher: typeof fetch = fetch): Promise<FormOutcome> {
  const email = (fields.email ?? '').trim().toLowerCase()
  if (!isValidEmail(email)) return { ok: false, reason: 'invalid', message: 'That email address is missing an @ or a domain.' }
  if (!FORMS_URL) return { ok: false, reason: 'not-connected', message: 'Submissions are not connected yet. Email us directly and we will add you by hand.' }
  if (alreadySubmitted(kind, email)) return { ok: false, reason: 'duplicate', message: 'This email has already been submitted from this browser. We have it; there is nothing more to do.' }
  let response: Response
  try {
    response = await fetcher(FORMS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ kind, ...fields, email, submittedAt: new Date().toISOString(), page: typeof location !== 'undefined' ? location.href : '' }),
    })
  } catch {
    return { ok: false, reason: 'network', message: 'The request did not reach us. Check your connection and try again.' }
  }
  if (response.status === 409) { remember(`${kind}:${email}`); return { ok: false, reason: 'duplicate', message: 'This email is already on the list. We have it; there is nothing more to do.' } }
  if (!response.ok) return { ok: false, reason: 'rejected', message: `We could not record the submission (server answered ${response.status}). Try again in a minute, or email us directly.` }
  remember(`${kind}:${email}`)
  return { ok: true }
}
