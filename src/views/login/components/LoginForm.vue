<template>
    <div class="login-title">
        <img class="icon" src="@/assets/image/login/logo.png" alt="logo" />
        <h2 class="title">优师汇后台管理系统</h2>
    </div>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules">
        <el-form-item label="" prop="username">
            <el-input
                v-model="ruleForm.username"
                placeholder="请输入用户名"
                auto-complete="on"
                style="position: relative"
                @keyup.enter="submitForm(ruleFormRef)"
            >
                <template #prefix>
                    <el-icon class="el-input__icon"><UserFilled /></el-icon>
                </template>
            </el-input>
        </el-form-item>

        <el-form-item label="" prop="password">
            <el-input
                v-model="ruleForm.password"
                show-password
                placeholder="请输入密码"
                auto-complete="on"
                :type="passwordType"
                @keyup.enter="submitForm(ruleFormRef)"
            >
                <template #prefix>
                    <el-icon class="el-input__icon"><GoodsFilled /></el-icon>
                </template>
                <template #suffix>
                    <div class="show-pwd" @click="showPwd">
                        <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                    </div>
                </template>
            </el-input>
        </el-form-item>

        <el-form-item style="width: 100%">
            <el-button :loading="loading" class="login-btn" type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
        </el-form-item>
    </el-form>
</template>
<script lang="ts" setup>
    import { ref, reactive } from 'vue'
    import type { FormInstance } from 'element-plus'
    import { ElNotification } from 'element-plus'
    import { useRouter } from 'vue-router'
    import { useUserStore } from '@/store/modules/user'
    import { getTimeStateStr } from '@/utils/index'
    import { login } from '@/api/user'
    const router = useRouter()
    const UserStore = useUserStore()
    const ruleFormRef = ref<FormInstance>()
    const passwordType = ref('password')
    const loading = ref(false)

    const rules = reactive({
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    })

    // 表单数据
    const ruleForm = reactive({
        username: '',
        password: '',
    })

    // 显示密码图标
    const showPwd = () => {
        passwordType.value = passwordType.value === 'password' ? '' : 'password'
    }

    const submitForm = (formEl: FormInstance | undefined) => {
        if (!formEl) return
        formEl.validate((valid) => {
            if (valid) {
                loading.value = true
                // 登录
                setTimeout(async () => {
                    let res = await login(ruleForm)
                    if (res.code != 1) {
                        ElNotification({
                            message: res.msg,
                            type: 'error',
                            duration: 600000,
                        })
                        loading.value = false
                        return
                    }
                    res.data.menuList.sort((a, b) => a.sort - b.sort)
                    let querys = {}
                    let datas = {}
                    for (let key in res.data) {
                        if (typeof res.data[key] !== 'object') {
                            querys[key] = res.data[key]
                        } else {
                            datas[key] = res.data[key]
                        }
                    }
                    if (querys.isAdmin != 1 && !querys.shopId) {
                        ElNotification({
                            message: '请联系管理员绑定店铺',
                            type: 'error',
                            duration: 3000,
                        })
                        loading.value = false
                        return
                    }
                    localStorage.setItem('menuList', JSON.stringify(datas))
                    UserStore.changeUserInfo(querys)
                    let newQuery = {
                        username: res.data.username,
                        password: ruleForm.password,
                    }
                    UserStore.login(newQuery)
                    if (res.data.menuList[0].menuList.length == 0) {
                        router.push({
                            path: res.data.menuList[0].web_url,
                        })
                    } else {
                        router.push({
                            path: res.data.menuList[0].menuList[0].web_url,
                        })
                    }
                    if (UserStore.userInfo.is_pass == 1) {
                        // ElNotification({
                        //     message: '首次登录建议修改密码',
                        //     duration: 3000,
                        // })
                    } else {
                        ElNotification({
                            title: getTimeStateStr(),
                            message: '欢迎登录 ' + res.data.realname,
                            type: 'success',
                            duration: 3000,
                        })
                    }

                    loading.value = false
                }, 1000)
            } else {
                console.log('error submit!')
                return false
            }
        })
    }
</script>

<style lang="scss" scoped>
    @import '../index.scss';
</style>
