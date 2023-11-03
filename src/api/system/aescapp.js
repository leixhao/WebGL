import request from '@/utils/request'

//
export function getAppList(query) {
    return request({
        url: 'system/app/list',
        method: 'get',
        params: query
    })
}

//
export function addApp(data) {
    return request({
        url: 'system/app/add',
        method: 'post',
        data: data
    })
}

//
export function editApp(data) {
    return request({
        url: 'system/app/edit',
        method: 'put',
        data: data
    })
}


export function remove(ids) {
    return request({
        url: 'system/app/remove/' + ids,
        method: 'delete',
    })
}

export function getSecret(appId) {
  return request({
    url: 'system/app/getSecret/' + appId,
    method: 'get',
  })
}
