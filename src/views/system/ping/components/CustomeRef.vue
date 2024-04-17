<template>
    <div>
        <el-drawer v-model="dialogVisible" title="新增" size="70%">
            <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="130px">
                <el-form-item label="店铺" prop="shop_name" v-if="role == 1">
                    <el-select v-model="formData.shop_name" @change="changeIds" filterable placeholder="请选择">
                        <el-option v-for="item in dianPuList" :key="item.shop_name" :label="item.shop_name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="头部图片" prop="banner">
                    <el-upload
                        class="avatar-uploader"
                        action="https://api.ustudygroup.com/api/v1/Sign/fileAdd"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                    >
                        <img v-if="imageUrl" :src="imageUrl" style="max-width: 100px" class="avatar" />
                        <el-button v-else type="primary">上传头像</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="类型名称" prop="type_name">
                    <el-select v-model="formData.type_name" @change="changeId" filterable placeholder="请选择" style="width: 240px">
                        <el-option v-for="item in selects" :key="item.name" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="标签名称 " prop="price_type">
                    <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
                        <el-checkbox v-for="item in list" :key="item.name" :label="item.name" :value="item.name">{{
                            item.name
                        }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="价格分类" prop="price_type">
                    <el-checkbox @change="showCheck1" v-model="checked1">一口价</el-checkbox>
                    <el-checkbox @change="showCheck2" v-model="checked2">折扣价</el-checkbox>
                    <el-checkbox @change="showCheck3" v-model="checked3">区间折扣 </el-checkbox>
                </el-form-item>
                <el-form-item label="一口价" prop="price">
                    <el-input type="number" v-model="formData.price" style="width: 400px" placeholder="请输入一口价" />
                </el-form-item>
                <el-form-item label="折扣价" prop="price_cost">
                    <el-input type="number" v-model="formData.price_cost" style="width: 400px" placeholder="请输入折扣价" />
                </el-form-item>
                <el-form-item label="区间最低价格" prop="qujian1">
                    <el-input type="number" v-model="formData.qujian1" style="width: 400px" placeholder="请输入区间最低价格" />
                </el-form-item>
                <el-form-item label="区间最高价格" prop="qujian2">
                    <el-input type="number" v-model="formData.qujian2" style="width: 400px" placeholder="请输入区间最高价格" />
                </el-form-item>
                <el-form-item label="是否主推" prop="is_main">
                    <el-checkbox @change="showCheck4" v-model="checked4">否</el-checkbox>
                    <el-checkbox @change="showCheck5" v-model="checked5">是</el-checkbox>
                </el-form-item>
                <el-form-item label="简短描述" prop="describe">
                    <el-input v-model="formData.describe" style="width: 400px" placeholder="请输入简短描述" />
                </el-form-item>
                <el-form-item label="详细描述" prop="details">
                    <el-input v-model="formData.details" style="width: 400px" placeholder="请输入详细描述" />
                </el-form-item>
                <el-form-item label="修改状态" prop="status">
                    <el-checkbox @change="showCheck6" v-model="checked6">预备中</el-checkbox>
                    <el-checkbox @change="showCheck7" v-model="checked7">在线</el-checkbox>
                    <el-checkbox @change="showCheck8" v-model="checked8">下线</el-checkbox>
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
    import { getDianPuList } from '@/api/dianpu/apis'
    import { useSettingStore } from '@/store/modules/setting'
    import { changeFuApi } from '@/api/fu/apis'
    import { getBiaoList } from '@/api/biaoqian/apis'
    import { getFuList } from '@/api/fuwu/apis'
    const rules = reactive({
        shop_name: [{ required: true, message: '请选择店铺', trigger: 'blur' }],
        name: [{ required: true, message: '请选择店铺', trigger: 'blur' }],
        banner: [{ required: true, message: '请上传图片', trigger: 'blur' }],
        type_name: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        label_name: [{ required: true, message: '请选择标签', trigger: 'blur' }],
        price_type: [{ required: true, message: '请选择价格分类', trigger: 'blur' }],
        price: [{ required: true, message: '请输入一口价', trigger: 'blur' }],
        price_cost: [{ required: true, message: '请输入折扣价', trigger: 'blur' }],
        qujian1: [{ required: true, message: '请输入最低价格', trigger: 'blur' }],
        is_main: [{ required: true, message: '请确认是否主推', trigger: 'blur' }],
        describe: [{ required: true, message: '请简短描述', trigger: 'blur' }],
        details: [{ required: true, message: '请详细描述', trigger: 'blur' }],
        status: [{ required: true, message: '请确认状态', trigger: 'blur' }],
        qujian2: [
            { required: true, message: '请输入区间最高价格', trigger: 'blur' },
            {
                validator: (rule, value, callback) => {
                    if (!value) {
                        return callback(new Error('区间最高价格不能为空'))
                    }
                    if (formData.value.qujian1 && value > formData.value.qujian2) {
                        return callback(new Error('区间最高价格不能小于区间最低价格'))
                    }
                    return callback()
                },
                trigger: 'blur',
            },
        ],
    })
    const selects = ref([])
    const SettingStore = useSettingStore()
    const ruleFormRef = ref<FormInstance>()
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
    const changeIds = (itme) => {
        formData.value.shop_id = itme
        let name = dianPuList.value.find((item) => (item.id = itme))
        formData.value.name = name.shop_name
    }
    onMounted(async () => {
        try {
            let res = await getBiaoList()
            console.log(res)
            list.value = res.data.list
        } catch (error) {
            console.log(error)
        }
        try {
            let res = await getFuList()
            console.log(res)
            selects.value = res.data.list
        } catch (error) {
            console.log(error)
        }
        try {
            let res = await getDianPuList()
            console.log(res)
            dianPuList.value = res.data.list
        } catch (error) {
            console.log(error)
        }
    })
    const handleCheckedCitiesChange = (value: string[]) => {
        const selectedIds: number[] = []
        const selectedNames: string[] = [] // 用于存储被选中项的 name

        value.forEach((name) => {
            const selectedItem = list.value.find((item) => item.name === name)
            if (selectedItem) {
                selectedIds.push(selectedItem.id)
                selectedNames.push(selectedItem.name)
            }
        })

        formData.value.label_id = selectedIds.join(',')
        formData.value.label_name = selectedNames.join(',')

        console.log('选中项的 ID 字符串:', formData.value)
    }
    const checked1 = ref(false)
    const checked2 = ref(false)
    const checked3 = ref(false)
    const formData = ref({
        type_name: '',
        shop_id: '',
    })
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
    //banner
    const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
        imageUrl.value = URL.createObjectURL(uploadFile.raw!)
        formData.value.banner = response.data.path
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
    }
    const showCheck2 = (item) => {
        checked1.value = false
        checked2.value = true
        checked3.value = false
        formData.value.price_type = 2
    }
    const showCheck3 = (item) => {
        checked1.value = false
        checked2.value = false
        checked3.value = true
        formData.value.price_type = 3
    }
    const handleClose = async () => {
        await ruleFormRef.value.validate(async (valid, fields) => {
            if (valid) {
                let str = formData.value.qujian1 + ',' + formData.value.qujian2
                if (str != '') {
                    formData.value.price_range = str
                }
                if (role != 1) {
                    formData.value.shop_id = UserStore.userInfo.shopId
                    formData.value.name = UserStore.userInfo.shopName
                }
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
</style>
