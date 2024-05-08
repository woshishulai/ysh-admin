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
                    <el-table-column prop="shop_realname" label="商家联系人" width="100" align="center" />
                    <el-table-column prop="shop_phone" label="商家电话" width="120" align="center" />
                    <el-table-column prop="order_id" width="200" label="订单号" align="center" />

                    <el-table-column label="状态" align="center" width="140">
                        <template #default="scope">
                            <span style="color: #f56c6c" v-if="scope.row.refund_status != 0 && scope.row.refund_status != 4">
                                {{ refund_status[scope.row.refund_status] }}
                            </span>
                            <span v-else :class="getPaymentStatusColor(scope.row.is_pay)">
                                {{ getPaymentStatusText(scope.row.is_pay) }}
                            </span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="total_price" label="订单金额" width="100" align="center" />
                    <el-table-column prop="price" label="退款金额" width="100" align="center" />
                    <el-table-column prop="name" label="服务商品" width="200" align="center" />
                    <!-- <el-table-column prop="refund_cause" label="退款原因" width="200" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="no_cause" width="200" label="拒绝原因" align="center" show-overflow-tooltip> </el-table-column> -->

                    <el-table-column prop="nickname" label="申请人" width="200" align="center" />
                    <el-table-column prop="create_time" label="申请时间" width="200" align="center" />
                    <el-table-column prop="up_time" width="200" label="审批时间" align="center" />
                    <el-table-column label="操作" align="center" width="220" fixed="right">
                        <template #default="scope">
                            <el-button
                                type="primary"
                                v-if="
                                    role == 1 &&
                                    (scope.row.refund_status == 2 || scope.row.refund_status == 5 || scope.row.refund_status == 9)
                                "
                                @click="editHandler(scope.row)"
                                icon="Edit"
                                size="small"
                            >
                                平台编辑
                            </el-button>
                            <el-button
                                type="primary"
                                v-if="role != 1 && scope.row.refund_status == 1"
                                @click="editHandler(scope.row)"
                                icon="Edit"
                                size="small"
                            >
                                <!-- &&
                                    scope.row.refund_status != 4 &&
                                    scope.row.refund_status != 3 &&
                                    scope.row.refund_status != 5 &&
                                    scope.row.refund_status != 2 &&
                                    scope.row.refund_status != 9 -->
                                商家编辑
                            </el-button>
                            <el-button
                                type="primary"
                                v-if="role != 1 && scope.row.refund_status == 5"
                                @click="shangAdd(scope.row)"
                                icon="Edit"
                                size="small"
                            >
                                服务举证
                            </el-button>
                            <el-button type="success" size="small" icon="View" @click="detailss(scope.row)"> 预览 </el-button>
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
        <ShangJia ref="shangjia" :query="shangs" />
        <Details ref="detailsss" :details="details" />
    </div>
</template>
<script lang="ts" setup>
    import { getTuiList } from '@/api/tui/apis'
    import Details from './details.vue'
    import ShangJia from './shangJia.vue'
    import { useUserStore } from '@/store/modules/user'
    import { onMounted, reactive, ref, watch } from 'vue'
    import { useRoute } from 'vue-router'
    import Change from './Change.vue'
    const route = useRoute()
    const changeRefs = ref(null)
    const shangjia = ref(null)
    const UserStore = useUserStore()
    const tableData = ref([])
    const loading = ref(true)
    const shangs = ref({})
    const params = ref(null)
    const pagessssss = Number(localStorage.getItem('tk')) || 1
    const pages = ref(pagessssss)
    const role = UserStore.userInfo.isAdmin
    const query = reactive({
        page: pages.value,
        pageSize: 10,
        outTradeNo: route.query.orderid,
        sort_type: 2,
        shopId: role == 1 ? '' : UserStore.userInfo.shopId,
        //订单号帅选
    })
    const getPaymentStatusText = (status) => {
        switch (status) {
            case 1:
                return '用户已支付'
            case 2:
                return '用户未支付'
            case 3:
                return '用户支付凭证待确认'
            case 4:
                return '用户已确认'
            case 5:
                return '已取消'
            case 6:
                return '申请退款中'
            case 7:
                return '已退款'
            case 8:
                return '结算凭证待确认'
            case 9:
                return '商家结算完成'
            case 10:
                return '商户服务完成凭证待客户确认'
            default:
                return '未知状态'
        }
    }
    onMounted(async () => {
        try {
            let res = await getTuiList(query)
            tableData.value = res.data
            loading.value = false
        } catch (error) {
            console.log(error)
        }
    })
    const getPaymentStatusColor = (status) => {
        return status == 0 || status == 4 ? 'green' : 'red'
    }
    const refund_status = ['', '申请退款中', '商家已同意退款', '已拒绝退款', '已撤销退款', '申诉中', '已完成', '', '', '待客服处理']
    const detailsss = ref(null)

    const details = ref({})
    //详情
    const detailss = (items) => {
        details.value.shop_id = role == 1 ? '' : UserStore.userInfo.shopId
        details.value.orderid = items.order_id
        detailsss.value.show()
    }
    const handleSizeChange = async (val: number) => {
        query.pageSize = val
        loading.value = true
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
        localStorage.setItem('tk', val)

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
    const shangAdd = (items) => {
        shangs.value = items
        shangjia.value.show()
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
