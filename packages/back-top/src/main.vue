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
    name: 'BackTop',
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
    .ivu-affix,.ivu-back-top {
    position: fixed;
    z-index: 10
}

.ivu-back-top {
    cursor: pointer;
    display: none
}

.ivu-back-top.ivu-back-top-show {
    display: block
}

.ivu-back-top-inner {
    background-color: rgba(0,0,0,.6);
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0,0,0,.2);
    transition: all .2s ease-in-out;
    padding: 5px;
}

.ivu-back-top-inner:hover {
    background-color: rgba(0,0,0,.7)
}

.ivu-back-top .svg-icon {
    color: #fff;
    font-size: 24px;
    margin: 8px 12px
}

</style>

