<template>
    <div>
        <el-drawer v-model="dialogVisible" title="新增" size="80%">
            <div class="shang">
                <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="130px">
                    <!-- <el-form-item label="店铺" prop="shop_name" v-if="role == 1">
                        <el-select v-model="formData.shop_name" @change="changeIds" filterable placeholder="请选择">
                            <el-option v-for="item in dianPuList" :key="item.shop_name" :label="item.shop_name" :value="item.id" />
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="服务名称" prop="name">
                        <el-input v-model="formData.name" placeholder="请输入服务名称" />
                    </el-form-item>
                    <el-form-item label="标题图片" prop="banner">
                        <el-upload
                            class="avatar-uploader"
                            action="https://api.ustudygroup.com/api/v1/Sign/fileAdd"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                        >
                            <img v-if="imageUrl" :src="imageUrl" style="max-width: 100px" class="avatar" />
                            <el-button v-else type="primary">上传图片</el-button>
                        </el-upload>
                        <span style="color: #999; font-size: 12px; display: block; margin-top: 10px; line-height: 18px; margin-left: 6px"
                            >图片单张最大不超过5MB，建议图片宽高比例4:2.4,支持Image文件类型上传</span
                        >
                    </el-form-item>
                    <el-form-item label="类型名称" prop="type_name">
                        <el-select v-model="formData.type_name" @change="changeId" filterable placeholder="请选择">
                            <el-option v-for="item in selects" :key="item.name" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标签名称 " prop="label_name">
                        <el-select v-model="checkList" multiple placeholder="请选择标签" style="width: 240px">
                            <el-option v-for="item in list" :key="item.name" :label="item.name" :value="item.name" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="价格分类" prop="price_type">
                        <el-checkbox @change="showCheck1" v-model="checked1">一口价</el-checkbox>
                        <el-checkbox @change="showCheck2" v-model="checked2">折扣价</el-checkbox>
                        <el-checkbox @change="showCheck3" v-model="checked3">区间折扣 </el-checkbox>
                    </el-form-item>
                    <el-form-item label="一口价" prop="price" v-if="checked1">
                        <el-input type="number" v-model="formData.price" placeholder="请输入一口价" />
                    </el-form-item>
                    <el-form-item label="原价" prop="old_price" v-if="checked2">
                        <el-input type="number" v-model="formData.old_price" placeholder="请输入原价" />
                    </el-form-item>
                    <el-form-item label="折扣价" prop="price_cost" v-if="checked2">
                        <el-input type="number" v-model="formData.price_cost" placeholder="请输入折扣价" />
                    </el-form-item>
                    <el-form-item label="区间最低价格" prop="qujian1" v-if="checked3">
                        <el-input type="number" v-model="formData.qujian1" placeholder="请输入区间最低价格" />
                    </el-form-item>
                    <el-form-item label="区间最高价格" prop="qujian2" v-if="checked3">
                        <el-input type="number" v-model="formData.qujian2" placeholder="请输入区间最高价格" />
                    </el-form-item>
                    <el-form-item label="是否主推" prop="is_main">
                        <el-checkbox @change="showCheck4" v-model="checked4">否</el-checkbox>
                        <el-checkbox @change="showCheck5" v-model="checked5">是</el-checkbox>
                    </el-form-item>
                    <el-form-item label="服务简介" prop="details">
                        <wang-edior :showImg="true" v-model="formData.describe" />
                    </el-form-item>
                    <el-form-item label="服务详情" prop="details">
                        <wang-edior :showImg="true" v-model="formData.details" />
                    </el-form-item>
                    <el-form-item label="修改状态" prop="status">
                        <el-checkbox @change="showCheck6" v-model="checked6">预备中</el-checkbox>
                        <el-checkbox @change="showCheck7" v-model="checked7">在线</el-checkbox>
                        <el-checkbox @change="showCheck8" v-model="checked8">下线</el-checkbox>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="handleClose(ruleFormRef)">确定</el-button>
                    </el-form-item>
                </el-form>
                <div class="info">
                    <Details :details="formData" />
                </div>
            </div>
        </el-drawer>
    </div>
