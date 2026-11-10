import { useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'
import ConfirmDialog from '../components/ui/ConfirmDialog'

const css = `
.tm-page{--tm-green:#235336;--tm-green-dark:#17432b;--tm-gold:#e9a900;--tm-line:#e4ebe5;--tm-muted:#77877d;max-width:1440px;margin:0 auto;color:#1c2b22;font-family:'DM Sans',sans-serif}
.tm-page *{box-sizing:border-box}

/* tabs */
.tm-tabs{display:flex;align-items:center;gap:6px;margin-bottom:18px}
.tm-tab{display:inline-flex;align-items:center;gap:6px;min-height:34px;padding:0 16px;border:1px solid #d5e4da;border-radius:999px;background:#fff;color:var(--tm-muted);font:700 12px 'DM Sans',sans-serif;cursor:pointer;transition:background .15s,border-color .15s,color .15s}
.tm-tab.is-active{background:var(--tm-green-dark);border-color:var(--tm-green-dark);color:#fff;box-shadow:0 4px 10px rgba(23,67,43,.18)}
.tm-tab:not(.is-active):hover{background:#f3faf5;border-color:#b9d3c0;color:var(--tm-green)}
.tm-tab:focus-visible{outline:2px solid var(--tm-green);outline-offset:2px}
.tm-tab-dot{width:7px;height:7px;border-radius:50%;background:currentColor;flex-shrink:0;opacity:.7}

/* grid */
.tm-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);align-items:start;gap:14px}

/* panel */
.tm-panel{min-width:0;padding:18px;border:1px solid var(--tm-line);border-radius:16px;background:#fff;box-shadow:0 8px 24px rgba(23,67,43,.055)}
.tm-panel-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px;padding-bottom:13px;border-bottom:1px solid #edf1ed}
.tm-panel-heading h3{margin:0;position:relative;padding-left:11px;color:var(--tm-green-dark);font-size:16px}
.tm-panel-heading h3::before{position:absolute;top:2px;bottom:2px;left:0;width:3px;border-radius:3px;background:var(--tm-gold);content:''}
.tm-intro{margin:4px 0 0;color:var(--tm-muted);font-size:12px}
.tm-heading-tools{display:flex;flex-shrink:0;align-items:center;gap:8px}

/* refresh button */
.tm-refresh{display:inline-flex;align-items:center;gap:6px;min-height:28px;padding:0 10px;border:1px solid #d5e4da;border-radius:999px;background:#fff;color:var(--tm-green);font:700 11px 'DM Sans',sans-serif;cursor:pointer;transition:background .15s,border-color .15s}
.tm-refresh:hover:not(:disabled){background:#f3faf5;border-color:#b9d3c0}
.tm-refresh:disabled{opacity:.7;cursor:wait}
.tm-refresh:focus-visible{outline:2px solid var(--tm-green);outline-offset:2px}
.tm-refresh svg.is-spinning{animation:tm-spin .8s linear infinite}
@keyframes tm-spin{to{transform:rotate(360deg)}}
.tm-count{flex-shrink:0;padding:5px 10px;border:1px solid #e5eee7;border-radius:999px;background:#f4f8f4;color:var(--tm-muted);font-size:10px;font-weight:700}
.tm-count strong{margin-right:4px;color:var(--tm-green);font-size:13px}

/* form fields */
.tm-fields{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.tm-field{display:flex;flex-direction:column;gap:0}
.tm-field.tm-full{grid-column:1/-1}
.tm-field label{display:block;margin-bottom:7px;color:#34453a;font-size:11px;font-weight:700}
.tm-field label span{color:#bd7713}
.tm-field input,.tm-field select{width:100%;height:42px;padding:0 12px;border:1px solid #dce5de;border-radius:9px;outline:0;background:#fff;color:#172a1f;font:13px 'DM Sans',sans-serif;transition:border-color .15s,box-shadow .15s}
.tm-field input:focus,.tm-field select:focus{border-color:var(--tm-green);box-shadow:0 0 0 3px rgba(35,83,54,.11)}
.tm-field input::placeholder{color:#9aac9e}
.tm-field select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2377877d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px}

/* section divider inside form */
.tm-section-label{grid-column:1/-1;margin:4px 0 0;padding:8px 10px;border-radius:8px;background:#f4f8f4;color:#4a6155;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}

/* form actions */
.tm-form-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:16px;padding-top:14px;border-top:1px solid #edf0ed}
.tm-form-actions button{min-height:36px;padding:0 16px;border-radius:9px;font:700 12px 'DM Sans',sans-serif;cursor:pointer}
.tm-cancel{border:1px solid #dfe5e0;background:#fff;color:#68756b;transition:background .15s}
.tm-cancel:hover{background:#f4f7f5}
.tm-submit{border:1px solid var(--tm-green-dark);background:var(--tm-green-dark);color:#fff;box-shadow:0 4px 10px rgba(23,67,43,.14);transition:background .15s,box-shadow .15s}
.tm-submit:hover{background:var(--tm-green);box-shadow:0 6px 14px rgba(23,67,43,.2)}
.tm-submit:disabled{opacity:.6;cursor:wait}

/* error banner */
.tm-error{margin:12px 0 0;padding:10px 12px;border:1px solid #f2d5d0;border-radius:9px;background:#fff7f6;color:#b34d39;font-size:12px}

/* list */
.tm-list{max-height:min(580px,calc(100vh - 280px));overflow:auto;border:1px solid #e6ece7;border-radius:12px;background:#fff;scrollbar-width:thin;scrollbar-color:#d1dbd3 transparent}

/* list item */
.tm-item{display:grid;align-items:center;gap:10px;min-height:68px;padding:12px 16px;border-top:1px solid #eef2ee;transition:background .15s}
.tm-item:first-child{border-top:0}
.tm-item:hover{background:#fafcfa}
.tm-item.is-editing{background:#fff9e8;box-shadow:inset 3px 0 0 var(--tm-gold)}
.tm-item-india{grid-template-columns:minmax(0,1fr) auto}
.tm-item-other{grid-template-columns:minmax(0,1fr) auto}

.tm-item-main{min-width:0}
.tm-item-name{margin:0;overflow:hidden;color:#203a2a;font-size:13px;font-weight:700;text-overflow:ellipsis;white-space:nowrap}
.tm-item-code{display:inline-flex;align-items:center;margin-top:3px;padding:2px 8px;border:1px solid #d5e4da;border-radius:999px;background:#f3faf5;color:var(--tm-green);font-size:10px;font-weight:700}
.tm-item-rates{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}
.tm-item-badge{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:6px;font-size:10px;font-weight:700}
.tm-badge-cgst{background:rgba(33,84,50,.08);color:#1d5c35}
.tm-badge-sgst{background:rgba(233,169,0,.12);color:#8a5e00}
.tm-badge-igst{background:rgba(59,104,228,.1);color:#3b68e4}
.tm-badge-gst{background:rgba(147,51,234,.1);color:#7c3aed}
.tm-badge-tax{background:rgba(33,84,50,.08);color:#1d5c35}
.tm-badge-cal{background:#f0f3f6;color:#5b6b7a}
.tm-badge-status-active{background:rgba(54,179,126,.1);color:#1a8058;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700}
.tm-badge-status-inactive{background:rgba(255,176,1,.14);color:#8a5e00;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700}

.tm-actions{display:flex;flex-shrink:0;gap:6px}
.tm-actions button{min-height:30px;padding:0 11px;border:1px solid #d5e4da;border-radius:8px;background:#fff;color:var(--tm-green);font:700 11px 'DM Sans',sans-serif;cursor:pointer;transition:background .15s,border-color .15s}
.tm-actions button:hover{background:#f3faf5;border-color:#b9d3c0}
.tm-actions .tm-remove{border-color:transparent;color:#b5584c}
.tm-actions .tm-remove:hover{border-color:#f2d5d0;background:#fff7f6}
.tm-actions button:focus-visible,.tm-submit:focus-visible,.tm-cancel:focus-visible{outline:2px solid var(--tm-green);outline-offset:2px}

/* empty */
.tm-empty{padding:32px 16px;border:1px dashed #cfddd1;border-radius:11px;background:#fbfdfb;color:var(--tm-muted);text-align:center;font-size:12px}
.tm-empty strong{display:block;margin-bottom:4px;color:#34453a;font-size:13px}

/* loading skeleton */
.tm-loading{padding:24px 16px;text-align:center;color:var(--tm-muted);font-size:12px}

@media(max-width:960px){.tm-grid{grid-template-columns:minmax(0,1fr)}}
@media(max-width:560px){.tm-fields{grid-template-columns:1fr}.tm-item-rates{gap:4px}}
@media(prefers-reduced-motion:reduce){.tm-item,.tm-actions button,.tm-submit{transition:none}.tm-refresh svg.is-spinning{animation-duration:2s}}
`

const emptyIndiaForm = () => ({
  code: '', name: '', type: '', cgst: '', sgst: '', igst: '', gst: '', cal_method: '', status: 'ACTIVE',
})

const emptyOtherForm = () => ({
  code: '', name: '', tax: '', cal_method: '', status: 'ACTIVE',
})

const CAL_METHODS = ['PERCENTAGE', 'FLAT']

const refreshIcon = (spinning) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={spinning ? 'is-spinning' : ''} aria-hidden="true">
    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
)

