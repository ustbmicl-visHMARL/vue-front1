<script setup lang="ts">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { nextTick, PropType, reactive, watch } from 'vue'
import { DepartmentUserItem } from '@/api/department/types'
import { useValidator } from '@/hooks/web/useValidator'

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<DepartmentUserItem>,
    default: () => undefined
  },
  formSchema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
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
  ]
})

const { formRegister, formMethods } = useForm()
const { setValues, setSchema, getFormData, getElFormExpose } = formMethods

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    ;(props as any).formSchema[7].hidden = false
    ;(props as any).formSchema[5].hidden = false
    ;(props as any).formSchema[6].hidden = false
    const formData = await getFormData()
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
  if (!v) (props as any).formSchema[6].hidden = true
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
