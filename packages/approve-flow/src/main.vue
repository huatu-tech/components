<template>
    <el-steps
        v-if="nodes"
        class="approve-flow"
        direction="vertical"
        :active="active">
        <el-step
            v-for="(node, index) in nodes"
            :key="index">
            <div
                class="approve-title"
                slot="title">
                <span
                    class="title">
                    {{ node.name}}
                    {{ isRecalled(node) }}
                </span>

                <span
                    class="time"
                    v-if="showApprovetime(node.taskStatus)">
                    {{ (node.taskStatus === 2 || node.taskStatus === 5) ? formatDate(node.startTime) : formatDate(node.endTime)}}
                </span>
            </div>
            <div
                class="approve-node"
                :class="setNode(node.taskStatus)"
                slot="icon">
                <span class="text">{{ node.taskStatusStr }}</span>
            </div>
            <div
                class="approve-description"
                slot="description">
                <pre><!--
                    -->{{
                            node.comment ? node.more ? node.comment : node.comment.substring(0, 100) : ''
                    }}<!--
                    --><span v-if="node.needShowMore && !node.more">...</span>&nbsp;<!--
                    --><i
                            class="el-icon-arrow-down comment-moreorless"
                            v-if="node.needShowMore && !node.more"
                            @click="node.more = true"></i><!--
                    --><i
                        class="el-icon-arrow-up comment-moreorless"
                        v-if="node.needShowMore && node.more"
                        @click="node.more = false"></i><!--
                --></pre>
            </div>
        </el-step>
    </el-steps>
</template>

<script>
import { get } from 'lodash'

export default {
    name:'ApproveFlow',
    props: {
        // ticketStatus: {
        //     type: Number,
        //     default: 3,
        //     required: true
        // },

        // COMPLETED(0, "审批完成"),
        // DELETED(1, "审批失效"),
        // PENDING(2, "审批中"),
        // APPROVED(3, "审批通过"),
        // REFUSED(4, "审批拒绝"),
        // SUBMITTED(5, "已提交"),
        // APPROVAL_PENDING(6, "待审批");
        approveNodes: {
            type: Array,
            default: function() {
                return []
            },
            required: true
        },
        applyStatus: {
            type: Number
        },
        statusMapping: {
            type: Object,
            default: function() {
                return {
                    unavailable: 0, // 审批失效
                    finished: 1, // 审批完成
                    processing: 2, // 审批中
                    passed: 3,     // 通过
                    rejected: 4,   // 不通过
                    originated: 5, // 发起
                    pending: 6,    // 待审批
                    recalled: 7,   // 撤回
                    // expired: 6     // 过期
                }
            },
        }
    },
    data() {
        return {
            nodes: []
        }
    },
    computed: {
        active() {
            let index = 1
            this.nodes.forEach((node) => {
                if (node.taskStatus !== this.statusMapping.processing &&
                    node.taskStatus !== this.statusMapping.pending
                ) {
                    index++
                }
            })
            return index
        }
    },
    watch: {
        approveNodes(value) {
            console.log(this.approveNodes)
            this.injectRemarkCollapseCtrl(value)
        }
    },
    mounted() {
        this.injectRemarkCollapseCtrl(this.approveNodes)
    },
    methods: {
        formatDate(time) {
            return time ? this.$options.filters.formatDate(time, 'yyyy/MM/dd HH:mm:ss') : ''
        },
        get(node, path) {
            return get(node, path, '--')
        },
        injectRemarkCollapseCtrl(nodes) {

            this.nodes.length = 0
            nodes.forEach(node => {

                let res = { ...node }

                if (!node.staffList || node.staffList.length > 1) {
                    res['name'] = node.roleName
                } else if (node.staffList.length === 1) {
                    res['name'] = node.staffList[0].chineseName
                }

                if (node.comment && node.comment.length > 100) {
                    res = {
                        ...res,
                        needShowMore: true,
                        more: false
                    }
                }
                this.nodes.push({ ...res })
            })
        },
        isRecalled(node) {
            if (node.taskStatus === this.statusMapping.originated
                && this.applyStatus === this.statusMapping.recalled
            ) {
                return '(已撤回)'
            } else {
                return ''
            }
        },
        setNode(status) {
            switch (status) {
                case this.statusMapping.unavailable:
                    return {
                        'rejected': true
                    }
                case this.statusMapping.processing:
                    return {
                        'processing': true,
                        'pulsating': true
                    }
                case this.statusMapping.pending:
                    return {
                        'pending': true,
                    }
                case this.statusMapping.passed:
                    return {
                        'passed': true,
                    }
                case this.statusMapping.rejected:
                    return {
                        'rejected': true
                    }
            }
        },
        showApprovetime(status) {
            return status !== this.statusMapping.pending
        }
    }
}
</script>

