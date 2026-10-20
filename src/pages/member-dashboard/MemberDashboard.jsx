import { useState, useEffect } from 'react'
import meloneLogo from '../../assets/melone logo.png'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

const styles = String.raw`
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap');
.member-layout { display: grid; grid-template-columns: 276px 1fr; height: 100svh; overflow: hidden; background: #eef1f5; font-family: 'DM Sans', sans-serif; }

.member-sidebar { position: relative; display: flex; flex-direction: column; min-height: 0; padding: 24px 16px 16px; background: linear-gradient(180deg, #0d2b1a 0%, #14402b 48%, #0d2b1a 100%); color: #cfe5d6; overflow: hidden; box-shadow: 8px 0 40px rgba(9,44,28,.16); }
.member-sidebar::before { content: ''; position: absolute; inset: 0; pointer-events: none; background-image: radial-gradient(circle at 90% 6%, rgba(255,176,1,.2), transparent 36%), radial-gradient(circle at 4% 96%, rgba(76,163,106,.24), transparent 42%); }
.member-sidebar::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #ffb001, #7fc297 55%, transparent); }
.member-sidebar-header { position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; padding: 18px 8px 24px; border-bottom: 1px solid rgba(255,255,255,.09); }
.member-sidebar-header .logo-img { position: relative; z-index: 1; width: auto; height: 44px; max-width: 100%; padding: 10px 22px; object-fit: contain; border-radius: 15px; background: #fff; box-shadow: 0 12px 30px rgba(0,0,0,.35); flex-shrink: 0; }

.member-nav { position: relative; z-index: 1; flex: 1; min-height: 0; padding: 20px 0 12px; overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.14) transparent; }
.member-nav::-webkit-scrollbar { width: 5px; }
.member-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.14); border-radius: 999px; }
.member-nav .nav-section { margin-bottom: 20px; }
.nav-section-title { display: flex; align-items: center; gap: 8px; padding: 0 12px; margin-bottom: 9px; color: #5f8a70; font-size: 9.5px; font-weight: 800; letter-spacing: 1.8px; text-transform: uppercase; }
.nav-section-title::after { content: ''; height: 1px; flex: 1; background: rgba(255,255,255,.07); }
.nav-item { position: relative; display: flex; align-items: center; gap: 12px; width: 100%; margin-bottom: 4px; padding: 10px 12px; border: 1px solid transparent; border-radius: 12px; background: transparent; color: #a8c6b3; font-size: 12.5px; font-weight: 600; font-family: 'DM Sans', sans-serif; text-align: left; cursor: pointer; transition: all .2s; }
.nav-item:hover { background: rgba(255,255,255,.05); color: #dff4e5; }
.nav-item.active { background: linear-gradient(100deg, rgba(46,125,79,.28), rgba(46,125,79,.1)); border-color: rgba(138,208,168,.28); color: #f2fbf5; box-shadow: 0 8px 22px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.08); }
.nav-item .nav-icon { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 10px; background: rgba(255,255,255,.05); color: #8fba9d; flex-shrink: 0; transition: all .2s; }
.nav-item:hover .nav-icon { background: rgba(255,255,255,.09); color: #cde8d8; }
.nav-item.active .nav-icon { background: linear-gradient(135deg, #ffb001, #e09100); color: #3a2400; box-shadow: 0 5px 14px rgba(255,176,1,.4); }
.nav-item.active::before { content: ''; position: absolute; left: -16px; top: 50%; transform: translateY(-50%); width: 3px; height: 20px; border-radius: 3px; background: #ffb001; box-shadow: 0 0 10px rgba(255,176,1,.7); }
.nav-item svg { width: 16px; height: 16px; }
.nav-item .nav-count { margin-left: auto; padding: 3px 8px; border-radius: 999px; background: rgba(255,255,255,.08); color: #8ad0a8; font-size: 9.5px; font-weight: 800; }

.member-user-card { position: relative; z-index: 1; margin-top: 4px; padding: 13px; border: 1px solid rgba(255,255,255,.09); border-radius: 14px; background: linear-gradient(135deg, rgba(255,255,255,.06), rgba(255,255,255,.02)); }
.member-user-row { display: flex; align-items: center; gap: 10px; }
.member-avatar { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 12px; background: linear-gradient(135deg, #ffb001, #e09100); color: #3a2400; font-size: 12.5px; font-weight: 800; box-shadow: 0 5px 14px rgba(255,176,1,.35); flex-shrink: 0; }
.member-user-name { color: #f2fbf5; font-size: 12.5px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.member-user-role { margin-top: 1px; color: #8ad0a8; font-size: 10px; font-weight: 600; }
.member-user-company { margin-top: 8px; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,.1); color: #7fa88b; font-size: 10px; line-height: 1.45; }
.member-license-pill { display: inline-flex; align-items: center; gap: 5px; margin-top: 8px; padding: 3px 9px; border-radius: 999px; background: rgba(54,179,126,.16); color: #7fdcb2; font-size: 9px; font-weight: 700; }
.member-license-pill::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: #36b37e; box-shadow: 0 0 8px rgba(54,179,126,.8); }

.member-logout { position: relative; z-index: 1; display: flex; align-items: center; gap: 10px; width: 100%; padding: 11px 14px; border: 1px solid rgba(255,255,255,.1); border-radius: 12px; background: rgba(255,255,255,.04); color: #a8c6b3; font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 600; cursor: pointer; transition: background .2s, border-color .2s, color .2s; flex-shrink: 0; }
.member-logout:hover { background: rgba(244,107,69,.16); border-color: rgba(244,107,69,.4); color: #ffb3a8; }
.member-logout svg { width: 16px; height: 16px; }

.member-main { display: flex; flex-direction: column; min-width: 0; min-height: 0; }
.member-topbar { position: relative; z-index: 20; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 15px 32px; background: rgba(255,255,255,.9); backdrop-filter: blur(10px); border-bottom: 1px solid #e6eaef; }
.member-topbar h1 { margin: 0; color: #172131; font-size: 18px; font-weight: 700; letter-spacing: -.3px; }
.member-topbar p { margin: 2px 0 0; color: #8793a4; font-size: 11.5px; }
.member-topbar-right { display: flex; align-items: center; gap: 12px; }
.member-topbar-btn { display: grid; place-items: center; width: 38px; height: 38px; border: 1px solid #e4e9ef; border-radius: 11px; background: #fff; color: #8793a4; position: relative; transition: background .15s, border-color .15s, color .15s, box-shadow .15s; }
.member-topbar-btn:hover { background: #f5f7fa; border-color: #d0d7e0; color: #4b6182; box-shadow: 0 4px 12px rgba(39,54,74,.07); }
.member-topbar-btn svg { width: 17px; height: 17px; }
.member-topbar-btn .dot { position: absolute; top: 9px; right: 9px; width: 6px; height: 6px; border-radius: 50%; background: #f46b45; box-shadow: 0 0 0 2px #fff; }

.member-content { flex: 1; min-height: 0; overflow-y: auto; padding: 28px 32px; scrollbar-width: thin; scrollbar-color: #c9d3e0 transparent; }
.member-content::-webkit-scrollbar { width: 8px; }
.member-content::-webkit-scrollbar-track { background: transparent; }
.member-content::-webkit-scrollbar-thumb { background: #c9d3e0; border-radius: 999px; }

.member-hero { position: relative; margin-bottom: 24px; padding: 28px 30px; border-radius: 18px; color: #fff; overflow: hidden; background: linear-gradient(115deg, #0f3a24 0%, #1d6a3f 52%, #2e8f5a 100%); box-shadow: 0 18px 40px rgba(20,64,43,.28); }
.member-hero::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(circle at 88% 20%, rgba(255,176,1,.25), transparent 38%), radial-gradient(circle at 12% 110%, rgba(127,220,178,.28), transparent 46%); }
.member-hero::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #ffb001, #7fc297, transparent); }
.member-hero .hero-eyebrow { position: relative; z-index: 1; display: inline-flex; align-items: center; gap: 7px; margin-bottom: 12px; padding: 5px 12px; border: 1px solid rgba(255,255,255,.18); border-radius: 999px; background: rgba(255,255,255,.08); color: #ffd88a; font-size: 9.5px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase; }
.member-hero .hero-eyebrow::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: #ffb001; box-shadow: 0 0 10px #ffb001; }
.member-hero h2 { position: relative; z-index: 1; margin: 0; font-family: 'Playfair Display', Georgia, serif; font-weight: 500; font-size: clamp(24px, 2.6vw, 32px); letter-spacing: -.5px; line-height: 1.15; }
.member-hero h2 span { color: #9fe0bd; }
.member-hero p { position: relative; z-index: 1; margin: 10px 0 0; color: #c6ead4; font-size: 12.5px; max-width: 520px; line-height: 1.6; }
.member-hero .hero-days { position: relative; z-index: 1; display: flex; align-items: center; gap: 14px; margin-top: 20px; }
.member-hero-identity { position: relative; z-index: 1; display: flex; align-items: center; gap: 12px; margin-top: 18px; padding: 12px 16px; border: 1px solid rgba(255,255,255,.14); border-radius: 14px; background: rgba(255,255,255,.1); max-width: 360px; }
.member-hero-identity .hero-avatar { width: 42px; height: 42px; font-size: 14px; }
.member-hero-username { color: #fff; font-size: 13px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.member-hero-meta { margin-top: 2px; color: #9fe0bd; font-size: 10.5px; font-weight: 500; }
.member-hero .hero-days .hero-badge { display: flex; align-items: baseline; gap: 4px; padding: 8px 16px; border-radius: 12px; background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.14); }
.member-hero .hero-days .hero-badge b { font-size: 20px; font-weight: 700; color: #ffd46e; }
.member-hero .hero-days .hero-badge span { font-size: 10px; color: #c6ead4; font-weight: 600; }

.member-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.member-stat { position: relative; padding: 18px; border: 1px solid #e8ecf1; border-radius: 16px; background: #fff; overflow: hidden; transition: box-shadow .2s, transform .2s; box-shadow: 0 1px 2px rgba(39,54,74,.03); }
.member-stat:hover { box-shadow: 0 14px 30px rgba(39,54,74,.1); transform: translateY(-3px); }
.member-stat-icon { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 11px; margin-bottom: 12px; }
.member-stat-icon svg { width: 18px; height: 18px; }
.member-stat-value { color: #172131; font-size: 19px; font-weight: 700; letter-spacing: -.5px; word-break: break-all; line-height: 1.3; }
.member-stat-label { color: #8793a4; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .7px; margin-top: 5px; }

.member-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 16px; margin-bottom: 24px; }
.member-card { border: 1px solid #e8ecf1; border-radius: 16px; background: #fff; overflow: hidden; box-shadow: 0 1px 2px rgba(39,54,74,.03); }
.member-card-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f0f2f5; }
.member-card-header h3 { margin: 0; color: #172131; font-size: 13px; font-weight: 700; }
.member-card-header .view-all { padding: 0; border: 0; color: #1d693f; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600; cursor: pointer; }
.member-card-header .view-all:hover { text-decoration: underline; }
.member-card-body { padding: 8px 20px; }

.company-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 13px 0; border-bottom: 1px solid #f4f5f7; }
.company-row:last-child { border: 0; }
.company-label { display: flex; align-items: center; gap: 8px; color: #8793a4; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; }
.company-label svg { width: 14px; height: 14px; color: #7fb597; }
.company-value { color: #172131; font-size: 12.5px; font-weight: 600; text-align: right; word-break: break-all; }
.company-value.mono { font-family: monospace; font-size: 11.5px; }

.member-badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 10px; font-weight: 700; color: #1d8a6f; background: rgba(29,138,111,.1); }

.license-card { padding: 20px; }
.license-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.license-header b { color: #172131; font-size: 13px; }
.license-header span { color: #8793a4; font-size: 11px; }
.license-bar { height: 8px; border-radius: 999px; background: #edf1f5; overflow: hidden; }
.license-bar-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #36b37e, #4fd1a5); box-shadow: 0 0 12px rgba(54,179,126,.5); }
.license-meta { display: flex; justify-content: space-between; margin-top: 10px; color: #a8b3c2; font-size: 10px; }
.license-meta b { color: #4b6182; font-weight: 600; }

.activity-list { display: grid; gap: 0; }
.activity-item { display: flex; align-items: flex-start; gap: 12px; padding: 13px 0; border-bottom: 1px solid #f4f5f7; }
.activity-item:last-child { border: 0; }
.activity-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
.activity-text { flex: 1; font-size: 11.5px; color: #3d4f63; line-height: 1.5; }
.activity-text strong { color: #172131; font-weight: 600; }
.activity-time { color: #a8b3c2; font-size: 10px; white-space: nowrap; margin-top: 2px; }

.rooms-bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.room-tile { padding: 16px 14px; border: 1px solid #eef1f5; border-radius: 12px; background: #fafbfc; text-align: center; transition: border-color .15s, background .15s, transform .15s; }
.room-tile:hover { border-color: #d6dfe9; background: #fff; transform: translateY(-2px); }
.room-tile .room-count { font-size: 20px; font-weight: 700; color: #172131; }
.room-tile .room-label { font-size: 9.5px; color: #8793a4; margin-top: 3px; }
.room-tile .room-bar { height: 4px; border-radius: 4px; background: #eef1f5; margin-top: 10px; overflow: hidden; }
.room-tile .room-bar-fill { height: 100%; border-radius: 4px; }

.member-empty { padding: 48px 20px; text-align: center; color: #a8b3c2; }
.member-empty svg { width: 40px; height: 40px; margin-bottom: 12px; opacity: .4; }
.member-empty p { margin: 0; font-size: 12.5px; }

.member-missing { display: grid; place-items: center; min-height: 100svh; background: #eef1f5; font-family: 'DM Sans', sans-serif; }
.member-missing-card { padding: 44px; border-radius: 20px; background: #fff; box-shadow: 0 20px 50px rgba(39,54,74,.12); text-align: center; }
.member-missing-card h2 { margin: 0 0 8px; color: #172131; font-size: 18px; }
.member-missing-card p { margin: 0; color: #8793a4; font-size: 13px; }

.staffs-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 24px; }
.staffs-header .hero-eyebrow { margin-bottom: 10px; color: #1d693f; }
.staffs-header h2 { margin: 0; color: #172131; font-family: 'Playfair Display', Georgia, serif; font-size: clamp(26px, 2.6vw, 32px); font-weight: 500; letter-spacing: -.7px; line-height: 1.1; }
.staffs-header p { margin: 8px 0 0; color: #8793a4; font-size: 12.5px; }
.add-staff-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 18px; border: 0; border-radius: 12px; color: #fff; background: linear-gradient(110deg, #14402b, #215432); font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 600; cursor: pointer; box-shadow: 0 10px 20px rgba(20,64,43,.2); transition: transform .2s, background .2s; flex-shrink: 0; }
.add-staff-btn:hover { background: linear-gradient(110deg, #1d4a2e, #2e7d4f); transform: translateY(-1px); }
.add-staff-btn svg { width: 15px; height: 15px; }
.staffs-stats { grid-template-columns: repeat(4, 1fr); }
.staff-banner { padding: 12px 16px; margin-bottom: 18px; border: 1px solid #f2d5d0; border-radius: 12px; background: #fff7f6; color: #c0564d; font-size: 12px; font-weight: 600; }
.staff-table-wrap { overflow-x: auto; }
.staff-table { width: 100%; border-collapse: collapse; }
.staff-table th { padding: 12px 20px; color: #8793a4; font-size: 9.5px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; text-align: left; border-bottom: 1px solid #eef1f5; background: #fafbfc; white-space: nowrap; }
.staff-table td { padding: 13px 20px; border-bottom: 1px solid #f4f5f7; font-size: 12px; color: #3d4f63; white-space: nowrap; }
.staff-table tr:last-child td { border-bottom: 0; }
.staff-cell-name { display: flex; align-items: center; gap: 11px; }
.staff-avatar { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 10px; background: linear-gradient(135deg, #2e7d4f, #4ca36a); color: #fff; font-size: 11px; font-weight: 700; box-shadow: 0 4px 10px rgba(46,125,79,.25); flex-shrink: 0; }
.staff-name { color: #172131; font-weight: 600; }
.staff-cell-pw { display: flex; align-items: center; gap: 7px; }
.staff-pw { font-family: monospace; font-size: 11.5px; color: #3d4f63; }
.staff-pw-toggle { display: grid; place-items: center; width: 26px; height: 26px; border: 0; border-radius: 7px; background: #f0f3f6; color: #8793a4; cursor: pointer; }
.staff-pw-toggle:hover { background: #e7ebf0; color: #4b6182; }
.staff-pw-toggle svg { width: 13px; height: 13px; }
.staff-status { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 10px; font-weight: 700; }
.staff-status.active { color: #1d8a6f; background: rgba(29,138,111,.1); }
.staff-status.inactive { color: #b57410; background: rgba(255,176,1,.16); }
.staff-actions { display: flex; align-items: center; gap: 8px; }
.staff-edit { padding: 6px 12px; border: 1px solid #d5e4da; border-radius: 9px; background: #f3faf5; color: #1d693f; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600; cursor: pointer; transition: background .15s, border-color .15s; }
.staff-edit:hover { background: #e7f4ec; border-color: #b4d3c0; }
.staff-remove { padding: 6px 12px; border: 1px solid #f2d5d0; border-radius: 9px; background: #fff7f6; color: #c0564d; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600; cursor: pointer; transition: background .15s, border-color .15s; }
.staff-remove:hover { background: #fdeae7; border-color: #e7b4ac; }
.staff-empty { padding: 44px 20px; text-align: center; color: #a8b3c2; font-size: 12.5px; }
.staff-modal-overlay { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 24px; background: rgba(13,38,26,.45); backdrop-filter: blur(4px); }
.staff-modal-panel { width: min(100%, 520px); max-height: 92vh; overflow-y: auto; padding: 26px; border-radius: 18px; background: #fff; box-shadow: 0 24px 60px rgba(9,44,28,.25); }
.staff-modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.staff-modal-header h3 { margin: 0; color: #172131; font-size: 16px; font-weight: 700; }
.staff-modal-close { display: grid; place-items: center; width: 30px; height: 30px; border: 0; border-radius: 9px; background: #f0f3f6; color: #8793a4; cursor: pointer; }
.staff-modal-close:hover { background: #e7ebf0; color: #4b6182; }
.staff-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.staff-form-group label { display: block; margin-bottom: 7px; color: #929ba8; font-size: 10px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; }
.staff-form-group input, .staff-form-group select { width: 100%; height: 46px; padding: 0 14px; border: 1px solid #e1e5e9; border-radius: 11px; outline: 0; color: #253244; font-size: 13px; font-family: 'DM Sans', sans-serif; background: #fff; box-sizing: border-box; }
.staff-form-group input:focus, .staff-form-group select:focus { border-color: #7fc297; box-shadow: 0 0 0 3px rgba(33,84,50,.12); }
.staff-form-error { padding: 10px 14px; margin-bottom: 14px; border: 1px solid #f2d5d0; border-radius: 10px; background: #fff7f6; color: #c0564d; font-size: 11.5px; font-weight: 600; }
.staff-modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
.staff-btn-secondary { padding: 10px 16px; border: 1px solid #dfe4ea; border-radius: 10px; background: #fff; color: #5b6b85; font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 600; cursor: pointer; }
.staff-btn-secondary:hover { background: #f6f8fa; }
.staff-btn-primary { padding: 10px 16px; border: 0; border-radius: 10px; color: #fff; background: #14402b; font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 600; cursor: pointer; box-shadow: 0 6px 14px rgba(20,64,43,.18); }
.staff-btn-primary:hover { background: #215432; }
.staff-btn-primary:disabled { background: #a8b8ad; cursor: not-allowed; box-shadow: none; }

@media (max-width: 1100px) { .member-stats { grid-template-columns: repeat(2, 1fr); } .member-grid { grid-template-columns: 1fr; } .staffs-stats { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .member-layout { grid-template-columns: 1fr; } .member-topbar { padding: 14px 18px; } .member-content { padding: 20px 18px; } .member-hero { padding: 24px 20px; } }
@media (max-width: 560px) { .member-stats { grid-template-columns: 1fr; } .rooms-bar { grid-template-columns: repeat(2, 1fr); } .member-hero .hero-days { flex-direction: column; align-items: flex-start; } .staff-form-grid { grid-template-columns: 1fr; } .staffs-header { flex-direction: column; align-items: flex-start; } }
`

