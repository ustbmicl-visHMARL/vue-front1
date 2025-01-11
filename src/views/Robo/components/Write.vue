<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  },
  addType: {
    type: String,
    default: () => null
  }
})

const formSchema = ref<FormSchema[]>([
  {
    field: 'ip',
    label: t('menu.ip'),
    component: 'Input',
    // 不可编辑
    componentProps: {
      disabled: false
    }
  },
  {
    field: 'status',
    label: t('menu.status'),
    component: 'Select',
    hidden: true,
    componentProps: {
      options: [
        {
          label: t('userDemo.disable'),
          value: 0
        },
        {
          label: t('userDemo.enable'),
          value: 1
        }
      ]
    }
  },
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    hidden: true
  }
])

const currentTreeData = ref()
const nodeClick = (treeData: any) => {
  currentTreeData.value = treeData
}

const rules = reactive({
  ip: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const treeData = ref([])

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    return formData
  }
}
const showElForm = () => {
  console.log('props.addType', props.addType)
  // 将formSchema.value
  formSchema.value.forEach((o) => {
    if (o.field == 'status') {
      console.log('ggg', props.addType == 'add')
      o.hidden = props.addType == 'add'
    }
    if (o.field == 'ip') {
      o.componentProps.disabled = props.addType != 'add'
    }
  })
  console.log(formSchema.value[0])
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

defineExpose({
  submit,
  showElForm
})
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
</template>
