function redirectToLogin() {
  const loginPath = localStorage.getItem('ms_role') === 'superuser'
    || localStorage.getItem('ms_superuser') === '1'
    ? '/login/suser'
    : '/login'

  localStorage.removeItem('ms_token')
  localStorage.removeItem('ms_role')
  localStorage.removeItem('ms_admin')
  localStorage.removeItem('ms_superuser')

  if (window.location.pathname !== loginPath) {
    window.history.replaceState({}, '', loginPath)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }
}

export function apiFetch(input, init = {}) {
  const headers = new Headers(init.headers || {})
  const token = localStorage.getItem('ms_token')
  if (!token) {
    redirectToLogin()
    return Promise.reject(new Error('Your session has expired. Please sign in again.'))
  }

  headers.set('Authorization', `Bearer ${token}`)
  return fetch(input, { ...init, headers }).then(response => {
    if (response.status === 401) redirectToLogin()
    return response
  })
}

export async function readApiJson(response) {
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error(`The API returned an unexpected response (${response.status}). Check the backend server and migrations.`)
  }
  try {
    return await response.json()
  } catch {
    throw new Error('The API returned invalid JSON. Check the backend server logs.')
  }
}
