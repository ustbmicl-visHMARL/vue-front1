<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Dialog } from '@/components/Dialog'
import { computed, nextTick, onMounted, reactive, Ref, ref, unref, watchEffect } from 'vue'
import { ElMessage } from 'element-plus'
import {
  SummaryData,
  GoalExplorationData,
  VisualizeData,
  ExplainData,
  EvaluationData
} from './types'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import {
  goalApi,
  visualizeApi,
  editApi,
  explainApi,
  recommendApi,
  evaluateApi,
  repairApi
} from '@/api/lida'
import { Promotion } from '@element-plus/icons-vue'
import CodeEditor from './CodeEditor.vue'
import RecommendEditor from './RecommendEditor.vue'
import { useUserStore } from '@/store/modules/user'
import { ChatItem, useLidaStore } from '@/store/modules/lida'
import PythonCode from './PythonCode.vue'
import { Echart } from '@/components/Echart'
import {
  UploadFilled,
  ChatLineRound,
  ChatDotSquare,
  DataAnalysis,
  Sunny,
  Refresh
} from '@element-plus/icons-vue'
const userStore = useUserStore()
const lidaStore = useLidaStore()

const { t } = useI18n()
const modelDialogVisible = ref(false)
const jsonDialogVisible = ref(false)
const formSave = async () => {
  console.log('你点击了save按钮')
  console.log('settings', settings)
  modelDialogVisible.value = false
}
let settings = reactive({
  library: 'Seaborn',
  providers: 'openai',
  models: 'gpt-4',
  maxTokens: null,
  temperature: 0,
  msgNumber: 1,
  presencePernalty: 0,
  frequencyPernalty: 0,
  curGoalIndex: '0'
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
const tokenTip = (value: number | null) => {
  if (value === null) return ''
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
const visualizeData: Ref<VisualizeData> = ref({
  status: false,
  charts: [],
  message: ''
})
const uploadSuccess = async (res: any) => {
  if (res.status) {
    summary.value = res
    const goal_status = await getGoalsExploration()
    if (goal_status) {
      const res = await visualizeApi(visualizeParams.value)
      if (res.status == 200) {
        if (res.data.status) {
          visualizeData.value = res.data
          ElMessage.success('可视化成功')
        } else {
          ElMessage.error(res.data.message)
        }
        console.log('可视化数据', res.data)
      } else {
        ElMessage.error('可视化失败')
      }
    } else {
      ElMessage.error('目标探索失败')
    }
  } else ElMessage.error(res.message)
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
const activeNames = ref([[], [], []])
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

const goalExploration: Ref<GoalExplorationData> = ref({
  status: false,
  data: [],
  message: ''
})
const goalParams = computed(() => {
  return {
    n: 5,
    textgen_config: {
      max_tokens: settings.maxTokens,
      model: settings.models,
      n: settings.msgNumber,
      provider: settings.providers,
      temperature: settings.temperature
    },
    summary: summary.value.summary
  }
})
const visualizeParams = computed(() => {
  return {
    goal: goalExploration.value.data[settings.curGoalIndex],
    textgen_config: goalParams.value.textgen_config,
    summary: goalParams.value.summary,
    library: settings.library.toLowerCase()
  }
})
const getGoalsExploration = async () => {
  const goal = await goalApi(goalParams.value)
  if (goal.status == 200) {
    goalExploration.value = goal.data
    question.value = goal.data.data.length ? goal.data.data[0].question : ''
    last_goal.value = goal.data.data[0]
    return true
  } else {
    return false
  }
}
const last_goal = ref()
const handleClickGoal = async (index: string) => {
  if (
    settings.curGoalIndex == index &&
    goalExploration.value.data[settings.curGoalIndex].question == question.value
  )
    return ElMessage.success('可视化成功')
  settings.curGoalIndex = index + ''
  last_goal.value = visualizeParams.value.goal
  const res = await visualizeApi({
    ...visualizeParams.value
  })
  if (res.status == 200) {
    if (res.data.status) {
      visualizeData.value = res.data
      ElMessage.success('可视化成功')
    } else {
      ElMessage.error(res.data.message)
    }
    console.log('可视化数据', res.data)
  } else {
    ElMessage.error('可视化失败')
  }
}
const question = ref('')
const visualization = async () => {
  last_goal.value = {
    question: question.value,
    visualization: '',
    rationale: question.value,
    index: 0
  }
  const res = await visualizeApi({
    ...visualizeParams.value,
    goal: last_goal.value
  })

  if (res.status == 200) {
    if (res.data.status) {
      visualizeData.value = res.data
      ElMessage.success('可视化成功')
    } else {
      ElMessage.error(res.data.message)
    }
    console.log('可视化数据', res.data)
  } else {
    ElMessage.error('可视化失败')
  }
}
const handleClickQuestion = (goal: any) => {
  question.value = goal.question
  console.log(goal)
}
const save = () => {
  // 保存三个数据
  if (visualizeData.value.charts.length == 0) return ElMessage.info('请先进行可视化')
  lidaStore.updateAccountData({
    account: userStore.userInfo?.account || '',
    lida: {
      filename: summary.value.data_filename,
      time: new Date().toLocaleString(),
      summary: summary.value,
      goalExploration: goalExploration.value,
      visualizeData: visualizeData.value,
      chatHistory: chatHistory.value,
      explainData: explainData.value,
      recommendData: recommendData.value,
      settings: settings,
      last_goal: last_goal.value,
      evaluateData: evaluateData.value
    }
  })
  ElMessage.success('保存成功')
}
const lidaSelect = ref('')
const lidaHistory = ref()
onMounted(() => {
  lidaHistory.value = lidaStore.getAccountData(userStore.userInfo?.account || '')
})
const load = () => {
  console.log('load', lidaSelect.value)
  if (lidaHistory.value) {
    const lida = lidaHistory.value.lida.find((lida: any) => lida.filename == lidaSelect.value)
    summary.value = lida.summary
    goalExploration.value = lida.goalExploration
    visualizeData.value = lida.visualizeData
    chatHistory.value = JSON.parse(JSON.stringify(lida.chatHistory) || '[]')
    explainData.value = lida.explainData
      ? lida.explainData
      : {
          status: false,
          explanations: [],
          message: ''
        }
    recommendData.value = lida.recommendData || {
      status: false,
      charts: [],
      message: ''
    }
    lida.settings && (settings = lida.settings)
    question.value = goalExploration.value.data.length ? goalExploration.value.data[0].question : ''
    last_goal.value = lida.last_goal || {
      question: question.value,
      visualization: '',
      rationale: question.value,
      index: 0
    }
    evaluateData.value = lida.evaluateData || {
      status: false,
      evaluations: [],
      message: ''
    }
  }
}
const chatInput = ref('')
const chatHistory: Ref<ChatItem[]> = ref([])
const handleEnter = async () => {
  if (chatInput.value == '') return
  chatHistory.value.push({ content: chatInput.value, timestamp: new Date().toLocaleString() })
  chatInput.value = ''
  const editParam = {
    summary: summary.value.summary,
    instructions: chatHistory.value.map((item) => item.content),
    code: visualizeData.value.charts[0].code,
    librarys: settings.library.toLowerCase(),
    textgen_config: goalParams.value.textgen_config
  }
  console.log('editParam', editParam)
  const res = await editApi(editParam)
  if (res.status == 200) {
    if (res.data.status) {
      visualizeData.value = res.data
      ElMessage.success('编辑成功')
    } else {
      ElMessage.error(res.data.message)
    }
    console.log('编辑数据', res.data)
  } else {
    ElMessage.error('编辑失败')
  }
}
const explainData: Ref<ExplainData> = ref({
  status: false,
  explanations: [],
  message: ''
})
const handleExplain = async () => {
  const res = await explainApi({
    code: visualizeData.value.charts[0].code,
    library: settings.library.toLowerCase(),
    textgen_config: goalParams.value.textgen_config
  })
  if (res.status == 200) {
    if (res.data.status) {
      visualizeData.value = res.data
      ElMessage.success('成功生成解释')
    } else {
      ElMessage.error(res.data.message)
      explainData.value = {
        status: true,
        explanations: [
          {
            section: 'accessibility',
            code: "sns.barplot(x='Name', y='Miles_per_Gallon', data=data, palette='viridis')\nplt.xticks(rotation=90)\nplt.xlabel('Car Model')\nplt.ylabel('Miles per Gallon')\nplt.axhline(y=data['Miles_per_Gallon'].mean(), color='r', linestyle='--', label=f'Mean: {data['Miles_per_Gallon'].mean():.2f}')\nplt.legend()\nplt.title('What is the distribution of Miles per Gallon across different car models?', wrap=True, color='red')\nplt.gca().title.set_backgroundcolor('yellow')",
            explanation:
              "The chart is a bar plot with car models on the x-axis and miles per gallon on the y-axis. The color scheme is 'viridis', which provides a gradient of colors for the bars. The x-axis labels are rotated 90 degrees for better readability. A red dashed line represents the mean miles per gallon across all car models. The chart title is 'What is the distribution of Miles per Gallon across different car models?' and it is colored red with a yellow background."
          },
          {
            section: 'transformation',
            code: 'None',
            explanation:
              'There is no data transformation in the provided code. The data is directly used for plotting without any filtering, aggregation, grouping, or null value handling.'
          },
          {
            section: 'visualization',
            code: "plt.figure(figsize=(12, 6))\nsns.barplot(x='Name', y='Miles_per_Gallon', data=data, palette='viridis')\nplt.xticks(rotation=90)\nplt.xlabel('Car Model')\nplt.ylabel('Miles per Gallon')\nplt.axhline(y=data['Miles_per_Gallon'].mean(), color='r', linestyle='--', label=f'Mean: {data['Miles_per_Gallon'].mean():.2f}')\nplt.legend()\nplt.title('What is the distribution of Miles per Gallon across different car models?', wrap=True, color='red')\nplt.gca().title.set_backgroundcolor('yellow')\nreturn plt;",
            explanation:
              "The code first sets the figure size to 12x6. Then, it creates a bar plot using seaborn with 'Name' as the x-axis and 'Miles_per_Gallon' as the y-axis. The x-axis labels are rotated 90 degrees for better readability. The x and y labels are set to 'Car Model' and 'Miles per Gallon' respectively. A horizontal line is drawn at the mean of 'Miles_per_Gallon' and is labeled with the mean value. The legend is displayed. The title of the plot is set and its background color is set to yellow. Finally, the plot is returned."
          }
        ],
        message: 'Successfully generated explanations'
      }
    }
    console.log('解释数据', res.data)
  } else {
    ElMessage.error('解释失败')
  }
}
const recommendData: Ref<VisualizeData> = ref({
  status: false,
  charts: [],
  message: ''
})
const handleRecommend = async () => {
  const recommendParam = {
    summary: summary.value.summary,
    code: visualizeData.value.charts[0].code,
    library: settings.library.toLowerCase(),
    textgen_config: goalParams.value.textgen_config
  }
  const res = await recommendApi(recommendParam)
  if (res.status == 200) {
    if (res.data.status) {
      recommendData.value = res.data
      ElMessage.success('成功生成推荐')
    } else {
      ElMessage.error(res.data.message)
    }
    console.log('推荐数据', res.data)
  } else {
    ElMessage.error('推荐失败')
  }
}
const handleRepair = async () => {
  const repairParam = {
    code: visualizeData.value.charts[0].code,
    summary: summary.value.summary,
    feedback: evaluateData.value.evaluations,
    goal: last_goal.value || {
      question: question.value,
      visualization: '',
      rationale: question.value,
      index: 0
    },
    library: settings.library.toLowerCase(),
    textgen_config: goalParams.value.textgen_config
  }
  const res = await repairApi(repairParam)
  if (res.status == 200) {
    if (res.data.status) {
      visualizeData.value = res.data
      recommendData.value = {
        status: false,
        charts: [],
        message: ''
      }
      evaluateData.value = {
        status: false,
        evaluations: [],
        message: ''
      }
      ElMessage.success('成功生成修复')
    } else {
      ElMessage.error(res.data.message)
    }
    console.log('修复数据', res.data)
  } else {
    ElMessage.error('修复失败')
  }
}
// const handleTest = async () => {
//   console.log('recommendParam', visualizeData.value)
// }
const evaluateData: Ref<EvaluationData> = ref({
  status: false,
  evaluations: [],
  message: ''
})
const handleEvaluate = async () => {
  const evaluateParam = {
    code: visualizeData.value.charts[0].code,
    goal: last_goal.value || {
      question: question.value,
      visualization: '',
      rationale: question.value,
      index: 0
    },
    library: settings.library.toLowerCase(),
    textgen_config: goalParams.value.textgen_config
  }
  console.log('recommendParam', evaluateParam)
  const res = await evaluateApi(evaluateParam)
  if (res.status == 200) {
    if (res.data.status) {
      evaluateData.value = res.data
      ElMessage.success('成功生成评估')
    } else {
      ElMessage.error(res.data.message)
    }
    console.log('评估数据', res.data)
  } else {
    ElMessage.error('评估失败')
  }
}
const radarData = computed(() => ({
  legend: {
    data: ['Evaluate']
  },
  radar: {
    indicator: evaluateData.value.evaluations.map((item) => {
      return {
        name: item.dimension,
        max: 10
      }
    }),
    radius: '80%' // 初始缩放大小
  },
  series: [
    {
      type: 'radar',
      data: [
        {
          value: evaluateData.value.evaluations.map((item) => item.score),
          areaStyle: {
            color: '#B2D8B2'
          },
          lineStyle: {
            color: '#05810C'
          },
          symbolSize: 5
        }
      ],
      emphasis: {
        label: {
          show: true,
          formatter: function (params) {
            return params.value // 自定义格式
          },
          color: '#4BA252', // 标签文本颜色
          borderRadius: 3,
          fontSize: 19
        }
      }
    }
  ]
}))
const curEvaluationIndex = ref(0)
const handleChoseDimension = (index: number) => {
  console.log('dimension', index)
  curEvaluationIndex.value = index
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
      <div class="function-btns">
        <el-button @click="save" type="primary">保存结果</el-button>
        <!-- <el-button @click="load" type="default">载入历史</el-button> -->
        <!-- <el-button ref="buttonRef" @click="toggleDropdown" type="default">  </el-button> -->
        <el-select v-model="lidaSelect" placeholder="载入历史">
          <el-option
            v-for="lida in lidaHistory?.lida"
            :key="lida.value"
            :label="lida.filename"
            :value="lida.filename"
            @click="load"
          />
        </el-select>
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
      <el-collapse v-model="activeNames[0]" @change="handleChange">
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
    <div class="goal" v-if="goalExploration.status">
      <span class="goal-title">目标探索</span>
      <el-collapse v-model="activeNames[1]" @change="handleChange">
        <el-collapse-item :title="'目标(' + goalExploration.data.length + ')'" name="1">
          <div class="goal-items">
            <div
              class="goal-item"
              v-for="goal in goalExploration.data"
              :key="goal.index"
              @click="handleClickGoal(goal.index)"
              :class="{
                'goal-item-active': goal.index == settings.curGoalIndex,
                'goal-item-deactive': goal.index != settings.curGoalIndex
              }"
            >
              <div class="goal-item-title">
                <span class="title-left">{{ goal.index + 1 }}</span>
                {{ goal.question }}
              </div>
              <div class="visualization"> {{ goal.visualization }} </div>
              <div class="rationale">{{ goal.rationale }}</div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="visualize" v-if="visualizeData.status">
      <span class="visualize-title">可视化</span>
      <div class="visualize-content">
        <el-input
          v-model="question"
          style="max-width: 100%; height: 40px"
          placeholder="Please input"
          class="input-with-select"
        >
          <template #prepend>
            <el-select v-model="settings.curGoalIndex" placeholder="Select" style="width: 115px">
              <el-option
                v-for="goal in goalExploration.data"
                :key="goal.index"
                :label="goal.question"
                :value="goal.index.toString()"
                @click="handleClickQuestion(goal)"
              />
            </el-select>
          </template>
          <template #append>
            <el-button :icon="Promotion" @click="visualization">生成可视化图像</el-button>
          </template>
        </el-input>
      </div>
    </div>
    <div class="visualize chart" v-if="visualizeData.charts.length">
      <span class="visualize-title">{{
        goalExploration.data[settings.curGoalIndex].question
      }}</span>
      <div class="chart-tips">{{ goalExploration.data[settings.curGoalIndex].rationale }}</div>
      <div class="chart-visualization">{{
        goalExploration.data[settings.curGoalIndex].visualization
      }}</div>
      <div class="chart-container">
        <el-card class="data-img">
          <img :src="'data:image/png;base64,' + visualizeData.charts[0].raster" alt="图片丢失" />
        </el-card>
        <CodeEditor :code="visualizeData.charts[0].code" />
      </div>
    </div>
    <div class="visualize chat-tabs" v-if="visualizeData.charts.length">
      <el-tabs type="border-card" class="demo-tabs">
        <el-tab-pane>
          <template #label>
            <span class="custom-tabs-label">
              <el-icon><ChatDotSquare /></el-icon>
              <span>改善</span>
            </span>
          </template>
          <el-input
            v-model="chatInput"
            style="max-width: 100%; height: 40px"
            @keydown.enter="handleEnter"
            placeholder="将x轴标签更改m/s"
          />
          <div style="display: flex; justify-content: flex-end">
            <el-button style="margin-top: 3px" @click="chatHistory = []">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
                class="w-5 h-5 inline-block"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                />
              </svg>
              清空聊天历史
            </el-button>
          </div>

          <el-timeline style="max-width: 600px; padding-left: 20px">
            <el-timeline-item
              v-for="(activity, index) in chatHistory"
              :key="index"
              :timestamp="activity.timestamp"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <span class="custom-tabs-label">
              <el-icon><ChatLineRound /></el-icon>
              <span>解释</span>
            </span>
          </template>
          <div class="text-sm text-primary mb-2"> 点击解释可视化按钮生成chart的解释 </div>
          <el-button type="success" @click="handleExplain">
            <el-icon class="mr-1"><ChatLineRound /></el-icon>
            解释chart
          </el-button>
          <div class="explain-items">
            <div class="explain-item" v-for="exp in explainData.explanations" :key="exp.section">
              <div class="explain-item-title font-semibold text-lg mt-5">{{ exp.section }}</div>
              <div class="explain-item-content">{{ exp.explanation }}</div>
              <div class="explain-item-code">
                <PythonCode :code="exp.code" />
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <span class="custom-tabs-label">
              <el-icon><DataAnalysis /></el-icon>
              <span>评估</span>
            </span>
          </template>
          <div class="text-sm text-primary mb-2">
            使用下面的评估可视化按钮为图表生成self-evaluation分数。
          </div>
          <el-button
            :disabled="evaluateData.evaluations.length"
            type="success"
            @click="handleEvaluate"
          >
            <el-icon class="mr-1"><DataAnalysis /></el-icon>
            评估chart
          </el-button>
          <el-button v-if="evaluateData.evaluations.length" type="success" @click="handleRepair">
            <el-icon class="mr-1"><Refresh /></el-icon>
            自动修复chart
          </el-button>
          <!-- <el-button type="success" @click="handleTest">
            <el-icon class="mr-1"><DataAnalysis /></el-icon>
            测试
          </el-button> -->
          <div class="evaluate" v-if="evaluateData.evaluations.length">
            <Echart class="mt-4" :options="(radarData as any)" :width="480" :height="320" />
            <div class="stars">
              <div class="stars-top">
                <div v-for="(evaluate, index) in evaluateData.evaluations" :key="index">
                  <el-rate
                    v-model="evaluate.score"
                    :class="curEvaluationIndex == index ? 'active-dimension' : 'deactive-dimension'"
                    @click="handleChoseDimension(index)"
                    :max="10"
                    disabled
                    show-score
                    text-color="#ff9900"
                    :score-template="evaluate.dimension"
                  />
                </div>
              </div>
              <el-card>
                <div class="text-sm text-primary mb-2">
                  <span class="dimension">{{
                    (evaluateData.evaluations[curEvaluationIndex].dimension =
                      evaluateData.evaluations[curEvaluationIndex].dimension
                        .charAt(0)
                        .toUpperCase() +
                      evaluateData.evaluations[curEvaluationIndex].dimension.slice(1))
                  }}</span
                  ><span class="score"
                    >{{ evaluateData.evaluations[curEvaluationIndex].score }}<em>/10</em>
                  </span>
                  {{ evaluateData.evaluations[curEvaluationIndex].rationale }}
                </div>
              </el-card>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <span class="custom-tabs-label">
              <el-icon><Sunny /></el-icon>
              <span>推荐</span>
            </span>
          </template>
          <el-button type="success" @click="handleRecommend">
            <el-icon class="mr-1"><Sunny /></el-icon>
            生成Recommends
          </el-button>
          <div
            class="recommend-content flex"
            v-for="(chart, index) in recommendData.charts"
            :key="index"
          >
            <el-card class="data-img">
              <img :src="'data:image/png;base64,' + chart.raster" alt="图片丢失" />
            </el-card>
            <RecommendEditor class="flex-1" :code="chart.code" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </ContentWrap>
</template>
<style>
.el-rate:hover,
.stars .el-rate span:hover {
  cursor: pointer;
}
.el-rate {
  padding-left: 10px;
}
.active-dimension {
  width: 100%;
  border: 2px solid rgb(22, 163, 74);
  border-radius: 4px;
  box-sizing: border-box;
}
.stars .active-dimension .el-rate__text {
  color: rgb(22, 163, 74) !important;
}
.deactive-dimension {
  width: 100%;
  border: 2px solid transparent;
  border-radius: 4px;
  box-sizing: border-box;
}
.recommend-content {
  margin-top: 20px;
  margin-bottom: 5px;
  gap: 10px;
}
.summary .el-collapse-item button,
.summary .el-collapse-item__header,
.goal .el-collapse-item__header {
  background-color: #edf2f7;
  border-radius: 0.5rem;
  height: 42px;
  margin: 20px 0;
  /* 首字符缩进 */
  text-indent: 1em;
}
.visualize .el-select__wrapper {
  height: 100%;
  font-size: 16px;
}
.visualize .el-input__inner {
  font-size: 16px;
}
.data-img .el-card__body {
  padding: 0;
}
.data-img > div {
  height: 400px;
}
.recommend-content {
  height: 350px;
}
.recommend-content .data-img {
  height: 350px;
}
.recommend-content .data-img > div {
  height: 100%;
}
.stars .el-rate__text {
  color: #334155 !important;
}
.stars .el-card__body {
  padding: 14px;
  min-height: 88px;
}
</style>
<style scoped>
.el-card .dimension {
  font-weight: 600;
  display: block;
  font-size: 16px;
  margin-bottom: 5px;
}
.el-card .score {
  float: left;
  font-weight: 1000;
  font-size: 35px;
  color: #12823b;
  margin: 10px;
  margin-top: 13px;
  margin-right: 13px;
  margin-left: 2px;
}
.el-card .score em {
  font-size: 14px;
  font-style: normal;
}
.stars {
  margin-left: 10px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.evaluate {
  display: flex;
  flex-direction: row;
}
.evaluate .stars {
  margin-left: 10px;
  flex: 1;
}
.explain-item-content {
  font-size: 14px;
  font-family: apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
}
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.demo-tabs .custom-tabs-label .el-icon {
  vertical-align: middle;
}
.demo-tabs .custom-tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}
.function-btns {
  display: flex;
  /* flex-direction: column; */
  gap: 10px;
  margin-right: 80px;
  width: 220px;
}
.function-btns button {
  flex: 1;
  width: 80px;
  margin: 0;
}
.chart-container .v-content-wrap {
  flex: 1;
  height: 400px;
}
.data-img img {
  max-width: 500px;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.chart-container .data-img {
  width: 500px;
  height: 400px;
}
.chart-container {
  display: flex;
  margin-top: 10px;
  gap: 10px;
  align-items: center;
}
.chart-container > div {
  height: 400px;
}
.chart .chart-tips {
  font-size: 14px;
  font-weight: 400;
  margin-top: 4px;
}
.chart .chart-visualization {
  font-size: 14px;
  font-weight: 400;
  color: #12823b;
}
.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
.goal-item-active {
  border: #12823b 2px solid;
}
.goal-item-deactive {
  border: transparent 2px solid;
}
.visualization {
  color: #12823b;
  margin-top: 10px;
}
.visualize-content {
  margin-top: 10px;
}
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
.summary-item-title,
.goal-item-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 23px;
}
.goal-item-title {
  display: block;
  line-height: 1.25rem;
  height: auto;
  overflow-wrap: break-word;
  word-break: break-word;
  font-family: ui-sans-serif, system-ui;
  font-size: 16px;
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
.summary-items,
.goal-items {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: space-around;
}
.summary-item,
.goal-item {
  width: 250px;
  background-color: #edf2f7;
  border-radius: 0.35rem;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.goal .goal-item {
  justify-content: flex-start;
  cursor: pointer;
}
.goal-item .title-left {
  display: inline;
  padding-right: 10px;
  margin-right: 10px;
  border-right: #12823b 2px solid;
}
.check-origin {
  font-size: 0.775rem;
}
.check-origin:hover {
  color: #12823b;
  cursor: pointer;
  transition-duration: 0.2s;
}
.summary,
.goal,
.visualize {
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
.summary-title,
.goal-title,
.visualize-title {
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
.visualize .el-select {
  margin-bottom: 0;
  height: 100%;
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
/* .model {
  margin-right: 80px;
} */
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
