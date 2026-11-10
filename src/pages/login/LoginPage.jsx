import LoginForm from '../../features/auth/components/LoginForm'
import meloneLogo from '../../assets/melone logo stay white.png'

const loginStyles = String.raw`
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.login-shell {
  min-height: 100svh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-family: 'Lato', sans-serif;
}

/* ── LEFT PANEL ── */
.world-panel {
  position: relative;
  min-height: 100svh;
  background: #1a4731;
  display: flex;
  flex-direction: column;
  padding: 28px 40px 32px;
  overflow: hidden;
}

/* subtle dot-grid texture */
.world-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255,255,255,.07) 1px, transparent 1px);
  background-size: 22px 22px;
  pointer-events: none;
}

.brand {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-logo {
  height: 48px;
  width: auto;
}

.world-copy {
  position: relative;
  z-index: 2;
  margin-top: 52px;
  color: #fff;
}

.world-copy h2 {
  font-size: clamp(32px, 3.5vw, 46px);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -1.5px;
  margin-bottom: 16px;
}

.world-description {
  font-size: 13px;
  color: rgba(255,255,255,.65);
  line-height: 1.65;
  max-width: 260px;
}

/* Room illustration card — grows to fill remaining space */
.room-illustration {
  position: relative;
  z-index: 2;
  margin-top: 40px;
  flex: 1;
  width: 100%;
  max-width: 420px;
  min-height: 260px;
  background: #14402b;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.08);
}

.room-illustration svg {
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  object-fit: cover;
}

/* availability pill on the illustration */
.room-pill {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background: #fff;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 600;
  color: #1a4731;
  box-shadow: 0 4px 12px rgba(0,0,0,.15);
}

.room-pill::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f59e0b;
  flex-shrink: 0;
}

.world-footer {
  position: relative;
  z-index: 2;
  padding-top: 24px;
  color: rgba(255,255,255,.4);
  font-size: 11px;
  flex-shrink: 0;
}

/* ── RIGHT PANEL ── */
.form-panel {
  position: relative;
  min-height: 100svh;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 48px;
}

.login-back {
  position: absolute;
  top: 24px;
  right: 32px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 0;
  background: transparent;
  color: #8e98a6;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  padding: 6px 0;
  transition: color .15s;
}

.login-back:hover { color: #394454; }

.form-inner {
  width: 100%;
  max-width: 360px;
  animation: rise-in .5s ease-out both;
}

.form-heading h1 {
  font-size: 26px;
  font-weight: 700;
  color: #172131;
  letter-spacing: -.5px;
  margin-bottom: 6px;
}

.form-subtitle {
  font-size: 13px;
  color: #8993a2;
  margin-bottom: 32px;
}

/* form fields */
form { display: grid; gap: 18px; }

form > label {
  display: grid;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #394454;
}

.input-wrap {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 12px;
  border: 1px solid #dde1e7;
  border-radius: 8px;
  background: #fff;
  transition: border-color .2s, box-shadow .2s;
}

.input-wrap:focus-within {
  border-color: #1a4731;
  box-shadow: 0 0 0 3px rgba(26,71,49,.1);
}

.field-icon {
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  margin-right: 10px;
  color: #b8c1cc;
}

.input-wrap input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #253244;
  font-size: 13px;
  font-family: inherit;
}

.input-wrap input::placeholder { color: #b7c0cb; }

.eye-button {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  margin-right: -6px;
  border: 0;
  background: transparent;
  color: #94a0ad;
  cursor: pointer;
}

.eye-button .field-icon { width: 15px; margin: 0; }

/* remember + forgot row */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: -4px 0 2px;
}

.remember {
  display: flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  font-size: 13px;
  color: #394454;
}

.remember input[type="checkbox"] {
  width: 14px;
  height: 14px;
  accent-color: #1a4731;
  cursor: pointer;
}

.text-button {
  padding: 0;
  border: 0;
  background: transparent;
  color: #1a4731;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  font-weight: 500;
}

.text-button:hover { text-decoration: underline; }

/* submit */
.submit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 46px;
  margin-top: 6px;
  border: 0;
  border-radius: 8px;
  background: #1a4731;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background .2s, transform .15s;
}

.submit-button:hover { background: #215432; transform: translateY(-1px); }
.submit-button:disabled { opacity: .6; cursor: not-allowed; transform: none; }
.submit-button .field-icon { width: 15px; margin: 0; color: #a8d5b8; }

/* messages */
.success-message { margin-top: 4px; color: #1a4731; font-size: 12px; text-align: center; }
.demo-error { margin-top: 4px; color: #c0404a; font-size: 12px; text-align: center; }

/* signup link */
.signup {
  margin-top: 20px;
  text-align: center;
  font-size: 13px;
  color: #8993a2;
}
.signup .text-button { font-weight: 600; }

/* bottom bar */
.form-bottom {
  position: absolute;
  bottom: 24px;
  left: 48px;
  right: 48px;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #b0b9c4;
}

/* keep unused demo styles intact so LoginForm doesn't break */
.mode-switch { display:none; }
.demo-users { display: grid; gap: 7px; margin: 0 0 20px; }
.demo-user { display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 10px; border: 1px solid #e5e8eb; border-radius: 8px; color: #394454; background: #fff; text-align: left; cursor: pointer; }
.demo-user:hover, .demo-user.selected { border-color: #7fc297; background: #f2f8f4; }
.avatar { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; color: #fff; font-size: 9px; font-weight: 700; flex-shrink: 0; }
.demo-user strong { display: block; font-size: 11px; font-weight: 600; }
.demo-user small { display: block; margin-top: 1px; color: #929daa; font-size: 9px; }
.select-check { margin-left: auto; color: #215432; opacity: 0; font-size: 13px; }
.demo-user.selected .select-check { opacity: 1; }
.demo-intro { margin: 0 0 14px; color: #8591a0; font-size: 11px; }
.input-wrap.locked { background: #f5f7f9; border-color: #e8edf1; }
.input-wrap.locked input { color: #7b8795; cursor: default; }
.tiny-line { width: 20px; height: 1px; margin: 0 9px; background: #d8dce0; display: inline-block; vertical-align: middle; }

@keyframes rise-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (max-width: 860px) {
  .login-shell { grid-template-columns: 1fr; }
  .world-panel { min-height: 420px; padding: 24px 28px; }
  .world-copy { margin-top: 32px; }
  .room-illustration { flex: none; height: 220px; margin-top: 32px; }
  .world-footer { display: none; }
  .form-panel { padding: 40px 28px 72px; }
  .form-bottom { left: 28px; right: 28px; }
}
`

