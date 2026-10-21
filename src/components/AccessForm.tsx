import { useState } from 'react'
import type { FormEvent } from 'react'
import { IconArrowUpRight } from '@tabler/icons-react'
import { AUTH_APP_URL, SUPPORT_EMAIL } from '../content'
import { isValidEmail, submitForm, type FormOutcome } from '../forms'

/** Task 5: the access-code request. Delivered to the configured endpoint; every outcome is told to the visitor. */
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
  const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('LNYQ testnet access request')}&body=${encodeURIComponent(`Please add ${email.trim()} to the LNYQ testnet access list.`)}`

  return (
    <form onSubmit={submit} noValidate aria-busy={busy}>
      <label htmlFor="ledger-access-email">Email address</label>
      <div className="ledger-access-row">
        <input id="ledger-access-email" type="email" name="email" autoComplete="email" required value={email} disabled={done} onChange={event => { setEmail(event.target.value); setTouchedInvalid(''); setOutcome(null) }} placeholder="you@company.com" aria-invalid={error ? true : undefined} aria-describedby="ledger-access-message" />
        <button type="submit" className="ledger-seal" disabled={busy || done}>{busy ? 'Sending…' : done ? 'Requested' : 'Request access'}</button>
      </div>
      <p id="ledger-access-message" className={error ? 'error' : done ? 'done' : undefined} role={error ? 'alert' : 'status'}>
        {done ? 'Received. We send codes in batches; watch your inbox.'
          : error || 'We only use this to send you a testnet access code.'}
        {outcome && !outcome.ok && (outcome.reason === 'not-connected' || outcome.reason === 'network' || outcome.reason === 'rejected') && <> <a href={mailto}>Email the access team instead</a>.</>}
      </p>
      <a className="ledger-link" href={AUTH_APP_URL}>Already have a code? Sign in to the app <IconArrowUpRight size={13} aria-hidden="true" /></a>
    </form>
  )
}
