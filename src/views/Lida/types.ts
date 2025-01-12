// 用于表示字段属性的类型
export type FieldProperties = {
  dtype: 'string' | 'number' | 'date' | 'category'
  samples: (string | number | Date)[]
  num_unique_values: number
  semantic_type: string
  description: string
  std?: number // 因为不是所有字段属性都有std值，所以设置为可选
  min?: string | number // 同理，min设置为可选
  max?: string | number // max设置为可选
}

// 用于表示单个字段的类型，包含字段名称和对应的属性
export type Field = {
  column: string
  properties: FieldProperties
}

// 用于表示内部summary部分的类型结构
export type Summary = {
  name: string
  file_name: string
  dataset_description: string
  fields: Field[]
  field_names: string[]
}

// 用于表示整个summary对象的类型
export type SummaryData = {
  status: boolean
  summary: Summary
  data_filename: string
}

export type GoalExplorationData = {
  status: boolean
  data: {
    question: string
    visualization: string
    rationale: string
    index: string
  }[]
  message: string
}

export type Chart = {
  spec: null | any // 这里假设spec可能为null或者其他类型，可根据实际情况细化类型
  status: boolean
  raster: string
  code: string
  library: string
  error: null | any // 同理，error可能为null或其他类型，按需细化
}

export type VisualizeData = {
  status: boolean
  charts: Chart[]
  message: string
}

export type ExplainData = {
  status: boolean // 表示操作是否成功
  explanations: Explanation[] // 包含多个解释的数组
  message: string // 提示信息
}

// 定义 Explanation 类型
export type Explanation = {
  section: string // 说明部分的名称
  code: string // 相关的代码内容
  explanation: string // 对代码或部分的详细解释
}

// 定义 EvaluationData 类型
export type EvaluationData = {
  status: boolean // 表示操作是否成功
  evaluations: Evaluation[] // 包含多个评估项的数组
  message: string // 提示信息
}

// 定义 Evaluation 类型
export type Evaluation = {
  dimension: string // 评估的维度，例如 "bugs" 或 "transformation"
  score: number // 该维度的得分
  rationale: string // 对该维度评分的详细理由
}
