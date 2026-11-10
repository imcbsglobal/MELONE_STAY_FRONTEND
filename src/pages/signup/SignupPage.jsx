import { useState, useRef, useEffect } from 'react'
import React from 'react'
import AuthIcon from '../../components/icons/AuthIcon'
import meloneLogo from '../../assets/melone logo stay white.png'

const signupStyles = String.raw`
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap');

*, *::before, *::after { box-sizing: border-box; }

/* ── SHELL ── */
.signup-shell {
  min-height: 100svh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-family: 'DM Sans', sans-serif;
}

/* ── LEFT PANEL ── */
.signup-left {
  position: relative;
  min-height: 100svh;
  background: #1a4731;
  display: flex;
  flex-direction: column;
  padding: 28px 40px 32px;
  overflow: hidden;
}

.signup-left::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px);
  background-size: 22px 22px;
  pointer-events: none;
}

/* logo */
.signup-logo {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 10px;
}

.signup-logo img {
  height: 48px;
  width: auto;
}

.signup-logo span {
  display: none; /* logo image already has the brand name */
}

/* trial badge */
.trial-badge {
  position: relative;
  z-index: 2;
  margin-top: 40px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  background: rgba(255,255,255,.1);
  border: 1px solid rgba(255,255,255,.18);
  border-radius: 999px;
  color: #d4f0e0;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.2px;
  width: fit-content;
}

.trial-badge::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #7fd9a8;
  box-shadow: 0 0 8px rgba(127,217,168,.6);
  flex-shrink: 0;
}

/* headline */
.signup-headline {
  position: relative;
  z-index: 2;
  margin-top: 28px;
  color: #fff;
  font-size: clamp(30px, 3vw, 42px);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -1px;
}

/* vertical step list */
.signup-steps-list {
  position: relative;
  z-index: 2;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 0;
  list-style: none;
  padding: 0;
}

.signup-step-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 0;
  position: relative;
}

/* connecting line between steps */
.signup-step-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 19px;
  top: 50px;
  bottom: -14px;
  width: 2px;
  background: rgba(255,255,255,.12);
}

.signup-step-item.s-active:not(:last-child)::after {
  background: rgba(127,217,168,.3);
}

.signup-step-num {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
  flex-shrink: 0;
  border: 2px solid rgba(255,255,255,.2);
  color: rgba(255,255,255,.45);
  background: transparent;
  transition: all 0.2s;
}

.signup-step-item.s-active .signup-step-num {
  background: #f59e0b;
  border-color: #f59e0b;
  color: #fff;
  box-shadow: 0 0 0 4px rgba(245,158,11,.2);
}

.signup-step-item.s-completed .signup-step-num {
  background: #2e7d4f;
  border-color: #2e7d4f;
  color: #fff;
}

.signup-step-text strong {
  display: block;
  font-size: 17px;
  font-weight: 600;
  color: rgba(255,255,255,.45);
  line-height: 1.3;
}

.signup-step-text small {
  display: block;
  font-size: 14px;
  color: rgba(255,255,255,.28);
  margin-top: 3px;
}

.signup-step-item.s-active .signup-step-text strong {
  color: #fff;
}

.signup-step-item.s-active .signup-step-text small {
  color: rgba(255,255,255,.6);
}

.signup-step-item.s-completed .signup-step-text strong {
  color: rgba(255,255,255,.6);
}

/* left footer */
.signup-left-footer {
  position: relative;
  z-index: 2;
  margin-top: auto;
  padding-top: 32px;
  color: rgba(255,255,255,.3);
  font-size: 13px;
}

/* ── RIGHT PANEL ── */
.signup-right {
  position: relative;
  min-height: 100svh;
  background: #f8f9f7;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 56px;
}

/* top nav links */
.signup-nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 32px;
}

.signup-nav-back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 0;
  background: transparent;
  color: #8e98a6;
  font-size: 15px;
  font-family: inherit;
  cursor: pointer;
  padding: 6px 0;
  transition: color .15s;
}

.signup-nav-back:hover { color: #394454; }

.signup-nav-signin {
  font-size: 15px;
  color: #8e98a6;
}

.signup-nav-signin button {
  color: #1a4731;
  background: none;
  border: 0;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
  font-family: inherit;
}

.signup-nav-signin button:hover { text-decoration: underline; }

/* content area */
.signup-content {
  width: 100%;
  max-width: 440px;
}

/* step title / subtitle */
.step-content {
  margin-bottom: 28px;
  text-align: center;
}

.step-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(32px, 3.5vw, 44px);
  font-weight: 500;
  color: #172131;
  margin: 0 0 8px;
  letter-spacing: -1.2px;
  line-height: 1.15;
}

.step-subtitle {
  font-size: 15px;
  color: #8993a2;
  margin: 0;
  line-height: 1.5;
}

/* form elements */
.signup-form { display: grid; gap: 16px; }

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-label {
  font-size: 12px;
  font-weight: 700;
  color: #929ba8;
  text-transform: uppercase;
  letter-spacing: 1.35px;
}

.required { color: #ba6670; margin-left: 2px; }

.form-input-wrap {
  display: flex;
  align-items: center;
  height: 46px;
  padding: 0 12px;
  background: #fff;
  border: 1px solid #e1e5e9;
  border-radius: 10px;
  transition: border-color .2s, box-shadow .2s;
}

.form-input-wrap:focus-within {
  border-color: #1a4731;
  box-shadow: 0 0 0 3px rgba(26,71,49,.1);
}

.form-input-wrap.filled {
  border-color: #c8dbd0;
}

.input-icon {
  width: 16px;
  height: 16px;
  color: #b8c1cc;
  margin-right: 10px;
  flex-shrink: 0;
}

.form-input {
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: #253244;
  font-size: 15px;
  font-family: inherit;
}

.form-input::placeholder { color: #b7c0cb; }

/* google button */
.google-signin {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 52px;
  background: #fff;
  border: 1px solid #e1e5e9;
  border-radius: 10px;
  color: #394454;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 4px rgba(28,46,74,.06);
  font-family: inherit;
}

.google-signin:hover {
  background: #fafbfc;
  border-color: #d0d6dd;
  box-shadow: 0 3px 10px rgba(28,46,74,.1);
}

.google-icon { width: 20px; height: 20px; }

/* terms / links */
.terms-text {
  font-size: 14px;
  color: #8e98a6;
  text-align: center;
  line-height: 1.5;
}

.terms-text a { color: #1a4731; text-decoration: none; font-weight: 600; }
.terms-text a:hover { text-decoration: underline; }

.signin-link {
  font-size: 14px;
  color: #9ca5af;
  text-align: center;
}

.signin-link button {
  color: #1a4731;
  background: none;
  border: 0;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
  font-family: inherit;
}

.signin-link button:hover { text-decoration: underline; }

/* action buttons */
.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 6px;
}

.btn {
  height: 48px;
  border: 0;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
}

.btn-back {
  flex: 0 0 auto;
  padding: 0 20px;
  background: transparent;
  border: 1px solid #e1e5e9;
  color: #8e98a6;
}

.btn-back:hover {
  background: rgba(142,152,166,.05);
  border-color: #d8dce0;
  color: #5b6b85;
}

.btn-primary {
  flex: 1;
  background: #1a4731;
  color: #fff;
  box-shadow: 0 4px 14px rgba(26,71,49,.18);
}

.btn-primary:hover {
  background: #215432;
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(26,71,49,.22);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* plan cards */
.plan-option {
  padding: 20px 22px;
  background: #fff;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.plan-option:hover { border-color: #7fc297; }

.plan-option.selected {
  background: #f2f8f4;
  border-color: #2e7d4f;
  box-shadow: 0 0 0 3px rgba(46,125,79,.1);
}

.plan-check {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #d8dce0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: transparent;
  transition: all 0.2s ease;
  font-size: 11px;
}

.plan-option.selected .plan-check {
  background: #1a4731;
  border-color: #1a4731;
}

.plan-name {
  font-size: 18px;
  font-weight: 700;
  color: #1a4731;
  margin: 0 0 4px;
  letter-spacing: -0.4px;
}

.plan-details { font-size: 13px; color: #8993a2; margin: 0; }

/* completion */
.completion-content { text-align: center; padding: 16px 0; }

.success-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 24px;
  border-radius: 50%;
  background: #f2f8f4;
  border: 3px solid #7fc297;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a4731;
  font-size: 32px;
}

.completion-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 30px;
  font-weight: 500;
  color: #172131;
  margin: 0 0 8px;
  letter-spacing: -1px;
}

.completion-message {
  font-size: 13px;
  color: #8993a2;
  margin: 0 0 28px;
  line-height: 1.6;
}

.completion-message strong { color: #1a4731; font-weight: 600; }

.credentials-box {
  background: #fff;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 18px;
  text-align: left;
  box-shadow: 0 2px 8px rgba(28,46,74,.05);
}

.credentials-title {
  font-size: 10px;
  font-weight: 700;
  color: #929ba8;
  text-transform: uppercase;
  letter-spacing: 1.35px;
  margin: 0 0 16px;
}

.credential-item {
  padding: 12px 0;
  border-bottom: 1px solid #e9edf1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.credential-item:last-child { border-bottom: 0; padding-bottom: 0; }

.credential-label {
  font-size: 11px;
  color: #8e98a6;
  margin: 0 0 4px;
  font-weight: 500;
}

.credential-value {
  font-size: 13px;
  color: #253244;
  font-weight: 600;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.2px;
}

.credential-value.masked { color: #5b6b85; letter-spacing: 1.5px; }

.copy-btn {
  padding: 5px 10px;
  background: transparent;
  border: 1px solid #e1e5e9;
  border-radius: 7px;
  color: #8e98a6;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 11px;
  font-weight: 600;
}

.copy-btn:hover { background: #f6f7f4; color: #1a4731; border-color: #d8dce0; }

.info-box {
  background: rgba(26,71,49,.05);
  border: 1px solid rgba(26,71,49,.14);
  border-radius: 10px;
  padding: 14px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-bottom: 20px;
  text-align: left;
}

.info-icon { width: 17px; height: 17px; color: #1a4731; flex-shrink: 0; margin-top: 1px; }

.info-text { font-size: 12px; color: #5b6b85; line-height: 1.6; margin: 0; }
.info-text strong { color: #1a4731; font-weight: 600; }

/* right panel bottom bar */
.signup-right-footer {
  position: absolute;
  bottom: 20px;
  left: 32px;
  font-size: 11px;
  color: #b0b9c4;
}

@media (max-width: 900px) {
  .signup-shell { grid-template-columns: 1fr; }
  .signup-left { min-height: auto; padding: 24px 28px 32px; }
  .signup-steps-list { display: none; }
  .signup-right { padding: 80px 24px 60px; }
  .signup-nav { padding: 16px 24px; }
  .form-row { grid-template-columns: 1fr; }
}
`

