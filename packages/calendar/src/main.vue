<template>
    <div class="calendar"
        :style="{width: this.width ? this.width + 'px' : '100%'}">
        <ul class="control-bar" v-if="showControl">
            <li @click="turn($event, 'last')" title="上月">
                <icon name="last" scale="2"></icon>
            </li>
            <li @click="turn($event, 'next')" title="下月">
                <icon name="next" scale="2"></icon>
            </li>
            <li>{{date|formatDate('yyyy年MM月')}}</li>
        </ul>
        <!-- 周显示 -->
        <slot name="weekNums">
            <ul class="week-nums">
                <li v-for="week, column in [1, 2, 3, 4, 5, 6, 0]"
                :key="column">
                    周{{week|week}}
                </li>
            </ul>
        </slot>
        <!-- 日历单元显示 -->
        <slot name="units">
            <ul class="units">
                <li v-for="item, index in days"
                :key="index"
                :class="{'active': item.isToday, 'current-month-day': item.isInCurrentMonth}">
                    <div class="day-str">
                        {{item.day}}
                    </div>
                </li>
            </ul>
        </slot>
    </div>
</template>

<script>

import calendar from '@/mixins/calendar'

export default {
    name: 'Calendar',
    mixins: [calendar],
    props: {
        /**
         * 日历的宽度，默认是100%
         */
        width: {},
        /**
         * 日历的所在时间
         */
        value: {
            default () {
                return new Date()
            }
        }
    }
}
</script>
