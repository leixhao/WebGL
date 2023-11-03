import request from '@/utils/request'

// 登录方法
export function login(username, password, appId, code, uuid) {
  return request({
      url: '/auth/login',
      method: 'post',
      data: { username, password, appId, code, uuid }
  })
}
// AD域登录方法
export function ADLogin(data) {
  return request({
      url: '/auth/ADLogin',
      method: 'post',
      data
  })
}
// 注册方法
export function register(data) {
  return request({
    url: '/auth/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
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

export function regenerate(appId) {
  return request({
      url: '/auth/regenerate/' + appId,
      method: 'post',
  })
}
// 获取验证码
export function getCodeImg() {
  return request({
    url: '/code',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}