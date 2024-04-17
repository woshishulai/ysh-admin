<template>
    <div>
        <el-drawer v-model="dialogVisible" title="编辑店铺营业时间" size="50%">
            <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="130px">
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
                    <el-time-picker v-model="formData.start_time" :placeholder="startTime" />
                </el-form-item>
                <el-form-item label="结束营业时间" prop="end_time">
                    <el-time-picker v-model="formData.end_time" :placeholder="endTime" />
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

    const SettingStore = useSettingStore()
    const ruleFormRef = ref<FormInstance>()
    const dialogVisible = ref()
    const UserStore = useUserStore()
    const formData = ref({})
    const startTime = ref('xxxx')
    const endTime = ref('xxx')
    const props = defineProps({
        query: {
            type: Object,
            default: {},
        },
    })
    const weekList = reactive({
        checked1: true,
        checked2: false,
        checked3: false,
        checked4: false,
        checked5: false,
        checked6: false,
        checked7: false,
    })

    const rules = reactive({})
    const statusList = reactive({
        checked1: true,
        checked2: false,
    })
    const params = reactive({})
    watch(
        () => props.query,
        (newQuery) => {
            for (let i = 1; i <= 7; i++) {
                weekList['checked' + i] = newQuery.week === i
            }

            for (let key in statusList) {
                statusList[key] = newQuery.status === parseInt(key.substr(-1))
            }
            startTime.value = newQuery.start_time
            endTime.value = newQuery.end_time
            params.start_time = newQuery.start_time
            params.end_time = newQuery.end_time
            params.week = newQuery.week
            params.status = newQuery.status
            params.userId = newQuery.userId
            params.shop_id = newQuery.shop_id
            params.id = newQuery.id
            console.log(params)
        },
        {
            immediate: true,
            deep: true,
        },
    )
    const updateStatus = (status) => {
        for (let i = 1; i <= 2; i++) {
            statusList[`checked${i}`] = i === status
            params.status = status.toString()
        }
        console.log(params)
    }

    const updateCheck = (index) => {
        for (let i = 1; i <= 7; i++) {
            weekList[`checked${i}`] = i === index
            params.week = index.toString()
        }
        console.log(params)
    }
    const handleClose = async () => {
        if (formData.value.start_time !== undefined) {
            var startDate = new Date(formData.value.start_time)
            var startHours = startDate.getHours()
            var startMinutes = startDate.getMinutes()
            var startSeconds = startDate.getSeconds()
            startHours = startHours < 10 ? '0' + startHours : startHours
            startMinutes = startMinutes < 10 ? '0' + startMinutes : startMinutes
            startSeconds = startSeconds < 10 ? '0' + startSeconds : startSeconds
            var formattedStartTime = startHours + ':' + startMinutes + ':' + startSeconds
            params.start_time = formattedStartTime
        }
        if (formData.value.end_time !== undefined) {
            var endDate = new Date(formData.value.end_time)
            var endHours = endDate.getHours()
            var endMinutes = endDate.getMinutes()
            var endSeconds = endDate.getSeconds()
            endHours = endHours < 10 ? '0' + endHours : endHours
            endMinutes = endMinutes < 10 ? '0' + endMinutes : endMinutes
            endSeconds = endSeconds < 10 ? '0' + endSeconds : endSeconds
            var formattedEndTime = endHours + ':' + endMinutes + ':' + endSeconds
            params.end_time = formattedEndTime
        }
        formData.value = params

        await ruleFormRef.value.validate(async (valid, fields) => {
            if (valid) {
                try {
                    let res = await changeTimeList(params)
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
