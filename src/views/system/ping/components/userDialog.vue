<template>
    <div>
        <el-drawer v-model="dialogVisible" title="编辑订单状态" size="70%">
            <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="130px" v-if="formData.show != 23">
                <el-form-item label="评分" prop="score">
                    <el-rate disabled v-model="formData.score" />
                </el-form-item>
                <el-form-item label="评论内容" prop="content">
                    <el-input v-model="formData.content" placeholder="请输入评论内容" />
                </el-form-item>
            </el-form>
            <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="130px" v-if="formData.show == 23">
                <el-form-item label="排序" prop="sort">
                    <el-input type="number" v-model="formData.sort" placeholder="请输入排序 数字越小越靠前" />
                </el-form-item>
                <!-- <el-form-item label="是否屏蔽">
                    <el-switch v-model="value1" />
                </el-form-item> -->
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleClose(ruleFormRef)">确定</el-button>
                </span>
            </template>
        </el-drawer>
    </div>
</template>
<script lang="ts" setup>
    import { reactive, ref, watch, onMounted } from 'vue'
    import { changePingApi } from '@/api/ping/apis'
    import { useSettingStore } from '@/store/modules/setting'
    const SettingStore = useSettingStore()
    const ruleFormRef = ref<FormInstance>()
    const dialogVisible = ref(false)
    const formData = ref({})
    const value1 = ref(false)
    const props = defineProps({
        query: {
            type: Object,
            default: {},
        },
    })
    watch(
        () => props.query,
        () => {
            formData.value = props.query
        },
        {
            deep: true,
        },
    )
    watch(
        () => formData.value.status,
        () => {
            if (formData.value.status && formData.value.status == 2) {
                value1.value = true
            } else {
                value1.value = false
                formData.value.status = 1
            }
        },
        {
            deep: true,
        },
    )
    const rules = reactive({
        score: [{ required: true, message: '请选择状态', trigger: 'blur' }],
    })

    const handleClose = async () => {
        await ruleFormRef.value.validate(async (valid, fields) => {
            if (valid) {
                try {
                    if (value1.value == true) {
                        formData.value.status = 2
                    } else {
                        formData.value.status = 1
                    }
                    let res = await changePingApi(formData.value)
                    if (res.code == 1) {
                        SettingStore.setReload()
                    }
                } catch (error) {
                    console.log(error)
                }
            } else {
                console.log('error submit!', fields)
            }
        })
    }

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
