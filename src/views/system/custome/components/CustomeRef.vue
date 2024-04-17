<template>
    <div>
        <el-drawer v-model="dialogVisible" :title="props.title" size="50%">
            <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="120px">
                <el-form-item label="账号" prop="username">
                    <el-input v-model="formData.username" placeholder="请输入账号" />
                </el-form-item>
                <el-form-item v-if="formData.id" label="密码">
                    <el-input v-model="formData.password" placeholder="非必填" />
                </el-form-item>
                <el-form-item v-else label="密码" prop="password">
                    <el-input v-model="formData.password" placeholder="新增账号密码必填" />
                </el-form-item>
                <!-- <el-form-item label="角色" prop="roleId">
                    <el-cascader :props="optionProps" v-model="formData.roleId" :options="props.selectss" @change="handleChange" />
                </el-form-item>
                <el-form-item label="店铺" prop="shopId">
                    <el-select v-model="formData.shopId" filterable placeholder="请选择" style="width: 240px">
                        <el-option v-for="item in props.selects" :key="item.id" :label="item.shop_name" :value="item.id" />
                    </el-select>
                </el-form-item> -->
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="formData.phone" placeholder="请输入手机号" />
                </el-form-item>
                <el-form-item label="商户名称" prop="realname">
                    <el-input v-model="formData.realname" placeholder="请输入商户名称" />
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
    import { reactive, ref, watch, onMounted } from 'vue'
    import { FormInstance } from 'element-plus'
    import { useSettingStore } from '@/store/modules/setting'
    import { addYongHuList } from '@/api/yonghu/apis'
    const SettingStore = useSettingStore()
    const ruleFormRef = ref<FormInstance>()
    const dialogVisible = ref()
    const props = defineProps({
        title: {
            type: String,
            default: '',
        },
        query: {
            type: Object,
            default: {},
        },
        selects: {
            type: Object,
            default: [],
        },
        selectss: {
            type: Object,
            default: [],
        },
    })
    const rules = reactive({
        password: [
            { required: true, message: '新添加用户密码必填', trigger: 'blur' },
            { min: 6, max: 99, message: '长度在6个字符以上', trigger: 'blur' },
        ],
        username: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { min: 5, max: 5, message: '长度保持在5个字符', trigger: 'blur' },
        ],
        roleId: [{ required: true, message: '请选择角色', trigger: 'blur' }],
        shopId: [{ required: true, message: '请选择店铺', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        realname: [{ required: true, message: '请输入商户名称', trigger: 'blur' }],
    })
    const optionProps = {
        value: 'id',
        label: 'realname',
        // children: 'userList',
    }
    const formData = ref({
        password: '',
        id: '',
    })
    watch(
        () => props.query,
        (newQuery) => {
            formData.value = newQuery
            if (formData.value.id !== '') {
                props.selectss.forEach((item) => {
                    if (item.userList && item.userList.length != 0) {
                        item.userList.forEach((i) => {
                            if (i.realname == formData.value.roleId) {
                                formData.value.roleId = []
                                formData.value.roleId.push(item.id)
                                // formData.value.roleId.push(i.id)
                            }
                        })
                    }
                })
            }
        },
        {
            immediate: true,
            deep: true,
        },
    )

    const handleClose = async () => {
        // return
        formData.value.roleId = 0
        console.log(formData.value)

        await ruleFormRef.value.validate(async (valid, fields) => {
            if (valid) {
                try {
                    let res = await addYongHuList(formData.value)
                    SettingStore.setReload()
                } catch (error) {
                    console.log(error)
                }
            } else {
                console.log('error submit!', fields)
            }
        })
    }
    const handleChange = (value) => {
        console.log(value)
        formData.value.roleId = []
        if (value.length > 1) {
            formData.value.roleId = value[0]
        } else {
            formData.value.roleId = value[0]
        }
        console.log(formData.value.roleId)
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
