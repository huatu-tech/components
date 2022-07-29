<template>
    <div :class="classes" :style="styles" @click="back">
        <slot>
            <div :class="innerClasses">
                <img width="40" src="//htwuhan.oss-cn-beijing.aliyuncs.com/tool/backtopw.svg">
            </div>
        </slot>
    </div>
</template>
<script>
/**
 * @file 返回顶部
 */

import { scrollTop } from '../../../src/utils/assist.js'
import { on, off } from '../../../src/utils/dom'
const prefixCls = 'ivu-back-top'

export default {
    props: {
        height: {
            type: Number,
            default: 400
        },
        bottom: {
            type: Number,
            default: 30
        },
        right: {
            type: Number,
            default: 30
        },
        duration: {
            type: Number,
            default: 1000
        }
    },
    data() {
        return {
            backTop: false
        }
    },
    computed: {
        classes() {
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}-show`]: this.backTop
                }
            ]
        },
        styles() {
            return {
                bottom: `${this.bottom}px`,
                right: `${this.right}px`
            }
        },
        innerClasses() {
            return `${prefixCls}-inner`
        }
    },
    mounted() {
        on(window, 'scroll', this.handleScroll)
        on(window, 'resize', this.handleScroll)
    },
    beforeDestroy() {
        off(window, 'scroll', this.handleScroll)
        off(window, 'resize', this.handleScroll)
    },
    methods: {
        handleScroll() {
            this.backTop = window.pageYOffset >= this.height
        },
        back() {
            const sTop = document.documentElement.scrollTop || document.body.scrollTop
            scrollTop(window, sTop, 0, this.duration)
            this.$emit('on-click')
        }
    }
}
</script>

<style lang="scss">
    @import '../scss/components/backTop';
</style>

