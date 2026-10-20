import { useState } from 'react'
import PointGlobe from '../../components/visuals/PointGlobe'
import earthTexture from '../../assets/earth-atmos.jpg'
import cloudTexture from '../../assets/earth-clouds.png'
import meloneLogo from '../../assets/melone logo.png'

const styles = String.raw`
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
.landing { position: relative; min-height: 100svh; overflow: hidden; color: #1b2b20; background: #fbfcff; font-family: 'DM Sans', sans-serif; }
.landing::before { content: ''; position: absolute; inset: 0; z-index: 0; background: linear-gradient(120deg, #eef5f0 0%, #f4f3ec 34%, #e9fbf6 68%, #eef5f0 100%); }
.landing::after { content: ''; position: absolute; inset: 0; z-index: 0; opacity: .5; background-image: radial-gradient(circle at 15% 18%, rgba(45, 116, 71, .12), transparent 40%), radial-gradient(circle at 85% 30%, rgba(255, 176, 1, .14), transparent 42%), radial-gradient(circle at 60% 90%, rgba(46, 125, 79, .08), transparent 45%); }

.landing-nav { position: relative; z-index: 3; display: flex; align-items: center; justify-content: space-between; padding: 22px clamp(22px, 5vw, 64px); }
.landing-brand { display: flex; align-items: center; gap: 10px; color: #1b2b20; font-size: 17px; font-weight: 800; letter-spacing: -.5px; }
.landing-brand .landing-logo { height: 40px; width: auto; object-fit: contain; }
.foot-brand .foot-logo { height: 34px; width: auto; object-fit: contain; }
.landing-brand .brand-mark { display: inline-flex; gap: 3px; align-items: flex-end; height: 20px; }
.landing-brand .brand-mark i { display: block; width: 5px; border-radius: 5px; background: #215432; transform: skewY(-26deg); }.landing-brand .brand-mark i:nth-child(1) { height: 11px; }.landing-brand .brand-mark i:nth-child(2) { height: 17px; background: #ffb001; }.landing-brand .brand-mark i:nth-child(3) { height: 13px; background: #2e7d4f; }
.landing-nav-links { display: flex; align-items: center; gap: 30px; font-size: 13px; font-weight: 600; color: #5b6b85; }
.landing-nav-links a { color: inherit; text-decoration: none; }
.landing-nav-links a:hover { color: #215432; }
.landing-login { display: flex; align-items: center; justify-content: center; gap: 12px; }
.landing-login .ghost { padding: 9px 14px; border: 1px solid #dbe3f0; border-radius: 10px; color: #4a5a78; background: rgba(255,255,255,.6); font-size: 13px; font-weight: 600; text-decoration: none; transition: all .18s; }
.landing-login .ghost:hover { background: #fff; border-color: #c8c9b2; }
.landing-login .primary { padding: 10px 20px; border: 0; border-radius: 10px; color: #fff; background: linear-gradient(110deg, #14402b, #215432); font-size: 13px; font-weight: 700; text-decoration: none; box-shadow: 0 8px 18px rgba(20, 55, 38, .18); transition: transform .18s, box-shadow .18s; }
.landing-login .primary:hover { transform: translateY(-1px); box-shadow: 0 12px 24px rgba(20, 55, 38, .24); }

.landing-hero { position: relative; z-index: 2; display: grid; grid-template-columns: .95fr 1.05fr; gap: 40px; align-items: center; padding: 40px clamp(22px, 5vw, 64px) 70px; }
.landing-hero-copy { max-width: 620px; animation: landing-rise .8s ease-out both; }
.landing-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; margin-bottom: 22px; border: 1px solid rgba(45, 116, 71, .2); border-radius: 999px; background: rgba(45, 116, 71, .08); color: #1d693f; font-size: 11.5px; font-weight: 700; }
.landing-badge::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #ffb001; box-shadow: 0 0 10px #ffb001; }
.landing-hero h1 { margin: 0; font-size: clamp(42px, 6vw, 74px); line-height: 1.02; font-weight: 800; letter-spacing: -3px; }
.landing-hero h1 .grad { background: linear-gradient(100deg, #215432, #2e7d4f 55%, #ffb001); -webkit-background-clip: text; background-clip: text; color: transparent; }
.landing-hero p.lead { margin: 22px 0 30px; max-width: 500px; color: #5b6b85; font-size: 17px; line-height: 1.6; }
.landing-cta { display: flex; align-items: center; gap: 14px; }
.landing-cta .start { display: inline-flex; align-items: center; gap: 9px; padding: 15px 26px; border: 0; border-radius: 13px; color: #fff; background: #14402b; font-size: 15px; font-weight: 700; text-decoration: none; box-shadow: 0 14px 30px rgba(20, 64, 43, .22); transition: transform .18s, box-shadow .18s; }
.landing-cta .start:hover { transform: translateY(-2px); box-shadow: 0 18px 38px rgba(20, 64, 43, .3); }
.landing-cta .alt { padding: 12px 20px; border: 1px solid #d8e0ee; border-radius: 13px; color: #4a5a78; background: rgba(255,255,255,.7); font-size: 14px; font-weight: 600; text-decoration: none; transition: all .18s; }
.landing-cta .alt:hover { background: #fff; border-color: #bcc8dd; }
.landing-hero .hero-trust { display: flex; align-items: center; gap: 10px; margin-top: 30px; color: #7b8aa1; font-size: 12px; }
.landing-hero .hero-trust .avatars { display: flex; }
.landing-hero .hero-trust .avatars span { display: grid; place-items: center; width: 30px; height: 30px; margin-left: -8px; border: 2px solid #fbfcff; border-radius: 50%; color: #fff; font-size: 9px; font-weight: 700; }
.hero-mini-stats { display: flex; gap: 20px; margin-top: 26px; padding-top: 20px; border-top: 1px solid #e4e9f4; }
.hero-mini-stats div { position: relative; padding-left: 20px; }
.hero-mini-stats div:first-child { padding-left: 0; }
.hero-mini-stats div + div::before { content: ''; position: absolute; top: 4px; bottom: 4px; left: 0; width: 1px; background: #e4e9f4; }
.hero-mini-stats strong { display: block; font-size: 21px; font-weight: 800; letter-spacing: -.5px; }
.hero-mini-stats small { color: #7b8aa1; font-size: 11px; font-weight: 600; }

.landing-hero-visual { position: relative; display: grid; place-items: center; }
.hero-globe-panel { position: relative; width: min(100%, 580px); color: #1b2436; animation: landing-float 8s ease-in-out infinite; }
.hero-globe-panel::before { content: ''; position: absolute; inset: -8% -12%; z-index: 0; background: radial-gradient(circle at 50% 45%, rgba(45, 116, 71, .2), transparent 56%), radial-gradient(circle at 82% 18%, rgba(255, 176, 1, .18), transparent 42%), radial-gradient(circle at 12% 85%, rgba(255, 176, 1, .12), transparent 42%); pointer-events: none; }
.hero-globe-top { position: relative; z-index: 3; display: flex; align-items: center; justify-content: space-between; padding: 0 6px; }
.live-pill { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border: 1px solid rgba(255,255,255,.7); border-radius: 999px; background: rgba(255,255,255,.88); color: #1b2436; font-size: 10.5px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 10px 26px rgba(27, 36, 54, .14); backdrop-filter: blur(6px); }
.live-pill i { width: 7px; height: 7px; border-radius: 50%; background: #ffb001; box-shadow: 0 0 12px #ffb001; animation: stay-blink 1.8s ease-in-out infinite; }
.count-pill { padding: 8px 14px; border: 1px solid rgba(255, 176, 1, .4); border-radius: 999px; background: rgba(255, 255, 255, .88); color: #b57a00; font-size: 11.5px; font-weight: 800; box-shadow: 0 10px 26px rgba(27, 36, 54, .12); }
.hero-globe-stage { position: relative; z-index: 2; height: 530px; margin: -8px 0 -12px; }
.hero-globe-stage .photo-globe { position: absolute; width: 97%; aspect-ratio: 1; top: -1%; left: 11%; overflow: hidden; border-radius: 50%; background-color: #092b1a; background-image: url(${earthTexture}); background-position: 93% center; background-size: auto 100%; background-repeat: repeat-x; box-shadow: -18px 12px 28px rgba(0, 0, 0, .35), 0 0 26px rgba(255, 201, 89, .22); animation: hero-globe-drift 34s linear infinite; }
.hero-globe-stage .photo-globe::before { content: ''; position: absolute; inset: 0; z-index: 1; border-radius: 50%; background: radial-gradient(circle at 30% 25%, rgba(255, 230, 166, .14), transparent 25%); pointer-events: none; }
.hero-globe-stage .photo-globe::after { content: ''; position: absolute; inset: -2px; z-index: 3; border-radius: 50%; border: 1px solid rgba(255, 213, 116, .45); box-shadow: 0 0 20px rgba(255, 190, 60, .25); pointer-events: none; }
.hero-globe-stage .photo-clouds { position: absolute; z-index: 2; inset: 0; border-radius: 50%; background-image: url(${cloudTexture}); background-position: 93% center; background-size: auto 100%; background-repeat: repeat-x; mix-blend-mode: screen; opacity: .12; animation: hero-globe-drift 42s linear infinite reverse; }
.hero-globe-stage .globe-canvas { position: absolute; inset: 0; z-index: 2; width: 100%; height: 100%; opacity: .18; mix-blend-mode: screen; }
@keyframes hero-globe-drift { from { background-position: 93% center; } to { background-position: -7% center; } }
.hero-orbit { position: absolute; z-index: 3; width: 98%; aspect-ratio: 1.3; top: 7%; left: 1%; border: 1.5px dashed rgba(255, 176, 1, .5); border-radius: 50%; animation: hero-spin 26s linear infinite; pointer-events: none; }
.hero-orbit i { position: absolute; width: 10px; height: 10px; border-radius: 50%; background: #ffb001; box-shadow: 0 0 12px #ffb001, 0 0 0 4px rgba(255, 176, 1, .15); }
.hero-orbit i:nth-child(1) { top: 6%; left: 18%; }
.hero-orbit i:nth-child(2) { top: 42%; right: -4px; background: #2e7d4f; box-shadow: 0 0 12px #2e7d4f, 0 0 0 4px rgba(46, 125, 79, .15); }
.hero-orbit i:nth-child(3) { bottom: 8%; left: 30%; background: #7fc297; box-shadow: 0 0 12px #7fc297, 0 0 0 4px rgba(127, 194, 151, .15); }
@keyframes hero-spin { to { transform: rotate(352deg); } }
.rating-badge { position: absolute; z-index: 4; top: 66px; left: 16px; display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; border: 1px solid rgba(255,255,255,.5); border-radius: 999px; background: rgba(255,255,255,.93); color: #1b2436; font-size: 12.5px; font-weight: 800; box-shadow: 0 16px 38px rgba(5, 10, 30, .4); backdrop-filter: blur(10px); animation: g-float 6s ease-in-out infinite; }
.rating-badge b { color: #e09100; font-size: 14px; }
.room-signal { position: absolute; z-index: 4; display: inline-flex; align-items: center; gap: 9px; padding: 7px 14px 7px 7px; border: 1px solid rgba(255,255,255,.5); border-radius: 999px; background: rgba(255,255,255,.93); color: #1b2436; font-size: 11.5px; font-weight: 800; white-space: nowrap; box-shadow: 0 14px 34px rgba(5, 10, 30, .4); backdrop-filter: blur(10px); animation: g-float 6s ease-in-out infinite; }
.room-signal .sig-ico { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; color: #fff; }
.room-signal .sig-ico svg { width: 15px; height: 15px; }
.room-signal.find { top: 44%; right: 12px; }
.room-signal.find .sig-ico { background: linear-gradient(135deg, #215432, #2e7d4f); box-shadow: 0 6px 16px rgba(33, 84, 50, .45); }
.room-signal.home { top: 36%; left: 10px; animation-delay: -2s; }
.room-signal.home .sig-ico { background: linear-gradient(135deg, #ffb001, #e09100); box-shadow: 0 6px 16px rgba(255, 176, 1, .45); }
.room-signal.key { bottom: 98px; left: 16px; animation-delay: -4s; }
.room-signal.key .sig-ico { background: linear-gradient(135deg, #ffc94d, #e09100); box-shadow: 0 6px 16px rgba(255, 176, 1, .45); }
.room-signal.family { top: 22%; right: 14px; animation-delay: -1s; }
.room-signal.family .sig-ico { background: linear-gradient(135deg, #2e7d4f, #4ca36a); box-shadow: 0 6px 16px rgba(46, 125, 79, .45); }
.room-signal.villa { bottom: 110px; right: 16px; animation-delay: -5s; }
.room-signal.villa .sig-ico { background: linear-gradient(135deg, #3a9a5c, #4fb070); box-shadow: 0 6px 16px rgba(58, 154, 92, .45); }
.hero-globe-foot { position: relative; z-index: 3; display: flex; align-items: center; gap: 10px; padding: 14px 6px 0; color: #4a5a78; font-size: 12px; font-weight: 600; }
.hero-globe-foot .avatars { display: flex; }
.hero-globe-foot .avatars span { display: grid; place-items: center; width: 26px; height: 26px; margin-left: -7px; border: 2px solid #fff; border-radius: 50%; color: #fff; font-size: 8px; font-weight: 800; box-shadow: 0 4px 10px rgba(27, 36, 54, .18); }
.hero-globe-foot .avatars span:first-child { margin-left: 0; }
.hero-globe-foot .go { margin-left: auto; color: #ffb001; font-size: 16px; }
@keyframes g-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

.landing-section { position: relative; z-index: 2; padding: 30px clamp(22px, 5vw, 64px) 80px; }
.landing-section-head { text-align: center; max-width: 620px; margin: 0 auto 48px; }
.landing-section-head .kicker { display: inline-flex; align-items: center; gap: 7px; margin-bottom: 14px; padding: 7px 12px; border-radius: 999px; background: rgba(255, 176, 1, .14); color: #b57a00; font-size: 11px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase; }
.landing-section-head h2 { margin: 0; font-size: clamp(30px, 4vw, 46px); font-weight: 800; letter-spacing: -2px; }
.landing-section-head p { margin: 14px auto 0; color: #6b7a93; font-size: 15px; line-height: 1.6; }
.landing-features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.landing-feature { padding: 28px; border: 1px solid #e6ecf5; border-radius: 20px; background: rgba(255,255,255,.78); box-shadow: 0 10px 30px rgba(27, 36, 54, .05); transition: transform .2s, box-shadow .2s; }
.landing-feature:hover { transform: translateY(-4px); box-shadow: 0 20px 44px rgba(27, 36, 54, .1); }
.landing-feature .feature-ico { display: grid; place-items: center; width: 46px; height: 46px; margin-bottom: 18px; border-radius: 14px; color: #fff; font-size: 20px; }
.landing-feature h3 { margin: 0 0 8px; font-size: 17px; font-weight: 700; }
.landing-feature p { margin: 0; color: #6b7a93; font-size: 13.5px; line-height: 1.6; }

.landing-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-top: 70px; padding: 36px 40px; border: 1px solid #e6ecf5; border-radius: 22px; background: linear-gradient(120deg, #eef5f0, #fbf4e2); }
.landing-stat { text-align: center; }
.landing-stat .num { font-size: 34px; font-weight: 800; letter-spacing: -1px; color: #215432; }
.landing-stat .lbl { margin-top: 4px; color: #6b7a93; font-size: 12px; font-weight: 600; }

.dest-section { position: relative; z-index: 2; padding: 10px clamp(22px, 5vw, 64px) 70px; }
.dest-inner { max-width: 1200px; margin: 0 auto; }
.dest-head { margin-bottom: 24px; }
.dest-head h2 { margin: 0; font-size: clamp(26px, 3.4vw, 38px); font-weight: 800; letter-spacing: -1.8px; }
.dest-head p { margin: 8px 0 0; color: #6b7a93; font-size: 14px; }
.dest-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }
.dest-card { position: relative; min-height: 300px; padding: 0; border: 0; border-radius: 20px; overflow: hidden; cursor: pointer; text-align: left; font: inherit; color: #fff; background: var(--bg); box-shadow: 0 14px 34px rgba(27, 36, 54, .18); transition: transform .22s, box-shadow .22s; }
.dest-card:hover, .dest-card:focus-visible { transform: translateY(-6px); box-shadow: 0 24px 50px rgba(27, 36, 54, .3); outline: 0; }
.dest-card .motif { position: absolute; top: 16px; right: -4px; font-size: 88px; line-height: 1; opacity: .92; filter: drop-shadow(0 12px 18px rgba(0, 0, 0, .28)); transition: transform .25s; }
.dest-card:hover .motif { transform: scale(1.12) rotate(-4deg); }
.dest-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 28%, rgba(4, 8, 22, .28) 55%, rgba(4, 8, 22, .85) 100%); }
.dest-card .dest-info { position: absolute; z-index: 1; left: 0; right: 0; bottom: 0; padding: 18px; }
.dest-card .dest-info strong { display: block; font-size: 21px; font-weight: 800; letter-spacing: -.4px; }
.dest-card .dest-info small { display: block; margin-top: 3px; color: rgba(255, 255, 255, .85); font-size: 12.5px; font-weight: 600; }
.dest-card .dest-go { display: block; max-height: 0; overflow: hidden; opacity: 0; margin-top: 0; color: #8ad0a8; font-size: 12.5px; font-weight: 800; transition: all .22s; }
.dest-card:hover .dest-go, .dest-card:focus-visible .dest-go { max-height: 30px; opacity: 1; margin-top: 10px; }
.props-section, .why-section, .testi-section, .faq-section { position: relative; z-index: 2; padding: 0 clamp(22px, 5vw, 64px) 70px; }
.props-inner, .why-inner, .testi-inner { max-width: 1200px; margin: 0 auto; }
.faq-inner { max-width: 820px; margin: 0 auto; }
.sec-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 24px; }
.sec-head h2 { margin: 0; font-size: clamp(26px, 3.4vw, 38px); font-weight: 800; letter-spacing: -1.8px; }
.sec-head p { margin: 8px 0 0; color: #6b7a93; font-size: 14px; }
.sec-tag { flex: 0 0 auto; padding: 8px 15px; border-radius: 999px; background: rgba(255, 176, 1, .15); color: #b57a00; font-size: 11px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; }
.props-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.prop-card { overflow: hidden; border: 1px solid #e6ecf5; border-radius: 20px; background: #fff; box-shadow: 0 10px 30px rgba(27, 36, 54, .06); transition: transform .2s, box-shadow .2s; }
.prop-card:hover { transform: translateY(-5px); box-shadow: 0 22px 48px rgba(27, 36, 54, .13); }
.prop-thumb { position: relative; display: grid; place-items: center; height: 168px; background: var(--bg); font-size: 62px; }
.prop-rating { position: absolute; top: 12px; left: 12px; padding: 6px 11px; border-radius: 999px; background: rgba(4, 8, 22, .55); color: #fff; font-size: 12px; font-weight: 800; backdrop-filter: blur(6px); }
.prop-wish { position: absolute; top: 10px; right: 10px; display: grid; place-items: center; width: 34px; height: 34px; border: 0; border-radius: 50%; background: rgba(255, 255, 255, .92); color: #8a97ac; font-size: 16px; cursor: pointer; transition: all .15s; }
.prop-wish.liked { color: #e11d48; transform: scale(1.1); }
.prop-body { padding: 18px; }
.prop-body strong { display: block; font-size: 16px; }
.prop-loc { display: block; margin-top: 3px; color: #7b8aa1; font-size: 12.5px; font-weight: 600; }
.prop-meta { display: flex; align-items: center; justify-content: space-between; margin-top: 14px; padding-top: 14px; border-top: 1px solid #f0f3f8; }
.prop-price b { font-size: 20px; font-weight: 800; letter-spacing: -.5px; }
.prop-price small { display: block; color: #7b8aa1; font-size: 11px; font-weight: 600; }
.prop-book { padding: 10px 20px; border: 0; border-radius: 11px; color: #fff; background: linear-gradient(115deg, #215432, #2e7d4f); font-size: 13px; font-weight: 800; cursor: pointer; box-shadow: 0 8px 18px rgba(33, 84, 50, .35); transition: transform .16s, box-shadow .16s; }
.prop-book:hover { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(33, 84, 50, .45); }
.why-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.why-item { display: flex; gap: 13px; align-items: flex-start; padding: 20px; border: 1px solid #e6ecf5; border-radius: 18px; background: rgba(255, 255, 255, .82); transition: transform .18s, box-shadow .18s; }
.why-item:hover { transform: translateY(-3px); box-shadow: 0 16px 36px rgba(27, 36, 54, .1); }
.why-ico { display: grid; place-items: center; flex: 0 0 auto; width: 44px; height: 44px; border-radius: 13px; color: #fff; }
.why-ico svg { width: 20px; height: 20px; }
.why-item strong { display: block; font-size: 14.5px; }
.why-item small { display: block; margin-top: 4px; color: #6b7a93; font-size: 12.5px; line-height: 1.55; }
.testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.testi-card { padding: 24px; border: 1px solid #e6ecf5; border-radius: 20px; background: #fff; box-shadow: 0 10px 30px rgba(27, 36, 54, .05); transition: transform .2s, box-shadow .2s; }
.testi-card:hover { transform: translateY(-4px); box-shadow: 0 20px 44px rgba(27, 36, 54, .1); }
.testi-stars { color: #ffb001; font-size: 14px; letter-spacing: 3px; }
.testi-card > p { margin: 12px 0 18px; color: #3d4f63; font-size: 14px; line-height: 1.65; }
.testi-who { display: flex; align-items: center; gap: 11px; }
.testi-who .t-avatar { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%; color: #fff; font-size: 11px; font-weight: 800; }
.testi-who strong { display: block; font-size: 13.5px; }
.testi-who small { display: block; margin-top: 1px; color: #7b8aa1; font-size: 11.5px; }
.faq-head { text-align: center; max-width: 560px; margin: 0 auto 28px; }
.faq-head h2 { margin: 0; font-size: clamp(26px, 3.4vw, 38px); font-weight: 800; letter-spacing: -1.8px; }
.faq-head p { margin: 10px 0 0; color: #6b7a93; font-size: 14px; }
.faq-item { margin-bottom: 12px; border: 1px solid #e6ecf5; border-radius: 16px; background: #fff; overflow: hidden; transition: box-shadow .18s, border-color .18s; }
.faq-item.open { border-color: rgba(33, 84, 50, .4); box-shadow: 0 12px 30px rgba(33, 84, 50, .12); }
.faq-q { display: flex; align-items: center; justify-content: space-between; gap: 14px; width: 100%; padding: 18px 20px; border: 0; background: transparent; color: #1b2b20; font: inherit; font-size: 15px; font-weight: 700; text-align: left; cursor: pointer; }
.faq-q .pm { display: grid; place-items: center; flex: 0 0 auto; width: 28px; height: 28px; border-radius: 50%; background: #e8f1ec; color: #215432; font-size: 16px; font-weight: 400; transition: all .2s; }
.faq-item.open .pm { background: #215432; color: #fff; transform: rotate(45deg); }
.faq-a { margin: 0; padding: 0 20px 20px; color: #5b6b85; font-size: 14px; line-height: 1.65; animation: faq-drop .25s ease-out both; }
@keyframes faq-drop { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
.owner-section { position: relative; z-index: 2; padding: 0 clamp(22px, 5vw, 64px) 70px; }
.owner-banner { position: relative; max-width: 1200px; margin: 0 auto; padding: clamp(32px, 5vw, 54px) clamp(22px, 4vw, 52px); overflow: hidden; border-radius: 30px; color: #eef6f1; background: linear-gradient(125deg, #0d2b1a 0%, #215432 55%, #1d693f 135%); box-shadow: 0 34px 80px rgba(9, 44, 28, .35); }
.owner-banner::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 88% 10%, rgba(255, 176, 1, .3), transparent 32%), radial-gradient(circle at 8% 90%, rgba(255, 176, 1, .28), transparent 38%), radial-gradient(circle at 55% 100%, rgba(46, 125, 79, .4), transparent 45%); pointer-events: none; }
.owner-grid { position: relative; z-index: 1; display: grid; grid-template-columns: 1.05fr .95fr; gap: 44px; align-items: center; }
.owner-eyebrow { display: inline-flex; align-items: center; gap: 8px; padding: 8px 15px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,.22); border-radius: 999px; background: rgba(255,255,255,.1); color: #ffb001; font-size: 11px; font-weight: 800; letter-spacing: 1.6px; text-transform: uppercase; backdrop-filter: blur(6px); }
.owner-eyebrow i { width: 7px; height: 7px; border-radius: 50%; background: #ffb001; box-shadow: 0 0 12px #ffb001; }
.owner-banner h2 { margin: 0; font-size: clamp(28px, 3.6vw, 44px); font-weight: 800; letter-spacing: -2px; line-height: 1.08; }
.owner-banner h2 em { font-style: normal; background: linear-gradient(95deg, #ffb001, #7fc297); -webkit-background-clip: text; background-clip: text; color: transparent; }
.owner-sub { margin: 12px 0 0; max-width: 480px; color: rgba(238, 246, 241, .78); font-size: 15px; line-height: 1.6; }
.owner-steps { display: grid; gap: 14px; margin: 26px 0 30px; }
.owner-step { display: flex; gap: 14px; align-items: flex-start; }
.owner-step .n { display: grid; place-items: center; flex: 0 0 auto; width: 34px; height: 34px; border: 1px solid rgba(255,255,255,.25); border-radius: 50%; background: rgba(255,255,255,.1); font-size: 13px; font-weight: 800; }
.owner-step strong { display: block; font-size: 15px; }
.owner-step small { display: block; margin-top: 3px; color: rgba(238, 246, 241, .7); font-size: 13px; line-height: 1.55; }
.owner-cta { display: flex; gap: 12px; flex-wrap: wrap; }
.owner-cta .go { display: inline-flex; align-items: center; padding: 15px 28px; border: 0; border-radius: 13px; background: #fff; color: #14402b; font-size: 15px; font-weight: 800; cursor: pointer; box-shadow: 0 14px 30px rgba(0, 0, 0, .3); text-decoration: none; transition: transform .18s, box-shadow .18s; }
.owner-cta .go:hover { transform: translateY(-2px); box-shadow: 0 18px 38px rgba(0, 0, 0, .38); }
.owner-note { margin: 14px 0 0; color: rgba(238, 246, 241, .68); font-size: 12.5px; font-weight: 600; }
.owner-note b { color: #8ad0a8; }
.owner-stats { display: flex; gap: 26px; margin-top: 30px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, .16); }
.owner-stats b { display: block; font-size: 21px; font-weight: 800; letter-spacing: -.5px; }
.owner-stats small { display: block; margin-top: 2px; color: rgba(238, 246, 241, .68); font-size: 11.5px; font-weight: 600; }
.dash-card { position: relative; padding: 24px; border-radius: 22px; color: #1b2b20; background: rgba(255, 255, 255, .97); box-shadow: 0 24px 60px rgba(5, 14, 10, .45); }
.dash-head { display: flex; align-items: center; justify-content: space-between; }
.dash-live { display: inline-flex; align-items: center; gap: 8px; color: #b57a00; font-size: 11px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase; }
.dash-live i { width: 8px; height: 8px; border-radius: 50%; background: #ffb001; box-shadow: 0 0 10px #ffb001; animation: stay-blink 1.8s ease-in-out infinite; }
.dash-month { padding: 6px 13px; border-radius: 999px; background: #eef3ef; color: #5b6b85; font-size: 12px; font-weight: 700; }
.dash-rev { margin-top: 14px; }
.dash-rev small { display: block; color: #7b8aa1; font-size: 12px; font-weight: 600; }
.dash-rev-row { display: flex; align-items: center; gap: 10px; margin-top: 2px; }
.dash-rev b { font-size: 34px; font-weight: 800; letter-spacing: -1px; }
.dash-up { padding: 5px 11px; border-radius: 999px; background: rgba(255, 176, 1, .18); color: #b57a00; font-size: 12px; font-weight: 800; }
.dash-bars { display: flex; align-items: flex-end; gap: 8px; height: 92px; margin-top: 18px; padding: 14px 14px 10px; border-radius: 14px; background: #f1f6f2; }
.dash-bars i { flex: 1; border-radius: 6px; background: linear-gradient(180deg, #4ca36a, #215432); transform-origin: bottom; animation: dash-grow .7s ease-out both; }
@keyframes dash-grow { from { transform: scaleY(.15); opacity: .3; } }
.dash-occ { display: grid; gap: 8px; margin-top: 16px; font-size: 13px; font-weight: 700; }
.dash-occ span { display: flex; justify-content: space-between; }
.dash-occ span b { color: #1d693f; }
.dash-track { height: 8px; overflow: hidden; border-radius: 999px; background: #e7efe9; }
.dash-track i { display: block; height: 100%; border-radius: 999px; background: linear-gradient(90deg, #ffb001, #215432); }
.dash-rows { display: grid; margin-top: 8px; border-top: 1px solid #f0f3f8; }
.dash-row { display: flex; align-items: center; gap: 11px; padding: 11px 0; border-bottom: 1px solid #f0f3f8; }
.dash-row:last-child { border-bottom: 0; }
.d-avatar { display: grid; place-items: center; flex: 0 0 auto; width: 34px; height: 34px; border-radius: 50%; color: #fff; font-size: 10.5px; font-weight: 800; }
.dash-row strong { display: block; font-size: 13px; }
.dash-row small { display: block; margin-top: 1px; color: #7b8aa1; font-size: 11.5px; }
.d-amt { margin-left: auto; color: #1d693f; font-size: 13.5px; font-weight: 800; }
.dash-toast { position: absolute; top: -19px; right: 20px; display: inline-flex; align-items: center; gap: 8px; padding: 10px 17px; border-radius: 999px; background: #12402a; color: #fff; font-size: 12px; font-weight: 700; box-shadow: 0 16px 34px rgba(5, 14, 10, .5); animation: g-float 5s ease-in-out infinite; white-space: nowrap; }
.dash-toast i { width: 8px; height: 8px; border-radius: 50%; background: #ffb001; box-shadow: 0 0 10px #ffb001; }
.contact-section { position: relative; z-index: 2; padding: 10px clamp(22px, 5vw, 64px) 64px; }
.contact-panel { position: relative; max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.12fr); align-items: stretch; overflow: hidden; border-radius: 28px; border: 1px solid rgba(43, 96, 62, .14); background: #fff; box-shadow: 0 30px 60px -18px rgba(20, 64, 43, .18); }
.contact-hero { position: relative; display: flex; flex-direction: column; justify-content: space-between; gap: 22px; padding: clamp(30px, 4vw, 52px); overflow: hidden; color: #eaf4ee; background: linear-gradient(150deg, #0d2b1a 0%, #14402b 46%, #215432 100%); }
.contact-hero::before { content: ''; position: absolute; right: -70px; top: -70px; width: 270px; height: 270px; border-radius: 50%; background: radial-gradient(circle, rgba(255, 176, 1, .3), transparent 65%); pointer-events: none; }
.contact-hero::after { content: ''; position: absolute; left: -80px; bottom: -100px; width: 320px; height: 320px; border-radius: 50%; background: radial-gradient(circle, rgba(138, 208, 168, .16), transparent 62%); pointer-events: none; }
.contact-eyebrow { position: relative; display: inline-flex; align-items: center; gap: 9px; color: #ffb001; text-transform: uppercase; font-size: 11px; font-weight: 700; letter-spacing: 2.6px; }
.contact-eyebrow::before { content: ''; width: 22px; height: 1.5px; background: #ffb001; }
.contact-eyebrow i { width: 7px; height: 7px; border-radius: 50%; background: #ffb001; animation: contact-pulse 2.2s ease-out infinite; }
.contact-hero h2 { position: relative; margin: 16px 0 0; font-family: 'Playfair Display', Georgia, serif; font-size: clamp(30px, 3.6vw, 42px); font-weight: 500; letter-spacing: -1.6px; line-height: 1.12; color: #fff; }
.contact-hero h2 em { color: #ffb001; font-style: italic; }
.contact-hero > div:first-child > p { position: relative; margin: 16px 0 0; max-width: 36ch; color: #9bc4ac; font-size: 14px; line-height: 1.7; }
.contact-actions { position: relative; display: flex; flex-wrap: wrap; gap: 10px; }
.contact-call { display: inline-flex; align-items: center; gap: 8px; padding: 13px 22px; border-radius: 999px; background: linear-gradient(135deg, #ffb001, #e09100); color: #3a2400; font-size: 13px; font-weight: 800; box-shadow: 0 14px 26px -10px rgba(255, 176, 1, .6); transition: transform .2s, box-shadow .2s; }
.contact-call:hover { transform: translateY(-2px); box-shadow: 0 18px 32px -12px rgba(255, 176, 1, .75); }
.contact-mail { display: inline-flex; align-items: center; gap: 8px; padding: 12px 22px; border-radius: 999px; border: 1px solid rgba(189, 226, 205, .45); color: #d6ecdf; font-size: 13px; font-weight: 700; background: rgba(255, 255, 255, .06); backdrop-filter: blur(4px); transition: transform .2s, border-color .2s, background .2s; }
.contact-mail:hover { transform: translateY(-2px); border-color: rgba(189, 226, 205, .85); background: rgba(255, 255, 255, .12); }
.contact-meta { position: relative; display: flex; flex-wrap: wrap; gap: 16px; color: #7fae91; font-size: 11px; letter-spacing: .35px; }
.contact-meta span { display: inline-flex; align-items: center; gap: 7px; }
.contact-meta span::before { content: '✓'; color: #ffb001; font-weight: 800; }
.contact-cards { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; padding: clamp(22px, 3vw, 40px); background: #f2f6f2; background-image: radial-gradient(rgba(33, 84, 50, .08) 1px, transparent 1.3px); background-size: 18px 18px; }
.contact-card { position: relative; display: flex; flex-direction: column; gap: 10px; padding: 22px 20px 20px; border-radius: 18px; border: 1px solid rgba(44, 96, 64, .12); background: linear-gradient(180deg, rgba(255, 255, 255, .98), rgba(246, 250, 247, .95)); box-shadow: 0 10px 24px -12px rgba(20, 64, 43, .14); transition: transform .25s cubic-bezier(.22, 1, .36, 1), box-shadow .25s, border-color .25s; }
.contact-card:hover { transform: translateY(-5px); border-color: rgba(33, 84, 50, .3); box-shadow: 0 22px 40px -16px rgba(20, 64, 43, .24); }
.contact-card::before { content: ''; position: absolute; left: 50%; top: 0; width: 0; height: 3px; transform: translateX(-50%); border-radius: 0 0 8px 8px; background: linear-gradient(90deg, #ffb001, #e09100); transition: width .3s ease; }
.contact-card:hover::before { width: 68%; }
.contact-card .cc-top { display: flex; align-items: center; }
.contact-card .cc-ico { position: relative; display: grid; place-items: center; width: 46px; height: 46px; border-radius: 14px; color: #fff; font-size: 20px; background: linear-gradient(140deg, #215432, #2e7d4f); box-shadow: 0 10px 20px -6px rgba(33, 84, 50, .42); }
.contact-card:nth-child(2) .cc-ico, .contact-card:nth-child(4) .cc-ico { background: linear-gradient(140deg, #ffb001, #e09100); box-shadow: 0 10px 20px -6px rgba(255, 176, 1, .5); }
.contact-card .cc-ico span { filter: drop-shadow(0 1px 2px rgba(0, 0, 0, .2)); }
.contact-card .cc-arrow { margin-left: auto; color: #9fb3ab; font-size: 15px; opacity: 0; transform: translate(-4px, 4px); transition: .25s; }
.contact-card:hover .cc-arrow { opacity: 1; transform: translate(0, 0); color: #215432; }
.contact-card strong { display: block; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #1d693f; }
.contact-card:nth-child(2) strong, .contact-card:nth-child(4) strong { color: #b57a00; }
.contact-card .cc-value { display: block; margin-top: 2px; color: #39485c; font-size: 13px; line-height: 1.6; }
.contact-card a { color: #1d693f; font-weight: 800; text-decoration: none; word-break: break-word; }
.contact-card a:hover { text-decoration: underline; }
@keyframes contact-pulse { 0% { box-shadow: 0 0 0 0 rgba(255, 176, 1, .6); } 70% { box-shadow: 0 0 0 9px rgba(255, 176, 1, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 176, 1, 0); } }

.landing-footer { position: relative; z-index: 2; display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 30px clamp(22px, 5vw, 64px) 40px; border-top: 1px solid #e7ecf4; color: #8a97ac; font-size: 12px; }
.landing-footer .foot-brand { display: flex; align-items: center; gap: 9px; color: #5b6b85; font-weight: 700; }
.landing-footer a { color: inherit; text-decoration: none; }
.landing-footer a:hover { color: #1b2436; }
.landing-footer .foot-links { display: flex; gap: 22px; }

.stay-search { position: relative; z-index: 2; padding: 10px clamp(22px, 5vw, 64px) 40px; }
.stay-banner { position: relative; max-width: 1200px; margin: 0 auto; padding: clamp(34px, 5vw, 56px) clamp(22px, 4vw, 52px) clamp(30px, 4vw, 44px); border-radius: 30px; overflow: hidden; color: #eef6f1; background: linear-gradient(125deg, #0d2b1a 0%, #1d4a2e 45%, #0f4029 68%, #0a2e1b 115%); box-shadow: 0 34px 80px rgba(9, 44, 28, .35); }
.stay-banner::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 12% 18%, rgba(255, 176, 1, .38), transparent 34%), radial-gradient(circle at 88% 12%, rgba(255, 176, 1, .32), transparent 30%), radial-gradient(circle at 78% 88%, rgba(76, 163, 106, .4), transparent 42%), radial-gradient(circle at 20% 90%, rgba(64, 141, 92, .35), transparent 36%); pointer-events: none; }
.stay-banner::after { content: ''; position: absolute; inset: 0; opacity: .5; background-image: radial-gradient(rgba(255,255,255,.22) 1.2px, transparent 1.2px); background-size: 26px 26px; mask-image: linear-gradient(115deg, black 20%, transparent 65%); pointer-events: none; }
.stay-banner-inner { position: relative; z-index: 1; }
.stay-eyebrow { display: inline-flex; align-items: center; gap: 8px; padding: 8px 15px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,.22); border-radius: 999px; background: rgba(255,255,255,.1); color: #ffe39a; font-size: 11px; font-weight: 800; letter-spacing: 1.6px; text-transform: uppercase; backdrop-filter: blur(6px); }
.stay-eyebrow i { width: 7px; height: 7px; border-radius: 50%; background: #ffb001; box-shadow: 0 0 12px #ffb001; animation: stay-blink 1.8s ease-in-out infinite; }
.stay-banner h2 { margin: 0; font-size: clamp(30px, 4vw, 48px); font-weight: 800; letter-spacing: -2px; line-height: 1.05; }
.stay-banner h2 em { font-style: normal; background: linear-gradient(95deg, #8ad0a8, #ffb001 60%, #ffd46e); -webkit-background-clip: text; background-clip: text; color: transparent; }
.stay-banner > .stay-banner-inner > p { margin: 12px 0 26px; max-width: 560px; color: rgba(238, 246, 241, .78); font-size: 15px; line-height: 1.6; }
.stay-search-card { padding: 14px; border-radius: 22px; background: rgba(255,255,255,.96); box-shadow: 0 22px 55px rgba(5, 8, 28, .45); }
.stay-search-bar { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1.4fr auto; gap: 10px; }
.stay-field { position: relative; display: flex; flex-direction: column; justify-content: center; gap: 3px; min-height: 68px; padding: 9px 14px 9px 46px; border: 1.5px solid transparent; border-radius: 15px; background: #f2f5fa; text-align: left; transition: border .18s, box-shadow .18s, background .18s, transform .18s; }
.stay-field:hover { background: #eceff7; }
button.stay-field { cursor: pointer; font: inherit; color: inherit; }
.stay-field:focus-within, button.stay-field.open { border-color: #215432; background: #fff; box-shadow: 0 0 0 4px rgba(33, 84, 50, .14); outline: 0; }
.stay-field .ico { position: absolute; left: 14px; top: 50%; display: grid; place-items: center; width: 24px; height: 24px; transform: translateY(-50%); color: #215432; }
.stay-field .ico svg { width: 19px; height: 19px; }
.stay-field small { color: #8a97ac; font-size: 9.5px; font-weight: 800; letter-spacing: 1.3px; text-transform: uppercase; }
.stay-field input { width: 100%; border: 0; outline: 0; background: transparent; color: #1b2436; font: inherit; font-size: 15px; font-weight: 700; }
.stay-field input::placeholder { color: #a5b1c4; font-weight: 500; }
.stay-field input[type="date"] { font-size: 13.5px; }
.stay-field .stay-value { color: #1b2436; font-size: 14.5px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.stay-search-btn { display: flex; align-items: center; justify-content: center; gap: 9px; min-height: 68px; padding: 0 32px; border: 0; border-radius: 15px; color: #fff; background: linear-gradient(115deg, #215432, #2e7d4f 55%, #ffb001 130%); font-size: 16px; font-weight: 800; box-shadow: 0 14px 30px rgba(33, 84, 50, .42); transition: transform .18s, box-shadow .18s, filter .18s; }
.stay-search-btn:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 18px 38px rgba(33, 84, 50, .5); filter: saturate(1.1); }
.stay-search-btn:active { transform: translateY(0) scale(1); }
.stay-search-btn svg { width: 18px; height: 18px; }
.stay-card-foot { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-top: 14px; }
.stay-filters { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.stay-check { display: flex; align-items: center; gap: 9px; padding: 9px 15px; border: 1.5px solid #e3e9f4; border-radius: 999px; background: #fff; cursor: pointer; user-select: none; color: #5b6b85; font-size: 12.5px; font-weight: 700; transition: all .16s; }
.stay-check:hover { border-color: #bcd0bf; }
.stay-check.on { border-color: #215432; background: #e8f1ec; color: #14452c; box-shadow: 0 4px 14px rgba(33, 84, 50, .18); }
.stay-check input { position: absolute; opacity: 0; }
.stay-check .box { display: grid; place-items: center; width: 18px; height: 18px; border: 1.5px solid #c3cfe0; border-radius: 6px; background: #fff; color: transparent; font-size: 11px; font-weight: 800; transition: all .15s; }
.stay-check.on .box { border-color: #215432; background: #215432; color: #fff; }
.stay-check input:focus-visible + .box { box-shadow: 0 0 0 3px rgba(33, 84, 50, .2); }
.stay-quick { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.stay-quick span { color: #5b6b85; font-size: 12.5px; font-weight: 600; }
.stay-quick button { padding: 9px 16px; border: 1.5px dashed #c9d3e5; border-radius: 999px; background: transparent; color: #3b4a63; font-size: 12.5px; font-weight: 700; transition: all .16s; }
.stay-quick button:hover { border-style: solid; border-color: #215432; color: #215432; background: #eef6f1; transform: translateY(-1px); }
.stay-guests-pop { position: absolute; top: calc(100% + 10px); right: 0; z-index: 10; width: 320px; padding: 8px 20px 16px; border: 1px solid #e4eaf4; border-radius: 16px; background: #fff; box-shadow: 0 24px 60px rgba(27, 36, 54, .18); }
.stay-guests-pop::before { content: ''; position: absolute; top: -7px; right: 48px; width: 12px; height: 12px; border-top: 1px solid #e4eaf4; border-left: 1px solid #e4eaf4; background: #fff; transform: rotate(45deg); }
.stay-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 0; border-bottom: 1px solid #f0f3f8; }
.stay-row > div strong { display: block; font-size: 14px; }
.stay-row > div small { display: block; margin-top: 2px; color: #8a97ac; font-size: 11.5px; }
.stay-stepper { display: flex; align-items: center; gap: 12px; }
.stay-stepper button { display: grid; place-items: center; width: 32px; height: 32px; border: 1px solid #dbe3f0; border-radius: 10px; background: #f4f6fb; color: #3b4a63; font-size: 17px; font-weight: 700; line-height: 1; transition: all .15s; }
.stay-stepper button:hover:not(:disabled) { border-color: #215432; color: #215432; background: #e8f1ec; }
.stay-stepper button:disabled { opacity: .35; cursor: not-allowed; }
.stay-stepper span { min-width: 18px; text-align: center; font-size: 15px; font-weight: 700; }
.stay-done { display: block; width: 100%; margin-top: 12px; padding: 0; border: 0; background: transparent; color: #215432; font-size: 13px; font-weight: 700; text-align: right; }
.stay-done:hover { text-decoration: underline; }
.stay-result { display: flex; align-items: center; gap: 10px; margin: 14px 0 0; padding: 13px 18px; border: 0; border-radius: 14px; background: linear-gradient(100deg, rgba(255, 176, 1, .22), rgba(33, 84, 50, .16)); color: #14402b; font-size: 13.5px; font-weight: 700; animation: stay-pop .35s ease-out both; }
.stay-result::before { content: '✓'; display: grid; place-items: center; flex: 0 0 auto; width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg, #ffb001, #e09100); color: #fff; font-size: 13px; font-weight: 800; }
@keyframes stay-blink { 0%, 100% { opacity: 1; } 50% { opacity: .35; } }
@keyframes stay-pop { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes landing-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
@keyframes landing-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }

@media (max-width: 900px) {
  .stay-search-bar { grid-template-columns: 1fr 1fr; }
  .stay-search-btn { grid-column: 1 / -1; }
  .stay-guests-pop { right: auto; left: 0; }
  .stay-guests-pop::before { right: auto; left: 48px; }
  .landing-hero { grid-template-columns: 1fr; text-align: center; padding-top: 20px; }
  .landing-hero-copy { max-width: 100%; }
  .landing-hero p.lead { margin-left: auto; margin-right: auto; }
  .landing-cta, .landing-hero .hero-trust { justify-content: center; }
  .hero-mini-stats { justify-content: center; margin-left: auto; margin-right: auto; max-width: 420px; }
  .landing-hero-visual { width: 100%; max-width: 480px; margin: 10px auto 0; }
  .hero-globe-stage { height: 360px; }
  .rating-badge { top: 60px; left: 12px; }
  .landing-features { grid-template-columns: 1fr; }
  .dest-grid { grid-template-columns: repeat(3, 1fr); }
  .props-grid { grid-template-columns: repeat(2, 1fr); }
  .owner-grid { grid-template-columns: 1fr; gap: 30px; }
  .why-grid { grid-template-columns: repeat(2, 1fr); }
  .testi-grid { grid-template-columns: 1fr; }
  .contact-cards { grid-template-columns: 1fr 1fr; }
  .landing-stats { grid-template-columns: repeat(2, 1fr); }
  .landing-nav-links { display: none; }
}
@media (max-width: 520px) {
  .stay-search-bar { grid-template-columns: 1fr; }
  .stay-banner { border-radius: 22px; }
  .stay-search-card { padding: 10px; }
  .stay-card-foot { flex-direction: column; align-items: stretch; }
  .props-grid { grid-template-columns: 1fr; }
  .why-grid { grid-template-columns: 1fr; }
  .contact-panel { grid-template-columns: 1fr; }
  .contact-cards { grid-template-columns: 1fr; }
  .sec-head { flex-direction: column; align-items: flex-start; }
  .dest-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .dest-card { min-height: 230px; }
  .dest-card .motif { font-size: 64px; }
  .landing-login .ghost { display: none; }
  .landing-hero h1 { font-size: 40px; letter-spacing: -2px; }
  .landing-cta { flex-direction: column; }
  .landing-cta .start, .landing-cta .alt { width: 100%; justify-content: center; }
  .landing-stats { grid-template-columns: 1fr; }
  .landing-footer { flex-direction: column; text-align: center; }
}

/* Visual refinement layer ------------------------------------------------- */
html { scroll-behavior: smooth; }
.landing { isolation: isolate; background: #f7f9fd; }
.landing::before { position: absolute; background: linear-gradient(180deg, #f8fbf9 0, #f4f8f4 16%, #fbfcf7 44%, #f7faf7 72%, #f4f8f4 100%); }
.landing::after { pointer-events: none; opacity: .72; background-image: radial-gradient(circle at 8% 7%, rgba(33, 84, 50, .13), transparent 23%), radial-gradient(circle at 94% 23%, rgba(255, 176, 1, .14), transparent 23%), radial-gradient(circle at 45% 63%, rgba(46, 125, 79, .08), transparent 29%); }

.landing-nav { position: sticky; top: 0; z-index: 20; max-width: 1360px; margin: 0 auto; padding: 16px clamp(22px, 5vw, 64px); }
.landing-nav::before { content: ''; position: absolute; inset: 8px clamp(12px, 3vw, 38px); z-index: -1; border: 1px solid rgba(219, 227, 240, .75); border-radius: 18px; background: rgba(255, 255, 255, .76); box-shadow: 0 9px 30px rgba(34, 51, 84, .07); backdrop-filter: blur(16px); }
.landing-brand { padding-left: 10px; font-size: clamp(13px, 1.6vw, 17px); white-space: nowrap; }
.landing-nav-links { gap: 8px; padding: 5px; border: 1px solid rgba(222, 228, 240, .78); border-radius: 12px; background: rgba(244, 247, 252, .72); }
.landing-nav-links a { padding: 8px 11px; border-radius: 8px; transition: color .18s, background .18s; }
.landing-nav-links a:hover { background: #fff; color: #1d693f; box-shadow: 0 3px 9px rgba(43, 59, 88, .08); }
.landing-login { padding-right: 5px; }
.landing-login .primary { border-radius: 11px; background: linear-gradient(120deg, #1d4a2e, #14402b); }

.landing-hero { max-width: 1320px; min-height: 670px; margin: 0 auto; padding-top: clamp(54px, 7vw, 88px); padding-bottom: 76px; gap: clamp(24px, 4vw, 64px); }
.landing-hero-copy { position: relative; z-index: 1; }
.landing-badge { box-shadow: 0 8px 20px rgba(33, 84, 50, .08); }
.landing-hero h1 { max-width: 640px; font-size: clamp(46px, 5.55vw, 78px); }
.landing-hero p.lead { max-width: 540px; font-size: 17.5px; }
.landing-cta .start { position: relative; overflow: hidden; background: linear-gradient(120deg, #1d4a2e, #14402b); }
.landing-cta .start::after { content: '\2192'; margin-left: 3px; font-size: 19px; line-height: 0; transition: transform .18s; }
.landing-cta .start:hover::after { transform: translateX(3px); }
.hero-mini-stats { max-width: 490px; border-top-color: rgba(216, 224, 238, .9); }
.hero-mini-stats strong { color: #28344d; }
.landing-hero-visual { filter: drop-shadow(0 22px 30px rgba(40, 62, 104, .09)); }
.hero-globe-panel { width: min(100%, 610px); }
.hero-globe-panel::before { inset: -12% -16%; opacity: .9; }.hero-globe-stage { height: 545px; }
.hero-globe-top { padding: 0 16px; }
.hero-globe-foot { margin: 0 12px; padding-top: 13px; border-top: 1px solid rgba(219, 227, 240, .72); }

.stay-search { padding-top: 0; padding-bottom: 92px; }
.stay-banner { border: 1px solid rgba(255, 255, 255, .32); border-radius: 32px; box-shadow: 0 32px 80px rgba(31, 49, 101, .28); }
.stay-banner::after { opacity: .36; }
.stay-search-card { border: 1px solid rgba(255, 255, 255, .65); }
.stay-field { border-radius: 13px; }
.stay-search-btn { border-radius: 13px; }
.stay-card-foot { padding: 2px 3px 0; }

.dest-section, .props-section, .why-section, .testi-section, .faq-section, .owner-section { padding-bottom: 96px; }
.dest-head, .sec-head { margin-bottom: 28px; }
.dest-head h2, .sec-head h2, .faq-head h2 { color: #202b43; }
.dest-head p, .sec-head p, .faq-head p { font-size: 14.5px; }
.dest-grid { gap: 18px; }
.dest-card { min-height: 320px; border: 1px solid rgba(255, 255, 255, .4); box-shadow: 0 16px 34px rgba(38, 51, 78, .16); }
.dest-card::before { content: ''; position: absolute; z-index: 1; top: 15px; left: 15px; width: 34px; height: 34px; border: 1px solid rgba(255,255,255,.38); border-radius: 50%; background: rgba(255,255,255,.16); backdrop-filter: blur(5px); }
.dest-card::after { background: linear-gradient(180deg, rgba(4, 8, 22, .03) 24%, rgba(4, 8, 22, .28) 56%, rgba(4, 8, 22, .9) 100%); }
.dest-card .dest-info { padding: 20px; }
.dest-card .dest-info strong { font-size: 22px; }

.props-grid { gap: 18px; }
.prop-card { border-color: rgba(221, 228, 240, .9); box-shadow: 0 12px 28px rgba(31, 46, 77, .07); }
.prop-thumb { height: 184px; }
.prop-thumb::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(145deg, rgba(255,255,255,.18), transparent 42%, rgba(4,8,22,.22)); }
.prop-thumb > span:first-child { position: relative; z-index: 1; filter: drop-shadow(0 14px 10px rgba(0, 0, 0, .23)); transform: translateY(3px); }
.prop-rating, .prop-wish { z-index: 2; }
.prop-body { padding: 19px; }
.prop-book { border-radius: 10px; }

.why-item, .landing-feature, .testi-card { border-color: rgba(221, 228, 240, .88); background: rgba(255, 255, 255, .9); }
.why-item { min-height: 125px; }
.why-ico { box-shadow: 0 8px 18px rgba(39, 55, 100, .16); }
.landing-section { padding-bottom: 100px; }
.landing-section-head { margin-bottom: 34px; }
.landing-features { max-width: 1200px; margin-right: auto; margin-left: auto; }
.landing-feature { position: relative; overflow: hidden; padding: 30px; }
.landing-feature::after { content: ''; position: absolute; right: -32px; bottom: -38px; width: 120px; height: 120px; border-radius: 50%; background: radial-gradient(circle, rgba(33, 84, 50, .09), transparent 68%); pointer-events: none; }
.landing-feature:nth-child(2)::after { background: radial-gradient(circle, rgba(255, 176, 1, .12), transparent 68%); }
.landing-feature:nth-child(3)::after { background: radial-gradient(circle, rgba(46, 125, 79, .12), transparent 68%); }
.landing-stats { max-width: 1200px; margin-right: auto; margin-left: auto; border: 1px solid rgba(218, 225, 239, .94); box-shadow: 0 16px 38px rgba(31, 46, 77, .06); }

.testi-card { position: relative; padding: 26px; }
.testi-card::before { content: '\201C'; position: absolute; top: 10px; right: 18px; color: #ece9ff; font-family: Georgia, serif; font-size: 68px; line-height: 1; }
.testi-card > p, .testi-who { position: relative; }
.faq-inner { max-width: 880px; }
.faq-item { border-color: rgba(221, 228, 240, .96); box-shadow: 0 6px 18px rgba(31, 46, 77, .035); }
.faq-q { padding: 20px 22px; }

.owner-banner { border: 1px solid rgba(255, 255, 255, .16); border-radius: 32px; }
.owner-banner::after { content: ''; position: absolute; right: -8%; bottom: -50%; width: 48%; aspect-ratio: 1; border: 1px solid rgba(255, 176, 1, .25); border-radius: 50%; box-shadow: 0 0 0 42px rgba(255, 176, 1, .05), 0 0 0 84px rgba(255, 176, 1, .04); pointer-events: none; }
.owner-grid { z-index: 2; }
.dash-card { border: 1px solid rgba(255,255,255,.72); }
.dash-bars { background: linear-gradient(135deg, #f2f7f3, #fbf6e8); }
.dash-toast { z-index: 2; }
.landing-footer { position: relative; display: grid; grid-template-columns: 1.4fr .85fr 1.05fr; align-items: start; gap: 0 44px; max-width: 1200px; margin: 0 auto; padding: 48px clamp(22px, 5vw, 64px) 44px; border-top: 0; }
.landing-footer::before { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: min(74%, 740px); height: 2px; border-radius: 2px; background: linear-gradient(90deg, transparent, #ffb001, #2e7d4f, #ffb001, transparent); }
.landing-footer .foot-brand { font-size: clamp(13px, 1.5vw, 16px); color: #26334b; white-space: nowrap; }
.foot-summary p { max-width: 300px; margin: 12px 0 0; color: #7b8aa1; font-size: 12.5px; line-height: 1.7; }
.foot-block-title { margin: 2px 0 16px; color: #26334b; font-size: 11px; font-weight: 800; letter-spacing: 1.7px; text-transform: uppercase; }
.foot-social { display: flex; gap: 10px; margin-top: 20px; }
.foot-social a { display: grid; place-items: center; width: 40px; height: 40px; border: 1px solid #e3e9f4; border-radius: 12px; color: #5b6b85; background: #fff; transition: transform .2s, color .2s, border-color .2s, box-shadow .2s; }
.foot-social a svg { width: 17px; height: 17px; }
.foot-social a:hover { transform: translateY(-3px); color: #fff; }
.foot-social a.facebook:hover { background: #1877f2; border-color: #1877f2; box-shadow: 0 12px 22px -8px rgba(24, 119, 242, .55); }
.foot-social a.instagram:hover { background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); border-color: #e1306c; box-shadow: 0 12px 22px -8px rgba(225, 48, 108, .5); }
.foot-social a.whatsapp:hover { background: #25d366; border-color: #25d366; box-shadow: 0 12px 22px -8px rgba(37, 211, 102, .55); }
.foot-social a.linkedin:hover { background: #0a66c2; border-color: #0a66c2; box-shadow: 0 12px 22px -8px rgba(10, 102, 194, .55); }
.landing-footer .foot-links { display: grid; grid-template-columns: 1fr; justify-content: start; gap: 12px; }
.landing-footer .foot-links a { position: relative; padding-left: 13px; font-weight: 700; color: #5b6b85; transition: color .18s, transform .18s; }
.landing-footer .foot-links a::before { content: ''; position: absolute; left: 0; top: 50%; width: 0; height: 1.5px; border-radius: 2px; background: #ffb001; transition: width .2s; }
.landing-footer .foot-links a:hover { color: #215432; transform: translateX(3px); }
.landing-footer .foot-links a:hover::before { width: 9px; }
.foot-contact-list { display: grid; gap: 13px; }
.foot-contact-item { display: flex; align-items: flex-start; gap: 10px; color: #5b6b85; font-size: 12.5px; line-height: 1.6; }
.foot-contact-item svg { flex: 0 0 auto; width: 15px; height: 15px; margin-top: 2px; color: #1d693f; }
.foot-contact-item a { color: inherit; font-weight: 700; }
.foot-contact-item a:hover { color: #215432; }
.foot-bottom { grid-column: 1 / -1; display: flex; justify-content: space-between; gap: 16px; margin-top: 34px; padding-top: 18px; border-top: 1px solid rgba(226, 232, 242, .9); color: #8a97ac; font-size: 11.5px; }

@media (max-width: 900px) {
  .landing-nav { padding-top: 12px; padding-bottom: 12px; }
  .landing-hero { min-height: 0; padding-top: 46px; }
  .hero-globe-stage { height: 410px; }
  .dest-section, .props-section, .why-section, .testi-section, .faq-section, .owner-section { padding-bottom: 74px; }
}
@media (max-width: 520px) {
  .landing-nav::before { inset: 5px 10px; border-radius: 14px; }
  .landing-brand { padding-left: 4px; font-size: 12px; }
  .landing-login { padding-right: 0; }
  .landing-login .primary { padding: 9px 15px; }
  .landing-hero { padding-top: 40px; padding-bottom: 44px; }
  .landing-hero h1 { font-size: clamp(42px, 12vw, 54px); }
  .landing-hero p.lead { font-size: 16px; }
  .hero-globe-stage { height: 325px; }
  .hero-globe-top { padding: 0; }
  .room-signal.family, .room-signal.villa, .room-signal.key { display: none; }
  .rating-badge { top: 52px; left: 0; padding: 8px 12px; font-size: 11px; }
  .room-signal.home { left: 0; top: 41%; }
  .room-signal.find { right: 0; top: 50%; }
  .hero-globe-foot { margin: 0; font-size: 11px; }
  .stay-search { padding-bottom: 72px; }
  .stay-banner { padding: 30px 18px 24px; border-radius: 24px; }
  .stay-banner h2 { font-size: 31px; }
  .dest-section, .props-section, .why-section, .testi-section, .faq-section, .owner-section, .landing-section { padding-bottom: 68px; }
  .dest-card { min-height: 245px; }
  .dest-card::before { width: 27px; height: 27px; top: 12px; left: 12px; }
  .prop-thumb { height: 170px; }
  .owner-banner { border-radius: 25px; }
  .landing-footer { grid-template-columns: 1fr; text-align: center; gap: 30px; }
  .landing-footer .foot-links { justify-content: center; place-items: center; }
  .foot-summary p { margin-right: auto; margin-left: auto; }
  .foot-social { justify-content: center; }
  .foot-contact-list { justify-items: center; }
  .foot-contact-item { justify-content: center; text-align: left; }
  .foot-contact-item svg { margin-top: 3px; }
  .foot-bottom { flex-direction: column; margin-top: 26px; }
}
`

