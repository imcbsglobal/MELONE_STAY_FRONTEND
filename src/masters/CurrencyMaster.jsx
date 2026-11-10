import { useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'
import ConfirmDialog from '../components/ui/ConfirmDialog'

const css = `
.cm-page{--cm-green:#235336;--cm-green-dark:#17432b;--cm-gold:#e9a900;--cm-line:#e4ebe5;--cm-muted:#77877d;max-width:1440px;margin:0 auto;color:#1c2b22;font-family:'DM Sans',sans-serif}
.cm-page *{box-sizing:border-box}

.cm-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);align-items:start;gap:14px}

.cm-panel{min-width:0;padding:18px;border:1px solid var(--cm-line);border-radius:16px;background:#fff;box-shadow:0 8px 24px rgba(23,67,43,.055)}
.cm-panel-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px;padding-bottom:13px;border-bottom:1px solid #edf1ed}
.cm-panel-heading h3{margin:0;position:relative;padding-left:11px;color:var(--cm-green-dark);font-size:16px}
.cm-panel-heading h3::before{position:absolute;top:2px;bottom:2px;left:0;width:3px;border-radius:3px;background:var(--cm-gold);content:''}
.cm-intro{margin:4px 0 0;color:var(--cm-muted);font-size:12px}
.cm-heading-tools{display:flex;flex-shrink:0;align-items:center;gap:8px}

.cm-refresh{display:inline-flex;align-items:center;gap:6px;min-height:28px;padding:0 10px;border:1px solid #d5e4da;border-radius:999px;background:#fff;color:var(--cm-green);font:700 11px 'DM Sans',sans-serif;cursor:pointer;transition:background .15s,border-color .15s}
.cm-refresh:hover:not(:disabled){background:#f3faf5;border-color:#b9d3c0}
.cm-refresh:disabled{opacity:.7;cursor:wait}
.cm-refresh:focus-visible{outline:2px solid var(--cm-green);outline-offset:2px}
.cm-refresh svg.is-spinning{animation:cm-spin .8s linear infinite}
@keyframes cm-spin{to{transform:rotate(360deg)}}
.cm-count{flex-shrink:0;padding:5px 10px;border:1px solid #e5eee7;border-radius:999px;background:#f4f8f4;color:var(--cm-muted);font-size:10px;font-weight:700}
.cm-count strong{margin-right:4px;color:var(--cm-green);font-size:13px}

.cm-fields{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.cm-field{display:flex;flex-direction:column;gap:0}
.cm-field.cm-full{grid-column:1/-1}
.cm-field label{display:block;margin-bottom:7px;color:#34453a;font-size:11px;font-weight:700}
.cm-field label span{color:#bd7713}
.cm-field input,.cm-field select{width:100%;height:42px;padding:0 12px;border:1px solid #dce5de;border-radius:9px;outline:0;background:#fff;color:#172a1f;font:13px 'DM Sans',sans-serif;transition:border-color .15s,box-shadow .15s}
.cm-field input:focus,.cm-field select:focus{border-color:var(--cm-green);box-shadow:0 0 0 3px rgba(35,83,54,.11)}
.cm-field input::placeholder{color:#9aac9e}
.cm-field select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2377877d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px}

.cm-form-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:16px;padding-top:14px;border-top:1px solid #edf0ed}
.cm-form-actions button{min-height:36px;padding:0 16px;border-radius:9px;font:700 12px 'DM Sans',sans-serif;cursor:pointer}
.cm-cancel{border:1px solid #dfe5e0;background:#fff;color:#68756b;transition:background .15s}
.cm-cancel:hover{background:#f4f7f5}
.cm-submit{border:1px solid var(--cm-green-dark);background:var(--cm-green-dark);color:#fff;box-shadow:0 4px 10px rgba(23,67,43,.14);transition:background .15s,box-shadow .15s}
.cm-submit:hover{background:var(--cm-green);box-shadow:0 6px 14px rgba(23,67,43,.2)}
.cm-submit:disabled{opacity:.6;cursor:wait}

.cm-error{margin:12px 0 0;padding:10px 12px;border:1px solid #f2d5d0;border-radius:9px;background:#fff7f6;color:#b34d39;font-size:12px}

.cm-list{max-height:min(580px,calc(100vh - 280px));overflow:auto;border:1px solid #e6ece7;border-radius:12px;background:#fff;scrollbar-width:thin;scrollbar-color:#d1dbd3 transparent}

.cm-item{display:grid;align-items:center;gap:10px;min-height:68px;padding:12px 16px;border-top:1px solid #eef2ee;transition:background .15s;grid-template-columns:minmax(0,1fr) auto}
.cm-item:first-child{border-top:0}
.cm-item:hover{background:#fafcfa}
.cm-item.is-editing{background:#fff9e8;box-shadow:inset 3px 0 0 var(--cm-gold)}

.cm-item-main{min-width:0}
.cm-item-name{margin:0;overflow:hidden;color:#203a2a;font-size:13px;font-weight:700;text-overflow:ellipsis;white-space:nowrap}
.cm-item-meta{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:6px}
.cm-item-code{display:inline-flex;align-items:center;padding:2px 8px;border:1px solid #d5e4da;border-radius:999px;background:#f3faf5;color:var(--cm-green);font-size:10px;font-weight:700}
.cm-badge-status-active{background:rgba(54,179,126,.1);color:#1a8058;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700}
.cm-badge-status-inactive{background:rgba(255,176,1,.14);color:#8a5e00;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700}

.cm-actions{display:flex;flex-shrink:0;gap:6px}
.cm-actions button{min-height:30px;padding:0 11px;border:1px solid #d5e4da;border-radius:8px;background:#fff;color:var(--cm-green);font:700 11px 'DM Sans',sans-serif;cursor:pointer;transition:background .15s,border-color .15s}
.cm-actions button:hover{background:#f3faf5;border-color:#b9d3c0}
.cm-actions .cm-remove{border-color:transparent;color:#b5584c}
.cm-actions .cm-remove:hover{border-color:#f2d5d0;background:#fff7f6}
.cm-actions button:focus-visible,.cm-submit:focus-visible,.cm-cancel:focus-visible{outline:2px solid var(--cm-green);outline-offset:2px}

.cm-empty{padding:32px 16px;border:1px dashed #cfddd1;border-radius:11px;background:#fbfdfb;color:var(--cm-muted);text-align:center;font-size:12px}
.cm-empty strong{display:block;margin-bottom:4px;color:#34453a;font-size:13px}

.cm-loading{padding:24px 16px;text-align:center;color:var(--cm-muted);font-size:12px}

@media(max-width:960px){.cm-grid{grid-template-columns:minmax(0,1fr)}}
@media(max-width:560px){.cm-fields{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){.cm-item,.cm-actions button,.cm-submit{transition:none}.cm-refresh svg.is-spinning{animation-duration:2s}}
`

const emptyForm = () => ({ code: '', name: '', status: 'ACTIVE' })

const refreshIcon = (spinning) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={spinning ? 'is-spinning' : ''} aria-hidden="true">
    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
)

