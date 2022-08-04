<!--
  @file 顶导
-->

<template>
    <header ref="header" class="clearfix">
        <div @click="logoClick" class="pull-left pointer logo" :class="{'hideSidebar': !sidebar.opened}">
            <img :src="logoShow(sidebar.opened)">
        </div>
        <div class="top-intro-container">
            <div>
                <hamburger :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
            </div>
            <!-- start -->
            <global-nav>
                <div style="display: flex;align-items: center;padding-right: 8px;">
                    <el-dropdown
                        trigger="click"
                        v-if="userInfo.roles && userInfo.roles.length > 1">
                        <div class="el-dropdown-trigger">
                            <img
                                class="avatar"
                                v-if="userInfo.avatar"
                                :src="(userInfo.avatar||'//htwuhan.oss-cn-beijing.aliyuncs.com/tool/portarit.png')|compressImage(24, 24)"
                                width="24"
                                height="24">
                                <span class="name"
                                    v-cloak
                                    v-if="userInfo.name">
                                    {{userInfo.name}}
                                    <template v-if="sysName === 'sku'">
                                    <span v-if="userInfo.curRole && userInfo.curRole.roleName" class="text-gray-light">
                                        (
                                            {{userInfo.curRole.roleName}}
                                            <el-popover
                                                placement="top-start"
                                                :disabled="!isSchools && !isDepartments"
                                                trigger="hover">
                                                <div class="topBar-schools-popover">
                                                    <div v-for="(item, $index) in roleNodes" :key="$index">
                                                        {{item.name}}
                                                    </div>
                                                </div>
                                                <span slot="reference">-{{isSchools ? '多分校' : isDepartments ? '多分部' : userInfo.belongNodeName}}-</span>
                                            </el-popover>
                                            <span v-if="userInfo.curRole.businessUnitName">{{userInfo.curRole.businessUnitName}}</span>
                                        )
                                    </span>
                                </template>
                                <template v-if="sysName === 'paike'">
                                     <span v-if="userInfo.curRole && userInfo.curRole.roleName" class="text-gray-light">
                                        ( {{userInfo.curRole.roleName}}<el-popover
                                            placement="top-start"
                                            width="150"
                                            trigger="hover">
                                            <template>
                                                <ul>
                                                    <li
                                                        v-for="node in userInfo.nodes"
                                                        :key="node.id"
                                                        style="height: 22px;line-height:22px"
                                                    >{{ node.name }}</li>
                                                </ul>
                                            </template>
                                            <span slot="reference" v-if="userInfo.nodes && userInfo.nodes.length > 1">-多分校</span>
                                        </el-popover>
                                        <span v-if="userInfo.nodes && userInfo.nodes.length === 1">-{{userInfo.nodes[0].name}}</span>
                                        <span v-if="userInfo.curRole.businessUnitName">-{{userInfo.curRole.businessUnitName}}</span> )
                                    </span>
                                </template>
                                <template v-if="sysName === 'crm'">
                                    <span v-if="userInfo.curRole && userInfo.curRole.roleName" class="text-gray-light">
                                        ({{userInfo.curRole.roleName}}<span v-if="userInfo.belongNodeName">-{{userInfo.belongNodeName}}</span>
                                        <span v-if="userInfo.curRole.businessUnitName">-{{userInfo.curRole.businessUnitName}}</span>)
                                    </span>
                                </template>
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                        </div>
                        <el-dropdown-menu slot="dropdown"
                            style="max-height: 500px; overflow-y: auto;">
                            <!--sku中active样式 需满足roleid和nodeid都相等-->
                            <el-dropdown-item
                                v-for="item in userInfo.roles"
                                :key="item.id"
                                :class="{'active': item.nodes && item.nodes.length && item.nodes[0]
                                    ?
                                        userInfo.curRole.roleId == item.roleId && userInfo.curRole.nodes[0].id == item.nodes[0].id && (!userInfo.curRole.businessUnitName
                                        ? true : userInfo.curRole.businessUnitId == item.businessUnitId) && item.nodeIds.join(',') == userInfo.nodeIds.join(',')
                                    : userInfo.curRole.roleId == item.roleId}"
                                @click.native="changeRole(item)">
                                    {{item.roleName}}
                                    <span class="text-gray-light role-item-node">
                                        [
                                            <span v-if="item.nodes && item.nodes.length && item.nodes[0]">
                                                {{!item.nodeIds.includes(1) && item.nodes.length > 1 && item.nodes.every(e=>e.type === 0) ? '多分校' : !item.nodeIds.includes(1) && item.nodes.length > 1 && item.nodes.every(e=>e.type === 1) ? '多分部' : item.nodes[0].name}}-
                                            </span>
                                            <span v-if="item.businessUnitName">{{item.businessUnitName}}</span>
                                        ]
                                    </span>
                                    <span v-if="item.nodes && item.nodes.length && item.nodes[0]" class="text-gray-light role-item-node">
                                    <template v-if="sysName === 'sku'">
                                        [
                                            <span v-if="item.nodes && item.nodes.length && item.nodes[0]">
                                                {{!item.nodeIds.includes(1) && item.nodes.length > 1 && item.nodes.every(e=>e.type === 0) ? '多分校' : !item.nodeIds.includes(1) && item.nodes.length > 1 && item.nodes.every(e=>e.type === 1) ? '多分部' : item.nodes[0].name}}-
                                            </span>
                                            <span v-if="item.businessUnitName">{{item.businessUnitName}}</span>
                                        ]
                                    </template>
                                    <template v-if="sysName === 'paike'">
                                        [ {{ item.nodes.length === 1 ? item.nodes[0].name : '多分校'}}<span v-if="item.businessUnitName">-{{item.businessUnitName}}</span> ]
                                    </template>
                                    <template v-if="sysName === 'crm'">
                                        [{{item.nodes[0].name}}<span v-if="item.businessUnitName">-{{item.businessUnitName}}</span>]
                                    </template>
                                    </span>
                                </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <template v-else>
                        <img
                            class="avatar"
                            v-if="userInfo.avatar"
                            :src="(userInfo.avatar||'//htwuhan.oss-cn-beijing.aliyuncs.com/tool/portarit.png')|compressImage(24, 24)"
                            width="24"
                            height="24">
                        <span class="name"
                            v-cloak
                            v-if="userInfo.name">
                            {{userInfo.name}}
                            <span v-if="userInfo.curRole && userInfo.curRole.roleName" class="text-gray-light">
                            <template v-if="sysName === 'sku'">
                                    (
                                        {{userInfo.curRole.roleName}}
                                        <el-popover
                                            placement="top-start"
                                            :disabled="!isSchools && !isDepartments"
                                            trigger="hover">
                                            <div class="topBar-schools-popover">
                                                <div v-for="(item, $index) in roleNodes" :key="$index">
                                                    {{item.name}}
                                                </div>
                                            </div>
                                            <span slot="reference">-{{isSchools ? '多分校' : isDepartments ? '多分部' : userInfo.belongNodeName}}-</span>
                                        </el-popover>
                                        <span v-if="userInfo.curRole.businessUnitName">{{userInfo.curRole.businessUnitName}}</span>
                                    )
                            </template>
                            <template v-if="sysName === 'paike'">
                                (
                                    <el-popover
                                    placement="top-start"
                                    width="150"
                                    trigger="hover">
                                    <template>
                                        <ul>
                                            <li
                                                v-for="node in userInfo.nodes"
                                                :key="node.id"
                                                style="height: 22px;line-height:22px"
                                            >{{ node.name }}</li>
                                        </ul>
                                    </template>
                                    <span slot="reference" v-if="userInfo.nodes && userInfo.nodes.length > 1">-多分校</span>
                                </el-popover>
                                <span v-if="userInfo.nodes && userInfo.nodes.length === 1">-{{userInfo.nodes[0].name}}</span>
                                <span v-if="userInfo.curRole.businessUnitName">-{{userInfo.curRole.businessUnitName}}</span>
                                )
                            </template>
                            <template v-if="sysName === 'crm'">
                                <span v-if="userInfo.belongNodeName">-{{userInfo.belongNodeName}}</span>
                            </template>
                        </span>
                    </template>
                    <a v-if="feedbackNumber" :href="`https://feedback.huatu.com/fk/${feedbackNumber}`" class="emergency" target="blank">
                        <i class="el-icon-message">&nbsp;意见反馈</i>
                    </a>
                    <a v-else :href="`http://htwuhan.oss-cn-beijing.aliyuncs.com/tool/神农架紧急联系人.pdf?time=${Number(new Date())}`" class="emergency" target="blank">
                        <i class="el-icon-mobile-phone">紧急联系人</i>
                    </a>
                    <el-popover
                        v-if="openNotification"
                        @show="popoverShow"
                        ref="popover"
                        placement="bottom-start"
                        width="280"
                        trigger="click">
                        <section
                            v-loading="$store.state.sidebar.loading"
                            class="top-notification-content">
                            <h3 class="top-notification-content_title">消息通知</h3>
                            <ul
                                v-if="unreadMessageList.length !== 0"
                                class="top-notification-content_list">
                                <li
                                    v-for="(unreadMessageItem, index) of unreadMessageList"
                                    :key="index"
                                    class="top-notification-content_item">
                                    {{unreadMessageItem.title}}
                                </li>
                            </ul>

                            <section
                                class="top-notification-nothing_container"
                                style="min-height: 300px;"
                                v-if="!unreadMessageList.length || unreadMessageList.length === 0">
                                <div
                                    class="top-notification-nothing_icon">
                                    <svg
                                        viewBox="0 0 1024 1024"
                                        p-id="1747"
                                        width="55"
                                        height="55">
                                        <path d="M475.829476 1024C551.912302 1024 611.780755 962.884287 611.780755 888.048721H339.878197c0 74.835566 61.115713 135.951279 135.951279 135.951279zM772.677223 140.940317c-102.275274 0-184.594397 63.610231-184.594397 143.434835 0 78.577345 82.319123 143.434836 184.594397 143.434836 102.275274 0 184.594397-63.610231 184.594397-143.434836s-82.319123-143.434836-184.594397-143.434835z m-87.308161 167.132765c-13.719854 0-23.697929-11.225335-23.697929-23.69793 0-13.719854 11.225335-23.697929 23.697929-23.697929 13.719854 0 23.697929 11.225335 23.697929 23.697929 1.247259 13.719854-9.978076 23.697929-23.697929 23.69793z m87.308161 0c-13.719854 0-23.697929-11.225335-23.697929-23.69793 0-13.719854 11.225335-23.697929 23.697929-23.697929s23.697929 11.225335 23.697929 23.697929c0 13.719854-9.978076 23.697929-23.697929 23.69793z m86.060901 0c-13.719854 0-23.697929-11.225335-23.697929-23.69793 0-13.719854 11.225335-23.697929 23.697929-23.697929s23.697929 11.225335 23.69793 23.697929c1.247259 13.719854-9.978076 23.697929-23.69793 23.69793z" p-id="1748">
                                        </path>
                                        <path d="M838.781973 750.850183c-44.90134 0-44.90134-180.852619-44.90134-180.852619V462.733252c-6.236297 0-13.719854 1.247259-19.956151 1.24726-122.231425 0-222.01218-81.071864-222.01218-180.852619 0-57.373934 33.676005-108.511571 86.060901-142.187576-22.45067-14.967113-46.148599-26.192448-72.341047-34.923265 1.247259-4.989038 1.247259-9.978076 1.247259-14.967113 0-49.890378-41.159562-91.049939-91.049939-91.049939s-91.049939 41.159562-91.049939 91.049939c0 4.989038 0 9.978076 1.24726 14.967113-125.973203 43.65408-228.248477 178.3581-228.248478 336.760049v124.725944s0 180.852619-43.65408 182.099878c-26.192448 0-46.148599 19.956151-46.1486 44.90134S87.93179 839.405603 112.876979 839.405603h725.904994c24.945189 0 44.90134-19.956151 44.90134-44.90134 1.247259-22.45067-19.956151-43.65408-44.90134-43.65408z m-361.705237-619.887942c-19.956151 0-37.417783-16.214373-37.417784-37.417783 0-19.956151 16.214373-37.417783 37.417784-37.417783 19.956151 0 37.417783 16.214373 37.417783 37.417783-1.247259 21.20341-17.461632 37.417783-37.417783 37.417783z" p-id="1749">
                                        </path>
                                    </svg>
                                    <p>暂时无消息通知</p>
                                </div>
                            </section>
                            <div
                                @click="viewMoreNotifications"
                                class="top-notification-content-bottom">
                                <div v-if="unreadMessageList.length || unreadMessageList.length !== 0">
                                    查看全部
                                    <i class="el-icon-arrow-right"></i>
                                </div>
                            </div>
                        </section>
                        <el-badge
                            style="margin: 0 5px 0 20px;"
                            slot="reference"
                            :hidden="!unreadMessageNum"
                            :value="unreadMessageNum"
                            :max="9" class="item">
                            <div
                                class="top-notification"
                                title="通知中心">
                                <svg
                                    viewBox="0 0 1024 1024"
                                    width="16"
                                    height="16">
                                    <path d="M694.857143 936.228571h-365.714286c-21.942857 0-36.571429 14.628571-36.571428 36.571429s14.628571 36.571429 36.571428 36.571429h358.4c21.942857 0 36.571429-14.628571 36.571429-36.571429s-7.314286-36.571429-29.257143-36.571429zM936.228571 753.371429l-80.457142-124.342858c-21.942857-43.885714-73.142857-21.942857-65.828572 21.942858V658.285714l80.457143 138.971429v7.314286H146.285714l87.771429-138.971429c0-7.314286 7.314286-7.314286 7.314286-14.628571v-219.428572c0-95.085714 80.457143-197.485714 190.171428-234.057143 29.257143-7.314286 43.885714-14.628571 58.514286-14.628571h58.514286c14.628571 0 36.571429 7.314286 65.828571 14.628571 102.4 36.571429 182.857143 138.971429 182.857143 234.057143v204.8c0 29.257143 65.828571 36.571429 73.142857 0V431.542857c0-58.514286-21.942857-124.342857-65.828571-175.542857-43.885714-43.885714-95.085714-80.457143-146.285715-102.4 0-73.142857-65.828571-131.657143-146.285714-131.657143s-146.285714 58.514286-146.285714 131.657143c-51.2 21.942857-102.4 58.514286-131.657143 102.4-43.885714 58.514286-65.828571 117.028571-65.828572 175.542857v190.171429L87.771429 760.685714c-14.628571 21.942857-14.628571 43.885714 0 65.828572 14.628571 21.942857 36.571429 29.257143 58.514285 29.257143h731.428572c36.571429 0 65.828571-29.257143 65.828571-65.828572 7.314286-7.314286 0-21.942857-7.314286-36.571428zM512 80.457143c36.571429 0 65.828571 21.942857 73.142857 51.2-43.885714-7.314286-102.4-14.628571-146.285714 0 7.314286-29.257143 36.571429-51.2 73.142857-51.2z" p-id="1620">
                                    </path>
                                </svg>
                            </div>
                        </el-badge>
                    </el-popover>
                    <span
                        class="pointer exit"
                        @click="logout"
                        title="退出">
                        <icon
                            style="color:#666"
                            name="loginout"
                            scale="1.6"></icon>
                    </span>
                </div>
            </global-nav>
            <!-- end -->
        </div>
    </header>
