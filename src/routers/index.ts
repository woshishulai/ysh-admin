import { createRouter, createWebHistory, RouteRecordRaw, createWebHashHistory, Router } from 'vue-router'
import Layout from '@/layout/index.vue'
// 扩展继承属性
interface extendRoute {
    hidden?: boolean
}

import menuList from './ziji/caidan'
import userList from './ziji/user'
import customList from './ziji/custom'
import shopList from './ziji/shop'
import shenpi from './ziji/shenpi'
import biao from './ziji/biao'
import fuwu from './ziji/fuwu'
import dianpu from './ziji/dianpu'
import an from './ziji/an'
import time from './ziji/time'
import fu from './ziji/fu'
import ding from './ziji/ding'
import ping from './ziji/ping'
import banner from './ziji/banner'
import xieyi from './ziji/xieyi'
import huikuan from './ziji/huikuan'
import tui from './ziji/tui'
import jiesuan from './ziji/jiesuan'

// 异步组件
export const asyncRoutes = [
    //菜单列表和角色列表
    ...menuList,
    //用户列表
    ...customList,
    //客户列表
    ...userList,
    //店铺列表
    ...shopList,
    //审批列表
    ...shenpi,
    //服务列表
    ...fuwu,
    //标签列表
    ...biao,
    //店铺管理
    ...dianpu,
    //时间列表
    ...time,
    //案例管理
    ...an,
    // 服务管理,
    ...fu,
    // 订单管理,
    ...ding,
    // 评论,
    ...ping,
    // 控制 ,
    ...banner,
    // 协议 ,
    ...xieyi,
    // 协议 ,
    ...huikuan,
    // 协议 ,
    ...tui,
    // 结算,
    ...jiesuan,
]

/**
 * path ==> 路由路径
 * name ==> 路由名称
 * component ==> 路由组件
 * redirect ==> 路由重定向
 * alwaysShow ==> 如果设置为true，将始终显示根菜单，无论其子路由长度如何
 * hidden ==> 如果“hidden:true”不会显示在侧边栏中（默认值为false）
 * keepAlive ==> 设为true 缓存
 * meta ==> 路由元信息
 * meta.title ==> 路由标题
 * meta.icon ==> 菜单icon
 * meta.affix ==> 如果设置为true将会出现在 标签栏中
 * meta.breadcrumb ==> 如果设置为false，该项将隐藏在breadcrumb中（默认值为true）
 * meta.activeMenu ==> 详情页的时候可以设置菜单高亮 ,高亮菜单的path
 */

export const constantRoutes: Array<RouteRecordRaw & extendRoute> = [
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/errorPages/404.vue'),
        hidden: true,
    },
    {
        path: '/403',
        name: '403',
        component: () => import('@/views/errorPages/403.vue'),
        hidden: true,
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/index.vue'),
        hidden: true,
        meta: { title: '登录' },
    },
    // {
    //     path: '/',
    //     name: 'layout',
    //     component: Layout,
    //     redirect: '/home',
    //     meta: { title: '首页', icon: 'House' },
    //     children: [
    //         {
    //             path: '/home',
    //             component: () => import('@/views/home/index.vue'),
    //             name: 'home',
    //             meta: {
    //                 title: '首页',
    //                 icon: 'House',
    //                 affix: true,
    //                 role: ['other'],
    //             },
    //             children: [
    //                 {
    //                     path: '/home/sss',
    //                     component: () => import('@/views/home/index.vue'),
    //                     name: 'home',
    //                     meta: { title: '首页', icon: 'House', affix: true, role: ['other'] },
    //                 },
    //             ],
    //         },
    //     ],
    // },
]

/**
 * notFoundRouter(找不到路由)
 */
export const notFoundRouter = {
    path: '/:pathMatch(.*)',
    name: 'notFound',
    redirect: '/404',
}

const router = createRouter({
    // history: createWebHistory(process.env.BASE_URL), // history
    history: createWebHashHistory(), // hash
    routes: constantRoutes,
})

export default router
