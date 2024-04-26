<template>
    <div class="m-user-table">
        <div class="header">
            <el-form ref="ruleFormRef" :model="query" :inline="true">
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
            <div class="util">
                <el-button type="primary" @click="add" v-if="role != 1">
                    <el-icon><Plus /></el-icon>
                    新增订单
                </el-button>
            </div>
            <div class="table-inner">
                <el-table v-loading="loading" :data="tableData?.list" style="width: 100%; height: 100%" border>
                    <el-table-column prop="add_time" label="添加时间" width="200" align="center" />
                    <el-table-column prop="orderid" label="订单号" width="220" align="center" />
                    <el-table-column label="支付状态" width="220" align="center">
                        <template #default="scope">
                            <span :class="getPaymentStatusColor(scope.row.is_pay)">
                                {{ getPaymentStatusText(scope.row.is_pay) }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="服务状态" width="160" align="center">
                        <template #default="scope">
                            <span :class="scope.row.handle == 2 || scope.row.handle == 3 ? 'green' : 'red'">
                                {{
                                    scope.row.handle == 1
                                        ? '商家未开始服务'
                                        : scope.row.handle == 2
                                        ? '商家已开始服务'
                                        : scope.row.handle == 3
                                        ? '商家服务完成'
                                        : '请核对订单状态'
                                }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="role == 1" prop="phone" width="140" align="center" label="用户支付凭证">
                        <template #default="scope">
                            <el-image
                                v-if="role == 1"
                                style="width: 80px"
                                :src="'https://api.ustudygroup.com/' + scope.row.voucher"
                                :zoom-rate="1.2"
                                :max-scale="7"
                                :min-scale="0.2"
                                :preview-src-list="['https://api.ustudygroup.com/' + scope.row.voucher]"
                                :initial-index="4"
                                fit="cover"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column prop="goods_name" label="商品名称" width="200" align="center" />
                    <el-table-column prop="price" label="服务商品金额" width="200" align="center" />

                    <el-table-column prop="shop_name" width="200" label="商家名" align="center" />
                    <el-table-column prop="nickname" width="200" label="昵称" align="center" />
                    <el-table-column prop="goods_id" label="商品iD" align="center" v-if="role == 1" />
                    <el-table-column prop="uid" label="用户id" align="center" v-if="role == 1" />

                    <el-table-column label="操作" align="center" width="220" fixed="right">
                        <template #default="scope">
                            <div style="display: flex; align-items: center; flex-wrap: wrap">
                                <el-button
                                    type="primary"
                                    v-if="role == 1 && (scope.row.is_pay === 1 || scope.row.is_pay === 3)"
                                    @click="editHandler(scope.row)"
                                    icon="Edit"
                                    size="small"
                                >
                                    编辑
                                </el-button>
                                <el-button
                                    type="primary"
                                    v-if="role != 1 && (scope.row.is_pay === 1 || scope.row.is_pay === 10)"
                                    @click="changeDing(scope.row)"
                                    icon="Edit"
                                    size="small"
                                >
                                    编辑
                                </el-button>
                                <el-button type="success" size="small" icon="View" @click="detailss(scope.row)"> 预览 </el-button>
                            </div>
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
        <el-dialog v-model="showDetails" title="新建订单" width="700">
            <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="120px">
                <el-form-item label="服务商品" prop="goods_name">
                    <el-select v-model="formData.goods_id" @change="changeId" filterable placeholder="请选择">
                        <el-option v-for="item in selects" :key="item.name" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="用户手机号" prop="phone">
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 400px">
                        <el-input
                            v-model="formData.phone"
                            style="width: 300px; border-radius: 4px 0 0 4px"
                            placeholder="请输入用户手机号查询用户id"
                        />
                        <el-button :loading="loading" style="width: 96px" class="login-btn" type="primary" @click="getUserInfos()"
                            >查询</el-button
                        >
                    </div>
                </el-form-item>
                <el-form-item label="用户id" prop="userId">
                    {{ formData.userId }}
                </el-form-item>
                <el-form-item label="原价" prop="original">
                    <el-input type="number" v-model="formData.original" style="width: 400px" placeholder="请输入原始价格" />
                </el-form-item>
                <el-form-item label="支付金额" prop="price">
                    <el-input type="number" v-model="formData.price" style="width: 400px" placeholder="请输入价格" />
                </el-form-item>
                <el-form-item label="备注" prop="user_leave">
                    <el-input type="textarea" v-model="formData.user_leave" style="width: 400px" placeholder="请输入留言" />
                </el-form-item>
                <el-form-item label="支付途径" prop="payment">
                    <el-checkbox @change="showCheck1" v-model="checked1">微信</el-checkbox>
                    <el-checkbox @change="showCheck2" v-model="checked2">线下</el-checkbox>
                </el-form-item>
                <el-form-item>
                    <el-button @click="showDetails = false">取消</el-button>
                    <el-button type="primary" @click="handleClose(ruleFormRef)">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <UserDialog @getTableList="getTableList" :query="params" ref="userDialog" />
        <Details ref="detailsss" :details="details" />
        <Shang @getTableList="getTableList" ref="shangsss" :change="shangs" />
    </div>
</template>
<script lang="ts" setup>
    import Details from './details.vue'
    import Shang from './shang.vue'
    import { getKehuList } from '@/api/user'
    import { onMounted, reactive, ref } from 'vue'
    import { getFuList, addDingDan } from '@/api/ding/apis'
    import { useSettingStore } from '@/store/modules/setting'
    import { Search } from '@element-plus/icons-vue'
    import { getFuList as shuju } from '@/api/fu/apis'
    import { ElNotification } from 'element-plus'
    const shangsss = ref(null)
    const SettingStore = useSettingStore()
    const ruleFormRef = ref<FormInstance>()
    const pagessssss = Number(localStorage.getItem('dd')) || 1
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
                return '商户服务完成凭证待客户确认'
            default:
                return '未知状态'
        }
    }
    const showDetails = ref(false)
    import { useUserStore } from '@/store/modules/user'
    const UserStore = useUserStore()
    const role = UserStore.userInfo.isAdmin
    import UserDialog from './userDialog.vue'
    const options = [
        {
            value: '',
            label: '全部',
        },
        {
            value: '1',
            label: '已支付',
        },
        {
            value: '2',
            label: '未支付',
        },
        {
            value: '3',
            label: '凭证待确认(用户线下上传)',
        },
        {
            value: '4',
            label: '用户已确认',
        },
        {
            value: '5',
            label: '已取消',
        },
        {
            value: '6',
            label: '申请退款中',
        },
        {
            value: '7',
            label: '已退款',
        },
        {
            value: '8',
            label: '结算凭证待确认',
        },
        {
            value: '9',
            label: '商家结算完成',
        },
        {
            value: '10',
            label: '商户服务完成凭证待客户确认',
        },
    ]
    const rules = reactive({
        goods_name: [{ required: true, message: '请选择商品名称', trigger: 'blur' }],
        original: [{ required: true, message: '请输入原始价格', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入用户手机号查询用户id', trigger: 'blur' }],
        price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        user_leave: [{ required: true, message: '请输入留言', trigger: 'blur' }],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        payment: [{ required: true, message: '请选择支付方式', trigger: 'blur' }],
    })
    const formData = ref({
        userId: '',
        goods_id: '',
        goods_name: '',
        address: '', //地址
        original: '', //原价
        price: '',
        user_leave: '', //留言
        payment: 1, //微信 3线下
        phone: '',
    })
    const details = ref({})
    const shangs = ref({})
    const detailss = (items) => {
        details.value.shop_id = items.shop_id
        details.value.orderid = items.orderid
        detailsss.value.show()
    }
    const changeDing = (item) => {
        console.log(item, '我是编辑订单主页面')

        Object.assign(shangs.value, item)
        shangsss.value.show()
    }
    function validatePhone(phone) {
        // 使用正则表达式检查手机号格式
        const phonePattern = /^[1][3-9]\d{9}$/
        return phonePattern.test(phone)
    }
    const changeSortType = async (index) => {
        query.sort_type = index
        loading.value = true
        try {
            let res = await getFuList(query)
            tableData.value = res.data
        } catch (error) {
            console.log(error)
        }
        loading.value = false
    }
    const getUserInfos = async () => {
        loading.value = true
        // 检查手机号是否通过校验
        if (!validatePhone(formData.value.phone)) {
            ElNotification({
                message: '手机号格式不正确',
                type: 'error',
                duration: 3000,
            })
            loading.value = false
            return
        }

        let query = {
            phone: formData.value.phone,
        }
        if (formData.value.phone) {
            try {
                let res = await getKehuList(query)
                if (res.code != 1) {
                    ElNotification({
                        message: res.msg,
                        type: 'error',
                        duration: 3000,
                    })
                    loading.value = false
                    return
                }

                if (res.data.list.length < 1) {
                    ElNotification({
                        message: '没有查询到该用户，请与用户核对绑定手机号',
                        type: 'error',
                        duration: 3000,
                    })
                    loading.value = false
                    return
                }
                formData.value.userId = res.data.list[0].id
                loading.value = false
            } catch (error) {
                console.log(error)
            }
        }
    }

    const checked1 = ref(true)
    const checked2 = ref(false)
    const showCheck1 = (item) => {
        if (item == true) {
            checked1.value = true
            checked2.value = false
            formData.value.payment = 1
        } else {
            checked2.value = true
            checked1.value = false
            formData.value.payment = 3
        }
    }
    const showCheck2 = (item) => {
        if (item == true) {
            checked2.value = true
            checked1.value = false
            formData.value.payment = 3
        } else {
            checked1.value = true
            checked2.value = false
            formData.value.payment = 1
        }
    }

    const tableData = ref([])
    const userDialog = ref()
    const loading = ref(true)
    const detailsss = ref(null)

    const query = reactive({
        page: pages.value,
        pageSize: 10,
        shopId: role == 1 ? '' : UserStore.userInfo.shopId,
        // shopId: '',
        is_pay: '', //支付状态
        orderid: '',
        sort_type: 2,
    })
    const params = reactive({
        page: 1,
        pageSize: 10,
        shopId: role == 1 ? '' : UserStore.userInfo.shopId,
        // shopId: '',
        is_pay: '', //支付状态
        orderid: '',
    })
    onMounted(() => {
        getTableList()
    })
    const getTableList = async () => {
        try {
            let res = await getFuList(query)
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
            let res = await getFuList(query)
            console.log(res)
            tableData.value = res.data
        } catch (error) {
            console.log(error)
        }
        loading.value = false
    }
    //修改
    const editHandler = (row) => {
        params.orderid = row.orderid
        params.payment = row.payment
        userDialog.value.show()
    }
    const handleSizeChange = async (val: number) => {
        query.pageSize = val
        loading.value = true
        try {
            let res = await getFuList(query)
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
    const changeId = (items) => {
        let itemss = selects.value.find((item) => item.id == items)
        formData.value.goods_name = itemss.name
        console.log(formData.value)
    }
    const handleClose = async (done: () => void) => {
        await ruleFormRef.value.validate(async (valid, fields) => {
            if (valid) {
                try {
                    formData.value.goods_id = formData.value.goods_id + ''
                    formData.value.userId = formData.value.userId + ''
                    let res = await addDingDan(formData.value)
                    if (res.code == 1) {
                        SettingStore.setReload()
                    } else {
                        ElNotification({
                            message: res.msg,
                            type: 'error',
                            duration: 3000,
                        })
                    }
                } catch (error) {
                    console.log(error)
                }
            } else {
                console.log('error submit!', fields)
            }
        })
    }
    const handleCurrentChange = async (val: number) => {
        query.page = val
        localStorage.setItem('dd', val)
        loading.value = true
        try {
            let res = await getFuList(query)
            tableData.value = res.data
            loading.value = false
        } catch (error) {
            console.log(error)
        }
    }
</script>
<style lang="scss" scoped>
    @import '../index';
</style>
