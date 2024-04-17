/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const systemRouter = [
    {
        path: '/',
        component: Layout,
        redirect: '/fuwu/list',
        name: 'fuwu',
        children: [
            {
                path: '/fuwu/list',
                component: () => import('@/views/system/fuwu/index.vue'),
                name: 'fuwu-list',
                meta: { title: '服务列表', icon: 'MenuIcon' },
            },
        ],
    },
]

export default systemRouter
