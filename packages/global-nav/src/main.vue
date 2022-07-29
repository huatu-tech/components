 <!---
    @description 使用该组件  需下载插件 npm install js-md/bower install md5
    请求代理
    '/api/*': {
        targwt: '域名'
    }
    测试域名:https://yunyingapi-dev.huatu.com
    beta域名:https://yunyingapi-beta.huatu.com
    正式域名:https://yunyingapi.huatu.com
 -->
<template>
  <div class="nav-bar">
    <div class="nav-fixed" :class="{ 'splitline' : showFixedNav }">
      <span class="nav-item" @click="gotoIndex">首页</span>

      <!-- 导航 --start -->
      <el-popover
        placement="bottom"
        :visible-arrow="false"
        trigger="click"
        popper-class="nav-bar-el-popover"
        v-model="navShow">
        <!-- :popper-options="{ boundariesElement: 'viewport', removeOnDestroy: true }" -->
        <span class="nav-item choose" slot="reference" v-bind:class="{'active': navShow}">
          导航
          <i v-bind:class="navShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </span>
        <template>
          <div class="nav-content">
            <div>
              <el-autocomplete
                v-model="navValue"
                :fetch-suggestions="querySearch"
                placeholder="请搜索系统、功能名称"
                :trigger-on-focus="false"
                :debounce="500"
                @select="navSelectChange"
                style="width: 100%;"
                value-key="name"
                popper-class="navbar-el-autocomplete" >
                <i
                  slot="suffix"
                  @keyup.enter="searchNavValue"
                  class="el-input__icon el-icon-search pointer"></i>
                <template slot-scope="{ item }">
                  <div
                    class="nav-el-autocomplete-item"
                    :class="{'active': item.matched}"
                    @click="gotoSystem(item)">{{ item.name }}</div>
                </template>
              </el-autocomplete>
            </div>
            <div class="nav-contanier">
              <div
                class="item"
                v-for="(item,$i) in listData"
                :key="$i"
                v-if="item.childs.length > 0">
                <div class="item-header" :title="item.name">
                  {{item.name}}
                  <span @click="gotoSystem(item)">去首页</span>
                </div>
                <div class="item-content">
                  <div
                    class="item-content-li"
                    v-for="(item2,$i2) in item.childs"
                    v-if="item2.childs.length > 0"
                    :key="$i2" >
                    <h3 :title="item2.name">{{item2.name}}</h3>
                    <div
                      class="item-content-li-li"
                      v-for="(item3,$i3) in item2.childs"
                      @click="gotoSystem(item3, 'base')"
                      :key="$i3">{{item3.name}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-popover>
    </div>

    <!-- 常用导航菜单 -->
    <div class="nav-menu" style="flexGrow: 1;" v-if="showFixedNav">
      <div v-if="!isEditNavMenu" class="nav-menu-content nav-menuList-content">
        <span
          class="nav-item"
          v-for="(item) in setActaulNav"
          @click="gotoSystem(item, 'base')"
          :key="item.id"
        >{{item.name}}</span>
        <span class="nav-item" v-if="moreNavMenuList.length > 0">
            <el-dropdown placement="bottom">
                <i class="el-icon-more"></i>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(item,$index) in moreNavMenuList" @click="gotoSystem(item, 'base')" :key="$index">
                        {{item.name}}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </span>
      </div>
      <div class="nav-menu-content" v-else>
        <transition-group class="transition-group-nav">
          <span
            class="nav-item draggable"
            v-for="(item,$i) in navMenuList"
            :key="item.id"
            draggable="true"
            @dragstart="handleDragStart($event, item)"
            @dragover.prevent="handleDragOver($event, item)"
            @dragenter="handleDragEnter($event, item)"
            @dragend="handleDragEnd($event, item)"
            :title="item.name">
            <!-- <span>{{item.name}}</span> -->
            <el-tooltip class="item" effect="dark" :content="item.name">
                <span>{{item.name}}</span>
            </el-tooltip>
            <i class="el-icon-remove" @click.self.stop="deleteNavMenu($i,item)"></i>
          </span>
        </transition-group>
      </div>
        <!-- 添加标价导航常用菜单 -->
        <div>
            <el-popover
                placement="bottom"
                :visible-arrow="false"
                trigger="click"
                popper-class="nav-bar-el-popover"
                v-model="isEditNavMenu">
                <span
                slot="reference"
                class="nav-item choose"
                v-bind:class="{'active': isEditNavMenu}"
                title="编辑导航">
                <i
                    :class="!isEditNavMenu ? 'el-icon-plus' : 'el-icon-check'"
                    @click="handleEditNavMenu(isEditNavMenu)"></i>
                </span>
                <template>
                <div class="nav-content">
                    <div class="title-maxNum">
                    固定至导航栏({{selectNumber}}/<span class="max-num">{{maxNumber}}</span>)
                    </div>
                    <div class="nav-contanier commonNav">
                    <el-checkbox-group v-model="checkedNavMenu" :min="0" :max="10">
                        <div
                        class="item"
                        v-for="(item, $i) in commonNavList"
                        v-if="item.childs.length > 0"
                        :key="$i">
                        <div class="item-header">{{item.name}}</div>
                        <div class="item-el-checkbox">
                            <el-checkbox
                            v-for="item2 in item.childs"
                            style="margin-right: 12px;"
                            :label="item2.id"
                            :key="item2.id">{{item2.name}}</el-checkbox>
                        </div>
                        </div>
                    </el-checkbox-group>
                    </div>

                </div>
                <div class="nav-bottom">
                    <el-button type="default" @click="cancel()" size="small">取消</el-button>
                    <el-button type="primary" @click="handlerSelect()" size="small">确定</el-button>
                </div>
                </template>
            </el-popover>
        </div>
    </div>

    <div style="display: flex;">
      <slot>
        <!-- 自定义用户信息 -->
      </slot>
    </div>
  </div>
</template>

<script>
import querystring from 'querystring'
import axios from 'axios'
import md5 from 'md5'

export default {
    name: 'GlobalNav',
    props: {
        userId: {
            default: null,
        },
        toIndexUrl: {
            type: String,
            default: '',
        },
        maxNumber: {
            type: Number,
            default: 10,
        },
        showFixedNav: {
            type: Boolean,
            default: true
        },
        appId: {
            default: '6596619218873c11a1cea9b362ae4ccb',
        },
        appKey: {
            default: 'ff002937defe4e2f2dc31b8ecfb5bcd46abad4fa',
        },
    },
    data() {
        return {
            navValue: '',
            navShow: false,
            listData: [],
            navMenuList: [],
            setActaulNav: [],
            moreNavMenuList: [],
            isEditNavMenu: false,
            commonNavList: [],
            dragging: null,
            selectNumber: 0,
            checkedNavMenu: [],
            user_id: null,
        }
    },
    mounted() {
        window.onresize = () => {
            return (() => {
                this.setActaulNav = []
                this.showFixedNav && this.setActaulNavs()
            })()
        }
    },
    computed: {
        userIds() {
            return this.$store.state.userInfo.id
        },
    },
    watch: {
        userIds(val) {
        // 等待用户信息加载完毕后再请求
            if (val && Number(val) > 0) {
                this.getUserId()
                this.getNavMenuList()
            }
        },
        checkedNavMenu: {
            deep: true,
            handler(val) {
                let selectLen = val.length
                this.selectNumber = selectLen > 0 ? selectLen : 0
            },
        },
        navShow(val) {
            if (val) {
                this.getNavigationList()
            }
        },
        isEditNavMenu(val) {
            if (val) {
                this.getCommonNavList()
            }
        },
    },
    methods: {
        /**
         * 根据分辨率展现实际显示个人常用菜单
         */
        setActaulNavs() {
            this.$nextTick(() => {
                let navMenuList = [...this.navMenuList]
                let moreNavMenuList = []
                let setActaulNav = []
                let scrollWidth = 0
                for (let i = 0; i < navMenuList.length; i++) {
                    const element = navMenuList[i]
                    let width = document.getElementsByClassName('nav-menu')[0].clientWidth
                    width = width - 32 - 20

                    scrollWidth += element.name.length * 16 + 32

                    if (scrollWidth > width) {
                        moreNavMenuList.push(element)
                    } else {
                        setActaulNav.push(element)
                    }
                }

                this.setActaulNav = setActaulNav
                this.moreNavMenuList = moreNavMenuList
            })
        },
        /**
         * 去首页
         */
        gotoIndex() {
            if (this.toIndexUrl != '') {
                window.open(this.toIndexUrl)
            } else {
                this.$router.push('/')
            }
        },
        // 获取签名
        getSign(appId, appKey, ts, rand) {
            return md5(appKey + md5(appId + ts + rand))
        },
        /**
         * 获取签名信息
         */
        getSignature() {
            const ts = Date.now()
            const rand = Date.now()
            const appId = this.appId
            return {
                appId,
                ts,
                rand,
                sign: this.getSign(appId, this.appKey, ts, rand),
                user_id: this.user_id,
            }
        },
        /**
         * 获取用户id
         */
        getUserId() {
            const userInfo = this.$store.state.userInfo
            this.user_id = this.user_id || userInfo.id
        },
        /**
         * 编辑我的导航
         * @isEdit {Boolean} 编辑状态
         */
        handleEditNavMenu(isEdit) {
            if (isEdit) {
                const navIds = this.navMenuList.map((val) => val.id)
                this.updataNav(navIds.join(','))
            }
        },
        /**
         * 删除我的导航
         */
        deleteNavMenu(index, item) {
            this.navMenuList.splice(index, 1)
        },
        /**
         * 更新我的导航
         */
        async updataNav(nav_ids) {
            try {
                const param = this.getSignature()
                await this.form('https://yunyingapi.huatu.com/api/yy/v1/navigation/custom/update', {
                    nav_ids: nav_ids,
                    ...param,
                })
            } catch (error) {}
            this.getNavMenuList()
        },
        /**
         * 获取我的导航
         */
        async getNavMenuList() {
            let navMenuList = []
            try {
                const param = this.getSignature()
                const { data } = await this.form('https://yunyingapi.huatu.com/api/yy/v1/navigation/custom/index', {
                    alias: '',
                    ...param,
                })
                if (data && data.length > 0) {
                    navMenuList = data
                }
            } catch (error) {}
            this.navMenuList = navMenuList
            // 我的导航  == 默认勾选导航
            this.checkedNavMenu = this.navMenuList.map((val) => val.id)

            this.$nextTick(() => {
                this.showFixedNav && this.setActaulNavs()
            })
        },
        /**
         * 获取导航list
         */
        async getNavigationList() {
            try {
                const param = this.getSignature()
                const { data } = await this.form('https://yunyingapi.huatu.com/api/yy/v1/front/navigation/list', {
                    ...param,
                })
                this.listData = data
            } catch (error) {
                console.log(error)
            }
        },
        /**
         * 获取导航 勾选
         */
        async getCommonNavList() {
            let commonNavList = []
            try {
                const param = this.getSignature()
                const { data } = await this.form('https://yunyingapi.huatu.com/api/yy/v1/navigation/list_ext', {
                    user_id: this.user_id,
                    ...param,
                })
                if (data && data.length > 0) {
                    commonNavList = data
                }
            } catch (error) {}
            this.commonNavList = commonNavList
        },
        /**
         * 打开新窗口并添加访问记录
         */
        gotoSystem(item, type) {
            // 添加访问记录
            try {
                const param = this.getSignature()
                this.form('https://yunyingapi.huatu.com/api/yy/v1/front/navigation/click', {
                    n_id: item.id,
                    ...param,
                }).then((res) => {})
            } catch (error) {
                console.log(error)
            }
            // 跳转到新页面
            if (type && type == 'base') {
                window.open(item.base_url + item.url)
                return
            }
            if (item.url && item.url.length > 5) {
                window.open(item.url)
            }
        },
        /**
         * 确定勾选
         */
        handlerSelect() {
            this.updataNav(this.checkedNavMenu.join(','))
            this.cancel()
        },
        cancel() {
            this.isEditNavMenu = false
        },
        /**
         * 查询框
         */
        // eslint-disable-next-line
        searchNavValue() {},
        // eslint-disable-next-line
        navSelectChange(item) {},
        async querySearch(queryString, cb) {
            let navSelectList = []
            if (queryString && queryString != '') {
                try {
                    const param = this.getSignature()
                    const { data } = await this.form('https://yunyingapi.huatu.com/api/yy/v1/front/navigation/search', {
                        name: queryString,
                        ...param,
                    })
                    if (data && data.length > 0) {
                        navSelectList = data
                    }
                } catch (error) {}
            }
            cb(navSelectList) // 调用 callback 返回建议列表的数据
        },
        /**
         * 菜单拖拽排序  --start
         */
        handleDragStart(e, item) {
            this.dragging = item
        },
        handleDragEnd(e, item) {
            this.dragging = null
        },
        // 首先把div变成可以放置的元素，即重写dragenter/dragover
        handleDragOver(e) {
            e.dataTransfer.dropEffect = 'move' // e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
        },
        handleDragEnter(e, item) {
            e.dataTransfer.effectAllowed = 'move' // 为需要移动的元素设置dragstart事件
            if (item.id === this.dragging.id) {
                return
            }
            const newItems = [...this.navMenuList]
            const src = newItems.indexOf(this.dragging)
            const dst = newItems.indexOf(item)

            newItems.splice(dst, 0, ...newItems.splice(src, 1))

            this.navMenuList = newItems
        },
        /**
         * 菜单拖拽排序  --end
         */

        form (url, data = {}) {
            return axios.post(url,
                querystring.stringify(data),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            )
        }
    },
}
</script>

<style lang="scss" scoped>
$height: 54px;

.nav-bar {
  width: 100%;
  height: $height;
  background: #ffffff;
  display: flex;
  overflow: hidden;
  align-items: stretch;
  .nav-fixed {
    padding: 0 16px;
    position: relative;
    white-space: nowrap;
    &.splitline::before {
      position: absolute;
      content: "";
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 1px;
      height: 18px;
      background: #e6e6e6;
    }
  }

  .nav-menu {
    display: flex;
    overflow: hidden;
    align-items: stretch;
    padding: 0 16px;

    .nav-menu-content {
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      overflow-x: auto;
      //   影藏滚动条
      height: calc(100% + 20px);
    //   height: 100%;
    }
  }

  .transition-group-nav {
    height: $height;
    line-height: $height;
    display: flex;
    align-items: center;
  }

  .nav-item {
    display: inline-block;
    height: $height;
    line-height: $height;
    margin: 0 16px;
    font-weight: 400;
    font-size: 14px;
    color: #606266;
    cursor: pointer;
    outline: none !important;

    // &.choose {
      &:hover,
      &.active {
        color: #3370ff;
      }
    // }

    &.draggable {
      transition: all linear 0.3s;
      text-align: center;
      //   width: 80px;
      margin: 0 16px;
      padding: 0 8px;
      height: 26px;
      line-height: 26px;
      border-radius: 2px;
      border: 1px dotted #909399;
      position: relative;

      width: 20px;
      margin: 0 7px;

      span {
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .el-icon-remove {
        font-size: 10px;
        position: absolute;
        right: -5px;
        top: -5px;
        cursor: pointer;
      }
    }
  }
}
</style>

<style lang="scss">
$itemInterval: 90px;

.nav-bar-el-popover {
    width: calc(100% - 10px);
    left: 50% !important;
    transform: translateX(-50%);
    margin-top: 1px !important;
    border: 1px solid #EBEEF5 !important;
    height: calc(100% - 300px);
    overflow: hidden;
    border-radius: 0 !important;
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.2) !important;

  .nav-content {
    padding: 12px 36px 0px 36px;

    height: 100%;
    overflow: hidden;
    overflow-y: auto;


    .nav-contanier {
      display: flex;
      flex-wrap: wrap;
      margin-top: 10px;

      .item-header {
        position: relative;
        font-size: 16px;
        font-weight: 500;
        color: #303133;
        padding-left: 13px;
        height: 28px;
        line-height: 28px;

        &::before {
          position: absolute;
          content: "";
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 16px;
          background: #3370ff;
        }

        span {
          float: right;
          cursor: pointer;
          font-size: 14px;
          font-weight: 400;
          color: #3370ff;
        }
      }

      .item {
        width: calc(50% - #{$itemInterval/2});
        margin-bottom: 20px;
        &:nth-child(2n + 2) {
          margin-left: $itemInterval;
        }
      }

      & > div {
        .item-content {
          column-count: 4;
          column-gap: 0;
          .item-content-li {
            margin-bottom: 10px;
            break-inside: avoid;
            box-sizing: border-box;
            padding: 10px;

            h3 {
              font-size: 16px;
              font-weight: 500;
              color: #303133;
              padding-right: 10px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .item-content-li-li {
              margin-top: 15px;
              height: 20px;
              font-size: 14px;
              font-weight: 400;
              color: #606266;
              line-height: 20px;
              cursor: pointer;

              &:hover {
                color: #3370ff;
              }
            }
          }
        }
      }

      &.commonNav {
        height: calc(100% - 120px);
        overflow: hidden;
        overflow-y: auto;
        .item {
          width: 100%;
          margin-left: 0;
          margin-bottom: 25px;

          .item-el-checkbox {
            margin: 20px 0;
            >.el-checkbox {
                margin-bottom: 10px;
            }
          }
        }
      }
    }

    .title-maxNum {
      margin: 20px 0;
      font-size: 14px;
      font-weight: 400;
      color: #909399;
    }

  }

  .nav-bottom {
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 20px;
  }
}

.navbar-el-autocomplete {
  &.el-autocomplete-suggestion li {
    padding: 0;
  }
  .nav-el-autocomplete-item {
    // height: 34px;
    // line-height: 34px;
    font-size: 14px;
    color: #5a5e66;
    padding: 0 16px;
    &.active,
    &:hover {
      background: #f5f7fa;
      color: #3370ff;
    }
  }
}
</style>
