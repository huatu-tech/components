
<template>
    <div class="upload-wrapper">
        <div class="upload-btn">
            <slot></slot>
            <form ref="uploadForm">
                <input type="file" @change="fileInputChange" :accept="accept" :multiple="multiple">
            </form>
        </div>
        <span v-if="tip" class="tip" v-html="tip"></span>
    </div>
</template>

<script>
export default {
    props: {
        accept: {
            type: String,
            default: 'image/*'
        },
        multiple: {
            type: Boolean,
            default: false
        },
        tip: {
            type: String,
            default: ''
        }
    },
    methods: {
        fileInputChange: function (event) {
            let fileObj = event.srcElement || event.originalTarget
            this.$emit('filechange', fileObj.files)
            this.reset()
        },
        reset: function () {
            this.$refs['uploadForm'].reset()
        }
    }
}
</script>

<style lang="scss">
    .upload-wrapper {
        .tip {
            color: #999;
            line-height: 40px;
            float: left;
            height: 40px;
            margin-left: 10px;
        }
        .upload-btn {
            position: relative;
            overflow: hidden;
            float: left;
            .btn {
                font-size:14px;
                color:#6f7276;
                background:#f6f7f9;
                border:1px solid #e0e0e0;
                border-radius:4px;
                width:158px;
                height:34px;
                line-height: 34px;
                padding: 0px;
            }
            > div {
                text-align: left;
            }
            input[type="file"] {
                position: absolute;
                top: 0;
                right: 0;
                margin: 0;
                opacity: 0;
                -ms-transform: translate(-300px, 0) scale(4);
                -moz-transform: translate(-300px, 0) scale(4);
                -webkit-transform: translate(-300px, 0) scale(4);
                    -o-transform: translate(-300px, 0) scale(4);
                -webkit-transform: translate(-300px, 0) scale(4);
                        transform: translate(-300px, 0) scale(4);
                font-size: 23px;
                direction: ltr;
                cursor: pointer;
            }
        }
    }
</style>
