<script setup>
    import { ref, computed, reactive, onMounted } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    const router = useRouter()
    const route = useRoute()
    const props = defineProps({})
    const leftElementHeight = ref(null)
    const loading = ref(false)
    const heights = ref(false)
    const pages = ref(1)
    const tableData = ref([])
    onMounted(() => {
        heights.value = leftElementHeight.value.offsetHeight - 50
    })
    const query = reactive({
        time: [],
        startTime: '',
        ednTime: '',
        page: pages.value,
        pageSize: 10,
    })
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
    const addHandler = async () => {
        loading.value = true
        query.page = 1
        pages.value = 1
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
            // let res = await getKehuList(query)
            loading.value = false
        } catch (error) {
            console.log(error)
        }
    }
</script>

<template>
    <div class="wrap">
        <div ref="leftElementHeight" class="left-shop-list">
            <div class="shop-title"> 店铺列表 </div>
            <el-scrollbar v-show="heights" :style="{ height: heights + 'PX' }">
                <p v-for="item in 20" :key="item" class="scrollbar-demo-item">{{ item }}</p>
            </el-scrollbar>
        </div>
        <div ref="leftElementHeight" class="left-shop-list">
            <div class="shop-title"> 客户列表 </div>
            <el-scrollbar v-show="heights" :style="{ height: heights + 'PX' }">
                <p v-for="item in 20" :key="item" class="scrollbar-demo-item">{{ item }}</p>
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
                        <el-input style="width: 240px" placeholder="请输入聊天关键字" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addHandler">
                            <el-icon><Search /></el-icon>
                            查询
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="footer">
                <div class="table-inner">
                    <el-table v-loading="loading" :data="tableData?.list" style="width: 100%; height: 100%" border>
                        <el-table-column prop="id" label="角色" width="70" align="center" />
                        <el-table-column label="类型" width="126" align="center">
                            <template #default="scope">
                                <el-image
                                    style="width: 100px; height: 100px"
                                    :src="scope.row.head_img"
                                    :zoom-rate="1.2"
                                    :max-scale="7"
                                    :min-scale="0.2"
                                    :initial-index="4"
                                    fit="cover"
                                />
                            </template>
                        </el-table-column>
                        <el-table-column prop="nickname" label="内容" align="center" />
                    </el-table>
                </div>
                <div class="pagination">
                    <el-pagination
                        v-model:currentPage="pages"
                        :page-size="tableData.pageSize"
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="tableData.total"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                    />
                </div>
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
        background: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
    }
</style>
