<script setup lang="ts">
import { ref } from 'vue'

const Gyro = ref([0, 30, 20])
const Magnetometer = ref([11, 22, 13])
</script>

<template>
  <el-card>
    <div class="card-title">IMU</div>
    <div class="container">
      <el-form>
        <el-form-item label="Acceleration">
          <el-input />
        </el-form-item>
        <el-card class="block" />
      </el-form>
      <div class="right">
        <div class="bars gyrn">
          <span>Gyrn</span>
          <el-progress
            :text-inside="true"
            :stroke-width="18"
            :percentage="Gyro[0]"
            status="success"
          >
            <span>{{ Gyro[0] }}</span>
          </el-progress>
          <el-progress
            :text-inside="true"
            :stroke-width="18"
            :percentage="Gyro[1]"
            status="success"
          >
            <span>{{ Gyro[1] }}</span>
          </el-progress>
          <el-progress
            :text-inside="true"
            :stroke-width="18"
            :percentage="Gyro[2]"
            status="success"
          >
            <span>{{ Gyro[2] }}</span>
          </el-progress>
        </div>
        <div class="bars magnetometer">
          <span>Magnetometer</span>
          <el-progress :stroke-width="18" :percentage="Magnetometer[0]" status="success">
            <span>{{ Magnetometer[0] }}%</span>
          </el-progress>
          <el-progress :stroke-width="18" :percentage="Magnetometer[1]" status="success">
            <span>{{ Magnetometer[1] }}%</span>
          </el-progress>
          <el-progress :stroke-width="18" :percentage="Magnetometer[2]" status="success">
            <span>{{ Magnetometer[2] }}%</span>
          </el-progress>
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.el-card__body {
  padding-bottom: 0;
}

.container {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 15px;
}

.el-form {
  width: 55%;

  .block {
    height: 200px;
  }
}

.right {
  width: 40%;
}

.bars {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;
}

.magnetometer span {
  color: black;
  font-size: 14px;
}

.bars > * {
  margin: 2px 0;
}
</style>
