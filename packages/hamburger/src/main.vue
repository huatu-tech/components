<template>
  <div class="hamburger-container"
    :title="isActive ? '收起':'展开'">
    <svg
      @click="toggleClick"
      class="hamburger"
      :class="{'is-active':isActive}" t="1533222727503"
      viewBox="0 0 1152 1024"
      version="1.1">
      <path fill="#595959" d="M1075.2 32H76.8C44.8 32 19.2 57.6 19.2 89.6s25.6 57.6 57.6 57.6h998.4c32 0 57.6-25.6 57.6-57.6 6.4-32-25.6-57.6-57.6-57.6zM1075.2 454.4H473.6c-32 0-57.6 25.6-57.6 57.6s25.6 57.6 57.6 57.6h601.6c32 0 57.6-25.6 57.6-57.6 6.4-32-25.6-57.6-57.6-57.6zM236.8 313.6L32 499.2c-6.4 6.4-6.4 19.2 0 25.6L236.8 704c6.4 6.4 12.8 0 12.8 0V326.4c6.4-6.4 0-12.8-6.4-12.8h-6.4zM1075.2 870.4H76.8c-32 0-57.6 25.6-57.6 57.6s25.6 57.6 57.6 57.6h998.4c32 0 57.6-25.6 57.6-57.6 6.4-32-25.6-57.6-57.6-57.6z" p-id="1807"></path>
    </svg>
  </div>
</template>

<script>
export default {
    name: 'Hamburger',
    props: {
        isActive: {
            type: Boolean,
            default: false
        },
        toggleClick: {
            type: Function,
            default: null
        }
    }
}
</script>

<style scoped>

.hamburger {
  display: inline-block;
  cursor: pointer;
  width: 20px;
  height: 20px;
  vertical-align: middle;
  transform: rotate(180deg);
  transition: .38s;
  transform-origin: 50% 50%;
}

.hamburger.is-active {
  transform: rotate(0deg);
}
</style>
