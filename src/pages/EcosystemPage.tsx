import { useState } from 'react'
import type { FormEvent } from 'react'
import { IconArrowUpRight } from '@tabler/icons-react'
import Reveal from '../reveal'
import { ECOSYSTEM_EMAIL } from '../content'
import { categories, projectsIn, statusLabel } from '../ecosystem'
import { isValidEmail, submitForm, type FormOutcome } from '../forms'

const EMPTY = { name: '', website: '', category: categories[1]!.id, description: '', contactName: '', email: '' }

export default function EcosystemPage() {
  const [fields, setFields] = useState(EMPTY)
  const [busy, setBusy] = useState(false)
  const [outcome, setOutcome] = useState<FormOutcome | null>(null)
  const [invalid, setInvalid] = useState<Record<string, string>>({})
  const set = (key: keyof typeof EMPTY) => (value: string) => { setFields(previous => ({ ...previous, [key]: value })); setInvalid(previous => ({ ...previous, [key]: '' })); setOutcome(null) }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const problems: Record<string, string> = {}
    if (!fields.name.trim()) problems.name = 'Name the project.'
    if (!fields.description.trim()) problems.description = 'Say in a sentence or two what it does.'
    if (!fields.contactName.trim()) problems.contactName = 'Tell us who to reply to.'
    if (!isValidEmail(fields.email)) problems.email = 'That email address is missing an @ or a domain.'
    if (fields.website.trim() && !/^https?:\/\/\S+\.\S+/.test(fields.website.trim())) problems.website = 'Start the website with http:// or https://.'
    setInvalid(problems)
    if (Object.keys(problems).length) return
    setBusy(true)
    setOutcome(await submitForm('project-submission', { name: fields.name.trim(), website: fields.website.trim(), category: fields.category, description: fields.description.trim(), contactName: fields.contactName.trim(), email: fields.email.trim() }))
    setBusy(false)
  }
  const done = outcome?.ok === true
  const failure = outcome && !outcome.ok ? outcome : null
  const mailto = `mailto:${ECOSYSTEM_EMAIL}?subject=${encodeURIComponent(`LNYQ ecosystem project: ${fields.name.trim() || 'submission'}`)}&body=${encodeURIComponent(`Project: ${fields.name}\nWebsite: ${fields.website}\nCategory: ${fields.category}\n\n${fields.description}\n\nContact: ${fields.contactName} <${fields.email}>`)}`

  return (
    <main className="site-main">
      <section className="site-hero compact" aria-labelledby="eco-page-title">
        <Reveal as="span" className="site-pill">Ecosystem</Reveal>
        <Reveal as="h1" id="eco-page-title" delay={80}>The LNYQ ecosystem.</Reveal>
        <Reveal as="p" className="site-hero-copy" delay={160}>Everything that runs on, trades on, quotes on or reads from LNYQ, starting with the protocol's own products. Projects building on LNYQ are added here as they ship.</Reveal>
        <Reveal className="site-hero-actions" delay={240}><a className="site-btn primary" href="#submit">Submit Project</a></Reveal>
      </section>

      {categories.map(category => {
        const list = projectsIn(category.id)
        return (
          <section key={category.id} className="site-section tight" id={`category-${category.id}`} aria-labelledby={`cat-${category.id}`}>
            <div className="site-two-col wide">
              <div className="site-two-col-copy">
                <Reveal as="h2" id={`cat-${category.id}`} className="site-h3">{category.name}</Reveal>
                <Reveal as="p" className="site-note" delay={60}>{category.description}</Reveal>
              </div>
              {list.length ? (
                <ol className="site-cards two">
                  {list.map((project, index) => (
                    <Reveal as="li" className="site-card compact" delay={80 + index * 70} key={project.name}>
                      <div className="site-product-head">
                        <h3>{project.url ? <a href={project.url}>{project.name} <IconArrowUpRight size={15} aria-hidden="true" /></a> : project.name}</h3>
                        <span className={`site-status${project.status === 'coming-soon' ? ' soon' : ''}`}><i />{statusLabel[project.status]}</span>
                      </div>
                      <p>{project.description}</p>
                    </Reveal>
                  ))}
                </ol>
              ) : (
                <Reveal className="site-card compact empty" delay={80}><p>No projects listed in this category yet. <a href="#submit">Submit yours</a> to be the first.</p></Reveal>
              )}
            </div>
          </section>
        )
      })}

      <section className="site-section" id="submit" aria-labelledby="submit-title">
        <div className="site-two-col narrow">
          <div className="site-two-col-copy">
            <Reveal as="span" className="site-pill">Submit a project</Reveal>
            <Reveal as="h2" id="submit-title" delay={80}>Building on LNYQ?</Reveal>
            <Reveal as="p" className="site-lead" delay={160}>Tell us the basics and how to reach you. We reply to every submission.</Reveal>
            <Reveal as="p" className="site-note" delay={220}>Prefer email? Write to <a href={`mailto:${ECOSYSTEM_EMAIL}`}>{ECOSYSTEM_EMAIL}</a>.</Reveal>
          </div>
          <Reveal className="site-card site-access-card" delay={160}>
            <form onSubmit={submit} noValidate aria-busy={busy} className="site-form">
              <label htmlFor="pf-name">Project name</label>
              <input id="pf-name" value={fields.name} disabled={done} onChange={e => set('name')(e.target.value)} aria-invalid={invalid.name ? true : undefined} />
              {invalid.name && <p className="error" role="alert">{invalid.name}</p>}
              <label htmlFor="pf-website">Website or repository <small>optional</small></label>
              <input id="pf-website" type="url" value={fields.website} disabled={done} placeholder="https://" onChange={e => set('website')(e.target.value)} aria-invalid={invalid.website ? true : undefined} />
              {invalid.website && <p className="error" role="alert">{invalid.website}</p>}
              <label htmlFor="pf-category">Category</label>
              <select id="pf-category" value={fields.category} disabled={done} onChange={e => set('category')(e.target.value)}>
                {categories.filter(c => c.id !== 'protocol').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <label htmlFor="pf-description">What it does</label>
              <textarea id="pf-description" rows={4} value={fields.description} disabled={done} onChange={e => set('description')(e.target.value)} aria-invalid={invalid.description ? true : undefined} />
              {invalid.description && <p className="error" role="alert">{invalid.description}</p>}
              <div className="site-form-row">
                <div><label htmlFor="pf-contact">Your name</label><input id="pf-contact" autoComplete="name" value={fields.contactName} disabled={done} onChange={e => set('contactName')(e.target.value)} aria-invalid={invalid.contactName ? true : undefined} />{invalid.contactName && <p className="error" role="alert">{invalid.contactName}</p>}</div>
                <div><label htmlFor="pf-email">Email</label><input id="pf-email" type="email" autoComplete="email" value={fields.email} disabled={done} onChange={e => set('email')(e.target.value)} aria-invalid={invalid.email ? true : undefined} />{invalid.email && <p className="error" role="alert">{invalid.email}</p>}</div>
              </div>
              <button type="submit" className="site-btn primary" disabled={busy || done}>{busy ? 'Sending…' : done ? 'Submitted' : 'Submit Project'}</button>
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
