<script setup lang="ts">
import Speaker from './Speaker.vue'
import Motors from './Motors.vue'
import Microphones from './Microphones.vue'

import ButtonReleased from './ButtonReleased.vue'
import Battery from './Battery.vue'
import MicroSD from './MicroSD.vue'
import SelectorPosition from './SelectorPosition.vue'
</script>

<template>
  <div class="middle">
    <div class="left">
      <Speaker />
      <Motors />
      <Microphones />
    </div>
    <div class="right">
      <ButtonReleased />
      <Battery />
      <MicroSD />
      <SelectorPosition />
    </div>
  </div>
</template>

<style scoped>
.middle {
  margin-top: 0;
  display: grid !important;
  grid-template-columns: 2fr 1fr;
  gap: 5px;
}

.middle > div {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
}
.el-card {
  margin-bottom: 0;
}
.left .el-card:nth-child(1) {
  margin-bottom: 5px;
}
.left .el-card:nth-child(2) {
  margin-bottom: 5px;
}
.left > div {
  flex-grow: 1;
}
</style>
