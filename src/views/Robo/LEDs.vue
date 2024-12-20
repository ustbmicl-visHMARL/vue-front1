<script setup lang="ts">
import { ref } from 'vue'
const form = ref({
  leds: []
})
const Rvalue = ref(0)
const Gvalue = ref(0)
const Bvalue = ref(0)

const formatTooltip = (val: number) => {
  return (val * 2.56).toFixed()
}
</script>

<template>
  <el-card>
    <div class="card-title">LEDs</div>
    <div class="container">
      <el-form v-model="form">
        <el-checkbox-group v-model="form.leds">
          <el-checkbox label="LED0">LED0</el-checkbox>
          <el-checkbox label="LED_RGB5">LED_RGB5</el-checkbox>
          <el-checkbox label="LED_RGB1">LED_RGB1</el-checkbox>
          <el-checkbox label="LED6">LED6</el-checkbox>
          <el-checkbox label="LED2">LED2</el-checkbox>
          <el-checkbox label="LED_RGB7">LED_RGB7</el-checkbox>
          <el-checkbox label="LED_RGB3">LED_RGB3</el-checkbox>
          <el-checkbox label="BODY_LED8">BODY_LED8</el-checkbox>
          <el-checkbox label="LED4">LED4</el-checkbox>
          <el-checkbox label="FRONT_LED9">FRONT_LED9</el-checkbox>
        </el-checkbox-group>
      </el-form>
      <div class="slider-demo-block">
        <span>R</span>
        <el-slider v-model="Rvalue" vertical height="120px" :format-tooltip="formatTooltip" />
      </div>
      <div class="slider-demo-block">
        <span>G</span>
        <el-slider v-model="Gvalue" vertical height="120px" :format-tooltip="formatTooltip" />
      </div>
      <div class="slider-demo-block">
        <span>B</span>
        <el-slider v-model="Bvalue" vertical height="120px" :format-tooltip="formatTooltip" />
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.el-card {
  margin-bottom: 5px;
}
.el-form {
  width: 65%;
}

.el-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.el-checkbox-group > * {
  width: 33%;
}

.container {
  display: flex;
}

.slider-demo-block {
  display: flex;
  flex-direction: column;
  gap: 5px;

  span {
    text-align: center;
  }
}
</style>
