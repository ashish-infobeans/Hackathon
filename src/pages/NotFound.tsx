import { Link } from 'react-router-dom'
import './pages.css'

export function NotFound() {
  return (
    <section className="page page--centered">
      <h1>404</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="button">
        Back to projects
      </Link>
    </section>
  )
}
