export interface LabParams {
  pageSize: number
  pageIndex: number
  account: string
  username?: string
  labname?: string
  labstatus?: string
}

export interface LabResponse {
  list: LabItem[]
  total: number
}

export interface LabItem {
  id: string
  username: string
  labname: string
  labstatus: string
  createTime: string
}
