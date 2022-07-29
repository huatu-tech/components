/**
 * @file table的高度设置，使table的高度适应界面，使界面尽量在一屏显示，不出现滚动条
 * @author jiangjun
 * @usage 设置table的高度为tableHeight，同时需在data里设置height。
 * 使用方法：fixedHeight为页面固定高度，在crm项目中为顶导航的高度加上一些每个页面都有的padding
 *         tableHeight高度最小为300
 *         height为具体业务页面里所占用的高度
 *         clientHeight为浏览器高度
 *         tableHeight = clientHeight - fixedHeight - height （当小于300时，设为300）
 */

// 一些固定高度
// const fixedHeight = 60 + 16 * 2 + 24 * 2
// table的最小高度
const minHeight = 200

export default {
    data() {
        return {
            tableHeight: 350,
            // fixedHeight: 60 + 16 * 2 + 24 * 2
            height: 0
        }
    },
    created() {
        this.$nextTick(() => {
            this.calcHeight()
            window.addEventListener('resize', this.calcHeight)
        })
    },
    watch: {
        'pageDto.totalPageNum'(newVal, oldVal) {
            if (oldVal == 0 && newVal > 0) {
                this.calcHeight()
            }
        }
    },
    methods: {
        getClientHeight() {
            let clientHeight = 0
            if (document.body.clientHeight && document.documentElement.clientHeight) {
                clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight
            }
            else {
                clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight
            }
            return clientHeight
        },
        calcHeight() {
            setTimeout(() => {
                this.tableHeight = (this.getClientHeight() - this.height) <= minHeight ? minHeight : this.getClientHeight() - (this.height + 14)
                let table = this.$refs.table
                if (!table) {
                    return
                }
                let doLayout = null
                while (!doLayout) {
                    doLayout = table.doLayout
                    if (table.$children.length) {
                        table = table.$children[0]
                    } else {
                        break
                    }
                }

                // 重新计算高度
                if (doLayout) {
                    doLayout()
                }
            })
        }
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.calcHeight)
    }
}
