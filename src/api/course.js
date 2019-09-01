import request from '@/utils/request'

export function fetchCourse(data) {
  return request({
    url: `/course/`,
    method: 'post',
    data
  })
}

export function createOrder(data) {
  return request({
    url: '/order/',
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
