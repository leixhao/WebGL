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

// 获取详情
export function getMatrixDetail(data:any){
    return request({
        url: `/ecm/matrix/selectMatrixById/${data.matrixId}`,
        method: 'post',
    })
}
// 删除MatrixAttach
export function deleteMatrixAttach(data:any){
    return request({
        url: `/ecm/matrix/deleteMatrixAttach`,
        method:'delete',
        data
    })
}
// 删除content 
export function deleteMatrixContent(data:any){
    return request({
        url: `/ecm/matrix/deleteMatrixContent`,
        method:'delete',
        data
    })
}
// 获取历史记录
export function getUpVersionLog(data:any){
    return request({
        url: `/ecm/matrix/selectUpVersionLogList/${data.id}`,
        method:'get',
    })
}
// 更新对象属性
export function updateMatrix(data:any){
    return request({
        url: `/ecm/matrix/updateMatrix`,
        method:'post',
        data
    })
}