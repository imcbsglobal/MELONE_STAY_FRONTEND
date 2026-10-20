import { useState, useEffect, useCallback } from 'react'
import meloneLogo from '../../assets/melone logo.png'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

const styles = String.raw`
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap');
.dashboard-layout { display: grid; grid-template-columns: 276px 1fr; height: 100svh; overflow: hidden; background: #eef1f5; font-family: 'DM Sans', sans-serif; }

.sidebar { position: relative; display: flex; flex-direction: column; min-height: 0; padding: 24px 16px 16px; background: linear-gradient(180deg, #0d2b1a 0%, #14402b 48%, #0d2b1a 100%); color: #cfe5d6; overflow: hidden; box-shadow: 8px 0 40px rgba(9,44,28,.16); }
.sidebar::before { content: ''; position: absolute; inset: 0; pointer-events: none; background-image: radial-gradient(circle at 90% 6%, rgba(255,176,1,.2), transparent 36%), radial-gradient(circle at 4% 96%, rgba(76,163,106,.24), transparent 42%); }
.sidebar::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #ffb001, #7fc297 55%, transparent); }

.sidebar-header { position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; padding: 18px 8px 24px; border-bottom: 1px solid rgba(255,255,255,.09); }
.sidebar-header .logo-img { position: relative; z-index: 1; width: auto; height: 44px; max-width: 100%; padding: 10px 22px; object-fit: contain; border-radius: 15px; background: #fff; box-shadow: 0 12px 30px rgba(0,0,0,.35); flex-shrink: 0; }

.sidebar-nav { position: relative; z-index: 1; flex: 1; min-height: 0; padding: 20px 0 14px; overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.14) transparent; }
.sidebar-nav::-webkit-scrollbar { width: 5px; }
.sidebar-nav::-webkit-scrollbar-track { background: transparent; }
.sidebar-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.14); border-radius: 999px; }
.nav-section { margin-bottom: 24px; }
.nav-section-title { display: flex; align-items: center; gap: 8px; padding: 0 12px; margin-bottom: 9px; color: #5f8a70; font-size: 9.5px; font-weight: 800; letter-spacing: 1.8px; text-transform: uppercase; }
.nav-section-title::after { content: ''; height: 1px; flex: 1; background: rgba(255,255,255,.07); }
.nav-item { position: relative; display: flex; align-items: center; gap: 12px; width: 100%; margin-bottom: 4px; padding: 10px 12px; border: 1px solid transparent; border-radius: 12px; background: transparent; color: #a8c6b3; font-size: 12.5px; font-weight: 600; text-align: left; transition: all .2s; }
.nav-item:hover { background: rgba(255,255,255,.05); color: #dff4e5; }
.nav-item.active { background: linear-gradient(100deg, rgba(46,125,79,.28), rgba(46,125,79,.1)); border-color: rgba(138,208,168,.28); color: #f2fbf5; box-shadow: 0 8px 22px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.08); }
.nav-item .nav-icon { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 10px; background: rgba(255,255,255,.05); color: #8fba9d; flex-shrink: 0; transition: all .2s; }
.nav-item:hover .nav-icon { background: rgba(255,255,255,.09); color: #cde8d8; }
.nav-item.active .nav-icon { background: linear-gradient(135deg, #ffb001, #e09100); color: #3a2400; box-shadow: 0 5px 14px rgba(255,176,1,.4); }
.nav-item.active::before { content: ''; position: absolute; left: -16px; top: 50%; transform: translateY(-50%); width: 3px; height: 20px; border-radius: 3px; background: #ffb001; box-shadow: 0 0 10px rgba(255,176,1,.7); }
.nav-item.active::after { content: ''; position: absolute; right: 10px; width: 6px; height: 6px; border-radius: 50%; background: #ffb001; box-shadow: 0 0 8px rgba(255,176,1,.7); }
.nav-item svg { width: 16px; height: 16px; }
.nav-item .nav-count { margin-left: auto; padding: 3px 8px; border-radius: 999px; background: rgba(255,255,255,.08); color: #8ad0a8; font-size: 9.5px; font-weight: 800; }
.nav-item.active .nav-count { background: rgba(255,176,1,.2); color: #ffd46e; }

.sidebar-logout { position: relative; z-index: 1; display: flex; align-items: center; gap: 10px; width: 100%; padding: 11px 14px; border: 1px solid rgba(255,255,255,.1); border-radius: 12px; background: rgba(255,255,255,.04); color: #a8c6b3; font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 600; cursor: pointer; transition: background .2s, border-color .2s, color .2s; flex-shrink: 0; }
.sidebar-logout:hover { background: rgba(244,107,69,.16); border-color: rgba(244,107,69,.4); color: #ffb3a8; }
.sidebar-logout svg { width: 16px; height: 16px; }

.main { display: flex; flex-direction: column; min-width: 0; min-height: 0; }
.topbar { position: relative; z-index: 20; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 16px 32px; background: rgba(255,255,255,.9); backdrop-filter: blur(10px); border-bottom: 1px solid #e6eaef; }
.topbar-left { display: flex; flex-direction: column; gap: 2px; min-width: 0; padding-right: 12px; }
.topbar-head-row { display: flex; align-items: center; gap: 12px; min-width: 0; }
.topbar-left h1 { margin: 0; color: #172131; font-size: 18px; font-weight: 700; letter-spacing: -.3px; }
.topbar-left p { margin: 0; color: #8793a4; font-size: 11.5px; }
.topbar-right { display: flex; align-items: center; gap: 12px; }
.topbar-btn { display: grid; place-items: center; width: 38px; height: 38px; border: 1px solid #e4e9ef; border-radius: 11px; background: #fff; color: #8793a4; position: relative; transition: background .15s, border-color .15s, color .15s, box-shadow .15s; }
.topbar-btn:hover { background: #f5f7fa; border-color: #d0d7e0; color: #4b6182; box-shadow: 0 4px 12px rgba(39,54,74,.07); }
.topbar-btn svg { width: 17px; height: 17px; }
.topbar-btn .dot { position: absolute; top: 9px; right: 9px; width: 6px; height: 6px; border-radius: 50%; background: #f46b45; box-shadow: 0 0 0 2px #fff; }
.menu-toggle { display: none; place-items: center; width: 38px; height: 38px; border: 1px solid #e4e9ef; border-radius: 11px; background: #fff; color: #4b6182; }
.menu-toggle svg { width: 18px; height: 18px; }

.content { flex: 1; min-height: 0; overflow-y: auto; padding: 28px 32px; scrollbar-width: thin; scrollbar-color: #c9d3e0 transparent; }
.content::-webkit-scrollbar { width: 8px; }
.content::-webkit-scrollbar-track { background: transparent; }
.content::-webkit-scrollbar-thumb { background: #c9d3e0; border-radius: 999px; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
.stat-card { position: relative; padding: 20px; border: 1px solid #e8ecf1; border-radius: 14px; background: #fff; overflow: hidden; transition: box-shadow .2s, transform .2s; }
.stat-card:hover { box-shadow: 0 12px 28px rgba(39,54,74,.09); transform: translateY(-2px); }
.stat-card .stat-icon { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 11px; margin-bottom: 14px; }
.stat-card .stat-icon svg { width: 18px; height: 18px; }
.stat-card .stat-value { color: #172131; font-size: 26px; font-weight: 700; letter-spacing: -.8px; }
.stat-card .stat-label { color: #8793a4; font-size: 11px; font-weight: 500; margin-top: 3px; }
.stat-card .stat-change { display: inline-flex; align-items: center; gap: 3px; margin-top: 8px; padding: 2px 7px; border-radius: 999px; font-size: 10px; font-weight: 600; }
.stat-change.up { color: #1d8a6f; background: rgba(29,138,111,.08); }
.stat-change.down { color: #c0392b; background: rgba(192,57,43,.07); }

.section-row { display: grid; grid-template-columns: 1.6fr 1fr; gap: 16px; margin-bottom: 28px; }
.card { border: 1px solid #e8ecf1; border-radius: 14px; background: #fff; overflow: hidden; box-shadow: 0 1px 2px rgba(39,54,74,.03); }
.card-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; border-bottom: 1px solid #f0f2f5; }
.card-header h3 { margin: 0; color: #172131; font-size: 13px; font-weight: 700; }
.card-header .view-all { padding: 0; border: 0; color: #1d693f; background: transparent; font-size: 11px; font-weight: 600; }
.card-header .view-all:hover { text-decoration: underline; }
.card-body { padding: 18px 20px; }

.activity-list { display: grid; gap: 0; }
.activity-item { display: flex; align-items: flex-start; gap: 12px; padding: 14px 0; border-bottom: 1px solid #f4f5f7; }
.activity-item:last-child { border: 0; }
.activity-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
.activity-text { flex: 1; font-size: 12px; color: #3d4f63; line-height: 1.5; }
.activity-text strong { color: #172131; font-weight: 600; }
.activity-time { color: #a8b3c2; font-size: 10px; white-space: nowrap; margin-top: 2px; }

.admins-list { display: grid; gap: 0; }
.admin-row { display: flex; align-items: center; gap: 10px; padding: 12px 0; border-bottom: 1px solid #f4f5f7; }
.admin-row:last-child { border: 0; }
.admin-avatar { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 8px; color: #fff; font-size: 9.5px; font-weight: 700; flex-shrink: 0; }
.admin-info { flex: 1; min-width: 0; }
.admin-name { font-size: 12px; font-weight: 600; color: #172131; }
.admin-role { font-size: 10px; color: #8793a4; margin-top: 1px; }
.admin-status { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.admin-status.online { background: #36b37e; box-shadow: 0 0 0 3px rgba(54,179,126,.12); }
.admin-status.offline { background: #c4cdd8; }

.rooms-bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.room-item { padding: 16px; border: 1px solid #eef1f5; border-radius: 10px; background: #fafbfc; text-align: center; }
.room-item .room-count { font-size: 22px; font-weight: 700; color: #172131; }
.room-item .room-label { font-size: 10px; color: #8793a4; margin-top: 3px; }
.room-item .room-bar { height: 4px; border-radius: 4px; background: #eef1f5; margin-top: 10px; overflow: hidden; }
.room-item .room-bar-fill { height: 100%; border-radius: 4px; }

.sidebar-overlay { display: none; }
.sidebar-close { display: none; }

.admin-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.admin-topbar h2 { margin: 0; color: #172131; font-size: 16px; font-weight: 700; }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; border: none; border-radius: 10px; background: linear-gradient(135deg, #1d693f, #215432); color: #fff; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: all .2s; box-shadow: 0 4px 14px rgba(29,105,63,.25); }
.btn-primary:hover { box-shadow: 0 6px 20px rgba(29,105,63,.35); transform: translateY(-1px); }
.btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; }
.btn-primary svg { width: 14px; height: 14px; }
.btn-secondary { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; border: 1px solid #e4e9ef; border-radius: 10px; background: #fff; color: #4b6182; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: all .15s; }
.btn-secondary:hover { background: #f5f7fa; border-color: #d0d7e0; }
.btn-danger { display: inline-flex; align-items: center; gap: 4px; padding: 5px 10px; border: 1px solid rgba(244,107,69,.2); border-radius: 8px; background: rgba(244,107,69,.06); color: #c0392b; font-family: 'DM Sans', sans-serif; font-size: 10.5px; font-weight: 600; cursor: pointer; transition: all .15s; }
.btn-danger:hover { background: rgba(244,107,69,.14); border-color: rgba(244,107,69,.4); }
.btn-edit { display: inline-flex; align-items: center; gap: 4px; padding: 5px 10px; border: 1px solid rgba(29,105,63,.2); border-radius: 8px; background: rgba(29,105,63,.06); color: #1d693f; font-family: 'DM Sans', sans-serif; font-size: 10.5px; font-weight: 600; cursor: pointer; transition: all .15s; }
.btn-edit:hover { background: rgba(29,105,63,.14); border-color: rgba(29,105,63,.4); }

.cell-actions { display: inline-flex; align-items: center; gap: 4px; }
.cell-value { display: inline-block; min-width: 0; }
.icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; padding: 0; border: 1px solid transparent; border-radius: 6px; background: transparent; color: #8793a4; cursor: pointer; transition: background .15s, color .15s, border-color .15s; flex-shrink: 0; }
.icon-btn:hover { background: #f0f2f5; color: #1d693f; border-color: #e4e9ef; }
.icon-btn svg { width: 13px; height: 13px; }

.admin-table-wrap { border: 1px solid #e8ecf1; border-radius: 14px; background: #fff; overflow: hidden; box-shadow: 0 1px 2px rgba(39,54,74,.03); }
.admin-table { width: 100%; border-collapse: collapse; }
.admin-table th { padding: 14px 18px; text-align: left; color: #8793a4; font-size: 10px; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; background: #fafbfc; border-bottom: 1px solid #eef1f5; }
.admin-table td { padding: 13px 18px; color: #3d4f63; font-size: 12px; border-bottom: 1px solid #f4f5f7; vertical-align: middle; }
.admin-table tr:last-child td { border: 0; }
.admin-table tr:hover td { background: #fafbfc; }
.admin-badge { display: inline-block; padding: 3px 9px; border-radius: 999px; font-size: 10px; font-weight: 600; }
.admin-badge.active { color: #1d8a6f; background: rgba(29,138,111,.08); }
.admin-badge.expired { color: #c0392b; background: rgba(192,57,43,.07); }
.empty-state { padding: 48px 20px; text-align: center; color: #a8b3c2; }
.empty-state svg { width: 40px; height: 40px; margin-bottom: 12px; opacity: .4; }
.empty-state p { margin: 0; font-size: 12.5px; }

.modal-overlay { position: fixed; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center; background: rgba(8,15,32,.55); backdrop-filter: blur(3px); }
.modal-panel { width: 100%; max-width: 540px; max-height: 90vh; border-radius: 18px; background: #fff; box-shadow: 0 32px 80px rgba(0,0,0,.25); overflow: hidden; display: flex; flex-direction: column; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid #f0f2f5; }
.modal-header h3 { margin: 0; color: #172131; font-size: 15px; font-weight: 700; }
.modal-close { display: grid; place-items: center; width: 30px; height: 30px; border: none; border-radius: 8px; background: transparent; color: #8793a4; cursor: pointer; transition: background .15s; }
.modal-close:hover { background: #f0f2f5; }
.modal-close svg { width: 16px; height: 16px; }
.modal-body { padding: 24px; overflow-y: auto; flex: 1; }
.modal-footer { display: flex; align-items: center; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid #f0f2f5; }

.form-group { margin-bottom: 18px; }
.form-group label { display: block; margin-bottom: 6px; color: #3d4f63; font-size: 11.5px; font-weight: 600; }
.form-group input { width: 100%; padding: 10px 14px; border: 1px solid #e4e9ef; border-radius: 10px; background: #fafbfc; color: #172131; font-family: 'DM Sans', sans-serif; font-size: 12.5px; transition: border-color .15s, box-shadow .15s; box-sizing: border-box; }
.form-group input:focus { outline: none; border-color: #1d693f; box-shadow: 0 0 0 3px rgba(29,105,63,.1); background: #fff; }
.form-group input:disabled { opacity: .6; cursor: not-allowed; }
.form-group input::placeholder { color: #b8c4d2; }

.fetch-row { display: flex; gap: 8px; }
.fetch-row input { flex: 1; }
.btn-fetch { padding: 10px 18px; border: none; border-radius: 10px; background: linear-gradient(135deg, #e09100, #ffb001); color: #3a2400; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap; transition: all .2s; box-shadow: 0 4px 12px rgba(255,176,1,.25); flex-shrink: 0; }
.btn-fetch:hover { box-shadow: 0 6px 18px rgba(255,176,1,.35); transform: translateY(-1px); }
.btn-fetch:disabled { opacity: .5; cursor: not-allowed; transform: none; }

.client-details { padding: 16px; border: 1px solid #e8ecf1; border-radius: 12px; background: #f8faf9; margin-bottom: 18px; }
.client-details-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; }
.client-details-row + .client-details-row { border-top: 1px solid #eef1f5; }
.client-details-label { color: #8793a4; font-size: 10.5px; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; }
.client-details-value { color: #172131; font-size: 12px; font-weight: 600; }

.form-error { padding: 10px 14px; border-radius: 10px; background: rgba(244,107,69,.08); color: #c0392b; font-size: 11.5px; font-weight: 500; margin-bottom: 16px; }
.form-success { padding: 10px 14px; border-radius: 10px; background: rgba(29,138,111,.08); color: #1d8a6f; font-size: 11.5px; font-weight: 500; margin-bottom: 16px; }

.spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 1100px) { .stats-grid { grid-template-columns: repeat(2, 1fr); }.section-row { grid-template-columns: 1fr; } }
@media (max-width: 768px) {
  .dashboard-layout { grid-template-columns: 1fr; }
  .sidebar { position: fixed; top: 0; left: 0; bottom: 0; z-index: 50; width: 280px; transform: translateX(-105%); transition: transform .28s cubic-bezier(.4,0,.2,1); box-shadow: 24px 0 60px rgba(36,48,78,.25); }
  .sidebar.open { transform: translateX(0); }
  .sidebar-overlay { display: block; position: fixed; inset: 0; z-index: 40; background: rgba(8,15,32,.55); backdrop-filter: blur(2px); opacity: 0; pointer-events: none; transition: opacity .28s; }
  .sidebar-overlay.show { opacity: 1; pointer-events: auto; }
  .menu-toggle { display: grid; flex-shrink: 0; }
  .topbar { padding: 14px 18px; }
  .topbar-left p { display: none; }
  .content { padding: 20px 18px; }
}
@media (max-width: 520px) {
  .stats-grid { grid-template-columns: 1fr; gap: 12px; }
  .rooms-bar { grid-template-columns: repeat(2, 1fr); }
  .topbar-left h1 { font-size: 16px; }
  .topbar-btn.bell { display: none; }
}
@media (max-width: 640px) {
  .admin-topbar { flex-direction: column; align-items: stretch; gap: 12px; }
  .btn-primary { justify-content: center; }
  .modal-panel { max-width: 94vw; border-radius: 14px; }
  .modal-body { padding: 18px; }
  .modal-footer { padding: 14px 18px; }
  .admin-table-wrap { overflow-x: auto; }
}
`

