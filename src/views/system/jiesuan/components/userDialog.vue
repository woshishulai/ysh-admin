<template>
    <div>
        <el-drawer v-model="dialogVisible" title="编辑订单状态" size="70%">
            <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="130px">
                <el-form-item label="结算金额" prop="amount_price">
                    <el-input style="width: 450px" v-model="formData.amount_price" placeholder="请输入结算金额" />
                </el-form-item>
                <el-form-item label="凭证图片预览" props="ysh_voucher">
                    <el-image
                        style="max-width: 500px"
                        class="avatar"
                        :src="'https://api.ustudygroup.com/' + formData.ysh_voucher"
                        :zoom-rate="1.2"
                        :max-scale="7"
                        :min-scale="0.2"
                        :preview-src-list="['https://api.ustudygroup.com/' + formData.ysh_voucher]"
                        :initial-index="4"
                        fit="cover"
                    />
                </el-form-item>
                <el-form-item label="上传凭证图片" props="ysh_voucher">
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
    import { changeJieZhuanList } from '@/api/jiezhuan/apis'
    import { useSettingStore } from '@/store/modules/setting'
    import { useUserStore } from '@/store/modules/user'
    import { ElNotification, ElMessage, FormInstance } from 'element-plus'
    const UserStore = useUserStore()
    const role = UserStore.userInfo.isAdmin
    const SettingStore = useSettingStore()
    const ruleFormRef = ref<FormInstance>()
    const dialogVisible = ref(false)
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
        },
        {
            deep: true,
            immediate: true,
        },
    )
    const rules = reactive({
        ysh_voucher: [{ required: true, message: '请上传凭证', trigger: 'blur' }],
    })
    const handleClose = async () => {
        formData.value.is_pay = '8'
        if (!formData.value.ysh_voucher || !formData.value.amount_price) {
            ElNotification({
                message: '请输入结算金额并上传凭证',
                type: 'error',
                duration: 3000,
            })
            return
        }
        await ruleFormRef.value.validate(async (valid, fields) => {
            if (valid) {
                delete formData.value.page
                delete formData.value.pageSize
                delete formData.value.shopId
                console.log(formData.value)
                try {
                    let res = await changeJieZhuanList(formData.value)
                    if (res.code == 1) {
                        formData.value.ysh_voucher = ''
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
    const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
        formData.value.ysh_voucher = response.data.path
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
