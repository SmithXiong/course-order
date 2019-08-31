import request from '@/utils/request'

export function getToken() {
  return request({
    url: '/qiniu/upload/token', // 假地址 自行替换
    method: 'get'
  })
}

export function uploadFile(data) {
  return request({
    url: '/attachment/',
    method: 'post',
    data,
  })
}
