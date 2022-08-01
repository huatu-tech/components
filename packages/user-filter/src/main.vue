<template>
     <el-select
        v-model.trim="userId"
        clearable
        filterable
        ref="component"
        remote
        :disabled="disabled"
        @remove-tag="remove"
        no-data-text=""
        :multiple="true"
        :multiple-limit="limit"
        @clear="clear"
        @change="changeUser"
        :loading="loading"
        :remote-method="fetchList"
        :placeholder="placeholder"
        :style="{width: typeof width === 'number' ? (width + 'px') : '100%'}">
            <el-option
                v-for="(item, index) in list"
                :label="item.chineseName || item.name"
                :value="item.id || item.staffId"
                :key="item.id || item.staffId">
                    <div class="option">
                        <span :title="item.chineseName || item.name">{{ item.chineseName || item.name }}</span>
                        <span><span class="staff-number">{{ item.staffNo }}</span></span>
                    </div>
            </el-option>
    </el-select>
</template>

<script>

let timer = null
import { postWithJson } from '../../../src/utils/serviceUtil.js'

export default {
    name:'UserFilter',
    props: {
        // 从哪来的，透传
        from: {},
        value: {},
        // 服务端不仅需要仅中的id，还需要员工号及其它信息，为true返回选中的object
        getUserObject: {
            default: false
        },
        name: String,
        // TODO 单选在IE11下有问题，统一搞成多选
        isMultiple: {
            defualt: true
        },
        // 请求用户接口地址
        url: {
            default: '/staff/simpleList.json'
        },
        disabled: {
            default: false,
        },
        // 给定下拉选择项
        options: {
            default() {
                return []
            }
        },
        // 发请求的额外的参数
        extraParams: {
            default() {
                return {}
            }
        },
        placeholder: {
            default: '请输入姓名/工号/拼音'
        },
        width: {
            default: ''
        }
    },
    data() {
        let limit = 0
        let value = this.value
        if (typeof this.value !== 'object') {
            limit = 1
        }
        let userId = []
        if (value) {
            userId = [].concat(value)
        }
        return {
            selectedObject: [],
            loading: false,
            limit: limit,
            list: this.options || [],
            userId: userId
        }
    },
    computed: {
        userInfo() {
            return this.$store.state.userInfo
        }
    },
    watch: {
        name() {
            this.defaultUser()
        },
        value(value) {
            if (!value) {
                this.userId = []
            } else {
                this.userId = [].concat(value)
            }
            this.defaultUser()
        },
        schoolId() {
            this.fetchList()
        },
        options(value) {
            this.list = value
        }
    },
    mounted() {
        this.defaultUser()
        // fetch-users事件可以传递一个参数，这个参数为传递过来的extraParams
        this.$on('fetch-users', () => {
            setTimeout(() => {
                this.fetchList(true)
            })
        })
    },
    methods: {
        /**
         * 设置默认用户
         */
        defaultUser() {
            let value = this.value
            let name = this.name
            if (value && name) {
                this.$emit('input', [].concat(value))
                if (!this.list.length) {
                    this.list = [
                        {
                            id: value[0],
                            name: name
                        }
                    ]
                }
            }
            if (value) {
                this.userId = [].concat(value)
            }
        },
        remove(userid) {
            this.selectedObject.some((item, index) => {
                if (userid === item.id) {
                    this.selectedObject.splice(index, 1)
                    return true
                }
                return false
            })
        },
        /**
         * 清除用户信息
         */
        clear() {
            this.selectedObject = []
            this.list = []
        },
        /**
         * 获取用户列表
         *
         * @param {boolean|string} query query为true 表示强制刷新
         */
        fetchList(key) {
            let query = key
            if (query === true) {
                query = ''
            } else if (query.length < 1 || /^\s+$/.test(query)) {
                return
            }
            this.loading = true
            let extraParams = this.extraParams
            clearTimeout(timer)
            timer = setTimeout(() => {
                let params = {
                    query: query,
                    pageDto: {
                        pageSize: 20,
                        pageNum: 1
                    }
                }
                // 额外参数
                Object.assign(params, extraParams)
                postWithJson(this.url, params)
                    .then((res) => {
                        this.list = res.data
                        setTimeout(() => { this.loading = false })
                    }, () => {
                        setTimeout(() => { this.loading = false })
                    })
            }, 200)
        },
        /**
         * 判读selectedObject是否包含某id
         */
        isIncludeUser(userId) {
            return this.selectedObject.some((item) => {
                if (item.staffId === userId) {
                    return true
                }
                return false
            })
        },
        /**
         * 改变用户
         */
        changeUser(userId) {
            if (this.limit === 1) {
                this.$emit('input', userId[0] || '')
                this.$emit('change', userId[0] || '')
                setTimeout(() => {
                    this.$refs.component.visible = false
                })
            } else {
                this.$emit('input', userId)
                this.$emit('change', userId)
            }
            if (this.getUserObject) {
                if (userId.length) {
                    // 根据id 找到用户对象 TODO
                    userId.forEach((item) => {
                        this.list.some((user) => {
                            if (user.staffId === item && !this.isIncludeUser(item)) {
                                this.selectedObject.push(user)
                                return true
                            }
                            return false
                        })
                    })
                } else {
                    this.selectedObject = []
                }
                setTimeout(() => {
                    this.$emit('changeuserobject', this.selectedObject, this.from)
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .option {
        display: flex;
        justify-content: space-between;
        overflow: hidden;
        > span {
            display: inline-block;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            max-width: 130px;
            &:last-of-type {
                float: right;
                text-align: left;
                width: 60px;
            }
        }
    }
</style>
