<template>
    <div class="app-container m-user-table">
        <div class="header">
            <el-form ref="ruleFormRef" :inline="true" :model="params">
                <el-form-item label="排序">
                    <img v-show="params.sort_type == 1" @click="changeSortType(2)" src="@/assets/image/login/sort1.svg" alt="" />
                    <img v-show="params.sort_type == 2" src="@/assets/image/login/sort11.svg" alt="" />
                    <img v-show="params.sort_type == 2" @click="changeSortType(1)" src="@/assets/image/login/sort2.svg" alt="" />
                    <img v-show="params.sort_type == 1" src="@/assets/image/login/sort22.svg" alt="" />
                </el-form-item>
                <el-form-item label="商户查询" prop="username">
                    <el-input style="width: 300px" v-model="params.username" placeholder="请输入公司,店铺或邮箱查询" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :icon="Search" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="footer">
            <!-- <div class="util">
                <el-button type="primary" @click="add">
                    <el-icon><Plus /></el-icon>
                    新增用户
                </el-button>
            </div> -->
            <div class="table-wrap">
                <el-table :data="tableData?.list" style="width: 100%" border default-expand-all row-key="id" class="table">
                    <!-- <el-table-column prop="id" align="center" label="用户id" /> -->
                    <el-table-column prop="username" align="center" label="账号" width="200" />
                    <el-table-column prop="username" align="center" label="邮箱" width="200" />
                    <el-table-column prop="realname" align="center" label="商户名称" width="160" />
                    <el-table-column prop="shop_id" align="center" label="店铺id" width="160" />
                    <el-table-column prop="shop_name" align="center" label="店铺名称" width="160" />
                    <el-table-column label="状态" align="center" width="150">
                        <template #default="scope">
                            <el-button type="success" @click="changeStatus(scope.row)" v-if="scope.row.status == 1" size="small">
                                正常
                            </el-button>
                            <el-button type="danger" @click="changeStatus(scope.row)" v-if="scope.row.status == 2" size="small">
                                停用
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="phone" align="center" width="170" label="手机号" />
                    <el-table-column prop="realname" align="center" label="商户名称" width="160" />
                    <el-table-column label="类型" align="center" width="160">
                        <template #default="scope">
                            <span class="green" v-if="scope.row.company_type == 1">公司</span>
                            <span class="blue" v-if="scope.row.company_type == 2">个人</span>
                            <!-- <el-button type="success" v-if="scope.row.status == 1" size="small"> 正常 </el-button>
                            <el-button type="danger" v-else size="small"> 冻结 </el-button> -->
                        </template>
                    </el-table-column>

                    <el-table-column prop="status" align="center" width="170" label="操作" fixed="right">
                        <template #default="scope">
                            <div class="cell">
                                <!-- <el-button v-if="scope.row.children" type="success" size="small" :icon="Plus" @click="add()">
                                    新增
                                </el-button> -->
                                <el-button type="primary" size="small" icon="Edit" @click="edit(scope.row)"> 编辑 </el-button>
                                <el-button type="danger" size="small" icon="Delete" @click="del(scope.row)"> 删除 </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination">
                <el-pagination
                    v-model:currentPage="pages"
                    :page-size="tableData.pageSize"
                    :page-sizes="[10, 15, 18, 23]"
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableData.total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </div>
        <CustomeRef ref="menuDrawerRef" :query="query" :selects="selects" :selectss="selectss" :title="title" />
    </div>
</template>

