/** When your routing table is too long, you can split it into small modules**/
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const systemRouter = [
    {
        path: '/',
        component: Layout,
        redirect: '/ping/list',
        name: 'ping',
        children: [
            {
                path: '/ping/list',
                component: () => import('@/views/system/ping/index.vue'),
                name: 'ping-list',
                meta: { title: '评论管理', icon: 'MenuIcon' },
            },
        ],
    },
]

export default systemRouter
