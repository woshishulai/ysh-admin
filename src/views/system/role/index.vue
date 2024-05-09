<template>
    <div class="app-container">
        <!-- <div class="header">
            <el-form ref="ruleFormRef" :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="formInline.roleName" placeholder="请输入角色名称" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :icon="Search" @click="onSubmit">查询</el-button>
                    <el-button @click="reset(ruleFormRef)">重置</el-button>
                </el-form-item>
            </el-form>
        </div> -->
        <div class="footer">
            <div class="util">
                <el-button type="primary" @click="add">
                    <el-icon><Plus /></el-icon>
                    新增角色
                </el-button>
            </div>
            <div class="table-inner">
                <el-table v-loading="loading" :data="tableData" style="width: 100%" border>
                    <el-table-column prop="id" align="center" label="角色id" />
                    <el-table-column prop="rolename" label="角色名称" align="center" />
                    <el-table-column prop="remark" label="备注" align="center" />
                    <el-table-column prop="userroleCount" label="角色总用户数" align="center" />
                    <el-table-column prop="id" label="角色菜单权限" align="center">
                        <template #default="scope">
                            <el-button type="primary" size="small" icon="Edit" @click="showQuanXian(scope.row.id)">
                                查看修改权限
                            </el-button>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="status" label="操作" align="center">
                        <template #default="scope">
                            <el-switch
                                v-model="scope.row.status"
                                inline-prompt
                                active-text="启用"
                                inactive-text="禁用"
                                @change="changeStatus(scope.row)"
                            />
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="status" width="300" label="操作" fixed="right">
                        <template #default="scope">
                            <div class="cell">
                                <el-button type="success" size="small" icon="View" @click="details(scope.row.userList)">
                                    查看用户列表
                                </el-button>
                                <el-button type="primary" size="small" icon="Edit" @click="edit(scope.row)"> 编辑 </el-button>
                                <el-button type="danger" size="small" icon="Delete" @click="del(scope.row)"> 删除 </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-drawer v-model="table" title="用户列表" direction="rtl" size="50%">
            <el-table :data="gridData">
                <el-table-column property="id" label="用户id" />
                <el-table-column property="realname" label="用户名称" />
                <el-table-column property="username" label="用户账号" />
            </el-table>
        </el-drawer>
        <el-drawer v-model="quanxian" title="查看修改角色菜单权限" direction="rtl" size="50%">
            <div style="color: #606266; margin-left: 24px; margin-bottom: 10px">一级菜单名称</div>
            <el-tree
                :data="treeList"
                ref="treeRef"
                show-checkbox
                node-key="id"
                empty-text="加载中，请稍后"
                :current-change="changeCheckList"
                :default-expanded-keys="checkList"
                :default-checked-keys="checkList"
                :props="defaultProps"
                @check="changeCheckList"
            />
            <el-button style="margin-top: 100px; margin-left: 24px" type="primary" :loading="loading" @click="changeQuanXian()"
                >保存修改
            </el-button>
        </el-drawer>
        <RoleDrawer ref="roleDrawer" :query="query" :title="title" />
    </div>
</template>

<script lang="ts" setup>
    import { ElMessageBox, ElMessage, FormInstance } from 'element-plus'
    import { onMounted, reactive, ref } from 'vue'
    import { ElNotification } from 'element-plus'
    import RoleDrawer from './components/roleDrawer.vue'
    import { getAdminList, removeAdminAPi, getAdminApi, changeAdminApi } from '@/api/juese/apis'
    import { useUserStore } from '@/store/modules/user'
    import { useSettingStore } from '@/store/modules/setting'
    const SettingStore = useSettingStore()

    const quanxian = ref(false)
    const user = useUserStore()
    const tableData = ref([])
    const table = ref(false)
    const gridData = ref([])
    const title = ref('')
    const query = reactive({
        id: '', //菜单id
        rolename: '', //角色名称
        remark: '', //备注
        userId: user.userInfo.userId,
    })
    onMounted(async () => {
        try {
            let res = await getAdminList()
            tableData.value = res.data
            tableData.value.sort((a, b) => a.id - b.id)
        } catch (error) {
            console.log(error)
        }
    })
    //查看用户列表
    const details = (items) => {
        gridData.value = items
        table.value = true
    }
    const roleDrawer = ref()

    const loading = ref(false)
    const add = () => {
        Object.keys(query).forEach((key) => {
            query[key] = ''
        })
        query.userId = user.userInfo.userId
        delete query.id
        title.value = '添加角色'
        roleDrawer.value.show()
    }
    //修改
    const edit = (items) => {
        query.id = items.id
        query.rolename = items.rolename
        query.remark = items.remark
        title.value = '修改角色'
        roleDrawer.value.show()
    }
    //删除
    const del = (row) => {
        ElMessageBox.confirm('你确定要删除当前项吗?', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            draggable: true,
        })
            .then(async () => {
                try {
                    let query = {
                        id: row.id,
                    }
                    let res = await removeAdminAPi(query)
                    SettingStore.setReload()
                } catch (err) {
                    console.log(err)
                }
            })
            .catch(() => {})
    }
    //树的实例
    const treeRef = ref(null)
    //树形数组
    const treeList = ref([])
    //设置字段
    const defaultProps = {
        children: 'children',
        label: 'menu_name',
    }
    // 角色id
    const jueSeId = ref('')
    //选中的
    const checkList = ref([])
    const showQuanXian = async (id) => {
        jueSeId.value = id
        let query = {
            id,
        }
        try {
            let res = await getAdminApi(query)
            treeList.value = res.data
            checkList.value = []
            treeList.value.forEach((item) => {
                if (item.isRole) {
                    checkList.value.push(item.id)
                }
                if (item.children && item.children.length) {
                    item.children.forEach((i) => {
                        if (i.isRole) {
                            checkList.value.push(i.id)
                        }
                    })
                }
            })
        } catch (error) {
            console.log(error)
        }

        quanxian.value = true
    }
    const changeCheckList = (nodeObj, SelectedObj) => {
        checkList.value = SelectedObj.checkedKeys
        console.log(checkList.value)
    }
    //取消选中
    const changeQuanXian = async () => {
        let checkId = checkList.value.join(',')
        console.log(checkId)
        let params = {
            id: jueSeId.value,
            userId: user.userInfo.userId,
            menuId: checkId,
        }
        try {
            let res = await changeAdminApi(params)
            ElNotification({
                message: res.msg,
                type: 'success',
                duration: 3000,
            })
            SettingStore.setReload()
        } catch (error) {
            console.log(error)
        }
    }
</script>

<style scoped lang="scss">
    .header {
        display: flex;
        padding: 16px 16px 0px 16px;
        margin-bottom: 16px;
        border-radius: 4px;
        background: white;
        box-shadow: 0 0 12px rgb(0 0 0 / 5%);
    }
    .cell {
        padding: 0;
        display: flex;
        justify-content: space-around;
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
</style>
