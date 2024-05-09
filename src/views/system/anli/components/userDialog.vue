<template>
    <div>
        <el-drawer v-model="dialogVisible" title="编辑店铺案例" size="50%">
            <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="130px">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="formData.title" style="width: 400px" placeholder="请输入标题" />
                </el-form-item>
                <el-form-item label="副标题" prop="title_sub">
                    <el-input v-model="formData.title_sub" style="width: 400px" placeholder="请输入副标题" />
                </el-form-item>
                <el-form-item label="头像" prop="head_photo">
                    <el-upload
                        class="avatar-uploader"
                        action="https://api.ustudygroup.com/api/v1/Sign/fileAdd"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                    >
                        <img v-if="img" :src="img" style="max-width: 100px" class="avatar" />
                        <el-button v-else type="primary">上传头像</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="描述" prop="describe">
                    <el-input v-model="formData.describe" type="textarea" style="width: 400px" placeholder="请输入描述内容" />
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
    import { useUserStore } from '@/store/modules/user'
    import { useSettingStore } from '@/store/modules/setting'
    import { addAnListInfo } from '@/api/anli/apis'
    import { ElNotification } from 'element-plus'

    const SettingStore = useSettingStore()
    const ruleFormRef = ref<FormInstance>()
    const dialogVisible = ref()
    const UserStore = useUserStore()
    const img = ref('')
    const formData = ref({})
    const props = defineProps({
        query: {
            type: Object,
            default: {},
        },
    })
    const rules = reactive({
        title: [{ required: true, message: '请输入案例标题', trigger: 'blur' }],
        // company_name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        // chat_code: [{ required: true, message: '请上传头像', trigger: 'blur' }],
        // details: [{ required: true, message: '请输入公司详情', trigger: 'blur' }],
        // country: [{ required: true, message: '请输入国家', trigger: 'blur' }],
        // province: [{ required: true, message: '请输入省份', trigger: 'blur' }],
        // city: [{ required: true, message: '请输入城市', trigger: 'blur' }],
        // street: [{ required: true, message: '请输入街道地址', trigger: 'blur' }],
        // address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        // zip_code: [{ required: true, message: '请输入邮编', trigger: 'blur' }],
        // chat_link: [{ required: true, message: '请输入聊天三方链接', trigger: 'blur' }],
        // head_photo: [{ required: true, message: '请输入上传聊天三方二维码', trigger: 'blur' }],
        // status: [{ required: true, message: '请选择店铺状态', trigger: 'blur' }],
    })
    watch(
        () => props.query,
        (newQuery) => {
            formData.value = newQuery
        },
        {
            immediate: true,
            deep: true,
        },
    )
    const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
        img.value = URL.createObjectURL(uploadFile.raw!)
        formData.value.img = response.data.path
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
            // 使用正则表达式替换样式属性
            formData.value.describe = formData.value.describe.replace(/<img(.*?)>/g, function (match, p1) {
                if (p1.includes('style')) {
                    // 如果已经存在 style 属性，则在里面补充样式
                    return '<img' + p1.replace(/style="([^"]*)"/, 'style="$1 max-width: 100%;"') + '>'
                } else {
                    // 如果不存在 style 属性，则添加一个新的 style 属性
                    return '<img' + p1 + ' style="max-width: 100%;">'
                }
            })
            if (valid) {
                try {
                    let res = await addAnListInfo(formData.value)
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
                            duration: 800,
                        })
                        setTimeout(() => {
                            SettingStore.setReload()
                        }, 800)
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
