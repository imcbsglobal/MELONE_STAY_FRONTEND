import { useEffect, useState } from 'react'
import { apiFetch, readApiJson } from '../lib/api'

const css = `
.room-category-page{--rc-green:#235336;--rc-green-dark:#17432b;--rc-gold:#e9a900;--rc-line:#e4ebe5;--rc-muted:#77877d;max-width:1440px;margin:0 auto;color:#1c2b22;font-family:'DM Sans',sans-serif}
.room-category-page *{box-sizing:border-box}
.room-category-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:start;gap:14px}
.room-category-panel{min-width:0;padding:16px;border:1px solid var(--rc-line);border-radius:16px;background:#fff;box-shadow:0 8px 24px rgba(23,67,43,.055)}
.room-category-panel h3{margin:0;color:var(--rc-green-dark);font-size:16px}
.room-category-intro{margin:4px 0 12px;color:var(--rc-muted);font-size:12px}
.room-category-panel-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px;padding-bottom:13px;border-bottom:1px solid #edf1ed}
.room-category-panel-heading .room-category-intro{margin-bottom:0}
.room-category-panel-heading h3{position:relative;padding-left:11px}
.room-category-panel-heading h3::before{position:absolute;top:2px;bottom:2px;left:0;width:3px;border-radius:3px;background:var(--rc-gold);content:''}
.room-category-heading-tools{display:flex;flex-shrink:0;align-items:center;gap:8px}
.room-category-refresh{display:inline-flex;align-items:center;gap:6px;min-height:28px;padding:0 10px;border:1px solid #d5e4da;border-radius:999px;background:#fff;color:var(--rc-green);font:700 11px 'DM Sans',sans-serif;cursor:pointer;transition:background .15s,border-color .15s}
.room-category-refresh:hover:not(:disabled){background:#f3faf5;border-color:#b9d3c0}
.room-category-refresh:disabled{opacity:.7;cursor:wait}
.room-category-refresh:focus-visible{outline:2px solid var(--rc-green);outline-offset:2px}
.room-category-refresh svg.is-spinning{animation:room-category-spin .8s linear infinite}
@keyframes room-category-spin{to{transform:rotate(360deg)}}
.room-category-count{flex-shrink:0;padding:5px 10px;border:1px solid #e5eee7;border-radius:999px;background:#f4f8f4;color:var(--rc-muted);font-size:10px;font-weight:700}
.room-category-count strong{margin-right:4px;color:var(--rc-green);font-size:13px}
.room-category-field label{display:block;margin-bottom:7px;color:#34453a;font-size:11px;font-weight:700}
.room-category-field label span{color:#bd7713}
.room-category-field input{width:100%;height:42px;padding:0 12px;border:1px solid #dce5de;border-radius:9px;outline:0;background:#fff;color:#172a1f;font:12px 'DM Sans',sans-serif;transition:border-color .15s,box-shadow .15s}
.room-category-field input:focus{border-color:var(--rc-green);box-shadow:0 0 0 3px rgba(35,83,54,.11)}
.room-category-form-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:16px;padding-top:14px;border-top:1px solid #edf0ed}
.room-category-form-actions button{min-height:36px;padding:0 14px;border-radius:9px;font:700 11px 'DM Sans',sans-serif;cursor:pointer}
.room-category-cancel{border:1px solid #dfe5e0;background:#fff;color:#68756b}
.room-category-submit{border:1px solid var(--rc-green-dark);background:var(--rc-green-dark);color:#fff;box-shadow:0 4px 10px rgba(23,67,43,.14);transition:background .15s,box-shadow .15s}
.room-category-submit:hover{background:var(--rc-green);box-shadow:0 6px 14px rgba(23,67,43,.2)}
.room-category-submit:disabled{opacity:.6;cursor:wait}
.room-category-error{margin:12px 0 0;padding:10px 12px;border:1px solid #f2d5d0;border-radius:9px;background:#fff7f6;color:#b34d39;font-size:12px}
.room-category-list{max-height:min(640px,calc(100vh - 260px));overflow:auto;border:1px solid #e6ece7;border-radius:12px;background:#fff;scrollbar-width:thin;scrollbar-color:#d1dbd3 transparent}
.room-category-item{display:flex;align-items:center;justify-content:space-between;gap:14px;min-height:64px;padding:12px 16px;border-top:1px solid #eef2ee;transition:background .15s}
.room-category-item:first-child{border-top:0}
.room-category-item:hover{background:#fafcfa}
.room-category-item.is-editing{background:#fff9e8;box-shadow:inset 3px 0 0 var(--rc-gold)}
.room-category-item>div:first-child{min-width:0}
.room-category-item h4{margin:0;overflow:hidden;color:#203a2a;font-size:13px;text-overflow:ellipsis;white-space:nowrap}
.room-category-item small{display:block;margin-top:4px;color:var(--rc-muted);font-size:11px}
.room-category-actions{display:flex;flex-shrink:0;gap:6px}
.room-category-actions button{min-height:30px;padding:0 11px;border:1px solid #d5e4da;border-radius:8px;background:#fff;color:var(--rc-green);font:700 11px 'DM Sans',sans-serif;cursor:pointer;transition:background .15s,border-color .15s}
.room-category-actions button:hover{background:#f3faf5;border-color:#b9d3c0}
.room-category-actions .room-category-remove{border-color:transparent;color:#b5584c}
.room-category-actions .room-category-remove:hover{border-color:#f2d5d0;background:#fff7f6}
.room-category-actions button:focus-visible,.room-category-submit:focus-visible,.room-category-cancel:focus-visible{outline:2px solid var(--rc-green);outline-offset:2px}
.room-category-empty{padding:32px 16px;border:1px dashed #cfddd1;border-radius:11px;background:#fbfdfb;color:var(--rc-muted);text-align:center;font-size:12px}
.room-category-empty strong{display:block;margin-bottom:4px;color:#34453a;font-size:13px}
@media(max-width:900px){.room-category-grid{grid-template-columns:minmax(0,1fr)}.room-category-list{max-height:none}}
@media(max-width:480px){.room-category-item{align-items:flex-start;flex-direction:column}}
@media(prefers-reduced-motion:reduce){.room-category-item,.room-category-actions button,.room-category-submit{transition:none}.room-category-refresh svg.is-spinning{animation-duration:2s}}
`

