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
