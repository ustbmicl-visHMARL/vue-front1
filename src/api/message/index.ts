import request from '@/axios'

export const getMessageListApi = (params: any) => {
  return request.get({ url: '/localapi/message/list', params })
}