function RoomCategory({ clientId }) {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    let disposed = false
    const loadCategories = async () => {
      try {
        const response = await apiFetch(`/api/room-categories/list/?client_id=${encodeURIComponent(clientId)}`)
        const data = await readApiJson(response)
        if (!response.ok || !data.success) throw new Error(data.error || 'Failed to load room categories')
        if (!disposed) setCategories(data.categories)
      } catch (loadError) {
        if (!disposed) setError(loadError.message || 'Unable to connect to the server')
      } finally {
        if (!disposed) { setLoading(false); setRefreshing(false) }
      }
    }
    loadCategories()
    return () => { disposed = true }
  }, [clientId, refreshKey])

  const refreshCategories = () => {
    setRefreshing(true)
    setError('')
    setRefreshKey(key => key + 1)
  }

  const resetForm = () => {
    setName('')
    setEditingId(null)
    setError('')
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (!name.trim()) {
      setError('Enter a room category name.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const response = await apiFetch(`/api/room-categories/${editingId ? 'edit' : 'create'}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          name: name.trim(),
          ...(editingId ? { id: editingId } : {}),
        }),
      })
      const data = await readApiJson(response)
      if (!response.ok || !data.success) throw new Error(data.error || 'Unable to save room category')
      setCategories(current => editingId
        ? current.map(category => category.id === data.category.id ? data.category : category)
        : [data.category, ...current])
      resetForm()
    } catch (saveError) {
      setError(saveError.message || 'Unable to connect to the server')
    } finally {
      setSaving(false)
    }
  }

  const editCategory = category => {
    setName(category.name)
    setEditingId(category.id)
    setError('')
  }

  const removeCategory = async category => {
    if (!window.confirm(`Remove room category "${category.name}"?`)) return
    setError('')
    try {
      const response = await apiFetch('/api/room-categories/delete/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: category.id, client_id: clientId }),
      })
      const data = await readApiJson(response)
      if (!response.ok || !data.success) throw new Error(data.error || 'Unable to remove room category')
      setCategories(current => current.filter(item => item.id !== category.id))
      if (editingId === category.id) resetForm()
    } catch (removeError) {
      setError(removeError.message || 'Unable to connect to the server')
    }
  }

  return (
    <div className="room-category-page">
      <style>{css}</style>
      <div className="room-category-grid">
        <section className="room-category-panel">
          <h3>{editingId ? 'Edit room category' : 'Add a room category'}</h3>
          <p className="room-category-intro">Create categories such as Standard, Deluxe or Suite. They appear in the Room Master category dropdown.</p>
          <form onSubmit={handleSubmit}>
            <div className="room-category-field">
              <label htmlFor="room-category-name">Category name <span aria-hidden="true">*</span></label>
              <input id="room-category-name" value={name} onChange={event => { setName(event.target.value); setError('') }} maxLength={100} placeholder="e.g. Deluxe" required />
            </div>
            {error && <p className="room-category-error" role="alert">{error}</p>}
            <div className="room-category-form-actions">
              <button className="room-category-cancel" type="button" onClick={resetForm}>Cancel</button>
              <button className="room-category-submit" type="submit" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Save changes' : 'Add category'}</button>
            </div>
          </form>
        </section>

        <section className="room-category-panel">
          <header className="room-category-panel-heading">
            <div><h3>Categories</h3><p className="room-category-intro">Room categories created for your property.</p></div>
            <div className="room-category-heading-tools">
              <button type="button" className="room-category-refresh" onClick={refreshCategories} disabled={refreshing || loading} aria-label="Refresh categories" title="Refresh categories">
                <svg className={refreshing ? "is-spinning" : ""} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg>
                Refresh
              </button>
              <span className="room-category-count"><strong>{categories.length}</strong>{categories.length === 1 ? 'category' : 'categories'}</span>
            </div>
          </header>
          {loading ? <div className="room-category-empty">Loading categories…</div> : categories.length === 0 ? (
            <div className="room-category-empty"><strong>No categories yet</strong>Add your first category using the form.</div>
          ) : (
            <div className="room-category-list">
              {categories.map(category => (
                <article className={`room-category-item${editingId === category.id ? ' is-editing' : ''}`} key={category.id}>
                  <div><h4 title={category.name}>{category.name}</h4><small>{category.room_count} {category.room_count === 1 ? 'room' : 'rooms'} use this category</small></div>
                  <div className="room-category-actions">
                    <button type="button" onClick={() => editCategory(category)} aria-label={`Edit ${category.name}`}>Edit</button>
                    <button type="button" className="room-category-remove" onClick={() => removeCategory(category)} aria-label={`Remove ${category.name}`}>Remove</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default RoomCategory