<template>
    <div>
        <el-drawer v-model="dialogVisible" title="编辑" size="60%">
            <div class="shang">
                <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="150px">
                    <el-form-item label="图片" prop="img">
                        <el-upload
                            class="avatar-uploader"
                            action="https://api.ustudygroup.com/api/v1/Sign/fileAdd"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                        >
                            <img v-if="formData.img" :src="'https://api.ustudygroup.com/' + formData.img" style="max-width: 100px" />
                            <el-button v-else type="primary">上传图片</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="跳转类型" prop="jump_type">
                        <el-checkbox @change="showCheck1" v-model="checked1">服务</el-checkbox>
                        <el-checkbox @change="showCheck2" v-model="checked2">商户</el-checkbox>
                    </el-form-item>
                    <el-form-item label="对应服务id或商户id" prop="counter_id">
                        <el-select v-model="formData.counter_id" filterable placeholder="请选择" style="width: 240px">
                            <el-option v-for="item in selects" :key="item.id" :label="item.shop_name || item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注" prop="bname">
                        <el-input v-model="formData.bname" placeholder="请输入备注" />
                    </el-form-item>
                    <el-form-item label="排序" prop="sort">
                        <el-input type="number" v-model="formData.sort" placeholder="请输入排序数字越小越靠前" />
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-checkbox @change="showCheck4" v-model="checked4">正常</el-checkbox>
                        <el-checkbox @change="showCheck5" v-model="checked5">冻结</el-checkbox>
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
    import { addBannerList } from '@/api/banner/apis'
    import { useSettingStore } from '@/store/modules/setting'
    import { getFuList } from '@/api/fuwu/apis'
    import { getYongHuList } from '@/api/yonghu/apis'
    import { useUserStore } from '@/store/modules/user'
    import { reactive, ref, watch, onMounted } from 'vue'
    const UserStore = useUserStore()
    const SettingStore = useSettingStore()
    const ruleFormRef = ref<FormInstance>()
    const dialogVisible = ref(false)
    const role = UserStore.userInfo.isAdmin
    const shopList = ref([])
    const fuList = ref([])
    const selects = ref([])
    const props = defineProps({
        query: {
            type: Object,
            default: {},
        },
    })
    const params = {
        page: 1,
        pageSize: 1000,
    }
    const formData = ref({
        jump_type: 1,
        user_id: UserStore.userInfo.userId,
        status: 1,
    })
    onMounted(async () => {
        let res = await getFuList(params)
        res.data.list.forEach((item) => {
            item.id = item.id + ''
        })
        fuList.value = res.data.list
        selects.value = fuList.value
        let ress = await getYongHuList(params)
        ress.data.list.forEach((item) => {
            item.id = item.shop_id + ''
        })
        shopList.value = ress.data.list
    })
    const rules = reactive({
        jump_type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        counter_id: [{ required: true, message: '请选择商家或服务', trigger: 'blur' }],
        img: [{ required: true, message: '请上传图片', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
    })
    watch(
        () => formData.value.jump_type,
        (newQuery) => {
            if (formData.value.jump_type == 1) {
                selects.value = fuList.value
            } else {
                selects.value = shopList.value
            }
        },
        {
            immediate: true,
            deep: true,
        },
    )

    const img = ref('')
    const checked1 = ref(true)
    const checked2 = ref(false)
    const checked4 = ref(true)
    const checked5 = ref(false)
    const showCheck1 = (item) => {
        if (item == true) {
            checked1.value = true
            checked2.value = false
            formData.value.jump_type = 1
            formData.value.counter_id = ''
        } else {
            checked1.value = false
            checked2.value = true
            formData.value.jump_type = 2
            formData.value.counter_id = ''
        }
    }
    const showCheck2 = (item) => {
        if (item == true) {
            checked1.value = false
            checked2.value = true
            formData.value.jump_type = 2
            formData.value.counter_id = ''
        } else {
            checked1.value = true
            checked2.value = false
            formData.value.jump_type = 1
            formData.value.counter_id = ''
        }
    }
    const showCheck4 = (item) => {
        if (item == true) {
            checked4.value = true
            checked5.value = false
            formData.value.status = 1
        } else {
            checked4.value = false
            checked5.value = true
            formData.value.status = 2
        }
    }
    const showCheck5 = (item) => {
        if (item == true) {
            checked5.value = true
            checked4.value = false
            formData.value.status = 2
        } else {
            checked5.value = false
            checked4.value = true
            formData.value.status = 1
        }
    }
    watch(
        () => props.query,
        (newQuery) => {
            Object.assign(formData.value, props.query)
            formData.value.counter_id = formData.value.counter_id + ''
            formData.value.id = formData.value.id + ''
            if (formData.value.jump_type == 1) {
                checked1.value = true
                checked2.value = false
            } else if (formData.value.jump_type == 2) {
                checked2.value = true
                checked1.value = false
            }
            if (formData.value.status == 1) {
                checked4.value = true
                checked5.value = false
            } else if (formData.value.status == 2) {
                checked5.value = true
                checked4.value = false
            }
            console.log(formData.value)
        },
        {
            immediate: true,
            deep: true,
        },
    )
    //banner
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
            if (valid) {
                try {
                    let res = await addBannerList(formData.value)
                    SettingStore.setReload()
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
