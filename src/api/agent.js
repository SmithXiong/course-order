import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/agentAccounts',
    method: 'get',
    params: query
  })
}

export function fetchAgent(id) {
  return request({
    url: `/agentAccounts/${id}`,
    method: 'get'
  })
}

export function createAgent(data) {
  return request({
    url: '/agentAccounts',
    method: 'post',
    data
  })
}

export function updateAgent(data) {
  return request({
    url: `/agentAccounts/${data.id}`,
    method: 'put',
    data
  })
}
