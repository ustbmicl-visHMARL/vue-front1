<template>
  <ContentWrap :title="t('lidaDemo.title')" :message="t('lidaDemo.message')">
    <!--
    <div class="lida">
      <Form
        :schema="schema"
        v-if="!uploadedData.chartData.length"
        label-width="auto"
        :label-position="'top'"
      />

      <div class="image-display" v-if="uploadedData.chartData.length" ref="imageDisplayRef">
        <h3>数据摘要</h3>
        <ChartComponent :data="uploadedData.chartData" />
        <ElDivider />
        <h3>选择一个可视化目标</h3>
        <el-select v-model="selectedGoal">
          <el-option
            v-for="goal in uploadedData.goalData"
            :value="(goal as any).value"
            :key="JSON.stringify(goal)"
          >
            {{ (goal as any).value }}
          </el-option>
        </el-select>
        <div class="pic" :style="grayBoxStyle">
          <img
            v-if="selectedImageUrl"
            :src="selectedImageUrl"
            alt="Selected Image"
            style="width: 70%; height: auto"
          />
        </div>
        <CodeEditor v-if="selectedImageUrl" :code="selectedCode" />
      </div>
    </div>
    -->
    <iframe src="http://127.0.0.1:8088/demo" frameborder="0"></iframe>
  </ContentWrap>
</template>

<script setup lang="tsx">
import ChartComponent from './ChartComponent.vue'
import { computed, reactive, ref, watch } from 'vue'

import { ElDivider } from 'element-plus'
import CodeEditor from './CodeEditor.vue'
import { BaseButton } from '@/components/Button'
import { Form } from '@/components/Form'
import { FormSchema } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import { ElMessage } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import axios from 'axios'

const { t } = useI18n()

const formData = reactive({
  category: 'matplotlib',
  goal: ''
})
const uploadedData = reactive({
  chartData: [],
  goalData: []
})
const selectedGoal = ref('')
const selectedImageUrl = ref('')
const selectedCode = ref('')
const imageDisplayRef = ref<HTMLElement>()

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

const uploading = ref(false)
const schema = reactive<FormSchema[]>([
  {
    field: 'field1',
    label: t('lidaDemo.step1'),
    component: 'Divider'
  },
  {
    field: 'field2',
    component: 'Select',
    value: 'matplotlib',
    componentProps: {
      options: [
        {
          disabled: true,
          label: 'seaborn(目前有bug)',
          value: 'seaborn'
        },
        {
          label: 'matplotlib',
          value: 'matplotlib'
        },
        {
          label: 'plotly',
          value: 'plotly'
        }
      ],
      onselectionchange: (e) => {
        formData.category = e.target.parentElement.nextSibling.textContent
        console.log(formData)
      }
    }
  },
  {
    field: 'field3',
    label: t('lidaDemo.step2'),
    component: 'Divider'
  },
  {
    field: 'field4',
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 2,
      onchange: (e) => {
        formData.goal = e.target.value
        console.log(formData)
      }
    }
  },
  {
    field: 'field5',
    label: t('lidaDemo.step3'),
    component: 'Divider'
  },
  {
    field: 'field6',
    component: 'Upload',
    componentProps: {
      action: 'http://127.0.0.1:9540/lida/front/saveCSV',
      showFileList: false,
      onSuccess: (_response) => {
        const file = _response.raw
        const formDataToSend = new FormData()
        formDataToSend.append('file', file)
        if (formData.category.trim() !== '') {
          formDataToSend.append('category', formData.category)
        }
        if (formData.goal.trim() !== '') {
          formDataToSend.append('goal', formData.goal)
        }
        axios
          .post('http://127.0.0.1:9540/lida/front/test/sendForm', formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then((response) => {
            uploadedData.chartData = response.data.chartData
            uploadedData.goalData = response.data.goalData
            uploading.value = false
            ElMessage.success({
              message: '操作成功！',
              duration: 2000
            })

            setTimeout(() => {
              console.log('imageDisplayRef', imageDisplayRef.value, window)
              window.scrollBy(0, 100)
            }, 1000)
          })
          .catch((error) => {
            console.error('错误:', error)
          })
      },
      onchange: () => {
        uploading.value = true
      },
      beforeUpload: (rawFile) => {
        if (rawFile.type !== 'text/csv') {
          ElMessage.error('Avatar picture must be CSV format!')
          return false
        } else if (rawFile.size / 1024 / 1024 > 200) {
          ElMessage.error('Avatar picture size can not exceed 200MB!')
          return false
        }
        return true
      },
      slots: {
        default: () => (
          <>
            <BaseButton type="primary" loading={uploading.value}>
              Select File
            </BaseButton>
          </>
        ),
        tip: () => <div class="el-upload__tip">text/csv files with a size less than 200MB.</div>
      }
    }
  }
])
</script>

<style>
.lida .el-col {
  margin-left: 100px;
}
.pic {
  text-align: center;
}
</style>