const icon = {
  dashboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>,
  admins: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
}

const navGroups = [
  {
    title: 'Menu',
    items: [
      { id: 'dashboard', label: 'Dashboard', count: null, icon: icon.dashboard },
      { id: 'admins', label: 'Admins', count: 24, icon: icon.admins },
    ],
  },
]

const stats = [
  { label: 'Total Rooms', value: '2,847', change: '+12.4%', up: true, color: '#215432', bg: 'rgba(33,84,50,.08)' },
  { label: 'Active Users', value: '14,592', change: '+8.1%', up: true, color: '#36b37e', bg: 'rgba(54,179,126,.08)' },
  { label: 'Online Now', value: '1,023', change: '-2.3%', up: false, color: '#ff6b6b', bg: 'rgba(255,107,107,.08)' },
  { label: 'Admins', value: '24', change: '+2', up: true, color: '#e09100', bg: 'rgba(255,176,1,.14)' },
]

const activities = [
  { text: <><strong>Maya Patel</strong> created a new room called <strong>"Studio West"</strong></>, time: '2 min ago', color: '#215432' },
  { text: <><strong>Niko James</strong> updated permissions for <strong>3 admins</strong></>, time: '8 min ago', color: '#e09100' },
  { text: <><strong>Avery Chen</strong> archived room <strong>"Project Alpha"</strong></>, time: '23 min ago', color: '#ff6b6b' },
  { text: <><strong>System</strong> completed backup for <strong>1,204 rooms</strong></>, time: '1 hr ago', color: '#36b37e' },
  { text: <><strong>Admin invite</strong> sent to <strong>dev@melone-stay.com</strong></>, time: '2 hr ago', color: '#ffb001' },
]

