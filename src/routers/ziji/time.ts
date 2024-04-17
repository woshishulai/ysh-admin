/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const systemRouter = [
    {
        path: '/',
        component: Layout,
        redirect: '/an/list',
        name: 'time',
        children: [
            {
                path: '/time/list',
                component: () => import('@/views/system/time/index.vue'),
                name: 'time-list',
                meta: { title: '时间管理', icon: 'MenuIcon' },
            },
        ],
    },
]

export default systemRouter
