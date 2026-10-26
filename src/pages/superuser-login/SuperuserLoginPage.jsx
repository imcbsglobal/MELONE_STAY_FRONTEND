import { useState } from 'react'
import PointGlobe from '../../components/visuals/PointGlobe'
import AuthIcon from '../../components/icons/AuthIcon'
import earthTexture from '../../assets/earth-atmos.jpg'
import cloudTexture from '../../assets/earth-clouds.png'
import meloneLogo from '../../assets/melone logo.png'

const styles = String.raw`
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap');
.superuser-shell { min-height: 100svh; display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(500px, .95fr); overflow: hidden; background: #071a2a; }
.superuser-world { position: relative; min-height: 100svh; overflow: hidden; color: #d7eeee; background: radial-gradient(circle at 65% 46%, #143527 0, #0a2417 27%, #082117 61%, #04120c 100%); }
.superuser-world::before { content: ''; position: absolute; inset: 0; opacity: .45; background-image: linear-gradient(rgba(170, 214, 182, .06) 1px, transparent 1px), linear-gradient(90deg, rgba(170, 214, 182, .06) 1px, transparent 1px); background-size: 46px 46px; mask-image: linear-gradient(90deg, black, transparent 75%); }
.superuser-brand { position: absolute; z-index: 4; top: 34px; left: 7.5%; display: flex; align-items: center; gap: 10px; color: #ecffff; font-size: clamp(12px, 1.55vw, 16px); font-weight: 700; letter-spacing: -.5px; white-space: nowrap; }.superuser-brand .brand-logo { height: 26px; width: auto; object-fit: contain; }.brand-mark { display: inline-flex; gap: 2px; align-items: flex-end; height: 18px; }.brand-mark i { display: block; width: 4px; border-radius: 4px; background: #ffb001; transform: skewY(-26deg); }.brand-mark i:nth-child(1) { height: 10px; }.brand-mark i:nth-child(2) { height: 15px; background: #2e7d4f; }.brand-mark i:nth-child(3) { height: 12px; background: #8ad0a8; }
.superuser-copy { position: absolute; z-index: 3; top: 50%; left: 7.5%; width: 350px; transform: translateY(-50%); animation: superuser-copy-rise .8s ease-out both; }.superuser-copy .eyebrow { margin: 0 0 17px; color: #ffb001; text-transform: uppercase; font-size: 11px; font-weight: 700; letter-spacing: 2px; }.superuser-copy h2 { margin: 0; color: #efffff; font-size: clamp(36px, 4vw, 62px); line-height: 1.04; font-weight: 500; letter-spacing: -2px; }.superuser-copy h2 em { color: #8ad0a8; font-family: 'Playfair Display', Georgia, serif; font-weight: 500; }.superuser-copy p { width: 280px; margin: 24px 0 0; color: #9bc4ac; font-size: 13px; line-height: 1.65; }.superuser-globe { position: absolute; inset: 0; pointer-events: none; }.superuser-globe .photo-globe { position: absolute; width: 92%; aspect-ratio: 1; top: 8%; left: 25%; overflow: hidden; border-radius: 50%; background-color: #082117; background-image: url(${earthTexture}); background-position: 93% center; background-size: auto 100%; background-repeat: repeat-x; box-shadow: -18px 12px 28px rgba(0, 0, 0, .24), 0 0 22px rgba(255, 190, 60, .22); animation: superuser-globe-drift 34s linear infinite; }.superuser-globe .photo-globe::before { content: ''; position: absolute; inset: 0; z-index: 1; border-radius: 50%; background: radial-gradient(circle at 30% 25%, rgba(255, 226, 162, .14), transparent 25%); }.superuser-globe .photo-globe::after { content: ''; position: absolute; inset: -2px; z-index: 3; border-radius: 50%; border: 1px solid rgba(255, 213, 116, .42); box-shadow: 0 0 18px rgba(255, 190, 60, .22); }.superuser-globe .photo-clouds { position: absolute; z-index: 2; inset: 0; border-radius: 50%; background-image: url(${cloudTexture}); background-position: 93% center; background-size: auto 100%; background-repeat: repeat-x; mix-blend-mode: screen; opacity: .12; animation: superuser-globe-drift 42s linear infinite reverse; }.superuser-globe .globe-canvas { z-index: 2; opacity: .12; mix-blend-mode: screen; }
.superuser-panel { position: relative; display: flex; align-items: center; justify-content: center; min-height: 100svh; background: #f2f5f8; }.superuser-panel::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 52% 30%, rgba(255, 255, 255, .9), transparent 56%); }.superuser-form { position: relative; width: min(100% - 72px, 500px); padding: 18px 28px 44px; animation: superuser-rise .8s .08s ease-out both; }.superuser-heading .eyebrow { display: inline-flex; align-items: center; gap: 7px; margin: 0 0 15px; color: #1d693f; text-transform: uppercase; font-size: 11px; font-weight: 700; letter-spacing: 2px; }.superuser-heading .eyebrow::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: #215432; box-shadow: 0 0 8px rgba(33, 84, 50, .7); }.superuser-heading h1 { margin: 0; color: #172131; font-family: 'Playfair Display', Georgia, serif; font-size: clamp(50px, 5vw, 68px); font-weight: 500; letter-spacing: -3px; line-height: 1.08; }.superuser-heading h1 span { color: #215432; }.superuser-subtitle { margin: 14px 0 34px; color: #8993a2; font-size: 13px; }.superuser-form form { display: grid; gap: 20px; }.superuser-form form > label { display: grid; gap: 8px; color: #929ba8; font-size: 10px; font-weight: 700; letter-spacing: 1.35px; text-transform: uppercase; }.superuser-form .input-wrap { display: flex; align-items: center; height: 58px; padding: 0 14px; border: 1px solid #e1e5e9; border-radius: 12px; background: #fff; transition: border .2s, box-shadow .2s; }.superuser-form .input-wrap:focus-within { border-color: #7fc297; box-shadow: 0 0 0 3px rgba(33, 84, 50, .12); }.superuser-form .field-icon { flex: 0 0 auto; width: 17px; height: 17px; margin-right: 12px; color: #b8c1cc; }.superuser-form input { width: 100%; min-width: 0; border: 0; outline: 0; color: #253244; background: transparent; font-size: 13px; }.superuser-form input::placeholder { color: #b7c0cb; }.superuser-form .eye-button { display: grid; place-items: center; width: 28px; height: 28px; margin-right: -7px; border: 0; color: #94a0ad; background: transparent; }.superuser-form .eye-button .field-icon { width: 16px; margin: 0; }.superuser-options { display: flex; justify-content: space-between; align-items: center; margin: -4px 0 2px; color: #8e98a6; font-size: 10px; }.superuser-remember { display: flex; align-items: center; gap: 7px; cursor: pointer; }.superuser-remember input { position: absolute; opacity: 0; }.superuser-remember span { width: 13px; height: 13px; border: 1px solid #bfc8d1; border-radius: 3px; background: #fff; }.superuser-remember input:checked + span { border-color: #215432; background: #215432; box-shadow: inset 0 0 0 3px #fff; }.superuser-submit { display: flex; align-items: center; justify-content: center; gap: 9px; height: 58px; margin-top: 6px; border: 0; border-radius: 12px; color: #fff; background: #14402b; font-size: 13px; font-weight: 600; box-shadow: 0 8px 16px rgba(20, 64, 43, .18); transition: transform .2s, background .2s; }.superuser-submit:hover { background: #215432; transform: translateY(-1px); }.superuser-submit:disabled { opacity: .6; cursor: not-allowed; transform: none; }.superuser-submit .field-icon { width: 16px; margin: 0; color: #cde8d8; }.superuser-success { margin: -4px 0 0; color: #1d693f; font-size: 11px; text-align: center; }.superuser-error { margin: -4px 0 0; color: #c0392b; font-size: 11px; text-align: center; }.superuser-footer { position: absolute; right: 44px; bottom: 22px; left: 44px; display: flex; justify-content: space-between; color: #a1aab4; font-size: 10px; }.superuser-mobile-brand { display: none; }
@keyframes superuser-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } } @keyframes superuser-copy-rise { from { opacity: 0; transform: translateY(calc(-50% + 14px)); } to { opacity: 1; transform: translateY(-50%); } } @keyframes superuser-globe-drift { from { background-position: 93% center; } to { background-position: -7% center; } }
@media (max-width: 900px) { .superuser-shell { grid-template-columns: 1fr; }.superuser-world { min-height: 430px; }.superuser-copy { top: 54%; left: 8%; }.superuser-copy h2 { font-size: 42px; }.superuser-panel { min-height: 640px; }.superuser-form { padding-top: 52px; } }
@media (max-width: 500px) { .superuser-world { min-height: 370px; }.superuser-brand { top: 25px; }.superuser-copy { top: 57%; left: 8%; }.superuser-copy h2 { font-size: 36px; letter-spacing: -1px; }.superuser-form { width: min(100% - 48px, 500px); padding: 46px 0 58px; }.superuser-heading h1 { font-size: 52px; }.superuser-footer { right: 24px; bottom: 20px; left: 24px; font-size: 9px; } }
`

