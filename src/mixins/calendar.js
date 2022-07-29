
export default {
    props: {
        // 是否显示切换上月、下月控制栏
        showControl: {
            default: false
        }
    },
    computed: {
        days() {
            let date = new Date(this.date)
            let month = date.getMonth()
            let today = new Date()
            let year = date.getFullYear()
            let firstDay = new Date(year, month, 1)
            let lastDay = new Date(year, month + 1, 0)
            let result = []
            for (let i = firstDay.getDate(), l = lastDay.getDate(); i <= l; i++) {
                result.push({
                    isInCurrentMonth: true,
                    isToday: i === today.getDate() && month === today.getMonth() ? true : false,
                    day: i
                })
            }
            let firstDayWeek = firstDay.getDay()
            let lastDayWeek = lastDay.getDay()
            // 补当前月份中没有的日期，月头补到周一
            while (firstDayWeek != 1) {
                firstDay = new Date(firstDay.setDate(firstDay.getDate() - 1))
                result.unshift({
                    isInCurrentMonth: false,
                    day: firstDay.getDate()
                })
                firstDayWeek = firstDay.getDay()
            }
            // 补当前月份中没有的日期，月尾补到周日
            while (lastDayWeek != 0) {
                lastDay = new Date(lastDay.setDate(lastDay.getDate() + 1))
                result.push({
                    isInCurrentMonth: false,
                    day: lastDay.getDate()
                })
                lastDayWeek = lastDay.getDay()
            }
            return result
        }
    },
    data () {
        let today = new Date()
        return {
            date: this.value || new Date(today.getFullYear(), today.getMonth())
        }
    },
    methods: {
        turn (event, direction) {
            let date = new Date(this.date)
            let month = date.getMonth()
            let turnMonth = direction == 'last' ? month - 1 : month + 1
            this.date = new Date(date.setMonth(turnMonth))
            this.$emit('input', this.date)
            this.$emit('change', this.date)
        }
    }
}