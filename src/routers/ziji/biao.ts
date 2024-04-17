/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const systemRouter = [
    {
        path: '/',
        component: Layout,
        redirect: '/biao/list',
        name: 'biao',
        children: [
            {
                path: '/biao/list',
                component: () => import('@/views/system/biao/index.vue'),
                name: 'biao',
                meta: { title: '标签列表', icon: 'MenuIcon' },
            },
        ],
    },
]

export default systemRouter