<style lang="scss">
.approve-flow {
    display: block;
    .el-step__line {
        background-color: #F2F2F2;
    }
    .el-step__icon {
        width: 46px;
        height: 46px;
    }
    .el-step__title {
        padding: 8px 0 3px;
        font-size: 14px;
        line-height: 20px;
        font-weight: normarl !important;
        color: #333 !important;
    }
    .el-step__description {
        line-height: 1.4;
        color: #666 !important;
    }
    .el-step.is-vertical .el-step__line {
        left: 22px;
    }
    .el-step__icon.is-text {
        border: none;
    }
    .el-step.is-vertical .el-step__main {
        min-height: 120px;
        padding-left: 40px;
        overflow: hidden;
    }
    .el-step.is-vertical .el-step__title {
        padding-bottom: 3px;
    }
}
.approve-node {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 50px;
    height: 50px;

    &:before {
        content: '';
        position: relative;
        display: block;
        width: 120%;
        height: 120%;
        box-sizing: border-box;
        margin-left: -10%;
        margin-top: -10%;
        border-radius: 75px;
        background-color: #E1EBFE;
    }

    &:after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        display: block;
        width: 100%;
        height: 100%;
        background-color: #679AFA;
        border-radius: 50px;
        box-shadow: 0 0 8px rgba(0,0,0,.01);
    }

    .text {
        display: block;
        position: absolute;
        z-index: 1;
        top: 50%;
        margin-top: -6px;
        width: 100%;
        line-height: 1;
        font-size: 12px;
        color: #FFF;
        text-align: center;
    }

    &.processing {
        &:before {
            background-color: #FDF2D3;
        }
        &:after {
            background-color: #F6C926
        }
        .text {
            color: #FFF;
        }
    }

    &.pending {
        &:before {
            background-color: #F2F2F2;
        }
        &:after {
            background-color: #D7D7D8
        }
        .text {
            color: #666;
        }
    }

    &.passed {
        &:before {
            background-color: #D8F7EC;
        }
        &:after {
            background-color: #40dcaa
        }
        .text {
            color: #FFF;
        }
    }

    &.rejected {
        &:before {
            background-color: #FFE1E2;
        }
        &:after {
            background-color: #FF6770
        }
        .text {
            color: #FFF;
        }
    }

    &.pulsating {
        &:before {
            width: 300%;
            height: 300%;
            margin-left: -100%;
            margin-top: -100%;
            animation: pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }
        &:after {
            animation: pulse-dot 1.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) -.4s infinite;
        }
    }

}
.approve-title {
    .title,
    .name {
        display: block;
        font-size: 14px;
        font-weight: bold;
        color: #333;
    }
    .time {
        margin: 0 5px 5px 0;
        font-size: 12px;
        line-height: 1;
        color: #999;
    }
}
.approve-description {
    margin-top: 5px;
    margin-bottom: 15px;
    max-width: 150px;
    word-break: break-all;
    text-align: justify;
}
.comment-moreorless {
    cursor: pointer;
    font-weight: 600;
    color: #679AFA;
    position: relative;
    z-index:1;
}

@keyframes pulse-ring {
    0% {
        transform: scale(.3);
    }
    20% {
        transform: scale(.35);
        opacity: 0.8;
    }
    40% {
        transform: scale(.4);
        opacity: 0.6;
    }
    60% {
        transform: scale(.45);
        opacity: 0.4;
    }
    80% {
        transform: scale(.5);
        opacity: 0.2;
    }
    100% {
        transform: scale(.55);
        opacity: 0;
    }
}

@keyframes pulse-dot {
    0% {
        transform: scale(.95);
    }
    50% {
        transform: scale(1);
    }
    100% {
        transform: scale(.95);
    }
}
</style>
