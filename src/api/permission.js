import request from '@/utils/request'

const api = {
    Permission: '/permission'
}

export function fetchPermission() {
    return request({
        url: api.Permission,
        method: 'get'
    })
}

export function addPermission(data) {
    return request({
        url: api.Permission,
        method: 'post',
        data
    })
}

export function updatePermission(id, data) {
    return request({
        url: `${api.Permission}/${id}`,
        method: 'put',
        data
    })
}

export function deletePermission(id) {
    return request({
        url: `${api.Permission}/${id}`,
        method: 'delete'
    })
}
