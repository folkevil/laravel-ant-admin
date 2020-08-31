import request from '@/utils/request'

const api = {
    HandleLog: '/handle/log'
}

export function fetchHandleLog(params) {
    return request({
        url: api.HandleLog,
        method: 'get',
        params
    })
}
