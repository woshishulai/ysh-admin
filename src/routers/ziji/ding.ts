/** When your routing table is too long, you can split it into small modules**/
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const systemRouter = [
    {
        path: '/',
        component: Layout,
        redirect: '/ding/list',
        name: 'ding',
        children: [
            {
                path: '/ding/list',
                component: () => import('@/views/system/ding/index.vue'),
                name: 'ding-list',
                meta: { title: '订单管理', icon: 'MenuIcon' },
            },
        ],
    },
]

export default systemRouter
