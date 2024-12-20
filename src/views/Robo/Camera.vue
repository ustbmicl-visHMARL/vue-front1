<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
const textarea = ref('')
const radio = ref('Color')
const rotate = ref([])
const height = ref('')
const width = ref('')
const zoom = ref('')
const onReceiving = () => {
  ElMessage({
    message: 'start receiving images',
    type: 'success'
  })
}
const onSend = () => {
  ElMessage({
    message: 'start sending images',
    type: 'success'
  })
}
</script>

<template>
  <el-card>
    <div class="card-title">Camera</div>
    <el-form>
      <el-form-item>
        <el-button @click="onReceiving" style="width: 300px">Start receiving images</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="textarea" :rows="8" type="textarea" />
      </el-form-item>
      <el-form-item class="params">
        <div class="left">
          <el-form-item label="Height">
            <el-input v-model="height" />
          </el-form-item>
          <el-form-item label="Width">
            <el-input v-model="width" />
          </el-form-item>
          <el-form-item label="Zoom">
            <el-input v-model="zoom" />
          </el-form-item>
        </div>
        <div class="right">
          <el-radio-group v-model="radio">
            <el-radio value="Color">Color</el-radio>
            <el-radio label="Grayscal">Grayscal</el-radio>
          </el-radio-group>
          <el-checkbox-group v-model="rotate">
            <el-checkbox label="1">rotate</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSend" style="width: 300px">Send paramters</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped>
.el-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.el-form-item {
  width: 300px;
}

.left > .el-form-item {
  width: 200px;
}

.params {
  display: flex;
  flex-direction: row;
}

.left {
  width: 70%;
  display: flex;
  flex-direction: column;
  gap: 10px;
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
