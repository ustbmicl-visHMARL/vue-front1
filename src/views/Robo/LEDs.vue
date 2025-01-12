<script setup>
import { ref, onMounted } from 'vue';
import ROSLIB from 'roslib';
import { getRosConnection } from '@/utils/useRos';  // 引入 useRos

const leds = ref(Array(10).fill(false));  // 假设所有 LED 都是关的

const ros = getRosConnection();

onMounted(() => {
  const topics = ['/led0', '/led1', '/led2', '/led3', '/led4', '/led5', '/led6', '/led7', '/led8', '/led9'];

  topics.forEach((topic, index) => {
    const listener = new ROSLIB.Topic({
      ros: ros,
      name: topic,
      messageType: 'std_msgs/msg/Int32', // 假设话题类型是 std_msgs/msg/Bool
    });

    listener.subscribe((message) => {
      leds.value[index] = message.data;  // 更新 LED 的状态（true 或 false）
    });
  });
});
</script>

<template>
  <el-card>
    <div class="card-title">LED Control</div>
    <div class="container">
      <div class="left">
        <!-- v-for 遍历所有 10 个 LED -->
        <div class="item" v-for="(led, index) in leds" :key="index">
          <span class="title">LED{{ index }}</span>
          <!-- 使用开关按钮显示 LED 的状态 -->
          <el-switch v-model="leds[index]" active-color="#13ce66" inactive-color="#ff4949" />
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
  flex-wrap: wrap;  /* 使进度条换行 */
  gap: 10px;  /* 控制进度条之间的间距 */
  width: 100%;  /* 控制左侧区域宽度 */
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
  width: 45%;  /* 每个进度条的宽度，确保可以容纳 4 个进度条一行 */
  margin-bottom: 10px;  /* 控制每个进度条的下间距 */

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
</style>
