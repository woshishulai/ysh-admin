<template>
    <div class="details">
        <div
            class="banner"
            :style="{ background: 'url(' + 'https://api.ustudygroup.com/' + props.details.banner + ')', backgroundSize: '100% 100%' }"
        >
            <div class="title">
                <span class="active">简介</span>
                <span>详情</span>
                <span>评论</span>
            </div>
            <div class="fen">
                <div class="text">
                    <p>{{ props.details.name }}</p>
                    <div class="price">
                        <div class="price yi" v-if="props.details.price_type == 1"
                            ><span class="fu">￥</span><span class="spans">{{ props.details.price }}</span></div
                        >

                        <div class="price zhe" v-if="props.details.price_type == 2"
                            ><span class="fu">￥{{ props.details.old_price }}</span> ￥<span class="spanss">
                                {{ props.details.price_cost }}</span
                            >起</div
                        >
                        <div class="price qu" v-if="props.details.price_type == 3"
                            ><span class="fu">￥</span><span class="spansss">{{ props.details.qujian1 }}</span>
                            ~
                            <span class="spansss">{{ props.details.qujian2 }}</span></div
                        >
                    </div>
                </div>
                <img src="../../../../assets/image/icon/分享(4).png" alt="" />
            </div>
        </div>
        <div class="biaos">
            <div class="rate">
                <template v-if="props.details.score > 0">
                    <template v-for="i in props.details.score">
                        <img src="../../../../assets/image/icon/xing1.png" alt="" />
                    </template>
                    <template v-for="i in 5 - props.details.score">
                        <img src="../../../../assets/image/icon/xing2.png" alt="" />
                    </template>
                </template>
                <template v-else>
                    <template v-for="i in 5">
                        <img src="../../../../assets/image/icon/xing2.png" alt="" />
                    </template>
                </template>
                <span>{{ props.details.score }}</span>
            </div>
            <div class="biao">
                <span v-if="props.details.new" v-for="i in props.details?.new"> {{ i }}</span>
            </div>
        </div>
        <div class="jian">
            <div class="top"> <div class="shu"> </div><div class="ming"> 服务简介 </div></div>
            <p v-html="props.details.describe"></p>
        </div>
        <div class="jian">
            <div class="top"> <div class="shu"> </div><div class="ming"> 服务详情 </div> </div>
            <p v-html="props.details.details"></p>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { ElMessage } from 'element-plus'
    import { reactive, ref, watch, onMounted } from 'vue'
    const qujian1 = ref('')
    const qujian2 = ref('')
    const props = defineProps({
        details: {
            type: String,
            default: '',
        },
    })
    watch(
        () => props.details,
        () => {
            // console.log(props.details)

            if (props.details.price_type == 3) {
                qujian1.value = props.details.price_range.split(',')[0]
                qujian2.value = props.details.price_range.split(',')[1]
            }
        },
        { immediate: true, deep: true },
    )
</script>
<style lang="scss" scoped>
    .el-drawer__header > :first-child {
        font-size: 20px;
    }
    .details {
        margin: 0 auto;
        width: 375px;
        .banner {
            position: relative;
            height: 236px;
            .title {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                display: flex;
                justify-content: space-around;
                align-items: center;
                background-color: rgba(219, 232, 245, 0.8);

                height: 43px;
                span {
                    font-weight: 600;
                    font-size: 14px;
                    padding-bottom: 5px;
                    border-bottom: 3px solid transparent;
                    cursor: pointer;
                    &:hover,
                    &.active {
                        border-color: rgba(249, 71, 48, 1);
                        color: rgba(249, 71, 48, 1);
                    }
                }
            }
            .fen {
                position: absolute;
                bottom: -92px;
                left: 0;
                display: flex;
                align-items: center;
                padding: 17px 23px 34px;
                width: 100%;
                box-sizing: border-box;
                justify-content: space-between;
                height: 106px;
                background-color: rgba(249, 71, 48, 1);
                border-radius: 10px 10px 0 0;
                font-size: 15px;
                z-index: 0;
                color: #fff;
                p {
                    margin: 0;
                }
                img {
                    width: 23px;
                    height: 23px;
                    cursor: pointer;
                }
            }
        }
        .price {
            font-size: 18px;
            margin-top: 9px;
        }
        .prices {
            display: flex;
            align-items: flex-end;
        }
        .yi {
            color: #fff;
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
            color: #fff;
            .fu {
                font-size: 12px;
                line-height: 1;
                margin-bottom: 2px;
                text-decoration: line-through;
                color: #fff;
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
            color: #fff;
            line-height: 1;
            font-size: 18px;
            .fu {
                font-size: 12px;
                margin-right: -3px;
                margin-bottom: 2px;
            }
        }
        .biaos {
            min-height: 70px;
            width: 100%;
            display: flex;
            position: relative;
            z-index: 0;
            flex-direction: column;
            gap: 10px;
            justify-content: space-around;
            padding: 13px 23px 16px;
            box-sizing: border-box;
            background-color: #fff;
            border-radius: 10px 10px 0 0;
            margin-top: 80px;
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
            .biao {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                span {
                    display: block;
                    // padding: 1px 3px;
                    padding: 3px 10px;
                    line-height: 1;
                    border-radius: 4px 4px;
                    font-size: 11px;
                    border: 1px solid #989898;
                    // margin-right: 8px;
                    color: rgba(152, 152, 152, 1);
                }
            }
        }
        .jian {
            margin-top: 12px;
            padding: 20px 20px 50px;
            // height: 300px;
            background-color: #fff;
            :deep(p) {
                margin: 0;
                img {
                    max-width: 100%;
                    margin-bottom: 18px;
                }
                span {
                    color: rgba(37, 37, 37, 1) !important;
                    font-size: 13px !important;
                    line-height: 24px;
                }
            }
        }

        .top {
            display: flex;
            align-items: center;
            margin-bottom: 18px;
            .shu {
                width: 5px;
                height: 14px;
                margin-right: 11px;
                border-radius: 2.5px;
                background-color: rgba(249, 71, 48, 1);
            }
            .ming {
                font-size: 15px;
                color: rgba(37, 37, 37, 1);
            }
        }
    }
</style>
