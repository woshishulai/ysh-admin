/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const systemRouter = [
    {
        path: '/',
        component: Layout,
        redirect: '/tui/list',
        name: 'tui',
        children: [
            {
                path: '/tui/list',
                component: () => import('@/views/system/tuikuan/index.vue'),
                name: 'tui-list',
                meta: { title: '订单管理', icon: 'MenuIcon' },
            },
        ],
    },
]

export default systemRouter
