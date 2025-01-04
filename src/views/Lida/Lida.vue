<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Dialog } from '@/components/Dialog'
import { reactive, Ref, ref, watchEffect } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { SummaryData } from './types'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

const { t } = useI18n()
const modelDialogVisible = ref(false)
const jsonDialogVisible = ref(false)
const formSave = async () => {
  console.log('你点击了save按钮')
  console.log('settings', settings)
  modelDialogVisible.value = false
}
const settings = reactive({
  library: 'Matplotlib',
  providers: 'openai',
  models: 'gpt-4',
  maxTokens: 128,
  temperature: 0.2,
  msgNumber: 1,
  presencePernalty: 0,
  frequencyPernalty: 0
})
const providers = [
  {
    label: 'openai',
    value: 'openai'
  },
  {
    label: 'palm',
    value: 'palm'
  },
  {
    label: 'cohere',
    value: 'cphere',
    disabled: true
  }
]
const models = reactive({
  openai: [
    {
      label: 'gpt-4',
      value: 'gpt-4'
    },
    {
      label: 'gpt-4-32k',
      value: 'gpt-4-32k'
    },
    {
      label: 'gpt-3.5-turbo',
      value: 'gpt-3.5-turbo'
    },
    {
      label: 'gpt-3.5-turbo-0301',
      value: 'gpt-3.5-turbo-0301'
    },
    {
      label: 'gpt-3.5-turbo-16k',
      value: 'gpt-3.5-turbo-16k'
    },
    {
      label: 'gpt-3.5-turbo-0316',
      value: 'gpt-3.5-turbo-0316'
    }
  ],
  palm: [
    {
      label: 'codechat-bison@001',
      value: 'codechat-bison@001'
    },
    {
      label: 'chat-bison-001',
      value: 'chat-bison-001'
    },
    {
      label: 'codechat-bison-001',
      value: 'codechat-bison-001'
    },
    {
      label: 'codechat-bison-32k',
      value: 'codechat-bison-32k'
    }
  ]
})
const librarys = [
  {
    label: 'Altair',
    value: 'Altair',
    disabled: false
  },
  {
    label: 'Matplotlib',
    value: 'Matplotlib'
  },

  {
    label: 'Seaborn',
    value: 'Seaborn'
  }
]
watchEffect(() => {
  settings.models = models[settings.providers][0].value
})
const tokenTip = (value: number) => {
  return (128 + (value / 100) * (1024 - 128)).toFixed(0)
}
const tempTip = (value: number) => {
  return (value / 100).toFixed(1)
}
const msgTip = (value: number) => {
  return (value / 12 + 1).toFixed(0)
}
const preTip = (value: number) => {
  return ((value / 100) * 4 - 2).toFixed(1)
}
const freTip = (value: number) => {
  return ((value / 100) * 4 - 2).toFixed(1)
}
const uploadErr = (err: any) => {
  ElMessage.error(err.message)
}
const uploadSuccess = (res: any) => {
  if (res.status) {
    summary.value = res
    return ElMessage.success('文件分析成功')
  }
  ElMessage.error(res.message)
}
const uploadProgress = (_evt: any, _file, fileList) => {
  if (fileList.length >= 2) fileList.shift()
}
const download = async (name: string) => {
  const response = await fetch(
    'https://raw.githubusercontent.com/vega/vega-datasets/next/data/' + name
  )
  const blob = await response.blob()
  const link = document.createElement('a')
  const objectUrl = URL.createObjectURL(blob)
  link.href = objectUrl
  link.download = name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(objectUrl) // 释放临时URL资源
}
const downloadEg = (name: string) => {
  download(name)
}
const activeNames = ref([])
const handleChange = (val: string[]) => {
  console.log(val)
}
const summary: Ref<SummaryData> = ref({
  status: false,
  summary: {
    name: '',
    file_name: '',
    dataset_description: '',
    fields: [],
    field_names: []
  },
  data_filename: ''
})
const handleOrignSummary = () => {
  jsonDialogVisible.value = true
  console.log(summary.value)
}
</script>

