<script setup>
import { ref, onMounted, computed } from 'vue'
import ROSLIB from 'roslib'
import { getRosConnection } from '@/utils/useRos' // 引入 useRos
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
// 用于存储 TOF 传感器的距离数据
const distance = ref(0)

// 连接到 ROS 2
const ros = getRosConnection()

onMounted(() => {
  const listener = new ROSLIB.Topic({
    ros: ros,
    name: '/tof',
    messageType: 'sensor_msgs/msg/Range' // 订阅 sensor_msgs/msg/Range 类型的消息
  })

  listener.subscribe((message) => {
    // 获取距离值并更新
    distance.value = message.range // 获取距离值
  })
})

// 最大值假设为 10 米，您可以根据需要调整此值
const maxDistance = 2

// 计算进度条的百分比，确保其范围在 0-100 之间
const clampedPercentage = computed(() => {
  const percentage = (distance.value / maxDistance) * 100
  return Math.max(0, Math.min(percentage, 100)) // 强制百分比范围在 0-100 之间
})
</script>

<template>
  <el-card>
    <div class="card-title">{{ t('robo.TOFSensorDistance') }}</div>
    <div class="container">
      <div class="item">
        <!-- 显示距离值 -->
        <p>{{ distance }} m</p>

        <!-- 如果需要显示进度条，假设最大距离为 2 米 -->
        <el-progress :percentage="clampedPercentage" :stroke-width="10" :show-text="false" />
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
