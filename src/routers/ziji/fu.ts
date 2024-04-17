/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const systemRouter = [
    {
        path: '/',
        component: Layout,
        redirect: '/fu/list',
        name: 'fu',
        children: [
            {
                path: '/fu/list',
                component: () => import('@/views/system/fu/index.vue'),
                name: 'fu-list',
                meta: { title: '服务管理', icon: 'MenuIcon' },
            },
        ],
    },
]

export default systemRouter
