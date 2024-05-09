<template>
    <div class="m-user-table">
        <div class="footer">
            <div class="util">
                <el-button type="primary" @click="add">
                    <el-icon><Plus /></el-icon>
                    新增
                </el-button>
            </div>
            <div class="table-inner">
                <el-table v-loading="loading" :data="tableData?.list" style="width: 100%; height: 100%" border>
                    <el-table-column label="图片" width="260" align="center">
                        <template #default="scope">
                            <el-image
                                style="width: 220px; height: 80px"
                                :src="'https://api.ustudygroup.com/' + scope.row.img"
                                :zoom-rate="1.2"
                                :max-scale="7"
                                :min-scale="0.2"
                                :preview-src-list="['https://api.ustudygroup.com/' + scope.row.img]"
                                :initial-index="4"
                                fit="cover"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column label="跳转" align="center" width="220">
                        <template #default="scope">
                            <span>{{ scope.row.jump_type == 1 ? '服务' : '商户' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" align="center" width="220">
                        <template #default="scope">
                            <span :class="scope.row.status == 1 ? 'blue' : 'red'">{{ scope.row.status == 1 ? '正常' : '冻结' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="bname" width="220" label="备注" align="center" />
                    <el-table-column prop="sort" label="排序" align="center" />
                    <el-table-column prop="counter_id" label="商户id/服务id" width="200" align="center" />
                    <el-table-column prop="user_id" label="创建人id" width="200" align="center" />
                    <el-table-column label="操作" align="center" width="220" fixed="right">
                        <template #default="scope">
                            <el-button type="primary" @click="editHandler(scope.row)" icon="Edit" size="small"> 编辑 </el-button>
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
        <Customeref ref="menuDrawerRef" />
        <Change ref="changeRefs" :query="params" />
    </div>
</template>
<script lang="ts" setup>
    import { ElMessageBox, ElMessage, FormInstance } from 'element-plus'
    import { getBannerList, delBannerList } from '@/api/banner/apis'
    import { useUserStore } from '@/store/modules/user'
    import { useSettingStore } from '@/store/modules/setting'
    import { onMounted, reactive, ref, watch } from 'vue'
    import Customeref from './CustomeRef.vue'
    const SettingStore = useSettingStore()
    import Change from './Change.vue'
    const menuDrawerRef = ref(null)
    const changeRefs = ref(null)
    const UserStore = useUserStore()
    const tableData = ref([])
    const loading = ref(true)
    const params = ref(null)
    const role = UserStore.userInfo.isAdmin
    const pagessssss = Number(localStorage.getItem('banner')) || 1
    const pages = ref(pagessssss)
    const query = reactive({
        page: pages.value,
        pageSize: 10,
    })
    onMounted(async () => {
        try {
            let res = await getBannerList()
            tableData.value = res.data
            tableData.value.list = tableData.value.list.sort((a, b) => a.sort - b.sort)
            loading.value = false
        } catch (error) {
            console.log(error)
        }
    })
    const handleSizeChange = async (val: number) => {
        query.pageSize = val
        loading.value = true
        try {
            let res = await getBannerList(query)
            tableData.value = res.data
            loading.value = false
        } catch (error) {
            console.log(error)
        }
    }

    const handleCurrentChange = async (val: number) => {
        localStorage.setItem('banner', val)
        query.page = val
        loading.value = true
        try {
            let res = await getBannerList(query)
            tableData.value = res.data
            loading.value = false
        } catch (error) {
            console.log(error)
        }
    }

    const add = () => {
        menuDrawerRef.value.show()
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
                    let res = await delBannerList(query)
                    SettingStore.setReload()
                } catch (error) {
                    console.log(error)
                }
            })
            .catch(() => {})
    }
    const editHandler = (items) => {
        console.log(items)
        params.value = items
        changeRefs.value.show()
    }
</script>
<style lang="scss" scoped>
    :deep(.el-table .el-table__cell) {
        position: static;
    }
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