function SuperuserLoginPage({ onLogin }) {
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [form, setForm] = useState({ username: '', password: '' })

	const handleSubmit = async (event) => {
		event.preventDefault()
		setError('')

		if (!form.username || !form.password) {
			setError('Enter your username and password')
			return
		}

		setLoading(true)

		try {
			const response = await fetch('/api/superuser-login/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			})

			const data = await response.json()

			if (response.ok && data.success && data.token) {
				onLogin(data)
			} else {
				setError(data.error || (data.success ? 'Sign-in did not return an authentication token' : 'Login failed. Please try again.'))
			}
		} catch {
			setError('Cannot reach server. Please try again later.')
		} finally {
			setLoading(false)
		}
	}

	return <><style>{styles}</style><main className="superuser-shell">
		<section className="superuser-world">
			<div className="superuser-brand"><img src={meloneLogo} alt="Melone Stay" className="brand-logo" /></div>
			<div className="superuser-copy"><p className="eyebrow">Secure access</p><h2>Lead the room.<br /><em>Shape what matters.</em></h2><p>Private controls for the people who keep every room moving.</p></div>
			<div className="superuser-globe"><PointGlobe /></div>
		</section>
		<section className="superuser-panel">
			<div className="superuser-form">
				<div className="superuser-heading"><p className="eyebrow">Superuser access</p><h1>Sign in<span>.</span></h1><p className="superuser-subtitle">Enter your administrator credentials to continue.</p></div>
				<form onSubmit={handleSubmit}>
					<label>Username<div className="input-wrap"><AuthIcon name="user" /><input required value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} placeholder="Your username" /></div></label>
					<label>Password<div className="input-wrap"><AuthIcon name="lock" /><input required type={showPassword ? 'text' : 'password'} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Your password" /><button className="eye-button" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}><AuthIcon name="eye" /></button></div></label>
					  <div className="superuser-options"><label className="superuser-remember"><input type="checkbox" defaultChecked /><span />Remember me</label></div>
					<button type="submit" className="superuser-submit" disabled={loading}>{loading ? 'Verifying...' : 'Continue'} <AuthIcon name="arrow" /></button>
					{error && <p className="superuser-error">{error}</p>}
				</form>
			</div>
			<div className="superuser-footer"><span>Private by design</span><span>Admin console</span></div>
		</section>
	</main></>
}

export default SuperuserLoginPage
