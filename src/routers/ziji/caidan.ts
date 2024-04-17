/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const systemRouter = [
    {
        path: '/',
        component: Layout,
        redirect: '/menu/list',
        name: 'menu',
        meta: { title: '权限管理', icon: 'MenuIcon' },
        children: [
            {
                path: '/menu/list',
                component: () => import('@/views/system/menu/index.vue'),
                name: 'MenuList',
                meta: { title: '菜单列表', icon: 'MenuIcon' },
            },
            {
                path: '/role/list',
                component: () => import('@/views/system/role/index.vue'),
                name: 'role',
                meta: { title: '角色管理', icon: 'MenuIcon' },
            },
        ],
    },
]

export default systemRouter
