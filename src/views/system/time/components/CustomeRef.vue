<template>
    <div>
        <el-drawer v-model="dialogVisible" title="新增店铺营业时间" size="50%">
            <el-form ref="ruleFormRef" :rules="rules" :model="formData" label-width="130px">
                <el-form-item label="选择工作日" prop="week">
                    <el-checkbox @change="updateCheck(1)" v-model="weekList.checked1">周一</el-checkbox>
                    <el-checkbox @change="updateCheck(2)" v-model="weekList.checked2">周二</el-checkbox>
                    <el-checkbox @change="updateCheck(3)" v-model="weekList.checked3">周三</el-checkbox>
                    <el-checkbox @change="updateCheck(4)" v-model="weekList.checked4">周四</el-checkbox>
                    <el-checkbox @change="updateCheck(5)" v-model="weekList.checked5">周五</el-checkbox>
                    <el-checkbox @change="updateCheck(6)" v-model="weekList.checked6">周六</el-checkbox>
                    <el-checkbox @change="updateCheck(7)" v-model="weekList.checked7">周日</el-checkbox>
                </el-form-item>
                <el-form-item label="选择工作日" prop="status">
                    <div class="week">
                        <el-checkbox @change="updateStatus(1)" v-model="statusList.checked1">营业</el-checkbox>
                        <el-checkbox @change="updateStatus(2)" v-model="statusList.checked2">休息</el-checkbox>
                    </div>
                </el-form-item>
                <el-form-item label="开始营业时间" prop="start_time">
                    <el-time-picker v-model="formData.start_time" placeholder="开始营业时间" />
                </el-form-item>
                <el-form-item label="结束营业时间" prop="end_time">
                    <el-time-picker v-model="formData.end_time" placeholder="结束营业时间" />
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
    import { useUserStore } from '@/store/modules/user'
    import { useSettingStore } from '@/store/modules/setting'
    import { changeTimeList } from '@/api/time/apis'
    import { useRoute } from 'vue-router'
    import { ElNotification } from 'element-plus'

    let props = defineProps({
        query: Object,
    })
    const weekLists = ref([])
    const rules = reactive({
        week: [{ required: true, message: '请选择营业时间', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        start_time: [{ required: true, message: '请选择开始营业时间', trigger: 'blur' }],
        end_time: [{ required: true, message: '请选择结束营业时间', trigger: 'blur' }],
    })
    const weekList = reactive({
        checked1: false,
        checked2: false,
        checked3: false,
        checked4: false,
        checked5: false,
        checked6: false,
        checked7: false,
    })
    const statusList = reactive({
        checked1: true,
        checked2: false,
    })
    const emits = defineEmits(['getList'])
    const updateStatus = (status) => {
        for (let i = 1; i <= 2; i++) {
            statusList[`checked${i}`] = i === status
            formData.value.status = status.toString()
        }
        console.log(formData.value)
    }

    const updateCheck = (index) => {
        const currentWeek = weekLists.value.slice()
        const exists = currentWeek.includes(index)
        if (exists) {
            const indexToRemove = currentWeek.indexOf(index)
            currentWeek.splice(indexToRemove, 1)
        } else {
            currentWeek.push(index)
        }
        weekLists.value = currentWeek
        for (let i = 1; i <= 7; i++) {
            weekList[`checked${i}`] = weekLists.value.includes(i)
        }
        formData.value.week = weekLists.value.join(',')
    }
    const route = useRoute()

    const SettingStore = useSettingStore()
    const ruleFormRef = ref<FormInstance>()
    const dialogVisible = ref()
    const UserStore = useUserStore()

    const formData = ref({
        userId: UserStore.userInfo.userId,
        shop_id: props.query.id + '' || UserStore.userInfo.shopId,
        week: '1',
        status: '1',
        start_time: '',
        end_time: '',
    })

    const handleClose = async () => {
        // 创建一个新的 Date 对象来处理开始时间
        var startDate = new Date(formData.value.start_time)
        // 创建一个新的 Date 对象来处理结束时间
        var endDate = new Date(formData.value.end_time)

        // 处理开始时间
        var startHours = startDate.getHours()
        var startMinutes = startDate.getMinutes()
        var startSeconds = startDate.getSeconds()
        startHours = startHours < 10 ? '0' + startHours : startHours
        startMinutes = startMinutes < 10 ? '0' + startMinutes : startMinutes
        startSeconds = startSeconds < 10 ? '0' + startSeconds : startSeconds
        var formattedStartTime = startHours + ':' + startMinutes + ':' + startSeconds
        var endHours = endDate.getHours()
        var endMinutes = endDate.getMinutes()
        var endSeconds = endDate.getSeconds()
        endHours = endHours < 10 ? '0' + endHours : endHours
        endMinutes = endMinutes < 10 ? '0' + endMinutes : endMinutes
        endSeconds = endSeconds < 10 ? '0' + endSeconds : endSeconds
        var formattedEndTime = endHours + ':' + endMinutes + ':' + endSeconds

        // 将格式化后的时间字符串赋值给 formData 对象中的相应字段
        formData.start_time = formattedStartTime
        formData.end_time = formattedEndTime
        let params = {
            userId: formData.value.userId + '',
            week: formData.value.week,
            status: formData.value.status,
            shop_id: props.query.shop_id + '',
            start_time: formData.start_time,
            end_time: formData.end_time,
        }
        await ruleFormRef.value.validate(async (valid, fields) => {
            if (valid) {
                try {
                    let res = await changeTimeList(params)
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
                            emits('getList')
                            dialogVisible.value = false
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
