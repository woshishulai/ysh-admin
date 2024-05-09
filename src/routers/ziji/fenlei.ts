/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const systemRouter = [
    {
        path: '/',
        component: Layout,
        redirect: '/labletype/list',
        name: 'label',
        children: [
            {
                path: '/labletype/list',
                component: () => import('@/views/system/fenlei/userTable.vue'),
                name: 'labels',
                meta: { title: '标签分类列表', icon: 'MenuIcon' },
            },
        ],
    },
]

export default systemRouter
