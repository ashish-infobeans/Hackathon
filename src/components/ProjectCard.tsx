import { Link } from 'react-router-dom'
import './ProjectCard.css'

const PREVIEW_LIMIT = 3

export type ProjectCardProps = {
  id: string
  title: string
  shortDescription: string
  signupCount: number
  participantNames: string[]
  isSignedUp?: boolean
}

export function ProjectCard({
  id,
  title,
  shortDescription,
  signupCount,
  participantNames,
  isSignedUp = false,
}: ProjectCardProps) {
  const previewNames = participantNames.slice(0, PREVIEW_LIMIT)
  const remainingCount = participantNames.length - PREVIEW_LIMIT

  return (
    <Link
      to={`/project/${id}`}
      className={`project-card${isSignedUp ? ' project-card--signed-up' : ''}`}
    >
      <div className="project-card__header">
        <h2>{title}</h2>
        {isSignedUp ? (
          <span className="project-card__badge" aria-label="You joined this project">
            Joined
          </span>
        ) : null}
      </div>

      <p className="project-card__description">{shortDescription}</p>

      <div className="project-card__footer">
        <span className="project-card__count">
          {signupCount} signed up
        </span>

        {previewNames.length > 0 ? (
          <ul className="project-card__chips" aria-label="Participant preview">
            {previewNames.map((name) => (
              <li key={name} className="project-card__chip">
                {name}
              </li>
            ))}
            {remainingCount > 0 ? (
              <li className="project-card__chip project-card__chip--more">
                +{remainingCount} more
              </li>
            ) : null}
          </ul>
        ) : (
          <p className="project-card__empty">No participants yet</p>
        )}
      </div>
    </Link>
  )
}
