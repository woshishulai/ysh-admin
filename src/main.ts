import { createApp } from 'vue'
import App from './App.vue'
import router from './routers'
import pinia from './store'

import { registerElIcons } from '@/plugins/ElIcons'
// 引入全局组件布局
import PageWrapLayout from '@/components/PageWrapLayout/index.vue'
// 权限路由
import './permission'
// UI框架 element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入暗黑模式 element-plus 2.2 内置暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'
// 自定义暗黑模式
import '@/styles/element-dark.scss'

const app = createApp(App)
registerElIcons(app)

app.component('PageWrapLayout', PageWrapLayout)

app.use(pinia)
app.use(router)
app.use(ElementPlus).mount('#app')
