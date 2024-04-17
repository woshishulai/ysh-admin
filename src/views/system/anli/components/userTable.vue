<template>
    <div class="m-user-table">
        <!-- <div class="header">
            <el-form ref="ruleFormRef" :inline="true">
                <el-form-item label="店铺案例id" prop="username">
                    <el-input v-model="query.shop_id" placeholder="请输入店铺案例id" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchInfo" :loading="loading" :icon="Search">查询</el-button>
                </el-form-item>
            </el-form>
        </div> -->
        <div class="footer">
            <div class="util" v-if="role != 1">
                <el-button type="primary" @click="add">
                    <el-icon><Plus /></el-icon>
                    新增编辑店铺案例
                </el-button>
            </div>
            <div class="table-inner">
                <div v-for="(item, index) in tableData.list" :key="index">
                    <el-form :model="tableData.list[index]" :rules="rules" label-width="130px">
                        <el-form-item label="案例标题" prop="title">
                            <el-input v-model="tableData.list[index].title" placeholder="请输入店铺案例标题" />
                        </el-form-item>
                        <el-form-item label="排序" prop="sort_num">
                            <el-input v-model="tableData.list[index].sort_num" placeholder="请输入排序" />
                        </el-form-item>
                        <el-form-item label="描述" prop="describe">
                            <wang-edior v-model="tableData.list[index].describe" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="danger" @click="del(tableData.list[index])">删除</el-button>
                            <el-button type="primary" @click="handleClose(tableData.list[index])">确定</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="pagination" v-if="tableData.total > 5">
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
            </div>
        </div>
        <CustomeRef ref="menuDrawerRef" :query="query" />
        <UserDialog :query="query" ref="userDialog" />
    </div>
</template>
<script lang="ts" setup>
    import { ElMessageBox, FormInstance } from 'element-plus'
    import { onMounted, reactive, ref, watch } from 'vue'
    import { getAnList, removeAnList, addAnListInfo } from '@/api/anli/apis'
    import WangEdior from '@/components/WangEdior/index.vue'
    import CustomeRef from './CustomeRef.vue'
    import UserDialog from './userDialog.vue'
    import { useUserStore } from '@/store/modules/user'
    import { useSettingStore } from '@/store/modules/setting'
    import { useRoute } from 'vue-router'
    const UserStore = useUserStore()
    const SettingStore = useSettingStore()
    let props = defineProps({
        id: String,
    })
    const user = useUserStore()
    const tableData = ref({})
    const userDialog = ref()
    const route = useRoute()
    const loading = ref(true)
    const menuDrawerRef = ref(null)
    const query = reactive({
        page: 1,
        pageSize: 10,
        shop_id: props.id,
    })
    const role = UserStore.userInfo.isAdmin
    const rules = reactive({
        title: [{ required: true, message: '请输入案例标题', trigger: 'blur' }],
    })
    watch(
        () => props.id,
        async (newQuery) => {
            loading.value = true
            query.shop_id = props.id
            try {
                let res = await getAnList(query)
                tableData.value = res.data
            } catch (error) {
                console.log(error)
            }
            loading.value = false
        },
        {
            immediate: true,
            deep: true,
        },
    )
    onMounted(async () => {
        try {
            let res = await getAnList(query)
            tableData.value = res.data
        } catch (error) {
            console.log(error)
        }
        loading.value = false
    })
    const handleClose = async (info) => {
        let details = info.describe
        let newDetails = details.replace(/<img(.*?)>/g, function (match, p1) {
            if (p1.includes('style')) {
                // 如果已经存在 style 属性，则在里面补充样式
                return '<img' + p1.replace(/style="([^"]*)"/, 'style="$1 max-width: 100%;"') + '>'
            } else {
                // 如果不存在 style 属性，则添加一个新的 style 属性
                return '<img' + p1 + ' style="max-width: 100%;">'
            }
        })
        let params = { ...info }
        delete params.describe
        let query = { ...params }
        query.describe = newDetails
        try {
            let res = await addAnListInfo(query)
            SettingStore.setReload()
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
            let res = await getAnList(query)
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
                    let res = await removeAnList(query)
                    SettingStore.setReload()
                } catch (error) {
                    console.log(error)
                }
            })
            .catch(() => {})
    }
    const handleCurrentChange = async (val: number) => {
        query.page = val
        loading.value = true
        try {
            let res = await getAnList(query)
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
