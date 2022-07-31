<template>
    <li v-if="node">
        <section class="item node"
            :style="{'marginLeft': level * 28 + 'px'}"
            :class="{active: node.$active, expanded:node.$expand}">
            <el-checkbox
                v-model.trim="node.$active"
                :true-label="1"
                @click.native="selectNode(node)"
                :false-labe="0"></el-checkbox>
            <i v-if="node.children && node.children.length"
                class="left-triangle pointer" @click.stop="changeExpand(node)"></i>
            <span
                :title="node.name"
                class="pointer" @click.stop="selectNode(node)">{{node.name}}</span>
        </section>
        <ul v-if="node.$expand">
            <node v-for="(item,index) in node.children"
                :key="index"
                :level="level + 1"
                :node="item"
                :parent="node"></node>
        </ul>
    </li>
</template>

<script>


export default {
    name: 'Node',
    props: {
        node: {
            type: Object
        },
        level: {
            default: 0
        },
        parent: {
            type: Object
        }
    },
    methods: {
        getTopNode() {

            let topNodeItem = this

            while (!topNodeItem.$parent.datas) {
                topNodeItem = topNodeItem.$parent
            }
            return topNodeItem
        },
        /**
         * 改变expand状态
         */
        changeExpand(node) {
            this.$set(node, '$expand', node.$expand ? 0 : 1)
        },
        /**
         * 移除选中节点的active状态
         *
         * @param {Object} node 节点信息
         */
        rmeoveActive(node) {
            this.$set(node, '$active', 0)
            if (node.children && node.children.length) {
                node.children.forEach((item) => {
                    this.rmeoveActive(item)
                })
            }
        },
        /**
         * 选择节点
         *
         * @param {Object} node 节点信息
         */
        selectNode(node) {
            setTimeout(() => {
                let topNode = this.getTopNode()
                let datas = topNode.$parent.datas
                let currentActive = node.$active ? 0 : 1
                datas.forEach((item, index) => {
                    this.rmeoveActive(item)
                })
                this.$set(node, '$active', currentActive)
                if (currentActive) {
                    topNode.$parent.$refs.node[0].$emit('select', node)
                } else {
                    topNode.$parent.$refs.node[0].$emit('select', {})
                }
            }, 0)
        }
    }
}
</script>
