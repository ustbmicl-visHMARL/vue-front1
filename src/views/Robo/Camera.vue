<script setup>
import { ref, onMounted } from 'vue';
import ROSLIB from 'roslib';
import { getRosConnection } from '@/utils/useRos';  // 引入 useRos
const imageSrc = ref('');  // 用于存储图像的 base64 字符串

// Base64 转换函数
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// 连接到 ROS 2
const ros = getRosConnection();
onMounted(() => {
  const listener = new ROSLIB.Topic({
    ros: ros,
    name: '/camera/image_color',
    messageType: 'sensor_msgs/msg/Image'  // 订阅 /camera/image_color 话题
  });

  listener.subscribe((message) => {
    // 获取图像数据
    const imageData = message.data;  // imageData 是一个包含图像像素的 Uint8Array

    // 假设图像是 JPEG 编码，你可以根据实际情况调整编码类型
    const byteArray = new Uint8Array(imageData);

    // 转换 Uint8Array 到 base64 字符串
    const base64String = arrayBufferToBase64(byteArray.buffer);

    // 更新 imageSrc，以便显示图像
    imageSrc.value = `data:image/png;base64,${base64String}`;

  });
});
</script>

<template>
  <el-card>
    <div class="card-title">Camera Image</div>
    <div class="container">
      <!-- 使用 base64 图像数据更新 img 元素 -->
      <img :src="imageSrc" alt="Camera Image" />
    </div>
  </el-card>
</template>

<style scoped>
.el-card {
  height: 20%;
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
