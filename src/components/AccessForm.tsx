import { useState } from 'react'
import type { FormEvent } from 'react'
import { IconArrowUpRight } from '@tabler/icons-react'
import { AUTH_APP_URL, SUPPORT_EMAIL, access } from '../content'
import { isValidEmail, submitForm, type FormOutcome } from '../forms'

/** The access-code request. Delivered to the configured endpoint; every outcome is told to the visitor. */
export default function AccessForm() {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [outcome, setOutcome] = useState<FormOutcome | null>(null)
  const [touchedInvalid, setTouchedInvalid] = useState('')

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const value = email.trim()
    if (!value) { setTouchedInvalid('Enter your email address so we can send the code.'); return }
    if (!isValidEmail(value)) { setTouchedInvalid('That email address is missing an @ or a domain.'); return }
    setTouchedInvalid('')
    setBusy(true)
    setOutcome(await submitForm('access-request', { email: value }))
    setBusy(false)
  }

  const error = touchedInvalid || (outcome && !outcome.ok ? outcome.message : '')
  const done = outcome?.ok === true
  const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('LNYQ access request')}&body=${encodeURIComponent(`Please send an access code to ${email.trim()}.`)}`

  return (
    <form onSubmit={submit} noValidate aria-busy={busy}>
      <label htmlFor="access-email">Email address</label>
      <div className="site-access-row">
        <input id="access-email" type="email" name="email" autoComplete="email" required value={email} disabled={done} onChange={event => { setEmail(event.target.value); setTouchedInvalid(''); setOutcome(null) }} placeholder="you@company.com" aria-invalid={error ? true : undefined} aria-describedby="access-message" />
        <button type="submit" className="site-btn primary" disabled={busy || done}>{busy ? 'Sending' : done ? 'Requested' : access.button}</button>
      </div>
      <p id="access-message" className={error ? 'error' : done ? 'done' : undefined} role={error ? 'alert' : 'status'}>
        {done ? 'Received. Your access code is on its way.' : error || access.helper}
        {outcome && !outcome.ok && (outcome.reason === 'not-connected' || outcome.reason === 'network' || outcome.reason === 'rejected') && <> <a href={mailto}>Email us instead</a>.</>}
      </p>
      <a className="site-link" href={AUTH_APP_URL}>{access.signIn} <IconArrowUpRight size={13} aria-hidden="true" /></a>
    </form>
  )
}
