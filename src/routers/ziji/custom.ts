/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const systemRouter = [
    {
        path: '/',
        component: Layout,
        redirect: '/customer/list',
        name: 'customer',
        children: [
            {
                path: '/customer/list',
                component: () => import('@/views/system/custome/index.vue'),
                name: 'customer-list',
                meta: { title: '商户管理', icon: 'MenuIcon' },
            },
        ],
    },
]

export default systemRouter
