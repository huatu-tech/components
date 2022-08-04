<template>
    <div>
        <el-cascader
            ref="regions"
            :options="options"
            :placeholder="placeholder"
            :clearable="clearable"
            :class="{'has-origin': this.value}"
            :show-all-levels="showAllLevels"
            @change="change"
            :change-on-select="changeOnSelect"
            :disabled="disabled"
            @active-item-change="handleItemChange"
            :props="props"
            v-model.trim="defaultValue"
            :style="{width: typeof width === 'number' ? (width + 'px') : '100%'}">
        </el-cascader>
    </div>
</template>

<script>
import { isEqual } from 'lodash'
import { postWithJson } from '../../../src/utils/serviceUtil.js'


export default {
    name: 'Region',
    props: {
        width: {
        },
        disabled: {
            default: false
        },
        clearable: {
            default: true
        },
        placeholder: {
            default: '请选择城市'
        },
        showAllLevels: {
            default: true
        },
        level: {
            default: 2
        },
        value: {

        },
        // 选择时立即改变
        changeOnSelect: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            defaultValue: this.value,
            options: [],
            props: {
                label: 'name',
                value: 'id',
                children: 'children'
            }
        }
    },
    watch: {
        value: {
            handler: function(data, oldData) {
                if (data && data.length && !isEqual(data, oldData)) {
                    this.defaultValue = data
                    this.init()
                }
            },
            immediate: true
        }
    },
    mounted() {
        this.areaSearch()
    },
    methods: {
        init () {
            let defaultValue = Array.prototype.slice.call(this.defaultValue)
            let getNodeData = (node, level) => {
                this.areaSearch(node, level)
                    .then((data) => {
                    // 获取下一个节点
                        let nodeId = defaultValue.shift()
                        let targetNode = this.getNodeById(nodeId, node.children)

                        if (nodeId && level < this.level) {
                        // 递归查找二级以上的节点
                            getNodeData(targetNode, level + 1)
                        }
                    })
            }

            if (defaultValue.length) {
                let nodeId = defaultValue.shift()
                let targetNode = this.getNodeById(nodeId, this.options)
                // 获取二级数据
                getNodeData(targetNode, 2)
            }
        },
        /**
         * 搜索地域数据
         *
         * @param {Object} node 搜索目标数据的父节点对象
         * @param {number} level 搜索的层级
         */
        areaSearch(node = {}, level) {
            let params = {}
            let id = node && node.id

            if (!id && this.options.length) {
                return
            }

            if (id) {
                Object.assign(params, {
                    id
                })
            }
            // /common/area/detail.json
            return postWithJson('/common/area/children.json', params)
                .then((res) => {
                    let data = res.data
                    // 当前级别数据不是目标级别，给当前级别的数据加children
                    if (level < this.level) {
                        data.forEach((item) => {
                            item.children = []
                        })
                    }
                    if (id) {
                        this.$set(node, 'children', data)
                    } else {

                        this.options = data
                    }
                    return data
                }).catch(() => {})
        },

        /**
         * 返回节点id所在节点对象中的index
         *
         * @param {number} id 节点id
         * @param {Object} nodes 节点对象
         *
         * @returns {Object} node
         */
        getNodeById(id, nodes) {
            let result = null
            let options = nodes || this.options
            options
                .some((item, index) => {
                    if (item.id === id) {
                        result = item
                        return true
                    }
                    return false
                })
            return result
        },
        /**
         * 要据省份id获取省份item
         */
        getLevelItemById(id) {
            let result = null
            this.options
                .some((item, index) => {
                    if (item.id === id) {
                        result = item
                        return true
                    }
                    return false
                })
            return result
        },
        /**
         * 节点信息发生改变处理
         */
        handleItemChange(val) {
            let length = val.length
            let node = null
            let parents = this.options
            val.forEach((item) => {
                node = this.getNodeById(item, parents)
                parents = node.children
            })
            this.areaSearch(node, length + 1)
        },
        /**
         * 选择城市
         */
        change(value) {
            let nodes = this.$refs['regions'].getCheckedNodes()

            if (nodes.length) {
                this.$emit('changeNodePath', nodes[0].pathNodes.map(m => ({ name: m.label, id: m.value })))
            } else {
                this.$emit('changeNodePath', [])
            }

            this.$emit('input', value)
            this.$emit('change', value)
        }
    }
}
</script>