function CurrencyMaster({ clientId }) {
  const [list, setList] = useState([])
  const [form, setForm] = useState(emptyForm())
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  /* ─── load records ─── */
  useEffect(() => {
    let disposed = false
    const load = async () => {
      try {
        const res = await apiFetch(`/api/currency-master/currencies/`)
        if (!res.ok) throw new Error(`Server error (${res.status})`)
        const data = await res.json()
        if (!disposed) setList(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!disposed) setError(err.message || 'Unable to load currency records')
      } finally {
        if (!disposed) { setLoading(false); setRefreshing(false) }
      }
    }
    load()
    return () => { disposed = true }
  }, [clientId, refreshKey])

  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    setError('')
  }

  const resetForm = () => {
    setForm(emptyForm())
    setEditingId(null)
    setError('')
  }

  const edit = (rec) => {
    setForm({ code: rec.code, name: rec.name, status: rec.status })
    setEditingId(rec.id)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { code, name } = form
    if (!code.trim()) { setError('Code is required.'); return }
    if (!name.trim()) { setError('Name is required.'); return }

    setSaving(true)
    setError('')

    const payload = {
      client_id: clientId,
      code: code.trim(),
      name: name.trim(),
      status: form.status,
      ...(editingId ? { id: editingId } : {}),
    }

    try {
      const res = await apiFetch(`/api/currency-master/currencies/`, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(Object.values(err).flat().join(' ') || `Server error (${res.status})`)
      }
      const saved = await res.json()
      setList(current =>
        editingId
          ? current.map(r => r.id === saved.id ? saved : r)
          : [saved, ...current]
      )
      resetForm()
    } catch (err) {
      setError(err.message || 'Unable to save currency record')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteError('')
    try {
      const res = await apiFetch(`/api/currency-master/currencies/${deleteTarget.id}/`, { method: 'DELETE' })
      if (res.status === 204) {
        setList(current => current.filter(r => r.id !== deleteTarget.id))
        if (editingId === deleteTarget.id) resetForm()
        setDeleteTarget(null)
      } else {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || err.error || `Server error (${res.status})`)
      }
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete record')
    }
  }

  return (
    <div className="cm-page">
      <style>{css}</style>

      <div className="cm-grid">
        {/* ── Form panel ── */}
        <form className="cm-panel" onSubmit={handleSubmit} noValidate>
          <div className="cm-panel-heading">
            <div>
              <h3>{editingId ? 'Edit Currency' : 'Add Currency'}</h3>
              <p className="cm-intro">Currencies used across your property (e.g. INR, USD, EUR)</p>
            </div>
          </div>
          <div className="cm-fields">
            <div className="cm-field">
              <label htmlFor="cm-code">Code <span>*</span></label>
              <input id="cm-code" value={form.code} onChange={e => update('code', e.target.value)} maxLength={20} placeholder="e.g. USD" required />
            </div>
            <div className="cm-field">
              <label htmlFor="cm-name">Name <span>*</span></label>
              <input id="cm-name" value={form.name} onChange={e => update('name', e.target.value)} maxLength={100} placeholder="e.g. US Dollar" required />
            </div>
            <div className="cm-field cm-full">
              <label htmlFor="cm-status">Status</label>
              <select id="cm-status" value={form.status} onChange={e => update('status', e.target.value)}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>
          {error && <div className="cm-error">{error}</div>}
          <div className="cm-form-actions">
            {editingId && <button type="button" className="cm-cancel" onClick={resetForm}>Cancel</button>}
            <button type="submit" className="cm-submit" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Record'}
            </button>
          </div>
        </form>

        {/* ── List panel ── */}
        <div className="cm-panel">
          <div className="cm-panel-heading">
            <div>
              <h3>Currency Records</h3>
              <p className="cm-intro">Currencies configured for your property</p>
            </div>
            <div className="cm-heading-tools">
              <button
                className="cm-refresh"
                onClick={() => { setRefreshing(true); setError(''); setRefreshKey(k => k + 1) }}
                disabled={refreshing}
                aria-label="Refresh"
              >
                {refreshIcon(refreshing)} Refresh
              </button>
              <span className="cm-count"><strong>{list.length}</strong> records</span>
            </div>
          </div>
          {loading ? (
            <div className="cm-loading">Loading records…</div>
          ) : list.length === 0 ? (
            <div className="cm-empty"><strong>No records yet</strong>Add a currency using the form.</div>
          ) : (
            <div className="cm-list">
              {list.map(rec => (
                <div key={rec.id} className={`cm-item${editingId === rec.id ? ' is-editing' : ''}`}>
                  <div className="cm-item-main">
                    <h4 className="cm-item-name">{rec.name}</h4>
                    <div className="cm-item-meta">
                      <span className="cm-item-code">{rec.code}</span>
                      <span className={rec.status === 'ACTIVE' ? 'cm-badge-status-active' : 'cm-badge-status-inactive'}>{rec.status}</span>
                    </div>
                  </div>
                  <div className="cm-actions">
                    <button onClick={() => edit(rec)}>Edit</button>
                    <button className="cm-remove" onClick={() => { setDeleteError(''); setDeleteTarget(rec) }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete currency record?"
        danger
        message={deleteTarget ? `"${deleteTarget.name}" will be permanently removed. This cannot be undone.` : ''}
        confirmText="Delete"
        cancelText="Cancel"
        passwordError={deleteError}
        onCancel={() => { setDeleteTarget(null); setDeleteError('') }}
        onConfirm={handleDelete}
      />
    </div>
  )
}

export default CurrencyMaster
