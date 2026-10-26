import { useState } from 'react'
import AuthIcon from '../../../components/icons/AuthIcon'

function LoginForm({ mode, onModeChange, onLogin }) {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedDemo, setSelectedDemo] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ client: '', username: '', password: '' })

  const changeMode = (nextMode) => {
    onModeChange(nextMode)
    setSelectedDemo(nextMode === 'demo' ? 'Melone Stay demo' : null)
    setSubmitted(false)
    setError('')
    setForm(nextMode === 'demo' ? { client: 'melone-stay-demo', username: 'demo', password: 'melone-stay-demo' } : { client: '', username: '', password: '' })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin-login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: form.client.trim(), username: form.username.trim(), password: form.password }),
      })
      const data = await res.json()
      if (res.ok && data.success && data.token) {
        setSubmitted(true)
        if (onLogin) onLogin(data.admin, data.token)
      } else {
        setError(data.error || (data.success ? 'Sign-in did not return an authentication token' : 'Invalid credentials'))
      }
    } catch {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  return <>
    <div className="mode-switch" role="tablist" aria-label="Login type">
      <button className={mode === 'regular' ? 'active' : ''} type="button" onClick={() => changeMode('regular')}>Regular login</button>
      <button className={mode === 'demo' ? 'active' : ''} type="button" onClick={() => changeMode('demo')}>Demo users</button>
    </div>
    {mode === 'demo' && <p className="demo-intro">Demo access is ready. Enter the demo room to explore.</p>}
    <form onSubmit={handleSubmit}>
      <label>Gmail<div className={`input-wrap ${mode === 'demo' && selectedDemo ? 'locked' : ''}`}><AuthIcon name="briefcase" /><input required readOnly={mode === 'demo' && Boolean(selectedDemo)} value={form.client} onChange={(event) => setForm({ ...form, client: event.target.value })} placeholder="Your Gmail" /></div></label>
      <label>Username<div className={`input-wrap ${mode === 'demo' && selectedDemo ? 'locked' : ''}`}><AuthIcon name="user" /><input required readOnly={mode === 'demo' && Boolean(selectedDemo)} value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} placeholder="Your username" /></div></label>
      <label>Password<div className={`input-wrap ${mode === 'demo' && selectedDemo ? 'locked' : ''}`}><AuthIcon name="lock" /><input required readOnly={mode === 'demo' && Boolean(selectedDemo)} type={showPassword ? 'text' : 'password'} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Your password" /><button className="eye-button" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}><AuthIcon name="eye" /></button></div></label>
      {mode === 'regular' && <div className="form-options"><label className="remember"><input type="checkbox" defaultChecked /><span />Remember me</label><button type="button" className="text-button">Forgot password?</button></div>}
      <button type="submit" className="submit-button" disabled={loading}>{loading ? 'Signing in...' : (mode === 'demo' ? (selectedDemo ? 'Enter demo room' : 'Choose a demo account') : 'Continue')} <AuthIcon name="arrow" /></button>
      {submitted && <p className="success-message">Welcome in, {form.username}. Your room is ready.</p>}
      {error && <p className="demo-error">{error}</p>}
    </form>
    {mode === 'regular' && <p className="signup">New to Melone Stay? <button type="button" className="text-button">Create an account</button></p>}
  </>
}

export default LoginForm
