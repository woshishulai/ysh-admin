<template>
    <div>
        <el-drawer v-model="dialogVisible" title="详情" size="70%">
            <el-form ref="ruleFormRef" label-width="130px">
                <!-- <el-form-item label="id" prop="shop_name">
                    <span>{{ formData.id }}</span>
                </el-form-item> -->
                <el-form-item label="评分" prop="shop_name">
                    <el-rate disabled v-model="formData.score" />
                </el-form-item>
                <el-form-item label="内容" prop="shop_name">
                    <span style="width: 400px">{{ formData.content }}</span>
                </el-form-item>
                <el-form-item label="下单时间" prop="shop_name">
                    <span>{{ formData.add_time }}</span>
                </el-form-item>

                <!-- <el-form-item label="用户id" prop="shop_name">
                    <span>{{ formData.user_id }}</span>
                </el-form-item> -->
                <el-form-item label="用户昵称" prop="shop_name">
                    <span>{{ formData.nickname }}</span>
                </el-form-item>
                <!-- <el-form-item label="商品ID" prop="shop_name">
                    <span>{{ formData.goods_id }}</span>
                </el-form-item> -->

                <el-form-item label="服务名称" prop="shop_name">
                    <span>{{ formData.goodsName }}</span>
                </el-form-item>
                <!-- <el-form-item label="商品名称" prop="shop_name">
                    <span>{{ formData.goods_name }}</span>
                </el-form-item> -->
                <el-form-item label="商户名称" prop="shop_name">
                    <span>{{ formData.shop_name }}</span>
                </el-form-item>
                <el-form-item label="回复信息" prop="shop_name">
                    <el-table :data="formData.appealList" style="width: 100%">
                        <el-table-column prop="add_time" label="回复时间" />
                        <el-table-column prop="content" label="回复内容" width="240" />
                    </el-table>
                </el-form-item>
            </el-form>
        </el-drawer>
    </div>
</template>
<script lang="ts" setup>
    import { ElMessage } from 'element-plus'
    import { reactive, ref, watch, onMounted } from 'vue'
    import { FormInstance } from 'element-plus'
    import { getPingLunDetails } from '@/api/ping/apis'

    const ruleFormRef = ref<FormInstance>()
    const dialogVisible = ref(false)
    const formData = ref({})
    const yes = true
    const props = defineProps({
        details: {
            type: String,
            default: '',
        },
    })
    const getDetails = async (id) => {
        try {
            let res = await getPingLunDetails(id)
            formData.value = res.data
            console.log(formData.value)
        } catch (error) {
            console.log(error)
        }
    }
    watch(
        () => props.details,
        (newQuery, oldQuery) => {
            let query = {
                id: props.details,
            }
            if (!query.id) {
                return
            }
            getDetails(query)
        },
        {
            immediate: true,
            deep: true,
        },
    )

    const show = (item = {}) => {
        dialogVisible.value = true
    }

    defineExpose({
        show,
    })
</script>
<style lang="scss" scoped>
    .el-drawer__header > :first-child {
        font-size: 20px;
    }
</style>
