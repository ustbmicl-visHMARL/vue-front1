import { defineStore } from 'pinia'
import { store } from '../index' // 引入你的 store 实例
import { useStorage } from '@/hooks/web/useStorage' // 引入自定义的存储 hook

const { getStorage, setStorage } = useStorage('localStorage') // 使用 localStorage 存储

interface LidaItem {
  filename: string
  time: string
  summary: Record<string, any>
  goalExploration: Record<string, any>
  visualizeData: Record<string, any>
  chatHistory: Record<string, any>
  explainData: Record<string, any>
  recommendData: Record<string, any>
  settings: Record<string, any>
  last_goal: Record<string, any>
  evaluateData: Record<string, any>
}

interface AccountData {
  account: string
  lida: LidaItem[]
}

interface NewAccountData {
  account: string
  lida: LidaItem
}

interface LidaState {
  data: AccountData[]
}

export const useLidaStore = defineStore('lida', {
  state: (): LidaState => {
    return {
      // 从本地存储中获取 data 字段，默认为空数组
      data: getStorage('lidaData') ? JSON.parse(getStorage('lidaData')) : []
    }
  },
  getters: {
    // 获取所有存储的 data
    getData(): AccountData[] {
      return this.data
    },
    // 根据账户名称获取数据
    getAccountData(): (account: string) => AccountData | undefined {
      return (account: string) => this.data.find((item) => item.account === account)
    }
  },
  actions: {
    // 更新整个 data 并保存到 localStorage
    setData(newData: AccountData[]) {
      this.data = newData
      setStorage('lidaData', JSON.stringify(newData))
    },
    // 添加或更新某个账户的数据
    updateAccountData(newAccountData: NewAccountData) {
      const existingIndex = this.data.findIndex((item) => item.account === newAccountData.account)
      if (existingIndex > -1) {
        // 以 filename 为 key 更新数据
        const existingLidaIndex = this.data[existingIndex].lida.findIndex(
          (lidaItem) => lidaItem.filename === newAccountData.lida.filename
        )
        if (existingLidaIndex > -1) {
          // 更新已有的 lida 数据
          this.data[existingIndex].lida[existingLidaIndex] = newAccountData.lida
        } else {
          // 如果不存在此 filename，则添加新的 lida 数据
          this.data[existingIndex].lida.push(newAccountData.lida)
          // 如果 lida 数组长度超过 5，则删除最早的 lida 数据
          if (this.data[existingIndex].lida.length > 5) {
            this.data[existingIndex].lida.shift()
          }
        }
      } else {
        // 如果 account 不存在，则添加新用户数据
        this.data.push({
          account: newAccountData.account,
          lida: [newAccountData.lida]
        })
      }
      // 同步到 localStorage
      console.log('save', this.data)
      setStorage('lidaData', JSON.stringify(this.data))
    },
    // 删除某个账户的数据
    deleteAccountData(account: string) {
      this.data = this.data.filter((item) => item.account !== account)
      setStorage('lidaData', JSON.stringify(this.data))
    }
  }
})

// 提供一个不依赖于 store 实例的获取方式
export const useLidaStoreWithOut = () => {
  return useLidaStore(store)
}
