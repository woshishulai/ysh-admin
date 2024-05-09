<script setup>
    import { ref, computed, reactive, onMounted } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { getMessageAll, getUserMessage, getDetailsMessage } from '@/api/message/apis'
    import { ElNotification } from 'element-plus'
    import { useSettingStore } from '@/store/modules/setting'
    const SettingStore = useSettingStore()
    const router = useRouter()
    const route = useRoute()
    const props = defineProps({})
    const leftElementHeight = ref(null)
    const loading = ref(false)
    const heights = ref(false)
    const tableData = ref([])
    const userList = ref([])
    const messageList = ref([])

    onMounted(() => {
        heights.value = leftElementHeight.value.offsetHeight - 50
        // Promise.all([fetchData()])
        //     .then((values) => {
        //         getUserList()
        //     })
        //     .catch((error) => {
        //         console.error(error)
        //     })
        fetchData()
    })
    const query = reactive({
        time: [],
        startTime: '',
        ednTime: '',
        shop_id: '',
        user_id: '',
        keyword: '',
    })
    const fetchData = async () => {
        let res = await getMessageAll()
        if (res.code == 1) {
            tableData.value = res.data.list
            if (tableData.value.length < 1) {
                return
            }
            query.shop_id = tableData.value.length ? tableData.value[0].shop_id : ''
            getUserList()
        } else {
            ElNotification({
                message: res.msg,
                type: 'error',
                duration: 3000,
            })
        }
    }
    const getUserList = async () => {
        let res = await getUserMessage({ shop_id: query.shop_id })
        if (res.code == 1) {
            userList.value = res.data?.list
            if (userList.value.length < 1) {
                return
            }
            query.user_id = userList.value.length >= 1 ? userList.value[0]?.id : ''
            getDetailsMessageList()
        } else {
            ElNotification({
                message: res.msg,
                type: 'error',
                duration: 3000,
            })
        }
    }
    const chanegActive = (index) => {
        query.shop_id = index
        userList.value = []
        getUserList()
    }
    const getUserDetailsMessaeg = (index) => {
        query.user_id = index
        query.time = []
        query.startTime = ''
        query.ednTime = ''
        getDetailsMessageList()
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
    const getDetailsMessageList = async () => {
        console.log(query)
        loading.value = true
        if (query.time.length == 0) {
            query.startTime = ''
            query.ednTime = ''
        } else {
            query.startTime = convertToFormat(query.time[0])
            query.ednTime = convertToFormat(query.time[1])
            delete query.title
        }
        loading.value = true
        try {
            let res = await getDetailsMessage(query)
            if (res.code == 1) {
                console.log(res)
                if (res.data.list.length < 1) {
                    return
                }
                messageList.value = res.data.list
                messageList.value.forEach((item) => {
                    if (item.content) {
                        let imgRegex = /<img[^>]+src="([^">]+)"/g
                        if (imgRegex.test(item.content)) {
                            item.yes = true
                        }
                        item.content = item.content.replace(imgRegex, function (match, p1) {
                            if (!p1.startsWith('https://chat.ustudygroup.com')) {
                                item.url = 'https://chat.ustudygroup.com' + p1
                                return match.replace(p1, 'https://chat.ustudygroup.com' + p1)
                            } else {
                                return match
                            }
                        })
                    }
                })
                console.log(messageList.value)
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
        loading.value = false
    }
</script>

<template>
    <div class="wrap">
        <div ref="leftElementHeight" class="left-shop-list">
            <div class="shop-title"> 店铺列表 </div>
            <el-scrollbar v-show="heights" :style="{ height: heights + 'PX' }">
                <p
                    v-for="item in tableData"
                    :key="item.shop_id"
                    :class="query.shop_id == item.shop_id ? 'active' : ''"
                    class="scrollbar-demo-item"
                    @click="chanegActive(item.shop_id)"
                    >{{ item.shop_name }}</p
                >
            </el-scrollbar>
        </div>
        <div ref="leftElementHeight" class="left-shop-list">
            <div class="shop-title"> 客户列表 </div>
            <el-scrollbar v-show="heights" :style="{ height: heights + 'PX' }">
                <p
                    v-for="item in userList"
                    :key="item.id"
                    :class="query.user_id == item.id ? 'active' : ''"
                    class="scrollbar-demo-item"
                    @click="getUserDetailsMessaeg(item.id)"
                    >{{ item.name || item.nickname }}</p
                >
            </el-scrollbar>
        </div>
        <div class="right-show-message">
            <div class="header">
                <el-form ref="ruleFormRef" :inline="true">
                    <el-form-item label="日期" prop="username">
                        <el-date-picker
                            v-model="query.time"
                            type="daterange"
                            range-separator="到"
                            start-placeholder="开始时间"
                            end-placeholder="指定时间"
                        />
                    </el-form-item>
                    <el-form-item label="关键字">
                        <el-input v-model="query.keyword" style="width: 240px" placeholder="请输入聊天关键字" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getDetailsMessageList">
                            <el-icon><Search /></el-icon>
                            查询
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="footer">
                <div class="table-inner">
                    <el-table v-loading="loading" :data="messageList" style="width: 100%; height: 100%" border>
                        <el-table-column prop="id" label="角色" width="70" align="center">
                            <template #default="scope">
                                {{ scope.row.direction == 'to_service' ? '用户' : '商家' }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="content" label="内容" align="center">
                            <template #default="scope">
                                <p v-if="!scope.row.yes" v-html="scope.row.content"></p>
                                <el-image
                                    v-else
                                    style="width: 80px"
                                    :src="scope.row.url"
                                    :zoom-rate="1.2"
                                    :max-scale="7"
                                    :min-scale="0.2"
                                    :preview-src-list="[scope.row.url]"
                                    :initial-index="4"
                                    fit="cover"
                                />
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!-- <div class="pagination">
                    <el-pagination
                        v-model:currentPage="pages"
                        :page-size="tableData.pageSize"
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="tableData.total"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                    />
                </div> -->
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .wrap {
        display: flex;
        align-items: flex-start;
        box-sizing: border-box;
        width: 100%;
        .shop-title {
            text-align: center;
            padding: 10px 0 0;
        }
        .left-shop-list {
            width: 20%;
            max-width: 220px;
            height: 100%;
            background: #fff;
            margin-right: 10px;
            border-radius: 1%;
        }
        .right-show-message {
            flex: 1;
            padding: 5px 16px;
            background: #fff;
            height: 100%;
            border-radius: 1%;
            box-sizing: border-box;
        }
    }
    .scrollbar-demo-item {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
        margin: 10px;
        text-align: center;
        border-radius: 4px;

        cursor: pointer;
    }
    .active,
    .scrollbar-demo-item:hover {
        background: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
    }
</style>
