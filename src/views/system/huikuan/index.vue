<template>
    <div class="shang">
        <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="100px">
            <el-form-item label="公司名称" prop="name">
                <el-input v-model="formData.name" placeholder="请输入公司名称" />
            </el-form-item>
            <el-form-item label="公司注册地 " prop="zhuce">
                <el-input v-model="formData.zhuce" placeholder="请输入公司注册地" />
            </el-form-item>
            <el-form-item label="识别号" prop="shibie">
                <el-input v-model="formData.shibie" placeholder="请输入公司识别号" />
            </el-form-item>
            <el-form-item label="开户行" prop="kaihu">
                <el-input v-model="formData.kaihu" placeholder="请输入公司开户行" />
            </el-form-item>
            <el-form-item label="账号" prop="code">
                <el-input v-model="formData.code" placeholder="请输入账户号" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleClose(ruleFormRef)">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script lang="ts" setup>
    import { ref, reactive, onMounted } from 'vue'
    import { getHuiList, changeHuiKuan } from '@/api/huikuan/apis'
    import { useSettingStore } from '@/store/modules/setting'
    import { ElNotification } from 'element-plus'
    import { useUserStore } from '@/store/modules/user'
    const UserStore = useUserStore()
    const SettingStore = useSettingStore()
    const ruleFormRef = ref<FormInstance>()
    const role = UserStore.userInfo.isAdmin
    const formData = ref({
        name: '',
        zhuce: '',
        shibie: '',
        kaihu: '',
        code: '',
    })
    onMounted(async () => {
        try {
            let res = await getHuiList()
            formData.value.name = res.data[0]
            formData.value.zhuce = res.data[1]
            formData.value.shibie = res.data[2]
            formData.value.kaihu = res.data[3]
            formData.value.code = res.data[4]
        } catch (error) {}
    })
    const rules = reactive({
        name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        zhuce: [{ required: true, message: '请输入公司注册地', trigger: 'blur' }],
        shibie: [{ required: true, message: '请输入公司识别号', trigger: 'blur' }],
        kaihu: [{ required: true, message: '请输入公司开户行', trigger: 'blur' }],
        code: [{ required: true, message: '请输入账户号', trigger: 'blur' }],
    })
    const handleClose = async () => {
        await ruleFormRef.value.validate(async (valid, fields) => {
            if (valid) {
                let one = formData.value.name
                let two = formData.value.zhuce
                let san = formData.value.shibie
                let si = formData.value.kaihu
                let wu = formData.value.code
                let str = one + '、' + two + '、' + san + '、' + si + '、' + wu
                let query = {
                    path: str,
                }
                try {
                    let res = await changeHuiKuan(query)
                    if (res.code == 1) {
                        SettingStore.setReload()
                    } else {
                        ElNotification({
                            message: res.msg,
                            type: 'error',
                            duration: 3000,
                        })
                    }
                } catch (error) {}
            } else {
                console.log('error submit!', fields)
            }
        })
    }
</script>
<style lang="scss" scoped>
    .el-drawer__header > :first-child {
        font-size: 20px;
    }
    .shang {
        width: 100%;
        display: flex;
        background-color: #fff;
        padding: 20px 10px;
        .el-form {
            padding: 20px 0;
            flex: 1;
            max-width: 550px;
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
