<template>
    <div>
        <el-drawer v-model="dialogVisible" :title="'订单' + props.details + '详情'" size="80%">
            <div class="box">
                <div class="top-info">
                    <div class="left">
                        <div class="title">基本信息</div>
                        <div class="item-p">
                            <span class="cu">服务(产品)名称:</span>
                            <span>{{ formData.goods_name || '' }}</span>
                        </div>
                        <div class="item-p">
                            <span class="cu">订单状态:</span>
                            <span>{{ getPaymentStatusText(formData.is_pay) }}</span>
                        </div>
                        <div class="item-p">
                            <span class="cu">创建时间:</span>
                            <span>{{ formData.add_time == 0 ? '' : formData.add_time }}</span>
                        </div>
                        <div class="item-p">
                            <span class="cu">客户留言:</span>
                            <span>{{ formData.user_leave == 0 ? '' : formData.user_leave }}</span>
                        </div>
                    </div>
                    <div class="left">
                        <div class="title">服务对象信息</div>
                        <div class="item-p">
                            <span class="cu">客户昵称:</span>
                            <span>{{ formData.nickname == 0 ? '' : formData.nickname }}</span>
                        </div>
                        <div class="item-p">
                            <span class="cu">真实姓名:</span>
                            <span>{{ formData.real_name == 0 ? '' : formData.real_name }}</span>
                        </div>
                        <div class="item-p">
                            <span class="cu">联系人电话:</span>
                            <span>{{ formData.phone == 0 ? '' : formData.phone }}</span>
                        </div>
                        <div class="item-p">
                            <span class="cu">生日:</span>
                            <span>{{ formData.birthday == 0 ? '' : formData.birthday }}</span>
                        </div>
                    </div>
                </div>
                <div class="tables" v-if="list">
                    <el-button :type="active === '支付记录' ? 'primary' : ''" @click="change('支付记录')">支付记录</el-button>
                    <el-button :type="active === '申诉记录' ? 'primary' : ''" @click="change('申诉记录')">申诉记录</el-button>
                    <el-button :type="active === '退款记录' ? 'primary' : ''" @click="change('退款记录')">退款记录</el-button>
                    <el-button :type="active === '结转记录' ? 'primary' : ''" @click="change('结转记录')">结转记录</el-button>
                    <el-table v-loading="loading" :data="list" v-if="active == '支付记录'" style="width: 100%">
                        <el-table-column prop="orderid" label="交易订单号" align="center" />
                        <el-table-column prop="price" label="付款金额" align="center" width="180" />
                        <el-table-column label="支付状态" width="120" align="center">
                            <template #default="scope">
                                <span>{{
                                    scope.row.is_pay == 1
                                        ? '用户已支付'
                                        : scope.row.is_pay == 2
                                        ? '用户未支付'
                                        : scope.row.is_pay == 3
                                        ? '用户支付凭证待确认'
                                        : scope.row.is_pay == 4
                                        ? '用户已确认'
                                        : scope.row.is_pay == 5
                                        ? '已取消'
                                        : scope.row.is_pay == 6
                                        ? '申请退款中'
                                        : scope.row.is_pay == 7
                                        ? '已退款'
                                        : scope.row.is_pay == 8
                                        ? '结算凭证待确认'
                                        : scope.row.is_pay == 10
                                        ? '商户服务完成凭证待确认'
                                        : scope.row.is_pay == 9
                                        ? '商家结算完成'
                                        : ''
                                }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="支付方式" align="center">
                            <template #default="scope">
                                <span>{{
                                    scope.row.is_pay == 2
                                        ? '未支付'
                                        : scope.row.payment == 1
                                        ? '微信'
                                        : scope.row.payment == 2
                                        ? '支付宝'
                                        : scope.row.payment == 3
                                        ? '线下'
                                        : ''
                                }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="add_time" label="支付时间" />
                    </el-table>
                    <el-table v-loading="loading" :data="list" v-if="active == '申诉记录'" style="width: 100%">
                        <el-table-column prop="order_id" label="交易订单号" align="center" width="200" />
                        <el-table-column prop="add_time" label="下单时间" align="center" width="180" />
                        <el-table-column prop="content" label="申诉时间" align="center" width="180" />
                        <el-table-column prop="goodsName" label="服务商品" align="center" />
                        <el-table-column prop="nickname" label="用户昵称" align="center" width="180" />
                        <el-form-item label="评分" prop="shop_name" align="center">
                            <el-rate disabled v-model="formData.score" />
                        </el-form-item>

                        <el-table-column label="支付状态" width="160" align="center">
                            <template #default="scope">
                                <span>{{
                                    scope.row.is_pay == 1
                                        ? '用户已支付'
                                        : scope.row.is_pay == 2
                                        ? '用户未支付'
                                        : scope.row.is_pay == 3
                                        ? '用户支付凭证待确认'
                                        : scope.row.is_pay == 4
                                        ? '用户已确认'
                                        : scope.row.is_pay == 5
                                        ? '已取消'
                                        : scope.row.is_pay == 6
                                        ? '申请退款中'
                                        : scope.row.is_pay == 7
                                        ? '已退款'
                                        : scope.row.is_pay == 8
                                        ? '结算凭证待确认'
                                        : scope.row.is_pay == 10
                                        ? '商户服务完成凭证待确认'
                                        : scope.row.is_pay == 9
                                        ? '商家结算完成'
                                        : ''
                                }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="支付方式" align="center">
                            <template #default="scope">
                                <span>{{
                                    scope.row.is_pay == 2
                                        ? '未支付'
                                        : scope.row.payment == 1
                                        ? '微信'
                                        : scope.row.payment == 2
                                        ? '支付宝'
                                        : scope.row.payment == 3
                                        ? '线下'
                                        : ''
                                }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="status" align="center" width="200" label="处理结果" />
                    </el-table>
                    <el-table v-loading="loading" v-if="active == '退款记录'" :data="list" style="width: 100%; height: 100%" border>
                        <el-table-column prop="shop_name" width="200" label="店铺" align="center" v-if="role == 1" />
                        <el-table-column prop="order_id" width="210" label="订单号" align="center" />
                        <el-table-column prop="price" label="订单钱数" width="200" align="center" />
                        <el-table-column prop="name" label="服务商品" width="200" align="center" />
                        <el-table-column prop="nickname" label="申请人" width="200" align="center" />
                        <!-- <el-table-column prop="auserId" label="s" width="200" align="center" /> -->
                        <el-table-column prop="create_time" label="申请时间" width="200" align="center" />
                        <el-table-column label="状态" align="center">
                            <template #default="scope">
                                <span>{{
                                    scope.row.status == 1 ? '通过' : scope.row.status == 2 ? '驳回' : scope.row.status == 3 ? '待处理' : ''
                                }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="up_time" width="200" label="审批时间" align="center" />
                        <el-table-column prop="refund_cause" label="退款原因" width="200" align="center" />
                        <el-table-column prop="no_cause" width="200" label="拒绝原因" align="center" />
                    </el-table>
                    <el-table v-loading="loading" v-if="active == '结转记录'" :data="list" style="width: 100%; height: 100%" border>
                        <el-table-column prop="shop_id" v-if="role == 1" label="商家id" width="200" align="center" />
                        <el-table-column prop="orderid" label="订单号" width="210" align="center" />
                        <el-table-column label="订单状态" width="160" align="center">
                            <template #default="scope">
                                <span :class="getPaymentStatusColor(scope.row.is_pay)">
                                    {{ getPaymentStatusText(scope.row.is_pay) }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="phone" width="140" align="center" label="凭证">
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
                        <el-table-column prop="original" label="原价" width="200" align="center" />
                        <el-table-column prop="price" label="一口价" width="200" align="center" />
                        <el-table-column prop="shop_name" width="200" label="商家名" align="center" />
                        <el-table-column prop="nickname" width="200" label="昵称" align="center" />
                        <el-table-column prop="goods_id" label="商品iD" align="center" v-if="role == 1" />
                        <el-table-column prop="uid" label="用户id" align="center" v-if="role == 1" />
                    </el-table>
                </div>
            </div>
        </el-drawer>
    </div>
</template>
<script lang="ts" setup>
    import { ElMessage } from 'element-plus'
    import { reactive, ref, watch, onMounted } from 'vue'
    import { FormInstance } from 'element-plus'
    import { getTuiList } from '@/api/tui/apis'
    import { getJieZhuanList, changeJieZhuanList } from '@/api/jiezhuan/apis'
    import { useUserStore } from '@/store/modules/user'

    import type { TableColumnCtx, TableInstance } from 'element-plus'
    import { getDianPuDetails } from '@/api/ding/apis'
    import { getPingList } from '@/api/ping/apis'
    const dialogVisible = ref(false)
    const formData = ref({})
    const loading = ref(false)
    const UserStore = useUserStore()
    const role = UserStore.userInfo.isAdmin
    const list = ref([])
    const active = ref('支付记录')
    const props = defineProps({
        details: {
            type: String,
            default: '',
        },
    })
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
    const getDetails = async (id) => {
        loading.value = true
        list.value = []
        try {
            let res = await getDianPuDetails(id)
            formData.value = res.data
            list.value.push(formData.value)
        } catch (error) {
            console.log(error)
        }
        loading.value = false
    }
    const getShenils = async (id) => {
        loading.value = true
        list.value = []

        try {
            let res = await getPingList(id)
            console.log(res)
            list.value = res.data.list
        } catch (error) {
            console.log(error)
        }
        loading.value = false
    }
    const getTui = async (id) => {
        loading.value = true
        list.value = []

        try {
            let res = await getTuiList(id)
            list.value = res.data.list
        } catch (error) {
            console.log(error)
        }
        loading.value = false
    }
    const getJie = async (id) => {
        loading.value = true
        id.is_pay = '9'
        list.value = []
        try {
            let res = await getJieZhuanList(id)
            list.value = res.data.list
        } catch (error) {
            console.log(error)
        }
        loading.value = false
    }
    watch(
        () => props.details,
        (newQuery, oldQuery) => {
            let query = {
                orderid: props.details,
                shopId: role == 1 ? '' : UserStore.userInfo.shopId,
            }
            console.log(query)

            active.value = '支付记录'
            if (query.orderid) {
                getDetails(query)
            }
        },
        {
            immediate: true,
            deep: true,
        },
    )

    const change = (tab) => {
        list.value = []
        let query = {
            orderid: props.details,
        }
        active.value = tab
        if (active.value == '支付记录') {
            getDetails(query)
        } else if (active.value == '申诉记录') {
            list.value = []
            // getShenils(query)
        } else if (active.value == '退款记录') {
            let query = {
                orderid: props.details,
                shopId: role == 1 ? '' : UserStore.userInfo.shopId,
            }
            getTui(query)
        } else if (active.value == '结转记录') {
            let query = {
                orderid: props.details,
                shopId: role == 1 ? '' : UserStore.userInfo.shopId,
            }
            getJie(query)
        }
    }
    const show = (item = {}) => {
        dialogVisible.value = true
    }
    const getPaymentStatus = (payment) => {
        const statusMap = {
            1: '待办理',
            2: '办理中',
            3: '已办理',
            4: '客户已确认补充',

            default: '未知状态',
        }
        return statusMap[payment] || statusMap.default
    }
    defineExpose({
        show,
    })
</script>
<style lang="scss" scoped>
    .el-drawer__header > :first-child {
        font-size: 20px;
    }
    .box {
        .top-info {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            .left {
                flex: 1;
                background-color: #f5faf7;
                padding: 10px 16px;
                .title {
                    font-size: 17px;
                    color: #666;
                    margin-bottom: 10px;
                }
                .item-p {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .cu {
                        color: #000;
                        font-weight: 500;
                        margin-top: 10px;
                    }
                }
            }
        }
        .tables {
            margin-top: 20px;
            // background-color: #f5faf7;
        }
    }
</style>
