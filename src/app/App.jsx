import { useState, useEffect } from 'react'
import LandingPage from '../pages/landing/LandingPage'
import LoginPage from '../pages/login/LoginPage'
import SuperuserLoginPage from '../pages/superuser-login/SuperuserLoginPage'
import SuperuserDashboard from '../pages/superuser-dashboard/SuperuserDashboard'
import MemberDashboard from '../pages/member-dashboard/MemberDashboard'

function App() {
  const isAlreadyAuthed = () => localStorage.getItem('ms_superuser') === '1'
  const getStoredAdmin = () => {
    try { return JSON.parse(localStorage.getItem('ms_admin')) } catch { return null }
  }
  const [route, setRoute] = useState(() => {
    const path = window.location.pathname
    return isAlreadyAuthed() && path === '/login/suser' ? '/superuser/dashboard' : path
  })
  const [authenticated, setAuthenticated] = useState(isAlreadyAuthed)
  const [member, setMember] = useState(getStoredAdmin)

  useEffect(() => {
    const onPopState = () => setRoute(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    if (window.location.pathname === '/login/suser' && isAlreadyAuthed()) {
      window.history.replaceState({}, '', '/superuser/dashboard')
    }
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setRoute(path)
  }

  const goLogin = () => navigate('/login')

  const goLanding = () => navigate('/')

  const login = () => {
    localStorage.setItem('ms_superuser', '1')
    setAuthenticated(true)
    navigate('/superuser/dashboard')
  }

  const memberLogin = (admin) => {
    localStorage.setItem('ms_admin', JSON.stringify(admin))
    setMember(admin)
    navigate('/member/dashboard')
  }

  const memberLogout = () => {
    localStorage.removeItem('ms_admin')
    setMember(null)
    navigate('/login')
  }

  const logout = () => {
    localStorage.removeItem('ms_superuser')
    setAuthenticated(false)
    navigate('/login/suser')
  }

  const effectiveRoute = !authenticated && route === '/superuser/dashboard' ? '/login/suser' : route

  if (effectiveRoute === '/superuser/dashboard') {
    return <SuperuserDashboard onLogout={logout} />
  }

  if (effectiveRoute === '/member/dashboard') {
    return <MemberDashboard admin={member} onLogout={memberLogout} />
  }

  if (effectiveRoute === '/login/suser') {
    return <SuperuserLoginPage onLogin={login} />
  }

  if (effectiveRoute === '/login') {
    return <LoginPage onBack={goLanding} onLogin={memberLogin} />
  }

  return <LandingPage onLogin={goLogin} />
}

export default App