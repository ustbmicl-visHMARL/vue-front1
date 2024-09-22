<template>
  <div class="lida">
    <div class="sidebar">
      <div class="file-upload-wrapper">
        <!-- 使用 label 包裹 input，并通过 for 和 id 关联 -->
        <label for="file-upload" class="file-upload-label">
          选择上传 (limit 200MB)
          <span v-if="selectedFileName">{{ selectedFileName }}</span>
          <!-- 通过 CSS 隐藏 input 元素 -->
          <input
            type="file"
            id="file-upload"
            @change="onFileChange"
            accept=".csv"
            style="display: none"
          />
        </label>
      </div>
      <p class="tip">2、描述你的目标</p>
      <!-- 新增的 input 输入框 -->
      <input
        type="text"
        class="goal-input"
        placeholder="请输入你的目标描述"
        v-model="formData.goal"
      />
      <p class="tip">3、选择一个可视化库</p>
      <!-- 新增的下拉框 -->
      <select v-model="formData.category" @change="onCategoryChange" class="library">
        <option value="seaborn" disabled>seaborn(目前有bug)</option>
        <option value="matplotlib">matplotlib</option>
        <option value="plotly">plotly</option>
      </select>
      <div class="button-wrapper">
        <button @click="submitForm" class="beautiful-button">生成</button>
      </div>
    </div>

    <div class="image-display">
      <p>数据摘要</p>
      <div class="gray-box">
        <ChartComponent :data="uploadedData.chartData" />
      </div>
      <p>选择一个可视化目标</p>
      <div class="goal">
        <select v-model="selectedGoal">
          <option
            v-for="goal in uploadedData.goalData"
            :value="(goal as any).value"
            :key="JSON.stringify(goal)"
          >
            {{ (goal as any).name }}
          </option>
        </select>
      </div>
      <div class="gray-box1" :style="grayBoxStyle">
        <img
          v-if="selectedImageUrl"
          :src="selectedImageUrl"
          alt="Selected Image"
          style="width: 100%; height: auto"
        />
      </div>
      <p>可视化代码</p>
      <div class="gray-box1">
        <pre><code>{{ selectedCode }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import axios from 'axios'
import ChartComponent from './ChartComponent.vue'
import { computed, reactive, ref, watch } from 'vue'

const formData = reactive({
  category: '',
  goal: ''
})
const selectedFileName = ref('')
const uploadedData = reactive({
  chartData: [],
  goalData: []
})
const selectedGoal = ref('')
const selectedImageUrl = ref('')
const selectedCode = ref('')

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    selectedFileName.value = file.name
  } else {
    selectedFileName.value = ''
  }
}

const onCategoryChange = () => {
  // 处理类别改变的逻辑，如果需要的话
  console.log('onCategoryChange')
}

const submitForm = async () => {
  const formDataToSend = new FormData()
  formDataToSend.append('file', '')
  if (formData.category.trim() !== '') {
    formDataToSend.append('category', formData.category)
  }
  if (formData.goal.trim() !== '') {
    formDataToSend.append('goal', formData.goal)
  }
  try {
    const response = await axios.post(
      'http://127.0.0.1:9540/lida/front/test/sendForm',
      formDataToSend,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    uploadedData.chartData = response.data.chartData
    uploadedData.goalData = response.data.goalData
  } catch (error) {
    console.error('错误:', error)
  }
}

const grayBoxStyle = computed(() => {
  return selectedImageUrl.value ? {} : { backgroundColor: '#f0f0f0' }
})

watch(selectedGoal, (newValue) => {
  const goal: any = uploadedData.goalData.find((goal: any) => goal.value === newValue)
  if (goal) {
    selectedImageUrl.value = 'data:image/png;base64,' + goal.imageUrl
    selectedCode.value = goal.code
  } else {
    selectedImageUrl.value = ''
    selectedCode.value = ''
  }
})
</script>

<style>
.lida .el-col {
  margin-left: 100px;
}
</style>
