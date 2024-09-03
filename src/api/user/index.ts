import request from '@/axios'
import type { UserParams, UserResponse, UserType } from './types'

interface RoleParams {
  roleName: string
}

export const loginApi = (data: UserType): Promise<IResponse<UserType>> => {
  return request.post({ url: '/localapi/user/login', data })
}

export const usersApi = (params: UserParams) => {
  return request.get<UserResponse>({ url: '/localapi/user/users', params })
}

export const saveUserApi = (data: any) => {
  return request.post({ url: '/localapi/user/save', data })
}

export const deleteUserByIdApi = (ids: string[] | number[]) => {
  return request.post({ url: '/localapi/user/del', data: { ids } })
}

export const loginOutApi = (): Promise<IResponse> => {
  return request.get({ url: '/mock/user/loginOut' })
}

export const getAdminRoleApi = (
  params: RoleParams
): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.get({ url: '/mock/role/adminlist', params })
}

export const getTestRoleApi = (params: RoleParams): Promise<IResponse<string[]>> => {
  return request.get({ url: '/mock/role/testlist', params })
}
