import { useState, useEffect } from 'react'

const styles = String.raw`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
.activity-log-wrapper { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #ffffff; min-height: 100vh; padding: 20px 32px; }
.activity-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.activity-icon { width: 40px; height: 40px; border-radius: 8px; background: transparent; display: flex; align-items: center; justify-content: center; color: #16a34a; }
.activity-icon svg { width: 28px; height: 28px; }
.activity-header-text h1 { font-size: 24px; font-weight: 600; color: #1f2937; margin-bottom: 2px; }
.activity-header-text p { font-size: 13px; color: #9ca3af; }
.activity-actions { display: flex; justify-content: space-between; align-items: center; margin: 0 0 16px; gap: 16px; flex-wrap: wrap; }
.activity-actions-left { display: flex; gap: 12px; }
.btn-create { display: inline-flex; align-items: center; gap: 8px; padding: 9px 18px; background: #0f5132; color: #fff; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn-create:hover { background: #0d4429; }
.btn-create svg { width: 16px; height: 16px; }
.btn-refresh { display: inline-flex; align-items: center; gap: 8px; padding: 9px 18px; background: #fff; color: #374151; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-refresh:hover { border-color: #9ca3af; background: #f9fafb; }
.btn-refresh svg { width: 16px; height: 16px; }
.date-range-picker { position: relative; display: inline-flex; align-items: center; gap: 8px; padding: 9px 14px; background: #fff; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; color: #6b7280; cursor: pointer; transition: all 0.2s; min-width: 200px; }
.date-range-picker:hover { border-color: #9ca3af; }
.date-range-picker svg { width: 16px; height: 16px; }
.date-range-text { flex: 1; }
.date-range-label { font-size: 10px; font-weight: 600; color: #9ca3af; display: block; margin-bottom: 2px; }
.date-range-value { font-size: 12px; color: #374151; font-weight: 500; }
.activity-search-bar { display: flex; gap: 12px; margin-bottom: 16px; }
.search-input-wrapper { flex: 1; position: relative; max-width: 400px; }
.search-input-wrapper svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: #9ca3af; }
.search-input { width: 100%; padding: 9px 12px 9px 38px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; color: #374151; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; transition: all 0.2s; }
.search-input:focus { outline: none; border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1); }
.search-input::placeholder { color: #9ca3af; }
.filter-dropdown { position: relative; min-width: 180px; }
.filter-button { display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%; padding: 9px 12px; background: #fff; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; color: #374151; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; cursor: pointer; transition: all 0.2s; }
.filter-button:hover { border-color: #9ca3af; }
.filter-button svg { width: 14px; height: 14px; color: #6b7280; }
.activity-table-container { background: #fff; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden; }
.activity-table { width: 100%; border-collapse: collapse; }
.activity-table thead { background: #f9fafb; }
.activity-table th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb; }
.activity-table th.sortable { cursor: pointer; user-select: none; }
.activity-table th.sortable:hover { color: #16a34a; }
.activity-table tbody tr { border-bottom: 1px solid #f3f4f6; transition: background 0.2s; }
.activity-table tbody tr:hover { background: #f9fafb; }
.activity-table tbody tr:last-child { border-bottom: none; }
.activity-table td { padding: 14px 16px; font-size: 13px; color: #374151; }
.activity-id { font-weight: 600; color: #6b7280; font-size: 13px; }
.activity-datetime { display: flex; align-items: center; gap: 6px; color: #6b7280; font-size: 13px; }
.activity-datetime svg { width: 14px; height: 14px; color: #9ca3af; }
.activity-username { display: flex; align-items: center; gap: 6px; font-size: 13px; }
.activity-username svg { width: 14px; height: 14px; color: #9ca3af; }
.activity-username span { color: #1f2937; font-weight: 500; }
.activity-action-badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; }
.activity-action-badge.create { background: #d1fae5; color: #065f46; }
.activity-action-badge.update { background: #dbeafe; color: #1e40af; }
.activity-action-badge.delete { background: #fee2e2; color: #991b1b; }
.activity-action-badge.login { background: #e0e7ff; color: #3730a3; }
.activity-action-badge.other { background: #f3f4f6; color: #4b5563; }
.activity-description { color: #6b7280; max-width: 450px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; }
.activity-pagination { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-top: 1px solid #e5e7eb; }
.pagination-info { font-size: 13px; color: #6b7280; }
.pagination-controls { display: flex; align-items: center; gap: 8px; }
.pagination-label { font-size: 13px; color: #6b7280; margin-right: 4px; }
.pagination-select { padding: 6px 28px 6px 10px; border: 1px solid #d1d5db; border-radius: 5px; font-size: 13px; color: #374151; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; cursor: pointer; background: #fff; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 6px center; }
.pagination-button { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: 1px solid #d1d5db; border-radius: 5px; background: #fff; color: #6b7280; cursor: pointer; transition: all 0.2s; }
.pagination-button:hover:not(:disabled) { border-color: #16a34a; color: #16a34a; }
.pagination-button:disabled { opacity: 0.5; cursor: not-allowed; }
.pagination-button.active { background: #16a34a; border-color: #16a34a; color: #fff; }
.pagination-button svg { width: 16px; height: 16px; }
.activity-empty { padding: 80px 32px; text-align: center; }
.activity-empty svg { width: 64px; height: 64px; margin: 0 auto 16px; color: #d1d5db; }
.activity-empty h3 { font-size: 18px; font-weight: 600; color: #374151; margin-bottom: 8px; }
.activity-empty p { font-size: 14px; color: #9ca3af; }
.activity-loading { padding: 80px 32px; text-align: center; color: #6b7280; }
.activity-error { padding: 12px 20px; background: #fee2e2; border: 1px solid #fecaca; border-radius: 8px; color: #991b1b; margin-bottom: 16px; font-size: 14px; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal-content { background: #fff; border-radius: 12px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
.modal-header { padding: 24px; border-bottom: 1px solid #e5e7eb; }
.modal-header h2 { font-size: 20px; font-weight: 700; color: #1a2332; margin-bottom: 4px; }
.modal-header p { font-size: 13px; color: #6b7280; margin-top: 4px; }
.modal-body { padding: 24px; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px; }
.form-group input, .form-group textarea { width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; transition: border-color 0.2s; }
.form-group input:focus, .form-group textarea:focus { outline: none; border-color: #1a4731; box-shadow: 0 0 0 3px rgba(26, 71, 49, 0.1); }
.form-group textarea { resize: vertical; min-height: 80px; }
.modal-footer { padding: 16px 24px; border-top: 1px solid #e5e7eb; display: flex; gap: 12px; justify-content: flex-end; }
.btn-cancel { padding: 10px 20px; background: #fff; color: #6b7280; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
.btn-cancel:hover { background: #f9fafb; border-color: #9ca3af; }
.btn-submit { padding: 10px 20px; background: #1a4731; color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
.btn-submit:hover { background: #235c42; }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
.date-picker-dropdown { position: absolute; top: 100%; right: 0; margin-top: 8px; background: #fff; border: 1px solid #d1d5db; border-radius: 12px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); padding: 20px; z-index: 100; min-width: 320px; }
.date-picker-header { font-size: 14px; font-weight: 700; color: #1a1a1a; margin-bottom: 16px; }
.date-picker-row { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.date-picker-label { font-size: 12px; font-weight: 600; color: #6b7280; }
.date-picker-input { width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; transition: border-color 0.2s; }
.date-picker-input:focus { outline: none; border-color: #1a4731; box-shadow: 0 0 0 3px rgba(26, 71, 49, 0.1); }
.date-picker-actions { display: flex; gap: 8px; justify-content: flex-end; padding-top: 12px; border-top: 1px solid #e5e7eb; }
.date-picker-btn { padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
.date-picker-btn-clear { background: #fff; color: #6b7280; border: 1px solid #d1d5db; }
.date-picker-btn-clear:hover { background: #f9fafb; border-color: #9ca3af; }
.date-picker-btn-apply { background: #1a4731; color: #fff; border: none; }
.date-picker-btn-apply:hover { background: #235c42; }
`

