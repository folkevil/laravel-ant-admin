import request from '@/utils/request'

const userApi = {
    Auth: '/authorization',
    User: '/user'
    // UserMenu: '/user/nav'
}

/**
 * @param parameter
 * @returns {*}
 */
export function login(parameter) {
    return request({
        url: userApi.Auth,
        method: 'post',
        data: parameter
    })
}

export function getInfo() {
    return request({
        url: userApi.User,
        method: 'get',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}

// export function getCurrentUserNav() {
//     return request({
//         url: userApi.UserMenu,
//         method: 'get'
//     })
// }

export function logout() {
    return request({
        url: userApi.Auth,
        method: 'delete'
    })
}
