import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/orders',
    method: 'get',
    params: query
  })
}

export function fetchPlatform(id) {
  return request({
    url: `/platforms/${id}`,
    method: 'get'
  })
}

export function createPlatform(data) {
  return request({
    url: '/platforms',
    method: 'post',
    data
  })
}

export function updatePlatform(data) {
  return request({
    url: `/platforms/${data.id}`,
    method: 'put',
    data
  })
}
