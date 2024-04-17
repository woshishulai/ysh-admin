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
                    <el-table-column prop="title" label="标题" align="center" />
                    <el-table-column label="内容" align="center">
                        <template #default="scope">
                            <p class="neibu" v-html="scope.row.content"></p>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" fixed="right">
                        <template #default="scope">
                            <el-button type="primary" @click="editHandler(scope.row)" icon="Edit" size="small"> 编辑 </el-button>
                            <!-- <el-button type="danger" size="small" icon="Delete" @click="del(scope.row)"> 删除 </el-button> -->
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- <div class="pagination">
                <el-pagination
                    v-model:currentPage="tableData.page"
                    :page-size="tableData.pageSize"
                    :page-sizes="[5, 10, 15, 20]"
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableData.total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div> -->
        </div>
        <Customeref ref="menuDrawerRef" />
        <Change ref="changeRefs" :query="params" />
    </div>
</template>
<script lang="ts" setup>
    import { ElMessageBox, ElMessage, FormInstance } from 'element-plus'
    import { getXieYiList, addXieYiList } from '@/api/xieyi/apis'
    import { getInfoList } from '@/api/info/apis'
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
    const query = reactive({
        page: 1,
        pageSize: 10,
    })
    onMounted(async () => {
        try {
            let res = await getXieYiList()
            tableData.value = res.data
            loading.value = false
        } catch (error) {
            console.log(error)
        }
    })

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
