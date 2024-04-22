<template>
    <div class="m-user-table">
        <div class="header">
            <el-form ref="ruleFormRef" :inline="true">
                <el-form-item label="店铺名称" prop="username">
                    <el-input v-model="query.shopName" placeholder="请输入店铺名称" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchInfo" :loading="loading" :icon="Search">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="footer">
            <!-- <div class="util">
                <el-button type="primary" @click="add">
                    <el-icon><Plus /></el-icon>
                    新增店铺
                </el-button>
            </div> -->
            <div class="table-inner">
                <el-table v-loading="loading" :data="tableData?.list" style="width: 100%; height: 100%" border>
                    <el-table-column prop="id" label="店铺id" align="center" />
                    <el-table-column prop="shop_name" width="120" label="店铺名称" align="center" />
                    <el-table-column prop="company_name" width="120" label="公司名称" align="center" />
                    <el-table-column label="照片" width="100" align="center">
                        <template #default="scope">
                            <div v-if="scope.row.head_photo">
                                <el-image
                                    style="width: 60px; height: 60px"
                                    :src="'https://api.ustudygroup.com/' + scope.row.head_photo"
                                    :zoom-rate="1.2"
                                    :max-scale="7"
                                    :min-scale="0.2"
                                    :initial-index="4"
                                    fit="cover"
                            /></div>
                            <img style="width: 60px; height: 60px" v-else src="@/assets/image/login/shops.png" alt="" />
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" align="center" width="150">
                        <template #default="scope">
                            <el-button type="primary" @click="changeStatus(scope.row)" v-if="scope.row.status == 0" size="small">
                                预备中
                            </el-button>
                            <el-button type="success" @click="changeStatus(scope.row)" v-if="scope.row.status == 1" size="small">
                                在线
                            </el-button>
                            <el-button type="danger" @click="changeStatus(scope.row)" v-if="scope.row.status == 2" size="small">
                                下线
                            </el-button>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="head_photo" label="照片" align="center" /> -->
                    <el-table-column prop="country" label="国家" align="center" />
                    <el-table-column prop="province" label="省份" align="center" />
                    <el-table-column prop="city" label="城市" align="center" />
                    <el-table-column prop="street" label="街道地址" width="220" align="center" />
                    <el-table-column prop="address" label="详细地址" width="240" align="center" />
                    <el-table-column prop="zip_code" label="邮编" width="100" align="center" />
                    <el-table-column prop="score" label="店铺评分" width="100" align="center" />
                    <el-table-column prop="chat_link" label="聊天三方链接" width="120" align="center" />
                    <el-table-column label="聊天第三方二维码" width="200" align="center">
                        <template #default="scope">
                            <el-image
                                style="width: 60px; height: 60px"
                                :src="'https://api.ustudygroup.com/' + scope.row.chat_code"
                                :zoom-rate="1.2"
                                :max-scale="7"
                                :min-scale="0.2"
                                :initial-index="4"
                                fit="cover"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column prop="add_time" label="添加时间" width="200" align="center" />

                    <el-table-column label="查看编辑" align="center" width="360" fixed="right">
                        <template #default="scope">
                            <el-button type="primary" size="small" icon="Edit" @click="editHandler(scope.row)">编辑 </el-button>
                            <el-button type="success" size="small" icon="View" @click="detailss(scope.row)"> 预览 </el-button>
                            <!-- <el-button type="success" size="small" icon="View" @click="showAnLi(scope.row)"> 案例 </el-button> -->
                            <el-button type="success" size="small" icon="View" @click="showTime(scope.row)"> 营业时间 </el-button>
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
        <el-drawer v-model="userDialog" title="编辑店铺" size="80%">
            <Siren :changes="changes"></Siren>
        </el-drawer>
        <el-drawer v-model="dialogVisible" title="查看店铺营业时间" size="60%">
            <Time :id="params?.id"></Time>
        </el-drawer>
        <el-drawer v-model="dialogVisibless" title="查看店铺成功案例" size="60%">
            <AnLi :id="params?.id"></AnLi>
        </el-drawer>
        <el-drawer v-model="detaissss" title="查看店铺预览" size="50%">
            <div style="display: flex; justify-content: center">
                <Details :formData="details" />
            </div>
        </el-drawer>
    </div>
