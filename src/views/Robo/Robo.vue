<script setup lang="ts">
import User from './User.vue'
import Camera from './Camera.vue'

import LEDs from './LEDs.vue'

import RoboControl from './RoboControl.vue'

import Infrareds from './Infrareds.vue'
import TimeOfFlight from './TimeOfFlight.vue'
</script>

<template>
  <div class="robo">
    <div class="left">
      <User />
      <RoboControl />
    </div>
    <div class="middle">
      <Camera />
      <LEDs />
    </div>
    <div class="right">
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
  user-select: none;
}
.left,
.middle,
.right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.left,
.right {
  gap: 5px;
}
.left > div,
.middle > div,
.right > div {
  flex-grow: 1;
}

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
