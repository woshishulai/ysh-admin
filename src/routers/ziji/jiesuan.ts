/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const systemRouter = [
    {
        path: '/',
        component: Layout,
        redirect: '/jie/list',
        name: 'jie',
        children: [
            {
                path: '/jie/list',
                component: () => import('@/views/system/jiesuan/index.vue'),
                name: 'jie-list',
                meta: { title: '店铺管理', icon: 'MenuIcon' },
            },
        ],
    },
]

export default systemRouter
