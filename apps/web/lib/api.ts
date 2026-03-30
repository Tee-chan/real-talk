import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api',
  withCredentials: true,
})

let accessToken: string | null = null

export const setAccessToken = (token: string): void => {
  accessToken = token
}

export const clearAccessToken = (): void => {
  accessToken = null
}

// Attach access token to every request
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error: unknown) => {
    const err = error as { config?: { _retry?: boolean }; response?: { status?: number } }
    if (err.response?.status === 401 && !err.config?._retry) {
      if (err.config) err.config._retry = true
      try {
        const { data } = await api.post<{ data: { accessToken: string } }>('/auth/refresh')
        setAccessToken(data.data.accessToken)
        if (err.config) {
          return api(err.config)
        }
      } catch {
        clearAccessToken()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)
