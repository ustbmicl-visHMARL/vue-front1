<template>
  <div>
    <table class="table-styled">
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in dataRows" :key="rowIndex">
          <td v-for="(value, colIndex) in row" :key="colIndex">{{ value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ChartComponent',
  props: {
    data: Array
  },
  computed: {
    headers() {
      return this.data.length ? this.data[0] : []
    },
    dataRows() {
      return this.data.slice(1)
    }
  }
}
</script>

<style scoped>
.table-styled {
  width: 100%;
  border-collapse: collapse;
}

.table-styled th,
.table-styled td {
  padding: 8px; /* 内边距 */
  text-align: left; /* 文本左对齐 */
  border: 1px solid #ddd; /* 边框样式 */
  white-space: nowrap; /* 防止内容自动换行，保持在一行内 */
  font-size: 15px;
  /* ... 其他单元格样式 ... */
}

.table-styled th {
  background-color: #f2f2f2; /* 表头背景色 */
}

.table-styled tbody tr:nth-child(even) {
  background-color: #f9f9f9; /* 隔行变色，增强可读性 */
}
</style>