</template>
<script lang="ts" setup>
    import { ElMessage } from 'element-plus'
    import { ElNotification } from 'element-plus'
    import Details from './details.vue'
    import { reactive, ref, watch, onMounted } from 'vue'
    import { FormInstance } from 'element-plus'
    import { useUserStore } from '@/store/modules/user'
    import { getDianPuList } from '@/api/dianpu/apis'
    import { useSettingStore } from '@/store/modules/setting'
    import { changeFuApi } from '@/api/fu/apis'
    import WangEdior from '@/components/WangEdior/index.vue'
    import { getBiaoList } from '@/api/biaoqian/apis'
    import { getFuList } from '@/api/fuwu/apis'
    const ruleFormRef = ref<FormInstance>()

    const formData = ref({
        type_name: '',
        shop_id: '',
        banner: '',
        price_type: '1',
    })

    const validatePass = (rule: any, value: any, callback: any) => {
        if (value == '') {
            callback(new Error('价格不可为空'))
        } else if (value < 5) {
            callback(new Error('价格不可小于5元'))
        } else {
            callback()
        }
    }
    const validatePass1 = (rule: any, value: any, callback: any) => {
        console.log(formData.value.old_price, formData.value.price_cost)
        console.log(value)
        if (value === '') {
            callback(new Error('价格不可为空'))
            return
        } else if (parseFloat(value) < 5) {
            callback(new Error('价格不可小于5'))
            return
        } else if (parseFloat(value) > parseFloat(formData.value.old_price)) {
            callback(new Error(`折扣价不能大于原价 `))
            return
        } else {
            callback()
            return
        }
    }

    const validatePass2 = (rule: any, value: any, callback: any) => {
        if (value == '') {
            callback(new Error('价格不可为空'))
        } else if (value < 5) {
            callback(new Error('价格不可小于5元'))
        } else if (parseFloat(value) < parseFloat(formData.value.qujian1)) {
            callback(new Error(`最高价格不可低于最低价格 `))
            return
        } else {
            callback()
        }
    }
    const rules = ref({
        shop_name: [{ required: true, message: '请选择店铺', trigger: 'blur' }],
        name: [{ required: true, message: '请选择店铺', trigger: 'blur' }],
        banner: [{ required: true, message: '请上传图片', trigger: 'blur' }],
        type_name: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        label_name: [{ required: true, message: '请选择标签', trigger: 'blur' }],
        price_type: [{ required: true, message: '请选择价格分类', trigger: 'blur' }],
        price: [{ required: true, validator: validatePass, trigger: 'blur' }],
        old_price: [{ required: true, validator: validatePass, trigger: 'blur' }],
        price_cost: [{ required: true, validator: validatePass1, trigger: 'blur' }],
        qujian1: [{ required: true, validator: validatePass, trigger: 'blur' }],
        is_main: [{ required: true, message: '请确认是否主推', trigger: 'blur' }],
        status: [{ required: true, message: '请确认状态', trigger: 'blur' }],
        qujian2: [{ required: true, validator: validatePass2, trigger: 'blur' }],
    })
    const selects = ref([])
    const SettingStore = useSettingStore()
    const dialogVisible = ref(false)
    const UserStore = useUserStore()
    const role = UserStore.userInfo.isAdmin
    const imageUrl = ref('')
    const img = ref('')
    const list = ref([])
    const checkList = ref([])
    const dianPuList = ref([])
    const changeId = (itme) => {
        formData.value.type_id = itme
    }
    onMounted(async () => {
        try {
            let query = {
                page: 1,
                pageSize: 10000,
            }
            let res = await getBiaoList(query)
            list.value = res.data.list.filter((item) => item.status == 1)
        } catch (error) {
            console.log(error)
        }
        try {
            let query = {
                page: 1,
                pageSize: 10000,
            }
            let res = await getFuList()
            selects.value = res.data.list.filter((item) => item.status == 1)
            console.log(selects.value)
        } catch (error) {
            console.log(error)
        }
        try {
            let res = await getDianPuList()
            dianPuList.value = res.data.list
        } catch (error) {
            console.log(error)
        }
    })
    const checked1 = ref(true)
    const checked2 = ref(false)
    const checked3 = ref(false)

    watch(
        () => formData.value?.old_price,
        () => {
            if (parseFloat(formData.value?.old_price) < parseFloat(formData.value?.price_cost)) {
                formData.value.price_cost = ''
            }
        },
    )
    watch(
        () => formData.value?.qujian1,
        () => {
            console.log(parseFloat(formData.value?.qujian1), formData.value?.qujian2)
            if (parseFloat(formData.value?.qujian1) > parseFloat(formData.value?.qujian2)) {
                formData.value.qujian2 = ''
            }
        },
    )

    const checked4 = ref(false)
    const checked5 = ref(false)
    const showCheck4 = (item) => {
        checked4.value = true
        checked5.value = false
        formData.value.is_main = 0
    }
    const showCheck5 = (item) => {
        checked5.value = true
        checked4.value = false
        formData.value.is_main = 1
    }

    const checked6 = ref(false)
    const checked7 = ref(false)
    const checked8 = ref(false)

    const showCheck6 = (item) => {
        checked6.value = true
        checked7.value = false
        checked8.value = false
        formData.value.status = 0
    }
    const showCheck7 = (item) => {
        checked6.value = false
        checked7.value = true
        checked8.value = false
        formData.value.status = 1
    }
    const showCheck8 = (item) => {
        checked6.value = false
        checked7.value = false
        checked8.value = true
        formData.value.status = 2
    }
    watch(
        () => checkList.value.length,
        () => {
            formData.value.new = checkList.value
            console.log(formData.value.new)
        },
    )
    //banner
    const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
        imageUrl.value = URL.createObjectURL(uploadFile.raw!)
        formData.value.banner = response.data.path
        console.log(formData.value)
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
        formData.value.price_type = 1
        formData.value.price_cost = ''
        formData.value.old_price = ''
        formData.value.price = ''
        formData.value.qujian2 = ''
        formData.value.qujian1 = ''
    }
    const showCheck2 = (item) => {
        checked1.value = false
        checked2.value = true
        checked3.value = false
        formData.value.price_type = 2
        formData.value.old_price = ''
        formData.value.price_cost = ''
        formData.value.price = ''
        formData.value.qujian2 = ''
        formData.value.qujian1 = ''
    }
    const showCheck3 = (item) => {
        checked1.value = false
        checked2.value = false
        checked3.value = true
        formData.value.old_price = ''
        formData.value.price_type = 3
        formData.value.price_cost = ''
        formData.value.price = ''
        formData.value.qujian2 = ''
        formData.value.qujian1 = ''
    }
    const handleClose = async () => {
        // if (checked3.value == true && formData.value.qujian1 > formData.value.qujian2) {
        //     ElNotification({
        //         message: '区间最高价格不能小于区间最低价格',
        //         type: 'error',
        //         duration: 3000,
        //     })
        //     return
        // }
        console.log(1)

        formData.value.label_name = checkList.value.join(',')
        console.log(2)

        await ruleFormRef.value.validate(async (valid, fields) => {
            if (valid) {
                console.log(3)

                let str = formData.value.qujian1 + '.00' + ',' + formData.value.qujian2 + '.00'
                if (str != '') {
                    formData.value.price_range = str
                }
                if (role != 1) {
                    formData.value.shop_id = UserStore.userInfo.shopId
                    // formData.value.name = UserStore.userInfo.shopName
                }
                if (formData.value.price_type == 3) {
                    formData.value.price = formData.value.qujian1 + '.00'
                }
                if (formData.value.price_type == 2) {
                    formData.value.price = formData.value.price_cost + '.00'
                }
                if (formData.value.details) {
                    formData.value.details = formData.value.details.replace(/<img(.*?)>/g, function (match, p1) {
                        if (p1.includes('style')) {
                            // 如果已经存在 style 属性，则在里面补充样式
                            return '<img' + p1.replace(/style="([^"]*)"/, 'style="$1 max-width: 100%;"') + '>'
                        } else {
                            // 如果不存在 style 属性，则添加一个新的 style 属性
                            return '<img' + p1 + ' style="max-width: 100%;">'
                        }
                    })
                }
                if (formData.value.describe) {
                    formData.value.describe = formData.value.describe.replace(/<img(.*?)>/g, function (match, p1) {
                        if (p1.includes('style')) {
                            // 如果已经存在 style 属性，则在里面补充样式
                            return '<img' + p1.replace(/style="([^"]*)"/, 'style="$1 max-width: 100%;"') + '>'
                        } else {
                            // 如果不存在 style 属性，则添加一个新的 style 属性
                            return '<img' + p1 + ' style="max-width: 100%;">'
                        }
                    })
                }

                console.log(4)

                try {
                    let res = await changeFuApi(formData.value)
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
