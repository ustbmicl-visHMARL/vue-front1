<script setup lang="ts">
import { ref } from 'vue';

const IRs = ref([0, 12, 33, 23, 44, 21, 31, 53])
</script>

<template>
  <el-card>
    <div class="card-title">Infrareds</div>
    <div class="container">
      <div class="left">
        <!-- v-for -->
        <div class="item" v-for="(item, index) in IRs" :key="index">
          <span class="title">IR{{ index }}</span>
          <el-progress :percentage="item" :stroke-width="10" />
        </div>
      </div>
      <div class="right">
        <div class="r-title1">Ambient light</div>
        <div class="r-title2">
          <span>IR check:</span>
          <span>IR address:</span>
          <span>IR data:</span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.left {
  width: 50%;
}

.right {
  width: 50%;
  height: 100%;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.r-title1 {
  margin-left: 20px;
}

.r-title2 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 80px 40px;
}

.el-progress {
  width: 80%;
}
</style>