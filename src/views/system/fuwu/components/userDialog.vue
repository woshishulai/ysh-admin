<template>
    <el-drawer v-model="dialogVisible" :title="props.query.title" size="50%">
        <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="100px">
            <el-form-item label="类型" prop="name">
                <el-input v-model="formData.name" style="width: 400px" placeholder="请输入昵称" />
            </el-form-item>
            <el-form-item label="上传图片" props="img">
                <el-upload
                    class="avatar-uploader"
                    action="https://api.ustudygroup.com/api/v1/Sign/fileAdd"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                >
                    <img v-if="imageUrl" :src="imageUrl" style="max-width: 400px" class="avatar" />
                    <el-button v-else type="primary">点击上传图片</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label="图片地址" prop="img">
                <el-input v-if="!formData.img" v-model="formData.img" style="width: 400px" placeholder="请上传图片" />
                <span v-else>{{ 'https://api.ustudygroup.com/' + formData.img }}</span>
            </el-form-item>
            <el-form-item label="修改状态" prop="status">
                <el-checkbox @change="showCheck1" v-model="checked1">冻结</el-checkbox>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleClose(ruleFormRef)">确定</el-button>
            </span>
        </template>
    </el-drawer>
</template>
<script lang="ts" setup>
    import { ElMessageBox, ElMessage, FormInstance } from 'element-plus'
    import { reactive, ref, watch } from 'vue'
    import { useSettingStore } from '@/store/modules/setting'
    const SettingStore = useSettingStore()

    import { changeFuList } from '@/api/fuwu/apis'
    const formData = ref(null)
    const imageUrl = ref('')
    const checked1 = ref(false)
    const props = defineProps({
        query: {
            type: Object,
            default: {},
        },
        title: {
            type: String,
            default: '',
        },
    })
    const rules = reactive({
        name: [{ required: true, message: '类型名称不可为空', trigger: 'blur' }],
        img: [{ required: true, message: '请上传图片', trigger: 'blur' }],
    })
    const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
        imageUrl.value = URL.createObjectURL(uploadFile.raw!)
        formData.value.img = response.data.path
        console.log(response)
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
    watch(
        () => props.query,
        (newQuery) => {
            // 当 props.query 发生变化时，更新 formData 的值
            formData.value = newQuery
            if (formData.value.status == 1) {
                checked1.value = false
            } else {
                checked1.value = true
            }
        },
        {
            immediate: true,
            deep: true,
        },
    )

    const ruleFormRef = ref<FormInstance>()
    const dialogVisible = ref<boolean>(false)
    const showCheck1 = (item) => {
        if (item == true) {
            formData.value.status = 2
        } else {
            formData.value.status = 1
        }
        console.log(formData.value)
    }
    const show = (item = {}) => {
        dialogVisible.value = true
    }

    const handleClose = async (done: () => void) => {
        await ruleFormRef.value.validate(async (valid, fields) => {
            if (valid) {
                try {
                    let res = await changeFuList(formData.value)
                    SettingStore.setReload()
                } catch (error) {
                    console.log(error)
                }
            } else {
                console.log('error submit!', fields)
            }
        })
    }

    defineExpose({
        show,
    })
</script>
<style lang="scss" scoped></style>
