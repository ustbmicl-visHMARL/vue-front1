<script setup lang="ts">
</script>

<template>
  <el-card>
    <div class="card-title">Time of Flight</div>
    <div class="container">
      <div class="titiel">Distance (cm):</div>
      <div class="progress">
        <el-progress :text-inside="true" :percentage="50" :stroke-width="15" striped />
        <span>2m</span>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.progress {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-progress {
  width: 80%;
  margin-right: 10px;
}

.progress {
  margin: 5px auto 15px;
}

.progress span {
  margin-right: 50px;
}
</style>