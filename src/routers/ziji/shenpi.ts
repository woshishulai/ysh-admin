/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const systemRouter = [
    {
        path: '/',
        component: Layout,
        redirect: '/shenpi/list',
        name: 'shenpi',
        children: [
            {
                path: '/shenpi/list',
                component: () => import('@/views/system/shenpi/index.vue'),
                name: 'shenpi-list',
                meta: { title: '审批列表', icon: 'MenuIcon' },
            },
        ],
    },
]

export default systemRouter