<template>
  <ContentWrap :title="t('lidaDemo.title')" :message="t('lidaDemo.message')">
    <div class="setting flex">
      <div class="library">
        <span class="library-title">请选择一个可视化库</span>
        <el-select v-model="settings.library" placeholder="Select" style="width: 240px">
          <el-option
            v-for="item in librarys"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          />
        </el-select>
      </div>
      <div class="model">
        <el-button @click="modelDialogVisible = true">模型配置</el-button>
      </div>
    </div>
    <Dialog v-model="modelDialogVisible" :title="t('dialogDemo.setting')">
      <div class="container">
        <div class="w-1/2">
          <span class="text-primary">模型提供商</span>
          <el-select v-model="settings.providers" placeholder="Select" style="width: 240px">
            <el-option
              v-for="item in providers"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
          <span class="text-primary">模型</span>
          <el-select v-model="settings.models" placeholder="Select" style="width: 240px">
            <el-option
              v-for="item in models[settings.providers]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </div>
        <div class="w-1/2">
          <span class="text-primary">
            最大Tokens <span class="num">{{ tokenTip(settings.maxTokens) }}</span>
          </span>
          <el-slider v-model="settings.maxTokens" height="90px" :format-tooltip="tokenTip" />
          <span class="text-primary">
            热度Temperature <span class="num">{{ tempTip(settings.temperature) }}</span>
          </span>
          <el-slider v-model="settings.temperature" height="90px" :format-tooltip="tempTip" />
          <span class="text-primary">
            消息数 <span class="num">{{ msgTip(settings.msgNumber) }}</span>
          </span>
          <el-slider v-model="settings.msgNumber" height="90px" :format-tooltip="msgTip" />
          <span class="text-primary">
            重复用词惩罚 <span class="num">{{ preTip(settings.presencePernalty) }}</span>
          </span>
          <el-slider v-model="settings.presencePernalty" height="90px" :format-tooltip="preTip" />
          <span class="text-primary">
            词频惩罚 <span class="num">{{ freTip(settings.frequencyPernalty) }}</span>
          </span>
          <el-slider v-model="settings.frequencyPernalty" height="90px" :format-tooltip="freTip" />
        </div>
      </div>
      <template #footer>
        <BaseButton type="primary" @click="formSave">{{ t('dialogDemo.save') }}</BaseButton>
      </template>
    </Dialog>
    <div class="upload">
      <div class="upload-title">
        数据文件上传 (eg:
        <span class="upload-eg" @click="downloadEg('cars.json')">cars.json</span>,
        <span class="upload-eg" @click="downloadEg('airports.csv')">airports.csv</span>)
      </div>
      <el-upload
        class="upload-demo"
        drag
        action="/lida/summarize"
        @error="uploadErr"
        @success="uploadSuccess"
        @progress="uploadProgress"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          拖拽或者<em>点击上传</em>
          <div class="el-upload__tip"> 上传 .json 或 .csv 文件进行可视化处理 </div>
        </div>
      </el-upload>
    </div>
    <div class="summary" v-if="summary.status">
      <span class="summary-title">数据摘要</span>
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item :title="summary.data_filename + '数据摘要'" name="1">
          <div class="summary-items">
            <div class="summary-item" v-for="item in summary.summary.fields" :key="item.column">
              <div class="summary-item-title">
                <div class="title-left">
                  <span class="text-accent"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                      class="inline-block w-4 h-4"
                    >
                      <title>number</title>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5"
                      />
                    </svg>
                  </span>
                  <div class="field-title">{{ item.column }}</div>
                </div>
                <div class="summary-item-type">
                  <span class="summary-item-type-left">{{ item.properties.dtype }}</span>
                  |
                  <span class="summary-item-type-right">{{ item.properties.semantic_type }}</span>
                </div>
              </div>
              <div class="summary-item-content">
                <div class="descrip">{{ item.properties.description }}</div>
                <div class="unique"># Unique values: {{ item.properties.num_unique_values }}</div>
                <!-- 均值、方差等 -->
                <div class="statistics" v-if="item.properties.min">
                  min: {{ item.properties.min }} , max: {{ item.properties.max }}
                  {{ item.properties.std ? ', std:' + item.properties.std.toFixed(4) : '' }}
                  <!-- 如果item.properties.std是小数则保留小数点后4位 -->
                </div>
              </div>
              <div class="check-sample">
                <el-tooltip placement="bottom">
                  <template #content>
                    {{ item.properties.samples }}
                  </template>
                  <el-button>查看样本</el-button>
                </el-tooltip>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="check-origin" @click="handleOrignSummary">查看原始摘要?</div>
      <Dialog v-model="jsonDialogVisible" :title="summary.data_filename + '原始数据摘要'">
        <vue-json-pretty :data="summary" :deep="Infinity" />
        <template #footer>
          <BaseButton @click="jsonDialogVisible = false">{{ t('dialogDemo.close') }}</BaseButton>
        </template>
      </Dialog>
    </div>
  </ContentWrap>