const icons = {
  dashboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>,
  staffs: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  logout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
}

function computeLicense(data) {
  let remainingDays = null
  let totalDays = 365
  let pct = 100
  if (data?.expiry_date) {
    const expiry = new Date(data.expiry_date)
    const now = new Date()
    remainingDays = Math.max(0, Math.round((expiry - now) / 86400000))
    pct = Math.min(100, Math.max(0, Math.round((remainingDays / totalDays) * 100)))
  }
  return { remainingDays, pct }
}

const STATUS_POLL_INTERVAL = 30000

function MemberDashboard({ admin, onLogout }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [activeNav, setActiveNav] = useState('dashboard')
  const [showStaffModal, setShowStaffModal] = useState(false)
  const [staffEditId, setStaffEditId] = useState(null)
  const [staffForm, setStaffForm] = useState({ name: '', department: '', designation: '', phone: '', username: '', password: '', status: 'Active' })
  const [staffList, setStaffList] = useState([])
  const [staffLoading, setStaffLoading] = useState(false)
  const [staffError, setStaffError] = useState('')
  const [staffFormError, setStaffFormError] = useState('')
  const [staffSaving, setStaffSaving] = useState(false)
  const [staffToRemove, setStaffToRemove] = useState(null)
  const [staffDeleteError, setStaffDeleteError] = useState('')
  const [visiblePasswords, setVisiblePasswords] = useState({})

  useEffect(() => {
    if (!admin) return

    let disposed = false
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/check-member-status/?client_id=${encodeURIComponent(admin.client_id)}&username=${encodeURIComponent(admin.username)}`)
        const data = await res.json()
        if (!disposed && data.active === false) {
          onLogout()
        }
      } catch {}
    }
    checkStatus()
    const timer = setInterval(checkStatus, STATUS_POLL_INTERVAL)
    return () => {
      disposed = true
      clearInterval(timer)
    }
  }, [admin, onLogout])

  useEffect(() => {
    if (!admin) return

    let disposed = false
    setStaffLoading(true)
    setStaffError('')
    fetch(`/api/staffs/list/?client_id=${encodeURIComponent(admin.client_id)}`)
      .then(res => res.json())
      .then(data => {
        if (disposed) return
        if (data.success) {
          setStaffList(data.staffs || [])
        } else {
          setStaffError(data.error || 'Failed to load staffs')
        }
      })
      .catch(() => { if (!disposed) setStaffError('Failed to load staffs') })
      .finally(() => { if (!disposed) setStaffLoading(false) })
    return () => { disposed = true }
  }, [admin])

  if (!admin) {
    return <><style>{styles}</style><div className="member-missing"><div className="member-missing-card"><h2>No active session</h2><p>Please sign in to continue.</p></div></div></>
  }

  const initials = admin.username.slice(0, 2).toUpperCase()
  const { remainingDays, pct } = computeLicense(admin)

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', count: null, icon: icons.dashboard },
    { id: 'staffs', label: 'Staffs', count: staffList.length, icon: icons.staffs },
  ]

  const staffStats = [
    { label: 'Total Staff', value: staffList.length, color: '#215432', bg: 'rgba(33,84,50,.09)' },
    { label: 'Active', value: staffList.filter(s => s.status === 'Active').length, color: '#36b37e', bg: 'rgba(54,179,126,.1)' },
    { label: 'Inactive', value: staffList.filter(s => s.status === 'Inactive').length, color: '#e09100', bg: 'rgba(255,176,1,.14)' },
    { label: 'Departments', value: new Set(staffList.map(s => s.department)).size, color: '#8b5cf6', bg: 'rgba(139,92,246,.1)' },
  ]

  const openAddStaff = () => {
    setStaffEditId(null)
    setStaffForm({ name: '', department: '', designation: '', phone: '', username: '', password: '', status: 'Active' })
    setStaffFormError('')
    setShowStaffModal(true)
  }

  const openEditStaff = (s) => {
    setStaffEditId(s.id)
    setStaffForm({ name: s.name, department: s.department, designation: s.designation, phone: s.phone, username: s.username, password: s.password, status: s.status })
    setStaffFormError('')
    setShowStaffModal(true)
  }

  const handleSaveStaff = async () => {
    const { name, department, designation, phone, username, password, status } = staffForm
    if (!name.trim() || !department.trim() || !designation.trim() || !phone.trim() || !username.trim() || !password) {
      setStaffFormError('All required fields must be filled')
      return
    }
    if (/\s/.test(username)) {
      setStaffFormError('Username cannot contain spaces')
      return
    }
    setStaffSaving(true)
    setStaffFormError('')
    const url = staffEditId ? '/api/staffs/edit/' : '/api/staffs/create/'
    const payload = staffEditId
      ? { id: staffEditId, name: name.trim(), department: department.trim(), designation: designation.trim(), phone: phone.trim(), username: username.trim(), password, status }
      : { client_id: admin.client_id, name: name.trim(), department: department.trim(), designation: designation.trim(), phone: phone.trim(), username: username.trim(), password, status }
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        if (staffEditId) {
          setStaffList(staffList.map(s => (s.id === data.staff.id ? data.staff : s)))
        } else {
          setStaffList([data.staff, ...staffList])
        }
        setShowStaffModal(false)
      } else {
        setStaffFormError(data.error || 'Something went wrong')
      }
    } catch {
      setStaffFormError('Failed to connect to server')
    } finally {
      setStaffSaving(false)
    }
  }

  const handleRemoveStaff = async (password) => {
    if (!staffToRemove) return
    setStaffDeleteError('')
    try {
      const res = await fetch('/api/staffs/delete/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: staffToRemove.id, client_id: admin.client_id, username: admin.username, password }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setStaffList(staffList.filter(s => s.id !== staffToRemove.id))
        setStaffToRemove(null)
      } else {
        setStaffDeleteError(data.error || 'Failed to remove staff')
      }
    } catch {
      setStaffDeleteError('Failed to connect to server')
    }
  }

  const requestRemoveStaff = (s) => {
    setStaffDeleteError('')
    setStaffToRemove(s)
  }

  const togglePassword = (id) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const statCards = [
    { label: 'Gmail', value: admin.client_id, color: '#215432', bg: 'rgba(33,84,50,.09)', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg> },
    { label: 'Package', value: admin.package, color: '#e09100', bg: 'rgba(255,176,1,.14)', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.29 7 12 12 20.71 7" /><line x1="12" y1="22" x2="12" y2="12" /></svg> },
    { label: 'Module', value: admin.module_name || '—', color: '#8b5cf6', bg: 'rgba(139,92,246,.1)', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg> },
    { label: 'License Expiry', value: admin.expiry_date || '—', color: '#36b37e', bg: 'rgba(54,179,126,.1)', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg> },
  ]

  const activities = [
    { text: <><strong>System</strong> verified your license for <strong>{admin.module_name || 'Melone Stay'}</strong></>, time: 'today', color: '#36b37e' },
    { text: <><strong>{admin.package}</strong> plan is active on your account</>, time: 'today', color: '#e09100' },
    { text: <><strong>Welcome</strong> — your admin workspace is ready</>, time: 'just now', color: '#215432' },
  ]

  const rooms = [
    { label: 'Active', count: 24, pct: 68, color: '#36b37e' },
    { label: 'Draft', count: 6, pct: 24, color: '#ffb001' },
    { label: 'Archived', count: 4, pct: 16, color: '#a3b1c4' },
    { label: 'Private', count: 2, pct: 10, color: '#215432' },
  ]

  return <><style>{styles}</style><div className="member-layout">
    <aside className="member-sidebar">
      <div className="member-sidebar-header"><img src={meloneLogo} alt="Melone Stay" className="logo-img" /></div>
      <nav className="member-nav">
        <div className="nav-section">
          <div className="nav-section-title">Menu</div>
          {navItems.map(item => (
            <button key={item.id} className={`nav-item ${activeNav === item.id ? 'active' : ''}`} onClick={() => setActiveNav(item.id)}>
              <span className="nav-icon">{item.icon}</span>{item.label}
              {item.count !== null && <span className="nav-count">{item.count}</span>}
            </button>
          ))}
        </div>
      </nav>
      <button className="member-logout" onClick={() => setShowLogoutConfirm(true)}>{icons.logout}<span>Log out</span></button>
    </aside>
    <div className="member-main">
      <header className="member-topbar">
        <div><h1>{activeNav === 'staffs' ? 'Staffs' : 'Dashboard'}</h1><p>Welcome back, {admin.username}</p></div>
        <div className="member-topbar-right">
          <button className="member-topbar-btn" aria-label="Notifications"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg><span className="dot" /></button>
        </div>
      </header>
      <div className="member-content">
        {activeNav === 'dashboard' && <>
          <div className="member-hero">
            <div className="hero-eyebrow">Admin workspace</div>
            <h2>Welcome, <span>{admin.customer_name}</span></h2>
            <p>This is your Melone Stay control centre. Manage your rooms, keep track of your license and stay on top of everything happening for your property.</p>
            <div className="member-hero-identity">
              <div className="member-avatar hero-avatar">{initials}</div>
              <div style={{ minWidth: 0 }}>
                <div className="member-hero-username">{admin.username}</div>
                <div className="member-hero-meta">{admin.package} · {admin.customer_name}</div>
              </div>
            </div>
            <div className="hero-days">
              <div className="hero-badge"><b>{remainingDays !== null ? remainingDays : '—'}</b><span>days left on license</span></div>
              <div className="hero-badge"><b>{admin.package}</b><span>active plan</span></div>
            </div>
          </div>

          <div className="member-stats">
            {statCards.map(s => (
              <div className="member-stat" key={s.label}>
                <div className="member-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                <div className="member-stat-value">{s.value}</div>
                <div className="member-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="member-grid">
            <div className="member-card">
              <div className="member-card-header"><h3>Company Details</h3><button className="view-all">View</button></div>
              <div className="member-card-body">
                <div className="company-row"><div className="company-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>Customer Name</div><div className="company-value">{admin.customer_name}</div></div>
                <div className="company-row"><div className="company-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>Gmail</div><div className="company-value mono">{admin.client_id}</div></div>
                <div className="company-row"><div className="company-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>Package</div><div className="company-value">{admin.package}</div></div>
                <div className="company-row"><div className="company-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>Module</div><div className="company-value">{admin.module_name || '—'}</div></div>
                <div className="company-row"><div className="company-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>License Expiry</div><div className="company-value">{admin.expiry_date || '—'}</div></div>
                <div className="company-row"><div className="company-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>Status</div><div className="company-value"><span className="member-badge">Active</span></div></div>
              </div>
            </div>
            <div>
              <div className="member-card" style={{ marginBottom: 16 }}>
                <div className="member-card-header"><h3>License Status</h3></div>
                <div className="member-card-body license-card">
                  <div className="license-header"><b>{remainingDays !== null ? `${remainingDays} days remaining` : 'Unlimited'}</b><span>{pct}% of year</span></div>
                  <div className="license-bar"><div className="license-bar-fill" style={{ width: `${pct}%` }} /></div>
                  <div className="license-meta"><span>Valid until</span><b>{admin.expiry_date || '—'}</b></div>
                </div>
              </div>
              <div className="member-card">
                <div className="member-card-header"><h3>Recent Activity</h3></div>
                <div className="member-card-body">
                  <div className="activity-list">
                    {activities.map((a, i) => (
                      <div className="activity-item" key={i}>
                        <div className="activity-dot" style={{ background: a.color }} />
                        <div className="activity-text">{a.text}<div className="activity-time">{a.time}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="member-card">
            <div className="member-card-header"><h3>Room Overview</h3><button className="view-all">Details</button></div>
            <div className="member-card-body">
              <div className="rooms-bar">
                {rooms.map(r => (
                  <div className="room-tile" key={r.label}>
                    <div className="room-count">{r.count}</div>
                    <div className="room-label">{r.label} Rooms</div>
                    <div className="room-bar"><div className="room-bar-fill" style={{ width: r.pct + '%', background: r.color }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
        }
        {activeNav === 'staffs' && <>
          <div className="staffs-header">
            <div>
              <div className="hero-eyebrow">Team management</div>
              <h2>Staffs</h2>
              <p>Manage the people who keep your rooms moving and your guests happy.</p>
            </div>
            <button className="add-staff-btn" onClick={openAddStaff}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>Add Staff</button>
          </div>

          {staffError && <div className="staff-banner">{staffError}</div>}

          <div className="member-stats staffs-stats">
            {staffStats.map(s => (
              <div className="member-stat" key={s.label}>
                <div className="member-stat-icon" style={{ background: s.bg, color: s.color }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></div>
                <div className="member-stat-value">{s.value}</div>
                <div className="member-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="member-card">
            <div className="member-card-header"><h3>Staff Directory</h3><button className="view-all">{staffList.length} members</button></div>
            {staffLoading ? (
              <div className="staff-empty">Loading staff...</div>
            ) : staffList.length === 0 ? (
              <div className="staff-empty">No staff members yet. Click "Add Staff" to build your team.</div>
            ) : (
              <div className="staff-table-wrap">
              <table className="staff-table">
                <thead>
                  <tr><th>Name</th><th>Department</th><th>Designation</th><th>Phone</th><th>Username</th><th>Password</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {staffList.map(s => (
                    <tr key={s.id}>
                      <td>
                        <div className="staff-cell-name">
                          <div className="staff-avatar">{s.name.slice(0, 2).toUpperCase()}</div>
                          <div><div className="staff-name">{s.name}</div></div>
                        </div>
                      </td>
                      <td>{s.department}</td>
                      <td>{s.designation}</td>
                      <td>{s.phone}</td>
                      <td>{s.username}</td>
                      <td>
                        <div className="staff-cell-pw">
                          <span className="staff-pw">{visiblePasswords[s.id] ? s.password : '••••••••'}</span>
                          <button className="staff-pw-toggle" title={visiblePasswords[s.id] ? 'Hide password' : 'Show password'} onClick={() => togglePassword(s.id)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                          </button>
                        </div>
                      </td>
                      <td><span className={`staff-status ${s.status === 'Active' ? 'active' : 'inactive'}`}>{s.status}</span></td>
                      <td>
                        <div className="staff-actions">
                          <button className="staff-edit" onClick={() => openEditStaff(s)}>Edit</button>
                          <button className="staff-remove" onClick={() => requestRemoveStaff(s)}>Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </div>
        </>
        }
      </div>
    </div>
  </div>
  {showStaffModal && (
    <div className="staff-modal-overlay" onClick={() => setShowStaffModal(false)}>
      <div className="staff-modal-panel" onClick={e => e.stopPropagation()}>
        <div className="staff-modal-header">
          <h3>{staffEditId ? 'Edit Staff' : 'Add Staff'}</h3>
          <button className="staff-modal-close" onClick={() => setShowStaffModal(false)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
        </div>
        {staffFormError && <div className="staff-form-error">{staffFormError}</div>}
        <div className="staff-form-grid">
          <div className="staff-form-group"><label>Name</label><input type="text" value={staffForm.name} onChange={e => setStaffForm({ ...staffForm, name: e.target.value })} placeholder="Enter staff name" /></div>
          <div className="staff-form-group"><label>Department</label><input type="text" value={staffForm.department} onChange={e => setStaffForm({ ...staffForm, department: e.target.value })} placeholder="e.g. Front Office" /></div>
          <div className="staff-form-group"><label>Designation</label><input type="text" value={staffForm.designation} onChange={e => setStaffForm({ ...staffForm, designation: e.target.value })} placeholder="e.g. Front Desk Agent" /></div>
          <div className="staff-form-group"><label>Phone</label><input type="text" value={staffForm.phone} onChange={e => setStaffForm({ ...staffForm, phone: e.target.value })} placeholder="e.g. +91 98765 43210" /></div>
          <div className="staff-form-group"><label>Username</label><input type="text" value={staffForm.username} onChange={e => setStaffForm({ ...staffForm, username: e.target.value.replace(/\s/g, '') })} placeholder="Enter username" /></div>
          <div className="staff-form-group"><label>Password</label><input type="text" value={staffForm.password} onChange={e => setStaffForm({ ...staffForm, password: e.target.value })} placeholder="Enter password" /></div>
          <div className="staff-form-group"><label>Status</label>
            <select value={staffForm.status} onChange={e => setStaffForm({ ...staffForm, status: e.target.value })}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="staff-modal-footer">
          <button className="staff-btn-secondary" onClick={() => setShowStaffModal(false)}>Cancel</button>
          <button className="staff-btn-primary" onClick={handleSaveStaff} disabled={staffSaving}>{staffSaving ? 'Saving...' : (staffEditId ? 'Save Changes' : 'Add Staff')}</button>
        </div>
      </div>
    </div>
  )}
  <ConfirmDialog
    open={showLogoutConfirm}
    title="Log out of Melone Stay?"
    message="You will be signed out of your session and returned to the login page."
    confirmText="Log out"
    cancelText="Cancel"
    danger
    onCancel={() => setShowLogoutConfirm(false)}
    onConfirm={onLogout}
  />
  <ConfirmDialog
    open={!!staffToRemove}
    title="Remove staff member?"
    message={staffToRemove ? `${staffToRemove.name} will be permanently removed from your team. Enter your admin password to confirm.` : ''}
    confirmText="Remove"
    cancelText="Cancel"
    danger
    requirePassword
    passwordPlaceholder="Enter your admin password"
    passwordError={staffDeleteError}
    onCancel={() => setStaffToRemove(null)}
    onConfirm={handleRemoveStaff}
  />
  </>
}

export default MemberDashboard