<script setup>
import { ref, onMounted } from 'vue'
import ROSLIB from 'roslib'
import { useI18n } from '@/hooks/web/useI18n'
import { getRosConnection } from '@/utils/useRos' // 引入 useRos
const imageSrc = ref('') // 用于存储图像的 base64 字符串
const { t } = useI18n()
// // Base64 转换函数
// function arrayBufferToBase64(buffer) {
//   let binary = '';
//   const bytes = new Uint8Array(buffer);
//   const len = bytes.byteLength;
//   for (let i = 0; i < len; i++) {
//     binary += String.fromCharCode(bytes[i]);
//   }
//   return window.btoa(binary);
// }

// // 连接到 ROS 2
// const ros = getRosConnection();
// onMounted(() => {
//   const listener = new ROSLIB.Topic({
//     ros: ros,
//     name: '/camera/image_color',
//     messageType: 'sensor_msgs/msg/Image'  // 订阅 /camera/image_color 话题
//   });

//   listener.subscribe((message) => {

//     // 更新 imageSrc，以便显示图像
//     imageSrc.value = `data:image/png;base64,${message.data}`;

//   });
// });
const videoStreamUrl = ref('http://localhost:8080/stream?topic=/camera/image_color') // 指向 web_video_server 提供的视频流地址
</script>

<template>
  <el-card>
    <div class="card-title">{{ t('robo.cameraImage') }}</div>
    <div class="container">
      <!-- 使用 base64 图像数据更新 img 元素 -->
      <img :src="videoStreamUrl" :alt="t('robo.cameraImage')" />
    </div>
  </el-card>
</template>

<style scoped>
.el-card {
  margin-bottom: 5px;
}
.el-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.el-form-item {
  width: 300px;
}

.params {
  display: flex;
  flex-direction: row;
}

.right {
  width: 30%;
}

.el-radio-group {
  gap: 10px;
}

.el-checkbox-group {
  margin-top: 10px;
}
</style>
