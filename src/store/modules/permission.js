import {
    constantRouterMap
} from '@/config/router.config'
import {
    Components
} from '@/config/componentConfigs'
import router, {
    resetRouter
} from '@/router'
import message from 'ant-design-vue/es/message'
/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param permission
 * @param route
 * @returns {boolean}
 */
function hasPermission(permission, route) {
    if (route.meta && route.meta.permission) {
        let flag = false
        for (let i = 0, len = permission.length; i < len; i++) {
            flag = route.meta.permission.includes(permission[i].permissionId)
            if (flag) {
                return true
            }
        }
        return false
    }
    return true
}

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
function hasRole(roles, route) {
    if (route.meta && route.meta.roles) {
        return route.meta.roles.includes(roles.id)
    } else {
        return true
    }
}

function filterAsyncRouter(routerMap, permissions) {
    let components = {}
    for (const type in Components) {
        components = {
            ...Components[type],
            ...components
        }
    }
    const accessedRouters = routerMap.filter(route => {
        if (hasPermission(permissions, route)) {
            route.component = components[route.component]
            if (route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children, permissions)
            }
            return true
        }
        return false
    })

    return accessedRouters
}

const permission = {
    state: {
        routers: constantRouterMap,
        addRouters: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers
            state.routers = constantRouterMap.concat(routers)
        }
    },
    actions: {
        GenerateRoutes({
            commit
        }, data) {
            return new Promise(resolve => {
                const {
                    permissions,
                    menus
                } = data

                const accessedRouters = filterAsyncRouter(menus, permissions)
                const notFoundRouter = {
                    path: '*',
                    redirect: '/404',
                    hidden: true
                }
                accessedRouters.push(notFoundRouter)
                console.log('accessedRouters', accessedRouters)
                commit('SET_ROUTERS', accessedRouters)
                resolve()
            })
        },
        ReloadRouters(store) {
            const hide = message.loading('正在刷新路由...')
            store.dispatch('GetInfo').then(res => {
                const permissions = res.data.permissions
                const menus = res.data.menus
                store.dispatch('GenerateRoutes', {
                    permissions,
                    menus
                }).then(() => {
                    resetRouter()
                    router.addRoutes(store.getters.addRouters)
                    hide()
                })
            })
        }
    }
}

export default permission
