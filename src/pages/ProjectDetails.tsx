import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProjectById, type Project } from '../data/projects'
import {
  fetchSignedUpProjectId,
  getProjectCta,
  giveUpProject,
  joinProject,
  switchProject,
  type ProjectCta,
} from '../data/signups'
import { useIdentity } from '../hooks/useIdentity'
import './ProjectDetails.css'
import './pages.css'

const CTA_LABELS: Record<ProjectCta, string> = {
  join: 'Join project',
  switch: 'Switch to this project',
  'give-up': 'Give up this project',
}

function ProjectDetailsSkeleton() {
  return (
    <section className="page" aria-busy="true" aria-label="Loading project details">
      <div className="skeleton skeleton--line skeleton--line-sm" />
      <header className="page__header">
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--line" />
        <div className="skeleton skeleton--line skeleton--line-short" />
      </header>

      <div className="details-panel">
        <div className="skeleton skeleton--line skeleton--line-sm" />
        <ul className="chip-list">
          <li className="skeleton skeleton--chip" />
          <li className="skeleton skeleton--chip" />
          <li className="skeleton skeleton--chip skeleton--chip-wide" />
        </ul>
        <div className="skeleton skeleton--button" />
      </div>
    </section>
  )
}

export function ProjectDetails() {
  const { id } = useParams()
  const { identity, ensureParticipant } = useIdentity()
  const [project, setProject] = useState<Project | null>(null)
  const [signedUpProjectId, setSignedUpProjectId] = useState<string | null>(null)
  const [loadedId, setLoadedId] = useState<string | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isActionPending, setIsActionPending] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const clientId = identity?.clientId
  const isLoading = Boolean(
    id && (id !== loadedId || (project !== null && project.id !== id)) && !fetchError,
  )
  const displayName = identity?.displayName ?? 'You'

  useEffect(() => {
    if (!id) return

    let cancelled = false

    void Promise.all([
      fetchProjectById(id, clientId),
      clientId ? fetchSignedUpProjectId(clientId) : Promise.resolve(null),
    ])
      .then(([result, signupProjectId]) => {
        if (!cancelled) {
          setProject(result)
          setSignedUpProjectId(signupProjectId)
          setLoadedId(id)
          setFetchError(null)
          setActionError(null)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFetchError('Could not load this project. Try again.')
          setLoadedId(id)
          setProject(null)
          setSignedUpProjectId(null)
        }
      })

    return () => {
      cancelled = true
    }
  }, [id, clientId])

  const handleCta = useCallback(async () => {
    if (!id || !project) return

    const cta = getProjectCta(id, signedUpProjectId)
    setIsActionPending(true)
    setActionError(null)

    try {
      const participantId = await ensureParticipant()

      if (cta === 'join') {
        await joinProject(participantId, id)
      } else if (cta === 'switch') {
        await switchProject(participantId, id)
      } else {
        await giveUpProject(participantId)
      }

      const [refetchedProject, refetchedSignupProjectId] = await Promise.all([
        fetchProjectById(id, clientId),
        clientId ? fetchSignedUpProjectId(clientId) : Promise.resolve(null),
      ])

      setProject(refetchedProject)
      setSignedUpProjectId(refetchedSignupProjectId)
    } catch {
      setActionError('Something went wrong. Try again.')
    } finally {
      setIsActionPending(false)
    }
  }, [clientId, ensureParticipant, id, project, signedUpProjectId])

  if (!id) {
    return (
      <section className="page page--centered">
        <h1>Project not found</h1>
        <p>That project does not exist or may have been removed.</p>
        <Link to="/" className="button">
          Back to projects
        </Link>
      </section>
    )
  }

  if (isLoading) {
    return <ProjectDetailsSkeleton />
  }

  if (fetchError) {
    return (
      <section className="page page--centered">
        <h1>Could not load project</h1>
        <p role="alert">{fetchError}</p>
        <Link to="/" className="button">
          Back to projects
        </Link>
      </section>
    )
  }

  if (!project) {
    return (
      <section className="page page--centered">
        <h1>Project not found</h1>
        <p>That project does not exist or may have been removed.</p>
        <Link to="/" className="button">
          Back to projects
        </Link>
      </section>
    )
  }

  const cta = getProjectCta(project.id, signedUpProjectId)

  return (
    <section className="page">
      <Link to="/" className="back-link">
        ← Back to projects
      </Link>

      <header className="page__header">
        <h1>{project.title}</h1>
        <p>{project.shortDescription}</p>
      </header>

      <div className="details-panel">
        <p>
          <strong>{project.signupCount}</strong> participant
          {project.signupCount === 1 ? '' : 's'} signed up
        </p>

        {project.participantNames.length > 0 ? (
          <ul className="chip-list" aria-label="Participants">
            {project.participantNames.map((name) => (
              <li key={name} className="chip">
                {name}
                {name === displayName ? ' (you)' : ''}
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">No participants yet. Be the first to join.</p>
        )}

        <div className="details-panel__actions">
          <button
            type="button"
            className={`button${cta === 'give-up' ? ' button--danger' : ''}`}
            disabled={isActionPending}
            onClick={() => {
              void handleCta()
            }}
          >
            {isActionPending ? 'Updating…' : CTA_LABELS[cta]}
          </button>

          {actionError ? (
            <p className="details-panel__error" role="alert">
              {actionError}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
