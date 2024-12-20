<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const form = ref({
  ip: '',
  sensors: [],
  loading: false
})

const onConnect = () => {
  console.log(form.value)
  if (!form.value.ip) {
    ElMessage({
      message: 'IP is empty',
      type: 'error'
    })
  } else {
    form.value.loading = true
    setTimeout(() => {
      form.value.loading = false
      ElMessage({
        message: 'connect IP:' + form.value.ip + ' success',
        type: 'success'
      })
    }, 1000)
  }
}

const onDisconnect = () => {
  ElMessage({
    message: 'disconnect IP:' + form.value.ip + 'success',
    type: 'success'
  })
}

const onStartTest = () => {
  ElMessage({
    message: 'start test',
    type: 'success'
  })
}
</script>

<template>
  <el-card>
    <div class="card-title">User</div>
    <el-form v-model="form">
      <!-- 输入 -->
      <el-form-item label="IP" prop="ip">
        <el-input v-model="form.ip" />
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item>
        <div class="btns">
          <el-button @click="onConnect" :loading="form.loading">connect</el-button>
          <el-button @click="onDisconnect">disconnect</el-button>
        </div>
      </el-form-item>
      <!-- 多选框 -->
      <el-form-item>
        <div class="sensors">
          <el-checkbox-group v-model="form.sensors">
            <el-checkbox label="1">Activate sensors</el-checkbox>
          </el-checkbox-group>
          <el-button @click="onStartTest">Start test</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped>
.el-button {
  margin: 10px;
}

.btns {
  flex-grow: 1;
  text-align: center;
}

.sensors {
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  align-items: center;
}
</style>
