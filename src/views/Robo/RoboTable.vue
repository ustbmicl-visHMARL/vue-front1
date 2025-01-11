<script setup lang="tsx">
import { nextTick, reactive, ref, unref } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ElMessage, ElTag } from 'element-plus'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import Write from './components/Write.vue'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'
import { robosApi, registerRobosApi, editRobosApi, deleteRobosByIdApi } from '@/api/robo'
import { useRouter } from 'vue-router'

const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const res = await robosApi({
      pageIndex: 1,
      pageSize: 10,
      ...unref(searchParams)
    })
    return {
      list: res.data.list || [],
      total: res.data.total
    }
  }
})

const { dataList, loading, total } = tableState
const { getList } = tableMethods

const router = useRouter()
const toView = (row) => {
  console.log(row, row.id)
  router.push({
    path: '/robo/view',
    query: {
      expId: row.id
    }
  })
}

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'index',
    label: t('userDemo.index'),
    type: 'index'
  },
  {
    field: 'ip',
    label: t('userDemo.ip')
  },
  {
    field: 'status',
    label: t('menu.status'),
    slots: {
      default: (data: any) => {
        return (
          <>
            <ElTag type={data.row.status === 0 ? 'danger' : 'success'}>
              {data.row.status === 1 ? t('userDemo.online') : t('userDemo.offline')}
            </ElTag>
          </>
        )
      }
    }
  },
  {
    field: 'feedbackFrequency',
    label: t('userDemo.feedbackFrequency')
  },
  {
    field: 'electricity',
    label: t('userDemo.electricity')
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    width: 320,
    slots: {
      default: (data: any) => {
        const row = data.row
        return (
          <>
            <BaseButton type="primary" onClick={() => edit(row)}>
              {t('exampleDemo.edit')}
            </BaseButton>
            <BaseButton type="success" onClick={() => toView(row)}>
              {t('exampleDemo.detail')}
            </BaseButton>
            <BaseButton type="danger" onClick={() => delData(row)}>
              {t('exampleDemo.delOne')}
            </BaseButton>
            {/* <BaseButton type="warning" onClick={() => toView(row)}>
              {t('exampleDemo.view')}
            </BaseButton> */}
          </>
        )
      }
    }
  }
])

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'status',
    label: t('robo.status'),
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '离线',
          value: 0
        },
        {
          label: '在线',
          value: 1
        }
      ]
    }
  }
])

const searchParams = ref({})
const setSearchParams = (data: any) => {
  searchParams.value = data
  console.log('searchParams', searchParams)
  getList()
}

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref()
const actionType = ref('add')

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const edit = async (row: any) => {
  dialogTitle.value = t('exampleDemo.edit')
  actionType.value = 'edit'
  currentRow.value = row
  dialogVisible.value = true
  await nextTick()
  const write = unref(writeRef)
  await write?.showElForm()
}

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  currentRow.value = undefined
  dialogVisible.value = true
  actionType.value = 'add'
}

const save = async () => {
  const write = unref(writeRef)
  console.log('write', write)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    let res
    if (actionType.value == 'edit') {
      res = await editRobosApi(formData)
    } else {
      res = await registerRobosApi(formData)
    }
    setTimeout(() => {
      if (res && res.code == 0) {
        ElMessage.success(res.msg)
      } else if (res) {
        ElMessage.error(res.msg)
      } else {
        ElMessage.error('未知错误，操作失败')
      }
      getList()
      saveLoading.value = false
      dialogVisible.value = false
    }, 100)
  }
}

const delLoading = ref(false)
const delData = async (row?) => {
  delLoading.value = true

  const elTableExpose = await tableMethods.getElTableExpose()
  const ids = row ? [row.id] : elTableExpose?.getSelectionRows().map((v) => v.id)
  const res = await deleteRobosByIdApi(ids)
  if (res.code == 0) {
    ElMessage.success('删除成功')
    getList()
  } else {
    ElMessage.error((res as any).msg)
  }

  delLoading.value = false
}
</script>

<template>
  <ContentWrap>
    <Search :schema="searchSchema" @reset="setSearchParams" @search="setSearchParams" />
    <div class="mb-10px">
      <BaseButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</BaseButton>
      <BaseButton :loading="delLoading" type="danger" @click="delData()">
        {{ t('exampleDemo.del') }}
      </BaseButton>
    </div>
    <Table
      :columns="tableColumns"
      default-expand-all
      node-key="id"
      :data="dataList"
      :loading="loading"
      :pagination="{
        total
      }"
      @register="tableRegister"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write
      v-if="actionType !== 'detail'"
      ref="writeRef"
      :actionType="actionType"
      :current-row="currentRow"
    />

    <template #footer>
      <BaseButton type="primary" :loading="saveLoading" @click="save">
        {{ t('exampleDemo.save') }}
      </BaseButton>
      <BaseButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</BaseButton>
    </template>
  </Dialog>
</template>