const travelFeatures = [
  { ico: '01', bg: 'linear-gradient(135deg, #215432, #2e7d4f)', title: 'Search with confidence', text: 'Compare verified stays, transparent prices, and the details that matter before you book.' },
  { ico: '02', bg: 'linear-gradient(135deg, #ffb001, #e09100)', title: 'Book in a few taps', text: 'Choose your dates, add your guests, and reserve the right room without any booking noise.' },
  { ico: '03', bg: 'linear-gradient(135deg, #2e7d4f, #3a9a5c)', title: 'Travel with peace of mind', text: 'Flexible stays, secure payments, and friendly human support from search to check-out.' },
]

const travelStats = [
  { num: '2,847', lbl: 'Verified stays' },
  { num: '14,592', lbl: 'Happy guests' },
  { num: '1,023', lbl: 'Rooms open tonight' },
  { num: '4.9/5', lbl: 'Guest rating' },
]

function Stepper({ value, min, max, onChange, label }) {
  return <div className="stay-stepper">
    <button type="button" aria-label={`Decrease ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)}>−</button>
    <span>{value}</span>
    <button type="button" aria-label={`Increase ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)}>+</button>
  </div>
}

function StaySearch({ destination, onDestinationChange }) {
  const setDestination = onDestinationChange
  const [checkIn, setCheckIn] = useState('2026-09-15')
  const [checkOut, setCheckOut] = useState('2026-09-16')
  const [adults, setAdults] = useState(3)
  const [children, setChildren] = useState(0)
  const [rooms, setRooms] = useState(1)
  const [guestsOpen, setGuestsOpen] = useState(false)
  const [freeCancellation, setFreeCancellation] = useState(false)
  const [fourStars, setFourStars] = useState(false)
  const [result, setResult] = useState('')

  const formatDate = (iso) => {
    if (!iso) return 'Add date'
    const [y, m, d] = iso.split('-')
    return `${d}/${m}/${y}`
  }

  const handleSearch = (event) => {
    event.preventDefault()
    setGuestsOpen(false)
    const extras = [freeCancellation && 'free cancellation', fourStars && '4 stars +'].filter(Boolean).join(' · ')
    setResult(`Showing stays in ${destination || 'anywhere'} · ${formatDate(checkIn)} → ${formatDate(checkOut)} · ${adults} adult${adults === 1 ? '' : 's'}${children ? `, ${children} child${children === 1 ? '' : 'ren'}` : ''}, ${rooms} room${rooms === 1 ? '' : 's'}${extras ? ` · ${extras}` : ''}`)
  }

  const trending = ['Kerala', 'Goa', 'Manali', 'Jaipur', 'Bali']

  return <section className="stay-search" id="search-stays" aria-label="Search stays">
    <div className="stay-banner">
      <div className="stay-banner-inner">
        <span className="stay-eyebrow"><i />Handpicked stays</span>
        <h2>Find the right <em>place to stay</em></h2>
        <p>Search destinations, pick your dates, and choose who is coming — we will handle the rest.</p>
        <div className="stay-search-card">
          <form className="stay-search-bar" onSubmit={handleSearch}>
            <label className="stay-field"><span className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg></span><small>Where do you want to go?</small><input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Search destination" /></label>
            <label className="stay-field"><span className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="3" /><path d="M16 2v4M8 2v4M3 10h18" /></svg></span><small>Check in</small><input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} /></label>
            <label className="stay-field"><span className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="3" /><path d="M16 2v4M8 2v4M3 10h18" /></svg></span><small>Check out</small><input type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} /></label>
            <div className="stay-field" style={{ padding: 0, border: 0, background: 'transparent' }}>
              <button type="button" className={`stay-field${guestsOpen ? ' open' : ''}`} style={{ width: '100%', height: '100%' }} aria-expanded={guestsOpen} onClick={() => setGuestsOpen(!guestsOpen)}>
                <span className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg></span>
                <small>Guests and rooms</small>
                <span className="stay-value">{adults} adult{adults === 1 ? '' : 's'}{children ? `, ${children} child${children === 1 ? '' : 'ren'}` : ''}, {rooms} room{rooms === 1 ? '' : 's'}</span>
              </button>
              {guestsOpen && <div className="stay-guests-pop">
                <div className="stay-row"><div><strong>Adults</strong><small>18+ years</small></div><Stepper label="adults" value={adults} min={1} max={10} onChange={setAdults} /></div>
                <div className="stay-row"><div><strong>Children</strong><small>0–17 years</small></div><Stepper label="children" value={children} min={0} max={10} onChange={setChildren} /></div>
                <div className="stay-row" style={{ border: 0 }}><div><strong>Rooms</strong><small>Each room needs at least 1 adult</small></div><Stepper label="rooms" value={rooms} min={1} max={Math.max(1, adults)} onChange={setRooms} /></div>
                <button type="button" className="stay-done" onClick={() => setGuestsOpen(false)}>Done</button>
              </div>}
            </div>
            <button type="submit" className="stay-search-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>Search</button>
          </form>
          <div className="stay-card-foot">
            <div className="stay-filters">
              <label className={`stay-check${freeCancellation ? ' on' : ''}`}><input type="checkbox" checked={freeCancellation} onChange={(e) => setFreeCancellation(e.target.checked)} /><span className="box">✓</span>Free cancellation</label>
              <label className={`stay-check${fourStars ? ' on' : ''}`}><input type="checkbox" checked={fourStars} onChange={(e) => setFourStars(e.target.checked)} /><span className="box">✓</span>4 stars +</label>
            </div>
            <div className="stay-quick"><span>Trending:</span>{trending.map(t => <button key={t} type="button" onClick={() => setDestination(t)}>{t}</button>)}</div>
          </div>
      </div>
        {result && <p className="stay-result">{result}</p>}
      </div>
    </div>
  </section>
}

