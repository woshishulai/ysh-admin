/** When your routing table is too long, you can split it into small modules**/
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const systemRouter = [
    {
        path: '/',
        component: Layout,
        redirect: '/message/list',
        name: 'message',
        children: [
            {
                path: '/message/list',
                component: () => import('@/views/system/message/index.vue'),
                name: 'message-list',
                meta: { title: '聊天管理', icon: 'MenuIcon' },
            },
        ],
    },
]

export default systemRouter
