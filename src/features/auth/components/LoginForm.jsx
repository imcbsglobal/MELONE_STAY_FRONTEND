import { useState } from 'react'
import AuthIcon from '../../../components/icons/AuthIcon'

function LoginForm({ onLogin, onSignup, onLicenseExpired }) {
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ client: '', username: '', password: '' })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin-login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: form.client.trim(),
          username: form.username.trim(),
          password: form.password,
        }),
      })
      const data = await res.json()

      // ── License expired / Inactive: always show the expired page ──
      if (res.status === 403) {
        if (onLicenseExpired) {
          onLicenseExpired({
            expiryDate: data.expiry_date || '',
            customerName: data.customer_name || '',
            isInactive: !data.license_expired,
          })
        }
        return
      }

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
    <form onSubmit={handleSubmit}>
      <label>Email<div className="input-wrap"><AuthIcon name="briefcase" /><input required value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="you@gmail.com" /></div></label>
      <label>Username<div className="input-wrap"><AuthIcon name="user" /><input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Your username" /></div></label>
      <label>Password<div className="input-wrap"><AuthIcon name="lock" /><input required type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" /><button className="eye-button" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}><AuthIcon name="eye" />{showPassword ? '' : ''}</button></div></label>
      <div className="form-options"><label className="remember"><input type="checkbox" defaultChecked /> Remember me</label><button type="button" className="text-button">Forgot password?</button></div>
      <button type="submit" className="submit-button" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
      {submitted && <p className="success-message">Welcome in, {form.username}. Your room is ready.</p>}
      {error && <p className="demo-error">{error}</p>}
    </form>
    <p className="signup">New to Melone Stay? <button type="button" className="text-button" onClick={onSignup}>Create an account</button></p>
  </>
}

export default LoginForm