const destinations = [
  { name: 'Manali', properties: '676 Properties', motif: '🏔️', bg: 'linear-gradient(165deg, #1d4a2e 0%, #2e7d4f 58%, #8ad0a8 135%)' },
  { name: 'Goa', properties: '4010 Properties', motif: '🌴', bg: 'linear-gradient(165deg, #0a2e1b 0%, #215432 60%, #4ca36a 135%)' },
  { name: 'Bangalore', properties: '3162 Properties', motif: '🕌', bg: 'linear-gradient(165deg, #12301f 0%, #2e7d4f 60%, #7fc297 135%)' },
  { name: 'Jaipur', properties: '2061 Properties', motif: '🏰', bg: 'linear-gradient(165deg, #8a3c06 0%, #e09100 55%, #ffd46e 135%)' },
  { name: 'Pattaya', properties: '1329 Properties', motif: '🛕', bg: 'linear-gradient(165deg, #0d3320 0%, #1d693f 60%, #8ad0a8 135%)' },
]

function Destinations({ onSelect }) {
  return <section className="dest-section" id="destinations" aria-label="Popular destinations">
    <div className="dest-inner">
      <div className="dest-head">
        <div><h2>Popular destinations</h2><p>Trending places our guests keep coming back to.</p></div>
      </div>
      <div className="dest-grid">
        {destinations.map(d => (
          <button key={d.name} type="button" className="dest-card" style={{ '--bg': d.bg }} onClick={() => onSelect(d.name)} aria-label={`Search stays in ${d.name}`}>
            <span className="motif" aria-hidden="true">{d.motif}</span>
            <span className="dest-info"><strong>{d.name}</strong><small>{d.properties}</small><span className="dest-go">Explore stays →</span></span>
          </button>
        ))}
      </div>
    </div>
  </section>
}

