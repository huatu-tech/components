<template>
    <div class="empty" @click="childMethod">
        <img width="22" src="//htwuhan.oss-cn-beijing.aliyuncs.com/tool/cry.svg">&nbsp;{{text}}
    </div>
</template>

<script>
/**
 * @file table通用空页面
 */
export default {
    name: 'Empty',
    props: {
        text: {
            default: '暂无数据'
        },
        fatherMethod: {
            type: Function,
            default: null
        }
    },
    methods: {
        childMethod() {
          console.log(this.fatherMethod())
        }
    }
}
</script>
