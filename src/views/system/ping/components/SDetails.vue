<template>
    <div>
        <el-drawer v-model="dialogVisible" title="申诉详情" size="70%">
            <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="130px">
                <el-form-item label="申诉原因" prop="shop_name">
                    <span>{{ formData.reason }}</span>
                </el-form-item>
                <el-form-item label="申诉内容" prop="shop_name">
                    <span>{{ formData.content }}</span>
                </el-form-item>
                <el-form-item label="申诉时间" prop="shop_name">
                    <span>{{ formData.add_time }}</span>
                </el-form-item>
                <el-form-item label="申诉审批" prop="status">
                    <el-checkbox @change="showCheck1" v-model="checked1">通过</el-checkbox>
                    <el-checkbox @change="showCheck2" v-model="checked2">驳回</el-checkbox>
                </el-form-item>
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
    import { ElMessage } from 'element-plus'
    import { reactive, ref, watch, onMounted } from 'vue'
    import { FormInstance } from 'element-plus'
    import { shenSuList, changeShenSu } from '@/api/ping/apis'
    import { ElNotification } from 'element-plus'
    import { useUserStore } from '@/store/modules/user'
    import { useSettingStore } from '@/store/modules/setting'
    const SettingStore = useSettingStore()
    const UserStore = useUserStore()
    const rules = reactive({
        status: [{ required: true, message: '请选择申诉状态', trigger: 'blur' }],
    })
    const ruleFormRef = ref<FormInstance>()
    const dialogVisible = ref(false)
    const formData = ref({})
    const props = defineProps({
        details: {
            type: String,
            default: '',
        },
    })
    const checked1 = ref(false)
    const checked2 = ref(false)
    const getDetails = async (id) => {
        try {
            let res = await shenSuList(id)
            formData.value = res.data
            if (formData.value.status == 2) {
                checked1.value = true
                checked2.value = false
            } else if (formData.value.status == 3) {
                checked2.value = true
                checked1.value = false
            } else {
                checked2.value = false
                checked1.value = false
            }
            console.log(formData.value)
        } catch (error) {
            console.log(error)
        }
    }
    const showCheck1 = (item) => {
        checked1.value = true
        checked2.value = false
        formData.value.status = 2
    }
    const showCheck2 = (item) => {
        checked1.value = false
        checked2.value = true
        formData.value.status = 3
    }
    const handleClose = async () => {
        console.log(formData.value)
        if (formData.value.status == 1) {
            ElNotification({
                message: '申请审批状态不可为空',
                type: 'error',
                duration: 3000,
            })
            return
        }
        await ruleFormRef.value.validate(async (valid, fields) => {
            if (valid) {
                try {
                    let res = await changeShenSu(formData.value)
                    if (res.code == 1) {
                        SettingStore.setReload()
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
            } else {
                console.log('error submit!', fields)
            }
        })
    }
    watch(
        () => props.details,
        (newQuery, oldQuery) => {
            let query = {
                comment_id: props.details,
            }
            if (!query.comment_id) {
                return
            }
            formData.value.user_id = UserStore.userInfo.userId
            formData.value.comment_id = query.comment_id
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
