import * as echarts from 'echarts/core'

import {
  BarChart,
  LineChart,
  PieChart,
  MapChart,
  PictorialBarChart,
  RadarChart,
  ScatterChart,
  HeatmapChart
} from 'echarts/charts'
import { VisualMapComponent } from 'echarts/components'

import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PolarComponent,
  AriaComponent,
  ParallelComponent,
  LegendComponent
} from 'echarts/components'

import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PolarComponent,
  AriaComponent,
  ParallelComponent,
  BarChart,
  LineChart,
  PieChart,
  MapChart,
  CanvasRenderer,
  PictorialBarChart,
  RadarChart,
  ScatterChart,
  HeatmapChart,
  VisualMapComponent
])

export default echarts