function ActivityLogPage({ clientId, username, projectName }) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ action: '', description: '' })
  const [searchQuery, setSearchQuery] = useState('')
  const [filterAction, setFilterAction] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)

  useEffect(() => { fetchActivityLogs() }, [clientId])

  const fetchActivityLogs = async () => {
    setLoading(true)
    setError('')
    try {
      const url = `/api/activity-log/?client_id=${clientId}`
      const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
      if (!response.ok) throw new Error('Failed to fetch activity logs')
      const data = await response.json()
      setLogs(data || [])
    } catch (err) {
      setError(err.message || 'Failed to load activity logs')
      console.error('Error fetching activity logs:', err)
    } finally {
      setLoading(false)
    }
  }

  const createActivityLog = async () => {
    if (!formData.action.trim() || !formData.description.trim()) {
      alert('Please fill in all required fields')
      return
    }
    try {
      const payload = { client_id: clientId, project_name: projectName || 'Melone Stay', username: username, action: formData.action.trim(), description: formData.description.trim() }
      const response = await fetch('/api/activity-log/create/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!response.ok) throw new Error('Failed to create activity log')
      setFormData({ action: '', description: '' })
      setShowModal(false)
      fetchActivityLogs()
    } catch (err) {
      alert(err.message || 'Failed to create activity log')
      console.error('Error creating activity log:', err)
    }
  }

  const getActionBadgeClass = (action) => {
    const actionLower = action.toLowerCase()
    if (actionLower.includes('create') || actionLower.includes('add')) return 'create'
    if (actionLower.includes('update') || actionLower.includes('edit') || actionLower.includes('modify')) return 'update'
    if (actionLower.includes('delete') || actionLower.includes('remove')) return 'delete'
    if (actionLower.includes('login') || actionLower.includes('signin') || actionLower.includes('logout')) return 'login'
    return 'other'
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
  }

  const applyDateFilter = () => {
    setShowDatePicker(false)
    setCurrentPage(1)
  }

  const clearDateFilter = () => {
    setDateFrom('')
    setDateTo('')
    setShowDatePicker(false)
    setCurrentPage(1)
  }

  const filteredLogs = logs.filter(log => {
    const query = searchQuery.toLowerCase()
    const matchesSearch = log.username?.toLowerCase().includes(query) || log.action?.toLowerCase().includes(query) || log.description?.toLowerCase().includes(query)
    const matchesFilter = filterAction === 'all' || getActionBadgeClass(log.action) === filterAction
    
    // Date filter
    let matchesDate = true
    if (dateFrom || dateTo) {
      const logDate = new Date(log.created_date)
      if (dateFrom) {
        const fromDate = new Date(dateFrom)
        fromDate.setHours(0, 0, 0, 0)
        matchesDate = matchesDate && logDate >= fromDate
      }
      if (dateTo) {
        const toDate = new Date(dateTo)
        toDate.setHours(23, 59, 59, 999)
        matchesDate = matchesDate && logDate <= toDate
      }
    }
    
    return matchesSearch && matchesFilter && matchesDate
  })

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentLogs = filteredLogs.slice(startIndex, endIndex)

  useEffect(() => { setCurrentPage(1) }, [searchQuery, itemsPerPage, filterAction, dateFrom, dateTo])

  return (
    <>
      <style>{styles}</style>
      <div className="activity-log-wrapper">
        <div className="activity-header">
          <div className="activity-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="activity-header-text">
            <h1>Activity Log</h1>
            <p>Track and manage all activities in your system</p>
          </div>
        </div>
        <div className="activity-actions">
          <div className="activity-actions-left">
            <button className="btn-create" onClick={() => setShowModal(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create Activity Log
            </button>
            <button className="btn-refresh" onClick={fetchActivityLogs}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
              Refresh
            </button>
          </div>
          <div className="date-range-picker" onClick={() => setShowDatePicker(!showDatePicker)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <div className="date-range-text">
              <span className="date-range-label">Date Range</span>
              <div className="date-range-value">
                {dateFrom || dateTo ? 
                  `${dateFrom ? new Date(dateFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Start'} - ${dateTo ? new Date(dateTo).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'End'}` : 
                  'Select date range'}
              </div>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            {showDatePicker && (
              <div className="date-picker-dropdown" onClick={(e) => e.stopPropagation()}>
                <div className="date-picker-header">Select Date Range</div>
                <div className="date-picker-row">
                  <label className="date-picker-label">From Date</label>
                  <input 
                    type="date" 
                    className="date-picker-input" 
                    value={dateFrom} 
                    onChange={(e) => setDateFrom(e.target.value)}
                    max={dateTo || undefined}
                  />
                </div>
                <div className="date-picker-row">
                  <label className="date-picker-label">To Date</label>
                  <input 
                    type="date" 
                    className="date-picker-input" 
                    value={dateTo} 
                    onChange={(e) => setDateTo(e.target.value)}
                    min={dateFrom || undefined}
                  />
                </div>
                <div className="date-picker-actions">
                  <button className="date-picker-btn date-picker-btn-clear" onClick={clearDateFilter}>Clear</button>
                  <button className="date-picker-btn date-picker-btn-apply" onClick={applyDateFilter}>Apply</button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="activity-search-bar">
          <div className="search-input-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input type="text" className="search-input" placeholder="Search by username, action or description..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="filter-dropdown">
            <select className="filter-button" value={filterAction} onChange={(e) => setFilterAction(e.target.value)}>
              <option value="all">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="login">Login</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        {error && <div className="activity-error"><strong>Error:</strong> {error}</div>}
        <div className="activity-table-container">
          {loading ? (
            <div className="activity-loading"><p>Loading activity logs...</p></div>
          ) : currentLogs.length === 0 ? (
            <div className="activity-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3>No activity logs found</h3>
              <p>{searchQuery || filterAction !== 'all' ? 'Try adjusting your filters' : 'Create your first activity log to start tracking'}</p>
            </div>
          ) : (
            <>
              <table className="activity-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>ID</th>
                    <th className="sortable" style={{ width: '180px' }}>
                      Date & Time
                      <svg style={{ width: '12px', height: '12px', display: 'inline-block', marginLeft: '4px', verticalAlign: 'middle' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="18 15 12 9 6 15"></polyline>
                      </svg>
                    </th>
                    <th style={{ width: '220px' }}>Username</th>
                    <th style={{ width: '120px' }}>Action</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="activity-id">{log.id}</td>
                      <td>
                        <div className="activity-datetime">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          {formatDateTime(log.created_date)}
                        </div>
                      </td>
                      <td>
                        <div className="activity-username">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          <span>{log.username}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`activity-action-badge ${getActionBadgeClass(log.action)}`}>{log.action}</span>
                      </td>
                      <td>
                        <div className="activity-description" title={log.description}>{log.description}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="activity-pagination">
                <div className="pagination-info">Showing {startIndex + 1} - {Math.min(endIndex, filteredLogs.length)} of {filteredLogs.length} entries</div>
                <div className="pagination-controls">
                  <span className="pagination-label">Rows per page:</span>
                  <select className="pagination-select" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <button className="pagination-button" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <button className="pagination-button active">{currentPage}</button>
                  <button className="pagination-button" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create Activity Log</h2>
                <p>Record a new activity for tracking</p>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Action *</label>
                  <input type="text" placeholder="e.g., CREATE_USER, UPDATE_ROOM, DELETE_BOOKING" value={formData.action} onChange={(e) => setFormData({ ...formData, action: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea placeholder="Describe the activity in detail..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn-submit" onClick={createActivityLog}>Create Log</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ActivityLogPage