</template>

<script>

import Hamburger from '../../hamburger/src/main.vue'
import GlobalNav from '../../global-nav/src/main.vue'
import { postWithJson } from '../../../src/utils/serviceUtil.js'

export default {
    name: 'TopBar',
    components: {
        Hamburger,
        GlobalNav
    },
    props: {
        // 反馈系统id，如果有反馈系统id，则显示意见反馈入口
        feedbackNumber: {
            type: Number,
            default () {
                return null
            }
        },
        openNotification: {
            type: Boolean,
            default() {
                return false
            }
        },
        systemName: {
            type: String,
            default() {
                return
            }
        },
        // 系统logo链接
        systemLogo: {
            type: String,
            default() {
                return
            }
        },
        showGlobalNav: {
            type: Boolean,
            default() {
                return false
            }
        }
    },
    data() {
        return {
            scrollX: document.documentElement.scrollLeft || document.body.scrollLeft,
            scrollY: 0,
        }
    },
    computed: {
        sysName() {
            let str = ''
            switch(this.systemName){
                case '商品订单系统':
                    str = 'sku'
                    break
                case '排课系统':
                    str = 'paike'
                    break
                case 'CRM系统':
                    str =  'crm'
                    break
                case '支付系统':
                    str =  'pay'
                    break
            }
            return str
        },
        userInfo() {
            return this.$store.state.userInfo || {}
        },
        sidebar() {
            return this.$store.state.sidebar || {}
        },
        unreadMessageNum() {
            return this.$store.state.sidebar.unreadMessageNum || 0
        },
        unreadMessageList() {
            return this.$store.state.sidebar.unreadMessageList || []
        },
        isSchools() {
            const { nodeIds, nodes } = this.$store.state.userInfo
            return !nodeIds.includes(1) && nodes.length > 1 && nodes.every(e => e.type === 0)
        },
        isDepartments() {
            const { nodeIds, nodes } = this.$store.state.userInfo
            return !nodeIds.includes(1) && nodes.length > 1 && nodes.every(e => e.type === 1)
        },
        roleNodes() {
            return this.$store.state.userInfo.nodes || []
        }
    },
    methods: {
        /**
         * 切换角色
         * @param {Object} role 角色
         */
        changeRole (role) {
            let params = {
                roleId: role.roleId,
                businessUnitId: 0
            }
            // sku 需要nodeId
            let nodes = role.nodes
            if (nodes && nodes.length && nodes[0]) {
                Object.assign(params, {
                    nodeId: nodes[0].id,
                    nodeIds: role.nodeIds,
                })
            }
            if (role.businessUnitId) {
                Object.assign(params, {
                    businessUnitId: role.businessUnitId
                })
            }
            postWithJson('/changeRole.json', params).then(() => {
                location.href = '/'
            })
        },
        toggleSideBar() {
            this.$store.dispatch('toggleSideBar')
        },
        /**
         * 退出登录
         */
        logout() {
            window.location.href = '/ac/logout.do'
        },
        // 点击logo回首页
        logoClick() {
            this.$router.push('/')
        },

        // 点击查看更多通知列表
        viewMoreNotifications() {
            this.$router.push('/notificationCenter')
            this.$refs.popover.doClose()
        },

        // 通知点开列表未读数量清空
        popoverShow() {
            this.$store.commit('SET_UNREAD_NUM', 0)
            this.$store.dispatch('getUnreadMessageList')
        },
        logoShow(opened) {
            if (opened) {
                // 系统名已传入
                if (this.systemLogo) {
                    return this.systemLogo
                }
                if (this.systemName) {
                    if (this.systemName.includes('排课')) {
                        return '//htwuhan.oss-cn-beijing.aliyuncs.com/pakie/paike_logo.png'
                    }
                    if (this.systemName.includes('商品订单')) {
                        return '//htwuhan.oss-cn-beijing.aliyuncs.com/sku/sku_logo.png'
                    }
                    if (this.systemName.includes('支付')) {
                        return '//htwuhan.oss-cn-beijing.aliyuncs.com/zhifu/zhifu_logo.png'
                    }
                }
                return '//htwuhan.oss-cn-beijing.aliyuncs.com/tool/logo@2x.png'
            }
            // 菜单收起状态时
            return '//htwuhan.oss-cn-beijing.aliyuncs.com/tool/logo-mini.png'
        }
    }
}
</script>
