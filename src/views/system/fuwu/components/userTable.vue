<template>
    <div class="m-user-table">
        <div class="footer">
            <div class="util">
                <el-button type="primary" @click="add">
                    <el-icon><Plus /></el-icon>
                    新增服务
                </el-button>
            </div>
            <div class="table-inner">
                <el-table v-loading="loading" :data="tableData?.list" style="width: 100%; height: 100%" border>
                    <el-table-column prop="id" label="类型id" align="center" />
                    <el-table-column label="头像" width="100" align="center">
                        <template #default="scope">
                            <img style="width: 60px; height: 60px" :src="'https://api.ustudygroup.com/' + scope.row?.img" alt="" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="类型" align="center" />
                    <el-table-column label="状态" align="center" width="140">
                        <template #default="scope">
                            <span class="green" v-if="scope.row.status == 1">正常</span>
                            <span class="red" v-else>冻结</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="operator" width="170" label="操作" align="center" fixed="right">
                        <template #default="scope">
                            <el-button type="primary" size="small" icon="Edit" @click="editHandler(scope.row)"> 编辑 </el-button>
                            <el-button type="danger" v-if="scope.row.id > 7" size="small" icon="Delete" @click="del(scope.row)">
                                删除
                            </el-button>
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

        <UserDialog :query="params" ref="userDialog" :title="title" />
    </div>
</template>
<script lang="ts" setup>
    import { ElMessageBox, ElMessage, FormInstance } from 'element-plus'
    import { onMounted, reactive, ref } from 'vue'
    import { getFuList, removeFuAPi } from '@/api/fuwu/apis'
    import { useSettingStore } from '@/store/modules/setting'
    const SettingStore = useSettingStore()

    import { useUserStore } from '@/store/modules/user'
    const UserStore = useUserStore()
    import UserDialog from './userDialog.vue'
    const tableData = ref([])
    const userDialog = ref()
    const pagessssss = Number(localStorage.getItem('fwb')) || 1
    const pages = ref(pagessssss)
    const loading = ref(true)
    const title = ref('')
    const query = reactive({
        page: pages.value,
        pageSize: '',
    })
    const params = reactive({
        name: '',
        id: '',
        img: '',
        userId: UserStore.userInfo.userId,
        status: '',
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
                    let res = await removeFuAPi(query)
                    SettingStore.setReload()
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
        params.img = row.img
        params.status = row.status
        console.log(params)
        userDialog.value.show()
    }
    const add = () => {
        title.value = '新增类型'
        params.name = ''
        params.id = ''
        params.img = ''
        params.status = ''
        console.log(params)
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

    const handleCurrentChange = async (val: number) => {
        localStorage.setItem('fwb', val)
        query.page = val
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
