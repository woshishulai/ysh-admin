<template>
    <div>
        <el-drawer v-model="dialogVisible" title="编辑" size="60%">
            <div class="shang">
                <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="150px">
                    <el-form-item label="订单号" prop="outTradeNo">
                        {{ formData.order_id }}
                    </el-form-item>
                    <el-form-item label="钱数" prop="price">
                        <el-input type="number" v-model="formData.price" placeholder="请输入退款钱数" />
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-checkbox @change="showCheck1" v-model="checked1">通过</el-checkbox>
                        <el-checkbox @change="showCheck2" v-model="checked2">拒绝</el-checkbox>
                    </el-form-item>
                    <el-form-item label="拒绝原因" prop="no_cause" v-if="checked2">
                        <el-input v-model="formData.no_cause" placeholder="请输入退款原因" />
                    </el-form-item>
                </el-form>
            </div>
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
    import { changeTuiList } from '@/api/tui/apis'
    import { useSettingStore } from '@/store/modules/setting'
    import { useUserStore } from '@/store/modules/user'
    import { reactive, ref, watch, onMounted } from 'vue'
    import { ElNotification, ElMessage, FormInstance } from 'element-plus'
    const UserStore = useUserStore()
    const SettingStore = useSettingStore()
    const ruleFormRef = ref<FormInstance>()
    const dialogVisible = ref(false)
    const role = UserStore.userInfo.isAdmin
    const props = defineProps({
        query: {
            type: Object,
            default: {},
        },
    })

    const formData = ref({
        userId: UserStore.userInfo.userId,
        status: '',
    })
    const rules = reactive({
        price: [
            { required: true, message: '请输入退款钱数', trigger: 'blur' },
            {
                validator: (rule, value, callback) => {
                    if (!value) {
                        return callback(new Error('退款金额不能为空'))
                    }
                    if (formData.value.price && value > props.query.price) {
                        return callback(new Error('退款金额不能大于于订单价格'))
                    }
                    return callback()
                },
                trigger: 'blur',
            },
        ],
    })
    const checked1 = ref(true)
    const checked2 = ref(false)
    const showCheck1 = (item) => {
        if (item == true) {
            checked1.value = true
            checked2.value = false
            formData.value.status = 2
        } else {
            checked1.value = false
            checked2.value = true
            formData.value.status = 3
        }
    }
    const showCheck2 = (item) => {
        if (item == true) {
            checked1.value = false
            checked2.value = true
            formData.value.status = 3
        } else {
            checked1.value = true
            checked2.value = false
            formData.value.status = 2
        }
    }

    watch(
        () => props.query,
        (newQuery) => {
            Object.assign(formData.value, props.query)
            if (formData.value.status == 2) {
                checked1.value = true
                checked2.value = false
            } else if (formData.value.status == 3) {
                checked2.value = true
                checked1.value = false
            }
            formData.value.outTradeNo = formData.value.order_id
            console.log(formData.value)
        },
        {
            immediate: true,
            deep: true,
        },
    )
    const handleClose = async () => {
        await ruleFormRef.value.validate(async (valid, fields) => {
            if (valid) {
                try {
                    let res = await changeTuiList(formData.value)
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
    .shang {
        width: 100%;
        display: flex;
        background-color: #fff;
        padding: 0 10px;
        .el-form {
            padding: 20px 0;
            flex: 1;
            max-width: 750px;
            margin-right: 40px;
        }
        .avatar {
            width: 40px;
            height: 40px;
            // border-radius: 50%;
            margin-right: 10px;
        }
        .info {
            background-color: #f0f2f5;
            min-width: 420px;
            max-width: 420px;
            display: flex;
            justify-content: center;
        }
    }
    :deep(.m-user-table) {
        width: 100%;
    }
    :deep(.m-user-table) {
        width: 100%;
    }
</style>
