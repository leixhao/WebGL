import request from '@/utils/request'

// 查询待办列表
export function listBacklog(query: any) {
  return request({
    url: '/system/backlog/list',
    method: 'get',
    params: query
  })
}

// 查询待办详细
export function getBacklog(id: any) {
  return request({
    url: '/system/backlog/' + id,
    method: 'get'
  })
}

// 新增待办
export function addBacklog(data: any) {
  return request({
    url: '/system/backlog',
    method: 'post',
    data: data
  })
}

// 修改待办
export function updateBacklog(data: any) {
  return request({
    url: '/system/backlog',
    method: 'put',
    data: data
  })
}

// 删除待办
export function delBacklog(id: any) {
  return request({
    url: '/system/backlog/' + id,
    method: 'delete'
  })
}
