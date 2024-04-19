<template>
    <div>
        <el-drawer v-model="dialogVisible" title="新增店铺" size="60%">
            <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="130px">
                <el-form-item label="店铺名称" prop="shop_name">
                    <el-input v-model="formData.shop_name" style="width: 400px" placeholder="请输入店铺名称" />
                </el-form-item>
                <el-form-item label="公司名称" prop="company_name">
                    <el-input v-model="formData.company_name" style="width: 400px" placeholder="请输入公司名称" />
                </el-form-item>
                <el-form-item label="头像" prop="head_photo">
                    <el-upload
                        class="avatar-uploader"
                        action="https://api.ustudygroup.com/api/v1/Sign/fileAdd"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                    >
                        <img v-if="imageUrl" :src="imageUrl" style="max-width: 400px" class="avatar" />
                        <el-button v-else type="primary">上传头像</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="公司详情" prop="details">
                    <wang-edior v-model="formData.details" />
                </el-form-item>
                <el-form-item label="国家" prop="country">
                    <el-input v-model="formData.country" style="width: 400px" placeholder="请输入国家" />
                </el-form-item>
                <el-form-item label="省份" prop="province">
                    <el-input v-model="formData.province" style="width: 400px" placeholder="请输入省份" />
                </el-form-item>
                <el-form-item label="城市" prop="city">
                    <el-input v-model="formData.city" style="width: 400px" placeholder="请输入城市" />
                </el-form-item>
                <el-form-item label="街道地址" prop="street">
                    <el-input v-model="formData.street" style="width: 400px" placeholder="请输入街道地址" />
                </el-form-item>
                <el-form-item label="详细地址" prop="address">
                    <el-input v-model="formData.address" style="width: 400px" placeholder="请输入详细地址" />
                </el-form-item>
                <el-form-item label="邮编" prop="zip_code">
                    <el-input v-model="formData.zip_code" style="width: 400px" placeholder="请输入邮编" />
                </el-form-item>
                <el-form-item label="聊天三方链接" prop="chat_link">
                    <el-input v-model="formData.chat_link" style="width: 400px" placeholder="请输入第三方链接" />
                </el-form-item>
                <el-form-item label="聊天三方二维码" prop="chat_code">
                    <el-upload
                        class="avatar-uploader"
                        action="https://api.ustudygroup.com/api/v1/Sign/fileAdd"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccesss"
                        :before-upload="beforeAvatarUpload"
                    >
                        <img v-if="img" style="max-width: 400px" :src="img" class="avatar" />
                        <el-button v-else type="primary">上传二维码照片</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="修改状态" prop="status">
                    <el-checkbox @change="showCheck1" v-model="checked1">预备中</el-checkbox>
                    <el-checkbox @change="showCheck2" v-model="checked2">在线</el-checkbox>
                    <el-checkbox @change="showCheck3" v-model="checked3">下线</el-checkbox>
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
    import WangEdior from '@/components/WangEdior/index.vue'
    import { ElMessage } from 'element-plus'
    import { reactive, ref, watch, onMounted } from 'vue'
    import { ElNotification } from 'element-plus'

    import { FormInstance } from 'element-plus'
    import { useUserStore } from '@/store/modules/user'
    import { useSettingStore } from '@/store/modules/setting'
    import { addShopInfo } from '@/api/dianpu/apis'
    const SettingStore = useSettingStore()
    const ruleFormRef = ref<FormInstance>()
    const dialogVisible = ref()
    const UserStore = useUserStore()

    const imageUrl = ref('')
    const img = ref('')
    const checked1 = ref(false)
    const checked2 = ref(false)
    const checked3 = ref(false)
    const rules = reactive({
        shop_name: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
        company_name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        // chat_code: [{ required: true, message: '请上传头像', trigger: 'blur' }],
        details: [{ required: true, message: '请输入公司详情', trigger: 'blur' }],
        country: [{ required: true, message: '请输入国家', trigger: 'blur' }],
        province: [{ required: true, message: '请输入省份', trigger: 'blur' }],
        city: [{ required: true, message: '请输入城市', trigger: 'blur' }],
        street: [{ required: true, message: '请输入街道地址', trigger: 'blur' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        // zip_code: [{ required: true, message: '请输入邮编', trigger: 'blur' }],
        // chat_link: [{ required: true, message: '请输入聊天三方链接', trigger: 'blur' }],
        // head_photo: [{ required: true, message: '请输入上传聊天三方二维码', trigger: 'blur' }],
        status: [{ required: true, message: '请选择店铺状态', trigger: 'blur' }],
    })
    const formData = ref({
        userId: UserStore.userInfo.userId,
    })
    const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
        imageUrl.value = URL.createObjectURL(uploadFile.raw!)
        formData.value.head_photo = response.data.path
    }
    const handleAvatarSuccesss: UploadProps['onSuccess'] = (response, uploadFile) => {
        img.value = URL.createObjectURL(uploadFile.raw!)
        formData.value.chat_code = response.data.path
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
    const showCheck1 = (item) => {
        checked1.value = true
        checked2.value = false
        checked3.value = false
        formData.value.status = 0
    }
    const showCheck2 = (item) => {
        checked1.value = false
        checked2.value = true
        checked3.value = false
        formData.value.status = 1
    }
    const showCheck3 = (item) => {
        checked1.value = false
        checked2.value = false
        checked3.value = true
        formData.value.status = 2
    }
    const handleClose = async () => {
        await ruleFormRef.value.validate(async (valid, fields) => {
            if (valid) {
                try {
                    let res = await addShopInfo(formData.value)
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
                        setTimeout(() => {
                            dialogVisible.value = false
                        }, 1500)
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
