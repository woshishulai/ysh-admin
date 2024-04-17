<template>
    <div>
        <div class="shang">
            <el-form ref="ruleFormRef" v-if="formData" :model="formData" :rules="rules" label-width="120px">
                <el-form-item label="店铺名称" prop="shop_name">
                    <el-input v-model="formData.shop_name" placeholder="请输入店铺名称" />
                </el-form-item>
                <el-form-item label="公司名称" prop="company_name">
                    <el-input v-model="formData.company_name" placeholder="请输入公司名称" />
                </el-form-item>
                <el-form-item label="头像" prop="head_photo">
                    <img v-if="formData.head_photo" :src="'https://api.ustudygroup.com/' + formData.head_photo" class="avatar" />
                    <el-upload
                        class="avatar-uploader"
                        action="https://api.ustudygroup.com/api/v1/Sign/fileAdd"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                    >
                        <el-button type="primary">上传头像</el-button>
                    </el-upload>
                    <span style="color: #999; font-size: 12px; display: block; margin-top: 10px; margin-left: 6px"
                        >图片单张最大不超过5MB，支持Image文件类型上传</span
                    >
                </el-form-item>
                <el-form-item label="店铺详情" prop="details">
                    <wang-edior :showImg="true" v-model="formData.details" />
                </el-form-item>
                <el-form-item label="国家" prop="country">
                    <el-input v-model="formData.country" placeholder="请输入国家" />
                </el-form-item>
                <el-form-item label="省份" prop="province">
                    <el-input v-model="formData.province" placeholder="请输入省份" />
                </el-form-item>
                <el-form-item label="城市" prop="city">
                    <el-input v-model="formData.city" placeholder="请输入城市" />
                </el-form-item>
                <el-form-item label="街道地址" prop="street">
                    <el-input v-model="formData.street" placeholder="请输入街道地址" />
                </el-form-item>
                <el-form-item label="详细地址" prop="address">
                    <el-input v-model="formData.address" placeholder="请输入详细地址" />
                </el-form-item>
                <el-form-item label="邮编" prop="zip_code">
                    <el-input v-model="formData.zip_code" placeholder="请输入邮编" />
                </el-form-item>
                <el-form-item label="聊天三方链接" prop="chat_link">
                    <el-input v-model="formData.chat_link" placeholder="请输入第三方链接" />
                </el-form-item>
                <el-form-item label="聊天三方二维码" prop="chat_code" width="200">
                    <img v-if="formData.chat_code" :src="'https://api.ustudygroup.com/' + formData.chat_code" class="avatar" />
                    <el-upload
                        class="avatar-uploader"
                        action="https://api.ustudygroup.com/api/v1/Sign/fileAdd"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccesss"
                        :before-upload="beforeAvatarUpload"
                    >
                        <el-button type="primary">上传二维码照片</el-button>
                    </el-upload>
                    <span style="color: #999; font-size: 12px; display: block; margin-top: 10px; margin-left: 6px"
                        >图片单张最大不超过5MB，支持Image文件类型上传</span
                    >
                </el-form-item>
                <el-form-item label="修改状态" prop="status">
                    <el-checkbox @change="showCheck1" v-model="checked1">预备中</el-checkbox>
                    <el-checkbox @change="showCheck2" v-model="checked2">在线</el-checkbox>
                    <el-checkbox @change="showCheck3" v-model="checked3">下线</el-checkbox>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="Edit" @click="handleClose(ruleFormRef)">保存修改</el-button>
                    <el-button type="primary" icon="Edit" @click="showTime()"> 编辑营业时间 </el-button>
                    <el-button type="primary" icon="Edit" @click="showTimes()"> 编辑案例 </el-button>
                </el-form-item>
            </el-form>
            <div class="info">
                <Details :formData="formData"></Details>
            </div>
        </div>
        <el-drawer v-model="dialogVisible" title="查看编辑店铺营业时间" size="60%">
            <Time :id="role == 1 ? ids : formData?.id"></Time>
        </el-drawer>
        <el-drawer v-model="dialogVisibless" title="查看编辑店铺成功案例" size="60%">
            <AnLi :id="role == 1 ? ids : formData?.id"></AnLi>
        </el-drawer>
    </div>
