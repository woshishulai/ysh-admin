<template>
    <div>
        <el-drawer v-model="dialogVisible" title="编辑订单状态" size="70%">
            <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="200px">
                <el-form-item label="修改订单状态" prop="is_pay">
                    <el-select v-model="formData.is_pay" @change="changeIds" filterable placeholder="请选择" style="width: 450px">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="修改商家办理状态" prop="handle">
                    <el-checkbox @change="showCheck1" v-model="checked1">待办理</el-checkbox>
                    <el-checkbox @change="showCheck2" v-model="checked2">办理中</el-checkbox>
                    <el-checkbox @change="showCheck3" v-model="checked3">已完成</el-checkbox>
                </el-form-item>
            </el-form>
            <el-form-item v-if="checked3" label="商家完成服务凭证图片预览" props="ysh_voucher">
                <el-image
                    style="max-width: 500px"
                    class="avatar"
                    :src="'https://api.ustudygroup.com/' + formData.shop_voucher"
                    :zoom-rate="1.2"
                    :max-scale="7"
                    :min-scale="0.2"
                    :preview-src-list="['https://api.ustudygroup.com/' + formData.shop_voucher]"
                    :initial-index="4"
                    fit="cover"
                />
            </el-form-item>
            <el-form-item v-if="checked3" label="上传商家完成服务凭证图片" props="ysh_voucher">
                <el-upload
                    class="avatar-uploader"
                    action="https://api.ustudygroup.com/api/v1/Sign/fileAdd"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                >
                    <el-button type="primary">点击上传凭证</el-button>
                </el-upload>
            </el-form-item>
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
    import { changeJieZhuanList } from '@/api/jiezhuan/apis'
    import { useUserStore } from '@/store/modules/user'
    import { useSettingStore } from '@/store/modules/setting'
    import { ElNotification, ElMessage, FormInstance } from 'element-plus'

    const UserStore = useUserStore()
    //修改商家接单状态
    const checked1 = ref(true)
    const checked2 = ref(false)
    const checked3 = ref(false)
    const showCheck1 = (item) => {
        checked1.value = true
        checked2.value = false
        checked3.value = false
        formData.value.handle = 1
        formData.value.is_pay = 1
    }
    const showCheck2 = (item) => {
        checked1.value = false
        checked2.value = true
        checked3.value = false
        formData.value.is_pay = 1
        formData.value.handle = 2
    }
    const showCheck3 = (item) => {
        checked1.value = false
        checked2.value = false
        checked3.value = true
        formData.value.handle = 3
        formData.value.is_pay = 10
    }
    const changeIds = (item) => {
        formData.value.is_pay = item
        formData.value.handle = 1
        checked1.value = true
        checked2.value = false
        checked3.value = false
    }
    const SettingStore = useSettingStore()
    const ruleFormRef = ref<FormInstance>()
    const dialogVisible = ref(false)
    const role = UserStore.userInfo.isAdmin
    const formData = ref({
        is_pay: '1',
        handle: '1',
    })
    const props = defineProps({
        change: {
            type: Object,
            default: {},
        },
    })
    watch(
        () => formData.value.is_pay,
        () => {
            console.log(formData.value)
            if (formData.value.is_pay == 10) {
                checked3.value = true
                formData.value.handle = 3
            }
        },
    )
    watch(
        () => props.change,
        () => {
            formData.value = props.change
            formData.value.is_pay = formData.value.is_pay + ''
            if (formData.value.handle == 1) {
                checked1.value = true
                checked2.value = false
                checked3.value = false
            } else if (formData.value.handle == 2) {
                checked1.value = false
                checked2.value = true
                checked3.value = false
            } else if (formData.value.handle == 3) {
                checked1.value = false
                checked2.value = false
                checked3.value = true
            }
        },
        {
            deep: true,
            // immediate: true,
        },
    )
    const rules = reactive({
        is_pay: [{ required: true, message: '请选择订单状态', trigger: 'blur' }],
        handle: [{ required: true, message: '请选择办理状态', trigger: 'blur' }],
    })
    const options = [
        {
            value: '1',
            label: '已支付',
        },
        {
            value: '10',
            label: '商户已服务完成凭证待确认',
        },
        {
            value: '5',
            label: '取消订单',
        },
    ]
    const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
        formData.value.shop_voucher = response.data.path
    }
    const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
        // 检查文件类型是否以 'image/' 开头
        if (!rawFile.type.startsWith('image/')) {
            ElMessage.error('只能上传图片格式')
            return false
        } else if (rawFile.size / 1024 / 1024 > 2) {
            // 检查文件大小是否超过 2MB
            ElMessage.error('图片大小不可以超过2MB')
            return false
        }
        // 如果以上检查都通过，则允许上传
        return true
    }
    const handleClose = async () => {
        await ruleFormRef.value.validate(async (valid, fields) => {
            if (valid) {
                console.log(formData.value)
                try {
                    let res = await changeJieZhuanList(formData.value)
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
</style>
