import { EChartsOption } from 'echarts'
import { useI18n } from '@/hooks/web/useI18n'
import echarts from 'echarts/types/dist/echarts'
import { readFileSync } from 'fs'
import Papa from 'papaparse'

const { t } = useI18n()

export const lineOptions: EChartsOption = {
  title: {
    text: t('analysis.monthlySales'),
    left: 'center'
  },
  xAxis: {
    data: [
      t('analysis.january'),
      t('analysis.february'),
      t('analysis.march'),
      t('analysis.april'),
      t('analysis.may'),
      t('analysis.june'),
      t('analysis.july'),
      t('analysis.august'),
      t('analysis.september'),
      t('analysis.october'),
      t('analysis.november'),
      t('analysis.december')
    ],
    boundaryGap: false,
    axisTick: {
      show: false
    }
  },
  grid: {
    left: 20,
    right: 20,
    bottom: 20,
    top: 80,
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    },
    padding: [5, 10]
  },
  yAxis: {
    axisTick: {
      show: false
    }
  },
  legend: {
    data: [t('analysis.estimate'), t('analysis.actual')],
    top: 50
  },
  series: [
    {
      name: t('analysis.estimate'),
      smooth: true,
      type: 'line',
      data: [100, 120, 161, 134, 105, 160, 165, 114, 163, 185, 118, 123],
      animationDuration: 2800,
      animationEasing: 'cubicInOut'
    },
    {
      name: t('analysis.actual'),
      smooth: true,
      type: 'line',
      itemStyle: {},
      data: [120, 82, 91, 154, 162, 140, 145, 250, 134, 56, 99, 123],
      animationDuration: 2800,
      animationEasing: 'quadraticOut'
    }
  ]
}

export const pieOptions: EChartsOption = {
  title: {
    text: t('analysis.userAccessSource'),
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: [
      t('analysis.directAccess'),
      t('analysis.mailMarketing'),
      t('analysis.allianceAdvertising'),
      t('analysis.videoAdvertising'),
      t('analysis.searchEngines')
    ]
  },
  series: [
    {
      name: t('analysis.userAccessSource'),
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      data: [
        { value: 335, name: t('analysis.directAccess') },
        { value: 310, name: t('analysis.mailMarketing') },
        { value: 234, name: t('analysis.allianceAdvertising') },
        { value: 135, name: t('analysis.videoAdvertising') },
        { value: 1548, name: t('analysis.searchEngines') }
      ]
    }
  ]
}

export const barOptions: EChartsOption = {
  title: {
    text: t('analysis.weeklyUserActivity'),
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: 50,
    right: 20,
    bottom: 20
  },
  xAxis: {
    type: 'category',
    data: [
      t('analysis.monday'),
      t('analysis.tuesday'),
      t('analysis.wednesday'),
      t('analysis.thursday'),
      t('analysis.friday'),
      t('analysis.saturday'),
      t('analysis.sunday')
    ],
    axisTick: {
      alignWithLabel: true
    }
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: t('analysis.activeQuantity'),
      data: [13253, 34235, 26321, 12340, 24643, 1322, 1324],
      type: 'bar'
    }
  ]
}

export const radarOption: EChartsOption = {
  legend: {
    data: [t('workplace.personal'), t('workplace.team')]
  },
  radar: {
    // shape: 'circle',
    indicator: [
      { name: t('workplace.quote'), max: 65 },
      { name: t('workplace.contribution'), max: 160 },
      { name: t('workplace.hot'), max: 300 },
      { name: t('workplace.yield'), max: 130 },
      { name: t('workplace.follow'), max: 100 }
    ]
  },
  series: [
    {
      name: `xxx${t('workplace.index')}`,
      type: 'radar',
      data: [
        {
          value: [42, 30, 20, 35, 80],
          name: t('workplace.personal')
        },
        {
          value: [50, 140, 290, 100, 90],
          name: t('workplace.team')
        }
      ]
    }
  ]
}

