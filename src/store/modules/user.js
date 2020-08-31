import storage from 'store'
import {
    login,
    logout,
    getInfo
} from '@/api/login'
import {
    ACCESS_TOKEN
} from '@/store/mutation-types'
import {
    welcome
} from '@/utils/util'

const user = {
    state: {
        token: '',
        name: '',
        welcome: '',
        avatar: '',
        roles: [],
        info: {},
        permissions: []
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_PERMISSIONS: (state, permissions) => {
            state.permissions = permissions
        },
        SET_WELCOME: (state, welcome) => {
            state.welcome = welcome
        },
        SET_INFO: (state, info) => {
            state.info = info
        }
    },

    actions: {
        // 登录
        Login({
            commit
        }, userInfo) {
            return new Promise((resolve, reject) => {
                login(userInfo)
                    .then(response => {
                        const result = response.data
                        storage.set(ACCESS_TOKEN, result.access_token, result.expires_in)
                        commit('SET_TOKEN', result.access_token)
                        resolve()
                    })
                    .catch(error => {
                        reject(error)
                    })
            })
        },

        // 获取用户信息
        GetInfo({
            commit
        }) {
            return new Promise((resolve, reject) => {
                getInfo()
                    .then(response => {
                        const result = response.data

                        if (result.permissions.length > 0) {
                            let permissions = result.permissions

                            permissions = permissions.map(per => {
                                if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                                    const action = per.actionEntitySet.map(action => {
                                        return action.action
                                    })
                                    per.actionList = action
                                }
                                return per
                            })

                            commit('SET_PERMISSIONS', permissions)
                            commit('SET_ROLES', result.roles)
                            commit('SET_INFO', result)
                        } else {
                            reject(new Error('getInfo: permissions must be a non-null array !'))
                        }

                        commit('SET_NAME', result.nickname)
                        commit('SET_WELCOME', welcome())
                        commit('SET_AVATAR', result.avatar)

                        resolve(response)
                    })
                    .catch(error => {
                        reject(error)
                    })
            })
        },

        // 登出
        Logout({
            commit
        }) {
            return new Promise(resolve => {
                logout()
                    .then(() => {
                        resolve()
                    })
                    .catch((error) => {
                        resolve(error)
                    })
                    .finally(() => {
                        commit('SET_TOKEN', '')
                        commit('SET_ROLES', [])
                        commit('SET_PERMISSIONS', [])
                        storage.remove(ACCESS_TOKEN)
                    })
            })
        }
    }
}

export default user
