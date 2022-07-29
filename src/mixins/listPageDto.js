
import getPageDto from '../functions/getPageDto'

export default {
    data () {
        return {
            pageDto: getPageDto()
        }
    },
    methods: {
        /**
         * 刷新列表
         */
        refresh () {
            this.pageDto.pageNum = 1
            this.fetchList()
        },
        /**
         * 翻页
         */
        changePage (pageNum) {
            this.pageDto.pageNum = pageNum
            this.fetchList()
        },

        /**
         * 改变页面条数
         */
        changeSize (pageSize) {
            this.pageDto.pageSize = pageSize
            this.pageDto.pageNum = 1
            this.fetchList()
        }
    }
}
