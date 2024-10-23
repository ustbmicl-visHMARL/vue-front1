<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { ref, unref, reactive } from 'vue'
import { ElMessage, ElTree } from 'element-plus'
import { usersApi } from '@/api/user'
import type { DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { BaseButton } from '@/components/Button'
import {
  saveContainerApi,
  deleteContainerByIdApi,
  startContainerApi,
  stopContainerApi,
  containersApi
} from '@/api/containers'
import { useUserStore } from '@/store/modules/user'
import { imagesApi } from '@/api/containers'

const userStore = useUserStore()

const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res = await containersApi({
      id: unref(currentNodeKey),
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams)
    })
    return {
      list: res.data.list || [],
      total: res.data.total || 0
    }
  },
  fetchDelApi: async () => {
    console.log('fetchDelApi')
    const res = await deleteContainerByIdApi(unref(ids))
    return !!res
  }
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, delList } = tableMethods

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'selection',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      type: 'selection',
      hidden: true
    }
  },
  {
    field: 'id',
    label: t('labDemo.index'),
    form: {
      hidden: true
    },
    search: {
      hidden: true
    },
    table: {
      width: 70,
      hidden: true
    }
  },
  {
    field: 'containerName',
    label: t('labDemo.containerName')
  },
  {
    field: 'imageId',
    label: t('labDemo.image'),
    table: {
      slots: {
        default: ({ row }: any) => {
          return row.imageVersion
        }
      }
    },
    form: {
      component: 'Select',
      componentProps: {
        multiple: false,
        collapseTags: true,
        maxCollapseTags: 1
      },
      optionApi: async () => {
        const res = await imagesApi({
          id: '',
          pageIndex: 1,
          pageSize: 100000
        })
        return res.data.map((v) => ({
          label: v.version,
          value: v.id
        }))
      }
    }
  },
  {
    field: 'portMappingList',
    form: {
      component: 'JsonEditor',
      label: t('labDemo.port'),
      value: Array.from({ length: 10 }, () =>
        Object.assign(
          {},
          {
            external: 0,
            internal: 0
          }
        )
      )
    },
    table: {
      hidden: true
    }
  },
  {
    field: 'labstatus',
    label: t('labDemo.status'),
    form: {
      component: 'Select',
      componentProps: {
        multiple: false,
        collapseTags: true,
        maxCollapseTags: 1
      },
      hidden: true,
      optionApi: async () => {
        const res = ['Pending', 'Completed']
        return res.map((v, i) => ({
          label: v,
          value: i
        }))
      }
    },
    search: {
      component: 'Select',
      componentProps: {
        options: [
          { label: t('labDemo.completed'), value: 'completed' }, // 已完成
          { label: t('labDemo.pending'), value: 'pending' } // 未完成
        ],
        defaultValue: ''
      }
    },
    table: {
      slots: {
        default: ({ row }: any) => {
          return row.labstatus ? t('labDemo.completed') : t('labDemo.pending')
        }
      }
    }
  },
  {
    field: 'createTime',
    label: t('labDemo.createTime'),
    form: {
      hidden: true
    },
    search: {
      hidden: true
    },
    table: {
      width: 180,
      slots: {
        default: ({ row }: any) => {
          const date = new Date(row.createTime)
          const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
          return formattedDate
        }
      }
    }
  },
  {
    field: 'action',
    label: t('labDemo.action'),
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    search: {
      hidden: true
    },
    table: {
      width: 340,
      slots: {
        default: (data: any) => {
          const row = data.row as DepartmentUserItem
          return (
            <>
              <BaseButton type="primary" onClick={() => startContainer(row)}>
                {t('exampleDemo.start')}
              </BaseButton>
              <BaseButton type="success" onClick={() => openContainer(row)}>
                {t('exampleDemo.open')}
              </BaseButton>
              <BaseButton type="info" onClick={() => stopContainer(row)}>
                {t('exampleDemo.close')}
              </BaseButton>
              <BaseButton type="danger" loading={delLoading.value} onClick={() => delData(row)}>
                {t('exampleDemo.del')}
              </BaseButton>
            </>
          )
        }
      }
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)
const searchParams = ref({})
const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  getList()
}

const treeEl = ref<typeof ElTree>()

const currentNodeKey = ref('')

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref<DepartmentUserItem>()
const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  currentRow.value = undefined
  dialogVisible.value = true
  actionType.value = ''
}

const toDocument = () => {
  window.open('https://www.yuque.com/xucheng-iq3fa/rltyby/nnneskleg2avp7i3?singleDoc#')
}

const delLoading = ref(false)
const ids = ref('')

const delData = async (row?: DepartmentUserItem) => {
  console.log('delData', row)
  ids.value = row!.id
  delLoading.value = true
  await delList(1).finally(() => {
    delLoading.value = false
  })
}

const startContainer = async (row: any) => {
  console.log('startContainer', row)
  startContainerApi(row.containerId)
}

const openContainer = async (row: any) => {
  console.log('openContainer', row)
  window.open(`http://115.25.41.98:${row.webIdePort || 8848}`)
}

const stopContainer = async (row: any) => {
  console.log('stopContainer', row)
  stopContainerApi(row.containerId)
}

const action = (row: DepartmentUserItem, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  currentRow.value = { ...row, department: unref(treeEl)?.getCurrentNode() || {} }
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const save = async () => {
  console.log((userStore.getUserInfo as any).username, userStore, '@@')
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    try {
      const realForm = {
        name: formData.containerName || '',
        userId: Number((userStore.getUserInfo as any).userId) || -1,
        imageId: formData.imageId || '',
        portMappingList: formData.portMappingList.filter(
          (item) => item.external !== 0 && item.internal !== 0
        ),
        extraConfig: ''
      }
      const res = await saveContainerApi(realForm)
      if (res) {
        // currentPage.value = 1
        getList()
        ElMessage.success('编辑成功')
      }
    } catch (error) {
      console.log(error)
    } finally {
      saveLoading.value = false
      dialogVisible.value = false
    }
  }
}
</script>

<template>
  <div class="flex w-100% h-100%">
    <ContentWrap class="flex-[3] ml-20px">
      <div class="search-f">
        <Search
          :schema="allSchemas.searchSchema"
          @reset="setSearchParams"
          @search="setSearchParams"
        />
      </div>

      <div class="mb-10px">
        <BaseButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</BaseButton>
        <BaseButton type="success" @click="toDocument()">
          {{ t('exampleDemo.document') }}
        </BaseButton>
      </div>
      <Table
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :columns="allSchemas.tableColumns"
        :data="dataList"
        :loading="loading"
        @register="tableRegister"
        :pagination="{
          total
        }"
      />
    </ContentWrap>

    <Dialog v-model="dialogVisible" :title="dialogTitle">
      <Write
        v-if="actionType !== 'detail'"
        ref="writeRef"
        :form-schema="allSchemas.formSchema"
        :current-row="currentRow"
      />

      <Detail
        v-if="actionType === 'detail'"
        :detail-schema="allSchemas.detailSchema"
        :current-row="currentRow"
      />

      <template #footer>
        <BaseButton
          v-if="actionType !== 'detail'"
          type="primary"
          :loading="saveLoading"
          @click="save"
        >
          {{ t('exampleDemo.save') }}
        </BaseButton>
        <BaseButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</BaseButton>
      </template>
    </Dialog>
  </div>
</template>

<style>
.search-f .el-form {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.search-f .el-form .el-form-item {
  margin-right: 10px;
}
.search-f .el-form .el-form-item:nth-child(3) {
  margin-right: 30px;
}
</style>
