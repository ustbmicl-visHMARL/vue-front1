<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'

import { createRosConnection, getRosConnection, closeRosConnection } from '@/utils/useRos'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
// 表单数据
const form = ref({
  ip: '',
  sensors: [],
  loading: false
})

// 连接按钮事件
const onConnect = async () => {
  if (!form.value.ip) {
    await ElMessageBox.alert('IP is empty', 'Error', {
      type: 'error',
      confirmButtonText: 'OK'
    })
  } else {
    form.value.loading = true
    setTimeout(async () => {
      // 调用 useRos 创建连接
      createRosConnection(form.value.ip)

      form.value.loading = false
      await ElMessageBox.alert(`Connected to IP: ${form.value.ip}`, 'Success', {
        type: 'success',
        confirmButtonText: 'OK'
      })
    }, 1000)
  }
}

// 断开连接按钮事件
const onDisconnect = async () => {
  if (getRosConnection()) {
    closeRosConnection() // 关闭现有的连接

    await ElMessageBox.alert(`Disconnected from IP: ${form.value.ip}`, 'Success', {
      type: 'success',
      confirmButtonText: 'OK'
    })
  } else {
    await ElMessageBox.alert('No active connection to disconnect', 'Error', {
      type: 'error',
      confirmButtonText: 'OK'
    })
  }
}

// 测试按钮事件
const onStartTest = async () => {
  await ElMessageBox.alert('Starting test...', 'Test Started', {
    type: 'success',
    confirmButtonText: 'OK'
  })
}
</script>

<template>
  <el-card>
    <div class="card-title">{{ t('robo.user') }}</div>
    <el-form v-model="form">
      <!-- 输入 -->
      <el-form-item label="IP" prop="ip">
        <el-input v-model="form.ip" />
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item>
        <div class="btns">
          <el-button @click="onConnect" :loading="form.loading">{{ t('robo.connect') }}</el-button>
          <el-button @click="onDisconnect">{{ t('robo.disconnect') }}</el-button>
        </div>
      </el-form-item>
      <!-- 多选框
      <el-form-item>
        <div class="sensors">
          <el-checkbox-group v-model="form.sensors">
            <el-checkbox label="1">Activate sensors</el-checkbox>
          </el-checkbox-group>
          <el-button @click="onStartTest">Start Test</el-button>
        </div>
      </el-form-item> -->
    </el-form>
  </el-card>
</template>

<style scoped>
.el-card {
  height: 0;
}

.el-button {
  margin: 10px;
}

.btns {
  flex-grow: 1;
  text-align: center;
}

form {
  margin-top: 8px;
}
</style>