const featuredStays = [
  { name: 'Palm Cove Resort', loc: 'Goa', rating: '4.8', price: '$120', motif: '🏝️', bg: 'linear-gradient(160deg, #0a2e1b, #2e7d4f)' },
  { name: 'Himalayan Pine Retreat', loc: 'Manali', rating: '4.9', price: '$95', motif: '🏔️', bg: 'linear-gradient(160deg, #1d4a2e, #4ca36a)' },
  { name: 'Pink City Haveli', loc: 'Jaipur', rating: '4.7', price: '$78', motif: '🏰', bg: 'linear-gradient(160deg, #8a3c06, #e09100)' },
  { name: 'Marina Bay Suites', loc: 'Pattaya', rating: '4.6', price: '$110', motif: '🌊', bg: 'linear-gradient(160deg, #0a2e1b, #1d693f)' },
]

function PropCard({ stay, onBook }) {
  const [liked, setLiked] = useState(false)
  return <div className="prop-card">
    <div className="prop-thumb" style={{ '--bg': stay.bg }}>
      <span aria-hidden="true">{stay.motif}</span>
      <span className="prop-rating">★ {stay.rating}</span>
      <button type="button" className={`prop-wish${liked ? ' liked' : ''}`} aria-label={liked ? 'Remove from wishlist' : 'Save to wishlist'} onClick={() => setLiked(!liked)}>{liked ? '♥' : '♡'}</button>
    </div>
    <div className="prop-body">
      <strong>{stay.name}</strong>
      <span className="prop-loc">{stay.loc} · Free cancellation</span>
      <div className="prop-meta">
        <span className="prop-price"><b>{stay.price}</b><small>per night + taxes</small></span>
        <button type="button" className="prop-book" onClick={() => onBook(stay.loc)}>Book</button>
      </div>
    </div>
  </div>
}