// ── Credential row with copy + reveal ──────────────────────────────────────
function CredentialRow({ label, value, secret }) {
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied]     = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(value || '').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }).catch(() => {})
  }

  return (
    <div className="credential-item">
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="credential-label">{label}</p>
        <p className="credential-value" style={secret && !revealed ? {} : {}}>
          {secret && !revealed ? '••••••••••••' : (value || '—')}
        </p>
      </div>
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        {secret && (
          <button
            className="copy-btn"
            type="button"
            onClick={() => setRevealed(v => !v)}
            title={revealed ? 'Hide' : 'Show'}
          >
            {revealed ? '🙈 Hide' : '👁 Show'}
          </button>
        )}
        <button
          className="copy-btn"
          type="button"
          onClick={handleCopy}
          title="Copy to clipboard"
        >
          {copied ? '✓ Copied' : '📋 Copy'}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// IMPORTANT: Replace this with your real Google Client ID.
// Get one at https://console.cloud.google.com/ → Credentials
// Authorized JS origin: http://localhost:5173
// ─────────────────────────────────────────────────────────────
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

// ── Dial code lookup by ISO 3166-1 alpha-2 country code ──────────────────
const DIAL_CODES = {
  AF:'+93',  AL:'+355', DZ:'+213', AD:'+376', AO:'+244', AG:'+1',
  AR:'+54',  AM:'+374', AU:'+61',  AT:'+43',  AZ:'+994', BS:'+1',
  BH:'+973', BD:'+880', BB:'+1',   BY:'+375', BE:'+32',  BZ:'+501',
  BJ:'+229', BT:'+975', BO:'+591', BA:'+387', BW:'+267', BR:'+55',
  BN:'+673', BG:'+359', BF:'+226', BI:'+257', CV:'+238', KH:'+855',
  CM:'+237', CA:'+1',   CF:'+236', TD:'+235', CL:'+56',  CN:'+86',
  CO:'+57',  KM:'+269', CG:'+242', CR:'+506', HR:'+385', CU:'+53',
  CY:'+357', CZ:'+420', DK:'+45',  DJ:'+253', DM:'+1',   DO:'+1',
  EC:'+593', EG:'+20',  SV:'+503', GQ:'+240', ER:'+291', EE:'+372',
  SZ:'+268', ET:'+251', FJ:'+679', FI:'+358', FR:'+33',  GA:'+241',
  GM:'+220', GE:'+995', DE:'+49',  GH:'+233', GR:'+30',  GD:'+1',
  GT:'+502', GN:'+224', GW:'+245', GY:'+592', HT:'+509', HN:'+504',
  HU:'+36',  IS:'+354', IN:'+91',  ID:'+62',  IR:'+98',  IQ:'+964',
  IE:'+353', IL:'+972', IT:'+39',  JM:'+1',   JP:'+81',  JO:'+962',
  KZ:'+7',   KE:'+254', KI:'+686', KP:'+850', KR:'+82',  KW:'+965',
  KG:'+996', LA:'+856', LV:'+371', LB:'+961', LS:'+266', LR:'+231',
  LY:'+218', LI:'+423', LT:'+370', LU:'+352', MG:'+261', MW:'+265',
  MY:'+60',  MV:'+960', ML:'+223', MT:'+356', MH:'+692', MR:'+222',
  MU:'+230', MX:'+52',  FM:'+691', MD:'+373', MC:'+377', MN:'+976',
  ME:'+382', MA:'+212', MZ:'+258', MM:'+95',  NA:'+264', NR:'+674',
  NP:'+977', NL:'+31',  NZ:'+64',  NI:'+505', NE:'+227', NG:'+234',
  MK:'+389', NO:'+47',  OM:'+968', PK:'+92',  PW:'+680', PA:'+507',
  PG:'+675', PY:'+595', PE:'+51',  PH:'+63',  PL:'+48',  PT:'+351',
  QA:'+974', RO:'+40',  RU:'+7',   RW:'+250', KN:'+1',   LC:'+1',
  VC:'+1',   WS:'+685', SM:'+378', ST:'+239', SA:'+966', SN:'+221',
  RS:'+381', SC:'+248', SL:'+232', SG:'+65',  SK:'+421', SI:'+386',
  SB:'+677', SO:'+252', ZA:'+27',  SS:'+211', ES:'+34',  LK:'+94',
  SD:'+249', SR:'+597', SE:'+46',  CH:'+41',  SY:'+963', TW:'+886',
  TJ:'+992', TZ:'+255', TH:'+66',  TL:'+670', TG:'+228', TO:'+676',
  TT:'+1',   TN:'+216', TR:'+90',  TM:'+993', TV:'+688', UG:'+256',
  UA:'+380', AE:'+971', GB:'+44',  US:'+1',   UY:'+598', UZ:'+998',
  VU:'+678', VE:'+58',  VN:'+84',  YE:'+967', ZM:'+260', ZW:'+263',
}

function SignupPage({ onSignin }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading]         = useState(false)
  const [googleBusy, setGoogleBusy]   = useState(false)
  const [error, setError]             = useState('')
  const [showPassword, setShowPassword]     = useState(false)
  const [showSuPassword, setShowSuPassword] = useState(false)
  const [countries, setCountries] = useState([])
  const [loadingCountries, setLoadingCountries] = useState(false)
  const [isAutoUsername, setIsAutoUsername] = useState(true)
  const [isAutoPassword, setIsAutoPassword] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    organizationName: '',
    city: '',
    country: '',
    countryId: '',  // Store country ID for API call
    address: '',
    phoneNumber: '',
    dialCode: '',   // Auto-set from country selection
    username: '',
    password: '',
    financialYear: ''  // Will be auto-fetched based on country
  })

  const tokenClientRef  = useRef(null)
  const scriptLoadedRef = useRef(false)

  // ── Fetch countries from Central Master Management API ──
  useEffect(() => {
    if (currentStep === 2) {
      fetchCountries()
    }
  }, [currentStep])

  const fetchCountries = async () => {
    setLoadingCountries(true)
    try {
      const response = await fetch('/api/countries/')
      if (!response.ok) throw new Error('Failed to fetch countries')
      const data = await response.json()
      
      console.log('Countries API Response:', data) // Debug log
      
      // API returns array of country objects with id, country_name, and financial year data
      if (Array.isArray(data)) {
        // Transform API data to match our format
        const transformedCountries = data.map(country => ({
          id: country.id,
          country_name: country.country_name,
          country_code: country.country_code,
          currency_code: country.currency_code,
          // Calculate financial year from fy_from_month and fy_to_month
          financial_year: country.remark || `${country.fy_from_month} to ${country.fy_to_month}`,
          fy_from_month: country.fy_from_month,
          fy_to_month: country.fy_to_month
        }))
        setCountries(transformedCountries)
        console.log('Loaded countries:', transformedCountries.length) // Debug log
      }
    } catch (error) {
      console.error('Error fetching countries:', error)
      setError('Failed to load country list. Please check your connection and try again.')
      setCountries([])
    } finally {
      setLoadingCountries(false)
    }
  }

  // Handle country selection and auto-fetch financial year
  const handleCountryChange = async (e) => {
    const selectedCountryName = e.target.value
    const selectedCountry = countries.find(c => c.country_name === selectedCountryName)
    
    if (selectedCountry) {
      const dialCode = DIAL_CODES[selectedCountry.country_code] || ''
      // Update form data with country name, ID, financial year, and dial code
      setFormData(prev => ({
        ...prev,
        country: selectedCountry.country_name,
        countryId: selectedCountry.id,
        dialCode,
        financialYear: selectedCountry.financial_year || 
                      `${selectedCountry.fy_from_month}-${selectedCountry.fy_to_month}` ||
                      ''
      }))
      
      console.log('Selected country:', selectedCountry, 'Dial code:', dialCode) // Debug log
    } else {
      setFormData(prev => ({
        ...prev,
        country: selectedCountryName,
        countryId: '',
        dialCode: '',
        financialYear: ''
      }))
    }
    setError('')
  }

  // ── helpers ──────────────────────────────────────────────
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleNext = () => setCurrentStep(s => Math.min(s + 1, 4))
  const handleBack = () => setCurrentStep(s => Math.max(s - 1, 1))

  // Generate username from organization name
  const generateUsername = (orgName) => {
    if (!orgName) return ''
    return orgName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .split(/\s+/)
      .join('')
      .slice(0, 20)
  }

  // Generate a strong readable password
  const generatePassword = () => {
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
    const lower = 'abcdefghjkmnpqrstuvwxyz'
    const digits = '23456789'
    const special = '@#$!'
    const rand = (s) => s[Math.floor(Math.random() * s.length)]
    const base = [
      rand(upper), rand(upper),
      rand(lower), rand(lower), rand(lower),
      rand(digits), rand(digits),
      rand(special),
    ]
    // shuffle
    for (let i = base.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [base[i], base[j]] = [base[j], base[i]]
    }
    return base.join('')
  }

  const handleRegenerateUsername = () => {
    setFormData(prev => ({
      ...prev,
      username: generateUsername(prev.organizationName)
    }))
  }

  const handleRegeneratePassword = () => {
    setFormData(prev => ({ ...prev, password: generatePassword() }))
  }

  const toggleUsernameMode = () => {
    setIsAutoUsername(!isAutoUsername)
    if (!isAutoUsername) {
      // Switching to auto - generate username
      setFormData(prev => ({
        ...prev,
        username: generateUsername(prev.organizationName)
      }))
    }
  }

  const togglePasswordMode = () => {
    setIsAutoPassword(!isAutoPassword)
    if (!isAutoPassword) {
      // Switching to auto - generate password
      setFormData(prev => ({ ...prev, password: generatePassword() }))
    }
  }

  // When org name changes, auto-fill username if it's still auto-generated
  const handleOrgNameChange = (value) => {
    setFormData(prev => ({
      ...prev,
      organizationName: value,
      // Only auto-update username if in auto mode
      username: isAutoUsername ? generateUsername(value) : prev.username
    }))
    setError('')
  }

  // ── Google OAuth2 token flow (popup) ─────────────────────
  const initTokenClient = () => {
    tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'email profile',
      callback: async (tokenResponse) => {
        if (tokenResponse.error) {
          setError('Google sign-in failed. Please try again.')
          setGoogleBusy(false)
          return
        }
        try {
          const res = await fetch(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
          )
          const user = await res.json()
          const email = user.email || ''
          setFormData(prev => ({
            ...prev,
            email,
            username: prev.username || email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, ''),
            password: prev.password || generatePassword()
          }))
          setError('')
          handleNext()
        } catch {
          setError('Could not fetch your Google account details. Please try again.')
        } finally {
          setGoogleBusy(false)
        }
      },
    })
  }

  const loadGoogleAndSignIn = () => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Google Client ID is not configured. See GOOGLE_OAUTH_QUICK_START.md.')
      return
    }
    setGoogleBusy(true)
    setError('')
    const doSignIn = () => {
      if (!tokenClientRef.current) initTokenClient()
      tokenClientRef.current.requestAccessToken({ prompt: 'select_account' })
    }
    if (scriptLoadedRef.current) { doSignIn(); return }
    const existing = document.getElementById('google-gsi-script')
    if (existing) { existing.addEventListener('load', doSignIn, { once: true }); return }
    const script = document.createElement('script')
    script.id    = 'google-gsi-script'
    script.src   = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = () => { scriptLoadedRef.current = true; doSignIn() }
    script.onerror = () => {
      setError('Failed to load Google Sign-In. Check your internet connection.')
      setGoogleBusy(false)
    }
    document.body.appendChild(script)
  }

  // ── Final submit ─────────────────────────────────────────
  const handleFinalSubmit = async () => {
    setLoading(true)
    setError('')
    if (!formData.email || !formData.organizationName || !formData.username || !formData.password) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }
    try {
      const response = await fetch('/api/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Signup failed')
      if (data.success) {
        handleNext()
      } else {
        throw new Error(data.error || 'Signup failed')
      }
    } catch (err) {
      const errorMsg = err.message || 'An error occurred. Please try again.'
      setError(errorMsg)
      console.error('Signup error:', err)
      setLoading(false)
    }
  }

  // Copy to clipboard
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      // brief visual feedback handled inline
    }).catch(() => {})
  }

  const stepMeta = [
    { number: 1, label: 'Sign in',          sub: 'Use your Google account' },
    { number: 2, label: 'Company details',  sub: 'Tell us about your business' },
    { number: 3, label: 'Choose plan',      sub: 'Pick what fits, change anytime' },
    { number: 4, label: 'Done',             sub: 'Start using Melone Stay' },
  ]

  return (
    <>
      <style>{signupStyles}</style>
      <div className="signup-shell">

        {/* ── LEFT: dark green panel ── */}
        <aside className="signup-left">
          <div className="signup-logo">
            <img src={meloneLogo} alt="Melone Stay" />
            <span>Melone Stay</span>
          </div>

          <div className="trial-badge">30-day free trial</div>

          <h2 className="signup-headline">Get set up in four<br />simple steps.</h2>

          <ul className="signup-steps-list">
            {stepMeta.map(s => (
              <li
                key={s.number}
                className={`signup-step-item ${currentStep === s.number ? 's-active' : ''} ${currentStep > s.number ? 's-completed' : ''}`}
              >
                <div className="signup-step-num">
                  {currentStep > s.number ? '✓' : s.number}
                </div>
                <div className="signup-step-text">
                  <strong>{s.label}</strong>
                  <small>{s.sub}</small>
                </div>
              </li>
            ))}
          </ul>

          <div className="signup-left-footer">© 2025 Melone Stay</div>
        </aside>

        {/* ── RIGHT: content panel ── */}
        <main className="signup-right">
          {/* top nav */}
          <nav className="signup-nav">
            {currentStep > 1
              ? <button className="signup-nav-back" onClick={handleBack}>‹ Back</button>
              : <span />
            }
            <span className="signup-nav-signin">
              Already have an account? <button type="button" onClick={onSignin}>Sign in</button>
            </span>
          </nav>

          <div className="signup-content">
            {currentStep === 1 && (
            <>
              <div className="step-content">
                <h1 className="step-title">Start your free trial</h1>
                <p className="step-subtitle">30 days free. No credit card required.</p>
              </div>

              <div className="signup-form">
                {error && <div style={{ padding: '12px', background: '#fee', border: '1px solid #fcc', borderRadius: '8px', color: '#c33', fontSize: '12px', marginBottom: '12px' }}>{error}</div>}

                <button
                  className="google-signin"
                  onClick={loadGoogleAndSignIn}
                  type="button"
                  disabled={googleBusy}
                  style={googleBusy ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
                >
                  {googleBusy
                    ? <span style={{ fontSize: 13 }}>Connecting to Google…</span>
                    : <>
                        <svg className="google-icon" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                      </>
                  }
                </button>

                <p className="terms-text">
                  By registering you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
                </p>

                <p className="signin-link">
                  Already have an account? <button type="button" onClick={onSignin}>Sign in</button>
                </p>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="step-content">
                <h1 className="step-title">Company details</h1>
                <p className="step-subtitle">Hi {formData.username || 'there'}  </p>
              </div>

              <div className="signup-form">
                {error && <div style={{ padding: '12px', background: '#fee', border: '1px solid #fcc', borderRadius: '8px', color: '#c33', fontSize: '12px', marginBottom: '12px' }}>{error}</div>}

                {/* Google account pill */}
                {formData.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(46,125,79,.07)', border: '1px solid rgba(46,125,79,.18)', borderRadius: 10, marginBottom: 4 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span style={{ fontSize: 13, color: '#253244', fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formData.email}</span>
                    <span style={{ fontSize: 11, color: '#2e7d4f', fontWeight: 600, background: 'rgba(46,125,79,.1)', padding: '2px 8px', borderRadius: 999 }}>✓ Connected</span>
                  </div>
                )}

                {/* Organisation name */}
                <div className="form-group">
                  <label className="form-label">Hotel / Organisation Name <span className="required">*</span></label>
                  <div className={`form-input-wrap ${formData.organizationName ? 'filled' : ''}`}>
                    <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" strokeWidth={2} /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" /></svg>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Your hotel or property name"
                      value={formData.organizationName}
                      onChange={(e) => handleOrgNameChange(e.target.value)}
                    />
                  </div>
                </div>

                {/* City + Country */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City / Place</label>
                    <div className={`form-input-wrap ${formData.city ? 'filled' : ''}`}>
                      <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <input className="form-input" type="text" placeholder="City" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <div className={`form-input-wrap ${formData.country ? 'filled' : ''}`}>
                      <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <select 
                        className="form-input" 
                        value={formData.country} 
                        onChange={handleCountryChange}
                        style={{ cursor: 'pointer' }}
                        disabled={loadingCountries}
                      >
                        <option value="">
                          {loadingCountries ? 'Loading countries...' : 'Select country'}
                        </option>
                        {countries.map((country) => (
                          <option key={country.id} value={country.country_name}>
                            {country.country_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {formData.financialYear && (
                      <div style={{ marginTop: 6, fontSize: 11, color: '#6b8f79', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        Financial Year: {formData.financialYear.replace('-', ' to ')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <div className={`form-input-wrap ${formData.phoneNumber ? 'filled' : ''}`} style={{ padding: 0, overflow: 'hidden' }}>
                    {/* dial code prefix */}
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '0 10px 0 12px',
                      height: '100%',
                      borderRight: '1px solid #e1e5e9',
                      background: '#f8f9f7',
                      color: '#394454',
                      fontSize: 13,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      minWidth: 52,
                    }}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: '#b8c1cc', flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      {formData.dialCode || '—'}
                    </span>
                    <input
                      className="form-input"
                      type="tel"
                      placeholder={formData.dialCode ? 'Phone number' : 'Select a country first'}
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      style={{ paddingLeft: 10 }}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <div className={`form-input-wrap ${formData.address ? 'filled' : ''}`}>
                    <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    <input className="form-input" type="text" placeholder="Full address" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} />
                  </div>
                </div>

                {/* ── Login credentials section ── */}
                <div style={{ borderTop: '1px solid #e9edf1', paddingTop: 18, marginTop: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#929ba8', textTransform: 'uppercase', letterSpacing: '1.35px' }}>
                      Login Credentials
                    </span>
                    <span style={{ fontSize: 11, color: '#6b8f79', background: 'rgba(46,125,79,.08)', padding: '3px 9px', borderRadius: 999, fontWeight: 600 }}>
                      {isAutoUsername && isAutoPassword ? 'Auto-generated' : isAutoUsername || isAutoPassword ? 'Mixed' : 'Manual'}
                    </span>
                  </div>

                  {/* Username */}
                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <label className="form-label" style={{ margin: 0 }}>Username</label>
                      <button
                        type="button"
                        onClick={toggleUsernameMode}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 6, 
                          padding: '4px 8px', 
                          background: isAutoUsername ? 'rgba(46,125,79,.09)' : 'rgba(142,152,166,.08)', 
                          border: `1px solid ${isAutoUsername ? 'rgba(46,125,79,.2)' : 'rgba(142,152,166,.2)'}`, 
                          borderRadius: 6, 
                          color: isAutoUsername ? '#2e7d4f' : '#5b6b85', 
                          fontSize: 10, 
                          fontWeight: 600, 
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {isAutoUsername ? (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>
                            Auto
                          </>
                        ) : (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            Manual
                          </>
                        )}
                      </button>
                    </div>
                    <div className={`form-input-wrap ${formData.username ? 'filled' : ''}`} style={{ paddingRight: 6 }}>
                      <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      <input
                        className="form-input"
                        type="text"
                        placeholder={isAutoUsername ? "Auto-generated from org name" : "Enter username"}
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        readOnly={isAutoUsername}
                        style={isAutoUsername ? { background: 'rgba(46,125,79,.04)' } : {}}
                      />
                      {isAutoUsername && (
                        <button
                          type="button"
                          onClick={handleRegenerateUsername}
                          title="Re-generate username"
                          style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: 'rgba(46,125,79,.09)', border: '1px solid rgba(46,125,79,.2)', borderRadius: 8, color: '#2e7d4f', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0115-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 01-15 6.7L3 16"/></svg>
                          New
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Password */}
                  <div className="form-group">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <label className="form-label" style={{ margin: 0 }}>Password</label>
                      <button
                        type="button"
                        onClick={togglePasswordMode}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 6, 
                          padding: '4px 8px', 
                          background: isAutoPassword ? 'rgba(46,125,79,.09)' : 'rgba(142,152,166,.08)', 
                          border: `1px solid ${isAutoPassword ? 'rgba(46,125,79,.2)' : 'rgba(142,152,166,.2)'}`, 
                          borderRadius: 6, 
                          color: isAutoPassword ? '#2e7d4f' : '#5b6b85', 
                          fontSize: 10, 
                          fontWeight: 600, 
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {isAutoPassword ? (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>
                            Auto
                          </>
                        ) : (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            Manual
                          </>
                        )}
                      </button>
                    </div>
                    <div className={`form-input-wrap ${formData.password ? 'filled' : ''}`} style={{ paddingRight: 6 }}>
                      <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                      <input
                        className="form-input"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={isAutoPassword ? "Auto-generated secure password" : "Enter password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        readOnly={isAutoPassword}
                        style={isAutoPassword ? { background: 'rgba(46,125,79,.04)', letterSpacing: showPassword ? 'normal' : '2px' } : { letterSpacing: showPassword ? 'normal' : '2px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? 'Hide password' : 'Show password'}
                        style={{ flexShrink: 0, display: 'grid', placeItems: 'center', width: 32, height: 32, background: 'transparent', border: 0, color: '#b8c1cc', cursor: 'pointer' }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          {showPassword ? (
                            <>
                              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                              <line x1="1" y1="1" x2="23" y2="23"/>
                            </>
                          ) : (
                            <>
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </>
                          )}
                        </svg>
                      </button>
                      {isAutoPassword && (
                        <button
                          type="button"
                          onClick={handleRegeneratePassword}
                          title="Generate new password"
                          style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: 'rgba(46,125,79,.09)', border: '1px solid rgba(46,125,79,.2)', borderRadius: 8, color: '#2e7d4f', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0115-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 01-15 6.7L3 16"/></svg>
                          New
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button className="btn btn-back" onClick={handleBack}><span>←</span> Back</button>
                  <button className="btn btn-primary" onClick={handleNext} disabled={!formData.organizationName || !formData.username || !formData.password}>
                    Continue <span>→</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className="step-content">
                <h1 className="step-title">Choose your plan</h1>
                <p className="step-subtitle">Your trial starts today. Cancel anytime during 30 days.</p>
              </div>

              <div className="signup-form">
                {error && <div style={{ padding: '12px', background: '#fee', border: '1px solid #fcc', borderRadius: '8px', color: '#c33', fontSize: '12px', marginBottom: '12px' }}>{error}</div>}
                
                <div className="plan-option selected">
                  <div className="plan-check">✓</div>
                  <h3 className="plan-name">Platinum</h3>
                  <p className="plan-details">365 days validity · Unlimited users</p>
                </div>

                <div className="form-actions">
                  <button className="btn btn-back" onClick={handleBack} disabled={loading}>
                    <span>←</span> Back
                  </button>
                  <button className="btn btn-primary" onClick={handleFinalSubmit} disabled={loading}>
                    {loading ? 'Creating account...' : 'Create free account'} <span>→</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {currentStep === 4 && (
            <>
              <div className="completion-content">
                <div className="success-icon">✓</div>
                <h1 className="completion-title">You're all set!</h1>
                <p className="completion-message">
                  Save these credentials — you'll need them to log in.
                </p>

                {/* ── Your login credentials ── */}
                <div className="credentials-box">
                  <h3 className="credentials-title">Your Login Credentials</h3>

                  {[
                    { label: 'Login URL',        value: 'melonestay.in/login',        copy: true },
                    { label: 'Email / Client ID', value: formData.email,               copy: true },
                    { label: 'Username',          value: formData.username,            copy: true },
                    { label: 'Password',          value: formData.password,            secret: true },
                  ].map(({ label, value, copy, secret }) => (
                    <CredentialRow
                      key={label}
                      label={label}
                      value={value}
                      secret={secret}
                      copy={copy || secret}
                    />
                  ))}
                </div>

                <div className="info-box">
                  <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="info-text">
                    Use your <strong>Google email</strong> as the Email ID on login. Store your password securely — it won't be shown again.
                  </p>
                </div>

                <button className="btn btn-primary" onClick={onSignin} style={{ width: '100%' }}>
                  Go to Login <span>→</span>
                </button>
              </div>
            </>
          )}
          </div>

          <div className="signup-right-footer">Free trial, cancel anytime.</div>
        </main>
      </div>
    </>
  )
}

export default SignupPage
