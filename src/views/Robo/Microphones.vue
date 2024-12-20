<script lang="ts" setup>
import { ref } from 'vue'
const Rvalue = ref(0)
const Lvalue = ref(20)
const Bvalue = ref(30)
const Fvalue = ref(70)
</script>

<template>
  <el-card>
    <div class="card-title">Microphones</div>
    <div class="container">
      <div class="item">
        <span>Right</span>
        <el-progress :text-inside="true" :stroke-width="18" :percentage="Rvalue">
          <span>{{ Rvalue }}</span>
        </el-progress>
      </div>
      <div class="item">
        <span>Left</span>
        <el-progress :text-inside="true" :stroke-width="18" :percentage="Lvalue" status="success">
          <span>{{ Lvalue }}</span>
        </el-progress>
      </div>
      <div class="item">
        <span>Back</span>
        <el-progress :text-inside="true" :stroke-width="18" :percentage="Bvalue" status="warning">
          <span>{{ Bvalue }}</span>
        </el-progress>
      </div>
      <div class="item">
        <span>Front</span>
        <el-progress :text-inside="true" :stroke-width="18" :percentage="Fvalue" status="exception">
          <span>{{ Fvalue }}</span>
        </el-progress>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.container .el-progress--line {
  max-width: 600px;
}

.item {
  margin: 5px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item>*:nth-child(2) {
  width: 200px;
}
</style>