<script lang="ts" setup>
    import { ElMessageBox, FormInstance } from 'element-plus'
    import { reactive, ref, onMounted } from 'vue'
    import { Plus } from '@element-plus/icons-vue'
    import CustomeRef from './components/CustomeRef.vue'
    import { getYongHuList, changeYongHuList, removeYongHuAPi } from '@/api/yonghu/apis'
    import { getAdminList } from '@/api/juese/apis'
    import { removeMenuAPi } from '@/api/caidan/apis'
    import { ElNotification } from 'element-plus'
    import { useUserStore } from '@/store/modules/user'
    import { addYongHuList } from '@/api/yonghu/apis'
    import { useSettingStore } from '@/store/modules/setting'
    const SettingStore = useSettingStore()
    const user = useUserStore()
    const tableData = ref({})
    const loading = ref(true)
    const selects = ref([])
    const selectss = ref([])
    const pagessssss = Number(localStorage.getItem('sh')) || 1
    const pages = ref(pagessssss)
    const params = reactive({
        page: pages.value,
        pageSize: 10,
        username: '',
        shopName: '',
        sort_type: 2,
    })
    onMounted(async () => {
        try {
            let res = await getYongHuList(params)
            tableData.value = res.data
            console.log(tableData.value, '这里')
        } catch (err) {
            console.log(err)
        }
    })
    onMounted(async () => {
        try {
            let res = await changeYongHuList()
            selects.value = res.data
        } catch (error) {
            console.log(error)
        }
    })
    onMounted(async () => {
        try {
            let res = await getAdminList()
            selectss.value = res.data.map((item) => {
                item.realname = item.rolename
                delete item.rolename
                return item
            })
        } catch (error) {
            console.log(error)
        }
    })
    const onSubmit = async (val: number) => {
        loading.value = true
        params.shopName = params.username
        params.page = 1
        pages.value = 1
        localStorage.setItem('sh', 1)
        try {
            let res = await getYongHuList(params)
            tableData.value = res.data
            loading.value = false
        } catch (error) {
            console.log(error)
        }
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
        let query = items
        query.status = status
        query.roleId = 0
        query.password = ''
        query.userId = user.userInfo.userId
        query.shopId = items.shop_id
        delete query.company_type
        delete query.shop_name
        try {
            let res = await addYongHuList(query)
            if (res.code == 1) {
                ElNotification({
                    message: res.msg,
                    type: 'success',
                    duration: 3000,
                })
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
    }
    const changeSortType = async (index) => {
        params.sort_type = index
        params.page = 1
        pages.value = 1
        loading.value = true
        try {
            let res = await getYongHuList(params)
            tableData.value = res.data
        } catch (error) {
            console.log(error)
        }
        loading.value = false
    }
    const handleCurrentChange = async (val: number) => {
        params.page = val
        localStorage.setItem('sh', val)
        loading.value = true
        try {
            let res = await getYongHuList(params)
            tableData.value = res.data
            loading.value = false
        } catch (error) {
            console.log(error)
        }
    }
    const handleSizeChange = async (val: number) => {
        params.pageSize = val
        loading.value = true
        try {
            let res = await getYongHuList(params)
            tableData.value = res.data
            loading.value = false
        } catch (error) {
            console.log(error)
        }
    }
    const menuDrawerRef = ref()
    const title = ref('创建用户')
    const query = reactive({
        id: '',
        username: '',
        userId: user.userInfo.userId,
        password: '',
        roleId: '',
        shopId: '',
        phone: '',
        realname: '',
    })
    //添加
    const add = (items, index) => {
        Object.keys(query).forEach((key) => {
            query[key] = ''
        })
        query.userId = user.userInfo.userId
        menuDrawerRef.value.show()
    }
    //修改
    const edit = (items) => {
        selects.value.forEach((item) => {
            if (items.shop_name == item.shop_name) {
                query.shopId = item.id
            }
        })
        query.id = items.id
        query.username = items.username
        query.password = items.password
        query.roleId = items.realname
        query.phone = items.phone
        query.realname = items.realname
        query.status = items.status
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
                    let res = await removeYongHuAPi(query)
                    SettingStore.setReload()
                } catch (error) {
                    console.log(error)
                }
            })
            .catch(() => {})
    }
</script>

<style scoped lang="scss">
    .m-user {
        display: flex;
        flex-direction: row;
    }
    .m-user-table {
        display: flex;
        flex-direction: column;
        flex: 1;
        position: relative;
        width: calc(100% - 230px);
        .header {
            display: flex;
            padding: 16px 16px 0px 16px;
            margin-bottom: 16px;
            border-radius: 4px;
            background: white;
            box-shadow: 0 0 12px rgb(0 0 0 / 5%);
        }
        .footer {
            flex: 1;
            display: flex;
            padding: 16px;
            flex-direction: column;
            border-radius: 4px;
            overflow: hidden;
            background: white;
            box-shadow: 0 0 12px rgb(0 0 0 / 5%);
            position: relative;
            box-sizing: border-box;
            .util {
                margin-bottom: 15px;
                display: flex;
                justify-content: flex-end;
                // justify-content: space-between;
                // width: 800px;
                gap: 30px;
                flex-shrink: 0;
            }
            .table-inner {
                flex: 1;
                position: relative;
            }
            .table {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
            }
        }
        .pagination {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            padding-top: 20px;
            box-sizing: border-box;
            flex-shrink: 0;
        }
    }

    .m-dept-side {
        box-sizing: border-box;
        width: 220px;
        height: 100%;
        padding: 18px;
        margin-right: 10px;
        flex-shrink: 0;
        ::v-deep(.el-card__body) {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            padding: 0 !important;
            .el-tree-node__content {
                height: 33px;
            }
            .el-tree {
            }
        }
        .filter-search {
            flex-shrink: 0;
            margin-bottom: 10px;
        }
        .title {
            flex-shrink: 0;
            margin: 0 0 15px;
            font-size: 18px;
            font-weight: 700;
        }
        .scrollbar {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: auto;
        }
        .filter-tree {
            flex: 1;
            overflow: hidden;
            position: relative;
        }
    }

    .header {
        display: flex;
        padding: 16px 16px 0px 16px;
        margin-bottom: 16px;
        border-radius: 4px;
        background: white;
        box-shadow: 0 0 12px rgb(0 0 0 / 5%);
    }
    .el-drawer__header > :first-child {
        font-size: 20px;
    }
    .cell {
        padding: 0;
        display: flex;
        justify-content: space-between;
        button {
            margin: 0;
        }
    }
    .footer {
        flex: 1;
        display: flex;
        padding: 16px;
        flex-direction: column;
        border-radius: 4px;
        overflow: hidden;
        background: white;
        box-shadow: 0 0 12px rgb(0 0 0 / 5%);
        position: relative;
        box-sizing: border-box;
        .util {
            margin-bottom: 15px;
            display: flex;
            justify-content: flex-end;
            flex-shrink: 0;
        }
        .table-wrap {
            flex: 1;
            display: flex;
            position: relative;
            overflow: hidden;
        }
        .table-inner {
            width: 100%;
            height: 100%;
            position: relative;
        }
        .table {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
        }
    }
</style>
