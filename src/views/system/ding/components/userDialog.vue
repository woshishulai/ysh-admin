<template>
    <div>
        <el-drawer v-model="dialogVisible" title="编辑订单状态" size="70%">
            <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="150px">
                <el-form-item v-if="formData.payment != 1" label="修改订单状态" prop="is_pay">
                    <el-select v-model="formData.is_pay" @change="changeIds" filterable placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="formData.payment == 1" label="修改订单状态" prop="is_pay">
                    <el-select v-model="formData.is_pay" @change="changeIds" filterable placeholder="请选择">
                        <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
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
    import { reactive, ref, watch, onMounted } from 'vue'
    import { changeFuApi } from '@/api/ding/apis'
    import { useUserStore } from '@/store/modules/user'
    const UserStore = useUserStore()
    import { ElNotification } from 'element-plus'
    import { useSettingStore } from '@/store/modules/setting'
    const SettingStore = useSettingStore()
    const ruleFormRef = ref<FormInstance>()
    const dialogVisible = ref(false)
    const role = UserStore.userInfo.isAdmin
    const formData = ref({})
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
            console.log(formData.value)
        },
        {
            deep: true,
            immediate: true,
        },
    )
    const rules = reactive({
        is_pay: [{ required: true, message: '请选择状态', trigger: 'blur' }],
    })
    const options = [
        {
            value: '1',
            label: '已支付',
        },
        {
            value: '2',
            label: '未支付',
        },
        {
            value: '3',
            label: '用户支付凭证待确认',
        },
        {
            value: '5',
            label: '取消订单',
        },
    ]
    const options1 = [
        {
            value: '5',
            label: '取消订单',
        },
    ]
    //修改商家接单状态
    const checked1 = ref(true)
    const checked2 = ref(false)
    const checked3 = ref(false)
    const showCheck1 = (item) => {
        checked1.value = true
        checked2.value = false
        formData.value.status = 1
    }
    const showCheck2 = (item) => {
        checked1.value = false
        checked2.value = true
        formData.value.status = 2
    }
    const showCheck3 = (item) => {
        checked1.value = false
        checked2.value = false
        checked3.value = true
        formData.value.status = 3
    }
    const changeIds = (item) => {
        console.log(item)
    }
    const handleClose = async () => {
        console.log(formData.value)

        await ruleFormRef.value.validate(async (valid, fields) => {
            if (valid) {
                try {
                    let res = await changeFuApi(formData.value)
                    if (res.code != 1) {
                        ElNotification({
                            message: res.msg,
                            type: 'error',
                            duration: 3000,
                        })
                    } else {
                        ElNotification({
                            message: res.msg,
                            type: 'success',
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
