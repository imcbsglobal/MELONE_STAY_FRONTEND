import { useEffect, useState } from 'react'

const styles = `
.dialog-overlay { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 24px; background: rgba(8,15,32,.55); backdrop-filter: blur(3px); animation: dialog-fade .18s ease-out; }
.dialog-card { position: relative; width: 100%; max-width: 380px; padding: 28px 26px 24px; background: #fff; border-radius: 20px; box-shadow: 0 24px 60px rgba(8,15,32,.28); text-align: center; animation: dialog-pop .22s cubic-bezier(.34,1.56,.64,1); }
.dialog-card.dialog-danger .dialog-icon { background: linear-gradient(135deg, #fdeceb, #fbd9d6); color: #d9534f; }
.dialog-icon { display: grid; place-items: center; width: 56px; height: 56px; margin: 0 auto 16px; border-radius: 18px; background: linear-gradient(135deg, #eef6f1, #e9f2ee); color: #215432; box-shadow: 0 10px 22px rgba(33,84,50,.12); }
.dialog-icon svg { width: 26px; height: 26px; }
.dialog-card h3 { margin: 0 0 8px; color: #172131; font-size: 17px; font-weight: 700; letter-spacing: -.3px; }
.dialog-card p { margin: 0; color: #8793a4; font-size: 13px; line-height: 1.6; }
.dialog-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 22px; }
.dialog-password { width: 100%; margin-top: 18px; padding: 11px 14px; border: 1px solid #e4e9ef; border-radius: 11px; background: #fafbfc; color: #172131; font-family: 'DM Sans', sans-serif; font-size: 13px; text-align: center; box-sizing: border-box; transition: border-color .15s, box-shadow .15s, background .15s; }
.dialog-password:focus { outline: none; border-color: #d9534f; box-shadow: 0 0 0 3px rgba(217,83,79,.12); background: #fff; }
.dialog-password::placeholder { color: #b8c4d2; }
.dialog-error { margin-top: 10px; color: #c0392b; font-size: 11.5px; font-weight: 500; }
.dialog-btn { padding: 11px 14px; border-radius: 11px; border: 1px solid #e4e9ef; background: #fff; color: #5b6b80; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: background .15s, border-color .15s, color .15s, box-shadow .15s; }
.dialog-btn.cancel:hover { background: #f5f7fa; border-color: #d0d7e0; }
.dialog-btn.confirm { background: linear-gradient(135deg, #215432, #173d26); border-color: transparent; color: #fff; box-shadow: 0 8px 18px rgba(33,84,50,.24); }
.dialog-btn.confirm:hover { box-shadow: 0 10px 22px rgba(33,84,50,.32); }
.dialog-btn.confirm.danger { background: linear-gradient(135deg, #e0412f, #c2332a); box-shadow: 0 8px 18px rgba(224,65,47,.24); }
.dialog-btn.confirm.danger:hover { box-shadow: 0 10px 22px rgba(224,65,47,.32); }
@keyframes dialog-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes dialog-pop { from { opacity: 0; transform: translateY(14px) scale(.96); } to { opacity: 1; transform: none; } }
`

const alertIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
)

const defaultIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
)

function ConfirmDialog({ open, title = 'Are you sure?', message = '', confirmText = 'Confirm', cancelText = 'Cancel', danger = false, onConfirm, onCancel, icon, requirePassword = false, passwordError = '', passwordPlaceholder = 'Enter superuser password' }) {
  const [password, setPassword] = useState('')
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    if (!open) return
    setPassword('')
    setConfirming(false)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape' && onCancel) onCancel() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  const handleConfirm = async () => {
    if (requirePassword && !password) return
    setConfirming(true)
    try {
      await onConfirm(requirePassword ? password : undefined)
    } finally {
      setConfirming(false)
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="dialog-overlay" onClick={onCancel}>
        <div className={`dialog-card${danger ? ' dialog-danger' : ''}`} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
          <div className="dialog-icon">{icon || (danger ? alertIcon : defaultIcon)}</div>
          <h3>{title}</h3>
          <p>{message}</p>
          {requirePassword && (
            <input
              className="dialog-password"
              type="password"
              value={password}
              placeholder={passwordPlaceholder}
              onChange={e => { setPassword(e.target.value); setConfirming(false) }}
              disabled={confirming}
              autoFocus
            />
          )}
          {passwordError && <div className="dialog-error">{passwordError}</div>}
          <div className="dialog-actions">
            <button className="dialog-btn cancel" onClick={onCancel}>{cancelText}</button>
            <button className={`dialog-btn confirm${danger ? ' danger' : ''}`} onClick={handleConfirm} disabled={confirming || (requirePassword && !password)}>{confirmText}</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ConfirmDialog