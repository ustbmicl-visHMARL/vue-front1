import request from '@/axios'

export const getSwiperApi = (data: any) => {
  return request.post({ url: '/localapi/labcharts/getswiper', data })
}
