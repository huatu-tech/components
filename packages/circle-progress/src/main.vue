<template>
    <div :style="circleSize" :class="wrapClasses">
        <svg viewBox="0 0 100 100">
            <path :d="pathString" :stroke="trailColor" :stroke-width="trailWidth" :fill-opacity="0"/>
            <path :d="pathString" :stroke-linecap="strokeLinecap" :stroke="strokeColor" :stroke-width="strokeWidth" fill-opacity="0" :style="pathStyle"/>
        </svg>
        <div :class="innerClasses">
            <slot></slot>
        </div>
    </div>
</template>
<script>

function oneOf (value, validList) {
    for (let i = 0; i < validList.length; i++) {
        if (value === validList[i]) {
            return true
        }
    }
    return false
}

const prefixCls = 'ivu-chart-circle'

export default {
    name: 'CircleProgress',
    props: {
        /**
         * 进度百分比
         */
        percent: {
            type: Number,
            default: 0
        },
        /**
         * 图表的宽度和高度，单位 px
         */
        size: {
            type: Number,
            default: 120
        },
        /**
         * 进度环的线宽，单位 px
         */
        strokeWidth: {
            type: Number,
            default: 6
        },
        /**
         * 进度环的颜色
         */
        strokeColor: {
            type: String,
            default: '#2db7f5'
        },
        /**
         * 进度环顶端的形状，可选值为square（方）和round（圆）
         */
        strokeLinecap: {
            validator (value) {
                return oneOf(value, ['square', 'round'])
            },
            default: 'round'
        },
        /**
         * 进度环背景的线宽，单位 px
         */
        trailWidth: {
            type: Number,
            default: 5
        },
        /**
         * 进度环背景的颜色
         */
        trailColor: {
            type: String,
            default: '#eaeef2'
        }
    },
    computed: {
        circleSize () {
            return {
                width: `${this.size}px`,
                height: `${this.size}px`
            }
        },
        radius () {
            return 50 - this.strokeWidth / 2
        },
        pathString () {
            return `M 50,50 m 0,-${this.radius}
                a ${this.radius},${this.radius} 0 1 1 0,${2 * this.radius}
                a ${this.radius},${this.radius} 0 1 1 0,-${2 * this.radius}`
        },
        len () {
            return Math.PI * 2 * this.radius
        },
        pathStyle () {
            return {
                'stroke-dasharray': `${this.len}px ${this.len}px`,
                'stroke-dashoffset': `${((100 - this.percent) / 100 * this.len)}px`,
                'transition': 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease'
            }
        },
        wrapClasses () {
            return `${prefixCls}`
        },
        innerClasses () {
            return `${prefixCls}-inner`
        }
    }
}
</script>

<style lang="scss">
    .ivu-chart-circle{
        display: inline-block;
        position: relative;

        &-inner {
            width: 100%;
            text-align: center;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            line-height: 1;
        }
    }
</style>
