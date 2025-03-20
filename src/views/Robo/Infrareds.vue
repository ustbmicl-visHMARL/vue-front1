<script setup>
import { ref, onMounted } from 'vue'
import ROSLIB from 'roslib'
import { getRosConnection } from '@/utils/useRos' // 引入 useRos
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
// 创建 IRs 数组
const IRs = ref([0, 0, 0, 0, 0, 0, 0, 0])

// 连接到ROS 2
const ros = getRosConnection()

onMounted(() => {
  const topics = ['/ps0', '/ps1', '/ps2', '/ps3', '/ps4', '/ps5', '/ps6', '/ps7']

  topics.forEach((topic, index) => {
    const listener = new ROSLIB.Topic({
      ros: ros,
      name: topic,
      messageType: 'sensor_msgs/msg/Range' // 更新为正确的消息类型
    })

    listener.subscribe((message) => {
      // 将范围数据从米转换为厘米，并保留两位小数
      const rangeInCm = (message.range * 100).toFixed(2) // 转换为厘米，并格式化为两位小数
      IRs.value[index] = parseFloat(rangeInCm) // 更新 IRs 数组
    })
  })
})

function clampedPercentage(item) {
  const percentage = (item / 5) * 100 // 计算百分比
  return Math.max(0, Math.min(percentage, 100)) // 限制在 0 到 100 之间
}
</script>

<template>
  <el-card>
    <div class="card-title">{{ t('robo.infrareds') }}</div>
    <div class="container">
      <div class="left">
        <!-- v-for -->
        <div class="item" v-for="(item, index) in IRs" :key="index">
          <span class="title">IR{{ index }}</span>
          <!-- 显示进度条 -->
          <el-progress
            :percentage="clampedPercentage(item)"
            :stroke-width="10"
            :show-text="false"
          />

          <!-- 显示实际的厘米值 -->
          <span>{{ item }} cm</span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.el-card {
  margin-bottom: 5px;
  width: 100%;
}
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  margin-top: 10px;
}
.left {
  display: flex;
  flex-wrap: wrap; /* 使进度条换行 */
  gap: 10px; /* 控制进度条之间的间距 */
  width: 100%; /* 控制左侧区域宽度 */
  margin-left: 30px;
  margin-top: 20px;
}

.item {
  width: 45%; /* 每个进度条的宽度，确保可以容纳 4 个进度条一行 */
  margin-bottom: 10px; /* 控制每个进度条的下间距 */
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