export const wordOptions = {
  series: [
    {
      type: 'wordCloud',
      gridSize: 2,
      sizeRange: [12, 50],
      rotationRange: [-90, 90],
      shape: 'pentagon',
      width: 600,
      height: 400,
      drawOutOfBound: true,
      textStyle: {
        color: function () {
          return (
            'rgb(' +
            [
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160)
            ].join(',') +
            ')'
          )
        }
      },
      emphasis: {
        textStyle: {
          shadowBlur: 10,
          shadowColor: '#333'
        }
      },
      data: [
        {
          name: 'Sam S Club',
          value: 10000,
          textStyle: {
            color: 'black'
          },
          emphasis: {
            textStyle: {
              color: 'red'
            }
          }
        },
        {
          name: 'Macys',
          value: 6181
        },
        {
          name: 'Amy Schumer',
          value: 4386
        },
        {
          name: 'Jurassic World',
          value: 4055
        },
        {
          name: 'Charter Communications',
          value: 2467
        },
        {
          name: 'Chick Fil A',
          value: 2244
        },
        {
          name: 'Planet Fitness',
          value: 1898
        },
        {
          name: 'Pitch Perfect',
          value: 1484
        },
        {
          name: 'Express',
          value: 1112
        },
        {
          name: 'Home',
          value: 965
        },
        {
          name: 'Johnny Depp',
          value: 847
        },
        {
          name: 'Lena Dunham',
          value: 582
        },
        {
          name: 'Lewis Hamilton',
          value: 555
        },
        {
          name: 'KXAN',
          value: 550
        },
        {
          name: 'Mary Ellen Mark',
          value: 462
        },
        {
          name: 'Farrah Abraham',
          value: 366
        },
        {
          name: 'Rita Ora',
          value: 360
        },
        {
          name: 'Serena Williams',
          value: 282
        },
        {
          name: 'NCAA baseball tournament',
          value: 273
        },
        {
          name: 'Point Break',
          value: 265
        }
      ]
    }
  ]
}
//动作函数
export const actionScatterOptions = async (episodeId: number): Promise<EChartsOption> => {
  const response = await fetch(`/java/chart/getChartAction?episodeId=${episodeId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`HTTP error! status: ${response.status}, message:${errorData}`)
  }

  const result = await response.json()
  const parsedData = result.data // 解析返回的 data
  // console.log(parsedData.length)

  const steps = parsedData.map((item) => parseInt(item.step, 10))
  // console.log(episodes)

  const maxX = Math.max(...steps)
  // const minY = Math.min(...values)
  // const maxY = Math.max(...values)
  // 返回动态生成的图表配置
  return {
    tooltip: {
      trigger: 'item', // 或者 'axis'，取决于你的需求
      axisPointer: {
        type: 'cross'
      },
      formatter: function (params) {
        // params 是一个包含数据点信息的对象
        // 对于散点图，params.data 是一个包含 x 和 y 值的数组
        // 对于折线图，params.value 也是一个包含 x 和 y 值的数组
        if (params.componentType === 'series') {
          return `Step: ${params.value[0]}, Action:${params.value[1]}`
        }
        return ''
      }
    },
    grid: {
      width: '80%',
      left: 'center',
      bottom: '60px',
      height: '70%'
    },
    title: {
      text: '动作选择',
      left: 'center',
      bottom: 'bottom'
    },
    xAxis: {
      name: 'step',
      nameTextStyle: {
        fontWeight: 'bold'
      },
      axisLine: {
        symbol: ['none', 'arrow']
      },
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      }, // 修正为正确的属性名
      type: 'category',
      min: 0,
      max: maxX // 间隔一个显示一个
    },
    yAxis: {
      name: 'action',
      nameTextStyle: {
        fontWeight: 'bold'
      },
      axisLine: {
        symbol: ['none', 'arrow'],
        onZero: true
      },
      data: ['右下', '右上', '左下', '左上'],
      axisTick: 'false' // 隐藏 y 轴刻度
    },
    series: [
      {
        symbolSize: 15,
        data: parsedData
          // .filter((_, index) => index % 2 === 0) // 保留每隔一个数据点
          .map((item) => [parseInt(item.step, 10), item.action]),
        type: 'scatter'
      }
    ]
  }
}
//价值函数
export const valueScatterOptions = async (episodeId: number): Promise<EChartsOption> => {
  const response = await fetch(`/java/chart/getChartValue?episodeId=${episodeId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`HTTP error! status: ${response.status}, message:${errorData}`)
  }

  const result = await response.json()
  const parsedData = result.data // 解析返回的 data
  // console.log(parsedData.length)

  const steps = parsedData.map((item) => parseInt(item.step, 10))
  const values = parsedData.map((item) => parseFloat(item.value))

  const maxX = Math.max(...steps)
  const minY = Math.min(...values)
  const maxY = Math.max(...values)
  // 返回动态生成的图表配置
  return {
    tooltip: {
      trigger: 'item', // 或者 'axis'，取决于你的需求
      axisPointer: {
        type: 'cross'
      },
      formatter: function (params) {
        // params 是一个包含数据点信息的对象
        // 对于散点图，params.data 是一个包含 x 和 y 值的数组
        // 对于折线图，params.value 也是一个包含 x 和 y 值的数组
        if (params.componentType === 'series') {
          return `Episode: ${params.value[0]}, Reward:${params.value[1]}`
        }
        return ''
      }
    },
    grid: {
      width: '80%',
      left: 'center',
      bottom: '60px',
      height: '70%'
    },
    title: {
      text: '价值函数',
      left: 'center',
      bottom: 'bottom'
    },
    xAxis: {
      name: 'step',
      nameTextStyle: {
        fontWeight: 'bold'
      },
      axisLine: {
        symbol: ['none', 'arrow']
      },
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      }, // 修正为正确的属性名
      min: 0,
      max: maxX
    },
    yAxis: {
      name: 'value',
      nameTextStyle: {
        fontWeight: 'bold'
      },
      axisLine: {
        symbol: ['none', 'arrow']
      },
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      }, // 修正为正确的属性名
      min: Math.floor(minY),
      max: Math.ceil(maxY)
    },
    series: [
      {
        symbolSize: 10,
        data: parsedData
          // .filter((_, index) => index % 10 === 0) // 保留每隔一个数据点
          .map((item) => [parseInt(item.step, 10), parseFloat(item.value)]),
        // symbol: 'none',
        type: 'line'
      }
    ]
  }
}

