<script setup lang="ts">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { nextTick, PropType, reactive, watch } from 'vue'
import { DepartmentUserItem } from '@/api/department/types'
import { useValidator } from '@/hooks/web/useValidator'
import { getDataSourceApi } from '@/api/lab'

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<DepartmentUserItem>,
    default: () => undefined
  },
  formSchema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  },
  account: {
    type: String,
    default: ''
  },
  addType: {
    type: String,
    default: 'add'
  }
})

const rules = reactive({
  containerName: [
    required(),
    {
      validator: (_rule, value, callback) => {
        const formData = getFormData()
        formData.then((data) => {
          ;(props as any).formSchema[5].hidden = false
          ;(props as any).formSchema[7].hidden = false
          ;(props as any).formSchema[6].hidden = false

          getDataSourceApi({ account: props.account, containerId: data.containerName }).then(
            (res) => {
              // console.log('666', (props as any).formSchema[6])

              ;(props as any).formSchema[6].componentProps.options = res.data.map((v) => {
                return {
                  label: v,
                  value: v
                }
              })
            }
          )
          callback()
        })
      },
      trigger: 'change'
    }
  ],
  expName: [
    required(),
    {
      validator: (_rule, value, callback) => {
        const formData = getFormData()

        formData.then((data) => {
          if (!data.containerName) {
            callback(new Error('请先选择容器名称'))
          } else {
            callback()
          }
        })
      },
      trigger: 'blur'
    }
  ],
  dataSource: [
    // required(),
    {
      validator: (_rule, value, callback) => {
        const formData = getFormData()
        formData.then((data) => {
          if (!data.containerName) {
            callback(new Error('请先选择容器名称'))
          }
          if (!data.dataSource && props.addType === 'add') {
            callback(new Error('该项为必填项'))
          } else {
            callback()
          }
        })
      },
      trigger: 'blur'
    }
  ]
})

const { formRegister, formMethods } = useForm()
const { setValues, setSchema, getFormData, getElFormExpose } = formMethods

const submit = async () => {
  const elForm = await getElFormExpose()
  console.log('submit', elForm)
  const valid = await elForm?.validate().catch(async (err) => {
    console.log('err', err)
  })
  if (valid) {
    console.log('formData')
    const formData = await getFormData()
    setTimeout(() => {
      ;(props as any).formSchema[7].hidden = true
      ;(props as any).formSchema[5].hidden = true
    }, 1000)
    // ;(props as any).formSchema[6].hidden = false
    if (props.addType === 'edit') {
      // ;(props as any).formSchema[5].hidden = true
      ;(props as any).formSchema[6].hidden = true
      // ;(props as any).formSchema[7].hidden = true
    }
    return formData
  }
}

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    setValues(currentRow)
  },
  {
    deep: true,
    immediate: true
  }
)
// 折叠函数
const fold = () => {
  ;(props as any).formSchema[5].hidden = true
  ;(props as any).formSchema[7].hidden = true
  ;(props as any).formSchema[6].hidden = true
}

const shiftDataSource = (v) => {
  ;(props as any).formSchema[2].hidden = v
  if (!v) {
    ;(props as any).formSchema[6].hidden = true
    console.log('props', props)
  }
  ;(props as any).formSchema[8].hidden = v
}

defineExpose({
  submit,
  fold,
  shiftDataSource
})
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
</template>
