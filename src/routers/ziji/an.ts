/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const systemRouter = [
    {
        path: '/',
        component: Layout,
        redirect: '/an/list',
        name: 'an',
        children: [
            {
                path: '/an/list',
                component: () => import('@/views/system/anli/index.vue'),
                name: 'an-list',
                meta: { title: '案例列表', icon: 'MenuIcon' },
            },
        ],
    },
]

export default systemRouter
