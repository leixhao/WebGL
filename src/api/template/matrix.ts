// import request from '@/utils/request'
import request from '@/utils/request'

//
export function getSelectList(data: any) {
    return request({
        url: '/ecm/matrix/selectList',
        method: 'post',
        data
    })
}

//
export function addMatrix(data: any) {
    return request({
        url: '/ecm/matrix/addMatrix',
        method: 'post',
        data: data
    })
}

//
export function updateMatrix(data: any) {
    return request({
        url: '/ecm/matrix/updateMatrix',
        method: 'post',
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
