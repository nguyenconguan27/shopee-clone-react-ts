import { User } from 'src/types/user.type'

export const LocalSotrageEventTarget = new EventTarget()

export const saveAccesTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}

export const saveRefreshTokenToLS = (refresh_token: string) => {
  localStorage.setItem('refresh_token', refresh_token)
}

export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
  localStorage.removeItem('refresh_token')
  const clearLSEvent = new Event('clearLS')
  LocalSotrageEventTarget.dispatchEvent(clearLSEvent)
}

export const getAccessTokenFromLS = (): string => localStorage.getItem('access_token') || ''
export const getRefreshTokenFromLS = (): string => localStorage.getItem('refresh_token') || ''

export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const saveProfileToLS = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}
