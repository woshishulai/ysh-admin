<template>
    <div class="cen-wrap">
        <div class="top-infos">
            <img :src="'https://api.ustudygroup.com/' + props.formData.head_photo" class="shop-img" alt="" />
            <div class="right-detai">
                <div class="title-info">
                    <div class="top">
                        <div class="shop-name">{{ props.formData.shop_name }}</div>
                        <div class="shops" v-if="isShopOpen(props.formData.workingHours)">
                            <img src="../../../../assets/image/icon/green.png" alt="" />
                            营业中
                        </div>
                        <div class="shops" v-else>
                            <img src="../../../../assets/image/icon/green.png" alt="" />
                            休息中</div
                        >
                    </div>
                    <div class="rate">
                        <template v-for="i in 5">
                            <img v-if="i <= num" src="../../../../assets/image/icon/xing1.png" alt="" />
                            <img v-else-if="i - 0.5 === num" src="../../../../assets/image/bange.png" alt="" />
                            <img v-else src="../../../../assets/image/icon/xing2.png" alt="" />
                        </template>
                        <span>{{ Math.floor(num) }}</span>
                    </div>

                    <div class="title-footer">
                        <span>
                            <img style="width: 12px; height: 12px" src="../../../../assets/image/icon/peng.png" alt="" /> 粉丝数
                            {{ props.formData.collectCount }}</span
                        >
                        <span>
                            <img style="width: 12px; height: 12px" src="../../../../assets/image/icon/shu1.png" alt="" />销量
                            {{ props.formData.orderCount }}</span
                        >
                        <div class="change"
                            ><img style="width: 12px; height: 12px" src="../../../../assets/image/icon/关注.png" alt="" />关注</div
                        >
                        <div class="change"
                            ><img style="width: 12px; height: 12px" src="../../../../assets/image/icon/分享.png" alt="" />分享</div
                        >
                    </div>
                </div>
            </div>
        </div>
        <div class="con-details">
            <div class="jieshao" ref="biao" :class="{ active: showDetail }" v-html="props.formData.details"></div>
            <div class="info-item active"
                ><img style="width: 14px; height: 14px" src="../../../../assets/image/icon/时间(2).png" alt="" /> 09:30-17:30
            </div>
            <div class="info-item"
                ><img style="width: 14px; height: 14px" src="../../../../assets/image/icon/定位(1).png" alt="" />
                {{ props.formData.country }} {{ props.formData.province }} {{ props.formData.city }} {{ props.formData.street }}
            </div>
            <div v-if="props.formData.details">
                <p class="show-info" v-if="showDetail" @click="showDetails"
                    ><img style="width: 14px" src="../../../../assets/image/icon/向下箭头.png" alt="" />查看详细</p
                >
                <p class="show-info" v-if="!showDetail" @click="showDetails">收起</p>
            </div>
        </div>
        <div class="change-some">
            <div class="top-cate">
                <span class="nav" @click="changeActive(0)" :class="active == 0 ? 'active' : ''">成功案例</span>
                <span class="nav" @click="changeActive(9999999999)" :class="active == '9999999999' ? 'active' : ''">主推服务</span>
                <span
                    class="nav"
                    :class="active == item.id ? 'active' : ''"
                    @click="changeActive(item.id)"
                    v-for="(item, index) in fuWuList"
                    :key="item.id"
                    >{{ item.name }}</span
                >
            </div>
            <div class="count" v-if="active != 0">
                <div class="goods-item" v-for="item in list" :key="item.id">
                    <img :src="'https://api.ustudygroup.com/' + item.banner" alt="" />
                    <div class="right-detailss">
                        <div class="titles">{{ item.name }}</div>
                        <div class="rate">
                            <template v-for="i in 5">
                                <img
                                    v-if="i <= item.score"
                                    style="width: 10px; height: 10px"
                                    src="../../../../assets/image/icon/xing1.png"
                                    alt=""
                                />
                                <img
                                    style="width: 10px; height: 10px"
                                    v-else-if="i - 0.5 == item.score"
                                    src="../../../../assets/image/bange.png"
                                    alt=""
                                />
                                <img style="width: 10px; height: 10px" v-else src="../../../../assets/image/icon/xing2.png" alt="" />
                            </template>
                            <span style="color: #ff4e00">{{ item.score }}</span>
                        </div>
                        <div class="price yi" v-if="item.price_type == 1"
                            ><span class="fu">￥</span><span class="spans">{{ item.price }}</span></div
                        >
                        <div class="price zhe" v-if="item.price_type == 2"
                            ><span class="fu">￥{{ item.old_price }}</span> ￥<span class="spanss"> {{ item.price_cost }}</span
                            >起</div
                        >
                        <div class="price qu" v-if="item.price_type == 3"
                            ><span class="fu">￥</span><span class="spansss">{{ item.arr1[0] }}</span>
                            ~
                            <span class="spansss">{{ item.arr1[1] }}</span></div
                        >
                        <div class="biao">
                            <span v-for="i in item.arr"> {{ i }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="anli" v-if="active == 0">
                <div class="an-item" v-for="(item, index) in tableData" :key="item.id">
                    <p class="title-one">{{ item.title }}</p>
                    <p class="textss" v-html="item.describe"></p>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { getFuList } from '@/api/fu/apis'
    import { getAnList } from '@/api/anli/apis'
    import { getFuList as news } from '@/api/fuwu/apis'

    import { ref, watch, nextTick, reactive, onMounted, defineProps } from 'vue'
    const props = defineProps({
        formData: {
            type: Object,
            default: {},
        },
    })
    const fuWuList = ref([])
    const num = ref(0)
    const tableData = ref({})

    const userCate = ref(null)
    const biao = ref<HTMLElement | null>(null)
    // 计算属性，根据高度决定是否显示详细信息
    const showDetail = ref(false)
    const active = ref(9999999999)
    const list = ref([])
    const getFuLists = () => {
        let query = {
            page: 1,
            pageSize: 1000,
        }
        setTimeout(async () => {
            let res = await news(query)
            fuWuList.value = res.data.list
            let arr = userCate.value.map((item) => {
                return item.type_id
            })
            let arr1 = fuWuList.value.filter((item) => {
                return arr.includes(item.id)
            })
            fuWuList.value = arr1
        }, 100)
    }
    const isShopOpen = (workingHours) => {
        if (!workingHours || workingHours.length < 1) {
            return false
        }
        // 获取当前时间的星期几
        let currentDay = new Date().getDay() // 0表示星期日，1表示星期一，以此类推
        if (currentDay === 0) {
            currentDay = 7
        }
        // 获取当前时间的小时和分钟
        const now = new Date()
        const currentHours = now.getHours().toString().padStart(2, '0') // 获取当前小时数并补零
        const currentMinutes = now.getMinutes().toString().padStart(2, '0') // 获取当前分钟数并补零
        const currentSeconds = now.getSeconds().toString().padStart(2, '0') // 获取当前秒数并补零

        const currentTime = `${currentHours}:${currentMinutes}:${currentSeconds}`
        console.log(currentDay, currentTime)
        // 找到今天的营业时间
        const todayWorkingHour = workingHours.find((wh) => wh.week === currentDay)
        // 如果今天没有设置营业时间，则返回 false，表示店铺休息
        if (!todayWorkingHour) return false

        // 如果当前时间在开始时间和结束时间之间，则表示营业中
        return currentTime >= todayWorkingHour.start_time && currentTime <= todayWorkingHour.end_time
    }
    const getAnLists = async (id) => {
        let query = {
            shop_id: id,
        }
        try {
            let res = await getAnList(query)
            tableData.value = res.data.list
            // console.log(tableData.value, '测试')
        } catch (error) {
            console.log(error)
        }
    }
    // 监听内容变化，更新高度
    watch(
        () => props.formData.score,
        () => {
            // checkHeight()
            num.value = Number(props.formData.score)
        },
    )
    watch(
        () => props.formData.id,
        () => {
            getFuwuList(props.formData.id)
            getAnLists(props.formData.id)
            getFuLists()
        },
    )
    // 检查高度
    const checkHeight = () => {
        if (biao.value) {
            const jieshaoDiv = biao.value
            nextTick(() => {
                if (jieshaoDiv.offsetHeight > 38) {
                    showDetail.value = true
                } else {
                    showDetail.value = false
                }
            })
        }
    }
    const changeActive = (id) => {
        active.value = id
        if (id != 9999999999 && id != 0) {
            //筛选类型
            list.value = userCate.value.filter((item) => {
                return item.type_id == id
            })
        } else if (id == 9999999999) {
            //是不是主推
            list.value = userCate.value.filter((item) => {
                return item.is_main == 1
            })
        }
    }
    const getFuwuList = async (id) => {
        let query = {
            shopId: id,
        }
        try {
            let res = await getFuList(query)
            userCate.value = res.data.list
            userCate.value.forEach((item) => {
                item.arr = item.label_name.split(',')
                item.arr1 = item.price_range.split(',')
            })
            changeActive(active.value)
        } catch (error) {
            console.log(error)
        }
    }
    // 页面加载后检查高度
    onMounted(() => {
        checkHeight()
    })
    const showDetails = () => {
        showDetail.value = !showDetail.value
    }
</script>
<style lang="scss" scoped>
    .el-drawer__header > :first-child {
        font-size: 20px;
    }
    .cen-wrap {
        font-family: MicrosoftYaHei;
        width: 375px;
        .top-infos {
            display: flex;
            background-color: #fff;
            padding: 21px 11px;
            .shop-img {
                width: 62px;
                height: 62px;
                border-radius: 5px;
                margin-right: 9px;
            }
            .title-info {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 100%;
                .top {
                    display: flex;
                    align-items: center;
                    .shop-name {
                        color: #5c5c5c;
                        font-size: 17px;
                        margin-right: 10px;
                        max-width: 195px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .shops {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 3px;
                        width: 55px;
                        height: 18px;
                        font-size: 10px;
                        border-radius: 5px;
                        background-color: #f1f1f1;
                        i {
                            font-size: 11px;
                        }
                    }
                }
                .rate {
                    display: flex;
                    align-items: center;
                    gap: 1px;
                    color: #5c5c5c;
                    img {
                        width: 10px;
                        height: 10px;
                    }
                    font-size: 12px;
                    span {
                        margin-left: 4px;
                    }
                }
                .title-footer {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 12px;
                    color: rgba(92, 92, 92, 1);
                    img {
                        width: 12px;
                        height: 12px;
                    }
                    .change {
                        width: 55px;
                        height: 20px;
                        background: #ff4e00;
                        border-radius: 7px;
                        display: flex;
                        align-items: center;
                        gap: 2px;
                        justify-content: center;
                        color: #fff;
                        cursor: pointer;
                    }
                }
            }
        }
        .con-details {
            margin-top: 5px;
            padding: 15px 11px 11px;
            background-color: #fff;
            .jieshao {
                width: 100%;
                &.active {
                    height: 40px;
                    overflow: hidden;
                }
                :deep(p) {
                    margin-bottom: 0;
                    margin-top: 6px;
                    color: rgba(92, 92, 92, 1);
                    background-color: #fff;
                    &:nth-child(1) {
                        margin-top: 0;
                    }
                    span {
                        font-size: 13px !important;
                    }
                    img {
                        max-width: 100%;
                    }
                }
            }
            .info-item {
                display: flex;
                align-items: center;
                gap: 3px;
                font-size: 10px;
                color: rgba(89, 89, 89, 1);
                &.active {
                    margin: 6px 0 3px;
                }
            }
            .show-info {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 2px;
                margin: 0;
                font-size: 12px;
                color: rgba(255, 78, 0, 1);
                cursor: pointer;
                margin-top: 5px;
            }
        }
        .change-some {
            .top-cate {
                padding: 13px 11px;
                display: flex;
                align-items: center;
                background-color: #fff;
                margin-top: 5px;
                gap: 15px;
                overflow-x: auto; /* 使用 auto 允许内容溢出时显示滚动条 */
            }
            /* 隐藏滚动条 */
            .top-cate::-webkit-scrollbar {
                width: 0;
                height: 0;
            }
            /* 鼠标悬停时显示滚动条 */
            .top-cate:hover::-webkit-scrollbar {
                width: 10px;
                height: 10px;
            }
            .top-cate:hover::-webkit-scrollbar-thumb {
                background-color: rgba(0, 0, 0, 0.3);
                border-radius: 5px;
            }
            .nav {
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                min-width: 66px;
                padding-bottom: 8px;
                text-align: center;
                border-bottom: 3px solid transparent;
                color: rgba(19, 19, 19, 1);
                &.active {
                    border-color: #ff4e00;
                }
            }
            .count {
                padding: 11px;
                .goods-item {
                    margin-bottom: 10px;
                    display: flex;
                    gap: 12px;
                    padding: 10px 5px;
                    background-color: rgba(248, 248, 248, 1);
                    border-radius: 5px;
                    img {
                        width: 136px;
                        height: 103px;
                        border-radius: 5px;
                    }
                    .right-detailss {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        padding-right: 4px;
                        .titles {
                            max-width: 186px;
                            display: -webkit-box;
                            line-height: 1.1;
                            overflow: hidden;
                            -webkit-line-clamp: 2;
                            text-overflow: ellipsis;
                            word-break: break-all;
                            -webkit-box-orient: vertical;
                            font-size: 14px;
                            color: #444;
                        }
                        .rote {
                            display: flex;
                            align-items: center;
                            img {
                                width: 12px;
                                height: 12px;
                            }
                            span {
                                margin-left: 4px;
                            }
                        }
                        .price {
                            display: flex;
                            align-items: flex-end;
                        }
                        .yi {
                            color: rgba(249, 71, 48, 1);
                            .fu {
                                font-size: 12px;
                                line-height: 1;
                            }
                            .spans {
                                font-size: 18px;
                                margin-left: -3px;
                                line-height: 1;
                            }
                        }
                        .zhe {
                            display: flex;
                            align-items: flex-end;
                            font-size: 12px;
                            color: #ff4e00;
                            .fu {
                                font-size: 12px;
                                line-height: 1;
                                margin-bottom: 2px;
                                text-decoration: line-through;
                                color: rgba(155, 155, 155, 1);
                                margin-right: 3px;
                            }
                            .spanss {
                                font-size: 18px;
                                margin-right: 2px;
                                line-height: 1;
                                margin-left: -3px;
                            }
                        }
                        .qu {
                            color: rgba(249, 71, 48, 1);
                            line-height: 1;
                            font-size: 18px;
                            .fu {
                                font-size: 12px;
                                margin-right: -3px;
                                margin-bottom: 2px;
                            }
                        }
                        .biao {
                            display: flex;
                            flex-wrap: wrap;
                            gap: 2px;
                            span {
                                display: block;
                                padding: 1px 3px;
                                border-radius: 4px 4px;
                                border: 1px solid #989898;
                                margin-right: 3px;
                                font-size: 10px;
                                color: rgba(152, 152, 152, 1);
                            }
                        }
                    }
                }
            }
            .anli {
                padding: 0 11px;
                p {
                    margin: 0;
                }
                .an-item {
                    // padding: 12px 0;
                    border-bottom: 1px dashed #cacaca;
                    .title-one {
                        font-size: 15px;
                        color: #000;
                        padding: 12px 0;
                    }
                    .textss {
                        :deep(p) {
                            margin: 0;
                            // margin: 12px 0 0;
                            font-size: 13px;
                            // img {
                            //     width: 100%;
                            // }
                        }
                    }
                }
            }
        }
    }
</style>
