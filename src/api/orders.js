import request from '@/utils/request'

export function fetchOrderList(query) {
  return request({
    url: '/order',
    method: 'get',
    params: query
  })
}

export function fetchOrder(id) {
  return request({
    url: `/order/${id}`,
    method: 'get'
  })
}

export function createOrder(data) {
  return request({
    url: '/order/',
    method: 'post',
    data
  })
}

export function updateOrder(data) {
  return request({
    url: `/order/${data.id}/`,
    method: 'put',
    data
  })
}
