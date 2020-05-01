import { Cookies } from 'react-cookie'
import { CookieName } from '../constants/app-constants'
import { UserAuthenticationRequest } from '../interfaces/atlas-message-structure'

export const setUserAuthToCookie = (cookies: Cookies | undefined, userAuth: UserAuthenticationRequest) => {
  if (cookies != null) cookies.set(CookieName, userAuth)
}

export const getUserAuthFromCookies = (cookies: Cookies | undefined): UserAuthenticationRequest | null => {
  if (cookies != null) {
    return cookies.get(CookieName)
  }
  return null
}

export const removeUserAuthFromCookie = (cookies: Cookies | undefined) => {
  if (cookies != null) cookies.remove(CookieName)
  window.location.reload()
}