import { useState, useEffect } from 'react'
import LandingPage from '../pages/landing/LandingPage'
import LoginPage from '../pages/login/LoginPage'
import SignupPage from '../pages/signup/SignupPage'
import SuperuserLoginPage from '../pages/superuser-login/SuperuserLoginPage'
import SuperuserDashboard from '../pages/superuser-dashboard/SuperuserDashboard'
import MemberDashboard from '../pages/member-dashboard/MemberDashboard'
import LicenseExpiredPage from '../pages/license-expired/LicenseExpiredPage'

function App() {
  const isAlreadyAuthed = () => {
    const hasSuperuser = localStorage.getItem('ms_superuser') === '1'
    const hasToken = !!localStorage.getItem('ms_token')
    const hasRole = localStorage.getItem('ms_role') === 'superuser'
    // All three must be present and correct
    return hasSuperuser && hasToken && hasRole
  }
  const getStoredAdmin = () => {
    try { return JSON.parse(localStorage.getItem('ms_admin')) } catch { return null }
  }
  const [route, setRoute] = useState(() => {
    const path = window.location.pathname
    return isAlreadyAuthed() && path === '/login/suser' ? '/superuser/dashboard' : path
  })
  const [authenticated, setAuthenticated] = useState(isAlreadyAuthed)
  const [member, setMember] = useState(getStoredAdmin)
  const [licenseInfo, setLicenseInfo] = useState(null)   // { expiryDate, customerName }

  useEffect(() => {
    const onPopState = () => setRoute(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    if (window.location.pathname === '/login/suser' && isAlreadyAuthed()) {
      window.history.replaceState({}, '', '/superuser/dashboard')
    }
    // Validate authentication on mount
    if (authenticated && !isAlreadyAuthed()) {
      // Auth state is inconsistent, force logout
      setAuthenticated(false)
      if (window.location.pathname.startsWith('/superuser/')) {
        window.history.replaceState({}, '', '/login/suser')
        setRoute('/login/suser')
      }
    }
    return () => window.removeEventListener('popstate', onPopState)
  }, [authenticated])

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setRoute(path)
  }

  const goLogin   = () => { setLicenseInfo(null); navigate('/login') }
  const goSignup  = () => navigate('/signup')
  const goLanding = () => navigate('/')

  const login = (auth) => {
    // Clear any existing auth data first to prevent conflicts
    localStorage.removeItem('ms_token')
    localStorage.removeItem('ms_role')
    localStorage.removeItem('ms_admin')
    localStorage.removeItem('ms_superuser')
    
    // Set new superuser auth data
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

  // Called by LoginForm when backend returns license_expired: true
  const handleLicenseExpired = ({ expiryDate, customerName }) => {
    setLicenseInfo({ expiryDate, customerName })
    navigate('/license-expired')
  }

  const effectiveRoute = !authenticated && route === '/superuser/dashboard' ? '/login/suser' : route

  // ── License expired page ──────────────────────────────────
  if (effectiveRoute === '/license-expired') {
    return (
      <LicenseExpiredPage
        expiryDate={licenseInfo?.expiryDate}
        customerName={licenseInfo?.customerName}
        onBack={goLogin}
      />
    )
  }

  if (effectiveRoute === '/superuser/dashboard') {
    return <SuperuserDashboard onLogout={logout} />
  }

  const isMemberRoute = ['/member/dashboard', '/member/staffs', '/member/room-category', '/member/rooms', '/member/ota', '/member/tax-master', '/member/currency-master', '/member/activity-log'].includes(effectiveRoute)
    || effectiveRoute === '/member/room-master'
    || effectiveRoute.startsWith('/member/room-master/')

  if (isMemberRoute) {
    return <MemberDashboard admin={member} onLogout={memberLogout} route={effectiveRoute} onNavigate={navigate} />
  }

  if (effectiveRoute === '/login/suser') {
    return <SuperuserLoginPage onLogin={login} />
  }

  if (effectiveRoute === '/signup') {
    return <SignupPage onSignin={goLogin} />
  }

  if (effectiveRoute === '/login') {
    return (
      <LoginPage
        onBack={goLanding}
        onLogin={memberLogin}
        onSignup={goSignup}
        onLicenseExpired={handleLicenseExpired}
      />
    )
  }

  return <LandingPage onLogin={goLogin} />
}

export default App