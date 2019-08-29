import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/online',
    method: 'get',
    params: query
  })
}

export function fetchOnlineUser(id) {
  return request({
    url: `/onlineDetail`,
    method: 'get',
    params: {id}
  })
}
