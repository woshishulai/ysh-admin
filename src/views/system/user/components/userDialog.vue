<template>
    <el-dialog v-model="dialogVisible" :title="props.query.title" width="50%">
        <el-form ref="ruleFormRef" :model="formData" label-width="100px">
            <el-form-item label="用户昵称" prop="nickname">
                <el-input v-model="formData.nickname" placeholder="请输入昵称" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleClose()">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script lang="ts" setup>
    import { ElMessageBox, ElMessage, FormInstance } from 'element-plus'
    import { reactive, ref, watch } from 'vue'
    import { changeUserName } from '@/api/user'
    const formData = ref(null)
    const props = defineProps({
        query: {
            type: Object,
            default: {},
        },
    })
    watch(
        () => props.query,
        (newQuery) => {
            // 当 props.query 发生变化时，更新 formData 的值
            formData.value = newQuery
        },
        {
            immediate: true,
        },
    )
    const ruleFormRef = ref<FormInstance>()
    const dialogVisible = ref<boolean>(false)

    const show = (item = {}) => {
        dialogVisible.value = true
    }

    const handleClose = async (done: () => void) => {
        try {
            let res = await changeUserName(formData.value)
            setTimeout(() => {
                location.reload()
            }, 500)
        } catch (error) {
            console.log(error)
        }
    }

    defineExpose({
        show,
    })
</script>
<style lang="scss" scoped></style>
