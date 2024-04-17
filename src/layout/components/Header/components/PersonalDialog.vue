<template>
    <el-dialog v-model="dialogVisible" title="修改密码" width="40%">
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" :size="formSize">
            <el-form-item label="账号">
                <el-input v-model="ruleForm.name" disabled></el-input>
            </el-form-item>
            <el-form-item label="旧的密码" prop="password">
                <el-input v-model="ruleForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="新的密码" prop="configPassword">
                <el-input v-model="ruleForm.configPassword" type="password"></el-input>
            </el-form-item>
            <el-form-item label="再次确认" prop="rePassword">
                <el-input v-model="ruleForm.rePassword" type="password"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
    import { ref, defineExpose, reactive } from 'vue'
    import type { ElForm } from 'element-plus'
    const dialogVisible = ref(false)
    import { useUserStore } from '@/store/modules/user'
    import { changePassword } from '@/api/user'
    import { ElNotification } from 'element-plus'
    import { useRouter } from 'vue-router'
    const router = useRouter()
    const UserStore = useUserStore()
    const show = () => {
        dialogVisible.value = true
    }
    const hide = () => {
        dialogVisible.value = false
    }
    type FormInstance = InstanceType<typeof ElForm>

    const formSize = ref('')
    const ruleFormRef = ref<FormInstance>()
    const ruleForm = reactive({
        name: UserStore.userInfo.username,
        password: '',
        configPassword: '',
        rePassword: '',
    })
    const rules = reactive({
        configPassword: [
            {
                required: true,
                message: '请输入新的密码',
                trigger: 'blur',
            },
            {
                validator: (rule, value, callback) => {
                    if (value === ruleForm.password) {
                        callback(new Error('新密码不能与旧密码相同'))
                    } else {
                        callback()
                    }
                },
                trigger: 'blur',
            },
        ],
        rePassword: [
            {
                required: true,
                message: '请再次输入新的密码',
                trigger: 'blur',
            },
            {
                validator: (rule, value, callback) => {
                    if (value !== ruleForm.configPassword) {
                        callback(new Error('两次输入的新密码不一致'))
                    } else {
                        callback()
                    }
                },
                trigger: 'blur',
            },
        ],
    })

    const submitForm = (formEl: FormInstance | undefined) => {
        if (!formEl) return
        formEl.validate(async (valid) => {
            if (valid) {
                let query = {
                    id: UserStore.userInfo.userId,
                    password: ruleForm.password,
                    newPassword1: ruleForm.configPassword,
                    newPassword2: ruleForm.rePassword,
                }
                let res = await changePassword(query)
                if (res.code == 1) {
                    ElNotification({
                        message: res.msg,
                        type: 'success',
                    })
                    localStorage.removeItem('menuList')
                    UserStore.logout()
                    router.push({ path: '/login' })
                } else {
                    ElNotification({
                        message: res.msg,
                        type: 'error',
                        duration: 3000,
                    })
                }
            } else {
                console.log('error submit!')
                return false
            }
        })
    }

    const resetForm = (formEl: FormInstance | undefined) => {
        if (!formEl) return
        formEl.resetFields()
    }

    defineExpose({
        show,
    })
</script>

<style scoped>
    .dialog-footer button:first-child {
        margin-right: 10px;
    }
</style>
