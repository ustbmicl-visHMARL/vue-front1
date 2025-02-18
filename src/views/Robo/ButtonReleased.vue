<script setup lang="ts"></script>

<template>
  <el-card>
    <div class="card-title">Button</div>
    <div class="released">
      <el-button>Released</el-button>
    </div>
  </el-card>
</template>

<style scoped>
.el-card__body {
  padding-bottom: 0 !important;
}

.el-button {
  margin: 5px 0;
  width: 80%;
}

.released {
  text-align: center;
}
</style>
