<script setup lang="ts">
import { ElRow, ElCol, ElCard, ElSkeleton } from 'element-plus'
import { Echart } from '@/components/Echart'
import {
  pieOptions,
  barOptions,
  lineOptions,
  actionScatterOptions,
  valueScatterOptions,
  importanceBarOptions,
  rewardLineOptions,
  learnLineOptions,
  qvalueOptions
} from '../Dashboard/echarts-data'
import { ref, reactive, Ref, nextTick } from 'vue'
import {
  getUserAccessSourceApi,
  getWeeklyUserActivityApi,
  getMonthlySalesApi
} from '@/api/dashboard/analysis'
import { set } from 'lodash-es'
import { EChartsOption } from 'echarts'
import { useI18n } from '@/hooks/web/useI18n'
import { BaseButton } from '@/components/Button'
import { getSwiperApi } from '@/api/labcharts'

const { t } = useI18n()

const loading = ref(true)

const pieOptionsData = reactive<EChartsOption>(pieOptions) as EChartsOption

// 用户来源
const getUserAccessSource = async () => {
  const res = await getUserAccessSourceApi().catch(() => {})
  if (res) {
    set(
      pieOptionsData,
      'legend.data',
      res.data.map((v) => t(v.name))
    )
    pieOptionsData!.series![0].data = res.data.map((v) => {
      return {
        name: t(v.name),
        value: v.value
      }
    })
  }
}

const barOptionsData = reactive<EChartsOption>(barOptions) as EChartsOption

// 周活跃量
const getWeeklyUserActivity = async () => {
  const res = await getWeeklyUserActivityApi().catch(() => {})
  if (res) {
    set(
      barOptionsData,
      'xAxis.data',
      res.data.map((v) => t(v.name))
    )
    set(barOptionsData, 'series', [
      {
        name: t('analysis.activeQuantity'),
        data: res.data.map((v) => v.value),
        type: 'bar'
      }
    ])
  }
}

const lineOptionsData = reactive<EChartsOption>(lineOptions) as EChartsOption

// 每月销售总额
const getMonthlySales = async () => {
  const res = await getMonthlySalesApi().catch(() => {})
  if (res) {
    set(
      lineOptionsData,
      'xAxis.data',
      res.data.map((v) => t(v.name))
    )
    set(lineOptionsData, 'series', [
      {
        name: t('analysis.estimate'),
        smooth: true,
        type: 'line',
        data: res.data.map((v) => v.estimate),
        animationDuration: 2800,
        animationEasing: 'cubicInOut'
      },
      {
        name: t('analysis.actual'),
        smooth: true,
        type: 'line',
        itemStyle: {},
        data: res.data.map((v) => v.actual),
        animationDuration: 2800,
        animationEasing: 'quadraticOut'
      }
    ])
  }
}

const actionScatterData = reactive<EChartsOption>(actionScatterOptions) as EChartsOption
const valueScatterData = reactive<EChartsOption>(valueScatterOptions) as EChartsOption
const importanceBarData = reactive<EChartsOption>(importanceBarOptions) as EChartsOption
const rewardLineData = reactive<EChartsOption>(rewardLineOptions) as EChartsOption
const learnLineData = reactive<EChartsOption>(learnLineOptions) as EChartsOption
const qvalueData = reactive<EChartsOption>(qvalueOptions) as EChartsOption

const num = ref(1)
const handleChange = (value: number) => {
  barOptionsData.series![0].data[0] *= 2
  console.log(barOptionsData.series![0].data)
  console.log(value)
}

const handleSearch = () => {
  console.log('handleSearch')
}

const pics = ref([])
let totalPics = 1
const currentIndex = ref(0)
const blockElement: Ref<HTMLElement | null> = ref(null)
const lastImg = () => {
  currentIndex.value = !currentIndex.value ? totalPics - 1 : (currentIndex.value - 1) % totalPics
  blockElement.value!.style.backgroundImage = `url(${pics.value[currentIndex.value]})`
  console.log(pics.value, currentIndex.value, pics.value[currentIndex.value])
}
const nextImg = () => {
  currentIndex.value = (currentIndex.value + 1) % totalPics
  blockElement.value!.style.backgroundImage = `url(${pics.value[currentIndex.value]})`
}

