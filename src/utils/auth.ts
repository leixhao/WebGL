import Cookies from 'js-cookie'

const TokenKey = 'SsoLoginToken'
// const TokenKey = 'Admin-Token'

const ExpiresInKey = 'Admin-Expires-In'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token: string) {
    // if (process.env.ENV === 'production') {
    // return Cookies.set(TokenKey, token, { domain: '.envision-aesc.cn' })
    // }
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    // if (process.env.ENV === 'production') {
    // return Cookies.remove(TokenKey, { domain: '.envision-aesc.cn' })
    // }
    return Cookies.remove(TokenKey)
}
export function getExpiresIn() {
    return Cookies.get(ExpiresInKey) || -1
}

export function setExpiresIn(time: string) {
    return Cookies.set(ExpiresInKey, time)
}

export function removeExpiresIn() {
    return Cookies.remove(ExpiresInKey)
}
