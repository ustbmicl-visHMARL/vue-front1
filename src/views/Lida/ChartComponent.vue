<template>
  <el-table :data="dataRows" style="width: 100%">
    <el-table-column
      v-for="(header, index) in headers"
      :key="index"
      :prop="`${index}`"
      :label="header"
    />
  </el-table>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElTable } from 'element-plus'

const props = defineProps({
  data: Array
})
onMounted(() => {
  console.log('dataRows', dataRows)
})

const headers = computed(() => (props.data.length ? props.data[0] : []))
const dataRows = computed(() => props.data.slice(1))
</script>

<style scoped>
/* 可以在这里添加自定义的表格样式 */
.el-table th,
.el-table td {
  padding: 8px;
  text-align: left;
  border: 1px solid #ddd;
  white-space: nowrap;
  font-size: 15px;
}

.el-table th {
  background-color: #f2f2f2;
}

.el-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}
</style>
