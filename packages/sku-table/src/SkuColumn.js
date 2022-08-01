
import { isEmpty } from 'lodash'

export default {
    // functional: true,
    name: 'SkuColumn',
    props: {
        renderHeader: Function,
        render: Function,
        align: {
            type: String,
            default: 'center'
        },
        prop: Object | String,
        label: String | Function | Object,
        className: String,
        width: String,
        minWidth: String | Number,
        fixed: String | Boolean,
        showOverflowTooltip: {
            type: Boolean,
            default: true,
        },
        columnKey: String,
        filterMultiple: Boolean,
        filters: Array,
        filterMethod: Function,
    },
    render(h, ctx) {
        const { $props } = this
        return h('el-table-column',
            {
                props: {
                    ...$props,
                },
                scopedSlots: {
                    default: scope => {
                        if ($props.render) {
                            return $props.render(h, scope)
                        }

                        if (isEmpty(scope.row[$props.prop])) return h('span', '-')

                        return h('span', scope.row[$props.prop])
                    },
                    header: scope => {
                        if ($props.renderHeader) {
                            return $props.renderHeader(h, scope)
                        }
                        return h('span', $props.label)
                    }
                }
            },

        )
    },
}
