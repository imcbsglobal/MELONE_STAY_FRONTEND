import meloneLogo from '../../assets/melone logo.png'

// ── Inline SVG illustration ── matches the image exactly ──────────────────
function ExpiredIllustration() {
  return (
    <svg width="220" height="170" viewBox="0 0 220 170" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* soft green blob background */}
      <ellipse cx="108" cy="108" rx="88" ry="58" fill="#e8f5ee" />

      {/* back card (shadow card) */}
      <rect x="38" y="42" width="118" height="82" rx="10" fill="#d4e8dc" />

      {/* front card */}
      <rect x="28" y="32" width="118" height="82" rx="10" fill="#ffffff" stroke="#dde8e2" strokeWidth="1.5" />

      {/* card header bar */}
      <rect x="28" y="32" width="118" height="26" rx="10" fill="#f0f6f2" />
      <rect x="28" y="48" width="118" height="10" fill="#f0f6f2" />

      {/* "License" label */}
      <text x="66" y="51" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="600" fill="#4a6b56">License</text>

      {/* text lines on card */}
      <rect x="40" y="76" width="88" height="7" rx="3.5" fill="#dde8e2" />
      <rect x="40" y="90" width="64" height="7" rx="3.5" fill="#dde8e2" />

      {/* EXPIRED red stamp */}
      <g transform="translate(44, 68) rotate(-10)">
        <rect x="0" y="0" width="76" height="28" rx="4" fill="none" stroke="#e63946" strokeWidth="2.5" />
        <text x="38" y="20" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="13" fontWeight="800" fill="#e63946" letterSpacing="2">EXPIRED</text>
      </g>

      {/* sparkle lines top-right of card */}
      <line x1="152" y1="26" x2="158" y2="20" stroke="#4a9c6e" strokeWidth="2" strokeLinecap="round" />
      <line x1="158" y1="30" x2="166" y2="28" stroke="#4a9c6e" strokeWidth="2" strokeLinecap="round" />
      <line x1="155" y1="36" x2="163" y2="38" stroke="#4a9c6e" strokeWidth="2" strokeLinecap="round" />

      {/* calendar */}
      <rect x="138" y="84" width="46" height="46" rx="8" fill="#ffffff" stroke="#dde8e2" strokeWidth="1.5" />
      {/* calendar top bar */}
      <rect x="138" y="84" width="46" height="14" rx="8" fill="#4a9c6e" />
      <rect x="138" y="91" width="46" height="7" fill="#4a9c6e" />
      {/* calendar rings */}
      <rect x="150" y="80" width="4" height="10" rx="2" fill="#2e7d4f" />
      <rect x="166" y="80" width="4" height="10" rx="2" fill="#2e7d4f" />
      {/* calendar grid dots */}
      <rect x="146" y="104" width="6" height="6" rx="1.5" fill="#dde8e2" />
      <rect x="158" y="104" width="6" height="6" rx="1.5" fill="#dde8e2" />
      <rect x="170" y="104" width="6" height="6" rx="1.5" fill="#dde8e2" />
      <rect x="146" y="116" width="6" height="6" rx="1.5" fill="#dde8e2" />
      <rect x="158" y="116" width="6" height="6" rx="1.5" fill="#dde8e2" />
      {/* calendar red alert circle */}
      <circle cx="174" cy="122" r="10" fill="#e63946" />
      <text x="174" y="127" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="12" fontWeight="800" fill="#ffffff">!</text>
    </svg>
  )
}

