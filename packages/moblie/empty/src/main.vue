<template>
    <div class="no-data">
        <img class="img" :src="src" />
            <p class="text">{{label}}</p>
            <div
                v-if="tel"
                class="button"
                @click="makeCall">
                请联系{{tel}}
            </div>
            <slot name="content"></slot>
    </div>
</template>

<script>
/**
 * props:
 *      tel: 需要拨打的电话，会添加一个电话按键
 *      label: 文案展示
 *      src: 图片地址，建议给https
 * slot:
 *      content: 接收自定义内容
 */

import call from '../../../../src/functions/call.js'

export default {
    name: 'MEmpty',
    props: {
        tel: {
            default: '',
            type: String
        },
        label: {
            default: '暂未找到相匹配的信息，请联系实施老师核对您的权限信息！',
            type: String
        },
        src: {
            default: 'https://htwuhan.oss-cn-beijing.aliyuncs.com/tool/shizhi-m-teacher_warning.png',
            type: String
        }
    },
    methods: {
        makeCall() {
            call(this.tel)
        }
    }
}
</script>


<style lang="scss" scoped>
.no-data {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    .img {
        margin-top: 30%;
        width: 40%;
    }
    .text {
        font-size: 14px;
        line-height: 22px;
        padding: 20px 67px;
        color: #999;
    }
    .button {
        height: 40px;
        width: 60%;
        border-radius: 4px;
        background-color: #4A88FB;
        font-size: 16px;
        color: #fff;
        line-height: 40px;
        margin-left: 20%;
        &:active {
            background-color: darken($color: #4A88FB, $amount: 20) ;
        }
    }
}
</style>
