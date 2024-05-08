<template>
    <div>
        <el-drawer v-model="dialogVisible" title="举证" size="60%">
            <div class="shang">
                <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="150px">
                    <el-form-item label="订单号" prop="orderId">
                        {{ formData.orderId }}
                    </el-form-item>
                    <el-form-item label="商家申诉描述" prop="refund_cause">
                        <el-input v-model="formData.refund_cause" type="textarea" />
                    </el-form-item>
                    <el-form-item label="上传举证凭证图片" props="ysh_voucher">
                        <el-upload
                            class="avatar-uploader"
                            action="https://api.ustudygroup.com/api/v1/Sign/fileAdd"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                        >
                            <el-button type="primary" :disabled="list.length >= 6">点击举证上传凭证</el-button>
                            <template #tip>
                                <div class="el-upload__tip"> 上传举证图片不可超过6张 </div>
                            </template>
                        </el-upload>
                    </el-form-item>

                    <el-form-item v-show="list.length >= 1" label="凭证举证图片预览" props="ysh_voucher">
                        <div class="item" v-for="(item, index) in list" :key="index">
                            <el-image
                                style="max-width: 500px"
                                class="avatar"
                                :src="'https://api.ustudygroup.com/' + item"
                                :zoom-rate="1.2"
                                :max-scale="7"
                                :min-scale="0.2"
                                :preview-src-list="['https://api.ustudygroup.com/' + item]"
                                :initial-index="4"
                                fit="cover"
                            />
                            <img class="remove" @click.stop="removess(index)" src="../../../../src/assets/remove/remove.png" alt="" />
                        </div>
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
    import { changeTuiList, shangjiashensu } from '@/api/tui/apis'
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
    })
    const rules = reactive({
        orderId: [{ required: true, message: '订单号不可为空，请刷新尝试', trigger: 'blur' }],
        refund_cause: [{ required: true, message: '请输入申诉服务描述', trigger: 'blur' }],
    })
    const list = ref([])

    watch(
        () => props.query,
        (newQuery) => {
            console.log(props.query)
            formData.value.orderId = props.query.order_id
            formData.value.goodsId = props.query.goodsId
            formData.value.shopId = props.query.shop_id
        },
        {
            immediate: true,
            deep: true,
        },
    )
    const removess = (index) => {
        list.value.splice(index, 1)
    }
    const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
        list.value.push(response.data.path)
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
        formData.value.files = JSON.stringify(list.value)
        await ruleFormRef.value.validate(async (valid, fields) => {
            if (valid) {
                try {
                    let res = await shangjiashensu(formData.value)
                    if (res.code == 1) {
                        ElNotification({
                            message: res.msg,
                            type: 'success',
                            duration: 3000,
                        })
                        setTimeout(() => {
                            SettingStore.setReload()
                        }, 1500)
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
    .item {
        position: relative;
    }
    .item .remove {
        position: absolute;
        right: 3px;
        top: -7px;
        width: 15px;
        cursor: pointer;
    }
    :deep(.m-user-table) {
        width: 100%;
    }
    :deep(.m-user-table) {
        width: 100%;
    }
</style>
