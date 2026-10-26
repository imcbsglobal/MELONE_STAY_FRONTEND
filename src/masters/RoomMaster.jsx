import { useEffect, useRef, useState } from 'react'
import { apiFetch, readApiJson } from '../lib/api'

const emptyForm = () => ({
  code: '',
  name: '',
  category: '',
  air_conditioning: 'AC',
  floor: '',
  tax: '0',
  prices: [{ amount: '' }],
})

const ADD_FLOOR_OPTION = '__add_more_floor__'

const styles = `
.room-master-page{--room-green:#235336;--room-green-dark:#17432b;--room-gold:#e9a900;--room-line:#e4ebe5;--room-muted:#77877d;max-width:1440px;margin:0 auto;color:#1c2b22;font-family:'DM Sans',sans-serif}
.room-master-page *{box-sizing:border-box}
.room-master-grid{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(320px,1fr);align-items:start;gap:14px}
.room-master-panel{min-width:0;padding:16px;border:1px solid var(--room-line);border-radius:16px;background:#fff;box-shadow:0 8px 24px rgba(23,67,43,.055)}
.room-master-form{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:start;gap:12px}
.room-master-form h3,.room-master-form>.room-master-panel-intro,.room-master-form>.room-master-fields,.room-master-form>.room-master-prices,.room-master-form>.room-master-error,.room-master-form>.room-master-form-actions{grid-column:1/-1}
.room-master-panel h3{margin:0;color:var(--room-green-dark);font-size:16px}
.room-master-panel-intro{margin:4px 0 12px;color:var(--room-muted);font-size:12px}
.room-master-panel-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px;padding-bottom:13px;border-bottom:1px solid #edf1ed}
.room-master-panel-heading h3{position:relative;padding-left:11px}
.room-master-panel-heading h3::before{position:absolute;top:2px;bottom:2px;left:0;width:3px;border-radius:3px;background:var(--room-gold);content:''}
.room-master-count{flex-shrink:0;padding:5px 10px;border:1px solid #e5eee7;border-radius:999px;background:#f4f8f4;color:var(--room-muted);font-size:10px;font-weight:700}
.room-master-count strong{margin-right:4px;color:var(--room-green);font-size:13px}
.room-master-fields{display:contents}
.room-master-field{min-width:0}
.room-master-field label{display:block;margin-bottom:7px;color:#34453a;font-size:11px;font-weight:700}
.room-master-field label span{color:#bd7713}
.room-master-field input,.room-master-field select{width:100%;height:42px;padding:0 12px;border:1px solid #dce5de;border-radius:9px;outline:0;background:#fff;color:#172a1f;font:12px 'DM Sans',sans-serif;transition:border-color .15s,box-shadow .15s}
.room-master-field input:focus,.room-master-field select:focus{border-color:var(--room-green);box-shadow:0 0 0 3px rgba(35,83,54,.11)}
.room-master-add-floor{display:flex;gap:8px;margin-top:8px}
.room-master-add-floor input{flex:1;min-width:0}
.room-master-add-floor button{padding:0 12px;border:1px solid #d5e4da;border-radius:9px;background:#f3faf5;color:var(--room-green);font-size:11px;font-weight:700;white-space:nowrap}
.room-master-radio-group{display:flex;gap:9px}
.room-master-radio-group label{display:flex;align-items:center;gap:8px;flex:1;margin:0;padding:11px;border:1px solid #e2e8e3;border-radius:9px;cursor:pointer;transition:border-color .15s,background .15s}
.room-master-radio-group label.selected{border-color:#80a58a;background:#f3f8f3}
.room-master-radio-group input{width:auto;height:auto;margin:0;accent-color:var(--room-green)}
.room-master-prices{margin-top:0;padding-top:12px;border-top:1px solid #edf0ed}
.room-master-prices-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.room-master-prices-header h4{margin:0;color:var(--room-green-dark);font-size:13px}
.room-master-price-fields{display:flex;align-items:center;gap:10px;max-width:100%;overflow-x:auto;padding:2px 2px 8px;scrollbar-width:thin}
.room-master-price-row{display:flex;flex:1 0 150px;align-items:center;gap:6px;min-width:0}
.room-master-price-row .room-master-field{flex:1;min-width:110px}
.room-master-price-remove{height:42px;border:1px solid #f0dbd5;border-radius:9px;background:#fff;color:#b55d48;font-size:20px}
.room-master-add-price{flex:0 0 auto;padding:8px 10px;border:1px solid #d5e4da;border-radius:9px;background:#f3faf5;color:var(--room-green);font-size:11px;font-weight:700;white-space:nowrap}
.room-master-error{margin:12px 0 0;padding:10px 12px;border:1px solid #f2d5d0;border-radius:9px;background:#fff7f6;color:#b34d39;font-size:12px}
.room-master-form-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:0;padding-top:14px;border-top:1px solid #edf0ed}
.room-master-form-actions button{min-height:36px;padding:0 14px;border-radius:9px;font-size:11px;font-weight:700}
.room-master-cancel{border:1px solid #dfe5e0;background:#fff;color:#68756b}
.room-master-save{border:1px solid var(--room-green-dark);background:var(--room-green-dark);color:#fff;box-shadow:0 4px 10px rgba(23,67,43,.14);transition:background .15s,box-shadow .15s}
.room-master-save:hover{background:var(--room-green);box-shadow:0 6px 14px rgba(23,67,43,.2)}
.room-master-save:disabled{opacity:.6;cursor:wait}
.room-master-empty{padding:32px 16px;border:1px dashed #cfddd1;border-radius:11px;background:#fbfdfb;color:var(--room-muted);text-align:center;font-size:12px}
.room-master-loading{padding:18px;color:var(--room-muted);font-size:12px}
@media(max-width:1050px){.room-master-grid{grid-template-columns:minmax(0,1fr)}.room-table-body{max-height:none}}
@media(max-width:760px){.room-master-form{grid-template-columns:repeat(2,minmax(0,1fr))}.room-master-form h3,.room-master-form>.room-master-panel-intro,.room-master-form>.room-master-fields,.room-master-form>.room-master-prices,.room-master-form>.room-master-error,.room-master-form>.room-master-form-actions{grid-column:1/-1}}
@media(max-width:600px){.room-master-panel{padding:15px}.room-master-form{grid-template-columns:minmax(0,1fr);gap:13px}.room-master-price-fields{gap:8px}.room-master-price-row{flex-basis:145px;gap:5px}.room-master-price-remove{height:42px}}

.room-list-panel{container-type:inline-size}
.room-master-heading-tools{display:flex;flex-shrink:0;align-items:center;gap:8px}
.room-master-refresh{display:inline-flex;align-items:center;gap:6px;min-height:28px;padding:0 10px;border:1px solid #d5e4da;border-radius:999px;background:#fff;color:var(--room-green);font:700 11px 'DM Sans',sans-serif;cursor:pointer;transition:background .15s,border-color .15s}
.room-master-refresh:hover:not(:disabled){background:#f3faf5;border-color:#b9d3c0}
.room-master-refresh:disabled{opacity:.7;cursor:wait}
.room-master-refresh:focus-visible{outline:2px solid var(--room-green);outline-offset:2px}
.room-master-refresh svg.is-spinning{animation:room-refresh-spin .8s linear infinite}
@keyframes room-refresh-spin{to{transform:rotate(360deg)}}
.room-list-search{position:relative;margin-bottom:12px}
.room-list-search input{width:100%;height:38px;padding:0 12px 0 34px;border:1px solid #dce5de;border-radius:9px;outline:0;background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='15' height='15' fill='none' stroke='%2377877d' stroke-width='2' stroke-linecap='round' viewBox='0 0 24 24'%3E%3Ccircle cx='11' cy='11' r='7'/%3E%3Cpath d='m20 20-3.5-3.5'/%3E%3C/svg%3E") no-repeat 11px center;color:#172a1f;font:12px 'DM Sans',sans-serif}
.room-list-search input:focus{border-color:var(--room-green);box-shadow:0 0 0 3px rgba(35,83,54,.11)}
.room-table{border:1px solid #e6ece7;border-radius:12px;overflow:hidden;background:#fff}
.room-table-head,.room-row{display:grid;grid-template-columns:minmax(0,1.9fr) minmax(0,1.1fr) 56px minmax(96px,1fr);align-items:center;gap:12px;padding:0 16px}
.room-table-head{min-height:38px;background:#f5f8f5;color:var(--room-muted);font-size:11px;font-weight:700}
.room-table-body{max-height:min(640px,calc(100vh - 300px));overflow:auto;scrollbar-width:thin;scrollbar-color:#d1dbd3 transparent}
.room-row{min-height:68px;padding-top:12px;padding-bottom:12px;border-top:1px solid #eef2ee;font-size:12px;transition:background .15s}
.room-table-body .room-row:first-child{border-top:0}
.room-row:hover{background:#fafcfa}
.room-row.is-editing{background:#fff9e8;box-shadow:inset 3px 0 0 var(--room-gold)}
.room-cell-name{min-width:0}
.room-name{overflow:hidden;color:#203a2a;font-size:13px;font-weight:700;text-overflow:ellipsis;white-space:nowrap}
.room-sub{display:flex;align-items:center;gap:8px;margin-top:4px;color:var(--room-muted);font-size:11px}
.room-badge{display:inline-flex;align-items:center;height:18px;padding:0 7px;border-radius:5px;background:#edf5ee;color:#285b37;font-size:10px;font-weight:700}
.room-badge.is-non-ac{background:#f1f2f1;color:#6a766e}
.room-cell-text{min-width:0;overflow:hidden;color:#34453a;text-overflow:ellipsis;white-space:nowrap}
.room-cell-rate{text-align:right}
.room-rate{display:block;color:#17432b;font-size:13px;font-weight:700;font-variant-numeric:tabular-nums}
.room-rate+.room-rate{margin-top:2px}
.room-tax{display:block;margin-top:3px;color:var(--room-muted);font-size:10px}
.room-list-search input:focus-visible{outline:2px solid var(--room-green);outline-offset:2px}
.room-master-empty{padding:32px 16px;border:1px dashed #cfddd1;border-radius:11px;background:#fbfdfb;color:var(--room-muted);text-align:center;font-size:12px}
.room-master-empty strong{display:block;margin-bottom:4px;color:#34453a;font-size:13px}
@container (max-width:560px){
  .room-table-head{display:none}
  .room-row{grid-template-columns:auto auto minmax(0,1fr);grid-template-areas:'name name rate' 'cat floor floor';gap:8px 18px;padding:14px}
  .room-cell-name{grid-area:name}
  .room-cell-rate{grid-area:rate}
  .room-cell-text{display:block}
  .room-cell-text:nth-child(2){grid-area:cat}
  .room-cell-text:nth-child(3){grid-area:floor}
  .room-cell-text::before{content:attr(data-label) ': ';color:var(--room-muted)}
  }
@media (prefers-reduced-motion:reduce){.room-row{transition:none}.room-master-refresh svg.is-spinning{animation-duration:2s}}
`

