export interface UserLoginType {
  username: string
  password: string
}

export interface UserType {
  username: string
  password: string
  role: string
  roleId: string
  admin: boolean
}

export interface UserParams {
  pageSize: number
  pageIndex: number
  id: string
  username?: string
  account?: string
}

export interface UserResponse {
  list: UserItem[]
  total: number
}

export interface UserItem {
  id: string
  username: string
  account: string
  email: string
  createTime: string
  role: string
  department: Item
}

export interface Item {
  id: string
  departmentName: string
  children?: Item[]
}
