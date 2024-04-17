<template>
    <div class="m-tool-right">
        <!-- 全局字体大小 -->
        <!-- <GlobalComSize class="item-children" /> -->
        <!-- 搜索 -->
        <!-- <HeaderSearch class="item-children" /> -->
        <!-- 消息通知 -->
        <!-- <Remind class="item-children" /> -->
        <!-- 全屏展示 -->
        <ScreenFull class="item-children" />
        <!-- 控制全局主题 展示侧边栏等 -->
        <!-- <Setting class="item-children" /> -->
        <Avatar />
    </div>
</template>

<script lang="ts" setup>
    import GlobalComSize from './components/globalComSize.vue'
    import HeaderSearch from './components/HeaderSearch.vue'
    import Remind from './components/Remind.vue'
    import ScreenFull from './components/ScreenFull.vue'
    import Setting from './components/Setting.vue'
    import Avatar from './components/Avatar.vue'
</script>

<style lang="scss" scoped>
    .m-tool-right {
        display: flex;
        align-items: center;
        .item-children {
            margin-right: 22px;
        }
    }
</style>
