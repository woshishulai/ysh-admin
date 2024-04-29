<template>
    <div class="m-user-table">
        <div class="header">
            <el-form ref="ruleFormRef" :inline="true" label-width="100px">
                <el-form-item label="排序">
                    <img v-show="query.sort_type == 1" @click="changeSortType(2)" src="@/assets/image/login/sort1.svg" alt="" />
                    <img v-show="query.sort_type == 2" src="@/assets/image/login/sort11.svg" alt="" />
                    <img v-show="query.sort_type == 2" @click="changeSortType(1)" src="@/assets/image/login/sort2.svg" alt="" />
                    <img v-show="query.sort_type == 1" src="@/assets/image/login/sort22.svg" alt="" />
                </el-form-item>
                <el-form-item label="客户名称">
                    <el-input v-model="query.nickname" placeholder="请输入客户名称" />
                </el-form-item>
                <!-- <el-form-item label="店铺名称">
                    <el-input v-model="query.shop_name" placeholder="请输入店铺名称" />
                </el-form-item> -->
                <el-form-item label="服务名称">
                    <el-input v-model="query.goodsName" placeholder="请输入服务名称" />
                </el-form-item>
                <el-form-item label="订单号">
                    <el-input v-model="query.order_id" placeholder="请输入服务名称" />
                </el-form-item>
                <el-form-item label="评分">
                    <el-input v-model="query.score" placeholder="请输入评分" />
                </el-form-item>
                <el-form-item label="评论内容">
                    <el-input v-model="query.content" placeholder="请输入评论内容查询" />
                </el-form-item>
                <el-form-item label="申诉状态">
                    <el-select v-model="query.status" placeholder="请选择申诉状态" style="width: 192px">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="选择时间查询" style="width: 392px">
                    <el-date-picker
                        v-model="query.time"
                        type="daterange"
                        range-separator="到"
                        start-placeholder="开始时间"
                        end-placeholder="指定时间"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchInfo" :loading="loading" :icon="Search">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="footer">
            <div class="table-inner">
                <el-table v-loading="loading" :data="tableData?.list" style="width: 100%; height: 100%" border>
                    <el-table-column label="排序 " prop="id" align="center" width="160" />
                    <el-table-column label="客户名称" prop="nickname" align="center" width="160" />
                    <el-table-column prop="shop_name" label="商家名称" width="160" align="center" />
                    <el-table-column prop="goodsName" label="服务名称" width="160" align="center" />
                    <el-table-column prop="order_id" label="订单号" width="200" align="center" />
                    <el-table-column label="评分" width="200" align="center">
                        <template #default="scope">
                            <el-rate disabled v-model="scope.row.score" />
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="user_id" label="用户id" width="200" align="center" /> -->
                    <el-table-column prop="content" label="评论" width="200" align="center" />

                    <el-table-column prop="add_time" label="添加时间" width="200" align="center" />
                    <!-- <el-table-column prop="end_time" label="完成时间" width="200" align="center" /> -->
                    <el-table-column prop="sort" label="排序" width="160" align="center" />
                    <el-table-column label="屏蔽" width="120" align="center">
                        <template #default="scope">
                            <span class="blue" v-if="scope.row.status != 2" size="small"> 正常 </span>
                            <span class="red" v-if="scope.row.status == 2" size="small"> 已屏蔽 </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="申诉状态" width="120" align="center">
                        <template #default="scope">
                            <span class="blue" v-if="scope.row.status == 1" size="small"> 待处理 </span>
                            <span class="green" v-if="scope.row.status == 2" size="small"> 已通过 </span>
                            <span class="red" v-if="scope.row.status == 3" size="small"> 已驳回 </span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="appealId" label="申诉id" width="200" align="center" /> -->
                    <el-table-column label="操作" align="center" width="300" fixed="right">
                        <template #default="scope">
                            <div class="cell" style="display: flex; flex-wrap: wrap; gap: 20px 0; justify-content: space-between">
                                <el-button type="primary" @click="huifu(scope.row.id)" icon="Edit" size="small" v-if="role != 1">
                                    添加回复
                                </el-button>
                                <el-button type="primary" @click="jiaShenSUs(scope.row.id)" icon="Edit" size="small" v-if="role != 1">
                                    添加申诉
                                </el-button>
                                <el-button type="primary" @click="shopChange(scope.row)" icon="Edit" size="small" v-if="role != 1">
                                    编辑
                                </el-button>
                                <el-button type="primary" @click="editHandler(scope.row)" icon="Edit" size="small" v-if="role == 1">
                                    编辑
                                </el-button>
                                <el-button type="success" size="small" icon="View" @click="detailss(scope.row)"> 预览 </el-button>
                                <el-button type="danger" @click="removePings(scope.row.id)" icon="Delete" size="small" v-if="role == 1">
                                    删除
                                </el-button>
                                <el-button type="primary" @click="changeXIn(scope.row.id)" icon="Edit" size="small" v-if="role == 1">
                                    查看编辑申诉
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination" v-if="tableData">
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
        <el-dialog v-model="dialogVisible" title="添加回复" width="500" :before-close="giam">
            <el-input v-model="params.content" placeholder="输入回复内容" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleClose"> 提交 </el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog v-model="jiaShenSu" title="添加申诉" width="500" :before-close="guanShen">
            <el-input v-model="jiaShen.reason" placeholder="输入申诉原因" />
            <el-input style="margin-top: 20px" v-model="jiaShen.content" placeholder="输入申诉内容" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="jiaShenSu = false">取消</el-button>
                    <el-button type="primary" @click="tiJiao"> 提交 </el-button>
                </div>
            </template>
        </el-dialog>
        <UserDialog :query="canshu" ref="userDialog" />
        <Details ref="detailsss" :details="details" />
        <SDetails ref="Sdetailsss" :details="xin" />
    </div>
