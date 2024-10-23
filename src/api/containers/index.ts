import request from '@/axios'
import type { LabParams, LabResponse } from './types'

export const labsApi = (params: LabParams) => {
  return request.get<LabResponse>({ url: '/localapi/lab/labs', params })
}

export const expsApi = (params: any) => {
  return request.get<LabResponse>({ url: '/localapi/exp/getexplist', params })
}

export const saveContainerApi = (data: any) => {
  return request.post({ url: '/localapi/container/create', data })
}

export const deleteContainerByIdApi = (id: string | number) => {
  return request.post({ url: '/localapi/container/delete', data: { id } })
}

export const startContainerApi = (id: string | number) => {
  return request.post({ url: '/localapi/container/start', data: { id } })
}

export const stopContainerApi = (id: string | number) => {
  return request.post({ url: '/localapi/container/stop', data: { id } })
}
