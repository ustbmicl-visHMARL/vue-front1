<script setup>
import { ref, onMounted } from 'vue'
import ROSLIB from 'roslib'
import { ElSwitch } from 'element-plus' // 引入开关组件
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
// 创建一个数组用于存储 10 个 LED 的状态，假设为整数值 (0 或 1)
const leds = ref(Array(10).fill(0)) // 假设所有 LED 初始为关闭（0）

// 连接到 ROS 2
const ros = new ROSLIB.Ros({
  url: 'ws://localhost:9090' // 根据你的 ROS 2 配置修改 WebSocket URL
})

// 发送 LED 状态到 ROS
const sendLEDState = (index, state) => {
  const ledTopic = new ROSLIB.Topic({
    ros: ros,
    name: `/led${index}`,
    messageType: 'std_msgs/msg/Int32' // 使用 Int32 类型
  })

  const message = new ROSLIB.Message({
    data: state // 发送的状态 0 或 1
  })

  ledTopic.publish(message) // 发布消息
}

onMounted(() => {
  const topics = [
    '/led0',
    '/led1',
    '/led2',
    '/led3',
    '/led4',
    '/led5',
    '/led6',
    '/led7',
    '/led8',
    '/led9'
  ]

  topics.forEach((topic, index) => {
    const listener = new ROSLIB.Topic({
      ros: ros,
      name: topic,
      messageType: 'std_msgs/msg/Int32' // 假设话题类型是 std_msgs/msg/Int32
    })

    listener.subscribe((message) => {
      leds.value[index] = message.data // 更新 LED 的状态（0 或 1）
    })
  })
})
</script>

<template>
  <el-card>
    <div class="card-title">{{ t('robo.LEDControl') }}</div>
    <div class="container">
      <div class="left">
        <!-- v-for 遍历所有 10 个 LED -->
        <div class="item" v-for="(led, index) in leds" :key="index">
          <div class="titleContent">
            <span class="title">LED{{ index }}</span>
          </div>
          <!-- 使用开关按钮控制 LED 状态 -->
          <!-- <el-switch
            v-model="leds[index]"
            :active-value="1"
            :inactive-value="0"
            :active-text="'ON'"
            :inactive-text="'OFF'"
            @change="sendLEDState(index, leds[index])"
          /> -->
          <el-switch
            v-model="leds[index]"
            :active-value="1"
            :inactive-value="0"
            @change="sendLEDState(index, leds[index])"
          />
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.el-card {
  margin-top: 5px;
  height: 20%;
}
.card-title {
  margin-bottom: 20px;
}
.el-form {
  width: 65%;
}

.left {
  display: flex;
  flex-wrap: wrap; /* 使进度条换行 */
  gap: 10px; /* 控制进度条之间的间距 */
  width: 100%; /* 控制左侧区域宽度 */
  margin-left: 20px;
  margin-top: 10px;
}

.el-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.el-checkbox-group > * {
  width: 33%;
}
.item {
  width: 45%; /* 每个进度条的宽度，确保可以容纳 4 个进度条一行 */
  margin-bottom: 10px; /* 控制每个进度条的下间距 */
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  margin-top: 10px;
}

.slider-demo-block {
  display: flex;
  flex-direction: column;
  gap: 5px;

  span {
    text-align: center;
  }
}
.titleContent {
  display: inline-block;
  margin-right: 10px;
}
.el-switch {
  width: 90px;
}
</style>
