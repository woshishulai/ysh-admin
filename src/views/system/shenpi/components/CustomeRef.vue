<template>
    <div>
        <el-drawer v-model="dialogVisible" :title="props.title" size="50%">
            <el-form ref="ruleFormRef" :model="props.query" label-width="120px">
                <el-form-item label="审批状态" prop="formData.status">
                    <el-checkbox @change="showCheck1" v-model="checked1">通过</el-checkbox>
                    <el-checkbox @change="showCheck2" v-model="checked2">驳回</el-checkbox>
                </el-form-item>
                <el-form-item label="驳回原因" v-if="checked2">
                    <el-input v-model="text" placeholder="驳回原因" />
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
    import { ElNotification } from 'element-plus'
    import { useSettingStore } from '@/store/modules/setting'
    import { changeShenList } from '@/api/shenpi/apis'
    const SettingStore = useSettingStore()
    const checked1 = ref(false)
    const checked2 = ref(false)
    const text = ref('')
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
    watch(
        () => props.query,
        (newQuery) => {
            if (newQuery.status == 2) {
                checked1.value = true
            } else if (newQuery.status == 3) {
                checked2.value = true
            }
        },
        {
            immediate: true,
        },
    )
    const showCheck1 = (item) => {
        checked1.value = item
        checked2.value = !item
    }
    const showCheck2 = (item) => {
        checked2.value = item
        checked1.value = !item
    }
    const ruleFormRef = ref<FormInstance>()
    const dialogVisible = ref()
    const handleClose = async () => {
        let query = {}
        query.id = props.query.id + ''
        query.userId = props.query.userId
        query.content = text.value
        if (checked1.value == false && checked2.value == false) {
            ElNotification({
                message: '审批状态未更改',
                type: 'error',
                duration: 3000,
            })
            return
        }
        if (checked1.value == true) {
            query.status = 2
        } else if (checked2.value == true) {
            query.status = 3
        }
        try {
            let res = await changeShenList(query)
            SettingStore.setReload()
        } catch (error) {
            console.log(error)
        }
        console.log(query)
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
