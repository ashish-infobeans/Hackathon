import { NavLink, Outlet } from 'react-router-dom'
import { useIdentity } from '../../hooks/useIdentity'
import './AppLayout.css'

export function AppLayout() {
  const { identity } = useIdentity()

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="app-header__inner">
          <NavLink to="/" className="app-header__brand">
            Hackathon Projects
          </NavLink>
          <div className="app-header__actions">
            <nav className="app-header__nav" aria-label="Main navigation">
              <NavLink to="/" end className="app-header__link">
                Projects
              </NavLink>
              <NavLink to="/propose" className="app-header__link">
                Propose
              </NavLink>
            </nav>
            {identity ? (
              <p className="app-header__user" aria-label={`Signed in as ${identity.displayName}`}>
                <span className="app-header__user-label">Signed in as</span>
                <span className="app-header__user-name">{identity.displayName}</span>
              </p>
            ) : null}
          </div>
        </div>
      </header>
      <main className="app-content">
        <div className="app-content__inner">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
