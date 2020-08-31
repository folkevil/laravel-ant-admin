import request from '@/utils/request'

const api = {
    hitokoto: 'https://v1.hitokoto.cn/'
}

export function getHitokoto(params) {
    return request({
        url: api.hitokoto + '?' + params,
        method: 'get'
    })
}
