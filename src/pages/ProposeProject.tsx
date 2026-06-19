import { useId, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { submitProposal } from '../data/projects'
import { useIdentity } from '../hooks/useIdentity'
import {
  normalizeProposal,
  PROPOSAL_LIMITS,
  validateProposal,
  type ProposalValidationErrors,
} from '../lib/proposalValidation'
import './pages.css'

export function ProposeProject() {
  const { ensureParticipant } = useIdentity()
  const titleId = useId()
  const descriptionId = useId()
  const titleErrorId = useId()
  const descriptionErrorId = useId()

  const [title, setTitle] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [errors, setErrors] = useState<ProposalValidationErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedTitle, setSubmittedTitle] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validateProposal(title, shortDescription)
    setErrors(nextErrors)
    setSubmitError(null)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const values = normalizeProposal(title, shortDescription)
    if (!values) {
      return
    }

    setIsSubmitting(true)

    try {
      await ensureParticipant()
      await submitProposal(values)
      setSubmittedTitle(values.title)
      setTitle('')
      setShortDescription('')
      setErrors({})
    } catch {
      setSubmitError('Could not submit your proposal. Try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submittedTitle) {
    return (
      <section className="page page--centered">
        <header className="page__header">
          <h1>Proposal submitted</h1>
          <p>
            <strong>{submittedTitle}</strong> is pending review and will appear in the project list
            once approved.
          </p>
        </header>

        <Link to="/" className="button">
          Back to projects
        </Link>

        <button
          type="button"
          className="button button--secondary"
          onClick={() => setSubmittedTitle(null)}
        >
          Propose another project
        </button>
      </section>
    )
  }

  return (
    <section className="page">
      <header className="page__header">
        <h1>Propose a Project</h1>
        <p>Share a new idea for others to join. Submissions will be reviewed before publishing.</p>
      </header>

      <form className="propose-form" onSubmit={(event) => void handleSubmit(event)} noValidate>
        <label className="form-field" htmlFor={titleId}>
          <span>Title</span>
          <input
            id={titleId}
            type="text"
            name="title"
            value={title}
            maxLength={PROPOSAL_LIMITS.maxTitleLength}
            aria-invalid={errors.title ? true : undefined}
            aria-describedby={errors.title ? titleErrorId : undefined}
            placeholder="e.g. AI Pair Programming Assistant"
            disabled={isSubmitting}
            onChange={(event) => {
              setTitle(event.target.value)
              if (errors.title) {
                setErrors((current) => ({ ...current, title: undefined }))
              }
            }}
          />
          {errors.title ? (
            <span id={titleErrorId} className="form-field__error" role="alert">
              {errors.title}
            </span>
          ) : null}
        </label>

        <label className="form-field" htmlFor={descriptionId}>
          <span>Short description</span>
          <textarea
            id={descriptionId}
            name="shortDescription"
            rows={4}
            value={shortDescription}
            maxLength={PROPOSAL_LIMITS.maxDescriptionLength}
            aria-invalid={errors.shortDescription ? true : undefined}
            aria-describedby={errors.shortDescription ? descriptionErrorId : undefined}
            placeholder="Describe what the team will build..."
            disabled={isSubmitting}
            onChange={(event) => {
              setShortDescription(event.target.value)
              if (errors.shortDescription) {
                setErrors((current) => ({ ...current, shortDescription: undefined }))
              }
            }}
          />
          {errors.shortDescription ? (
            <span id={descriptionErrorId} className="form-field__error" role="alert">
              {errors.shortDescription}
            </span>
          ) : null}
        </label>

        {submitError ? (
          <p className="form-field__error" role="alert">
            {submitError}
          </p>
        ) : null}

        <button type="submit" className="button" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Submit proposal'}
        </button>
      </form>

      <p className="form-note">
        Pending proposals are hidden from the public list until approved.{' '}
        <Link to="/">Return to the project list</Link>.
      </p>
    </section>
  )
}