</template>
<script lang="ts" setup>
    import Details from './components/details.vue'
    import { ElNotification, ElMessage, FormInstance } from 'element-plus'
    import Time from '@/views/system/time/components/userTable.vue'
    import AnLi from '@/views/system/anli/components/userTable.vue'
    import { useUserStore } from '@/store/modules/user'
    import { useSettingStore } from '@/store/modules/setting'
    import { useRouter } from 'vue-router'
    import { ref, onMounted, reactive, watch } from 'vue'
    import WangEdior from '@/components/WangEdior/index.vue'
    import { changeStatusShop, getDianPuDetails, addShopInfo } from '@/api/dianpu/apis'
    const ruleFormRef = ref<FormInstance>()
    const UserStore = useUserStore()
    const dialogVisibless = ref(false)
    const role = UserStore.userInfo.isAdmin
    const ids = ref('')
    const props = defineProps({
        changes: {
            type: Object,
            default: {},
        },
    })
    watch(
        () => props.changes,
        async (newQuery) => {
            if (role != 1 && !props.changes.id) {
                return
            } else {
                try {
                    const shopId = props.changes.id
                    let query = {
                        id: shopId,
                    }
                    ids.value = props.changes.id
                    console.log(ids.value)

                    let res = await getDianPuDetails(query)
                    formData.value = res.data
                    if (formData.value.status || formData.value.status == 0) {
                        if (formData.value.status == 0) {
                            checked1.value = true
                        }
                        if (formData.value.status == 1) {
                            checked2.value = true
                        }
                        if (formData.value.status == 2) {
                            checked3.value = true
                        }
                        if (!formData.value.details) {
                            formData.value.details = ''
                        }
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        },
        {
            immediate: true,
            deep: true,
        },
    )
    const checked1 = ref(false)
    const checked2 = ref(false)
    const checked3 = ref(false)
    const dialogVisible = ref(false)
    const rules = reactive({
        shop_name: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
        company_name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        // chat_code: [{ required: true, message: '请上传头像', trigger: 'blur' }],
        details: [
            { required: true, message: '请输入公司详情', trigger: 'blur' },
            { validator: checkWordCount, trigger: 'blur' },
        ],
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
    const formData = ref({})
    onMounted(async () => {
        if (role != 1) {
            try {
                const shopId = UserStore.userInfo.shopId
                let query = {
                    id: shopId,
                }
                let res = await getDianPuDetails(query)
                formData.value = res.data
                if (formData.value.status || formData.value.status == 0) {
                    if (formData.value.status == 0) {
                        checked1.value = true
                    }
                    if (formData.value.status == 1) {
                        checked2.value = true
                    }
                    if (formData.value.status == 2) {
                        checked3.value = true
                    }
                    if (!formData.value.details) {
                        formData.value.details = ''
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
    })
    function checkWordCount() {
        const plainText = formData.value.details.replace(/<[^>]+>/g, '')
        if (plainText.length < 50) {
            return Promise.reject(new Error('公司详情至少输入50字'))
        } else if (plainText.length > 200) {
            return Promise.reject(new Error('公司详情最多输入200字'))
        } else {
            return Promise.resolve()
        }
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
    //二维码
    const handleAvatarSuccesss: UploadProps['onSuccess'] = (response, uploadFile) => {
        // formData.value.chat_code = response.data.path
        formData.value.chat_code = response.data.path
    }
    //上传头像
    const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
        formData.value.head_photo = response.data.path
    }
    //上传
    const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
        // 检查文件类型是否以 'image/' 开头
        if (!rawFile.type.startsWith('image/')) {
            ElMessage.error('只能上传图片格式')
            return false
        } else if (rawFile.size / 1024 / 1024 > 5) {
            // 检查文件大小是否超过 2MB
            ElMessage.error('图片大小不可以超过5MB')
            return false
        }
        // 如果以上检查都通过，则允许上传
        return true
    }
    //提交
    const handleClose = async () => {
        await ruleFormRef.value.validate(async (valid, fields) => {
            // 使用正则表达式替换样式属性
            formData.value.details = formData.value.details.replace(/<img(.*?)>/g, function (match, p1) {
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
                    let res = await addShopInfo(formData.value)
                    console.log(res)
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
    //店铺营业时间
    const showTime = () => {
        dialogVisible.value = true
    }
    const showTimes = () => {
        dialogVisibless.value = true
    }
</script>

<style scoped lang="scss">
    @import './index';
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
            border-radius: 50%;
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