</template>
<script lang="ts" setup>
    import { onMounted, reactive, ref } from 'vue'
    import { getDianPuList, changeStatusShop, getDianPuDetails } from '@/api/dianpu/apis'
    import Details from './details.vue'
    import { ElNotification } from 'element-plus'
    import Time from '@/views/system/time/components/userTable.vue'
    import AnLi from '@/views/system/anli/components/userTable.vue'
    import Siren from '../siren.vue'
    import { useSettingStore } from '@/store/modules/setting'
    import { Search } from '@element-plus/icons-vue'
    const SettingStore = useSettingStore()
    import { useUserStore } from '@/store/modules/user'
    const UserStore = useUserStore()
    const dialogVisible = ref(false)
    const dialogVisibless = ref(false)
    const pagessssss = Number(localStorage.getItem('dp')) || 1
    const pages = ref(pagessssss)
    const detaissss = ref(false)
    const role = UserStore.userInfo.isAdmin
    const details = ref({})
    const changes = ref({
        id: '',
    })
    const detailss = async (items) => {
        detaissss.value = true
        let query = {
            id: items.id,
        }
        try {
            let res = await getDianPuDetails(query)
            details.value = res.data
        } catch (error) {
            console.log(error)
        }
    }
    const tableData = ref([])
    const userDialog = ref()
    const loading = ref(true)
    const params = ref({
        id: '',
    })
    const menuDrawerRef = ref(null)
    const query = reactive({
        page: pages.value,
        pageSize: 10,
        shopName: '',
        id: '',
    })

    onMounted(async () => {
        try {
            let res = await getDianPuList(query)
            tableData.value = res.data
            loading.value = false
        } catch (error) {
            console.log(error)
        }
    })
    const searchInfo = async () => {
        loading.value = true
        try {
            let res = await getDianPuList(query)
            console.log(res)
            tableData.value = res.data
        } catch (error) {
            console.log(error)
        }
        loading.value = false
    }
    const showAnLi = (items) => {
        params.value.id = items.id
        dialogVisibless.value = true
    }
    const showTime = (items) => {
        params.value.id = items.id
        dialogVisible.value = true
    }
    //修改
    const editHandler = (row) => {
        changes.value.id = row.id
        userDialog.value = true
    }
    //修改状态
    const changeStatus = async (items) => {
        let status
        if (items.status == 0) {
            status = 1
        } else if (items.status == 1) {
            status = 2
        } else if (items.status == 2) {
            status = 1
        }
        let query = {
            id: items.id,
            status,
            userId: UserStore.userInfo.userId,
        }
        try {
            let res = await changeStatusShop(query)
            if (res.code != 1) {
                ElNotification({
                    message: res.msg,
                    type: 'error',
                    duration: 3000,
                })
            } else {
                ElNotification({
                    message: res.msg,
                    type: 'success',
                    duration: 3000,
                })
                let object = tableData.value.list.findIndex((item) => item.id == items.id)
                if (tableData.value.list[object].status == 1) {
                    tableData.value.list[object].status = 2
                } else if (tableData.value.list[object].status == 2) {
                    tableData.value.list[object].status = 1
                } else console.log(object, '测试', tableData.value.list)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const add = () => {
        menuDrawerRef.value.show()
    }
    const handleSizeChange = async (val: number) => {
        query.pageSize = val
        loading.value = true
        try {
            let res = await getDianPuList(query)
            tableData.value = res.data
            loading.value = false
        } catch (error) {
            console.log(error)
        }
    }

    const handleCurrentChange = async (val: number) => {
        query.page = val
        loading.value = true
        localStorage.setItem('dp', val)

        try {
            let res = await getDianPuList(query)
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
</style>
