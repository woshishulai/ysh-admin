<template>
    <div class="m-user-table">
        <div class="header">
            <el-form ref="ruleFormRef" :inline="true" :model="query">
                <el-form-item label="排序">
                    <img v-show="query.sort_type == 1" @click="changeSortType(2)" src="@/assets/image/login/sort1.svg" alt="" />
                    <img v-show="query.sort_type == 2" src="@/assets/image/login/sort11.svg" alt="" />
                    <img v-show="query.sort_type == 2" @click="changeSortType(1)" src="@/assets/image/login/sort2.svg" alt="" />
                    <img v-show="query.sort_type == 1" src="@/assets/image/login/sort22.svg" alt="" />
                </el-form-item>
                <el-form-item label="标签分类查询" prop="username">
                    <el-input style="width: 300px" v-model="query.label_name" placeholder="请输入标签分类" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :icon="Search" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="footer">
            <div class="util">
                <el-button type="primary" @click="add">
                    <el-icon><Plus /></el-icon>
                    新增标签类型
                </el-button>
            </div>
            <div class="table-inner">
                <el-table v-loading="loading" :data="tableData?.list" style="width: 100%; height: 100%" border>
                    <el-table-column prop="id" label="标签类型id" align="center" />
                    <el-table-column prop="type_name" label="标签类型名称" align="center" />
                    <!-- <el-table-column label="状态" align="center" width="140">
                        <template #default="scope">
                            <span class="green" v-if="scope.row.status == 1">正常</span>
                            <span class="red" v-else>冻结</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="operator" width="200" label="操作" align="center" fixed="right">
                        <template #default="scope">
                            <el-button type="primary" size="small" icon="Edit" @click="editHandler(scope.row)"> 编辑 </el-button>
                            <el-button type="danger" size="small" icon="Delete" @click="del(scope.row)"> 删除 </el-button>
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

        <UserDialog @getList="getList" :query="params" ref="userDialog" :title="title" />
    </div>
</template>
<script lang="ts" setup>
    import { ElMessageBox, ElMessage, FormInstance } from 'element-plus'
    import { onMounted, reactive, ref } from 'vue'
    import { getBiaoList, removeBiaoAPi } from '@/api/fenlei/apis'
    import { useSettingStore } from '@/store/modules/setting'
    import { ElNotification } from 'element-plus'

    const SettingStore = useSettingStore()
    import { useUserStore } from '@/store/modules/user'
    const UserStore = useUserStore()
    import UserDialog from './userDialog.vue'
    const tableData = ref([])
    const userDialog = ref()
    const loading = ref(true)
    const pagessssss = Number(localStorage.getItem('bq')) || 1
    const pages = ref(pagessssss)
    const title = ref('')
    const query = reactive({
        page: pages.value,
        pageSize: '',
        label_name: '',
        sort_type: 2,
    })
    const params = reactive({
        name: '',
        id: '',
        img: '',
        userId: UserStore.userInfo.userId,
        status: '',
    })
    onMounted(async () => {
        getList()
    })
    const getList = async () => {
        loading.value = true
        try {
            let res = await getBiaoList(query)
            tableData.value = res.data
            loading.value = false
        } catch (error) {
            console.log(error)
        }
    }
    const onSubmit = async (val: number) => {
        loading.value = true
        query.page = 1
        pages.value = 1
        try {
            let res = await getBiaoList(query)
            tableData.value = res.data
            loading.value = false
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
                    let res = await removeBiaoAPi(query)
                    // SettingStore.setReload()
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
                        getList()
                    }
                } catch (error) {
                    console.log(error)
                }
            })
            .catch(() => {})
    }
    //修改
    const editHandler = (row) => {
        title.value = '修改类型'
        params.name = row.name
        params.id = row.id
        params.status = row.status
        console.log(params)
        userDialog.value.show()
    }
    const add = () => {
        title.value = '新增类型'
        params.name = ''
        params.id = ''
        params.status = ''
        console.log(params)
        userDialog.value.show()
    }
    const changeSortType = async (index) => {
        query.sort_type = index
        query.page = 1
        pages.value = 1
        loading.value = true
        try {
            let res = await getBiaoList(query)
            tableData.value = res.data
        } catch (error) {
            console.log(error)
        }
        loading.value = false
    }
    const handleSizeChange = async (val: number) => {
        query.pageSize = val
        loading.value = true
        try {
            let res = await getBiaoList(query)
            tableData.value = res.data
            loading.value = false
        } catch (error) {
            console.log(error)
        }
    }

    const handleCurrentChange = async (val: number) => {
        query.page = val
        loading.value = true
        localStorage.setItem('bq', val)
        try {
            let res = await getBiaoList(query)
            tableData.value = res.data
            loading.value = false
        } catch (error) {
            console.log(error)
        }
    }
</script>
<style lang="scss" scoped>
    @import './index.scss';
</style>
