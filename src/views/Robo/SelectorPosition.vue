<script setup lang="ts">
import { ref, computed } from 'vue'

const value = ref(0)
const angle = computed(() => Math.round(value.value * 3.6)) // 假设最大值100
const isDragging = ref(false)

const startDrag = (event: any) => {
  isDragging.value = true
  // 将鼠标设置为pointer
  document.body.style.cursor = 'pointer'
  const center = event.currentTarget.getBoundingClientRect()
  const centerX = center.left + center.width / 2
  const centerY = center.top + center.height / 2

  const onMouseMove = (e: any) => {
    if (!isDragging.value) return
    const dx = e.clientX - centerX
    const dy = e.clientY - centerY
    const radians = Math.atan2(dy, dx)
    const degrees = (radians * (180 / Math.PI) + 90 + 360) % 360 // 保持正角度
    value.value = Math.round((degrees / 360) * 100) // 最大值100
  }

  const onMouseUp = () => {
    isDragging.value = false
    // 将鼠标设置为默认
    document.body.style.cursor = 'default'
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}
</script>

<template>
  <el-card>
    <div class="card-title">Selector</div>
    <div class="dial-container" @mousedown="startDrag">
      <div class="dial-pointer" :style="{ transform: `translateY(5px) rotate(${angle - 13}deg)` }">
        <div class="inner"></div>
      </div>
      <div class="dial-value">{{ angle }}</div>
    </div>
  </el-card>
</template>

<style scoped>
.dial-container {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid #ccc;
  position: relative;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.inner {
  width: 14px;
  height: 14px;
  background: #ccc;
  border-radius: 50%;
  margin: 1px;
}

.dial-pointer {
  width: 16px;
  /* 直径为16px */
  height: 16px;
  background: #000;
  border-radius: 50%;
  /* 圆形 */
  position: absolute;
  top: 0;
  left: 50%;
  transform-origin: 0 34px;
  transform: rotate(0deg);
  cursor: pointer;
}

.dial-value {
  font-size: 14px;
  font-weight: bold;
  position: absolute;
}
</style>
