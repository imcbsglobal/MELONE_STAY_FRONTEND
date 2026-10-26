import { useEffect, useMemo, useState } from 'react'
import { apiFetch, readApiJson } from '../../lib/api'

const styles = `
.rooms-list-page{--rooms-green:#235336;--rooms-green-dark:#17432b;--rooms-gold:#e9a900;--rooms-line:#e4ebe5;--rooms-muted:#77877d;max-width:1440px;margin:0 auto;color:#1c2b22;font-family:'DM Sans',sans-serif}
.rooms-list-page *{box-sizing:border-box}
.rooms-list-panel{min-width:0;padding:20px;border:1px solid var(--rooms-line);border-radius:16px;background:#fff;box-shadow:0 8px 24px rgba(23,67,43,.055)}
.rooms-list-heading{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid #edf1ed}
.rooms-list-heading h2{position:relative;margin:0;padding-left:11px;color:var(--rooms-green-dark);font-size:17px}
.rooms-list-heading h2::before{position:absolute;top:2px;bottom:2px;left:0;width:3px;border-radius:3px;background:var(--rooms-gold);content:''}
.rooms-list-heading p{margin:5px 0 0;color:var(--rooms-muted);font-size:12px}
.rooms-list-tools{display:flex;flex-shrink:0;align-items:center;gap:9px}
.rooms-list-count{padding:5px 10px;border:1px solid #e5eee7;border-radius:999px;background:#f4f8f4;color:var(--rooms-muted);font-size:10px;font-weight:700}
.rooms-list-count strong{margin-right:4px;color:var(--rooms-green);font-size:13px}
.rooms-list-refresh,.rooms-list-add{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:34px;padding:0 12px;border:1px solid #d5e4da;border-radius:9px;background:#fff;color:var(--rooms-green);font:700 11px 'DM Sans',sans-serif;cursor:pointer;transition:background .15s,border-color .15s}
.rooms-list-refresh:hover:not(:disabled){background:#f3faf5;border-color:#b9d3c0}
.rooms-list-refresh:disabled{opacity:.7;cursor:wait}
.rooms-list-add{border-color:var(--rooms-green-dark);background:var(--rooms-green-dark);color:#fff}
.rooms-list-add:hover{background:var(--rooms-green)}
.rooms-list-refresh:focus-visible,.rooms-list-add:focus-visible,.rooms-list-search input:focus-visible{outline:2px solid var(--rooms-green);outline-offset:2px}
.rooms-list-search{position:relative;margin-bottom:14px}
.rooms-list-search input{width:100%;height:40px;padding:0 12px 0 36px;border:1px solid #dce5de;border-radius:9px;outline:0;background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='15' height='15' fill='none' stroke='%2377877d' stroke-width='2' stroke-linecap='round' viewBox='0 0 24 24'%3E%3Ccircle cx='11' cy='11' r='7'/%3E%3Cpath d='m20 20-3.5-3.5'/%3E%3C/svg%3E") no-repeat 12px center;color:#172a1f;font:12px 'DM Sans',sans-serif}
.rooms-list-search input:focus{border-color:var(--rooms-green);box-shadow:0 0 0 3px rgba(35,83,54,.11)}
.rooms-list-table-wrap{overflow-x:auto;border:1px solid #e6ece7;border-radius:12px}
.rooms-list-table{width:100%;border-collapse:collapse;text-align:left}
.rooms-list-table th{padding:12px 14px;background:#f5f8f5;color:var(--rooms-muted);font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;white-space:nowrap}
.rooms-list-table td{padding:13px 14px;border-top:1px solid #eef2ee;color:#34453a;font-size:12px;white-space:nowrap}
.rooms-list-table td:first-child{color:#17432b;font-weight:700}
.rooms-list-table th:last-child,.rooms-list-table td:last-child{width:1%;padding-right:16px;text-align:right}
.rooms-list-table th:first-child,.rooms-list-table td:first-child{padding-left:18px}
.rooms-list-code{display:block;margin-top:4px;color:var(--rooms-muted);font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:10px;font-weight:500}
.rooms-list-badge{display:inline-flex;align-items:center;height:21px;padding:0 8px;border-radius:6px;background:#edf5ee;color:#285b37;font-size:10px;font-weight:700}
.rooms-list-badge.is-non-ac{background:#f1f2f1;color:#6a766e}
.rooms-list-rate{display:block;color:var(--rooms-green-dark);font-weight:700;font-variant-numeric:tabular-nums}
.rooms-list-tax{display:block;margin-top:3px;color:var(--rooms-muted);font-size:10px}
.rooms-list-actions{display:flex;align-items:center;justify-content:flex-end;gap:6px}
.rooms-list-actions button{min-height:30px;padding:0 10px;border:1px solid #d5e4da;border-radius:8px;background:#fff;color:var(--rooms-green);font:700 11px 'DM Sans',sans-serif;cursor:pointer}
.rooms-list-actions button:hover:not(:disabled){background:#f3faf5}
.rooms-list-actions button:disabled{opacity:.6;cursor:wait}
.rooms-list-actions .rooms-list-favorite{display:grid;place-items:center;width:32px;padding:0;color:#9aa69d}
.rooms-list-actions .rooms-list-favorite.is-favorite{border-color:#f0d994;background:#fff9e8;color:#c28b00}
.rooms-list-actions .rooms-list-delete{border-color:transparent;color:#b5584c}
.rooms-list-actions .rooms-list-delete:hover:not(:disabled){border-color:#f2d5d0;background:#fff7f6}
.rooms-list-actions button:focus-visible{outline:2px solid var(--rooms-green);outline-offset:2px}
.rooms-list-empty{padding:36px 16px;border:1px dashed #cfddd1;border-radius:11px;background:#fbfdfb;color:var(--rooms-muted);text-align:center;font-size:12px}
.rooms-list-empty strong{display:block;margin-bottom:4px;color:#34453a;font-size:13px}
.rooms-list-error{margin:0 0 14px;padding:11px 13px;border:1px solid #f2d5d0;border-radius:9px;background:#fff7f6;color:#b34d39;font-size:12px}
@media(max-width:720px){.rooms-list-panel{padding:15px}.rooms-list-heading{align-items:flex-start;flex-direction:column}.rooms-list-tools{width:100%;justify-content:flex-start}.rooms-list-table{min-width:840px}}
@media(prefers-reduced-motion:reduce){.rooms-list-refresh,.rooms-list-add{transition:none}}
`

