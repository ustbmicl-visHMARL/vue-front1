import request from '@/axios'

export const robosApi = (params: any) => {
  return request.get({ url: '/localapi/robot/getRobotList', params })
}

export const registerRobosApi = (params: any) => {
  return request.post({ url: '/localapi/robot/registerRobot', data: params })
}

export const editRobosApi = (params: any) => {
  return request.post({ url: '/localapi/robot/update', data: params })
}

export const deleteRobosByIdApi = (ids: string[] | number[]) => {
  return request.post({ url: '/localapi/robot/del', data: ids })
}