const getSwiperImg = async () => {
  const res = await getSwiperApi({ name: '122' })
  if (res) {
    pics.value = res.data.imgs
    totalPics = res.data.imgs.length
  }
}

const getAllApi = async () => {
  await Promise.all([
    getSwiperImg(),
    getUserAccessSource(),
    getWeeklyUserActivity(),
    getMonthlySales()
  ])
  loading.value = false
  nextTick(() => {
    blockElement.value!.style.backgroundImage = `url(${pics.value[currentIndex.value]})`
  })
}

getAllApi()
</script>

<template>
  <ElRow class="header">
    <div class="select">
      <label for="inputNumber">episode(1~300)</label>
      <el-input-number v-model="num" :min="1" :max="300" @change="handleChange" id="inputNumber" />
    </div>
    <div class="action">
      <BaseButton type="primary" @click="handleSearch">
        {{ t('searchDemo.search') }}
      </BaseButton>
      <BaseButton @click="handleSearch">
        {{ t('searchDemo.reset') }}
      </BaseButton>
    </div>
  </ElRow>
  <!-- 下面为七个图像 -->
  <ElRow>
    <ElCol :span="8">
      <ElCard shadow="hover">
        <ElSkeleton :loading="loading" animated :rows="6">
          <div class="swiper-container" style="height: 250px">
            <div class="arrow left-arrow" @click="lastImg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 15 15">
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="square"
                  d="M10 14L3 7.5L10 1"
                />
              </svg>
            </div>
            <div class="block" ref="blockElement"></div>
            <div class="arrow right-arrow" @click="nextImg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 15 15">
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="square"
                  d="m5 14l7-6.5L5 1"
                />
              </svg>
            </div>
          </div>
          <div class="swiper-title" style="height: 50px">
            <span>step: {{ currentIndex + 1 }}</span>
            <h3>环境状态</h3>
          </div>
        </ElSkeleton>
      </ElCard>
    </ElCol>
    <ElCol :span="8">
      <ElCard shadow="hover">
        <ElSkeleton :loading="loading" animated :rows="6">
          <Echart :options="actionScatterData" :height="300" />
        </ElSkeleton>
      </ElCard>
    </ElCol>
    <ElCol :span="8">
      <ElCard shadow="hover">
        <ElSkeleton :loading="loading" animated :rows="6">
          <Echart :options="valueScatterData" :height="300" />
        </ElSkeleton>
      </ElCard>
    </ElCol>
  </ElRow>
  <ElRow>
    <ElCol :span="12">
      <ElCard shadow="hover">
        <ElSkeleton :loading="loading" animated :rows="14" class="mb-10px">
          <Echart :options="qvalueData" :height="300" />
        </ElSkeleton>
      </ElCard>
    </ElCol>
    <ElCol :span="12">
      <ElCard shadow="hover">
        <ElSkeleton :loading="loading" animated :rows="14" class="mb-10px">
          <Echart :options="importanceBarData" :height="300" />
        </ElSkeleton>
      </ElCard>
    </ElCol>
  </ElRow>
  <ElRow>
    <ElCol :span="12">
      <ElCard shadow="hover">
        <ElSkeleton :loading="loading" animated :rows="14" class="mb-10px">
          <Echart :options="rewardLineData" :height="300" />
        </ElSkeleton>
      </ElCard>
    </ElCol>
    <ElCol :span="12">
      <ElCard shadow="hover">
        <ElSkeleton :loading="loading" animated :rows="14" class="mb-10px">
          <Echart :options="learnLineData" :height="300" />
        </ElSkeleton>
      </ElCard>
    </ElCol>
  </ElRow>
</template>

<style scoped>
.header {
  /* background-color: pink; */
  height: 35px;
  display: flex;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 5px;
}
.el-input-number {
  margin-left: 10px;
}
.select {
  margin-right: 70px;
  transform: translateX(-150px);
}

.action {
  transform: translateX(-150px);
}

.el-card {
  margin: 5px;
}

.swiper-container {
  display: flex;
  height: 300px;
  /* border: 1px solid black; */
}

.block {
  flex-grow: 1;
  height: 100%;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}

.arrow {
  font-size: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.swiper-title {
  text-align: center;
}
.swiper-title span {
  line-height: 30px;
  font-size: 14px;
  user-select: none;
}

.swiper-title h3 {
  padding: 0;
  margin: 0;
  text-align: center;
  user-select: none;
}
</style>
