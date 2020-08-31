import request from '@/utils/request'

const api = {
    image: '/storage/image'
}

export function uploadImage(data) {
    return request({
        url: api.image,
        method: 'post',
        data: data
    })
}
