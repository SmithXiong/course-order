import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/course-list',
    method: 'get',
    params: query
  })
}

export function fetchCourse(id) {
  return request({
    url: `/course`,
    method: 'get',
    params: {id}
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
