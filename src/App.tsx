import { Route, Routes } from 'react-router-dom'
import { HelloWorld } from './pages/HelloWorld'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HelloWorld />} />
    </Routes>
  )
}

export default App
