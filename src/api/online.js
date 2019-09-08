import request from '@/utils/request'

export function fetchOnlineList(query) {
  return request({
    url: '/onlineUser/',
    method: 'get',
    params: query
  })
}

export function fetchOnlineUser(data) {
  let id = data.id;
  delete data.id;
  return request({
    url: `/onlineUser/${id}/`,
    method: 'get',
    params: data
  })
}
