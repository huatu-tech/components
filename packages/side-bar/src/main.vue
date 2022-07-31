<template>
    <el-scrollbar wrapClass="scrollbar-wrapper"
        id="sidebar"
        class="sidebar"
        :class="{'hide-sidebar': !sidebar.opened}">
        <el-menu
            @select="selectMenu"
            :collapse="isCollapse"
            text-color="#ffffff"
            :background-color="menuBgColor"
            :show-timeout="200"
            :default-active="activePath">
            <template
                v-for="link in links">
                <el-submenu
                    v-if="link.children && link.children.length && ownChildrenAuth(link.children)"
                    :key="link.path"
                    :index="link.path"
                    :id="link.id">
                    <template
                        v-if="link.children"
                        slot="title"
                        class="submenu-title">
                        <icon :name="link.icon" :scale="1.6"/>
                        <span v-text="link.title"></span>
                    </template>
                    <div
                        v-for="childLink in link.children"
                        :key="childLink.path">
                        <div>
                            <el-menu-item
                                v-if="hasAuth(childLink.authName, childLink.auth)"
                                :index="childLink.path">
                                <i :class="childLink.icon"></i>
                                <span class="sub-text" v-text="childLink.title"></span>
                            </el-menu-item>
                            <!--没有配置auth，表示没有权限控制 -->
                            <el-menu-item
                                v-else-if="!childLink.auth"
                                :index="childLink.path">
                                <i :class="childLink.icon"></i>
                                <span class="sub-text" v-text="childLink.title"></span>
                            </el-menu-item>
                        </div>
                        <!-- <div v-else>
                            <el-menu-item
                                v-if="childLink.path && ownAuth(childLink.ownAuth)"
                                :index="childLink.path">
                                <i :class="childLink.icon"></i>
                                <span class="sub-text" v-text="childLink.title"></span>
                            </el-menu-item>
                            <el-menu-item
                                v-if="!(!link.hide && link.path) || !link.children"
                                :key="link.path"
                                class="submenu-title"
                                :index="link.path">
                                <icon :name="link.icon" :scale="1.6"/>
                                <span class="sub-text" v-text="link.title"></span>
                            </el-menu-item>
                        </div> -->
                    </div>
                </el-submenu>
                <el-menu-item
                    v-if="!link.children && hasSelfAuth(link)"
                    :key="link.path"
                    :index="link.path"
                    :id="link.id">
                    <icon :name="link.icon" scale="1.6"></icon>
                    <span slot="title">{{link.title}}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </el-scrollbar>
</template>

<script>
/**
 * @file 侧边栏
 */

export default {
    name: 'SideBar',
    props: {
        defaultOpeneds: {
            default () {
                return []
            }
        },
        links: {
            default() {
                return []
            }
        },
        menuBgColor: {
            default() {
                return '#333'
            }
        }
    },
    data () {
        return {
            activePath: this.$route.path,
            openedPath: this.defaultOpeneds,
        }
    },
    computed: {
        sidebar() {
            return this.$store.state.sidebar || {}
        },
        isCollapse() {
            return !this.sidebar.opened
        }
    },
    updated() {
        this.$nextTick(() => {
            this.setActivePath(this.links, this.$route.path)
        })
    },
    methods: {
        /**
         * 路径是否包含actives中的选项
         *
         * @param {string} path 路径
         *
         * @return {boolean}
         */
        setActivePath (links, path) {
            links.some((item) => {
                // 当前的$route.path 等于一级菜单的path
                if (path === item.path) {
                    this.activePath = item.path
                    return true
                }
                if (item.actives) {
                    if (item.actives.indexOf(path) > -1) {
                        this.activePath = item.path
                        return true
                    }
                }
                // 递归查找子目录
                if (item.children && item.children.length) {
                    this.setActivePath(item.children, path)
                }
                return false
            })
        },
        /**
         * 选择菜单
         */
        selectMenu (path) {
            this.$router.push(path)
        },
        /**
         * 判断是否有子菜单权限, 用于没有children的一级菜单
         *
         * @param {Object} link 一级菜单
         *
         * @return {boolean}
         */
        hasSelfAuth (link) {
            if (link.authName && link.auth) {
                return this.hasAuth(link.authName, link.auth)
            }
            return true
        },
        /**
         * 判断是否有子菜单权限,用于带有children的一级菜单
         *
         * @param {Object} links 子菜单
         *
         * @return {boolean}
         */
        ownChildrenAuth(links) {
            let arr = links.map(link => {
                if (link.ownAuth) {
                    return link.ownAuth
                } else {
                    return {
                        name: link.authName,
                        auth: link.auth
                    }
                }
            })
            arr = [].concat.apply([], arr)
            return this.ownAuth(arr)
        }
    },
    watch: {
        // 监听路由变化，如果命中actives，设置activePath选中左导
        '$route.path' (path) {
            if (this.activePath === '/') {
                this.setActivePath(this.links, path)
            } else {
                this.activePath = path
            }
        }
    }
}
</script>

