<template>
  <el-breadcrumb class="app-breadcrumb" v-if="levelList && levelList.length > 1" separator="/">
    <el-breadcrumb-item v-if="systemNameFlag" @click="systemClick" style="fontSize:14px;fontWeight:bold">
        <router-link to="/">
            <slot name="system-name"></slot>
        </router-link>
    </el-breadcrumb-item>
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <div v-if="item.meta.title">
          <span
              v-if="item.redirect==='noredirect' || index == levelList.length - 1"
              class="no-redirect">{{item.meta.title}}</span>
          <router-link v-else :to="{path: item.redirect || item.path, query: $route.query}">{{item.meta.title}}</router-link>
        </div>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
  <div v-else>
      <el-breadcrumb-item v-if="systemNameFlag" @click="systemClick" style="fontSize:14px;fontWeight:bold">
        <router-link to="/">
            <slot name="system-name"></slot>
        </router-link>
    </el-breadcrumb-item>
  </div>
</template>

<style scoped>
    .app-breadcrumb /deep/ .el-breadcrumb__item {
        float:none
    }
</style>


<script>

export default {
    name:'Breadcrumb',
    props: {
        systemNameFlag: {
            type: Boolean,
            default() {
                return false
            }
        }
    },
    created() {
        this.getBreadcrumb()
    },
    data() {
        return {
            levelList: null
        }
    },
    watch: {
        $route() {
            this.getBreadcrumb()
        }
    },
    methods: {
        getBreadcrumb() {
            let matched = this.$route.matched.filter(item => item.name)
            this.levelList = matched
        },
        systemClick() {
            console.log(1)
            this.$router.push('/')
        },
    }
}
</script>

<style lang="scss" scoped>
  .app-breadcrumb {
    padding-top: 12px;
    .el-breadcrumb__separator,
    .el-breadcrumb__inner.is-link,
    .el-breadcrumb__inner a {
        font-weight: normal;
    }
  }
  .app-breadcrumb.el-breadcrumb {
    font-size: 12px;
    margin-left: 16px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
