import Layout from '@/layout/index.vue'

const systemRouter = [
    {
        path: '/',
        component: Layout,
        redirect: '/agreement/list',
        name: 'agreement',
        children: [
            {
                path: '/agreement/list',
                component: () => import('@/views/system/xieyi/index.vue'),
                name: 'agreement-list',
                meta: { title: '协议管理', icon: 'MenuIcon' },
            },
        ],
    },
]

export default systemRouter