// 重要性
export const importanceBarOptions: EChartsOption = {
  title: {
    text: '重要性得分',
    left: 'center',
    bottom: 'bottom'
  },
  grid: {
    left: 'center',
    height: '70%',
    width: '50%',
    bottom: '60px'
  },
  xAxis: {
    name: 'step',
    nameTextStyle: {
      fontWeight: 'bold'
    },
    axisLine: {
      symbol: ['none', 'arrow'],
      show: true
    },
    type: 'value',
    min: 0
  },
  yAxis: {
    name: 'features',
    nameTextStyle: {
      fontWeight: 'bold'
    },
    axisLine: {
      symbol: ['none', 'arrow']
    },
    axisTick: 'false',
    type: 'category',
    data: [1, 2, 3, 4, 5, '']
  },
  series: [
    {
      data: [2, 1, 2, 3, 4],
      type: 'bar'
    }
  ]
}
// 奖励
export const rewardLineOptions = async (experimentId: number): Promise<EChartsOption> => {
  const response = await fetch(`/java/chart/getChartReward?experimentId=${experimentId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`HTTP error! status: ${response.status}, message:${errorData}`)
  }

  const result = await response.json()
  const parsedData = result.data // 解析返回的 data
  // console.log(parsedData.length)

  const episodes = parsedData.map((item) => parseInt(item.episode, 10))
  // console.log(episodes)
  const values = parsedData.map((item) => parseFloat(item.reward))

  const maxX = Math.max(...episodes)
  const minY = Math.min(...values)
  const maxY = Math.max(...values)
  // 返回动态生成的图表配置
  return {
    tooltip: {
      trigger: 'item', // 或者 'axis'，取决于你的需求
      axisPointer: {
        type: 'cross'
      },
      formatter: function (params) {
        // params 是一个包含数据点信息的对象
        // 对于散点图，params.data 是一个包含 x 和 y 值的数组
        // 对于折线图，params.value 也是一个包含 x 和 y 值的数组
        if (params.componentType === 'series') {
          return `Episode: ${params.value[0]}, Reward:${params.value[1]}`
        }
        return ''
      }
    },
    grid: {
      width: '80%',
      left: 'center',
      bottom: '60px',
      height: '70%'
    },
    title: {
      text: '奖励',
      left: 'center',
      bottom: 'bottom'
    },
    xAxis: {
      name: 'episode',
      nameTextStyle: {
        fontWeight: 'bold'
      },
      axisLine: {
        symbol: ['none', 'arrow']
      },
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      }, // 修正为正确的属性名
      min: 0,
      max: maxX,
      interval: Math.floor(maxX / 10)
    },
    yAxis: {
      name: 'reward',
      nameTextStyle: {
        fontWeight: 'bold'
      },
      axisLine: {
        symbol: ['none', 'arrow']
      },
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      }, // 修正为正确的属性名
      min: Math.floor(minY),
      max: Math.ceil(maxY),
      interval: 0.3
    },
    series: [
      {
        symbolSize: 10,
        data: parsedData
          .filter((_, index) => index % 10 === 0) // 保留每隔一个数据点
          .map((item) => [parseInt(item.episode, 10), parseFloat(item.reward)]),
        // symbol: 'none',
        type: 'line'
      }
    ]
  }
}

// 学习曲线
export const learnLineOptions = async (experimentId: number): Promise<EChartsOption> => {
  const response = await fetch(`/java/chart/getChartLoss?experimentId=${experimentId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`HTTP error! status: ${response.status}, message:${errorData}`)
  }

  const result = await response.json()
  const parsedData = result.data // 解析返回的 data
  // console.log(parsedData.length)

  const episodes = parsedData.map((item) => parseInt(item.episode, 10))
  // console.log(episodes)
  const values = parsedData.map((item) => parseFloat(item.loss))

  const maxX = Math.max(...episodes)
  const maxY = Math.max(...values)

  // 返回动态生成的图表配置
  return {
    tooltip: {
      trigger: 'item', // 或者 'axis'，取决于你的需求
      axisPointer: {
        type: 'cross'
      },
      formatter: function (params) {
        // params 是一个包含数据点信息的对象
        // 对于散点图，params.data 是一个包含 x 和 y 值的数组
        // 对于折线图，params.value 也是一个包含 x 和 y 值的数组
        if (params.componentType === 'series') {
          return `Episode: ${params.value[0]}, Loss:${params.value[1]}`
        }
        return ''
      }
    },
    grid: {
      width: '80%',
      left: 'center',
      bottom: '60px',
      height: '70%'
    },
    title: {
      text: '学习曲线',
      left: 'center',
      bottom: 'bottom'
    },
    xAxis: {
      name: 'episode',
      nameTextStyle: {
        fontWeight: 'bold'
      },
      axisLine: {
        symbol: ['none', 'arrow']
      },
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      }, // 修正为正确的属性名
      min: 0,
      max: maxX,
      interval: Math.floor(maxX / 10)
    },
    yAxis: {
      name: 'loss',
      nameTextStyle: {
        fontWeight: 'bold'
      },
      axisLine: {
        symbol: ['none', 'arrow']
      },
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      }, // 修正为正确的属性名
      min: 0,
      max: maxY,
      interval: 1
    },
    series: [
      {
        symbolSize: 10,
        data: parsedData
          .filter((_, index) => index % 10 === 0) // 保留每隔一个数据点
          .map((item) => [parseInt(item.episode, 10), parseFloat(item.loss)]),
        // symbol: 'none',
        type: 'line'
      }
    ]
  }
}

