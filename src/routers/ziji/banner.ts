import Layout from '@/layout/index.vue'

const systemRouter = [
    {
        path: '/',
        component: Layout,
        redirect: '/banner/list',
        name: 'banner',
        children: [
            {
                path: '/banner/list',
                component: () => import('@/views/system/banner/index.vue'),
                name: 'banner-list',
                meta: { title: 'banner管理', icon: 'MenuIcon' },
            },
        ],
    },
]

export default systemRouter
