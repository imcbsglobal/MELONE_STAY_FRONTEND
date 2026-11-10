import { useState, useEffect } from 'react'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import MemberSidebar from '../../components/layout/Sidebar'
import RoomCategory from '../../masters/RoomCategory'
import RoomMaster from '../../masters/RoomMaster'
import RoomsList from '../../masters/rooms/RoomsList'
import OtaMaster from '../../masters/ota/OtaMaster'
import TaxMaster from '../../masters/TaxMaster'
import CurrencyMaster from '../../masters/CurrencyMaster'
import ActivityLogPage from '../activity-log/ActivityLogPage'
import { apiFetch } from '../../lib/api'

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

.member-content { flex: 1; min-height: 0; overflow-y: auto; padding: 28px 32px; scrollbar-width: thin; scrollbar-color: #c9d3e0 transparent; }
.member-content::-webkit-scrollbar { width: 8px; }
.member-content::-webkit-scrollbar-track { background: transparent; }
.member-content::-webkit-scrollbar-thumb { background: #c9d3e0; border-radius: 999px; }


.member-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.member-stat { position: relative; padding: 18px; border: 1px solid #e8ecf1; border-radius: 16px; background: #fff; overflow: hidden; transition: box-shadow .2s, transform .2s; box-shadow: 0 1px 2px rgba(39,54,74,.03); }
.member-stat:hover { box-shadow: 0 14px 30px rgba(39,54,74,.1); transform: translateY(-3px); }
.member-stat-icon { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 11px; margin-bottom: 12px; }
.member-stat-icon svg { width: 18px; height: 18px; }
.member-stat-value { color: #172131; font-size: 19px; font-weight: 700; letter-spacing: -.5px; word-break: break-all; line-height: 1.3; }
.member-stat-label { color: #8793a4; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .7px; margin-top: 5px; }

.member-card { border: 1px solid #e8ecf1; border-radius: 16px; background: #fff; overflow: hidden; box-shadow: 0 1px 2px rgba(39,54,74,.03); }
.member-card-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f0f2f5; }
.member-card-header h3 { margin: 0; color: #172131; font-size: 13px; font-weight: 700; }
.member-card-header .view-all { padding: 0; border: 0; color: #1d693f; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600; cursor: pointer; }
.member-card-header .view-all:hover { text-decoration: underline; }
.member-card-body { padding: 8px 20px; }






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

.dash-stats, .dash-grid { --logo-green: #2e7d32; --logo-dark: #215432; --logo-orange: #f59e0b; --logo-orange-soft: #fff4de; --logo-green-soft: #e8f3ea; }
.dash-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 16px; }
.dash-stat { padding: 18px 20px; border: 1px solid #e8ecf1; border-top: 3px solid var(--logo-green); border-radius: 14px; background: #fff; }
.dash-stat.is-orange { border-top-color: var(--logo-orange); }
.dash-stat.is-orange .dash-stat-value { color: #b86e00; }
.dash-stat.is-green .dash-stat-value { color: var(--logo-dark); }
.dash-stat-label { color: #6f7d8f; font-size: 12px; font-weight: 600; }
.dash-stat-value { margin-top: 8px; color: #172131; font-size: 26px; font-weight: 700; letter-spacing: -.5px; line-height: 1.1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dash-stat-note { margin-top: 6px; color: #8793a4; font-size: 11.5px; }
.dash-grid { display: grid; grid-template-columns: minmax(0, 1.8fr) minmax(0, 1fr); gap: 16px; align-items: start; }
.dash-side { display: grid; gap: 16px; }
.dash-card { border: 1px solid #e8ecf1; border-radius: 14px; background: #fff; }
.dash-card-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 16px 20px; border-bottom: 1px solid #f0f2f5; }
.dash-card-head h3 { position: relative; margin: 0; padding-left: 11px; color: var(--logo-dark); font-size: 14px; font-weight: 700; }
.dash-card-head h3::before { content: ''; position: absolute; top: 2px; bottom: 2px; left: 0; width: 3px; border-radius: 3px; background: var(--logo-orange); }
.dash-card-head p { margin: 3px 0 0; color: #8793a4; font-size: 11.5px; }
.dash-card-body { padding: 16px 20px 20px; }
.dash-tabs { display: inline-flex; padding: 3px; border-radius: 9px; background: #f0f3f6; flex-shrink: 0; }
.dash-tabs button { padding: 6px 12px; border: 0; border-radius: 7px; background: transparent; color: #6f7d8f; font: 600 11.5px 'DM Sans', sans-serif; cursor: pointer; }
.dash-tabs button.is-active { background: var(--logo-dark); color: #fff; box-shadow: 0 2px 6px rgba(33,84,50,.25); }
.dash-tabs button:focus-visible { outline: 2px solid #215432; outline-offset: 2px; }
.dash-chart { display: block; width: 100%; height: auto; }
.dash-chart text { fill: #8793a4; font: 11px 'DM Sans', sans-serif; }
.dash-chart .grid { stroke: #eef1f5; stroke-width: 1; }
.dash-chart .line { fill: none; stroke: #2e7d32; stroke-width: 2.5; stroke-linejoin: round; stroke-linecap: round; }
.dash-chart .area { fill: rgba(46,125,50,.1); }
.dash-chart .dot { fill: #fff; stroke: #f59e0b; stroke-width: 2.5; }
.dash-chart .guide { stroke: #c9d3e0; stroke-dasharray: 3 3; }
.dash-chart .tip-box { fill: #215432; }
.dash-chart .tip-text { fill: #fff; font-weight: 600; }
.dash-empty { padding: 56px 16px; color: #8793a4; font-size: 12.5px; text-align: center; }
.dash-license-top { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
.dash-license-top b { color: var(--logo-dark); font-size: 20px; }
.dash-license-top span { color: #8793a4; font-size: 11.5px; }
.dash-bar { height: 8px; margin-top: 12px; border-radius: 999px; background: #edf1f5; overflow: hidden; }
.dash-bar > div { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #2e7d32, #f59e0b); }
.dash-rows { display: grid; }
.dash-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 11px 0; border-bottom: 1px solid #f2f4f7; font-size: 12.5px; }
.dash-row:last-child { border-bottom: 0; padding-bottom: 0; }
.dash-row:first-child { padding-top: 0; }
.dash-row span { color: #8793a4; }
.dash-row b { min-width: 0; overflow: hidden; color: #172131; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
.dash-status { padding: 3px 10px; border-radius: 999px; background: var(--logo-green-soft); color: var(--logo-dark) !important; font-size: 11px; }
@media (max-width: 560px) { .dash-stats { grid-template-columns: 1fr; } .dash-card-head { align-items: flex-start; flex-direction: column; } }
@media (max-width: 1100px) { .dash-stats { grid-template-columns: repeat(2, 1fr); } .member-stats { grid-template-columns: repeat(2, 1fr); } .dash-grid { grid-template-columns: 1fr; } .staffs-stats { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .member-layout { grid-template-columns: 1fr; } .member-topbar { padding: 14px 18px; } .member-content { padding: 20px 18px; } }
@media (max-width: 560px) { .member-stats { grid-template-columns: 1fr; } .staff-form-grid { grid-template-columns: 1fr; } .staffs-header { flex-direction: column; align-items: flex-start; } }

.staffs-page-tabs { display: flex; gap: 6px; margin-bottom: 22px; }
.staffs-page-tab { display: inline-flex; align-items: center; gap: 7px; min-height: 36px; padding: 0 18px; border: 1px solid #d5e4da; border-radius: 999px; background: #fff; color: #77877d; font: 700 12px 'DM Sans', sans-serif; cursor: pointer; transition: background .15s, border-color .15s, color .15s; }
.staffs-page-tab.is-active { background: #17432b; border-color: #17432b; color: #fff; box-shadow: 0 4px 10px rgba(23,67,43,.18); }
.staffs-page-tab:not(.is-active):hover { background: #f3faf5; border-color: #b9d3c0; color: #235336; }
.staffs-page-tab:focus-visible { outline: 2px solid #235336; outline-offset: 2px; }

.user-table-wrap { overflow-x: auto; }
.user-table { width: 100%; border-collapse: collapse; }
.user-table th { padding: 11px 16px; color: #8793a4; font-size: 9.5px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; text-align: left; border-bottom: 1px solid #eef1f5; background: #fafbfc; white-space: nowrap; }
.user-table td { padding: 12px 16px; border-bottom: 1px solid #f4f5f7; font-size: 12px; color: #3d4f63; }
.user-table tr:last-child td { border-bottom: 0; }
.user-cell-name { display: flex; align-items: center; gap: 10px; }
.user-avatar { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 10px; background: linear-gradient(135deg, #215432, #2e7d4f); color: #fff; font-size: 11px; font-weight: 700; flex-shrink: 0; }
.user-name { color: #172131; font-weight: 600; font-size: 12px; }
.user-sub { color: #8793a4; font-size: 10.5px; margin-top: 1px; }
.user-products { display: flex; flex-wrap: wrap; gap: 4px; }
.user-product-badge { display: inline-block; padding: 2px 7px; border-radius: 5px; background: rgba(33,84,50,.08); color: #1d5c35; font-size: 9.5px; font-weight: 700; }
.user-role-admin { display: inline-block; padding: 2px 8px; border-radius: 999px; background: rgba(139,92,246,.1); color: #7c3aed; font-size: 10px; font-weight: 700; }
.user-role-user { display: inline-block; padding: 2px 8px; border-radius: 999px; background: #f0f3f6; color: #5b6b80; font-size: 10px; font-weight: 700; }
.user-status-active { display: inline-block; padding: 2px 8px; border-radius: 999px; background: rgba(54,179,126,.1); color: #1a8058; font-size: 10px; font-weight: 700; }
.user-status-inactive { display: inline-block; padding: 2px 8px; border-radius: 999px; background: rgba(255,176,1,.14); color: #8a5e00; font-size: 10px; font-weight: 700; }
.user-actions { display: flex; align-items: center; gap: 7px; }
.user-edit { padding: 5px 11px; border: 1px solid #d5e4da; border-radius: 8px; background: #f3faf5; color: #1d693f; font: 700 11px 'DM Sans', sans-serif; cursor: pointer; transition: background .15s; }
.user-edit:hover { background: #e7f4ec; }
.user-delete { padding: 5px 11px; border: 1px solid #f2d5d0; border-radius: 8px; background: #fff7f6; color: #c0564d; font: 700 11px 'DM Sans', sans-serif; cursor: pointer; transition: background .15s; }
.user-delete:hover { background: #fdeae7; }
.user-empty { padding: 44px 20px; text-align: center; color: #a8b3c2; font-size: 12.5px; }
.user-modal-panel { width: min(100%, 600px); max-height: 92vh; overflow-y: auto; padding: 26px; border-radius: 18px; background: #fff; box-shadow: 0 24px 60px rgba(9,44,28,.25); }
.user-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.user-section-label { grid-column: 1/-1; margin: 6px 0 2px; padding: 7px 10px; border-radius: 8px; background: #f4f8f4; color: #4a6155; font-size: 10px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
.user-products-grid { grid-column: 1/-1; display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px; }
.user-product-toggle { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border: 1px solid #e4eae5; border-radius: 10px; background: #fafcfa; cursor: pointer; transition: border-color .15s, background .15s; user-select: none; }
.user-product-toggle.is-on { border-color: #b9d3c0; background: #f0f9f2; }
.user-product-toggle input { width: 16px; height: 16px; accent-color: #235336; flex-shrink: 0; cursor: pointer; }
.user-product-toggle span { color: #34453a; font-size: 12px; font-weight: 600; }
@media (max-width: 560px) { .user-form-grid { grid-template-columns: 1fr; } .user-products-grid { grid-template-columns: 1fr 1fr; } }
`

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


function niceCeil(value) {
  const pow = 10 ** Math.floor(Math.log10(value))
  const n = value / pow
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow
}

function LineChart({ points, formatValue }) {
  const [hover, setHover] = useState(null)
  const W = 640, H = 270, L = 62, R = 24, T = 18, B = 42
  const top = niceCeil(Math.max(...points.map(p => p.value), 1))
  const x = i => (points.length === 1 ? (L + W - R) / 2 : L + (i * (W - L - R)) / (points.length - 1))
  const y = v => T + (H - T - B) * (1 - v / top)
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p.value)}`).join(' ')
  const area = `${path} L${x(points.length - 1)},${y(0)} L${x(0)},${y(0)} Z`
  const every = Math.ceil(points.length / 8)
  const active = hover !== null ? points[hover] : null
  const tip = active ? formatValue(active.value) : ''
  const tipWidth = Math.max(active ? active.label.length : 0, tip.length) * 6.6 + 18
  const tipX = active ? Math.min(Math.max(x(hover) - tipWidth / 2, L), W - R - tipWidth) : 0
  return (
    <svg className="dash-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Line graph" onMouseLeave={() => setHover(null)}>
      {[0, 1, 2, 3, 4].map(i => (
        <g key={i}>
          <line className="grid" x1={L} x2={W - R} y1={y((top * i) / 4)} y2={y((top * i) / 4)} />
          <text x={L - 10} y={y((top * i) / 4) + 4} textAnchor="end">{formatValue((top * i) / 4)}</text>
        </g>
      ))}
      {points.length > 1 && <path className="area" d={area} />}
      {points.length > 1 && <path className="line" d={path} />}
      {active && <line className="guide" x1={x(hover)} x2={x(hover)} y1={T} y2={y(0)} />}
      {points.map((p, i) => (
        <g key={`${p.label}-${i}`} onMouseEnter={() => setHover(i)}>
          <rect x={x(i) - 18} y={T} width="36" height={H - T - B} fill="transparent" />
          <circle className="dot" cx={x(i)} cy={y(p.value)} r={hover === i ? 5.5 : 4} />
          {i % every === 0 && <text x={x(i)} y={H - 16} textAnchor="middle">{p.label.length > 11 ? `${p.label.slice(0, 10)}…` : p.label}</text>}
        </g>
      ))}
      {active && (
        <g pointerEvents="none">
          <rect className="tip-box" x={tipX} y={Math.max(y(active.value) - 50, 2)} width={tipWidth} height="38" rx="7" />
          <text className="tip-text" x={tipX + tipWidth / 2} y={Math.max(y(active.value) - 50, 2) + 16} textAnchor="middle">{active.label}</text>
          <text className="tip-text" x={tipX + tipWidth / 2} y={Math.max(y(active.value) - 50, 2) + 31} textAnchor="middle">{tip}</text>
        </g>
      )}
    </svg>
  )
}

const STATUS_POLL_INTERVAL = 30000

function MemberDashboard({ admin, onLogout, route, onNavigate }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [staffsTab, setStaffsTab] = useState('staff') // 'staff' | 'users'

  // ── Staff state ────────────────────────────────────────────────────
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

  // ── Users (User Master) state ──────────────────────────────────────
  const PRODUCT_FIELDS = ['trellisco', 'claudius', 'melone', 'tixelise', 'trellisco_crm', 'melone_stay', 'trellisco_books']
  const emptyUserForm = () => ({
    first_name: '', last_name: '', username: '', password: '', email: '', phone_number: '',
    user_role: 'USER', status: 'ACTIVE',
    trellisco: false, claudius: false, melone: false, tixelise: false,
    trellisco_crm: false, melone_stay: true, trellisco_books: false,
  })
  const [userList, setUserList] = useState([])
  const [userLoading, setUserLoading] = useState(false)
  const [userError, setUserError] = useState('')
  const [showUserModal, setShowUserModal] = useState(false)
  const [userEditId, setUserEditId] = useState(null)
  const [userForm, setUserForm] = useState(emptyUserForm())
  const [userFormError, setUserFormError] = useState('')
  const [userSaving, setUserSaving] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [userDeleteError, setUserDeleteError] = useState('')

  const [dashRooms, setDashRooms] = useState([])
  const [dashLoading, setDashLoading] = useState(true)
  const [dashChart, setDashChart] = useState('rates')

  useEffect(() => {
    if (!admin) return

    let disposed = false
    const checkStatus = async () => {
      try {
        const res = await apiFetch(`/api/check-member-status/?client_id=${encodeURIComponent(admin.client_id)}&username=${encodeURIComponent(admin.username)}`)
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
    apiFetch(`/api/staffs/list/?client_id=${encodeURIComponent(admin.client_id)}`)
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

  useEffect(() => {
    if (!admin) return

    let disposed = false
    apiFetch(`/api/room-master/list/?client_id=${encodeURIComponent(admin.client_id)}`)
      .then(res => res.json())
      .then(data => { if (!disposed && data.success) setDashRooms(data.rooms || []) })
      .catch(() => {})
      .finally(() => { if (!disposed) setDashLoading(false) })
    return () => { disposed = true }
  }, [admin])

  if (!admin) {
    return <><style>{styles}</style><div className="member-missing"><div className="member-missing-card"><h2>No active session</h2><p>Please sign in to continue.</p></div></div></>
  }

  const { remainingDays, pct } = computeLicense(admin)
  const roomEditId = route.startsWith('/member/room-master/')
    ? route.slice('/member/room-master/'.length)
    : null

  const activeNav = route === '/member/staffs'
    ? 'staffs'
    : route === '/member/room-category'
      ? 'room-category'
      : route === '/member/room-master' || roomEditId
        ? 'room-master'
        : route === '/member/rooms'
          ? 'rooms'
          : route === '/member/ota'
            ? 'ota'
            : route === '/member/tax-master'
              ? 'tax-master'
              : route === '/member/currency-master'
                ? 'currency-master'
                : route === '/member/activity-log'
                  ? 'activity-log'
                  : 'dashboard'

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
    setStaffForm({ name: s.name, department: s.department, designation: s.designation, phone: s.phone, username: s.username, password: '', status: s.status })
    setStaffFormError('')
    setShowStaffModal(true)
  }

  const handleSaveStaff = async () => {
    const { name, department, designation, phone, username, password, status } = staffForm
    if (!name.trim() || !department.trim() || !designation.trim() || !phone.trim() || !username.trim() || (!staffEditId && !password)) {
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
      ? { id: staffEditId, name: name.trim(), department: department.trim(), designation: designation.trim(), phone: phone.trim(), username: username.trim(), ...(password ? { password } : {}), status }
      : { client_id: admin.client_id, name: name.trim(), department: department.trim(), designation: designation.trim(), phone: phone.trim(), username: username.trim(), password, status }
    try {
      const res = await apiFetch(url, {
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
      const res = await apiFetch('/api/staffs/delete/', {
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

  // ── Users (User Master) handlers ──────────────────────────────────
  useEffect(() => {
    if (!admin || staffsTab !== 'users') return
    let disposed = false
    setUserLoading(true)
    setUserError('')
    apiFetch(`/api/user-master/`)
      .then(res => res.json())
      .then(data => {
        if (disposed) return
        if (Array.isArray(data)) setUserList(data)
        else setUserError(data.error || 'Failed to load users')
      })
      .catch(() => { if (!disposed) setUserError('Failed to load users') })
      .finally(() => { if (!disposed) setUserLoading(false) })
    return () => { disposed = true }
  }, [admin, staffsTab])

  const openAddUser = () => {
    setUserEditId(null)
    setUserForm(emptyUserForm())
    setUserFormError('')
    setShowUserModal(true)
  }

  const openEditUser = (u) => {
    setUserEditId(u.id)
    setUserForm({
      first_name: u.first_name || '',
      last_name: u.last_name || '',
      username: u.username || '',
      password: '',
      email: u.email || '',
      phone_number: u.phone_number || '',
      user_role: u.user_role || 'USER',
      status: u.status || 'ACTIVE',
      trellisco: !!u.trellisco,
      claudius: !!u.claudius,
      melone: !!u.melone,
      tixelise: !!u.tixelise,
      trellisco_crm: !!u.trellisco_crm,
      melone_stay: !!u.melone_stay,
      trellisco_books: !!u.trellisco_books,
    })
    setUserFormError('')
    setShowUserModal(true)
  }

  const handleSaveUser = async () => {
    const { first_name, last_name, username, password, email, phone_number, user_role } = userForm
    if (!first_name.trim() || !last_name.trim() || !username.trim() || !email.trim() || !phone_number.trim() || !user_role) {
      setUserFormError('First name, last name, username, email, phone and role are required')
      return
    }
    if (!userEditId && !password) {
      setUserFormError('Password is required for new users')
      return
    }
    const hasProduct = PRODUCT_FIELDS.some(f => userForm[f])
    if (!hasProduct) {
      setUserFormError('At least one product access must be enabled')
      return
    }
    setUserSaving(true)
    setUserFormError('')
    const payload = {
      first_name: first_name.trim(), last_name: last_name.trim(),
      username: username.trim(), email: email.trim(),
      phone_number: phone_number.trim(), user_role,
      status: userForm.status,
      trellisco: userForm.trellisco, claudius: userForm.claudius,
      melone: userForm.melone, tixelise: userForm.tixelise,
      trellisco_crm: userForm.trellisco_crm, melone_stay: userForm.melone_stay,
      trellisco_books: userForm.trellisco_books,
    }
    if (password) payload.password = password
    try {
      let res
      if (userEditId) {
        res = await apiFetch(`/api/user-master/${userEditId}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        res = await apiFetch(`/api/user-master/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      const data = await res.json()
      if (res.ok) {
        if (userEditId) {
          setUserList(userList.map(u => u.id === data.id ? data : u))
        } else {
          setUserList([data, ...userList])
        }
        setShowUserModal(false)
      } else {
        const msg = typeof data === 'object' ? Object.values(data).flat().join(' ') : (data.error || 'Something went wrong')
        setUserFormError(msg)
      }
    } catch {
      setUserFormError('Failed to connect to server')
    } finally {
      setUserSaving(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return
    setUserDeleteError('')
    try {
      const res = await apiFetch(`/api/user-master/${userToDelete.id}/`, { method: 'DELETE' })
      if (res.status === 204) {
        setUserList(userList.filter(u => u.id !== userToDelete.id))
        setUserToDelete(null)
      } else {
        const data = await res.json().catch(() => ({}))
        setUserDeleteError(data.error || data.detail || `Server error (${res.status})`)
      }
    } catch {
      setUserDeleteError('Failed to connect to server')
    }
  }

  const rateData = dashRooms.map(room => ({ label: room.code || room.name, value: Number(room.prices?.[0]?.amount) || 0 }))
  const floorCounts = dashRooms.reduce((acc, room) => ({ ...acc, [room.floor]: (acc[room.floor] || 0) + 1 }), {})
  const floorData = Object.keys(floorCounts).sort((p, q) => p.localeCompare(q, undefined, { numeric: true })).map(floor => ({ label: `Floor ${floor}`, value: floorCounts[floor] }))
  const chartPoints = dashChart === 'rates' ? rateData : floorData
  const formatRupee = value => `₹${Math.round(value).toLocaleString('en-IN')}`
  const formatCount = value => String(Math.round(value))

  return <><style>{styles}</style><div className="member-layout">
    <MemberSidebar activeNav={activeNav} staffCount={staffList.length} user={{ name: admin.customer_name || admin.client_id }} onNavigate={onNavigate} onLogoutRequest={() => setShowLogoutConfirm(true)} />
    <div className="member-main">
      <header className="member-topbar">
        <div><h1>{activeNav === 'staffs' ? 'Staffs' : activeNav === 'room-category' ? 'Room Category' : activeNav === 'room-master' ? 'Room Master' : activeNav === 'rooms' ? 'Rooms List' : activeNav === 'ota' ? 'OTA Master' : activeNav === 'tax-master' ? 'Tax Master' : activeNav === 'currency-master' ? 'Currency Master' : activeNav === 'activity-log' ? 'Activity Log' : 'Dashboard'}</h1><p>Welcome back, {admin.username}</p></div>
      </header>
      <div className="member-content">
        {activeNav === 'room-category' && <RoomCategory clientId={admin.client_id} />}
        {activeNav === 'room-master' && <RoomMaster clientId={admin.client_id} editRoomId={roomEditId} onNavigate={onNavigate} />}
        {activeNav === 'rooms' && <RoomsList clientId={admin.client_id} onNavigate={onNavigate} />}
        {activeNav === 'ota' && <OtaMaster clientId={admin.client_id} />}
        {activeNav === 'tax-master' && <TaxMaster clientId={admin.client_id} />}
        {activeNav === 'currency-master' && <CurrencyMaster clientId={admin.client_id} />}
        {activeNav === 'activity-log' && <ActivityLogPage clientId={admin.client_id} username={admin.username} projectName={admin.module_name} />}
        {activeNav === 'dashboard' && <>
          <div className="dash-stats">
            <div className="dash-stat is-green"><div className="dash-stat-label">Total rooms</div><div className="dash-stat-value">{dashLoading ? '—' : dashRooms.length}</div><div className="dash-stat-note">Configured for your property</div></div>
            <div className="dash-stat is-orange"><div className="dash-stat-label">Staff members</div><div className="dash-stat-value">{staffLoading ? '—' : staffList.length}</div><div className="dash-stat-note">{staffList.filter(s => s.status === 'Active').length} active</div></div>
            <div className="dash-stat is-green"><div className="dash-stat-label">License days left</div><div className="dash-stat-value">{remainingDays !== null ? remainingDays : '—'}</div><div className="dash-stat-note">Valid until {admin.expiry_date || '—'}</div></div>
            <div className="dash-stat is-orange"><div className="dash-stat-label">Package</div><div className="dash-stat-value" title={admin.package}>{admin.package || '—'}</div><div className="dash-stat-note">{admin.module_name || 'Melone Stay'}</div></div>
          </div>

          <div className="dash-grid">
            <section className="dash-card">
              <div className="dash-card-head">
                <div><h3>{dashChart === 'rates' ? 'Room rates' : 'Rooms per floor'}</h3><p>{dashChart === 'rates' ? 'Base rate of each room' : 'Number of rooms on each floor'}</p></div>
                <div className="dash-tabs" role="tablist" aria-label="Chart type">
                  <button type="button" role="tab" aria-selected={dashChart === 'rates'} className={dashChart === 'rates' ? 'is-active' : ''} onClick={() => setDashChart('rates')}>Rates</button>
                  <button type="button" role="tab" aria-selected={dashChart === 'floors'} className={dashChart === 'floors' ? 'is-active' : ''} onClick={() => setDashChart('floors')}>Floors</button>
                </div>
              </div>
              <div className="dash-card-body">
                {dashLoading ? <div className="dash-empty">Loading chart…</div> : chartPoints.length === 0 ? <div className="dash-empty">No rooms yet. Add rooms in Room Master to see this graph.</div> : <LineChart key={dashChart} points={chartPoints} formatValue={dashChart === 'rates' ? formatRupee : formatCount} />}
              </div>
            </section>

            <div className="dash-side">
              <section className="dash-card">
                <div className="dash-card-head"><h3>License</h3></div>
                <div className="dash-card-body">
                  <div className="dash-license-top"><b>{remainingDays !== null ? `${remainingDays} days` : 'Unlimited'}</b><span>{pct}% of year left</span></div>
                  <div className="dash-bar"><div style={{ width: `${pct}%` }} /></div>
                </div>
              </section>
              <section className="dash-card">
                <div className="dash-card-head"><h3>Account details</h3></div>
                <div className="dash-card-body">
                  <div className="dash-rows">
                    <div className="dash-row"><span>Customer</span><b>{admin.customer_name}</b></div>
                    <div className="dash-row"><span>Client ID</span><b>{admin.client_id}</b></div>
                    <div className="dash-row"><span>Module</span><b>{admin.module_name || '—'}</b></div>
                    <div className="dash-row"><span>Expiry</span><b>{admin.expiry_date || '—'}</b></div>
                    <div className="dash-row"><span>Status</span><b className="dash-status">Active</b></div>
                  </div>
                </div>
              </section>
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
                        <span className="staff-pw">Protected</span>
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
          <div className="staff-form-group"><label>{staffEditId ? 'New password (optional)' : 'Password'}</label><input type="password" value={staffForm.password} onChange={e => setStaffForm({ ...staffForm, password: e.target.value })} placeholder={staffEditId ? 'Leave blank to keep current password' : 'Enter password'} /></div>
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