// import request from '@/utils/request'
import request from '@/utils/requestN'

//
export function getSelectList(data: any) {
    return request({
        url: '/matrix/selectList',
        method: 'post',
        data
    })
}

//
export function addApp(data: any) {
    return request({
        url: 'system/app/add',
        method: 'post',
        data: data
    })
}

//
export function editApp(data: any) {
    return request({
        url: 'system/app/edit',
        method: 'put',
        data: data
    })
}


export function remove(ids: any) {
    return request({
        url: 'system/app/remove/' + ids,
        method: 'delete',
    })
}

export function getSecret(appId: string) {
    return request({
        url: 'system/app/getSecret/' + appId,
        method: 'get',
    })
}
