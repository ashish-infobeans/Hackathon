import { Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AppLayout } from './components/layout/AppLayout'
import { NotFound } from './pages/NotFound'
import { ProjectDetails } from './pages/ProjectDetails'
import { ProjectList } from './pages/ProjectList'
import { ProposeProject } from './pages/ProposeProject'

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<ProjectList />} />
          <Route path="project/:id" element={<ProjectDetails />} />
          <Route path="propose" element={<ProposeProject />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}

export default App
