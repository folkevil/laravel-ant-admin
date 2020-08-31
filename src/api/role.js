import request from '@/utils/request'

const api = {
    Role: '/role'
}

export function fetchRole(params) {
    return request({
        url: api.Role,
        method: 'get',
        params
    })
}

export function addRole(data) {
    return request({
        url: api.Role,
        method: 'post',
        data
    })
}

export function updateRole(id, data) {
    return request({
        url: `${api.Role}/${id}`,
        method: 'put',
        data
    })
}

export function deleteRole(id) {
    return request({
        url: `${api.Role}/${id}`,
        method: 'delete'
    })
}
