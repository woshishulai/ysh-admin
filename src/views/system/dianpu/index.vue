<template>
    <div class="app-container m-user">
        <!-- <UserSide /> -->
        <UserTable v-if="role == 1" />
        <Siren v-else></Siren>
    </div>
</template>

<script lang="ts" setup>
    import UserTable from './components/userTable.vue'
    import Siren from './siren.vue'

    import { useUserStore } from '@/store/modules/user'
    import { useSettingStore } from '@/store/modules/setting'

    import { ref, onMounted, reactive } from 'vue'

    const UserStore = useUserStore()

    const role = UserStore.userInfo.isAdmin
</script>
