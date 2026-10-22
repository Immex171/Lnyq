import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { IconArrowUpRight, IconBrandX, IconWorld } from '@tabler/icons-react'
import Reveal from '../reveal'
import { ECOSYSTEM_EMAIL } from '../content'
import { activeCategories, categoryName, entriesIn, ownProducts, submissionCategories, type CategoryId, type EcosystemEntry } from '../ecosystem'
import { isValidEmail, submitForm, type FormOutcome } from '../forms'

const EMPTY = { name: '', website: '', x: '', category: submissionCategories[0]!.id, description: '', contactName: '', email: '' }
const LOGO_LIMIT = 512 * 1024

function EntryCard({ entry, delay }: { entry: EcosystemEntry; delay: number }) {
  return (
    <Reveal as="li" className={`eco-card${entry.own ? ' own' : ''}`} delay={delay}>
      <img className="eco-logo" src={entry.logo} alt="" width={48} height={48} />
      <div className="eco-card-body">
        <div className="eco-card-head"><h3>{entry.name}</h3><span className="eco-tag">{entry.tag ?? categoryName(entry.category)}</span></div>
        <p>{entry.about}</p>
        <div className="eco-links">
          {entry.app && <a href={entry.app} target="_blank" rel="noreferrer">Open app <IconArrowUpRight size={13} aria-hidden="true" /></a>}
          {entry.website && <a href={entry.website} target="_blank" rel="noreferrer" aria-label={`${entry.name} website`}><IconWorld size={15} aria-hidden="true" /> Website</a>}
          {entry.x && <a href={entry.x} target="_blank" rel="noreferrer" aria-label={`${entry.name} on X`}><IconBrandX size={14} aria-hidden="true" /></a>}
        </div>
      </div>
    </Reveal>
  )
}

