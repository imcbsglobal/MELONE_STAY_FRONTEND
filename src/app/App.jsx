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

  const login = (auth) => {
    localStorage.setItem('ms_superuser', '1')
    localStorage.setItem('ms_token', auth.token)
    localStorage.setItem('ms_role', 'superuser')
    setAuthenticated(true)
    navigate('/superuser/dashboard')
  }

  const memberLogin = (admin, token) => {
    localStorage.setItem('ms_token', token)
    localStorage.setItem('ms_role', 'admin')
    localStorage.setItem('ms_admin', JSON.stringify(admin))
    setMember(admin)
    navigate('/member/dashboard')
  }

  const memberLogout = () => {
    localStorage.removeItem('ms_token')
    localStorage.removeItem('ms_role')
    localStorage.removeItem('ms_admin')
    setMember(null)
    navigate('/login')
  }

  const logout = () => {
    localStorage.removeItem('ms_token')
    localStorage.removeItem('ms_role')
    localStorage.removeItem('ms_superuser')
    setAuthenticated(false)
    navigate('/login/suser')
  }

  const effectiveRoute = !authenticated && route === '/superuser/dashboard' ? '/login/suser' : route

  if (effectiveRoute === '/superuser/dashboard') {
    return <SuperuserDashboard onLogout={logout} />
  }

  const isMemberRoute = ['/member/dashboard', '/member/staffs', '/member/room-category', '/member/rooms', '/member/ota'].includes(effectiveRoute)
    || effectiveRoute === '/member/room-master'
    || effectiveRoute.startsWith('/member/room-master/')

  if (isMemberRoute) {
    return <MemberDashboard admin={member} onLogout={memberLogout} route={effectiveRoute} onNavigate={navigate} />
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