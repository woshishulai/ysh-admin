<template>
    <div class="m-user-table">
        <div class="header">
            <el-form ref="ruleFormRef" :inline="true">
                <el-form-item label="店铺id" prop="username" v-if="role == 1">
                    <el-input v-model="query.shopId" placeholder="请输入店铺id" />
                </el-form-item>
                <el-form-item label="服务名称搜索" prop="username">
                    <el-input v-model="query.name" placeholder="请输入服务名称" />
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
                    新增服务
                </el-button>
            </div>
            <div class="table-inner" v-if="tableData?.list">
                <el-table v-loading="loading" :data="tableData?.list" style="width: 100%; height: 100%" border>
                    <el-table-column prop="shop_id" label="店铺id" align="center" v-if="role == 1" />
                    <el-table-column prop="name" width="140" label="服务名称" align="center" />
                    <el-table-column label="图片" width="120" align="center">
                        <template #default="scope">
                            <el-image
                                style="width: 80px"
                                :src="'https://api.ustudygroup.com/' + scope.row.banner"
                                :zoom-rate="1.2"
                                :max-scale="7"
                                :min-scale="0.2"
                                :initial-index="4"
                                fit="cover"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column prop="type_name" label="类型" width="200" align="center" />
                    <el-table-column prop="label_name" label="标签" width="200" align="center" />
                    <el-table-column label="价格分类" align="center" width="150">
                        <template #default="scope">
                            <span class="blue" v-if="scope.row.price_type == 1">一口价</span>
                            <span class="blue" v-if="scope.row.price_type == 2">折扣价</span>
                            <span class="blue" v-if="scope.row.price_type == 3">区间价格</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="price" width="200" label="一口价（最终价）" align="center" />
                    <el-table-column prop="old_price" width="200" label="折扣价（原价）" align="center" />
                    <el-table-column prop="price_cost" width="200" label="折扣价" align="center" />
                    <el-table-column prop="price_range" label="区间价格" width="200" align="center">
                        <template #default="scope">
                            <span v-if="scope.row.price_range">
                                <!-- 处理第一个价格，如果是undefined.00则替换为0.00 -->
                                {{ handlePrice(scope.row.price_range.split(',')[0]) }}
                            </span>
                            -
                            <span v-if="scope.row.price_range">
                                <!-- 处理第二个价格，如果是undefined.00则替换为0.00 -->
                                {{ handlePrice(scope.row.price_range.split(',')[1]) }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="主推" align="center" width="150">
                        <template #default="scope">
                            <span class="red" v-if="scope.row.is_main == 0">否</span>
                            <span class="green" v-if="scope.row.is_main == 1">是</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="score" width="150" label="评分" align="center">
                        <template #default="scope">
                            <el-rate disabled v-model="scope.row.score" />
                        </template>
                    </el-table-column>
                    <el-table-column width="400" label="简短描述" align="center">
                        <template #default="scope"> <p class="neibu" v-html="scope.row.describe"></p> </template>
                    </el-table-column>
                    <!-- <el-table-column prop="details" label="详细描述" align="center" /> -->

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
                    <el-table-column prop="add_time" label="添加时间" width="200" align="center" />
                    <el-table-column label="操作" align="center" width="260" fixed="right">
                        <template #default="scope">
                            <el-button type="primary" @click="editHandler(scope.row)" icon="Edit" size="small"> 编辑 </el-button>
                            <el-button type="success" size="small" icon="View" @click="detailss(scope.row)"> 预览 </el-button>
                            <el-button type="danger" size="small" icon="Delete" v-if="role != 1" @click="del(scope.row)"> 删除 </el-button>
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
        <UserDialog :query="queryss" ref="userDialog" />
        <Customeref ref="menuDrawerRef" />
        <el-drawer v-model="detailsss" title="查看" size="60%">
            <div style="background: #f0f2f5; min-height: 700px">
                <Details :details="dddd" />
            </div>
        </el-drawer>
    </div>
</template>
<script lang="ts" setup>
    import { ElMessageBox, ElMessage, FormInstance } from 'element-plus'
    import Customeref from './CustomeRef.vue'
    import Details from './adfgb.vue'
    import { onMounted, reactive, ref } from 'vue'
    import { changeFuApi } from '@/api/fu/apis'
    import { getFuList, removeFu, getDianPuDetails } from '@/api/fu/apis'
    import { useSettingStore } from '@/store/modules/setting'
    import { Search } from '@element-plus/icons-vue'
    const SettingStore = useSettingStore()
    import { useRouter } from 'vue-router'
    import { useUserStore } from '@/store/modules/user'
    const UserStore = useUserStore()
    import UserDialog from './userDialog.vue'
    const dddd = ref({})
    const detailsss = ref(false)
    const pagessssss = Number(localStorage.getItem('fwl')) || 1
    const pages = ref(pagessssss)
    const detailss = async (items) => {
        detailsss.value = true
        let query = {
            id: items.id,
        }
        try {
            let res = await getDianPuDetails(query)
            dddd.value = res.data
        } catch (error) {}
    }
    const role = UserStore.userInfo.isAdmin
    const tableData = ref([])
    const userDialog = ref()
    const loading = ref(true)
    const menuDrawerRef = ref(null)
    const queryss = reactive({})
    const query = reactive({
        page: pages.value,
        pageSize: 10,
        name: '',
        shopId: role == 1 ? '' : UserStore.userInfo.shopId,
    })

    onMounted(async () => {
        try {
            let res = await getFuList(query)
            tableData.value = res.data
            loading.value = false
        } catch (error) {
            console.log(error)
        }
    })
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
        let query = items
        query.status = status
        try {
            let res = await changeFuApi(query)
            SettingStore.setReload()
        } catch (error) {
            console.log(error)
        }
    }
    //删除
    const del = (items) => {
        ElMessageBox.confirm('你确定要删除当前项吗?', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            draggable: true,
        })
            .then(async () => {
                let query = {
                    id: items.id,
                }
                try {
                    let res = await removeFu(query)
                    SettingStore.setReload()
                } catch (error) {
                    console.log(error)
                }
            })
            .catch(() => {})
    }
    const searchInfo = async () => {
        loading.value = true
        try {
            let res = await getFuList(query)
            console.log(res)
            tableData.value = res.data
        } catch (error) {
            console.log(error)
        }
        loading.value = false
    }
    const handlePrice = (price) => {
        const trimmedPrice = price.trim().replace('NaN', '').replace(',', '').replace('undefined', '')

        // 如果处理后的价格为空或者只是小数点，则返回0.00
        if (!trimmedPrice || trimmedPrice === '.' || trimmedPrice === '.00') {
            return '0.00'
        }

        // 否则返回处理后的价格
        return trimmedPrice
    }
    //修改
    const editHandler = (row) => {
        queryss.id = row.id
        queryss.shop_id = row.shop_id
        queryss.name = row.name
        queryss.banner = row.banner
        queryss.type_id = row.type_id + ''
        queryss.label_id = row.label_id + ''
        queryss.label_name = row.label_name
        queryss.price_type = row.price_type
        queryss.price = row.price
        queryss.price_cost = row.price_cost
        queryss.price_range = row.price_range
        queryss.is_main = row.is_main
        queryss.describe = row.describe
        queryss.details = row.details
        queryss.status = row.status
        queryss.old_price = row.old_price
        userDialog.value.show()
    }
    const add = () => {
        menuDrawerRef.value.show()
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

    const handleCurrentChange = async (val: number) => {
        query.page = val
        localStorage.setItem('fwl', val)
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
