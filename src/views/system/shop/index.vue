<template>
    <div class="app-container">
        <!-- <div class="header">
            <el-form ref="ruleFormRef" :inline="true" :model="formInline">
                <el-form-item label="菜单名称" prop="username">
                    <el-input v-model="formInline.username" placeholder="请输入菜单名称" />
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
                    新增用户
                </el-button>
            </div>
            <div class="table-wrap">
                <el-table :data="tableData?.list" style="width: 100%" border default-expand-all row-key="id" class="table">
                    <el-table-column prop="username" label="账号" />
                    <el-table-column prop="id" label="用户id" />
                    <el-table-column prop="phone" width="170" label="手机号" />
                    <el-table-column prop="realname" label="商户名称" />
                    <el-table-column prop="shop_id" label="所属店铺id" />
                    <el-table-column prop="shop_name" label="店铺名称" />
                    <el-table-column label="状态">
                        <template #default="scope">
                            {{ scope.row.status == 1 ? '正常' : '冻结' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" width="170" label="操作">
                        <template #default="scope">
                            <div class="cell">
                                <el-button v-if="scope.row.children" type="success" size="small" :icon="Plus" @click="add(scope.row, 1)">
                                    新增
                                </el-button>
                                <el-button type="primary" size="small" icon="Edit" @click="edit(scope.row)"> 编辑 </el-button>
                                <el-button type="danger" size="small" icon="Delete" @click="del(scope.row)"> 删除 </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <MenuDrawer ref="menuDrawerRef" :query="query" :title="title" />
    </div>
</template>

<script lang="ts" setup>
    import { ElMessageBox, FormInstance } from 'element-plus'
    import { reactive, ref, onMounted } from 'vue'
    import { Plus } from '@element-plus/icons-vue'
    import MenuDrawer from './components/MenuDrawer.vue'
    import { getYongHuList } from '@/api/yonghu/apis'
    import { removeMenuAPi } from '@/api/caidan/apis'
    import { useUserStore } from '@/store/modules/user'
    import { useSettingStore } from '@/store/modules/setting'
    const SettingStore = useSettingStore()
    const user = useUserStore()
    const tableData = ref({})
    onMounted(async () => {
        try {
            let res = await getYongHuList()
            tableData.value = res.data
            console.log(tableData.value)
        } catch (err) {
            console.log(err)
        }
    })
    const menuDrawerRef = ref()
    const title = ref('')
    const ruleFormRef = ref<FormInstance>()
    const formInline = reactive({
        username: '',
    })
    const query = reactive({
        id: '', //菜单id
        parentId: '', //父id
        userId: user.userInfo.userId, //用户id
        menuname: '', //菜单名称
        sort: '', //排序
        menuType: 1, //菜单类型
        WebUrl: '', //路由地址,
        icoUrl: '', //图标
        icoClass: '', //图标样式
        remark: '', //备注,
    })
    //重制
    const reset = (formEl: FormInstance | undefined) => {}
    //提交
    const onSubmit = () => {
        console.log('submit!', formInline)
    }
    //添加
    const add = (items, index) => {
        Object.keys(query).forEach((key) => {
            query[key] = ''
        })

        if (items) {
            query.parentId = items.id
            query.id = ''
        } else {
            delete query.id
            query.parentId = ''
        }
        query.userId = user.userInfo.userId
        query.menuType = 1
        menuDrawerRef.value.show()
    }
    //修改
    const edit = (items) => {
        let res = tableData.value.find((item) => {
            return item.children.some((i) => i === items)
        })
        if (res) {
            //如果上面有父级
            query.parentId = res.id
        } else {
            delete query.parentId
        }
        title.value = '编辑菜单'
        query.id = items.id
        query.menuname = items.menu_name
        query.sort = items.sort
        query.menuType = items.menu_type
        query.WebUrl = items.web_url
        query.icoUrl = items.ico_url
        query.icoClass = items.ico_class
        query.remark = items.remark
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
                    let res = await removeMenuAPi(query)
                    SettingStore.setReload()
                } catch (error) {
                    console.log(error)
                }
            })
            .catch(() => {})
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
