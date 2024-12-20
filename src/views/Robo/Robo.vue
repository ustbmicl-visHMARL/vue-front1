<script setup lang="ts">
import User from './User.vue'
import Camera from './Camera.vue'

import LEDs from './LEDs.vue'
import Middle from './Middle.vue'

import IMU from './IMU.vue'
import Infrareds from './Infrareds.vue'
import TimeOfFlight from './TimeOfFlight.vue'
</script>

<template>
  <div class="robo">
    <div class="left">
      <User />
      <Camera />
    </div>
    <div class="middle">
      <LEDs />
      <Middle />
    </div>
    <div class="right">
      <IMU />
      <Infrareds />
      <TimeOfFlight />
    </div>
  </div>
</template>

<style scoped>
.robo {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 5px;
  height: 100%;
  width: 100%;
}
.left,
.middle,
.right {
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: space-between;
}
.left > div,
.middle > div,
.right > div {
  flex-grow: 1;
}
</style>
<style>
.card-title {
  color: #555;
  font-size: 20px;
  transform: translate(-5px, 0);
  font-weight: bold;
  font-family: monospace;
}

.el-card__body {
  padding-bottom: 7px;
  padding-top: 5px;
}
</style>
