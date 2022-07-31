<template>
    <ul class="operation-log">
        <template v-if="data && data.length">
            <li
                v-for="(item,index) in data"
                :key="index">
                <p>
                    <span>{{item.operatorName}}</span>
                    <span>{{(item.operateTime||item.createTime)|formatDate('yyyy/MM/dd HH:mm')}}</span>
                </p>
                <div v-html="item.content || '-'" style="word-break:break-all"></div>
                <el-tag class="tag" v-if="item.operationTypeStr === '代收代缴'" type="warning" size="mini">{{item.operationTypeStr}}</el-tag>
                <el-tag class="tag" v-else size="mini">{{item.operationTypeStr}}</el-tag>
            </li>
        </template>
        <p v-else class="none-list">没有操作日志</p>
    </ul>
</template>

<script>
export default {
    name:'OperationLog',
    props: {
        data: {
            defalut() {
                return []
            }
        }
    }
}
</script>
