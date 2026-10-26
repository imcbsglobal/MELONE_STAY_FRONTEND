import { useEffect, useState } from 'react'
import { apiFetch, readApiJson } from '../../lib/api'

const css = `
.ota-master{--ota-green:#235336;--ota-green-dark:#17432b;--ota-gold:#e9a900;--ota-line:#e4ebe5;--ota-muted:#77877d;max-width:1440px;margin:0 auto;color:#1c2b22;font-family:'DM Sans',sans-serif}
.ota-master *{box-sizing:border-box}
.ota-master-grid{display:grid;grid-template-columns:minmax(280px,.8fr) minmax(0,1.2fr);align-items:start;gap:16px}
.ota-master-panel{min-width:0;padding:20px;border:1px solid var(--ota-line);border-radius:16px;background:#fff;box-shadow:0 8px 24px rgba(23,67,43,.055)}
.ota-master-panel h2{margin:0;color:var(--ota-green-dark);font-size:17px}
.ota-master-intro{margin:5px 0 18px;color:var(--ota-muted);font-size:12px;line-height:1.6}
.ota-master-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px;padding-bottom:13px;border-bottom:1px solid #edf1ed}
.ota-master-heading h2{position:relative;padding-left:11px}
.ota-master-heading h2::before{position:absolute;top:2px;bottom:2px;left:0;width:3px;border-radius:3px;background:var(--ota-gold);content:''}
.ota-master-count{flex-shrink:0;padding:5px 10px;border:1px solid #e5eee7;border-radius:999px;background:#f4f8f4;color:var(--ota-muted);font-size:10px;font-weight:700}
.ota-master-count strong{margin-right:4px;color:var(--ota-green);font-size:13px}
.ota-master-field{margin-bottom:14px}
.ota-master-field label{display:block;margin-bottom:7px;color:#34453a;font-size:12px;font-weight:700}
.ota-master-field label span{color:#bd7713}
.ota-master-field input{width:100%;height:42px;padding:0 12px;border:1px solid #dce5de;border-radius:9px;outline:0;background:#fff;color:#172a1f;font:13px 'DM Sans',sans-serif;transition:border-color .15s,box-shadow .15s}
.ota-master-field input:focus{border-color:var(--ota-green);box-shadow:0 0 0 3px rgba(35,83,54,.11)}
.ota-master-submit{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:40px;padding:0 16px;border:1px solid var(--ota-green-dark);border-radius:9px;background:var(--ota-green-dark);color:#fff;font:700 12px 'DM Sans',sans-serif;cursor:pointer;box-shadow:0 4px 10px rgba(23,67,43,.14);transition:background .15s,box-shadow .15s}
.ota-master-submit:hover:not(:disabled){background:var(--ota-green);box-shadow:0 6px 14px rgba(23,67,43,.2)}
.ota-master-submit:disabled{opacity:.6;cursor:wait}
.ota-master-submit:focus-visible{outline:2px solid var(--ota-green);outline-offset:2px}
.ota-master-error{margin:0 0 14px;padding:10px 12px;border:1px solid #f2d5d0;border-radius:9px;background:#fff7f6;color:#b34d39;font-size:12px}
.ota-master-table-wrap{overflow-x:auto;border:1px solid #e6ece7;border-radius:12px}
.ota-master-table{width:100%;border-collapse:collapse;text-align:left}
.ota-master-table th{padding:11px 15px;background:#f7faf7;color:#77877d;font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.ota-master-table td{padding:14px 15px;border-top:1px solid #eef2ee;color:#203a2a;font-size:13px}
.ota-master-table td:last-child{color:#53685a;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:12px;font-weight:600}
.ota-master-empty{padding:34px 16px;border:1px dashed #cfddd1;border-radius:11px;background:#fbfdfb;color:var(--ota-muted);text-align:center;font-size:12px}
.ota-master-empty strong{display:block;margin-bottom:4px;color:#34453a;font-size:13px}
@media(max-width:820px){.ota-master-grid{grid-template-columns:minmax(0,1fr)}}
@media(prefers-reduced-motion:reduce){.ota-master-field input,.ota-master-submit{transition:none}}
`

function OtaMaster({ clientId }) {
  const [otas, setOtas] = useState([])
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let disposed = false
    const loadOtas = async () => {
      try {
        const response = await apiFetch(`/api/ota/list/?client_id=${encodeURIComponent(clientId)}`)
        const data = await readApiJson(response)
        if (!response.ok || !data.success) throw new Error(data.error || 'Failed to load OTAs')
        if (!disposed) setOtas(data.otas)
      } catch (loadError) {
        if (!disposed) setLoadError(loadError.message || 'Unable to connect to the server')
      } finally {
        if (!disposed) setLoading(false)
      }
    }
    loadOtas()
    return () => { disposed = true }
  }, [clientId])

  const handleSubmit = async event => {
    event.preventDefault()
    const otaName = name.trim()
    const otaCode = code.trim()
    if (!otaName || !otaCode) {
      setError('Enter both an OTA name and OTA code.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const response = await apiFetch('/api/ota/create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: clientId, name: otaName, code: otaCode }),
      })
      const data = await readApiJson(response)
      if (!response.ok || !data.success) throw new Error(data.error || 'Unable to add OTA')
      setOtas(current => [data.ota, ...current])
      setName('')
      setCode('')
    } catch (saveError) {
      setError(saveError.message || 'Unable to connect to the server')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="ota-master">
      <style>{css}</style>
      <div className="ota-master-grid">
        <section className="ota-master-panel">
          <h2>Add an OTA</h2>
          <p className="ota-master-intro">Add an online travel agency to keep your distribution channels organized.</p>
          <form onSubmit={handleSubmit}>
            <div className="ota-master-field">
              <label htmlFor="ota-code">OTA Code <span aria-hidden="true">*</span></label>
              <input id="ota-code" value={code} onChange={event => { setCode(event.target.value); setError('') }} maxLength={50} placeholder="e.g. BOOKING" autoComplete="off" required />
            </div>
            <div className="ota-master-field">
              <label htmlFor="ota-name">OTA Name <span aria-hidden="true">*</span></label>
              <input id="ota-name" value={name} onChange={event => { setName(event.target.value); setError('') }} maxLength={100} placeholder="e.g. Booking.com" autoComplete="organization" required />
            </div>
            {error && <p className="ota-master-error" role="alert">{error}</p>}
            <button className="ota-master-submit" type="submit" disabled={saving || loading}>
              <span aria-hidden="true">+</span>{saving ? 'Adding…' : loading ? 'Loading…' : 'Add OTA'}
            </button>
          </form>
        </section>

        <section className="ota-master-panel">
          <header className="ota-master-heading">
            <h2>Online Travel Agencies</h2>
            <span className="ota-master-count"><strong>{otas.length}</strong>{otas.length === 1 ? 'OTA' : 'OTAs'}</span>
          </header>
          {loading ? (
            <div className="ota-master-empty" role="status">Loading OTAs…</div>
          ) : loadError ? (
            <p className="ota-master-error" role="alert">{loadError}</p>
          ) : otas.length === 0 ? (
            <div className="ota-master-empty"><strong>No OTAs yet</strong>Add your first OTA using the form.</div>
          ) : (
            <div className="ota-master-table-wrap">
              <table className="ota-master-table">
                <thead><tr><th scope="col">OTA Code</th><th scope="col">OTA Name</th></tr></thead>
                <tbody>{otas.map(ota => <tr key={ota.id}><td>{ota.code}</td><td>{ota.name}</td></tr>)}</tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default OtaMaster