</template>
<script lang="ts" setup>
    import Details from './details.vue'
    import SDetails from './SDetails.vue'
    import { onMounted, reactive, ref } from 'vue'
    import { getPingList, removePing, addHuiFu, addShenSUApi, shenSuList } from '@/api/ping/apis'
    import { useSettingStore } from '@/store/modules/setting'
    import { Search } from '@element-plus/icons-vue'
    import { ElNotification } from 'element-plus'
    const dialogVisible = ref(false)
    const SettingStore = useSettingStore()
    const canshu = ref({})
    import { useUserStore } from '@/store/modules/user'
    const UserStore = useUserStore()
    const Sdetailsss = ref(false)
    const pagessssss = Number(localStorage.getItem('pj')) || 1
    const pages = ref(pagessssss)
    const xin = ref('')
    const changeXIn = (items) => {
        xin.value = items
        console.log(xin.value)
        Sdetailsss.value.show()
    }
    let jiaShen = ref({
        content: '',
        reason: '',
        user_id: UserStore.userInfo.userId,
        comment_id: '',
    })
    const jiaShenSu = ref(false)
    const jiaShenSUs = (items) => {
        jiaShen.value.comment_id = items
        jiaShenSu.value = true
    }
    const tiJiao = async () => {
        if (jiaShen.value.content == '' || jiaShen.value.reason == '') {
            ElNotification({
                message: '申诉原因和申诉内容不可为空',
                type: 'error',
                duration: 3000,
            })
            return
        }
        try {
            let res = await addShenSUApi(jiaShen.value)
            ElNotification({
                message: res.msg,
                duration: 3000,
            })
            SettingStore.setReload()
        } catch (error) {
            console.log(error)
        }
    }
    const guanShen = () => {
        jiaShenSu.value = false
    }
    const role = UserStore.userInfo.isAdmin
    import UserDialog from './userDialog.vue'
    const params = ref({
        content: '',
        user_id: UserStore.userInfo.userId,
        comment_id: '',
    })
    const options = [
        {
            value: '',
            label: '默认',
        },
        {
            value: '1',
            label: '待处理',
        },
        {
            value: '2',
            label: '已处理',
        },
        {
            value: '3',
            label: '已驳回',
        },
    ]
    const details = ref('')
    const detailss = (items) => {
        details.value = items.id + ''
        detailsss.value.show()
    }
    const huifu = (items) => {
        params.value.comment_id = items
        dialogVisible.value = true
    }

    const giam = () => {
        dialogVisible.value = false
    }
    const handleClose = async () => {
        if (params.value.content == '') {
            ElNotification({
                message: '内容不可为空',
                type: 'error',
                duration: 3000,
            })
            return
        }
        try {
            let res = await addHuiFu(params.value)
            dialogVisible.value = false
            SettingStore.setReload()
        } catch (error) {
            console.log(error)
        }
    }
    const tableData = ref([])
    const userDialog = ref()
    const loading = ref(true)
    const detailsss = ref(null)
    const query = reactive({
        page: pages.value,
        pageSize: 10,
        id: '',
        nickname: '',
        shop_name: '',
        goodsName: '',
        score: '',
        content: '',
        status: '',
        startTime: '',
        ednTime: '',
        time: [],
        shop_id: UserStore.userInfo.shopId,
        order_id: '',
        sort_type: 2,
    })

    onMounted(async () => {
        try {
            let res = await getPingList(query)
            tableData.value = res.data
            loading.value = false
        } catch (error) {
            console.log(error)
        }
    })
    const shopChange = (row) => {
        canshu.value.show = 23
        Object.assign(canshu, row)
        userDialog.value.show()
    }
    const removePings = async (id) => {
        let query = {
            id: id,
        }
        try {
            let res = await removePing(query)
            SettingStore.setReload()
        } catch (error) {
            console.log(error)
        }
    }
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
    const searchInfo = async () => {
        if (query.time.length == 0) {
            query.startTime = ''
            query.ednTime = ''
        } else {
            query.startTime = convertToFormat(query.time[0])
            query.ednTime = convertToFormat(query.time[1])
        }
        loading.value = true
        query.page = 1
        pages.value = 1
        try {
            let res = await getPingList(query)
            console.log(res)
            tableData.value = res.data
        } catch (error) {
            console.log(error)
        }
        loading.value = false
    }
    //修改
    const editHandler = (row) => {
        canshu.value.id = row.id
        canshu.value.score = row.score
        canshu.value.content = row.content
        userDialog.value.show()
    }
    const handleSizeChange = async (val: number) => {
        query.pageSize = val
        loading.value = true
        try {
            let res = await getPingList(query)
            tableData.value = res.data
            loading.value = false
        } catch (error) {
            console.log(error)
        }
    }
    const changeSortType = async (index) => {
        query.sort_type = index
        query.page = 1
        pages.value = 1
        loading.value = true
        try {
            let res = await getPingList(query)
            tableData.value = res.data
        } catch (error) {
            console.log(error)
        }
        loading.value = false
    }
    const handleCurrentChange = async (val: number) => {
        query.page = val
        loading.value = true
        localStorage.setItem('pj', val)

        try {
            let res = await getPingList(query)
            tableData.value = res.data
            loading.value = false
        } catch (error) {
            console.log(error)
        }
    }
</script>
<style lang="scss" scoped>
    @import '../index';
    .cell {
        .el-button {
            margin-left: 0;
        }
    }
</style>
