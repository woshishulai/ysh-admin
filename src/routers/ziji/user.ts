/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const systemRouter = [
    {
        path: '/',
        component: Layout,
        redirect: '/user/list',
        name: 'user',
        children: [
            {
                path: '/user/list',
                component: () => import('@/views/system/user/index.vue'),
                name: 'user',
                meta: { title: '客户列表', icon: 'MenuIcon' },
            },
        ],
    },
]

export default systemRouter
