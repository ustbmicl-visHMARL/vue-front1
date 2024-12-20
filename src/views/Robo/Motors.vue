<script setup lang="ts">
import { ref } from 'vue'
const Velocity = ref(0)
const formatTooltip = (value: number) => {
  return value * 5
}
</script>

<template>
  <el-card>
    <div class="card-title">Motors</div>
    <div class="slider-demo-block">
      <span>Velocity</span>
      <el-slider v-model="Velocity" height="120px" :format-tooltip="formatTooltip" />
    </div>
    <div class="control">
      <div></div>
      <el-button>F</el-button>
      <div></div>
      <el-button>L</el-button>
      <el-button>S</el-button>
      <el-button>R</el-button>
      <div></div>
      <el-button>B</el-button>
      <div></div>
    </div>
  </el-card>
</template>

<style scoped>
.control {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-gap: 10px;
}

.el-button {
  margin: 0;
}
</style>