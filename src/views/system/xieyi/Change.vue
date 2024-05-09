<template>
    <div>
        <el-drawer v-model="dialogVisible" title="编辑" size="60%">
            <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="150px">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="formData.title" placeholder="请输入标题" />
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <wang-edior :show-img="true" v-model="formData.content" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleClose(ruleFormRef)">确定</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>
<script lang="ts" setup>
    import { addXieYiList } from '@/api/xieyi/apis'
    import { useSettingStore } from '@/store/modules/setting'
    import { useUserStore } from '@/store/modules/user'
    import WangEdior from '@/components/WangEdior/index.vue'

    import { reactive, ref, watch, onMounted } from 'vue'
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

    const formData = ref({})

    const rules = reactive({
        title: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        content: [{ required: true, message: '请选择商家或服务', trigger: 'blur' }],
    })

    watch(
        () => props.query,
        (newQuery) => {
            Object.assign(formData.value, props.query)
        },
        {
            immediate: true,
            deep: true,
        },
    )
    const handleClose = async () => {
        await ruleFormRef.value.validate(async (valid, fields) => {
            if (valid) {
                try {
                    let res = await addXieYiList(formData.value)
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