function LicenseExpiredPage({ expiryDate, customerName, isInactive, onBack }) {
  const formattedDate = expiryDate
    ? new Date(expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .le-shell {
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eef4f0;
          font-family: 'DM Sans', system-ui, sans-serif;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        /* soft green blobs in corners, matching the image */
        .le-shell::before,
        .le-shell::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          background: #c8e6d4;
          z-index: 0;
          pointer-events: none;
        }
        .le-shell::before {
          width: 380px; height: 380px;
          top: -140px; left: -140px;
          opacity: .55;
        }
        .le-shell::after {
          width: 300px; height: 300px;
          bottom: -110px; right: -80px;
          opacity: .45;
        }

        .le-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 520px;
          background: #ffffff;
          border-radius: 24px;
          padding: 40px 48px 44px;
          box-shadow: 0 8px 40px rgba(30, 60, 40, .10), 0 2px 8px rgba(30, 60, 40, .06);
          text-align: center;
        }

        .le-logo {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 32px;
        }
        .le-logo img { height: 24px; width: auto; }
        .le-logo span {
          font-size: 15px;
          font-weight: 700;
          color: #172131;
          letter-spacing: -.4px;
        }

        .le-illustration {
          display: flex;
          justify-content: center;
          margin-bottom: 28px;
        }

        .le-title {
          font-size: 30px;
          font-weight: 700;
          color: #172131;
          margin: 0 0 12px;
          letter-spacing: -.6px;
        }

        .le-message {
          font-size: 14px;
          color: #6b7f8e;
          line-height: 1.6;
          margin: 0 0 10px;
        }

        .le-meta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: #fef2f2;
          border: 1px solid #fcc;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          color: #c0392b;
          margin-bottom: 32px;
        }
        .le-meta-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #e63946;
          flex-shrink: 0;
        }

        .le-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .le-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 48px;
          padding: 0 28px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all .18s ease;
          text-decoration: none;
          border: none;
        }

        .le-btn-primary {
          background: #14402b;
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(20, 64, 43, .22);
          min-width: 160px;
        }
        .le-btn-primary:hover {
          background: #1d5238;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(20, 64, 43, .28);
        }

        .le-btn-secondary {
          background: #ffffff;
          color: #253244;
          border: 1.5px solid #dde3ea !important;
          min-width: 160px;
        }
        .le-btn-secondary:hover {
          background: #f6f7f9;
          border-color: #c4cdd6 !important;
        }

        .le-back {
          display: inline-block;
          margin-top: 24px;
          font-size: 12px;
          color: #8e98a6;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: color .15s;
        }
        .le-back:hover { color: #253244; text-decoration: underline; }

        @media (max-width: 480px) {
          .le-card { padding: 32px 24px 36px; }
          .le-title { font-size: 26px; }
          .le-actions { flex-direction: column; align-items: stretch; }
          .le-btn { width: 100%; }
        }
      `}</style>

      <div className="le-shell">
        <div className="le-card">
          {/* Logo */}
          <div className="le-logo">
            <img src={meloneLogo} alt="Melone Stay" />
            <span>Melone Stay</span>
          </div>

          {/* Illustration */}
          <div className="le-illustration">
            <ExpiredIllustration />
          </div>

          {/* Title */}
          <h1 className="le-title">License Expired</h1>

          {/* Message */}
          <p className="le-message">
            {customerName
              ? <>Your Melone Stay license for <strong>{customerName}</strong> has expired.</>
              : <>Your Melone Stay license has expired.</>
            }
            <br />
            Renew your license to continue using the application.
          </p>

          {/* Expiry date pill */}
          {formattedDate && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
              <span className="le-meta">
                <span className="le-meta-dot" />
                Expired on {formattedDate}
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div className="le-actions">
            <a
              href="mailto:support@melonestay.in?subject=License%20Renewal%20Request"
              className="le-btn le-btn-primary"
            >
              {/* Renew icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2v6h-6" />
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                <path d="M3 22v-6h6" />
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
              </svg>
              Renew License
            </a>

            <a
              href="mailto:support@melonestay.in?subject=License%20Support"
              className="le-btn le-btn-secondary"
            >
              {/* Support icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 1 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5z" />
                <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5z" />
              </svg>
              Contact Support
            </a>
          </div>

          {/* Back to login */}
          <button className="le-back" onClick={onBack} type="button">
            ← Back to login
          </button>
        </div>
      </div>
    </>
  )
}

export default LicenseExpiredPage