export default function EcosystemPage() {
  const [filter, setFilter] = useState<CategoryId | 'all'>('all')
  const [fields, setFields] = useState(EMPTY)
  const [logo, setLogo] = useState<{ name: string; data: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [outcome, setOutcome] = useState<FormOutcome | null>(null)
  const [invalid, setInvalid] = useState<Record<string, string>>({})
  const set = (key: keyof typeof EMPTY) => (value: string) => { setFields(previous => ({ ...previous, [key]: value })); setInvalid(previous => ({ ...previous, [key]: '' })); setOutcome(null) }

  const onLogo = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setInvalid(previous => ({ ...previous, logo: '' }))
    if (!file) { setLogo(null); return }
    if (file.size > LOGO_LIMIT) { setLogo(null); setInvalid(previous => ({ ...previous, logo: 'Keep the logo under 512 KB.' })); return }
    const reader = new FileReader()
    reader.onload = () => setLogo({ name: file.name, data: String(reader.result) })
    reader.readAsDataURL(file)
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const problems: Record<string, string> = {}
    if (!fields.name.trim()) problems.name = 'Name the project.'
    if (!fields.description.trim()) problems.description = 'Say in a sentence or two what it does.'
    if (!fields.contactName.trim()) problems.contactName = 'Tell us who to reply to.'
    if (!isValidEmail(fields.email)) problems.email = 'That email address is missing an @ or a domain.'
    if (fields.website.trim() && !/^https?:\/\/\S+\.\S+/.test(fields.website.trim())) problems.website = 'Start the website with http:// or https://.'
    if (fields.x.trim() && !/^https?:\/\/(x\.com|twitter\.com)\/\S+/.test(fields.x.trim())) problems.x = 'Paste the full X profile link.'
    setInvalid(problems)
    if (Object.keys(problems).length) return
    setBusy(true)
    setOutcome(await submitForm('project-submission', { name: fields.name.trim(), website: fields.website.trim(), x: fields.x.trim(), category: fields.category, description: fields.description.trim(), contactName: fields.contactName.trim(), email: fields.email.trim(), logoName: logo?.name ?? '', logo: logo?.data ?? '' }))
    setBusy(false)
  }
  const done = outcome?.ok === true
  const failure = outcome && !outcome.ok ? outcome : null
  const mailto = `mailto:${ECOSYSTEM_EMAIL}?subject=${encodeURIComponent(`LNYQ ecosystem: ${fields.name.trim() || 'project'}`)}&body=${encodeURIComponent(`Project: ${fields.name}\nWebsite: ${fields.website}\nX: ${fields.x}\nCategory: ${fields.category}\n\n${fields.description}\n\nContact: ${fields.contactName} <${fields.email}>`)}`

  const tabs = activeCategories()
  const list = entriesIn(filter)

  return (
    <main className="site-main">
      <section className="site-hero compact" aria-labelledby="eco-page-title">
        <Reveal as="h1" id="eco-page-title">The LNYQ ecosystem.</Reveal>
        <Reveal as="p" className="site-hero-copy" delay={80}>The products, projects, and tools in the LNYQ network.</Reveal>
        <Reveal className="site-hero-actions" delay={160}><a className="site-btn primary" href="#submit">Join the ecosystem</a></Reveal>
      </section>

      <section className="site-section tight" aria-labelledby="eco-own-title">
        <Reveal as="h2" id="eco-own-title" className="site-h3">LNYQ products</Reveal>
        <ol className="eco-grid pinned">
          {ownProducts().map((entry, index) => <EntryCard entry={entry} delay={80 + index * 70} key={entry.name} />)}
        </ol>
      </section>

      <section className="site-section tight" aria-labelledby="eco-dir-title">
        <Reveal as="h2" id="eco-dir-title" className="site-h3">Directory</Reveal>
        <div className="eco-tabs" role="tablist" aria-label="Filter by category">
          <button type="button" role="tab" aria-selected={filter === 'all'} className={filter === 'all' ? 'active' : undefined} onClick={() => setFilter('all')}>All</button>
          {tabs.map(category => <button type="button" role="tab" key={category.id} aria-selected={filter === category.id} className={filter === category.id ? 'active' : undefined} onClick={() => setFilter(category.id)}>{category.name}</button>)}
        </div>
        <ol className="eco-grid" key={filter}>
          {list.map((entry, index) => <EntryCard entry={entry} delay={40 + index * 50} key={entry.name} />)}
        </ol>
      </section>

      <section className="site-section" id="submit" aria-labelledby="submit-title">
        <div className="site-two-col narrow">
          <div className="site-two-col-copy">
            <Reveal as="h2" id="submit-title">Building on LNYQ?</Reveal>
            <Reveal as="p" className="site-lead" delay={80}>Tell us the basics and how to reach you. We reply to every submission.</Reveal>
            <Reveal as="p" className="site-note" delay={140}>Open to creators launching NFTs, market makers, builders, and any team building on LNYQ.</Reveal>
            <Reveal as="p" className="site-note" delay={180}>Prefer email? Write to <a href={`mailto:${ECOSYSTEM_EMAIL}`}>{ECOSYSTEM_EMAIL}</a>.</Reveal>
          </div>
          <Reveal className="site-card site-access-card" delay={120}>
            <form onSubmit={submit} noValidate aria-busy={busy} className="site-form">
              <label htmlFor="pf-name">Project name</label>
              <input id="pf-name" value={fields.name} disabled={done} onChange={e => set('name')(e.target.value)} aria-invalid={invalid.name ? true : undefined} />
              {invalid.name && <p className="error" role="alert">{invalid.name}</p>}
              <label htmlFor="pf-logo">Logo <small>PNG, JPG or SVG</small></label>
              <input id="pf-logo" type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" disabled={done} onChange={onLogo} aria-invalid={invalid.logo ? true : undefined} />
              {invalid.logo && <p className="error" role="alert">{invalid.logo}</p>}
              <label htmlFor="pf-website">Website or repository <small>optional</small></label>
              <input id="pf-website" type="url" value={fields.website} disabled={done} placeholder="https://" onChange={e => set('website')(e.target.value)} aria-invalid={invalid.website ? true : undefined} />
              {invalid.website && <p className="error" role="alert">{invalid.website}</p>}
              <label htmlFor="pf-x">X link <small>optional</small></label>
              <input id="pf-x" type="url" value={fields.x} disabled={done} placeholder="https://x.com/" onChange={e => set('x')(e.target.value)} aria-invalid={invalid.x ? true : undefined} />
              {invalid.x && <p className="error" role="alert">{invalid.x}</p>}
              <label htmlFor="pf-category">Category</label>
              <select id="pf-category" value={fields.category} disabled={done} onChange={e => set('category')(e.target.value)}>
                {submissionCategories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
              <label htmlFor="pf-description">What it does</label>
              <textarea id="pf-description" rows={4} value={fields.description} disabled={done} onChange={e => set('description')(e.target.value)} aria-invalid={invalid.description ? true : undefined} />
              {invalid.description && <p className="error" role="alert">{invalid.description}</p>}
              <div className="site-form-row">
                <div><label htmlFor="pf-contact">Your name</label><input id="pf-contact" autoComplete="name" value={fields.contactName} disabled={done} onChange={e => set('contactName')(e.target.value)} aria-invalid={invalid.contactName ? true : undefined} />{invalid.contactName && <p className="error" role="alert">{invalid.contactName}</p>}</div>
                <div><label htmlFor="pf-email">Email</label><input id="pf-email" type="email" autoComplete="email" value={fields.email} disabled={done} onChange={e => set('email')(e.target.value)} aria-invalid={invalid.email ? true : undefined} />{invalid.email && <p className="error" role="alert">{invalid.email}</p>}</div>
              </div>
              <button type="submit" className="site-btn primary" disabled={busy || done}>{busy ? 'Sending' : done ? 'Submitted' : 'Submit project'}</button>
              <p className={failure ? 'error' : done ? 'done' : undefined} role={failure ? 'alert' : 'status'}>
                {done ? 'Received. We reply from ecosystem@lnyq.xyz.' : failure ? failure.message : 'We only use your contact to reply about this project.'}
                {failure && (failure.reason === 'not-connected' || failure.reason === 'network' || failure.reason === 'rejected') && <> <a href={mailto}>Send it by email instead</a>.</>}
              </p>
            </form>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