</template>
<style>
.summary .el-collapse-item button,
.summary .el-collapse-item__header {
  background-color: #edf2f7;
  border-radius: 0.5rem;
  height: 42px;
  margin: 20px 0;
  /* 首字符缩进 */
  text-indent: 1em;
}
</style>
<style scoped>
.check-sample {
  text-align: center;
}
.summary .el-collapse-item .check-sample button {
  width: 80%;
  height: 80%;
  margin: 5px auto;
}
.summary-item-type {
  font-size: 0.7rem;
  white-space: nowrap;
  text-indent: 0.2em;
}
.summary-item-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 23px;
}
.field-title {
  text-transform: capitalize;
  font-weight: 600;
  display: inline;
  font-size: 0.775rem;
  line-height: 23px;
  text-indent: 0.3em;
}
.text-accent {
  color: #12823b;
  height: 100%;
  margin-top: 3px;
}
.title-left {
  display: flex;
  align-items: center;
}
.summary-items {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: space-around;
}
.summary-item {
  width: 250px;
  background-color: #edf2f7;
  border-radius: 0.35rem;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.check-origin {
  font-size: 0.775rem;
}
.check-origin:hover {
  color: #12823b;
  cursor: pointer;
  transition-duration: 0.2s;
}
.summary {
  padding: 20px;
  margin: 70px 0;
}
.upload-eg {
  color: #12823b;
  cursor: pointer;
}
.upload {
  width: 95%;
  height: 200px;
  margin: 20px 0;
  padding: 20px;
  margin-bottom: 40px;
}
.library-title,
.upload-title,
.summary-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}
.library {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
}
.library .el-select {
  margin-bottom: 0;
}
.el-slider {
  height: 10px;
  width: 80%;
  margin-bottom: 30px;
}
.num {
  color: #12823b;
}
.el-select {
  margin-bottom: 18px;
}
.container span.text-primary {
  color: #334155;
  font-size: 14px;
  margin-bottom: 10px;
}
.container {
  width: 100%;
  height: 400px;
  display: flex;
}
.container > div {
  display: flex;
  flex-direction: column;
}
.setting {
  justify-content: space-between;
  align-items: center;
}
.model {
  margin-right: 80px;
}
.model .el-button {
  background-color: rgb(237, 242, 247);
  color: rgb(51, 65, 85);
  width: 210px;
  height: 40px;
}
.model .el-button:hover {
  background-color: rgb(213, 218, 222);
  color: rgb(51, 65, 85);
  transition: all 0.5s normal;
  transform-style: flat;
}
</style>