// Q值函数
export const qvalueSquareOptions = async (episodeId: number): Promise<EChartsOption> => {
  const response = await fetch(`/java/chart/getChartQValue?episodeId=${episodeId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`HTTP error! status: ${response.status}, message:${errorData}`)
  }

  const result = await response.json()
  const parsedData = result.data.qvalue // 解析返回的 data
  console.log(parsedData.length)

  // const episodes = parsedData.map((item) => parseInt(item.episode, 10))
  // console.log(episodes)
  // const values = parsedData.map((item) => parseFloat(item.loss))
  const xdata = Array.from({ length: parsedData.length }, (_, index) => index)
  const ydata = ['右下', '右上', '左下', '左上']
  type TransformedArrayType = [number, string, number]
  const transformedArray: TransformedArrayType[] = [];
  parsedData.forEach((subArray, index) => {
    subArray.forEach((value, directionIndex) => {
      transformedArray.push([index, ydata[directionIndex], value])
    })
  })
  // console.log(transformedArray)
  return {
    title: {
      text: 'Q值函数',
      left: 'center',
      bottom: 'bottom'
    },
    tooltip: {
      position: 'top'
    },
    grid: {
      left: '20%',
      height: '70%',
      width: '80%',
      bottom: '60px'
    },
    xAxis: {
      type: 'category',
      data: xdata,
      axisLine: {
        symbol: ['none', 'triangle']
      },
      axisTick: 'false'
    },
    yAxis: {
      type: 'category',
      data: ydata,
      splitArea: {
        show: true
      },
      axisLine: {
        symbol: ['none', 'triangle']
      },
      axisTick: 'false'
    },
    visualMap: {
      min: 2,
      max: 12,
      calculable: true,
      left: '6%',
      bottom: 'center'
    },
    series: [
      {
        name: 'Q值',
        type: 'heatmap',
        data: transformedArray,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
}
