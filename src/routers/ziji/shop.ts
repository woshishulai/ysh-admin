/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const systemRouter = [
    {
        path: '/',
        component: Layout,
        redirect: '/shop/list',
        name: 'shop',
        children: [
            {
                path: '/shop/list',
                component: () => import('@/views/system/shop/index.vue'),
                name: 'shop-list',
                meta: { title: '客户列表', icon: 'MenuIcon' },
            },
        ],
    },
]

export default systemRouter
