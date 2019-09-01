import request from '@/utils/request'

export function fetchFinaList(query) {
  return request({
    url: '/financialManagement/',
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
