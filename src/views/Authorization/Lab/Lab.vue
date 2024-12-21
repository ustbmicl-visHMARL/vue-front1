<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { ref, unref, reactive, watch, watchEffect, isProxy, isRef } from 'vue'
import { ElMessage, ElTree } from 'element-plus'
import type { DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { BaseButton } from '@/components/Button'
import { deleteLabByIdApi, labsApi, saveLabApi, updateLabApi } from '@/api/lab'
import { useRouter } from 'vue-router'
import { containersApi } from '@/api/containers'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res = await labsApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams),
      account: (userStore as any).getUserInfo.account
    })
    return {
      list: res.data.list || [],
      total: res.data.total || 0
    }
  },
  fetchDelApi: async () => {
    const res = await deleteLabByIdApi(unref(ids))
    return !!res
  }
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods
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
    field: 'userName',
    label: t('labDemo.username'),
    form: {
      componentProps: {
        disabled: true
      },
      hidden: true
    }
  },
  {
    field: 'imageName',
    label: t('labDemo.imageName'),
    form: {
      componentProps: {
        disabled: true
      },
      hidden: true
    }
  },
  {
    field: 'containerName',
    label: t('labDemo.containerName'),
    form: {
      component: 'Select',
      componentProps: {
        multiple: false,
        collapseTags: true,
        maxCollapseTags: 1,
        disabled: true,
        onselectionchange: (e: any) => {
          const val = e.target.parentElement.parentElement.querySelector('span').innerText
          console.log('val', val != '请选择', crudSchemas)
        }
      },
      optionApi: async () => {
        const res = await containersApi({
          account: (userStore.getUserInfo as any).account,
          pageIndex: 1,
          pageSize: 100000
        })
        return res.data.list.map((v) => ({
          label: v.name,
          value: v.id
        }))
      }
    }
  },
  {
    field: 'expName',
    label: t('labDemo.labname'),
    form: {
      hidden: true
    }
  },
  {
    field: 'dataSource',
    label: t('labDemo.dataSource'),
    table: {
      hidden: true
    },
    search: {
      hidden: true
    },
    form: {
      component: 'Select',
      hidden: true,
      componentProps: {
        disabled: false
      },
      optionApi: async () => {
        const res = ['aaa', 'bbb']
        return res.map((v, i) => ({
          label: v,
          value: i
        }))
      }
    }
  },
  {
    field: 'note',
    label: t('labDemo.expNote'),
    table: {
      hidden: true
    },
    search: {
      hidden: true
    },
    form: {
      hidden: true
    }
  },
  {
    field: 'status',
    label: t('labDemo.status'),
    formItemProps: {
      labelWidth: '500px'
    },
    form: {
      component: 'Select',
      hidden: true,
      componentProps: {
        multiple: false,
        collapseTags: true,
        maxCollapseTags: 1
      },
      optionApi: async () => {
        const res = ['未完成', '已完成']
        return res.map((v, i) => ({
          label: v,
          value: i
        }))
      }
    },
    detail: {
      slots: {
        default: (data: any) => {
          return <>{data.status ? t('labDemo.completed') : t('labDemo.pending')}</>
        }
      }
    },
    search: {
      component: 'Select',
      componentProps: {
        options: [
          { label: t('labDemo.completed'), value: 1 }, // 已完成
          { label: t('labDemo.pending'), value: 0 } // 未完成
        ],
        defaultValue: ''
      }
    },
    table: {
      width: 90,
      slots: {
        default: ({ row }: any) => {
          return row.status ? t('labDemo.completed') : t('labDemo.pending')
        }
      }
    }
  },
  {
    field: 'createTime',
    label: t('labDemo.createTime'),
    form: {
      component: 'Input',
      componentProps: {
        // readonly: true // 设置为只读模式
        // 或者使用 disabled: true 来完全禁用输入框
        // disabled: true
      },
      hidden: true
    },
    search: {
      hidden: true
    },
    table: {
      width: 170,
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
              <BaseButton type="primary" onClick={() => action(row, 'edit')}>
                {t('exampleDemo.edit')}
              </BaseButton>
              <BaseButton type="success" onClick={() => action(row, 'detail')}>
                {t('exampleDemo.detail')}
              </BaseButton>
              <BaseButton type="danger" onClick={() => delData(row)}>
                {t('exampleDemo.delOne')}
              </BaseButton>
              <BaseButton type="warning" onClick={() => toView(row)}>
                {t('exampleDemo.view')}
              </BaseButton>
            </>
          )
        }
      }
    }
  }
])

