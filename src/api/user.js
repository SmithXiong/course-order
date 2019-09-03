import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/token/login/',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/agentInfo',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/auth/token/logout/',
    method: 'post'
  })
}
