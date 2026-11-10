import { useEffect, useState } from 'react'
import meloneLogo from '../../assets/melone logo stay-only-01.png'

/* ---------- icons ---------- */
const svg = (children) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
)

const icons = {
  home: svg(<><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M10 21v-6h4v6" /></>),
  staffs: svg(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>),
  masters: svg(<><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" /><path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" /></>),
  rooms: svg(<><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M9 21v-4h6v4M8 7h2M14 7h2M8 11h2M14 11h2" /></>),
  activityLog: svg(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></>),
  logout: svg(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>),
  chevronRight: svg(<polyline points="9 18 15 12 9 6" />),
  chevronLeft: svg(<polyline points="15 18 9 12 15 6" />),
}

const pagePaths = {
  dashboard: '/member/dashboard',
  staffs: '/member/staffs',
  'room-category': '/member/room-category',
  'room-master': '/member/room-master',
  rooms: '/member/rooms',
  ota: '/member/ota',
  'tax-master': '/member/tax-master',
  'currency-master': '/member/currency-master',
  'activity-log': '/member/activity-log',
}

const masterItems = [
  { id: 'room-category', label: 'Room Category', icon: icons.masters },
  { id: 'room-master', label: 'Room Master', icon: icons.rooms },
  { id: 'ota', label: 'OTA Master', icon: icons.masters },
  { id: 'tax-master', label: 'Tax Master', icon: icons.masters },
  { id: 'currency-master', label: 'Currency Master', icon: icons.masters },
]

/* ---------- styles (self-contained, all classes prefixed ms-) ---------- */
const css = `
/* Layout: the sidebar sets its own width, the content takes the rest and never sits under it */
.member-layout{grid-template-columns:auto minmax(0,1fr) !important}

.ms-sidebar{--g:#235336;--g-soft:#e6f2ea;--g-tile:#dcebe1;--gold:#ffb000;--ink:#1c2b22;--muted:#7a8a80;--line:#e8ece9;--red:#e5383b;
  position:relative;z-index:30;box-sizing:border-box;display:flex;flex-direction:column;width:300px;height:100%;min-height:0;flex-shrink:0;
  background:#fff;border-right:1px solid var(--line);color:var(--ink);font-family:'DM Sans',system-ui,sans-serif;transition:width .22s ease}
.ms-sidebar *{box-sizing:border-box}
.ms-sidebar button{margin:0;font-family:inherit;cursor:pointer;-webkit-appearance:none;appearance:none}
.ms-sidebar button:focus-visible{outline:2px solid var(--g);outline-offset:2px}
.ms-sidebar svg{display:block;width:100%;height:100%}

.ms-toggle{position:absolute;top:26px;right:-14px;z-index:5;width:28px;height:28px;padding:6px;display:grid;place-items:center;border:0;border-radius:50%;
  background:var(--g);color:#fff;box-shadow:0 2px 6px rgba(35,83,54,.3)}

/* header + logo */
.ms-header{flex-shrink:0;padding:20px 22px 0;border-bottom:1px solid var(--line)}
.ms-brand{position:relative}
.ms-brand-button{display:flex;align-items:center;gap:12px;width:100%;min-height:54px;padding:6px 8px;border:0;border-radius:11px;background:transparent;color:var(--ink);text-align:left;transition:background .15s}
.ms-brand-button:hover,.ms-brand-button[aria-expanded="true"]{background:#f3f6f4}
.ms-brand-button:focus-visible{outline:2px solid var(--g);outline-offset:2px}
.ms-logo-wrap{display:grid;place-items:center;width:42px;height:42px;flex:0 0 42px;overflow:hidden}
.ms-logo{display:block;width:auto;height:auto;max-width:128px;max-height:42px;object-fit:contain}
.ms-brand-name{min-width:0;flex:1;overflow:hidden;color:var(--g);font-size:14px;font-weight:700;text-overflow:ellipsis;white-space:nowrap}
.ms-brand-chevron{width:16px;height:16px;flex:0 0 16px;color:var(--muted);transition:transform .18s}
.ms-brand-chevron.is-open{transform:rotate(90deg)}
.ms-brand-menu{position:absolute;top:calc(100% + 8px);left:0;right:0;z-index:40;padding:6px;border:1px solid var(--line);border-radius:12px;background:#fff;box-shadow:0 12px 30px rgba(23,67,43,.16)}
.ms-brand-menu button{display:flex;align-items:center;gap:10px;width:100%;min-height:40px;padding:0 11px;border:0;border-radius:8px;background:transparent;color:var(--ink);font-size:13px;font-weight:600;text-align:left}
.ms-brand-menu button:hover:not(:disabled){background:#f3f6f4}
.ms-brand-menu button:focus-visible{outline:2px solid var(--g);outline-offset:1px}
.ms-brand-menu button:disabled{color:var(--muted);cursor:default}
.ms-brand-menu .ms-brand-logout{color:var(--red)}
.ms-brand-menu .ms-brand-logout:hover{background:#fff5f5}
.ms-brand-menu svg{width:18px;height:18px;flex:0 0 18px}
.ms-rule{height:2px;margin:16px 0 16px;border-radius:2px;background:linear-gradient(90deg,var(--g) 0%,var(--g) 55%,var(--gold) 100%)}

/* nav */
.ms-nav{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;padding:14px 12px;scrollbar-width:thin}
.ms-item,.ms-group{position:relative;display:flex;align-items:center;width:100%;border:0;border-radius:10px;background:transparent;color:var(--ink);text-align:left;transition:background .15s,color .15s}
.ms-item{height:46px;margin-bottom:4px;padding:0 16px;gap:14px;font-size:15px;font-weight:500}
.ms-item:hover,.ms-group:hover{background:#f3f6f4}
.ms-item.is-active{background:var(--g-soft);color:var(--g);font-weight:600;box-shadow:inset -4px 0 0 var(--gold)}
.ms-icon{width:20px;height:20px;flex-shrink:0;color:var(--muted)}
.ms-item.is-active .ms-icon{color:var(--g)}
.ms-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ms-count{margin-left:auto;min-width:24px;padding:2px 8px;border-radius:999px;background:var(--g-tile);color:var(--g);font-size:11.5px;font-weight:700;text-align:center}
.ms-dot{width:7px;height:7px;margin-left:auto;margin-right:8px;border-radius:50%;background:var(--gold);flex-shrink:0}
.ms-count + .ms-dot{margin-left:8px}

.ms-sep{height:1px;margin:10px 6px 12px;background:var(--line)}

.ms-group{height:46px;margin-bottom:4px;padding:0 12px;gap:12px}
.ms-tile{display:grid;place-items:center;width:28px;height:28px;padding:6px;border-radius:8px;background:var(--g-tile);color:var(--g);flex-shrink:0}
.ms-group-label{font-size:13px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#3b4d42}
.ms-group.has-active .ms-group-label{color:var(--g)}
.ms-chevron{width:16px;height:16px;margin-left:auto;margin-right:4px;color:var(--muted);transition:transform .2s}
.ms-chevron.is-open{transform:rotate(90deg)}
.ms-sub{padding-left:12px}
.ms-sub .ms-item{height:44px;font-size:14.5px}

/* user + logout */

.ms-logout{flex-shrink:0;display:flex;align-items:center;gap:14px;width:100%;height:68px;padding:0 28px;border:0;border-top:1px solid var(--ink);
  background:transparent;color:var(--red);font-size:15px;font-weight:500;text-align:left;transition:background .15s}
.ms-logout:hover{background:#fff5f5}
.ms-logout .ms-icon{width:22px;height:22px;color:var(--red)}

/* collapsed rail */
.ms-sidebar.is-collapsed{width:76px}
.is-collapsed .ms-header{padding:22px 0 0}
.is-collapsed .ms-brand-button{justify-content:center;padding:6px}
.is-collapsed .ms-brand-name,.is-collapsed .ms-brand-chevron{display:none}
.is-collapsed .ms-brand-menu{left:calc(100% + 9px);right:auto;top:0;width:190px}
.is-collapsed .ms-logo{height:42px;max-height:none;max-width:none}
.is-collapsed .ms-rule{margin:18px 14px}
.is-collapsed .ms-nav{padding:14px 10px}
.is-collapsed .ms-label,.is-collapsed .ms-count,.is-collapsed .ms-dot,.is-collapsed .ms-chevron,.is-collapsed .ms-group-label{display:none}
.is-collapsed .ms-item,.is-collapsed .ms-group,.is-collapsed .ms-logout{justify-content:center;padding:0}
.is-collapsed .ms-sub{padding-left:0}
.ms-sidebar.is-auto .ms-toggle{display:none}

@media (max-height:640px){.ms-logout{height:56px}.ms-item,.ms-group{height:42px}}
@media (prefers-reduced-motion:reduce){.ms-sidebar,.ms-chevron{transition:none}}
`

/**
 * Props: activeNav, staffCount, onNavigate, onLogoutRequest
 * Responsive: full width on large screens, collapses to an icon rail on screens under 1100px.
 */
function MemberSidebar({ activeNav, staffCount, onNavigate, onLogoutRequest, user }) {
  const [userCollapsed, setUserCollapsed] = useState(false)
  const [brandMenuOpen, setBrandMenuOpen] = useState(false)
  const [narrow, setNarrow] = useState(
    typeof window !== 'undefined' && window.matchMedia('(max-width: 1100px)').matches
  )
  const [mastersOpen, setMastersOpen] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1100px)')
    const onChange = (e) => setNarrow(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const collapsed = narrow || userCollapsed
  const mastersActive = masterItems.some(m => m.id === activeNav)
  const companyName = user?.name || 'Melone Stay'

  useEffect(() => {
    if (!brandMenuOpen) return undefined
    const closeOnEscape = event => {
      if (event.key === 'Escape') setBrandMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [brandMenuOpen])

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', count: null, icon: icons.home },
    { id: 'staffs', label: 'Staffs', count: staffCount, icon: icons.staffs },
    { id: 'rooms', label: 'Room List', count: null, icon: icons.rooms },
    { id: 'activity-log', label: 'Activity Log', count: null, icon: icons.activityLog },
  ]

  const renderItem = (item) => {
    const active = activeNav === item.id
    const hasCount = item.count !== null && item.count !== undefined
    return (
      <button
        key={item.id}
        className={`ms-item ${active ? 'is-active' : ''}`}
        aria-current={active ? 'page' : undefined}
        onClick={() => onNavigate(pagePaths[item.id])}
        title={collapsed ? item.label : undefined}
      >
        <span className="ms-icon">{item.icon}</span>
        <span className="ms-label">{item.label}</span>
        {hasCount && <span className="ms-count">{item.count}</span>}
        {active && <span className="ms-dot" />}
      </button>
    )
  }

  return (
    <aside className={`ms-sidebar ${collapsed ? 'is-collapsed' : ''} ${narrow ? 'is-auto' : ''}`}>
      <style>{css}</style>

      <button
        className="ms-toggle"
        onClick={() => setUserCollapsed(c => !c)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-expanded={!collapsed}
      >
        {collapsed ? icons.chevronRight : icons.chevronLeft}
      </button>

      <div className="ms-header">
        <div className="ms-brand">
          <button
            type="button"
            className="ms-brand-button"
            aria-label={`${companyName} menu`}
            aria-haspopup="menu"
            aria-expanded={brandMenuOpen}
            onClick={() => setBrandMenuOpen(open => !open)}
          >
            <span className="ms-logo-wrap">
              <img src={meloneLogo} alt="" className="ms-logo" />
            </span>
            <span className="ms-brand-name" title={companyName}>{companyName}</span>
            <span className={`ms-brand-chevron ${brandMenuOpen ? 'is-open' : ''}`}>{icons.chevronRight}</span>
          </button>
          {brandMenuOpen && (
            <div className="ms-brand-menu" role="menu" aria-label={`${companyName} options`}>
              <button type="button" role="menuitem" disabled title="Settings page coming soon">
                <span>{icons.masters}</span>
                Settings
              </button>
              <button
                type="button"
                role="menuitem"
                className="ms-brand-logout"
                onClick={() => {
                  setBrandMenuOpen(false)
                  onLogoutRequest()
                }}
              >
                <span>{icons.logout}</span>
                Logout
              </button>
            </div>
          )}
        </div>
        <div className="ms-rule" />
      </div>

      <nav className="ms-nav">
        {navItems.map(renderItem)}

        <div className="ms-sep" />

        <button
          className={`ms-group ${mastersActive ? 'has-active' : ''}`}
          onClick={() => setMastersOpen(o => !o)}
          aria-expanded={mastersOpen}
          title={collapsed ? 'Masters' : undefined}
        >
          <span className="ms-tile">{icons.masters}</span>
          <span className="ms-group-label">Masters</span>
          <span className={`ms-chevron ${mastersOpen ? 'is-open' : ''}`}>{icons.chevronRight}</span>
        </button>

        {mastersOpen && <div className="ms-sub">{masterItems.map(renderItem)}</div>}
      </nav>
    </aside>
  )
}

export default MemberSidebar