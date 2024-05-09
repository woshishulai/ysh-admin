/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const systemRouter = [
    {
        path: '/',
        component: Layout,
        redirect: '/dian/list',
        name: 'dian',
        children: [
            {
                path: '/dian/list',
                component: () => import('@/views/system/dianpu/index.vue'),
                name: 'biao-list',
                meta: { title: '店铺管理', icon: 'MenuIcon' },
            },
        ],
    },
]

export default systemRouter
