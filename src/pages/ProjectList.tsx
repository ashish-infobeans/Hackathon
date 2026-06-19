import { useEffect, useState } from 'react'
import { ProjectCard } from '../components/ProjectCard'
import { fetchApprovedProjects, type Project } from '../data/projects'
import { useIdentity } from '../hooks/useIdentity'
import './pages.css'

export function ProjectList() {
  const { identity } = useIdentity()
  const [projects, setProjects] = useState<Project[]>([])
  const [loadedClientId, setLoadedClientId] = useState<string | undefined | null>(null)
  const [error, setError] = useState<string | null>(null)

  const clientId = identity?.clientId
  const isLoading = loadedClientId !== clientId && error === null

  useEffect(() => {
    let cancelled = false

    void fetchApprovedProjects(clientId)
      .then((result) => {
        if (!cancelled) {
          setProjects(result)
          setLoadedClientId(clientId)
          setError(null)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Could not load projects. Try again.')
          setLoadedClientId(clientId)
        }
      })

    return () => {
      cancelled = true
    }
  }, [clientId])

  return (
    <section className="page">
      <header className="page__header">
        <h1>Project List</h1>
        <p>Browse available hackathon projects and join one that fits your interests.</p>
      </header>

      {isLoading ? (
        <p className="project-list__status" aria-live="polite">
          Loading projects…
        </p>
      ) : null}

      {error ? (
        <p className="empty-state" role="alert">
          {error}
        </p>
      ) : null}

      {!isLoading && !error && projects.length === 0 ? (
        <p className="empty-state">No projects yet.</p>
      ) : null}

      {!isLoading && !error && projects.length > 0 ? (
        <ul className="project-grid">
          {projects.map((project) => (
            <li key={project.id}>
              <ProjectCard
                id={project.id}
                title={project.title}
                shortDescription={project.shortDescription}
                signupCount={project.signupCount}
                participantNames={project.participantNames}
                isSignedUp={project.isSignedUp}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
