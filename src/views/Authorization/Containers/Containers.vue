<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { ref, unref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
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
      account: (userStore.getUserInfo as any).account,
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
const { getList, delList, getElTableExpose } = tableMethods

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
      type: 'selection'
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
      type: 'index'
    }
  },
  {
    field: 'name',
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
        return res.data.list.map((v) => ({
          label: v.version,
          value: v.id
        }))
      }
    }
  },
  {
    field: 'portMappingList',
    form: {
      component: 'RedInput',
      label: t('labDemo.port')
    },
    table: {
      hidden: true
    },
    search: {
      hidden: true
    }
  },
  {
    field: 'userName',
    label: t('labDemo.username_'),
    form: {
      hidden: true
    }
  },
  {
    field: 'status',
    label: t('labDemo.containerStatus'),
    form: {
      hidden: true
    },
    search: {
      component: 'Select',
      componentProps: {
        options: [
          { label: t('labDemo.on'), value: 1 }, // 已完成
          { label: t('labDemo.off'), value: 0 } // 未完成
        ],
        defaultValue: ''
      }
    },
    table: {
      slots: {
        default: ({ row }: any) => {
          return row.status ? t('labDemo.on') : t('labDemo.off')
        }
      }
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
                {t('exampleDemo.delOne')}
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
  const elTableExpose = await getElTableExpose()
  console.log('delData', row)
  ids.value = row
    ? [row.id]
    : elTableExpose?.getSelectionRows().map((v: DepartmentUserItem) => v.id) || []
  delLoading.value = true
  delLoading.value = true
  await delList(1).finally(() => {
    delLoading.value = false
  })
}

const startContainer = async (row: any) => {
  console.log('startContainer', row)
  const res = await startContainerApi(row.id)
  if (res.code == 0) {
    getList()
    ElMessage.success('启动成功')
  } else {
    ElMessage.error('启动失败')
  }
}

const openContainer = async (row: any) => {
  console.log('openContainer', row)
  window.open(`http://115.25.41.98:${row.webIDEPort || 8848}`)
}

const stopContainer = async (row: any) => {
  console.log('stopContainer', row)
  const res = await stopContainerApi(row.id)
  if (res.code == 0) {
    getList()
    ElMessage.success('关闭成功')
  } else {
    ElMessage.error('关闭失败')
  }
}

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const save = async () => {
  console.log((userStore.getUserInfo as any).username, userStore, '@@')
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    const externalList = Array.from(document.querySelectorAll('.inputList .external input'))
    const internalList = Array.from(document.querySelectorAll('.inputList .internal input'))
    let portMappingList: any = []
    for (let i = 0; i < externalList.length; i++) {
      portMappingList.push({
        external: Number((externalList[i] as any).value) || null,
        internal: Number((internalList[i] as any).value) || null
      })
    }
    // 过滤出所有端口为null的对象
    portMappingList = portMappingList.filter(
      (item) => item.external !== null && item.internal !== null
    )

    portMappingList = Array.from(new Set(portMappingList.map(JSON.stringify as any))).map(
      JSON.parse as any
    )
    console.log('portMappingList', portMappingList)
    if (portMappingList.length === 0) {
      ElMessage.error('端口至少填写一个')
      saveLoading.value = false
      return
    }
    try {
      const realForm = {
        name: formData.containerName || '',
        userId: Number((userStore.getUserInfo as any).userId) || -1,
        imageId: formData.imageId || '',
        portMappingList: portMappingList,
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
        <BaseButton :loading="delLoading" type="danger" @click="delData()">
          {{ t('exampleDemo.del') }}
        </BaseButton>
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
