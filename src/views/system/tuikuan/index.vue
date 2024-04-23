<template>
    <div class="m-user-table">
        <div class="header">
            <el-form ref="ruleFormRef" :inline="true">
                <el-form-item label="排序">
                    <img v-show="query.sort_type == 1" @click="changeSortType(2)" src="@/assets/image/login/sort1.svg" alt="" />
                    <img v-show="query.sort_type == 2" src="@/assets/image/login/sort11.svg" alt="" />
                    <img v-show="query.sort_type == 2" @click="changeSortType(1)" src="@/assets/image/login/sort2.svg" alt="" />
                    <img v-show="query.sort_type == 1" src="@/assets/image/login/sort22.svg" alt="" />
                </el-form-item>
                <el-form-item label="订单号" prop="username">
                    <el-input v-model="query.outTradeNo" placeholder="请输入订单号" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchInfo" :loading="loading" :icon="Search">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="footer">
            <div class="table-inner">
                <el-table v-loading="loading" :data="tableData?.list" style="width: 100%; height: 100%" border>
                    <el-table-column prop="shop_name" width="200" label="店铺" align="center" v-if="role == 1" />
                    <el-table-column prop="order_id" width="200" label="订单号" align="center" />
                    <el-table-column prop="price" label="订单钱数" width="200" align="center" />
                    <el-table-column prop="name" label="服务商品" width="200" align="center" />
                    <el-table-column prop="nickname" label="申请人" width="200" align="center" />
                    <!-- <el-table-column prop="auserId" label="s" width="200" align="center" /> -->
                    <el-table-column prop="create_time" label="申请时间" width="200" align="center" />
                    <el-table-column label="状态" align="center">
                        <template #default="scope">
                            {{
                                scope.row.status == 1
                                    ? '申请中'
                                    : scope.row.status == 2
                                    ? '已批准'
                                    : scope.row.status == 3
                                    ? '已拒绝'
                                    : scope.row.status == 4
                                    ? '已撤销'
                                    : '未知状态'
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="up_time" width="200" label="审批时间" align="center" />
                    <el-table-column prop="refund_cause" label="退款原因" width="200" align="center" />
                    <el-table-column prop="no_cause" width="200" label="拒绝原因" align="center" />
                    <el-table-column label="操作" align="center" width="220" fixed="right">
                        <template #default="scope">
                            <el-button type="primary" @click="editHandler(scope.row)" icon="Edit" size="small"> 编辑 </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination">
                <el-pagination
                    v-model:currentPage="pages"
                    :page-size="tableData.pageSize"
                    :page-sizes="[5, 10, 15, 20]"
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableData.total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </div>
        <Change ref="changeRefs" :query="params" />
    </div>
</template>
<script lang="ts" setup>
    import { getTuiList } from '@/api/tui/apis'
    import { useUserStore } from '@/store/modules/user'
    import { onMounted, reactive, ref, watch } from 'vue'
    import Change from './Change.vue'
    const changeRefs = ref(null)
    const UserStore = useUserStore()
    const tableData = ref([])
    const loading = ref(true)
    const params = ref(null)
    const pagessssss = Number(localStorage.getItem('tk')) || 1
    const pages = ref(pagessssss)
    const role = UserStore.userInfo.isAdmin
    const query = reactive({
        page: pages.value,
        pageSize: 10,
        outTradeNo: '',
        sort_type: 2,
        shopId: role == 1 ? '' : UserStore.userInfo.shopId,
        //订单号帅选
    })
    onMounted(async () => {
        try {
            let res = await getTuiList()
            tableData.value = res.data
            loading.value = false
        } catch (error) {
            console.log(error)
        }
    })
    const handleSizeChange = async (val: number) => {
        query.pageSize = val
        loading.value = true
        localStorage.setItem('tk', val)
        try {
            let res = await getTuiList(query)
            tableData.value = res.data
            loading.value = false
        } catch (error) {
            console.log(error)
        }
    }

    const changeSortType = async (index) => {
        loading.value = true
        query.sort_type = index
        try {
            let res = await getTuiList(query)
            tableData.value = res.data
            loading.value = false
        } catch (error) {
            console.log(error)
        }
    }
    const handleCurrentChange = async (val: number) => {
        query.page = val
        loading.value = true
        try {
            let res = await getTuiList(query)
            tableData.value = res.data
            loading.value = false
        } catch (error) {
            console.log(error)
        }
    }
    const searchInfo = async () => {
        loading.value = true
        pages.value = 1
        query.page = 1
        params.page = 1
        try {
            let res = await getTuiList(query)
            tableData.value = res.data
        } catch (error) {
            console.log(error)
        }
        loading.value = false
    }
    const editHandler = (items) => {
        params.value = items
        changeRefs.value.show()
    }
</script>
<style lang="scss" scoped>
    @import './index';
    .neibu {
        height: 44px;
        overflow: hidden;
        :deep(p) {
            margin: 0;
            img {
                max-width: 50px;
            }
        }
    }
</style>
