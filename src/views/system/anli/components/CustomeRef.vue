<template>
    <div>
        <el-drawer v-model="dialogVisible" title="新增店铺案例" size="50%">
            <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="130px">
                <el-form-item label="案例标题" prop="title">
                    <el-input v-model="formData.title" style="width: 400px" placeholder="请输入店铺案例标题" />
                </el-form-item>
                <el-form-item label="排序" prop="sort_num">
                    <el-input v-model="formData.sort_num" style="width: 400px" placeholder="请输入案例排序" />
                </el-form-item>
                <el-form-item label="描述" prop="describe">
                    <wang-edior v-model="formData.describe" />
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
    import { ElMessage } from 'element-plus'
    import { reactive, ref, watch, onMounted } from 'vue'
    import { FormInstance } from 'element-plus'
    import { useUserStore } from '@/store/modules/user'
    import { useSettingStore } from '@/store/modules/setting'
    import WangEdior from '@/components/WangEdior/index.vue'
    import { addAnListInfo } from '@/api/anli/apis'
    import { useRoute } from 'vue-router'
    import { ElNotification } from 'element-plus'

    const route = useRoute()
    const SettingStore = useSettingStore()
    const ruleFormRef = ref<FormInstance>()
    const dialogVisible = ref()
    const UserStore = useUserStore()
    const img = ref('')
    const props = defineProps({
        query: {
            type: Object,
            default: {},
        },
    })
    const rules = reactive({
        title: [{ required: true, message: '请输入案例标题', trigger: 'blur' }],
    })
    const formData = ref({
        userId: UserStore.userInfo.userId,
        shop_id: props.query.id + '' || UserStore.userInfo.shopId,
    })
    watch(
        () => props.query.id,
        async (newQuery) => {
            formData.value.shop_id = props.query.shop_id
            console.log(formData.value)
        },
        {
            immediate: true,
            deep: true,
        },
    )

    const handleClose = async () => {
        await ruleFormRef.value.validate(async (valid, fields) => {
            // 使用正则表达式替换样式属性
            formData.value.describe = formData.value.describe.replace(/<img(.*?)>/g, function (match, p1) {
                if (p1.includes('style')) {
                    // 如果已经存在 style 属性，则在里面补充样式
                    return '<img' + p1.replace(/style="([^"]*)"/, 'style="$1 max-width: 100%;"') + '>'
                } else {
                    // 如果不存在 style 属性，则添加一个新的 style 属性
                    return '<img' + p1 + ' style="max-width: 100%;">'
                }
            })
            if (valid) {
                try {
                    let res = await addAnListInfo(formData.value)
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
                            duration: 800,
                        })
                        setTimeout(() => {
                            SettingStore.setReload()
                        }, 800)
                    }
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
