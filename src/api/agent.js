import request from '@/utils/request'

export function fetchAgentList(query) {
  return request({
    url: '/agentAccount',
    method: 'get',
    params: query
  })
}

export function fetchAgent(id) {
  return request({
    url: `/agentAccount/${id}`,
    method: 'get'
  })
}

export function createAgent(data) {
  return request({
    url: '/agentAccount/',
    method: 'post',
    data
  })
}

export function updateAgent(data) {
  return request({
    url: `/agentAccount/${data.agent_id}/`,
    method: 'put',
    data
  })
}
