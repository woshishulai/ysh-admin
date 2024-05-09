<template>
    <div class="sidebar-container" :class="{ 'has-logo': themeConfig.showLogo }">
        <Logo v-if="themeConfig.showLogo" :is-collapse="isCollapse" />
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu
                :default-active="active"
                background-color="#304156"
                text-color="#bfcbd9"
                :unique-opened="SettingStore.themeConfig.uniqueOpened"
                :collapse-transition="false"
                class="el-menu-vertical-demo"
                :collapse="isCollapse"
            >
                <el-menu-item @click="showLiaoTian">
                    聊天后台
                    <p class="reds" v-if="show"></p>
                </el-menu-item>
                <div v-for="item in menuList" :key="item.id">
                    <el-menu-item v-if="item.levelList.length == 0" :index="item.id + ''" @click="router.push(item.web_url)">
                        {{ item.menu_name }}
                    </el-menu-item>
                    <el-sub-menu v-else :index="item.id + ''">
                        <template #title>
                            {{ item.menu_name }}
                        </template>
                        <el-menu-item v-for="i in item.levelList" :index="i.id + ''" @click="router.push(i.web_url)">{{
                            i.menu_name
                        }}</el-menu-item>
                    </el-sub-menu>
                </div>
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script lang="ts" setup>
    //左侧的logo是否展示
    import Logo from './components/Logo.vue'
    import { useSettingStore } from '@/store/modules/setting'
    import { computed, ref, onMounted, watch, onBeforeUnmount } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useUserStore } from '@/store/modules/user'
    import { Base64 } from 'js-base64'
    import { getMenuList } from '@/api/caidan/apis'
    import { shopMessage } from '@/api/message/apis'

    const menuList = ref([])
    const route = useRoute()
    const UserStore = useUserStore()
    const active = ref(null)
    const router = useRouter()
    const timer = ref(null)
    const show = ref(false)
    const getShopList = async () => {
        let res = await shopMessage({
            shop_id: UserStore.userInfo.shopId,
        })
        if (res.data.list.length < 1) {
            show.value = false
        } else {
            show.value = true
        }
    }
    onBeforeUnmount(() => {
        clearInterval(timer.value)
        timer.value = null
    })
    timer.value = setInterval(() => {
        if (UserStore.userInfo.isAdmin == 1) {
            clearInterval(timer.value)
        }
        getShopList()
    }, 5000)

    onMounted(async () => {
        try {
            let res = await getMenuList()
            if (UserStore.userInfo.isAdmin == 1) {
                menuList.value = res.data
            } else {
                let list = JSON.parse(localStorage.getItem('menuList'))
                let arr = list.menuList
                menuList.value = arr.map((item) => {
                    item.levelList = item.menuList
                    return item
                })
            }
            menuList.value.forEach((item) => {
                if (item.web_url && item.web_url == route.path) {
                    active.value = item.id + ''
                } else if (item.levelList && item.levelList.length != 0) {
                    item.levelList.forEach((i) => {
                        if (i.web_url && i.web_url == route.path) {
                            active.value = i.id + ''
                        }
                    })
                }
            })
            menuList.value.sort((a, b) => a.sort - b.sort)
        } catch (error) {
            console.log(error)
        }
    })
    watch(
        () => route.path,
        () => {
            menuList.value.forEach((item) => {
                if (item.web_url && item.web_url == route.path) {
                    active.value = item.id + ''
                } else if (item.levelList && item.levelList.length != 0) {
                    item.levelList.forEach((i) => {
                        if (i.web_url && i.web_url == route.path) {
                            active.value = i.id + ''
                        }
                    })
                }
            })
        },
        { immediate: true },
    )
    const SettingStore = useSettingStore()
    const showLiaoTian = async () => {
        let base64Query = {
            service_id: Base64.encode(UserStore.userInfo.service_id),
            ysh: Base64.encode(UserStore.userInfo.userId + '_' + UserStore.userInfo.phone),
        }
        window.open(
            `https://chat.ustudygroup.com/service/login/check_nopass?service_id=${base64Query.service_id}&ysh=${base64Query.ysh}`,
            '_blank',
        )
    }
    // 是否折叠
    const isCollapse = computed(() => !SettingStore.isCollapse)
    // 设置
    const themeConfig = computed(() => SettingStore.themeConfig)
</script>

<style lang="scss">
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        height: 100%;
    }
    .reds {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: red;
        margin-left: 10px;
    }
</style>