const searchParams = ref({})
const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  getList()
}
const treeEl = ref<typeof ElTree>()

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref<DepartmentUserItem>()
const actionType = ref('')

const addType = ref('add')
const AddAction = () => {
  dialogTitle.value = t('exampleDemo.regLab')
  crudSchemas.forEach((v) => {
    if (v.field === 'userName' || v.field === 'imageName' || v.field === 'containerName') {
      v.form!.componentProps!.disabled = false
    }
  })
  setTimeout(() => {
    unref(writeRef)?.shiftDataSource(true)
  })
  addType.value = 'add'
  currentRow.value = undefined
  dialogVisible.value = true
  actionType.value = ''
}
const { allSchemas } = useCrudSchemas(crudSchemas)
const writeKey = ref(0)

const delLoading = ref(false)
const ids = ref<string[]>([])

const delData = async (row?: DepartmentUserItem) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row
    ? [row.id]
    : elTableExpose?.getSelectionRows().map((v: DepartmentUserItem) => v.id) || []
  delLoading.value = true

  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}

const action = async (row: DepartmentUserItem, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  crudSchemas.forEach((v) => {
    if (v.field === 'userName' || v.field === 'imageName' || v.field === 'containerName') {
      v.form!.componentProps!.disabled = true
    }
  })
  addType.value = type === 'edit' ? 'edit' : 'add'
  setTimeout(() => {
    if (addType.value === 'edit') {
      unref(writeRef)?.shiftDataSource(false)
      console.log('cccc', crudSchemas)
    }
  })
  actionType.value = type
  currentRow.value = { ...row, department: unref(treeEl)?.getCurrentNode() || {} }
  dialogVisible.value = true
}

const router = useRouter()
const toView = (row: DepartmentUserItem) => {
  console.log(row, row.id)
  router.push({
    path: '/index/lab-charts',
    query: {
      expId: row.id
    }
  })
}
const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  console.log('save')
  const formData = await write?.submit()
  console.log('save2')

  if (formData) {
    saveLoading.value = true
    try {
      console.log(addType.value)
      if (addType.value === 'add') {
        // 移除res中的containerName字段
        formData.containerId = formData.containerName
        delete formData.containerName
        const res = await saveLabApi({
          ...formData,
          account: (userStore.getUserInfo as any).account
        })
        if (res) {
          // currentPage.value = 1
          getList()
          ElMessage.success('添加成功')
        }
      } else {
        const res = await updateLabApi({
          expName: formData.expName,
          status: formData.status,
          note: formData.note,
          id: formData.id
        })
        if (res) {
          // currentPage.value = 1
          getList()
          ElMessage.success('编辑成功')
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      saveLoading.value = false
      dialogVisible.value = false
    }
  }
}

const close = () => {
  const write = unref(writeRef)
  write?.fold()
  dialogVisible.value = false
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
        <BaseButton type="primary" @click="AddAction">{{ t('exampleDemo.regLab') }}</BaseButton>
        <BaseButton :loading="delLoading" type="danger" @click="delData()">
          {{ t('exampleDemo.del') }}
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
        :is-col="false"
        :form-schema="allSchemas.formSchema"
        :current-row="currentRow"
        :key="writeKey"
        :account="(userStore as any).getUserInfo.account"
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
        <BaseButton @click="close">{{ t('dialogDemo.close') }}</BaseButton>
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
