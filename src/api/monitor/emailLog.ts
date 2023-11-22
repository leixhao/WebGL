import request from '@/utils/request'

// 查询操作日志列表
export function list(query: any) {
  return request({
    url: '/message/v1/email/log',
    method: 'get',
    params: query
  })
}

// 删除操作日志
export function delOperlog(operId: any) {
  return request({
    url: '/message/v1/email/log/' + operId,
    method: 'delete'
  })
}

// // 清空操作日志
export function cleanOperlog() {
  return request({
    url: '/monitor/operlog/clean',
    method: 'delete'
  })
}
export function emailLogDetail(row: any) {
  return request({
    url: '/message/v1/email/log/' + row.id,
    method: 'get'
  })
}