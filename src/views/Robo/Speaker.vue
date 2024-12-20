<script setup lang="ts"></script>

<template>
  <el-card>
    <div class="card-title">Speaker</div>
    <div class="container">
      <el-button>1</el-button>
      <el-button>2</el-button>
      <el-button>3</el-button>
      <el-button>4</el-button>
      <el-button>5</el-button>
      <el-button />
    </div>
  </el-card>
</template>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}

.container > * {
  margin: 5px 0;
  width: calc(33.33% - 10px);
  /* 减去间距 */
}
</style>