function TaxMaster({ clientId }) {
  const [tab, setTab] = useState('india') // 'india' | 'other'

  // India tab state
  const [indiaList, setIndiaList] = useState([])
  const [indiaForm, setIndiaForm] = useState(emptyIndiaForm())
  const [indiaEditId, setIndiaEditId] = useState(null)
  const [indiaError, setIndiaError] = useState('')
  const [indiaLoading, setIndiaLoading] = useState(true)
  const [indiaSaving, setIndiaSaving] = useState(false)
  const [indiaRefreshKey, setIndiaRefreshKey] = useState(0)
  const [indiaRefreshing, setIndiaRefreshing] = useState(false)

  // Other tab state
  const [otherList, setOtherList] = useState([])
  const [otherForm, setOtherForm] = useState(emptyOtherForm())
  const [otherEditId, setOtherEditId] = useState(null)
  const [otherError, setOtherError] = useState('')
  const [otherLoading, setOtherLoading] = useState(true)
  const [otherSaving, setOtherSaving] = useState(false)
  const [otherRefreshKey, setOtherRefreshKey] = useState(0)
  const [otherRefreshing, setOtherRefreshing] = useState(false)

  // Confirm delete dialog
  const [deleteTarget, setDeleteTarget] = useState(null) // { id, name, type: 'india'|'other' }
  const [deleteError, setDeleteError] = useState('')

  /* ─── load India records ─── */
  useEffect(() => {
    let disposed = false
    const load = async () => {
      try {
        const res = await apiFetch(`/api/tax-master/india/`)
        if (!res.ok) throw new Error(`Server error (${res.status})`)
        const data = await res.json()
        if (!disposed) setIndiaList(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!disposed) setIndiaError(err.message || 'Unable to load India tax records')
      } finally {
        if (!disposed) { setIndiaLoading(false); setIndiaRefreshing(false) }
      }
    }
    load()
    return () => { disposed = true }
  }, [clientId, indiaRefreshKey])

  /* ─── load Other records ─── */
  useEffect(() => {
    let disposed = false
    const load = async () => {
      try {
        const res = await apiFetch(`/api/tax-master/other/`)
        if (!res.ok) throw new Error(`Server error (${res.status})`)
        const data = await res.json()
        if (!disposed) setOtherList(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!disposed) setOtherError(err.message || 'Unable to load other-country tax records')
      } finally {
        if (!disposed) { setOtherLoading(false); setOtherRefreshing(false) }
      }
    }
    load()
    return () => { disposed = true }
  }, [clientId, otherRefreshKey])

  /* ─── India helpers ─── */
  const updateIndia = (field, value) => {
    setIndiaForm(f => ({ ...f, [field]: value }))
    setIndiaError('')
  }

  const resetIndiaForm = () => {
    setIndiaForm(emptyIndiaForm())
    setIndiaEditId(null)
    setIndiaError('')
  }

  const editIndia = (rec) => {
    setIndiaForm({
      code: rec.code,
      name: rec.name,
      type: rec.type || '',
      cgst: rec.cgst ?? '',
      sgst: rec.sgst ?? '',
      igst: rec.igst ?? '',
      gst: rec.gst ?? '',
      cal_method: rec.cal_method,
      status: rec.status,
    })
    setIndiaEditId(rec.id)
    setIndiaError('')
  }

  const handleIndiaSubmit = async (e) => {
    e.preventDefault()
    const { code, name, cal_method } = indiaForm
    if (!code.trim()) { setIndiaError('Code is required.'); return }
    if (!name.trim()) { setIndiaError('Name is required.'); return }
    if (!cal_method) { setIndiaError('Calculation method is required.'); return }

    setIndiaSaving(true)
    setIndiaError('')

    const payload = {
      client_id: clientId,
      code: code.trim(),
      name: name.trim(),
      type: indiaForm.type.trim() || undefined,
      cgst: indiaForm.cgst !== '' ? indiaForm.cgst : undefined,
      sgst: indiaForm.sgst !== '' ? indiaForm.sgst : undefined,
      igst: indiaForm.igst !== '' ? indiaForm.igst : undefined,
      gst: indiaForm.gst !== '' ? indiaForm.gst : undefined,
      cal_method,
      status: indiaForm.status,
      ...(indiaEditId ? { id: indiaEditId } : {}),
    }

    try {
      const res = await apiFetch(
        `/api/tax-master/india/`,
        {
          method: indiaEditId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(Object.values(err).flat().join(' ') || `Server error (${res.status})`)
      }
      const saved = await res.json()
      setIndiaList(current =>
        indiaEditId
          ? current.map(r => r.id === saved.id ? saved : r)
          : [saved, ...current]
      )
      resetIndiaForm()
    } catch (err) {
      setIndiaError(err.message || 'Unable to save tax record')
    } finally {
      setIndiaSaving(false)
    }
  }

  /* ─── Other helpers ─── */
  const updateOther = (field, value) => {
    setOtherForm(f => ({ ...f, [field]: value }))
    setOtherError('')
  }

  const resetOtherForm = () => {
    setOtherForm(emptyOtherForm())
    setOtherEditId(null)
    setOtherError('')
  }

  const editOther = (rec) => {
    setOtherForm({
      code: rec.code,
      name: rec.name,
      tax: rec.tax ?? '',
      cal_method: rec.cal_method,
      status: rec.status,
    })
    setOtherEditId(rec.id)
    setOtherError('')
  }

  const handleOtherSubmit = async (e) => {
    e.preventDefault()
    const { code, name, cal_method } = otherForm
    if (!code.trim()) { setOtherError('Code is required.'); return }
    if (!name.trim()) { setOtherError('Name is required.'); return }
    if (!cal_method) { setOtherError('Calculation method is required.'); return }

    setOtherSaving(true)
    setOtherError('')

    const payload = {
      client_id: clientId,
      code: code.trim(),
      name: name.trim(),
      tax: otherForm.tax !== '' ? otherForm.tax : undefined,
      cal_method,
      status: otherForm.status,
      ...(otherEditId ? { id: otherEditId } : {}),
    }

    try {
      const res = await apiFetch(
        `/api/tax-master/other/`,
        {
          method: otherEditId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(Object.values(err).flat().join(' ') || `Server error (${res.status})`)
      }
      const saved = await res.json()
      setOtherList(current =>
        otherEditId
          ? current.map(r => r.id === saved.id ? saved : r)
          : [saved, ...current]
      )
      resetOtherForm()
    } catch (err) {
      setOtherError(err.message || 'Unable to save tax record')
    } finally {
      setOtherSaving(false)
    }
  }

  /* ─── Delete ─── */
  const requestDelete = (rec, type) => {
    setDeleteError('')
    setDeleteTarget({ id: rec.id, name: rec.name, type })
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteError('')
    try {
      const endpoint = deleteTarget.type === 'india'
        ? `/api/tax-master/india/${deleteTarget.id}/`
        : `/api/tax-master/other/${deleteTarget.id}/`
      const res = await apiFetch(endpoint, { method: 'DELETE' })
      // DELETE returns 204 No Content — no body to parse
      if (res.status === 204) {
        if (deleteTarget.type === 'india') {
          setIndiaList(current => current.filter(r => r.id !== deleteTarget.id))
          if (indiaEditId === deleteTarget.id) resetIndiaForm()
        } else {
          setOtherList(current => current.filter(r => r.id !== deleteTarget.id))
          if (otherEditId === deleteTarget.id) resetOtherForm()
        }
        setDeleteTarget(null)
      } else {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || err.error || `Server error (${res.status})`)
      }
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete record')
    }
  }

  const fmtRate = (val) => (val !== undefined && val !== null && val !== '') ? `${Number(val).toFixed(2)}%` : '—'

  /* ─── Render India form ─── */
  const renderIndiaForm = () => (
    <form className="tm-panel" onSubmit={handleIndiaSubmit} noValidate>
      <div className="tm-panel-heading">
        <div>
          <h3>{indiaEditId ? 'Edit India Tax' : 'Add India Tax'}</h3>
          <p className="tm-intro">India GST component rates (CGST · SGST · IGST · GST)</p>
        </div>
      </div>
      <div className="tm-fields">
        <div className="tm-field">
          <label htmlFor="tm-in-code">Code <span>*</span></label>
          <input id="tm-in-code" value={indiaForm.code} onChange={e => updateIndia('code', e.target.value)} maxLength={20} placeholder="e.g. GST18" required />
        </div>
        <div className="tm-field">
          <label htmlFor="tm-in-name">Name <span>*</span></label>
          <input id="tm-in-name" value={indiaForm.name} onChange={e => updateIndia('name', e.target.value)} maxLength={100} placeholder="e.g. GST 18%" required />
        </div>
        <div className="tm-field">
          <label htmlFor="tm-in-type">Type</label>
          <input id="tm-in-type" value={indiaForm.type} onChange={e => updateIndia('type', e.target.value)} maxLength={50} placeholder="e.g. GST" />
        </div>
        <div className="tm-field">
          <label htmlFor="tm-in-calmethod">Calc. Method <span>*</span></label>
          <select id="tm-in-calmethod" value={indiaForm.cal_method} onChange={e => updateIndia('cal_method', e.target.value)} required>
            <option value="">Select method</option>
            {CAL_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="tm-section-label">GST Rates (%)</div>

        <div className="tm-field">
          <label htmlFor="tm-in-cgst">CGST</label>
          <input id="tm-in-cgst" type="number" min="0" step="0.01" value={indiaForm.cgst} onChange={e => updateIndia('cgst', e.target.value)} placeholder="0.00" />
        </div>
        <div className="tm-field">
          <label htmlFor="tm-in-sgst">SGST</label>
          <input id="tm-in-sgst" type="number" min="0" step="0.01" value={indiaForm.sgst} onChange={e => updateIndia('sgst', e.target.value)} placeholder="0.00" />
        </div>
        <div className="tm-field">
          <label htmlFor="tm-in-igst">IGST</label>
          <input id="tm-in-igst" type="number" min="0" step="0.01" value={indiaForm.igst} onChange={e => updateIndia('igst', e.target.value)} placeholder="0.00" />
        </div>
        <div className="tm-field">
          <label htmlFor="tm-in-gst">GST</label>
          <input id="tm-in-gst" type="number" min="0" step="0.01" value={indiaForm.gst} onChange={e => updateIndia('gst', e.target.value)} placeholder="0.00" />
        </div>

        <div className="tm-field tm-full">
          <label htmlFor="tm-in-status">Status</label>
          <select id="tm-in-status" value={indiaForm.status} onChange={e => updateIndia('status', e.target.value)}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
      </div>
      {indiaError && <div className="tm-error">{indiaError}</div>}
      <div className="tm-form-actions">
        {indiaEditId && <button type="button" className="tm-cancel" onClick={resetIndiaForm}>Cancel</button>}
        <button type="submit" className="tm-submit" disabled={indiaSaving}>
          {indiaSaving ? 'Saving…' : indiaEditId ? 'Save Changes' : 'Add Record'}
        </button>
      </div>
    </form>
  )

  /* ─── Render India list ─── */
  const renderIndiaList = () => (
    <div className="tm-panel">
      <div className="tm-panel-heading">
        <div>
          <h3>India Tax Records</h3>
          <p className="tm-intro">CGST / SGST / IGST / GST breakdown per record</p>
        </div>
        <div className="tm-heading-tools">
          <button className="tm-refresh" onClick={() => { setIndiaRefreshing(true); setIndiaError(''); setIndiaRefreshKey(k => k + 1) }} disabled={indiaRefreshing} aria-label="Refresh">
            {refreshIcon(indiaRefreshing)} Refresh
          </button>
          <span className="tm-count"><strong>{indiaList.length}</strong> records</span>
        </div>
      </div>
      {indiaLoading ? (
        <div className="tm-loading">Loading records…</div>
      ) : indiaList.length === 0 ? (
        <div className="tm-empty"><strong>No records yet</strong>Add an India tax record using the form.</div>
      ) : (
        <div className="tm-list">
          {indiaList.map(rec => (
            <div key={rec.id} className={`tm-item tm-item-india${indiaEditId === rec.id ? ' is-editing' : ''}`}>
              <div className="tm-item-main">
                <h4 className="tm-item-name">{rec.name}</h4>
                <span className="tm-item-code">{rec.code}</span>
                <div className="tm-item-rates">
                  {rec.cgst !== undefined && <span className="tm-item-badge tm-badge-cgst">CGST {fmtRate(rec.cgst)}</span>}
                  {rec.sgst !== undefined && <span className="tm-item-badge tm-badge-sgst">SGST {fmtRate(rec.sgst)}</span>}
                  {rec.igst !== undefined && <span className="tm-item-badge tm-badge-igst">IGST {fmtRate(rec.igst)}</span>}
                  {rec.gst !== undefined && <span className="tm-item-badge tm-badge-gst">GST {fmtRate(rec.gst)}</span>}
                  {rec.cal_method && <span className="tm-item-badge tm-badge-cal">{rec.cal_method}</span>}
                  <span className={rec.status === 'ACTIVE' ? 'tm-badge-status-active' : 'tm-badge-status-inactive'}>{rec.status}</span>
                </div>
              </div>
              <div className="tm-actions">
                <button onClick={() => editIndia(rec)}>Edit</button>
                <button className="tm-remove" onClick={() => requestDelete(rec, 'india')}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  /* ─── Render Other form ─── */
  const renderOtherForm = () => (
    <form className="tm-panel" onSubmit={handleOtherSubmit} noValidate>
      <div className="tm-panel-heading">
        <div>
          <h3>{otherEditId ? 'Edit Tax Record' : 'Add Tax Record'}</h3>
          <p className="tm-intro">Single tax rate for non-India countries</p>
        </div>
      </div>
      <div className="tm-fields">
        <div className="tm-field">
          <label htmlFor="tm-ot-code">Code <span>*</span></label>
          <input id="tm-ot-code" value={otherForm.code} onChange={e => updateOther('code', e.target.value)} maxLength={20} placeholder="e.g. VAT20" required />
        </div>
        <div className="tm-field">
          <label htmlFor="tm-ot-name">Name <span>*</span></label>
          <input id="tm-ot-name" value={otherForm.name} onChange={e => updateOther('name', e.target.value)} maxLength={100} placeholder="e.g. VAT 20%" required />
        </div>
        <div className="tm-field">
          <label htmlFor="tm-ot-tax">Tax Rate (%)</label>
          <input id="tm-ot-tax" type="number" min="0" step="0.01" value={otherForm.tax} onChange={e => updateOther('tax', e.target.value)} placeholder="0.00" />
        </div>
        <div className="tm-field">
          <label htmlFor="tm-ot-calmethod">Calc. Method <span>*</span></label>
          <select id="tm-ot-calmethod" value={otherForm.cal_method} onChange={e => updateOther('cal_method', e.target.value)} required>
            <option value="">Select method</option>
            {CAL_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="tm-field tm-full">
          <label htmlFor="tm-ot-status">Status</label>
          <select id="tm-ot-status" value={otherForm.status} onChange={e => updateOther('status', e.target.value)}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
      </div>
      {otherError && <div className="tm-error">{otherError}</div>}
      <div className="tm-form-actions">
        {otherEditId && <button type="button" className="tm-cancel" onClick={resetOtherForm}>Cancel</button>}
        <button type="submit" className="tm-submit" disabled={otherSaving}>
          {otherSaving ? 'Saving…' : otherEditId ? 'Save Changes' : 'Add Record'}
        </button>
      </div>
    </form>
  )

  /* ─── Render Other list ─── */
  const renderOtherList = () => (
    <div className="tm-panel">
      <div className="tm-panel-heading">
        <div>
          <h3>Other Country Tax Records</h3>
          <p className="tm-intro">Single tax rate per record</p>
        </div>
        <div className="tm-heading-tools">
          <button className="tm-refresh" onClick={() => { setOtherRefreshing(true); setOtherError(''); setOtherRefreshKey(k => k + 1) }} disabled={otherRefreshing} aria-label="Refresh">
            {refreshIcon(otherRefreshing)} Refresh
          </button>
          <span className="tm-count"><strong>{otherList.length}</strong> records</span>
        </div>
      </div>
      {otherLoading ? (
        <div className="tm-loading">Loading records…</div>
      ) : otherList.length === 0 ? (
        <div className="tm-empty"><strong>No records yet</strong>Add a tax record using the form.</div>
      ) : (
        <div className="tm-list">
          {otherList.map(rec => (
            <div key={rec.id} className={`tm-item tm-item-other${otherEditId === rec.id ? ' is-editing' : ''}`}>
              <div className="tm-item-main">
                <h4 className="tm-item-name">{rec.name}</h4>
                <span className="tm-item-code">{rec.code}</span>
                <div className="tm-item-rates">
                  {rec.tax !== undefined && <span className="tm-item-badge tm-badge-tax">Tax {fmtRate(rec.tax)}</span>}
                  {rec.cal_method && <span className="tm-item-badge tm-badge-cal">{rec.cal_method}</span>}
                  <span className={rec.status === 'ACTIVE' ? 'tm-badge-status-active' : 'tm-badge-status-inactive'}>{rec.status}</span>
                </div>
              </div>
              <div className="tm-actions">
                <button onClick={() => editOther(rec)}>Edit</button>
                <button className="tm-remove" onClick={() => requestDelete(rec, 'other')}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  /* ─── Main render ─── */
  return (
    <div className="tm-page">
      <style>{css}</style>

      <div className="tm-tabs" role="tablist" aria-label="Tax type">
        <button
          role="tab"
          aria-selected={tab === 'india'}
          className={`tm-tab${tab === 'india' ? ' is-active' : ''}`}
          onClick={() => setTab('india')}
        >
          <span className="tm-tab-dot" />
          India (GST)
        </button>
        <button
          role="tab"
          aria-selected={tab === 'other'}
          className={`tm-tab${tab === 'other' ? ' is-active' : ''}`}
          onClick={() => setTab('other')}
        >
          <span className="tm-tab-dot" />
          Other Countries
        </button>
      </div>

      {tab === 'india' && (
        <div className="tm-grid">
          {renderIndiaForm()}
          {renderIndiaList()}
        </div>
      )}

      {tab === 'other' && (
        <div className="tm-grid">
          {renderOtherForm()}
          {renderOtherList()}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete tax record?"
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

export default TaxMaster
