export interface LabParams {
  pageSize: number
  pageIndex: number
  id: string
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
