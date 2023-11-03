import request from '@/utils/request'

// 登录方法
export function login(username: string, password: string, appId: string, code: string, uuid: string) {
    return request({
        url: '/auth/login',
        method: 'post',
        data: { username, password, appId, code, uuid }
    })
}
// AD域登录方法
export function ADLogin(data: any) {
    return request({
        url: '/auth/ADLogin',
        method: 'post',
        data
    })
}
// AD域登录方法
export function ADEmailLogin(username: string, password: string, appId: string, code: string, uuid: string) {
    return request({
        url: '/auth/ADEmailLogin',
        method: 'post',
        data: { username, password, appId, code, uuid }
    })
}

// 双因子发送验证码
export function sendCodePromise(username: string, password: string, appId: string) {
    return request({
        url: '/auth/sendCode',
        method: 'post',
        data: { username, password, appId }
    })
}

// 刷新方法
export function refreshToken() {
    return request({
        url: '/auth/refresh',
        method: 'post'
    })
}

// 获取用户详细信息
export function getInfo() {
    return request({
        url: '/system/user/getInfo',
        method: 'get'
    })
}

// 退出方法
export function logout() {
    return request({
        url: '/auth/logout',
        method: 'delete'
    })
}

export function regenerate(appId: string) {
    return request({
        url: '/auth/regenerate/' + appId,
        method: 'post',
    })
}

// 获取验证码
export function getCodeImg() {
    return request({
        url: '/code',
        method: 'get'
    })
}

// 自动登录
export function freeLogin(token: string) {
    return request({
        url: '/auth/freeLogin/73eb92cb757143a7850ed24d19f47f76?token=' + token,
        method: 'get'
    })
}
interface ParamsType {
    appId?: string;
    code?: string;
}
// 自动登录
export function H5login({ appId, code }: ParamsType) {
    return request({
        url: '/auth/h5/login?appId=' + appId + '&code=' + code,
        method: 'get',
    })
}
