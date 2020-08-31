import {
    BasicLayout,
    UserLayout,
    RouteView,
    BlankLayout,
    PageView
} from '@/layouts'

export const Components = {
    // 基础页面 layout 必须引入
    'Layout': {
        BasicLayout,
        UserLayout,
        RouteView,
        BlankLayout,
        PageView
    },
    // 普通页面
    'Page': {
        // 工作台
        'Workplace': () => import('@/views/dashboard/Workplace'),
        // 分析台
        'Analysis': () => import('@/views/dashboard/Analysis'),
        // 菜单
        'Menu': () => import('@/views/permission/menu/Index'),
        // 角色
        'Role': () => import('@/views/permission/role/Index'),
        // 管理员列表
        'Admin': () => import('@/views/permission/user/Index'),
        // 个人设置
        'MySettings': () => import('@/views/account/settings/Index'),
        'BaseSettings': () => import('@/views/account/settings/BaseSetting'),
        'SecuritySettings': () => import('@/views/account/settings/Security'),
        'CustomSettings': () => import('@/views/account/settings/Custom'),
        'BindingSettings': () => import('@/views/account/settings/Binding'),
        'NotificationSettings': () => import('@/views/account/settings/Notification'),
        // 操作日志
        'HandleLog': () => import('@/views/log/handle/Index')
    }
}
