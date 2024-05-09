<template>
    <el-drawer v-model="dialogVisible" :title="props.title" size="50%">
        <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="100px">
            <el-form-item label="名称" prop="name">
                <el-input v-model="formData.name" style="width: 400px" placeholder="请输入昵称" />
            </el-form-item>
            <el-form-item label="类型名称" prop="labelcat">
                <el-select v-model="formData.labelcat" @change="changeId" filterable placeholder="请选择">
                    <el-option v-for="item in selects" :key="item.type_name" :label="item.type_name" :value="item.id" />
                </el-select>
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
    import { reactive, ref, onMounted, watch } from 'vue'
    import { useSettingStore } from '@/store/modules/setting'
    const SettingStore = useSettingStore()
    import { getBiaoList } from '@/api/fenlei/apis'

    import { ElNotification } from 'element-plus'
    import { changeBiaoList } from '@/api/biaoqian/apis'
    const formData = ref(null)
    const imageUrl = ref('')
    const checked1 = ref(false)
    const selects = ref([])
    onMounted(async () => {
        getList()
    })
    const emits = defineEmits(['getLists'])
    const changeId = (itme) => {
        formData.value.labelcat = itme
    }
    const getList = async () => {
        console.log('调用了')
        try {
            let res = await getBiaoList()

            selects.value = res.data.list
        } catch (error) {}
    }
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
        labelcat: [{ required: true, message: '类型分类名称不可为空', trigger: 'blur' }],
    })
    watch(
        () => props.query,
        (newQuery) => {
            if (!props.query.id) {
                formData.value = {}
                // const list = selects.value
                // selects.value = []
                // selects.value = list
                formData.value.labelcat = ''
                console.log(formData.value)
            }
            // 当 props.query 发生变化时，更新 formData 的值
            formData.value = newQuery
            if (formData.value.status) {
                if (formData.value.status == 1) {
                    checked1.value = false
                } else {
                    checked1.value = true
                }
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
                    let res = await changeBiaoList(formData.value)
                    if (res.code != 1) {
                        ElNotification({
                            message: res.msg,
                            type: 'error',
                            duration: 3000,
                        })
                    } else {
                        ElNotification({
                            message: res.msg,
                            type: 'success',
                            duration: 3000,
                        })
                        formData.value.labelcat = ''

                        dialogVisible.value = false
                        emits('getLists')
                        // SettingStore.setReload()
                    }
                    // if(res.code==1)
                    // SettingStore.setReload()
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
