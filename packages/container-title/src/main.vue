<template>
    <div id="container" class="container-title">
        <div class="text">
            {{title}}
        </div>
        <div style="flex: 1; display: flex;justify-content: space-between">
          <div class="left">
            <slot name="left"></slot>
          </div>
          <div class="right">
              <slot name="right"></slot>
          </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ContainerTitle',
    props: {
        title: {
            type: String,
            default: ''
        }
    }
}
</script>