function RoomsList({ clientId, onNavigate }) {
  const [rooms, setRooms] = useState([])
  const [query, setQuery] = useState('')
  const [pendingRoomIds, setPendingRoomIds] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let disposed = false
    const loadRooms = async () => {
      setError('')
      try {
        const response = await apiFetch(`/api/room-master/list/?client_id=${encodeURIComponent(clientId)}`)
        const data = await readApiJson(response)
        if (!response.ok || !data.success) throw new Error(data.error || 'Failed to load rooms')
        if (!disposed) setRooms(data.rooms)
      } catch (loadError) {
        if (!disposed) setError(loadError.message || 'Unable to connect to the server')
      } finally {
        if (!disposed) {
          setLoading(false)
          setRefreshing(false)
        }
      }
    }
    loadRooms()
    return () => { disposed = true }
  }, [clientId, refreshKey])

  const visibleRooms = useMemo(() => {
    const term = query.trim().toLowerCase()
    return rooms.filter(room => {
      const matchesSearch = !term || [room.code, room.name, room.category_name, room.floor, room.air_conditioning]
        .some(value => String(value ?? '').toLowerCase().includes(term))
      return matchesSearch
    })
  }, [query, rooms])

  const refreshRooms = () => {
    setRefreshing(true)
    setError('')
    setRefreshKey(key => key + 1)
  }

  const formatAmount = amount => `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`

  const toggleFavorite = async room => {
    const isFavorite = !room.is_favorite
    setPendingRoomIds(current => [...current, room.id])
    setError('')
    try {
      const response = await apiFetch('/api/room-master/favorite/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: room.id, client_id: clientId, is_favorite: isFavorite }),
      })
      const data = await readApiJson(response)
      if (!response.ok || !data.success) throw new Error(data.error || 'Unable to update favorite')
      setRooms(current => current.map(item => item.id === data.room.id ? data.room : item))
    } catch (favoriteError) {
      setError(favoriteError.message || 'Unable to connect to the server')
    } finally {
      setPendingRoomIds(current => current.filter(id => id !== room.id))
    }
  }

  const deleteRoom = async room => {
    if (!window.confirm(`Delete room "${room.name}"? This cannot be undone.`)) return
    setPendingRoomIds(current => [...current, room.id])
    setError('')
    try {
      const response = await apiFetch('/api/room-master/delete/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: room.id, client_id: clientId }),
      })
      const data = await readApiJson(response)
      if (!response.ok || !data.success) throw new Error(data.error || 'Unable to delete room')
      setRooms(current => current.filter(item => item.id !== room.id))
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to connect to the server')
    } finally {
      setPendingRoomIds(current => current.filter(id => id !== room.id))
    }
  }

  return (
    <div className="rooms-list-page">
      <style>{styles}</style>
      <section className="rooms-list-panel">
        <header className="rooms-list-heading">
          <div>
            <h2>Rooms List</h2>
            <p>Browse the rooms configured for your property.</p>
          </div>
          <div className="rooms-list-tools">
            <span className="rooms-list-count"><strong>{rooms.length}</strong>{rooms.length === 1 ? 'room' : 'rooms'}</span>
            <button type="button" className="rooms-list-refresh" onClick={refreshRooms} disabled={refreshing || loading} aria-label="Refresh rooms">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg>
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
            <button type="button" className="rooms-list-add" onClick={() => onNavigate('/member/room-master')}>Add room</button>
          </div>
        </header>

        {error && <p className="rooms-list-error" role="alert">{error}</p>}
        <div className="rooms-list-search">
          <input type="search" aria-label="Search rooms" placeholder="Search by room name, code, category or floor" value={query} onChange={event => setQuery(event.target.value)} />
        </div>

        {loading ? (
          <div className="rooms-list-empty" role="status">Loading rooms…</div>
        ) : error && rooms.length === 0 ? (
          <div className="rooms-list-empty">Unable to load rooms. Use Refresh to try again.</div>
        ) : rooms.length === 0 ? (
          <div className="rooms-list-empty"><strong>No rooms yet</strong>Add rooms using Room Master to see them here.</div>
        ) : visibleRooms.length === 0 ? (
          <div className="rooms-list-empty"><strong>No matching rooms</strong>Try a different search.</div>
        ) : (
          <div className="rooms-list-table-wrap">
            <table className="rooms-list-table">
              <thead>
                <tr>
                  <th scope="col">Room</th>
                  <th scope="col">Category</th>
                  <th scope="col">Floor</th>
                  <th scope="col">Air conditioning</th>
                  <th scope="col">Rate</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleRooms.map(room => (
                  <tr key={room.id}>
                    <td>{room.name}<span className="rooms-list-code">{room.code}</span></td>
                    <td>{room.category_name}</td>
                    <td>{room.floor}</td>
                    <td><span className={`rooms-list-badge${room.air_conditioning === 'AC' ? '' : ' is-non-ac'}`}>{room.air_conditioning}</span></td>
                    <td>
                      {room.prices.map(price => <span className="rooms-list-rate" key={price.id}>{formatAmount(price.amount)}</span>)}
                      <span className="rooms-list-tax">+ {Number(room.tax)}% tax</span>
                    </td>
                    <td>
                      <div className="rooms-list-actions">
                        <button
                          type="button"
                          className={`rooms-list-favorite${room.is_favorite ? ' is-favorite' : ''}`}
                          onClick={() => toggleFavorite(room)}
                          disabled={pendingRoomIds.includes(room.id)}
                          aria-label={room.is_favorite ? `Remove ${room.name} from favorites` : `Add ${room.name} to favorites`}
                          aria-pressed={Boolean(room.is_favorite)}
                          title={room.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill={room.is_favorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 3 2.75 5.58 6.16.9-4.45 4.34 1.05 6.14L12 17.06l-5.51 2.9 1.05-6.14L3.09 9.48l6.16-.9L12 3Z" /></svg>
                        </button>
                        <button type="button" onClick={() => onNavigate(`/member/room-master/${room.id}`)} disabled={pendingRoomIds.includes(room.id)}>Edit</button>
                        <button type="button" className="rooms-list-delete" onClick={() => deleteRoom(room)} disabled={pendingRoomIds.includes(room.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default RoomsList