function LoginPage({ onBack, onLogin, onSignup, onLicenseExpired }) {
  return (
    <>
      <style>{loginStyles}</style>
      <main className="login-shell">

        {/* ── LEFT: dark green panel ── */}
        <section className="world-panel">
          <div className="brand">
            <img src={meloneLogo} alt="Melone Stay" className="brand-logo" />
          </div>

         <div className="world-copy">
          <h2>
            Find your room.<br />
            Make it yours.
          </h2>
          <p className="world-description">
            Comfortable stays, verified rooms and easy check-in, wherever you're headed.
          </p>
        </div>
        

          {/* room illustration */}
          <div className="room-illustration">
            <div className="room-pill">Deluxe room · Available tonight</div>
            <svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
              {/* room background */}
              <rect width="300" height="220" fill="#0f3320"/>
              {/* floor */}
              <rect x="0" y="155" width="300" height="65" fill="#0a2818"/>
              {/* back wall window */}
              <rect x="165" y="28" width="95" height="108" rx="4" fill="#0a2818" stroke="#1e5c38" strokeWidth="1.5"/>
              {/* window panes */}
              <rect x="172" y="35" width="36" height="42" rx="2" fill="#0d1f15" opacity=".9"/>
              <rect x="215" y="35" width="36" height="42" rx="2" fill="#0d1f15" opacity=".9"/>
              <rect x="172" y="84" width="36" height="42" rx="2" fill="#0d1f15" opacity=".9"/>
              <rect x="215" y="84" width="36" height="42" rx="2" fill="#0d1f15" opacity=".9"/>
              {/* moon */}
              <circle cx="233" cy="56" r="11" fill="#f5c842" opacity=".9"/>
              {/* bed frame */}
              <rect x="18" y="108" width="138" height="62" rx="6" fill="#1e5c38"/>
              {/* headboard */}
              <rect x="18" y="94" width="138" height="24" rx="5" fill="#174a2e"/>
              {/* pillows */}
              <rect x="26" y="100" width="50" height="24" rx="5" fill="#e8f0e9" opacity=".92"/>
              <rect x="84" y="100" width="50" height="24" rx="5" fill="#e8f0e9" opacity=".92"/>
              {/* blanket */}
              <rect x="18" y="124" width="138" height="46" rx="4" fill="#2a7a4e"/>
              <rect x="18" y="124" width="138" height="12" rx="3" fill="#e8f0e9" opacity=".85"/>
              {/* nightstand */}
              <rect x="166" y="134" width="38" height="28" rx="4" fill="#174a2e"/>
              {/* lamp base + pole */}
              <rect x="182" y="114" width="4" height="20" rx="2" fill="#2a6640"/>
              {/* lamp shade */}
              <ellipse cx="184" cy="112" rx="18" ry="9" fill="#f5c842" opacity=".85"/>
              {/* plant pot */}
              <rect x="250" y="138" width="18" height="22" rx="3" fill="#174a2e"/>
              {/* plant leaves */}
              <ellipse cx="259" cy="130" rx="15" ry="19" fill="#1e6b38"/>
              <ellipse cx="250" cy="124" rx="11" ry="14" fill="#1a5c30"/>
              <ellipse cx="267" cy="122" rx="10" ry="12" fill="#1a5c30"/>
              <defs>
                <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f5c842" stopOpacity=".5"/>
                  <stop offset="100%" stopColor="#f5c842" stopOpacity="0"/>
                </radialGradient>
              </defs>
            </svg>
          </div>

          <div className="world-footer">© 2026 Melone Stay</div>
        </section>

        {/* ── RIGHT: white form panel ── */}
        <section className="form-panel">
          {onBack && (
            <button className="login-back" onClick={onBack} aria-label="Back to home">
              ‹ Back
            </button>
          )}

          <div className="form-inner">
            <div className="form-heading">
              <h1>Welcome back</h1>
              <p className="form-subtitle">Sign in to manage your stays and bookings.</p>
            </div>
            <LoginForm onLogin={onLogin} onSignup={onSignup} onLicenseExpired={onLicenseExpired} />
          </div>

          <div className="form-bottom">
            <span>Terms &amp; privacy</span>
          </div>
        </section>

      </main>
    </>
  )
}

export default LoginPage
