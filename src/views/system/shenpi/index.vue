<template>
    <div class="m-user-table">
        <div class="header">
            <el-form ref="ruleFormRef" :model="query" :inline="true">
                <el-form-item label="审批状态" prop="username">
                    <el-select v-model="querys.status" placeholder="请选择店铺状态" style="width: 240px">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchInfo" :loading="loading" :icon="Search">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="footer">
            <div class="table-inner">
                <el-table
                    v-loading="loading"
                    :data="tableData?.list"
                    style="width: 100%"
                    border
                    default-expand-all
                    row-key="id"
                    class="table"
                >
                    <el-table-column prop="id" width="140" align="center" label="审批列表id" />
                    <el-table-column prop="name" width="140" align="center" label="联系人姓名" />
                    <el-table-column prop="phone" width="140" align="center" label="手机号" />
                    <el-table-column prop="mail" width="200" align="center" label="邮箱地址" />
                    <el-table-column prop="address" width="200" align="center" label="邮寄地址" />
                    <el-table-column prop="wechat" width="140" align="center" label="微信" />
                    <el-table-column label="公司类型" width="140" align="center">
                        <template #default="scope">
                            {{ scope.row.company_type == 1 ? '企业 ' : '个人' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="company_name" align="center" width="140" label="公司名称 " />
                    <el-table-column label="店铺名称类型" align="center" width="140">
                        <template #default="scope">
                            {{ scope.row.shop_type == 1 ? '与公司一致 ' : '自定义' }}
                        </template>
                    </el-table-column>

                    <el-table-column prop="shop_name" width="140" align="center" label="店铺名称" />
                    <el-table-column prop="phone" width="140" align="center" label="营业执照   ">
                        <template #default="scope">
                            <el-image
                                style="width: 80px; height: 80px"
                                :src="'https://api.ustudygroup.com/' + scope.row.license_img"
                                :zoom-rate="1.2"
                                :max-scale="7"
                                :min-scale="0.2"
                                :preview-src-list="['https://api.ustudygroup.com/' + scope.row.license_img]"
                                :initial-index="4"
                                fit="cover"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column prop="add_time" align="center" width="200" label="添加时间" />
                    <el-table-column prop="user_id" align="center" width="140" label="审批人id" />
                    <el-table-column prop="approve_time" align="center" width="200" label="审批时间" />
                    <el-table-column label="状态" align="center" width="140">
                        <template #default="scope">
                            <span class="blue" v-if="scope.row.status == 1">待处理</span>
                            <span class="green" v-if="scope.row.status == 2">通过</span>
                            <span class="red" v-if="scope.row.status == 3">驳回</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="realname" align="center" width="140" label="审批人名称" />
                    <el-table-column prop="status" align="center" width="140" label="操作" fixed="right">
                        <template #default="scope">
                            <div class="cell">
                                <el-button type="primary" size="small" icon="Edit" @click="edit(scope.row)"> 审批 </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination">
                <el-pagination
                    v-if="tableData.total > 10"
                    v-model:currentPage="tableData.page"
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
        <CustomeRef ref="menuDrawerRef" :query="query" title="审批编辑" />
    </div>
</template>

<script lang="ts" setup>
    import { ElMessageBox, FormInstance } from 'element-plus'
    import { reactive, ref, onMounted } from 'vue'
    import { Plus } from '@element-plus/icons-vue'
    import CustomeRef from './components/CustomeRef.vue'
    import { getShenList, changeShenList } from '@/api/shenpi/apis'
    import { useUserStore } from '@/store/modules/user'
    import { useSettingStore } from '@/store/modules/setting'
    const SettingStore = useSettingStore()
    const user = useUserStore()
    const tableData = ref({})
    let querys = reactive({
        page: 1,
        pageSize: 10,
        status: '',
    })
    onMounted(async () => {
        try {
            let res = await getShenList(querys)
            tableData.value = res.data
            loading.value = false
        } catch (err) {
            console.log(err)
        }
    })
    const handleSizeChange = async (val: number) => {
        querys.pageSize = val
        loading.value = true
        try {
            let res = await getShenList(querys)
            tableData.value = res.data
            loading.value = false
        } catch (error) {
            console.log(error)
        }
    }
    const handleCurrentChange = async (val: number) => {
        querys.page = val
        loading.value = true
        try {
            let res = await getShenList(querys)
            tableData.value = res.data
            loading.value = false
        } catch (error) {
            console.log(error)
        }
    }
    const loading = ref(true)
    const menuDrawerRef = ref()
    const query = reactive({
        id: '',
        userId: user.userInfo.userId,
        status: '',
    })
    function getStatusText(status) {
        switch (status) {
            case 1:
                return '待处理'
            case 2:
                return '通过'
            case 3:
                return '驳回'
            default:
                return ''
        }
    }
    const options = [
        {
            value: '',
            label: '全部',
        },
        {
            value: '1',
            label: '待处理',
        },
        {
            value: '2',
            label: '已通过',
        },
        {
            value: '3',
            label: '已驳回',
        },
    ]
    const searchInfo = async () => {
        loading.value = true
        try {
            let res = await getShenList(querys)
            console.log(res)
            tableData.value = res.data
        } catch (error) {
            console.log(error)
        }
        loading.value = false
    }
    //修改
    const edit = (items) => {
        query.status = items.status
        query.id = items.id
        menuDrawerRef.value.show()
    }
</script>

<style scoped lang="scss">
    :deep(.el-table .el-table__cell) {
        position: static;
    }
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
</style>
