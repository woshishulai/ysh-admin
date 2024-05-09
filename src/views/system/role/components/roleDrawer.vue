<template>
    <el-drawer v-model="dialogVisible" :title="props.title" size="50%">
        <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="100px">
            <el-form-item label="角色名称" prop="rolename">
                <el-input v-model="formData.rolename" placeholder="请输入角色名称" />
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="formData.remark" placeholder="备注" />
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
    import { reactive, ref, watch } from 'vue'
    import { FormInstance } from 'element-plus'
    import { changeAdminList } from '@/api/juese/apis'
    import { useSettingStore } from '@/store/modules/setting'
    const SettingStore = useSettingStore()
    const ruleFormRef = ref<FormInstance>()
    const dialogVisible = ref(false)
    const rules = reactive({
        rolename: [{ required: true, message: '角色名称不可为空', trigger: 'blur' }],
    })
    const props = defineProps({
        title: {
            type: String,
            default: '',
        },
        query: {
            type: Object,
            default: {},
        },
    })
    const formData = ref({})
    watch(
        () => props.query,
        (newQuery) => {
            formData.value = newQuery
        },
        {
            immediate: true,
        },
    )
    const show = (item = {}) => {
        dialogVisible.value = true
    }

    const handleClose = async (done: () => void) => {
        await ruleFormRef.value.validate(async (valid, fields) => {
            if (valid) {
                try {
                    let res = await changeAdminList(formData.value)
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
