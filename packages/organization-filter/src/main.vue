<template>
    <section
        class="organization-filter">
        <el-input v-model.trim="value[0]" class="hide-input"></el-input>
        <el-popover
            ref="popover"
            placement="bottom"
            v-if="!disabled"
            v-loading="loading"
            popper-class="organization-filter-popver"
            width="350"
            trigger="click">
            <el-input
                slot="reference"
                ref="userFilter"
                :class="{'has-value': name || selected.name}"
                v-model.trim="name"
                :placeholder="placeholder"
                :clearable="false"
                :style="{width: typeof width === 'number' ? (width + 'px') : '100%'}">
                <span slot="suffix">
                    <span class="el-input__suffix" @click.stop="clear">
                        <span class="el-input__suffix-inner"><i class="el-input__icon el-icon-circle-close"></i></span>
                    </span>
                </span>
            </el-input>
            <section class="organization-filter-layer">
                <section class="opt-group">
                    <el-button
                        type="default"
                        @click="cancel"
                        size="small">取消</el-button>
                    <el-button
                        type="primary"
                        @click="submit"
                        size="small">确定</el-button>
                </section>
                <section class="organization-list">
                    <node
                        ref="node"
                        @select="changeSelect"
                        v-for="(item, index) in datas"
                        :key="item.id"
                        :node="item">
                    </node>
                </section>
            </section>
        </el-popover>
        <el-input
            v-else
            :placeholder="placeholder"
            v-model.trim="name"
            :disabled="disabled"></el-input>
    </section>
</template>

<script>

import deepClone from '../../../src/functions/deepClone.js'
import { postWithJson } from '../../../src/utils/serviceUtil.js'
import Node from '../../node/src/main.vue'

export default {
    name:'OrganizationFilter',
    props: {
        value: {
            default() {
                return []
            }
        },
        width: {},
        // 是否用所有的组织架构，不用allNodes，就用当前登录人所控制的节点
        useAllNodes: {
            default: false
        },
        multiple: {
            default: false
        },
        from: {
            default: ''
        },
        placeholder: {
            default: '请选择组织架构'
        },
        clearOnChange: {
            default: false,
        },
        disabled: {
            default: false
        },
        // 是否只需要其他节点，默认false
        otherNodes: {
            default: false
        },
        // 获取所有组织架构节点，不做权限控制
        needAllNodes: {
            default: false
        }
    },
    data() {
        return {
            datas: [],
            loading: false,
            visiable: false,
            name: '',
            selected: {}
        }
    },
    computed: {
        userInfo() {
            return this.$store.state.userInfo
        }
    },
    mounted() {
        let userInfo = this.userInfo
        if (!this.value.length) {
            this.reset()
        }
        if (!userInfo.nodes) {
            return
        }
        if (!this.useAllNodes) {
            if (this.otherNodes) {
                this.fetchOtherNodes()
            } else if (this.needAllNodes) {
                this.fetchAllNodes()
            } else {
                this.datas = deepClone(userInfo.belongNode ? [].concat(userInfo.belongNode) : userInfo.nodes)
                this.setDefault()
            }
        } else {
            this.fetchAllNode()
        }
    },
    methods: {
        fetchAllNode() {
            this.loading = false
            postWithJson('/node/allNodes.json')
                .then((res) => {
                    this.loading = false
                    this.datas = res.data
                    this.setDefault()
                }, () => {
                    this.loading = false
                })
        },
        /**
         * 改变选择项
         */
        changeSelect(value) {
            this.selected = deepClone(value)
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
         * 设置active expand
         *
         * @param {Object} node 节点信息
         * @param {number} id 选择的节点id
         * @param {Array<number>} 节点id数组
         */
        setActiveExpand(node, id, ids) {
            if (node.id === id) {
                this.$set(node, '$active', 1)
                this.selected = deepClone(node)
                this.name = this.selected.name
                return true
            } else if (ids.indexOf(node.id) > -1) {
                this.$set(node, '$expand', 1)
            }
            if (node.children && node.children.length) {
                node.children.forEach((item) => {
                    this.setActiveExpand(item, id, ids)
                })
            }
        },
        /**
         * 清除选择的数据
         */
        clear() {
            this.reset()
            this.$emit('input', [])
            this.$emit('change', {
                from: this.from,
                currentLabels: [],
                value: []
            })
            this.datas.forEach((item) => {
                this.rmeoveActive(item)
            })
        },
        reset() {
            this.name = ''
            this.selected = {}
        },
        /**
         * 回显已选择的id
         */
        setDefault() {
            if (!this.datas.length) {
                return
            }
            let value = this.value
            if (!this.value.length) {
                this.reset()
            }
            let id = value[value.length - 1]
            this.datas.forEach((node) => {
                this.setActiveExpand(node, id, value)
            })
        },
        /**
         * 取消
         */
        cancel() {
            this.$refs.popover.doClose()
        },
        /**
         * 提交数据
         */
        submit() {
            let selected = this.selected
            if (!selected.id) {
                toast(this.placeholder)
                return
            }
            this.cancel()
            this.$emit('input', selected.ids)
            this.$emit('change', {
                from: this.from,
                currentLabels: selected.names || [].concat(selected.name),
                value: selected.ids
            })
            if (this.clearOnChange) {
                this.clear()
            }
        },
        /**
         * 获取其他节点
         */
        fetchOtherNodes() {
            this.loading = false
            if (this.userInfo.nodes && this.userInfo.nodes.length) {
                postWithJson('/ehrNode/otherNodes.json', { nodeId: this.userInfo.nodes[0].id })
                    .then((res) => {
                        this.loading = false
                        this.datas = [res.data]
                        this.setDefault()
                    }, () => {
                        this.loading = false
                    })
            }
        },
        /**
         * 获取所有节点
         */
        fetchAllNodes() {
            this.loading = false
            postWithJson('/organization/allNodesList.json')
                .then((res) => {
                    this.loading = false
                    this.datas = res.data
                    this.setDefault()
                }, () => {
                    this.loading = false
                })
        }
    },
    components: {
        Node
    },
    watch: {
        value() {
            this.setDefault()
        },
        userInfo(value) {
            setTimeout(() => {
                if (!this.useAllNodes) {
                    this.datas = deepClone(value.belongNode ? [].concat(value.belongNode) : value.nodes)
                    this.setDefault()
                } else {
                    this.fetchAllNode()
                }
            })
        }
    }
}
</script>

<style lang="scss">
    .organization-filter {
        .hide-input {
            position: absolute;
            right: 99999px;
            z-index: -1;
        }
        .el-input__icon {
            display: none;
        }
        .has-value {
            &:hover {
                .el-input__icon {
                    display: block;
                    cursor: pointer;
                    &:hover {
                        color: #909399;
                    }
                }
            }
        }
        .el-input__validateIcon {
            display: none!important;
        }

        &-layer {
            .organization-list {
                padding: 10px;
                height: 280px;
                overflow: auto;
            }
            .opt-group {
                border-bottom: 1px solid #efefef;
                padding: 10px;
                text-align: right;
                .el-button {
                    &:first-of-type {
                        margin-right: 8px;
                    }
                }
            }
            li {
                list-style: none;
            }
        }
    }
</style>
