import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  const toggleTheme = () => setDarkMode(!darkMode)

  return (
    <>
      <div className="bg-animated"></div>
      <Layout darkMode={darkMode} toggleTheme={toggleTheme}>
        <Dashboard />
      </Layout>
    </>
  )
}

export default App
