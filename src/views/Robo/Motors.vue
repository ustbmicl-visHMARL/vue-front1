<script setup>
import { ref, onMounted } from 'vue';
import ROSLIB from 'roslib';
import { ElProgress, ElButton } from 'element-plus';
import { getRosConnection } from '@/utils/useRos';  // 引入 useRos

// 机器人的线速度和角速度
const linearSpeed = ref(0);  // 线速度
const angularSpeed = ref(0);  // 角速度

// 创建 ROS 连接
const ros = getRosConnection();

// 创建一个 cmd_vel 话题发布者
const cmdVel = new ROSLIB.Topic({
  ros: ros,
  name: '/cmd_vel',
  messageType: 'geometry_msgs/msg/Twist'  // 机器人控制命令的消息类型
});

// 按钮控制机器人的前进、后退、左转、右转
function moveForward() {
  const twist = new ROSLIB.Message({
    linear: { x: 0.5, y: 0, z: 0 },  // 前进
    angular: { x: 0, y: 0, z: 0 }
  });
  cmdVel.publish(twist);
  linearSpeed.value = 0.5;
  angularSpeed.value = 0;
}

function moveBackward() {
  const twist = new ROSLIB.Message({
    linear: { x: -0.5, y: 0, z: 0 },  // 后退
    angular: { x: 0, y: 0, z: 0 }
  });
  cmdVel.publish(twist);
  linearSpeed.value = -0.5;
  angularSpeed.value = 0;
}

function turnLeft() {
  const twist = new ROSLIB.Message({
    linear: { x: 0, y: 0, z: 0 },
    angular: { x: 0, y: 0, z: 1 }  // 向左转
  });
  cmdVel.publish(twist);
  linearSpeed.value = 0;
  angularSpeed.value = 1;
}

function turnRight() {
  const twist = new ROSLIB.Message({
    linear: { x: 0, y: 0, z: 0 },
    angular: { x: 0, y: 0, z: -1 }  // 向右转
  });
  cmdVel.publish(twist);
  linearSpeed.value = 0;
  angularSpeed.value = -1;
}

// 停止机器人
function stop() {
  const twist = new ROSLIB.Message({
    linear: { x: 0, y: 0, z: 0 },
    angular: { x: 0, y: 0, z: 0 }
  });
  cmdVel.publish(twist);
  linearSpeed.value = 0;
  angularSpeed.value = 0;
}
</script>

<template>
  <el-card>
    <div class="card-title">Robot Control</div>
    <div class="container">
      <div class="left">
        <!-- 控制按钮 -->
        <el-button @click="moveForward" style="margin-bottom: 10px">Move Forward</el-button>
        <el-button @click="moveBackward" style="margin-bottom: 10px">Move Backward</el-button>
        <el-button @click="turnLeft" style="margin-bottom: 10px">Turn Left</el-button>
        <el-button @click="turnRight" style="margin-bottom: 10px">Turn Right</el-button>
        <el-button @click="stop" type="danger">Stop</el-button>
      </div>
      <div class="right">
        <!-- 速度进度条 -->
        <div>
          <span>Linear Speed</span>
          <el-progress :percentage="(linearSpeed * 100)" :stroke-width="20" :text-inside="true" :show-text="false" />
        </div>
        <div>
          <span>Angular Speed</span>
          <el-progress :percentage="(angularSpeed * 100)" :stroke-width="20" :text-inside="true" :show-text="false" />
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
}

.left {
  display: flex;
  flex-direction: column;
  width: 45%;
  margin-top: 5%;
}

.right {
  display: flex;
  flex-direction: column;
  width: 45%;
  margin-top: 5%;
}

.el-progress {
  margin: 10px 0;
}
</style>

