<template>
    <div class="m-user-table">
        <!-- <div class="header">
            <el-form ref="ruleFormRef" :inline="true">
                <el-form-item label="店铺案例id" prop="username">
                    <el-input v-model="query.shop_id" placeholder="请输入店铺案例id" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchInfo" :loading="loading" :icon="Search">查询</el-button>
                </el-form-item>
            </el-form>
        </div> -->
        <div class="footer">
            <div class="util">
                <el-button type="primary" @click="add">
                    <el-icon><Plus /></el-icon>
                    新增店铺营业时间
                </el-button>
            </div>
            <div class="table-inner">
                <el-table v-loading="loading" :data="tableData" style="width: 100%; height: 100%" border>
                    <!-- <el-table-column prop="shop_id" label="关联店铺id" align="center" /> -->

                    <el-table-column label="工作日期" align="center">
                        <template #default="scope">
                            {{
                                scope.row.week == 1
                                    ? '周一'
                                    : scope.row.week == 2
                                    ? '周二'
                                    : scope.row.week == 3
                                    ? '周三'
                                    : scope.row.week == 4
                                    ? '周四'
                                    : scope.row.week == 5
                                    ? '周五'
                                    : scope.row.week == 6
                                    ? '周六'
                                    : scope.row.week == 7
                                    ? '周日'
                                    : ''
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column label="工作日期" align="center">
                        <template #default="scope">
                            <span v-if="scope.row.status != 1" class="green"> 休息</span>
                            <span v-else class="blue">营业 </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="start_time" label="开始营业时间" align="center" />
                    <el-table-column prop="end_time" label="结束营业时间" align="center" />
                    <el-table-column label="操作" align="center" width="190" fixed="right">
                        <template #default="scope">
                            <div style="display: flex; align-items: center; gap: 20px">
                                <el-button type="primary" size="small" icon="Edit" @click="editHandler(scope.row)"> 编辑 </el-button>
                                <el-button type="danger" @click="removePings(scope.row.id)" icon="Delete" size="small"> 删除 </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <CustomeRef @getList="getList" ref="menuDrawerRef" :query="query" />
        <UserDialog @getList="getList" :query="params" ref="userDialog" />
    </div>
</template>
<script lang="ts" setup>
    import { onMounted, reactive, ref, watch } from 'vue'
    import { getTimeList, removeTimeLists } from '@/api/time/apis'
    import CustomeRef from './CustomeRef.vue'
    import { ElNotification } from 'element-plus'
    import UserDialog from './userDialog.vue'
    import { useUserStore } from '@/store/modules/user'
    import { useSettingStore } from '@/store/modules/setting'
    import { useRoute } from 'vue-router'
    const SettingStore = useSettingStore()
    const user = useUserStore()
    const tableData = ref([])
    const userDialog = ref()
    const route = useRoute()
    const loading = ref(true)
    const menuDrawerRef = ref(null)
    let props = defineProps({
        id: Number,
    })
    // const query = reactive({
    //     shop_id: route.query.id || props.id,
    // })
    const query = reactive({
        shop_id: route.query.id || props.id,
    })
    const UserStore = useUserStore()
    const role = UserStore.userInfo.isAdmin

    const params = ref({})
    watch(
        () => props.id,
        async (newQuery) => {
            loading.value = true
            query.shop_id = props.id
            try {
                let res = await getTimeList(query)
                tableData.value = res.data
                tableData.value.sort((a, b) => a.week - b.week)
                query.shop_id = route.query.id || props.id
            } catch (error) {
                console.log(error)
            }
            loading.value = false
        },
        {
            immediate: true,
            deep: true,
        },
    )
    onMounted(async () => {
        try {
            let res = await getTimeList(query)
            tableData.value = res.data
            tableData.value.sort((a, b) => a.week - b.week)
            query.shop_id = route.query.id || props.id
        } catch (error) {
            console.log(error)
        }
        loading.value = false
    })
    const getList = async () => {
        let res = await getTimeList(query)
        tableData.value = res.data
        tableData.value.sort((a, b) => a.week - b.week)
    }
    //修改
    const editHandler = (items) => {
        params.value.start_time = items.start_time
        params.value.end_time = items.end_time
        params.value.week = items.week
        params.value.status = items.status
        params.value.userId = user.userInfo.userId
        params.value.shop_id = query.shop_id || user.userInfo.shopId
        params.value.id = items.id
        userDialog.value.show()
    }
    const removePings = async (items) => {
        let querys = {
            shop_id: query.shop_id || user.userInfo.shopId,
            id: items,
        }
        let res = await removeTimeLists(querys)
        if (res.code == 1) {
            getList()
        } else {
            ElNotification({
                message: res.msg,
                type: 'error',
                duration: 3000,
            })
        }
    }
    const add = () => {
        menuDrawerRef.value.show()
    }
</script>
<style lang="scss" scoped>
    @import '../index';
</style>
