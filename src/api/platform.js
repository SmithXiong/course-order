import request from '@/utils/request'

export function fetchPlatformList(query) {
  return request({
    url: '/coursePlatform/',
    method: 'get',
    params: query
  })
}

export function fetchPlatform(id) {
  return request({
    url: `/coursePlatform/${id}`,
    method: 'get'
  })
}

export function createPlatform(data) {
  return request({
    url: '/coursePlatform/',
    method: 'post',
    data
  })
}

export function updatePlatform(data) {
  return request({
    url: `/coursePlatform/${data.course_platform_id}/`,
    method: 'put',
    data
  })
}
