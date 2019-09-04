import request from '@/utils/request'

export function fetchLevelList(query) {
  return request({
    url: '/agentLevel/',
    method: 'get',
    params: query
  })
}

export function fetchLevel(id) {
  return request({
    url: `/agentLevel/${id}`,
    method: 'get'
  })
}

export function createLevel(data) {
  return request({
    url: '/agentLevel/',
    method: 'post',
    data
  })
}

export function updateLevel(data) {
  return request({
    url: `/agentLevel/${data.level_id}/`,
    method: 'put',
    data
  })
}
