import request from '@/utils/request'

export function fetchNoticeList(query) {
  return request({
    url: '/announcement/',
    method: 'get',
    params: query
  })
}

export function fetchNotice() {
  return request({
    url: `/announcement/`,
    method: 'get'
  })
}

export function createNotice(data) {
  return request({
    url: '/announcement/',
    method: 'post',
    data
  })
}

export function updateNotice(data) {
  return request({
    url: `/announcement/`,
    method: 'put',
    data
  })
}
