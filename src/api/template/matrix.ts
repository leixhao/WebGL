// import request from '@/utils/request'
import request from '@/utils/request'

let PRE = '/ecm/'
//
export function getSelectList(data: any) {
    return request({
        url: PRE + 'matrix/selectList' + '?pageNum=' + data.pageNum +'&pageSize=' + data.pageSize,
        method: 'post',
        data
    })
}
export function matUpload(file:any) {
    return request({
        url: PRE + 'matrix/uploadFile',
        method: 'post',
        data: file
    })
}

//新增
export function addMatrix(data: any) {
    return request({
        url: PRE + 'matrix/addMatrix',
        method: 'post',
        data
    })
}

// 修订
export function upMatVersion(ids: any) {
    return request({
        url: PRE + 'matrix/upVersion/' + ids,
        method: 'post',
    })
}

// 更新状态
export function upMatStatus(params: { id: string | number, matrixStatus: string | number }) {
    return request({
        url: PRE + 'matrix/updateStatus',
        method: 'get',
        params
    })
}
//
export function updateMatrix(data: any) {
    return request({
        url: PRE + 'matrix/updateMatrix',
        method: 'post',
        data: data
    })
}


export function delMatrix(ids: any) {
    return request({
        url: PRE + 'matrix/' + ids,
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
// 步骤
export function getStep(data:any){
    return request({
        url: `/ecm/matrix/selectChangeLogList/${data.matrixId}`,
        method:'post',
    })
}
// 变更记录
export function updateStatus(data:any){
    return request({
        url: `/ecm/matrix/updateStatus/${data.matrixId}`,
        method:'get',
    })
}