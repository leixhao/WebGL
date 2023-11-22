import request from '@/utils/request'

// 模板列表查询
export function listTemplate(query:any) {
  return request({
    url: '/message/v1/template',
    method: 'get',
    params: query
  })
}

// 查询模板详情
export function getTemplateDetail(id:any) {
  return request({
    url: '/message/v1/template/' + id,
    method: 'get'
  })
}

// 新增模板
export function addTemplate(data:any) {
  return request({
    url: '/message/v1/template',
    method: 'post',
    data: data
  })
}

// 修改模板
export function updatTemplate(data:any) {
  return request({
    url: '/message/v1/template/'+data.id,
    method: 'put',
    data: data
  })
}
// 删除角色
export function delRole(roleId:any) {
  return request({
    url: '/message/v1/template/' + roleId,
    method: 'delete'
  })
}
// // 角色数据权限
// export function dataScope(data) {
//   return request({
//     url: '/system/role/dataScope',
//     method: 'put',
//     data: data
//   })
// }

// 模板状态修改
export function changeTemplateStatus(data:any) {
  return request({
    url: '/message/v1/template/enable/'+data.id+'?enable='+data.enable,
    method: 'put'
  })
}



// // 查询角色已授权用户列表
// export function allocatedUserList(query) {
//   return request({
//     url: '/system/role/authUser/allocatedList',
//     method: 'get',
//     params: query
//   })
// }

// // 查询角色未授权用户列表
// export function unallocatedUserList(query) {
//   return request({
//     url: '/system/role/authUser/unallocatedList',
//     method: 'get',
//     params: query
//   })
// }

// // 取消用户授权角色
// export function authUserCancel(data) {
//   return request({
//     url: '/system/role/authUser/cancel',
//     method: 'put',
//     data: data
//   })
// }

// // 批量取消用户授权角色
// export function authUserCancelAll(data) {
//   return request({
//     url: '/system/role/authUser/cancelAll',
//     method: 'put',
//     params: data
//   })
// }

// // 授权用户选择
// export function authUserSelectAll(data) {
//   return request({
//     url: '/system/role/authUser/selectAll',
//     method: 'put',
//     params: data
//   })
// }