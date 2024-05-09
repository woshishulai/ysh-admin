/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const systemRouter = [
    {
        path: '/',
        component: Layout,
        redirect: '/hui/list',
        name: 'hui',
        children: [
            {
                path: '/hui/list',
                component: () => import('@/views/system/huikuan/index.vue'),
                name: 'hui-list',
                meta: { title: '汇款管理', icon: 'MenuIcon' },
            },
        ],
    },
]

export default systemRouter