const admins = [
  { name: 'Avery Chen', role: 'Product Designer', initials: 'AC', color: '#e7a878', online: true },
  { name: 'Niko James', role: 'Creative Director', initials: 'NJ', color: '#8eb4a3', online: true },
  { name: 'Maya Patel', role: 'Studio Founder', initials: 'MP', color: '#aa9ac7', online: false },
  { name: 'Jordan Lee', role: 'Lead Engineer', initials: 'JL', color: '#215432', online: true },
]

const rooms = [
  { label: 'Active', count: 1842, pct: 72, color: '#36b37e' },
  { label: 'Draft', count: 412, pct: 28, color: '#ffb001' },
  { label: 'Archived', count: 543, pct: 38, color: '#a3b1c4' },
  { label: 'Private', count: 890, pct: 55, color: '#215432' },
]

const pageMeta = {
  dashboard: { title: 'Dashboard' },
  admins: { title: 'Admins' },
}

function SuperuserDashboard({ onLogout }) {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const [showAddModal, setShowAddModal] = useState(false)
  const [adminsList, setAdminsList] = useState([])
  const [fetchingClient, setFetchingClient] = useState(false)
  const [creatingAdmin, setCreatingAdmin] = useState(false)
  const [clientIdInput, setClientIdInput] = useState('')
  const [fetchedClient, setFetchedClient] = useState(null)
  const [fetchError, setFetchError] = useState('')
  const [formUsername, setFormUsername] = useState('')
  const [formPassword, setFormPassword] = useState('')
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [visiblePasswords, setVisiblePasswords] = useState({})
  const [copiedKey, setCopiedKey] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteError, setDeleteError] = useState('')
  const [editTarget, setEditTarget] = useState(null)
  const [editUsername, setEditUsername] = useState('')
  const [editPassword, setEditPassword] = useState('')
  const [editSuperPass, setEditSuperPass] = useState('')
  const [editError, setEditError] = useState('')
  const [editSuccess, setEditSuccess] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)

  const loadAdmins = useCallback(async () => {
    try {
      const res = await fetch('/api/list-admins/')
      const data = await res.json()
      if (data.success) setAdminsList(data.admins)
    } catch {}
  }, [])

  useEffect(() => {
    if (activeNav === 'admins') loadAdmins()
  }, [activeNav, loadAdmins])

  const openAddModal = () => {
    setClientIdInput('')
    setFetchedClient(null)
    setFetchError('')
    setFormUsername('')
    setFormPassword('')
    setFormError('')
    setFormSuccess('')
    setShowAddModal(true)
  }

  const handleFetchClient = async () => {
    if (!clientIdInput.trim()) return
    setFetchingClient(true)
    setFetchError('')
    setFetchedClient(null)
    try {
      const res = await fetch('/api/fetch-client/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: clientIdInput.trim() }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setFetchedClient(data.customer)
      } else {
        setFetchError(data.error || 'Client not found')
      }
    } catch {
      setFetchError('Failed to connect to server')
    } finally {
      setFetchingClient(false)
    }
  }

  const handleCreateAdmin = async () => {
    if (!formUsername.trim() || !formPassword) {
      setFormError('Username and password are required')
      return
    }
    setFormError('')
    setFormSuccess('')
    setCreatingAdmin(true)
    try {
      const res = await fetch('/api/create-admin/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: fetchedClient.client_id,
          customer_name: fetchedClient.customer_name,
          license_key: fetchedClient.license_key,
          package: fetchedClient.package,
          module_name: fetchedClient.module_name,
          expiry_date: fetchedClient.expiry_date,
          status: fetchedClient.status,
          username: formUsername.trim(),
          password: formPassword,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setFormSuccess('Admin created successfully!')
        setFetchedClient(null)
        setClientIdInput('')
        setFormUsername('')
        setFormPassword('')
        loadAdmins()
      } else {
        setFormError(data.error || 'Failed to create admin')
      }
    } catch {
      setFormError('Failed to connect to server')
    } finally {
      setCreatingAdmin(false)
    }
  }

  const handleDeleteAdmin = async (password) => {
    if (!deleteTarget) return
    setDeleteError('')
    try {
      const res = await fetch('/api/delete-admin/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget.id, password }),
      })
      const data = await res.json()
      if (data.success) {
        setDeleteTarget(null)
        loadAdmins()
      } else {
        setDeleteError(data.error || 'Failed to delete admin')
      }
    } catch {
      setDeleteError('Failed to connect to server')
    }
  }

  const requestDelete = (admin) => {
    setDeleteError('')
    setDeleteTarget(admin)
  }

  const requestEdit = (admin) => {
    setEditTarget(admin)
    setEditUsername(admin.username)
    setEditPassword(admin.password)
    setEditSuperPass('')
    setEditError('')
    setEditSuccess('')
  }

  const handleEditAdmin = async () => {
    if (!editTarget) return
    if (!editUsername.trim()) { setEditError('Username is required'); return }
    if (!editPassword) { setEditError('Password is required'); return }
    if (!editSuperPass) { setEditError('Superuser password is required'); return }
    setEditError('')
    setEditSuccess('')
    setSavingEdit(true)
    try {
      const res = await fetch('/api/edit-admin/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editTarget.id,
          username: editUsername.trim(),
          password: editPassword,
          superuser_password: editSuperPass,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setEditSuccess('Admin updated successfully!')
        loadAdmins()
        setTimeout(() => setEditTarget(null), 900)
      } else {
        setEditError(data.error || 'Failed to update admin')
      }
    } catch {
      setEditError('Failed to connect to server')
    } finally {
      setSavingEdit(false)
    }
  }

  const togglePassword = (id) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const copyText = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(''), 1500)
    } catch {}
  }

  const selectNav = (id) => {
    setActiveNav(id)
    setMenuOpen(false)
  }

  const meta = pageMeta[activeNav] || pageMeta.dashboard

  const brandLogo = <img src={meloneLogo} alt="Melone Stay" className="logo-img" />

  return <><style>{styles}</style><div className="dashboard-layout">
    <div className={`sidebar-overlay ${menuOpen ? 'show' : ''}`} onClick={() => setMenuOpen(false)} />
    <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        {brandLogo}
      </div>

      <nav className="sidebar-nav">
        {navGroups.map(group => (
          <div className="nav-section" key={group.title}>
            <div className="nav-section-title">{group.title}</div>
            {group.items.map(item => (
              <button key={item.id} className={`nav-item ${activeNav === item.id ? 'active' : ''}`} onClick={() => selectNav(item.id)}>
                <span className="nav-icon">{item.icon}</span>{item.label}
                {item.id === 'admins' && <span className="nav-count">{(adminsList.length || item.count)}</span>}
                {item.id !== 'admins' && item.count !== null && <span className="nav-count">{item.count.toLocaleString()}</span>}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <button className="sidebar-logout" onClick={() => setShowLogoutConfirm(true)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
        <span>Log out</span>
      </button>
    </aside>

    <div className="main">
      <header className="topbar">
        <div className="topbar-left">
          <div className="topbar-head-row">
            <button className="menu-toggle" aria-label="Open menu" onClick={() => setMenuOpen(true)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg></button>
            <h1>{meta.title}</h1>
          </div>
        </div>
        <div className="topbar-right">
          <button className="topbar-btn bell" aria-label="Notifications"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg><span className="dot" /></button>
        </div>
      </header>

      <div className="content">
        {activeNav === 'dashboard' && <>
          <div className="stats-grid">
            {stats.map(s => (
              <div className="stat-card" key={s.label}>
                <div className="stat-icon" style={{ background: s.bg, color: s.color }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg></div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <span className={`stat-change ${s.up ? 'up' : 'down'}`}>{s.change}</span>
              </div>
            ))}
          </div>

          <div className="section-row">
            <div className="card">
              <div className="card-header"><h3>Recent Activity</h3><button className="view-all">View all</button></div>
              <div className="card-body">
                <div className="activity-list">
                  {activities.map((a, i) => (
                    <div className="activity-item" key={i}>
                      <div className="activity-dot" style={{ background: a.color }} />
                      <div className="activity-text">{a.text}</div>
                      <div className="activity-time">{a.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header"><h3>Admin Team</h3><button className="view-all">Manage</button></div>
              <div className="card-body">
                <div className="admins-list">
                  {admins.map(a => (
                    <div className="admin-row" key={a.name}>
                      <div className="admin-avatar" style={{ background: a.color }}>{a.initials}</div>
                      <div className="admin-info"><div className="admin-name">{a.name}</div><div className="admin-role">{a.role}</div></div>
                      <div className={`admin-status ${a.online ? 'online' : 'offline'}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3>Room Overview</h3><button className="view-all">Details</button></div>
            <div className="card-body">
              <div className="rooms-bar">
                {rooms.map(r => (
                  <div className="room-item" key={r.label}>
                    <div className="room-count">{r.count.toLocaleString()}</div>
                    <div className="room-label">{r.label} Rooms</div>
                    <div className="room-bar"><div className="room-bar-fill" style={{ width: r.pct + '%', background: r.color }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      }
      {activeNav === 'admins' && <>
        <div className="admin-topbar">
          <h2>Manage Admins</h2>
          <button className="btn-primary" onClick={openAddModal}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add Admin
          </button>
        </div>
        <div className="admin-table-wrap">
          {adminsList.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              <p>No admins created yet. Click "Add Admin" to get started.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 50 }}>No</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Customer</th>
                  <th>Gmail</th>
                  <th>Package</th>
                  <th>Expiry</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {adminsList.map((a, i) => (
                  <tr key={a.id}>
                    <td style={{ color: '#8793a4', fontWeight: 600 }}>{i + 1}</td>
                    <td><b style={{ color: '#172131' }}>{a.username}</b></td>
                    <td>
                      <div className="cell-actions">
                        <span className="cell-value" style={{ fontFamily: 'monospace', color: '#3d4f63' }}>{visiblePasswords[a.id] ? a.password : '••••••••'}</span>
                        <button className="icon-btn" title={visiblePasswords[a.id] ? 'Hide password' : 'Show password'} onClick={() => togglePassword(a.id)}>
                          {visiblePasswords[a.id]
                            ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                            : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>}
                        </button>
                        {visiblePasswords[a.id] && (
                        <button className="icon-btn" title="Copy password" onClick={() => copyText(a.password, `pw-${a.id}`)}>
                          {copiedKey === `pw-${a.id}`
                            ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>}
                        </button>
                        )}
                      </div>
                    </td>
                    <td>{a.customer_name}</td>
                    <td>
                      <div className="cell-actions">
                        <span className="cell-value" style={{ color: '#8793a4', fontFamily: 'monospace', fontSize: 11 }}>{a.client_id}</span>
                        <button className="icon-btn" title="Copy Gmail" onClick={() => copyText(a.client_id, `cid-${a.id}`)}>
                          {copiedKey === `cid-${a.id}`
                            ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>}
                        </button>
                      </div>
                    </td>
                    <td>{a.package}</td>
                    <td>{a.expiry_date}</td>
                    <td><span className={`admin-badge ${a.status === 'Active' ? 'active' : 'expired'}`}>{a.status}</span></td>
                    <td><div className="cell-actions"><button className="btn-edit" onClick={() => requestEdit(a)}>Edit</button><button className="btn-danger" onClick={() => requestDelete(a)}>Delete</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </>
      }
      </div>
    </div>
  </div>
  {showAddModal && (
    <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Admin</h3>
          <button className="modal-close" onClick={() => setShowAddModal(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <div className="modal-body">
          {fetchError && <div className="form-error">{fetchError}</div>}
          {formSuccess && <div className="form-success">{formSuccess}</div>}
          {formError && <div className="form-error">{formError}</div>}

          <div className="form-group">
            <label>Gmail</label>
            <div className="fetch-row">
              <input
                type="text"
                value={clientIdInput}
                placeholder="Enter Gmail (e.g. OCUWOT7VR8YJU)"
                onChange={e => setClientIdInput(e.target.value)}
                disabled={!!fetchedClient || fetchingClient}
              />
              <button className="btn-fetch" onClick={handleFetchClient} disabled={fetchingClient || !clientIdInput.trim() || !!fetchedClient}>
                {fetchingClient ? <span className="spinner" /> : 'Fetch'}
              </button>
            </div>
          </div>

          {fetchedClient && (
            <div className="client-details">
              <div className="client-details-row"><span className="client-details-label">Customer</span><span className="client-details-value">{fetchedClient.customer_name}</span></div>
              <div className="client-details-row"><span className="client-details-label">Gmail</span><span className="client-details-value" style={{ fontFamily: 'monospace' }}>{fetchedClient.client_id}</span></div>
              <div className="client-details-row"><span className="client-details-label">License Key</span><span className="client-details-value" style={{ fontFamily: 'monospace' }}>{fetchedClient.license_key}</span></div>
              <div className="client-details-row"><span className="client-details-label">Package</span><span className="client-details-value">{fetchedClient.package}</span></div>
              {fetchedClient.module_name && <div className="client-details-row"><span className="client-details-label">Module</span><span className="client-details-value">{fetchedClient.module_name}</span></div>}
              <div className="client-details-row"><span className="client-details-label">Expiry Date</span><span className="client-details-value">{fetchedClient.expiry_date}</span></div>
              <div className="client-details-row"><span className="client-details-label">License Status</span><span className={`admin-badge ${fetchedClient.status === 'Active' ? 'active' : 'expired'}`}>{fetchedClient.status}</span></div>
            </div>
          )}

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={formUsername}
              placeholder="Enter admin username"
              onChange={e => setFormUsername(e.target.value)}
              disabled={!fetchedClient || creatingAdmin}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={formPassword}
              placeholder="Enter admin password"
              onChange={e => setFormPassword(e.target.value)}
              disabled={!fetchedClient || creatingAdmin}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
          <button className="btn-primary" onClick={handleCreateAdmin} disabled={!fetchedClient || !formUsername.trim() || !formPassword || creatingAdmin}>
            {creatingAdmin ? <span className="spinner" /> : 'Create Admin'}
          </button>
        </div>
      </div>
    </div>
  )}
  {editTarget && (
    <div className="modal-overlay" onClick={() => setEditTarget(null)}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Admin</h3>
          <button className="modal-close" onClick={() => setEditTarget(null)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <div className="modal-body">
          {editSuccess && <div className="form-success">{editSuccess}</div>}
          {editError && <div className="form-error">{editError}</div>}

          <div className="client-details">
            <div className="client-details-row"><span className="client-details-label">Customer</span><span className="client-details-value">{editTarget.customer_name}</span></div>
            <div className="client-details-row"><span className="client-details-label">Gmail</span><span className="client-details-value" style={{ fontFamily: 'monospace' }}>{editTarget.client_id}</span></div>
            <div className="client-details-row"><span className="client-details-label">Package</span><span className="client-details-value">{editTarget.package}</span></div>
            <div className="client-details-row"><span className="client-details-label">Expiry</span><span className="client-details-value">{editTarget.expiry_date}</span></div>
            <div className="client-details-row"><span className="client-details-label">Status</span><span className={`admin-badge ${editTarget.status === 'Active' ? 'active' : 'expired'}`}>{editTarget.status}</span></div>
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={editUsername}
              placeholder="Enter admin username"
              onChange={e => setEditUsername(e.target.value)}
              disabled={savingEdit}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={editPassword}
              placeholder="Enter admin password"
              onChange={e => setEditPassword(e.target.value)}
              disabled={savingEdit}
            />
          </div>
          <div className="form-group">
            <label>Superuser Password</label>
            <input
              type="password"
              value={editSuperPass}
              placeholder="Enter superuser password to confirm"
              onChange={e => setEditSuperPass(e.target.value)}
              disabled={savingEdit}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={() => setEditTarget(null)}>Cancel</button>
          <button className="btn-primary" onClick={handleEditAdmin} disabled={!editUsername.trim() || !editPassword || !editSuperPass || savingEdit}>
            {savingEdit ? <span className="spinner" /> : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )}
  <ConfirmDialog
    open={showLogoutConfirm}
    title="Log out of Melone Stay?"
    message="You will be signed out of the superuser console and returned to the login page."
    confirmText="Log out"
    cancelText="Cancel"
    danger
    onCancel={() => setShowLogoutConfirm(false)}
    onConfirm={onLogout}
  />
  <ConfirmDialog
    open={!!deleteTarget}
    title="Delete this admin?"
    message={deleteTarget ? `This will permanently delete "${deleteTarget.username}" and cannot be undone. Enter your superuser password to confirm.` : ''}
    confirmText="Delete"
    cancelText="Cancel"
    danger
    requirePassword
    passwordError={deleteError}
    onCancel={() => setDeleteTarget(null)}
    onConfirm={handleDeleteAdmin}
  />
  </>
}

export default SuperuserDashboard
