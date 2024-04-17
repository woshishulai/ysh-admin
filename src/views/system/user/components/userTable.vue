<template>
    <div class="m-user-table">
        <div class="header">
            <el-form ref="ruleFormRef" :inline="true">
                <el-form-item label="选择时间" prop="username">
                    <el-date-picker
                        v-model="query.time"
                        type="daterange"
                        range-separator="到"
                        start-placeholder="开始时间"
                        end-placeholder="指定时间"
                    />
                </el-form-item>
                <el-form-item>
                    <el-input v-model="query.id" style="width: 240px" placeholder="用户id" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addHandler">
                        <el-icon><Search /></el-icon>
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="footer">
            <div class="table-inner">
                <el-table v-loading="loading" :data="tableData?.list" style="width: 100%; height: 100%" border>
                    <el-table-column prop="id" label="用户id" align="center" />
                    <el-table-column label="头像" width="126" align="center">
                        <template #default="scope">
                            <el-image
                                style="width: 100px; height: 100px"
                                :src="scope.row.head_img"
                                :zoom-rate="1.2"
                                :max-scale="7"
                                :min-scale="0.2"
                                :initial-index="4"
                                fit="cover"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column prop="nickname" label="昵称" align="center" />
                    <el-table-column prop="phone" label="电话" align="center" />
                    <el-table-column prop="mail" label="邮箱" align="center" />
                    <el-table-column label="状态" align="center" width="140">
                        <template #default="scope">
                            <span class="green" v-if="scope.row.status == 1">正常</span>
                            <span class="red" v-else>冻结</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="up_time" label="更新时间" width="170" align="center" />
                    <!-- <el-table-column prop="password" width="170" label="密码" align="center" /> -->
                    <el-table-column prop="operator" width="170" label="操作" align="center" fixed="right">
                        <template #default="scope">
                            <el-button type="success" size="small" icon="View" @click="detailss(scope.row)"> 查看 </el-button>
                            <el-button type="primary" size="small" icon="Edit" @click="editHandler(scope.row)"> 编辑 </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination">
                <el-pagination
                    v-model:currentPage="tableData.page"
                    :page-size="tableData.pageSize"
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableData.total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </div>

        <el-dialog v-model="showDetails" width="600" :before-close="giam">
            <el-descriptions title="用户" direction="vertical" :column="4" :size="size" border>
                <el-descriptions-item label="ID">{{ userInfos.id }}</el-descriptions-item>
                <el-descriptions-item label="昵称">{{ userInfos.nickname }}</el-descriptions-item>
                <el-descriptions-item label="头像"> <el-avatar :size="50" :src="userInfos.head_img" /></el-descriptions-item>
                <el-descriptions-item label="电话">{{ userInfos.phone }}</el-descriptions-item>
                <el-descriptions-item label="邮箱">
                    {{ userInfos.mail }}
                </el-descriptions-item>
                <el-descriptions-item label="创建时间">{{ userInfos.add_time }} </el-descriptions-item>
            </el-descriptions>
        </el-dialog>
        <UserDialog :query="query" ref="userDialog" />
    </div>
</template>
<script lang="ts" setup>
    import { Search } from '@element-plus/icons-vue'
    import { onMounted, reactive, ref } from 'vue'
    import { ElNotification, ElMessage, FormInstance } from 'element-plus'
    import { getKehuList } from '@/api/user'
    import { useRouter } from 'vue-router'
    const router = useRouter()
    import UserDialog from './userDialog.vue'
    import { useUserStore } from '@/store/modules/user'
    const UserStore = useUserStore()
    const showDetails = ref(false)
    const tableData = ref([])
    const userInfos = ref({})
    const userDialog = ref()
    const role = UserStore.userInfo.isAdmin
    const loading = ref(true)
    const query = reactive({
        title: '修改昵称',
        time: [],
        startTime: '',
        ednTime: '',
        page: 1,
        pageSize: 10,
        id: '',
        // shop_id: role == 1 ? '' : UserStore.userInfo.shopId,
    })
    onMounted(async () => {
        if (role != 1) {
            router.push('/')
            return
        }
        try {
            let res = await getKehuList(query)
            tableData.value = res.data
        } catch (error) {
            console.log(error)
        }
        loading.value = false
    })
    function convertToFormat(dateStr) {
        const date = new Date(dateStr)
        let formattedDate = date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        })
        return formattedDate.replace(/\//g, '-')
    }

    const addHandler = async () => {
        if (query.time.length == 0) {
            query.startTime = ''
            query.ednTime = ''
        } else {
            query.startTime = convertToFormat(query.time[0])
            query.ednTime = convertToFormat(query.time[1])
            delete query.title
        }
        loading.value = true
        try {
            let res = await getKehuList(query)
            console.log(res)
            tableData.value = res.data
            loading.value = false
        } catch (error) {
            console.log(error)
        }
    }
    const editHandler = (row) => {
        query.id = row.id
        query.nickname = row.nickname
        console.log(query)
        userDialog.value.show(row)
    }
    const detailss = (row) => {
        userInfos.value = row
        showDetails.value = true
    }

    const handleSizeChange = async (val: number) => {
        query.pageSize = val
        loading.value = true
        try {
            let res = await getKehuList(query)
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
            let res = await getKehuList(query)
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