function RoomMaster({ clientId, editRoomId, onNavigate }) {
  const [form, setForm] = useState(emptyForm)
  const [rooms, setRooms] = useState([])
  const [categories, setCategories] = useState([])
  const [additionalFloors, setAdditionalFloors] = useState([])
  const [floorInput, setFloorInput] = useState('')
  const [isAddingFloor, setIsAddingFloor] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [query, setQuery] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const lastLoadedEditId = useRef(null)
  const floors = [...new Set([...rooms.map(room => room.floor.trim()), ...additionalFloors].filter(Boolean))]

  const visibleRooms = rooms.filter(room => {
    const term = query.trim().toLowerCase()
    return !term || [room.code, room.name, room.category_name, room.floor].some(value => String(value ?? '').toLowerCase().includes(term))
  })
  const formatAmount = amount => `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`

  useEffect(() => {
    let disposed = false
    const loadData = async () => {
      try {
        const query = `?client_id=${encodeURIComponent(clientId)}`
        const [roomResponse, categoryResponse] = await Promise.all([
          apiFetch(`/api/room-master/list/${query}`),
          apiFetch(`/api/room-categories/list/${query}`),
        ])
        const [roomData, categoryData] = await Promise.all([readApiJson(roomResponse), readApiJson(categoryResponse)])
        if (!roomResponse.ok || !roomData.success) throw new Error(roomData.error || 'Failed to load rooms')
        if (!categoryResponse.ok || !categoryData.success) throw new Error(categoryData.error || 'Failed to load room categories')
        if (!disposed) {
          setRooms(roomData.rooms)
          setCategories(categoryData.categories)
        }
      } catch (loadError) {
        if (!disposed) setError(loadError.message || 'Unable to connect to the server')
      } finally {
        if (!disposed) { setLoading(false); setRefreshing(false) }
      }
    }
    loadData()
    return () => { disposed = true }
  }, [clientId, refreshKey])

  const refreshRooms = () => {
    setRefreshing(true)
    setError('')
    setRefreshKey(key => key + 1)
  }

  const updateForm = (field, value) => {
    setForm(current => ({ ...current, [field]: value }))
    setError('')
  }

  const updatePrice = (index, value) => {
    setForm(current => ({
      ...current,
      prices: current.prices.map((price, priceIndex) => priceIndex === index ? { amount: value } : price),
    }))
    setError('')
  }

  const resetForm = () => {
    setForm(emptyForm())
    setEditingId(null)
    setFloorInput('')
    setIsAddingFloor(false)
    setError('')
    if (editRoomId) onNavigate('/member/room-master')
  }

  const addFloor = () => {
    const floor = floorInput.trim()
    if (!floor) {
      setError('Enter a floor name to add it.')
      return
    }
    const existingFloor = floors.find(option => option.toLowerCase() === floor.toLowerCase())
    const selectedFloor = existingFloor || floor
    if (!existingFloor) setAdditionalFloors(current => [...current, floor])
    setForm(current => ({ ...current, floor: selectedFloor }))
    setFloorInput('')
    setIsAddingFloor(false)
    setError('')
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (!form.category) {
      setError('Create a room category before adding a room.')
      return
    }
    if (!form.prices.length || form.prices.some(price => price.amount === '' || !Number.isFinite(Number(price.amount)) || Number(price.amount) < 0)) {
      setError('Enter a valid non-negative amount for each room price.')
      return
    }

    setSaving(true)
    setError('')
    const payload = {
      client_id: clientId,
      code: form.code.trim(),
      name: form.name.trim(),
      category_id: Number(form.category),
      air_conditioning: form.air_conditioning,
      floor: form.floor.trim(),
      tax: form.tax,
      prices: form.prices.map(price => ({ amount: price.amount })),
    }
    try {
      const response = await apiFetch(`/api/room-master/${editingId ? 'edit' : 'create'}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { ...payload, id: editingId } : payload),
      })
      const data = await readApiJson(response)
      if (!response.ok || !data.success) throw new Error(data.error || 'Unable to save room')
      setRooms(current => editingId
        ? current.map(room => room.id === data.room.id ? data.room : room)
        : [data.room, ...current])
      resetForm()
    } catch (saveError) {
      setError(saveError.message || 'Unable to connect to the server')
    } finally {
      setSaving(false)
    }
  }

  const editRoom = room => {
    setForm({
      code: room.code,
      name: room.name,
      category: String(room.category_id),
      air_conditioning: room.air_conditioning,
      floor: room.floor,
      tax: String(room.tax),
      prices: room.prices.map(price => ({ amount: String(price.amount) })),
    })
    setEditingId(room.id)
    setError('')
  }

  useEffect(() => {
    if (!editRoomId) {
      lastLoadedEditId.current = null
      return
    }
    if (loading || lastLoadedEditId.current === editRoomId) return
    const room = rooms.find(item => String(item.id) === editRoomId)
    if (!room) {
      setError('Room not found. It may have been removed.')
      lastLoadedEditId.current = editRoomId
      return
    }
    editRoom(room)
    lastLoadedEditId.current = editRoomId
  }, [editRoomId, loading, rooms])

  return (
    <div className="room-master-page">
      <style>{styles}</style>
      <div className="room-master-grid">
        <form className="room-master-panel room-master-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit room' : 'Add a room'}</h3>
          <p className="room-master-panel-intro">Set up room details and rates for your property.</p>
          <div className="room-master-fields">
            <div className="room-master-field"><label htmlFor="room-code">Code <span>*</span></label><input id="room-code" value={form.code} onChange={event => updateForm('code', event.target.value)} maxLength={30} placeholder="e.g. DLX-01" required /></div>
            <div className="room-master-field"><label htmlFor="room-name">Name <span>*</span></label><input id="room-name" value={form.name} onChange={event => updateForm('name', event.target.value)} maxLength={120} placeholder="e.g. Deluxe King" required /></div>
            <div className="room-master-field"><label htmlFor="room-category">Category <span>*</span></label><select id="room-category" value={form.category} onChange={event => updateForm('category', event.target.value)} required><option value="">Select a category</option>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>
            <div className="room-master-field">
              <label htmlFor="room-floor">Floor <span>*</span></label>
              <select
                id="room-floor"
                value={isAddingFloor ? ADD_FLOOR_OPTION : form.floor}
                onChange={event => {
                  if (event.target.value === ADD_FLOOR_OPTION) {
                    setIsAddingFloor(true)
                    setFloorInput('')
                  } else {
                    setIsAddingFloor(false)
                    updateForm('floor', event.target.value)
                  }
                }}
                required={!isAddingFloor}
              >
                <option value="">Select a floor</option>
                {floors.map(floor => <option key={floor} value={floor}>{floor}</option>)}
                <option value={ADD_FLOOR_OPTION}>+ Add More</option>
              </select>
              {isAddingFloor && (
                <div className="room-master-add-floor">
                  <input
                    aria-label="New floor name"
                    autoFocus
                    value={floorInput}
                    onChange={event => { setFloorInput(event.target.value); setError('') }}
                    onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); addFloor() } }}
                    maxLength={60}
                    placeholder="Enter a floor name"
                  />
                  <button type="button" onClick={addFloor}>Add floor</button>
                </div>
              )}
            </div>
            <div className="room-master-field"><label htmlFor="room-tax">Tax (%) <span>*</span></label><input id="room-tax" type="number" min="0" max="100" step="0.01" value={form.tax} onChange={event => updateForm('tax', event.target.value)} required /></div>
            <fieldset className="room-master-field" style={{ border: 0, padding: 0, margin: 0 }}>
              <legend style={{ marginBottom: 7, color: '#354238', fontSize: 11, fontWeight: 700 }}>Air conditioning <span>*</span></legend>
              <div className="room-master-radio-group">{['AC', 'Non-AC'].map(option => <label key={option} className={form.air_conditioning === option ? 'selected' : ''}><input type="radio" name="room-air-conditioning" value={option} checked={form.air_conditioning === option} onChange={() => updateForm('air_conditioning', option)} />{option}</label>)}</div>
            </fieldset>
          </div>

          <section className="room-master-prices">
            <div className="room-master-prices-header"><h4>Room pricing</h4></div>
            <div className="room-master-price-fields">
              {form.prices.map((price, index) => (
                <div className="room-master-price-row" key={index}>
                  <div className="room-master-field"><input aria-label={`Room amount ${index + 1}`} type="number" min="0" step="0.01" value={price.amount} onChange={event => updatePrice(index, event.target.value)} placeholder="₹ 0.00" required /></div>
                  {form.prices.length > 1 && <button className="room-master-price-remove" type="button" aria-label={`Remove price ${index + 1}`} onClick={() => setForm(current => ({ ...current, prices: current.prices.filter((_, priceIndex) => priceIndex !== index) }))}>×</button>}
                </div>
              ))}
              <button className="room-master-add-price" type="button" onClick={() => setForm(current => ({ ...current, prices: [...current.prices, { amount: '' }] }))}>+ Add More</button>
            </div>
          </section>
          {categories.length === 0 && !loading && <p className="room-master-error">No room categories found. Add a category from Room Category first.</p>}
          {error && <p className="room-master-error" role="alert">{error}</p>}
          <div className="room-master-form-actions"><button className="room-master-cancel" type="button" onClick={resetForm}>Cancel</button><button className="room-master-save" type="submit" disabled={saving || categories.length === 0}>{saving ? 'Saving…' : editingId ? 'Save changes' : 'Add room'}</button></div>
        </form>

        <section className="room-master-panel room-list-panel">
          <header className="room-master-panel-heading">
            <div><h3>Rooms</h3><p className="room-master-panel-intro">Rooms and prices configured for your property.</p></div>
            <div className="room-master-heading-tools">
              <button type="button" className="room-master-refresh" onClick={refreshRooms} disabled={refreshing || loading} aria-label="Refresh rooms" title="Refresh rooms">
                <svg className={refreshing ? "is-spinning" : ""} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg>
                Refresh
              </button>
              <span className="room-master-count"><strong>{rooms.length}</strong>{rooms.length === 1 ? 'room' : 'rooms'}</span>
            </div>
          </header>
          {loading ? <div className="room-master-loading">Loading rooms…</div> : rooms.length === 0 ? (
            <div className="room-master-empty"><strong>No rooms yet</strong>Add your first room using the form.</div>
          ) : (
            <>
              <div className="room-list-search">
                <input type="search" aria-label="Search rooms" placeholder="Search by name, code, category or floor" value={query} onChange={event => setQuery(event.target.value)} />
              </div>
              {visibleRooms.length === 0 ? (
                <div className="room-master-empty"><strong>No matching rooms</strong>Try a different name, code or floor.</div>
              ) : (
                <div className="room-table" role="table" aria-label="Rooms">
                  <div className="room-table-head" role="row">
                    <span role="columnheader">Room</span>
                    <span role="columnheader">Category</span>
                    <span role="columnheader">Floor</span>
                    <span role="columnheader" style={{ textAlign: 'right' }}>Rate</span>
                  </div>
                  <div className="room-table-body">
                    {visibleRooms.map(room => (
                      <article className={`room-row${editingId === room.id ? ' is-editing' : ''}`} role="row" key={room.id}>
                        <div className="room-cell-name" role="cell">
                          <div className="room-name" title={room.name}>{room.name}</div>
                          <div className="room-sub">
                            <span>{room.code}</span>
                            <span className={`room-badge${room.air_conditioning === 'AC' ? '' : ' is-non-ac'}`}>{room.air_conditioning}</span>
                          </div>
                        </div>
                        <div className="room-cell-text" role="cell" data-label="Category" title={room.category_name}>{room.category_name}</div>
                        <div className="room-cell-text" role="cell" data-label="Floor">{room.floor}</div>
                        <div className="room-cell-rate" role="cell">
                          {room.prices.map(price => <span className="room-rate" key={price.id}>{formatAmount(price.amount)}</span>)}
                          <span className="room-tax">+ {Number(room.tax)}% tax</span>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}

export default RoomMaster