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
                <el-form-item label="店铺id" prop="username" v-if="role == 1">
                    <el-input v-model="query.shopId" placeholder="请输入店铺id" />
                </el-form-item>
                <el-form-item label="支付状态" prop="username">
                    <el-select v-model="query.is_pay" placeholder="请选择店铺状态" style="width: 240px">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="订单号" prop="username">
                    <el-input v-model="query.orderid" placeholder="请输入订单号" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchInfo" :loading="loading" :icon="Search">查询</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="footer">
            <div class="table-inner">
                <el-table v-loading="loading" :data="tableData?.list" style="width: 100%; height: 100%" border>
                    <el-table-column prop="shop_id" label="店铺id" width="80" align="center" />
                    <el-table-column prop="orderid" label="订单号" width="210" align="center" />
                    <el-table-column prop="shop_realname" label="商家联系人" width="100" align="center" />
                    <el-table-column prop="shop_phone" label="商家电话" width="120" align="center" />
                    <el-table-column label="订单状态" width="160" align="center">
                        <template #default="scope">
                            <span :class="getPaymentStatusColor(scope.row.is_pay)">
                                {{ getPaymentStatusText(scope.row.is_pay) }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="phone" width="140" align="center" label="商家收款凭证">
                        <template #default="scope">
                            <el-image
                                style="width: 80px"
                                :src="'https://api.ustudygroup.com/' + scope.row.ysh_voucher"
                                :zoom-rate="1.2"
                                :max-scale="7"
                                :min-scale="0.2"
                                :preview-src-list="['https://api.ustudygroup.com/' + scope.row.ysh_voucher]"
                                :initial-index="4"
                                fit="cover"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column prop="add_time" label="添加时间" width="200" align="center" />
                    <el-table-column prop="goods_name" label="商品名称" width="200" align="center" />
                    <!-- <el-table-column prop="original" label="原价" width="200" align="center" />
                    <el-table-column prop="price" label="一口价" width="200" align="center" /> -->
                    <el-table-column prop="amount_price" label="结转金额" width="200" align="center" />
                    <el-table-column prop="shop_name" width="200" label="商家名" align="center" />
                    <el-table-column prop="nickname" width="200" label="昵称" align="center" />
                    <el-table-column prop="goods_id" label="商品iD" align="center" v-if="role == 1" />
                    <el-table-column prop="uid" label="用户id" align="center" v-if="role == 1" />
                    <el-table-column label="操作" align="center" width="220" fixed="right">
                        <template #default="scope">
                            <el-button
                                type="primary"
                                @click="editHandler(scope.row)"
                                v-if="role == 1 && scope.row.is_pay != 9"
                                icon="Edit"
                                size="small"
                            >
                                编辑
                            </el-button>
                            <el-button
                                type="success"
                                @click="yesDing(scope.row)"
                                v-if="role != 1 && scope.row.is_pay == 8"
                                icon="Edit"
                                size="small"
                            >
                                确认完成
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
        <UserDialog :query="params" ref="userDialog" />
        <Details ref="detailsss" :details="details" />
    </div>
</template>
<script lang="ts" setup>
    import Details from './details.vue'
    import { onMounted, reactive, ref } from 'vue'
    import { getJieZhuanList, changeJieZhuanList } from '@/api/jiezhuan/apis'
    import { useSettingStore } from '@/store/modules/setting'
    import { ElNotification, ElMessage, FormInstance } from 'element-plus'
    import { Search } from '@element-plus/icons-vue'
    import UserDialog from './userDialog.vue'
    import { useUserStore } from '@/store/modules/user'
    const SettingStore = useSettingStore()
    const ruleFormRef = ref<FormInstance>()
    const loading = ref(true)
    const showDetails = ref(false)
    const UserStore = useUserStore()
    const tableData = ref([])
    const pagessssss = Number(localStorage.getItem('jz')) || 1
    const pages = ref(pagessssss)
    const getPaymentStatusColor = (status) => {
        return status === 1 || status === 9 ? 'green' : 'red'
    }
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
                return '商户服务完成凭证待确认'
            default:
                return '未知状态'
        }
    }
    const role = UserStore.userInfo.isAdmin
    const query = reactive({
        page: pages.value,
        pageSize: 10,
        shopId: role == 1 ? '' : UserStore.userInfo.shopId,
        orderid: '',
        is_pay: role == 1 ? '4' : '8',
        sort_type: 2,
    })
    const params = reactive({
        page: 1,
        pageSize: 10,
        shopId: role == 1 ? '' : UserStore.userInfo.shopId,
        is_pay: '',
        orderid: '',
    })
    onMounted(async () => {
        try {
            let res = await getJieZhuanList(query)
            tableData.value = res.data
            loading.value = false
        } catch (error) {
            console.log(error)
        }
    })
    const changeSortType = async (index) => {
        loading.value = true
        query.sort_type = index
        try {
            let res = await getJieZhuanList(query)
            tableData.value = res.data
            loading.value = false
        } catch (error) {
            console.log(error)
        }
        loading.value = false
    }
    const options = [
        {
            value: '4',
            label: '用户已确认(待结转)',
        },
        {
            value: '8',
            label: '结算凭证待确认',
        },
        {
            value: '9',
            label: '商家结算完成',
        },
    ]
    const details = ref('')
    const detailss = (items) => {
        details.value = items
        detailsss.value.show()
    }
    const userDialog = ref()
    const detailsss = ref(null)
    const yesDing = async (item) => {
        const query = {
            orderid: item.orderid,
            is_pay: 9,
        }

        let res = await changeJieZhuanList(query)
        if (res.code != 1) {
            ElNotification({
                message: res.msg,
                type: 'error',
                duration: 3000,
            })
        } else {
            SettingStore.setReload()
        }
        console.log(res)
    }
    const searchInfo = async () => {
        loading.value = true
        pages.value = 1
        query.page = 1
        params.page = 1
        try {
            let res = await getJieZhuanList(query)
            tableData.value = res.data
        } catch (error) {
            console.log(error)
        }
        loading.value = false
    }
    //修改
    const editHandler = (row) => {
        console.log(row)
        params.ysh_voucher = row.ysh_voucher
        params.orderid = row.orderid
        params.amount_price = row.amount_price
        userDialog.value.show()
    }
    const handleSizeChange = async (val: number) => {
        query.pageSize = val
        loading.value = true
        try {
            let res = await getJieZhuanList(query)
            tableData.value = res.data
            loading.value = false
        } catch (error) {
            console.log(error)
        }
    }
    const selects = ref([])
    const add = async () => {
        let query = {
            page: 1,
            pageSize: 10000,
            shopId: role == 1 ? '' : UserStore.userInfo.shopId,
        }
        let res = await shuju(query)
        selects.value = res.data.list
        showDetails.value = true
    }
    const handleCurrentChange = async (val: number) => {
        query.page = val
        localStorage.setItem('js', val)
        loading.value = true
        try {
            let res = await getJieZhuanList(query)
            tableData.value = res.data
            loading.value = false
        } catch (error) {
            console.log(error)
        }
    }
</script>
<style lang="scss" scoped>
    @import '../index';
    :deep(.el-table .el-table__cell) {
        position: static;
    }
    .header {
        display: flex;
        align-items: flex-start;
        img {
            height: 22px;
            cursor: pointer;
            margin-top: 1px;
            // margin-right: 4px;
            margin-left: 4px;
        }
        .sotrs {
            display: flex;
            align-items: center;
            // margin-top: 3px;
        }
    }
</style>
