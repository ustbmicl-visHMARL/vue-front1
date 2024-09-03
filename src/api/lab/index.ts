import request from '@/axios'
import type { LabParams, LabResponse } from './types'

export const labsApi = (params: LabParams) => {
  return request.get<LabResponse>({ url: '/localapi/lab/labs', params })
}

export const saveLabApi = (data: any) => {
  return request.post({ url: '/localapi/lab/save', data })
}

export const deleteLabByIdApi = (ids: string[] | number[]) => {
  return request.post({ url: '/localapi/lab/del', data: { ids } })
}
