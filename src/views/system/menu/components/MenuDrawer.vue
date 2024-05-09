<template>
    <div>
        <el-drawer v-model="dialogVisible" :title="props.title" size="50%">
            <el-form ref="ruleFormRef" :rules="rules" :model="formData" label-width="120px">
                <el-form-item label="菜单名称" prop="menuname">
                    <el-input v-model="formData.menuname" placeholder="请输入菜单名称" />
                </el-form-item>
                <el-form-item label="路由地址" v-if="formData.id" prop="WebUrl">
                    <el-input v-model="formData.WebUrl" placeholder="请输入路由地址" />
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input type="number" v-model="formData.sort" placeholder="数字越小越靠前" />
                </el-form-item>
                <!-- <el-form-item label="图标" :prop="formData.icoUrl">
                    <el-input v-model="formData.icoUrl" placeholder="请输入图标地址" />
                </el-form-item>
                <el-form-item label="图标样式" :prop="formData.icoClass">
                    <el-input v-model="formData.icoClass" placeholder="请输入图标样式" />
                </el-form-item> -->
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="formData.remark" placeholder="请输入备注" />
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
    import { reactive, ref, watch } from 'vue'
    import { FormInstance } from 'element-plus'
    import { changeCaiDdan } from '@/api/caidan/apis'
    import { useSettingStore } from '@/store/modules/setting'
    const SettingStore = useSettingStore()
    const rules = reactive({
        menuname: [{ required: true, message: '菜单名称不可为空', trigger: 'blur' }],
        WebUrl: [{ required: true, message: '路由地址不可为空', trigger: 'blur' }],
        // sort: [{ required: true, message: '排序不可为空', trigger: 'blur' }],
        // remark: [{ required: true, message: '备注不可为空', trigger: 'blur' }],
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
            console.log(props.query)

            // 当 props.query 发生变化时，更新 formData 的值
            formData.value = newQuery
        },
        {
            immediate: true,
        },
    )
    const ruleFormRef = ref<FormInstance>()
    const dialogVisible = ref()
    const handleClose = async () => {
        await ruleFormRef.value.validate(async (valid, fields) => {
            if (valid) {
                try {
                    let res = changeCaiDdan(formData.value)
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
</style>