function FeaturedStays({ onSelect }) {
  return <section className="props-section" id="stays" aria-label="Featured stays">
    <div className="props-inner">
      <div className="sec-head"><div><h2>Featured stays</h2><p>Handpicked properties with the highest guest love.</p></div><span className="sec-tag">Top rated</span></div>
      <div className="props-grid">
        {featuredStays.map(s => <PropCard key={s.name} stay={s} onBook={onSelect} />)}
      </div>
    </div>
  </section>
}

const whyItems = [
  { title: 'Best price promise', text: 'Find it cheaper elsewhere and we refund double the difference.', bg: 'linear-gradient(135deg, #215432, #2e7d4f)', icon: <><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></> },
  { title: 'Free cancellation', text: 'Plans change. Cancel most stays free of charge before check-in.', bg: 'linear-gradient(135deg, #ffb001, #e09100)', icon: <><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></> },
  { title: '24×7 human support', text: 'Real people on call, day and night, in 8 languages.', bg: 'linear-gradient(135deg, #2e7d4f, #3a9a5c)', icon: <><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.9Z" /></> },
  { title: 'Verified stays only', text: 'Every property is visited and verified by our own crew.', bg: 'linear-gradient(135deg, #215432, #0a2e1b)', icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></> },
]

function WhyRooms() {
  return <section className="why-section" aria-label="Why book with Melone Stay Frontend">
    <div className="why-inner">
      <div className="sec-head"><div><h2>Why book with Melone Stay</h2><p>Booking should feel effortless — so we made it that way.</p></div></div>
      <div className="why-grid">
        {whyItems.map(w => (
          <div className="why-item" key={w.title}>
            <span className="why-ico" style={{ background: w.bg }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{w.icon}</svg></span>
            <span><strong>{w.title}</strong><small>{w.text}</small></span>
          </div>
        ))}
      </div>
    </div>
  </section>
}

const testimonials = [
  { name: 'Aarav Mehta', trip: 'Goa · 4 nights', initials: 'AM', color: '#e7a878', text: 'Booked a beach villa in under two minutes. The price was lower than every other app I checked, and support helped me shift dates for free.' },
  { name: 'Sara Thomas', trip: 'Manali · 6 nights', initials: 'ST', color: '#8eb4a3', text: 'The photos were exactly like the real place — verified stays is a real thing here. Hot breakfast waiting every morning was the cherry on top.' },
  { name: 'Rohan Iyer', trip: 'Jaipur · 3 nights', initials: 'RI', color: '#aa9ac7', text: 'Used the MELONE25 code and saved a neat bundle on a heritage haveli. Checkout took one tap and the invoice was in my inbox instantly.' },
]

function Testimonials() {
  return <section className="testi-section" aria-label="Guest reviews">
    <div className="testi-inner">
      <div className="sec-head"><div><h2>Loved by guests</h2><p>4.9 average across 2 lakh+ verified reviews.</p></div><span className="sec-tag">★ 4.9 rated</span></div>
      <div className="testi-grid">
        {testimonials.map(t => (
          <div className="testi-card" key={t.name}>
            <span className="testi-stars">★★★★★</span>
            <p>"{t.text}"</p>
            <div className="testi-who"><span className="t-avatar" style={{ background: t.color }}>{t.initials}</span><span><strong>{t.name}</strong><small>{t.trip}</small></span></div>
          </div>
        ))}
      </div>
    </div>
  </section>
}

const faqs = [
  { q: 'What types of rooms can I book?', a: 'Private rooms, deluxe rooms, family suites, villas and dorm beds — every room lists its exact size, bed setup and photos, so you know precisely what you are getting.' },
  { q: 'How many guests can stay in one room?', a: 'Each room shows its max occupancy. Standard rooms fit 2–3 guests, family rooms fit 4–6, and an extra mattress can be added to most rooms on request at check-in.' },
  { q: 'What amenities does each room include?', a: 'Free high-speed wifi, air-conditioning, attached bathroom, smart TV, work desk and daily essentials come standard. Premium rooms add bathtubs, balconies and kitchenettes.' },
  { q: 'What time is room check-in and check-out?', a: 'Check-in starts at 12 noon and check-out is by 11 am. Early check-in and late check-out are free whenever the room is vacant — just ask the front desk.' },
  { q: 'Is food available with the room?', a: 'Yes. Most rooms come with complimentary breakfast, and in-room dining runs from 7 am to 11 pm with local and continental menus delivered to your door.' },
  { q: 'Are the rooms cleaned every day?', a: 'Every room is deep-cleaned before your arrival and serviced daily — fresh linen, towels, toiletries and a full wipe-down, all by our trained housekeeping crew.' },
]

function Faq() {
  const [open, setOpen] = useState(0)
  return <section className="faq-section" id="faq" aria-label="Frequently asked questions">
    <div className="faq-inner">
      <div className="faq-head"><h2>Questions, answered</h2><p>Everything about our rooms, before you book one.</p></div>
      {faqs.map((f, i) => (
        <div className={`faq-item${open === i ? ' open' : ''}`} key={f.q}>
          <button type="button" className="faq-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>{f.q}<span className="pm">+</span></button>
          {open === i && <p className="faq-a">{f.a}</p>}
        </div>
      ))}
    </div>
  </section>
}

const contactCards = [
  { ico: '🏢', label: 'Company', value: <>IMCB Solutions LLP</> },
  { ico: '📍', label: 'Visit Us', value: <>Palakkunnummal Building, Near Govt Ayurveda Hospital Emily, Kalpetta, Wayanad, Kerala – 673121</> },
  { ico: '📞', label: 'Call Us', value: <a href="tel:+917593820005">+91 7593820005</a> },
  { ico: '✉️', label: 'Email', value: <a href="mailto:info@imcbs.com">info@imcbs.com</a> },
]

function Contact() {
  return <section className="contact-section" id="contact" aria-label="Contact us">
    <div className="contact-panel">
      <div className="contact-hero">
        <div>
          <span className="contact-eyebrow">Contact us<i /></span>
          <h2>Let's find your <em>home away from home</em></h2>
          <p>Stuck on a booking, ready to host, or have a partner idea in mind? Our team is one message away.</p>
        </div>
        <div className="contact-actions">
          <a className="contact-call" href="tel:+917593820005">Call us now</a>
          <a className="contact-mail" href="mailto:info@imcbs.com">Send an email</a>
        </div>
        <div className="contact-meta"><span>Reply within 24 hours</span><span>Based in Kalpetta, Wayanad</span></div>
      </div>
      <div className="contact-cards">
        {contactCards.map(c => (
          <div className="contact-card" key={c.label}>
            <div className="cc-top"><span className="cc-ico"><span aria-hidden="true">{c.ico}</span></span><span className="cc-arrow">↗</span></div>
            <strong>{c.label}</strong>
            <span className="cc-value">{c.value}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
}

function Owners() {
  const weekBars = [
    { h: 42, d: 0 }, { h: 68, d: .08 }, { h: 52, d: .16 }, { h: 80, d: .24 }, { h: 60, d: .32 }, { h: 94, d: .4 }, { h: 74, d: .48 },
  ]
  const bookings = [
    { initials: 'AR', color: '#e7a878', name: 'Aarav R.', detail: 'Palm Room · Dec 12–15', amt: '+$360' },
    { initials: 'ST', color: '#8eb4a3', name: 'Sara T.', detail: 'Deluxe King · Dec 13–14', amt: '+$240' },
    { initials: 'RI', color: '#aa9ac7', name: 'Rohan I.', detail: 'Suite 204 · Dec 14–16', amt: '+$420' },
  ]

  return <section className="owner-section" id="owners" aria-label="List your property">
    <div className="owner-banner">
      <div className="owner-grid">
        <div>
          <span className="owner-eyebrow"><i />For room & hotel owners</span>
          <h2>Turn empty rooms into <em>monthly earnings</em></h2>
          <p className="owner-sub">List your rooms or hotel on Melone Stay and reach thousands of guests every day — with free listing, verified bookings and on-time payouts.</p>
          <div className="owner-steps">
            <div className="owner-step"><span className="n">1</span><span><strong>List your rooms for free</strong><small>Add photos, prices and amenities in under 10 minutes.</small></span></div>
            <div className="owner-step"><span className="n">2</span><span><strong>Get verified & go live</strong><small>Our crew verifies your property and you start receiving guests.</small></span></div>
            <div className="owner-step"><span className="n">3</span><span><strong>Earn with on-time payouts</strong><small>Secure payments directly to your bank, every single week.</small></span></div>
          </div>
          <div className="owner-cta">
            <a className="go" href="#contact">Get your free demo →</a>
          </div>
          <p className="owner-note">Free 14-day demo · <b>No credit card needed</b> · Cancel anytime</p>
          <div className="owner-stats">
            <div><b>12k+</b><small>Partner properties</small></div>
            <div><b>$4.2M</b><small>Paid to hosts / month</small></div>
            <div><b>4.8★</b><small>Host rating</small></div>
          </div>
        </div>
        <div className="dash-card">
          <span className="dash-toast"><i />New booking · Suite 204 · +$420</span>
          <div className="dash-head"><span className="dash-live"><i />Owner dashboard</span><span className="dash-month">December</span></div>
          <div className="dash-rev"><small>Revenue this month</small><div className="dash-rev-row"><b>$48,200</b><span className="dash-up">+18%</span></div></div>
          <div className="dash-bars" aria-hidden="true">{weekBars.map((b, i) => <i key={i} style={{ height: b.h + '%', animationDelay: b.d + 's' }} />)}</div>
          <div className="dash-occ"><span>Occupancy <b>82%</b></span><span className="dash-track"><i style={{ width: '82%' }} /></span></div>
          <div className="dash-rows">
            {bookings.map(b => (
              <div className="dash-row" key={b.name}>
                <span className="d-avatar" style={{ background: b.color }}>{b.initials}</span>
                <span><strong>{b.name}</strong><small>{b.detail}</small></span>
                <span className="d-amt">{b.amt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
}

function LandingPage({ onLogin }) {
  const [destination, setDestination] = useState('Kerala')

  const selectDestination = (name) => {
    setDestination(name)
    document.querySelector('.stay-search')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return <><style>{styles}</style><div className="landing">
    <nav className="landing-nav">
      <div className="landing-brand"><img src={meloneLogo} alt="Melone Stay" className="landing-logo" /></div>
      <div className="landing-nav-links"><a href="#stays">Stays</a><a href="#destinations">Destinations</a><a href="#owners">Owners</a><a href="#faq">FAQ</a></div>
      <div className="landing-login"><a className="ghost" href="#contact">Contact</a><button className="primary" onClick={onLogin}>Sign in</button></div>
    </nav>

    <header className="landing-hero">
      <div className="landing-hero-copy">
        <span className="landing-badge">Now open · 1,023 rooms live tonight</span>
        <h1>Find your room.<br /><span className="grad">Make it yours.</span></h1>
        <p className="lead">Discover handpicked rooms, hotels, and memorable stays. Clear prices, verified photos, and a smooth booking experience in one place.</p>
        <div className="landing-cta">
          <a className="start" href="#search-stays">Explore stays</a>
          <a className="alt" href="#stays">Browse top rated</a>
        </div>
        <div className="hero-trust">
          <div className="avatars"><span style={{ background: '#e7a878' }}>AC</span><span style={{ background: '#8eb4a3' }}>NJ</span><span style={{ background: '#aa9ac7' }}>MP</span></div>
          Chosen by travellers who value a great stay
        </div>
        <div className="hero-mini-stats">
          <div><strong>2,847</strong><small>Stays live</small></div>
          <div><strong>4.9★</strong><small>Avg. rating</small></div>
          <div><strong>14k+</strong><small>Happy guests</small></div>
        </div>
      </div>
      <div className="landing-hero-visual">
        <div className="hero-globe-panel">
          <div className="hero-globe-top">
            <span className="live-pill"><i />Live now</span>
            <span className="count-pill">2,847 stays open</span>
          </div>
          <div className="hero-globe-stage"><PointGlobe /></div>
          <div className="hero-orbit" aria-hidden="true"><i /><i /><i /></div>
          <span className="rating-badge"><b>★</b> 4.9 · 12k reviews</span>
          <span className="room-signal find"><span className="sig-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M2 17v-7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7" /><path d="M2 17h20M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" /></svg></span>Find your room</span>
          <span className="room-signal home"><span className="sig-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11 12 3l9 8" /><path d="M5 10v10h5v-6h4v6h5V10" /></svg></span>Premium rooms</span>
          <span className="room-signal key"><span className="sig-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="15" r="4" /><path d="m11.2 12.2 8.6-8.6M17 4l3 3M14 7l2.5 2.5" /></svg></span>Private stays</span>
          <span className="room-signal family"><span className="sig-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg></span>Family suites</span>
          <span className="room-signal villa"><span className="sig-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 1 10 10H2A10 10 0 0 1 12 2Z" /><path d="M12 2v20" /></svg></span>Beach villas</span>
          <div className="hero-globe-foot">
            <span className="avatars"><span style={{ background: '#e7a878' }}>AC</span><span style={{ background: '#8eb4a3' }}>NJ</span><span style={{ background: '#aa9ac7' }}>MP</span></span>
            12,481 rooms are open tonight <span className="go">↗</span>
          </div>
        </div>
      </div>
    </header>

    <StaySearch destination={destination} onDestinationChange={setDestination} />

    <Destinations onSelect={selectDestination} />

    <FeaturedStays onSelect={selectDestination} />

    <WhyRooms />

    <section className="landing-section" id="features">
      <div className="landing-section-head">
        <span className="kicker">Features</span>
        <h2>Everything your room needs</h2>
        <p>Everything you need to book a stay that feels exactly right.</p>
      </div>
      <div className="landing-features">
        {travelFeatures.map(f => (
          <div className="landing-feature" key={f.title}>
            <div className="feature-ico" style={{ background: f.bg }}>{f.ico}</div>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </div>
      <div className="landing-stats">
        {travelStats.map(s => (
          <div className="landing-stat" key={s.lbl}><div className="num">{s.num}</div><div className="lbl">{s.lbl}</div></div>
        ))}
      </div>
    </section>

    <Testimonials />

    <Owners />

    <Faq />

    <Contact />

    <footer className="landing-footer">
      <div className="foot-summary">
        <div className="foot-brand"><img src={meloneLogo} alt="Melone Stay" className="landing-logo foot-logo" /></div>
        <p>More than a booking: a better way to find the stay you will remember. Born in Kalpetta, made for the world.</p>
        <div className="foot-social">
          <a className="facebook" href="https://www.facebook.com/share/1DfiXbUPUW/?mibextid=wwXIfr" target="_blank" rel="noreferrer" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg></a>
          <a className="instagram" href="https://www.instagram.com/imcbusinesssolution?igsh=NnA3cTJuaXRwOWFx&utm_source=qr" target="_blank" rel="noreferrer" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" /></svg></a>
          <a className="whatsapp" href="https://api.whatsapp.com/send/?phone=917593820005&text&type=phone_number&app_absent=0" target="_blank" rel="noreferrer" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg></a>
          <a className="linkedin" href="https://www.linkedin.com/company/imc-business-solution" target="_blank" rel="noreferrer" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" /></svg></a>
        </div>
      </div>
      <div className="foot-links">
        <div className="foot-block-title">Explore</div>
        <a href="#stays">Featured stays</a>
        <a href="#destinations">Destinations</a>
        <a href="#owners">List your property</a>
        <a href="#faq">Help centre</a>
        <a href="#contact">Contact us</a>
      </div>
      <div className="foot-contact">
        <div className="foot-block-title">Reach us</div>
        <div className="foot-contact-list">
          <div className="foot-contact-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg><span>Palakkunnummal Building, Kalpetta, Wayanad, Kerala – 673121</span></div>
          <div className="foot-contact-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg><a href="tel:+917593820005">+91 7593820005</a></div>
          <div className="foot-contact-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></svg><a href="mailto:info@imcbs.com">info@imcbs.com</a></div>
        </div>
      </div>
      <div className="foot-bottom"><span>© 2026 IMCB Solutions LLP · Melone Stay</span><span>Made for better stays.</span></div>
    </footer>
  </div></>
}

export default LandingPage
