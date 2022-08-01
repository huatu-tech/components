<template>
    <div>
        <el-table
            v-bind="$attrs"
            :data="tableData"
            :max-height="maxHeight || tableHeight"
            @filter-change="(filters) => {$emit('filter-change', filters)}"
            border>
            <div class="empty"
                slot="empty">
                <empty :text="emptyText" />
            </div>
            <SkuColumn
                v-for="item in cloumnData"
                :key="item.prop"
                v-bind="item" />
        </el-table>
        <div class="page-box" v-if="pagenation.count">
            <el-pagination
                @current-change="currentChange"
                @size-change="sizeChange"
                :current-page.sync="pagenation.pageNum"
                :page-size="pagenation.pageSize"
                :layout="layout"
                :total="pagenation.count"
                background />
        </div>
    </div>
</template>
<script>
import setTableHeight from '../../../src/mixins/setTableHeight.js'
import SkuColumn from './SkuColumn.js'
export default {
    name: 'SKUTable',
    components: {
        SkuColumn,
    },
    mixins: [setTableHeight],
    props: {
        layout: {
            type: String,
            default: 'total, sizes, prev, pager, next, jumper'
        },
        cloumnData: {
            type: Array,
            default: () => ([])
        },
        tableData: {
            type: Array,
            default: () => ([])
        },
        emptyText: {
            type: String,
            default: '暂无数据'
        },
        maxHeight: {
            type: [Number, String],
            default: ''
        },
        pagenation: {
            type: Object,
            default: () => ({
                pageNum: 1,
                pageSize: 20,
                count: 0,
            })
        }
    },
    methods: {
        currentChange(page) {
            this.$emit('currentChange', page)
        },
        sizeChange(pageSize) {
            this.$emit('sizeChange', pageSize)
        }
    }
}
</script>
<style lang="scss" scoped>
.page-box{
    padding-top: 10px;
    display: flex;
    justify-content: flex-end;
}
</style>
