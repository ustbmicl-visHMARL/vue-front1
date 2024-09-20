import { EChartsOption } from 'echarts'
import { useI18n } from '@/hooks/web/useI18n'

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

// 动作选择散点图
export const actionScatterOptions: EChartsOption = {
  grid: {
    width: '75%'
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
    type: 'category',
    data: [0, 1, 2, 3, ''],
    min: 0,
    axisLine: {
      symbol: ['none', 'arrow']
    },
    boundaryGap: false, // 设置为 false
    axisTick: 'false' // 隐藏 x 轴刻度
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
    data: ['右下', '右上', '左下', '左上', ''],
    axisTick: 'false' // 隐藏 y 轴刻度
  },
  series: [
    {
      symbolSize: 15,
      data: [
        [1, '右下'],
        [2, '右上'],
        [3, '左下']
      ],
      type: 'scatter'
    }
  ]
}

// 价值函数散点图
export const valueScatterOptions: EChartsOption = {
  grid: {
    width: '75%'
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
    axisTick: 'false', // 隐藏 x 轴刻度
    min: 0,
    max: 6,
    interval: 1
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
    axisTick: 'false', // 隐藏 x 轴刻度
    min: 0,
    max: 5,
    interval: 1
  },
  series: [
    {
      symbolSize: 15,
      data: [
        [1, 1],
        [2, 4]
      ],
      type: 'scatter'
    }
  ]
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
export const rewardLineOptions: EChartsOption = {
  grid: {
    width: '50%',
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
    axisTick: 'false', // 隐藏 x 轴刻度
    min: 0,
    max: 6,
    interval: 1
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
    axisTick: 'false', // 隐藏 x 轴刻度
    min: 0,
    max: 5,
    interval: 1
  },
  series: [
    {
      symbolSize: 15,
      data: [
        [0, 0],
        [1, 1],
        [2, 4]
      ],
      symbol: 'none',
      type: 'line'
    },
    {
      symbolSize: 10,
      data: [
        [1, 1],
        [2, 4]
      ],
      color: 'blue',
      type: 'scatter'
    }
  ]
}

// 学习曲线
export const learnLineOptions: EChartsOption = {
  grid: {
    width: '50%',
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
    axisTick: 'false', // 隐藏 x 轴刻度
    min: 0,
    max: 6,
    interval: 1
  },
  yAxis: {
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
    axisTick: 'false', // 隐藏 x 轴刻度
    min: 0,
    max: 5,
    interval: 1
  },
  series: [
    {
      symbolSize: 15,
      data: [
        [0, 0],
        [1, 4],
        [2, 2],
        [3, 1]
      ],
      symbol: 'none',
      type: 'line'
    },
    {
      symbolSize: 10,
      data: [
        [1, 4],
        [2, 2],
        [3, 1]
      ],
      color: 'blue',
      type: 'scatter'
    }
  ]
}

// Q值函数
export const qvalueOptions: EChartsOption = {
  title: {
    text: 'Q值函数',
    left: 'center',
    bottom: 'bottom'
  },
  tooltip: {
    position: 'top'
  },
  grid: {
    left: '30%',
    height: '70%',
    width: '50%',
    bottom: '60px'
  },
  xAxis: {
    type: 'category',
    data: ['0', '1', '2', '3', '4', '5'],
    axisLine: {
      symbol: ['none', 'triangle']
    },
    axisTick: 'false'
  },
  yAxis: {
    type: 'category',
    data: ['右下', '右上', '左下', '左上', ''],
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
      name: '热力图',
      type: 'heatmap',
      data: [
        [0, 0, 1], // 横坐标0，纵坐标a（索引0），值为5
        [0, 1, 4], // 横坐标0，纵坐标b（索引1），值为1
        [0, 2, 9], // 横坐标0，纵坐标c（索引2），值为0
        [0, 3, 11] // 横坐标0，纵坐标d（索引3），值为2
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}
